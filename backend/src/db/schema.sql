-- ============================================================
-- Pokedex — SQLite şeması
-- ============================================================
-- Hedef: CLI pokedex'teki in-memory state'i (pokedex: Record<string, Pokemon>)
-- kalıcı bir veritabanına taşımak.
--
-- NOT: Bu dosyada AUTH YOK. Kullanıcı = sadece bir isim.
-- Şifre/token/session sonraki derste eklenecek. Nereye ekleneceğini
-- aşağıda "AUTH SONRA" yorumlarıyla işaretledim.
--
-- SQLite'ta foreign key'ler VARSAYILAN OLARAK KAPALIDIR.
-- Her bağlantıda açman gerekir, yoksa FOREIGN KEY yazsan da denetlenmez:
PRAGMA foreign_keys = ON;


-- ============================================================
-- 1) users — antrenörler
-- ============================================================
-- CLI'da tek bir kullanıcı vardı (sen). API'de birden fazla olabilir,
-- o yüzden yakalanan pokemonları bir kullanıcıya bağlıyoruz.
CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL UNIQUE,          -- aynı isimden iki kayıt olmasın
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))

    -- AUTH SONRA: email TEXT UNIQUE, password_hash TEXT, role TEXT
);


-- ============================================================
-- 2) pokemon — PokeAPI'den gelen pokemonların yerel kopyası
-- ============================================================
-- Bu tablo aslında kalıcı bir CACHE. CLI'daki Cache sınıfı 5 dakikalık TTL
-- ile RAM'de tutuyordu; sunucu yeniden başlayınca uçuyordu. Burada diske yazıyoruz.
--
-- DİKKAT: id AUTOINCREMENT DEĞİL. PokeAPI'nin kendi id'sini (bulbasaur = 1)
-- doğrudan primary key olarak kullanıyoruz. Buna "natural key" denir.
-- Avantajı: aynı pokemonu iki kez kaydetmen imkânsız hale gelir.
CREATE TABLE IF NOT EXISTS pokemon (
    id              INTEGER PRIMARY KEY,          -- PokeAPI id'si
    name            TEXT    NOT NULL UNIQUE,      -- "pikachu"
    base_experience INTEGER NOT NULL,             -- yakalama olasılığı hesabında kullanılıyor
    height          INTEGER NOT NULL,
    weight          INTEGER NOT NULL,
    fetched_at      TEXT    NOT NULL DEFAULT (datetime('now'))
                                                  -- veriyi ne zaman çektik? Eskiyince
                                                  -- PokeAPI'den tazelemek için.
);


-- ============================================================
-- 3) types — su, ateş, elektrik...
-- ============================================================
-- Neden ayrı tablo? Çünkü "electric" yazısını 50 pokemon satırında
-- tekrar tekrar saklamak yerine bir kez saklayıp id ile referans veriyoruz.
-- Buna NORMALİZASYON denir. Yazım hatası riski de biter ("electirc" yazamazsın).
CREATE TABLE IF NOT EXISTS types (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL UNIQUE
);


-- ============================================================
-- 4) pokemon_types — pokemon <-> type bağlantısı (junction table)
-- ============================================================
-- Bir pokemonun birden fazla tipi olabilir (charizard: fire + flying).
-- Bir tipe sahip birden fazla pokemon vardır.
-- Buna "many-to-many" ilişki denir ve SQL'de ARA TABLO ile çözülür.
--
-- PRIMARY KEY iki sütundan oluşuyor (composite key): aynı pokemona
-- aynı tipi iki kez ekleyemezsin.
CREATE TABLE IF NOT EXISTS pokemon_types (
    pokemon_id INTEGER NOT NULL,
    type_id    INTEGER NOT NULL,
    slot       INTEGER NOT NULL,                  -- 1 = birincil tip, 2 = ikincil

    PRIMARY KEY (pokemon_id, type_id),

    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id)    REFERENCES types(id)   ON DELETE CASCADE
    -- ON DELETE CASCADE: pokemon silinirse ona ait tip satırları da otomatik silinir.
    -- Olmasaydı ortada sahipsiz ("orphan") satırlar kalırdı.
);


-- ============================================================
-- 5) stats + pokemon_stats — hp, attack, defense...
-- ============================================================
-- Aynı many-to-many mantığı, ama ara tabloda ek bir DEĞER var: base_stat.
-- "Bu pokemonun bu statı kaç?" bilgisi ne pokemona ne stata ait —
-- ikisinin İLİŞKİSİNE ait. O yüzden ara tabloda duruyor.
CREATE TABLE IF NOT EXISTS stats (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL UNIQUE                  -- "hp", "attack", "special-defense"
);

CREATE TABLE IF NOT EXISTS pokemon_stats (
    pokemon_id INTEGER NOT NULL,
    stat_id    INTEGER NOT NULL,
    base_stat  INTEGER NOT NULL,

    PRIMARY KEY (pokemon_id, stat_id),

    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,
    FOREIGN KEY (stat_id)    REFERENCES stats(id)   ON DELETE CASCADE
);


-- ============================================================
-- 6) locations — location-area kayıtları
-- ============================================================
-- CLI'daki `map` / `mapb` komutlarının listelediği yerler.
CREATE TABLE IF NOT EXISTS locations (
    id         INTEGER PRIMARY KEY,               -- yine PokeAPI id'si
    name       TEXT    NOT NULL UNIQUE,           -- "canalave-city-area"
    fetched_at TEXT    NOT NULL DEFAULT (datetime('now'))
);


-- ============================================================
-- 7) location_pokemon — hangi bölgede hangi pokemon çıkar
-- ============================================================
-- CLI'daki `explore <location>` komutunun cevabı bu tablodan gelir.
CREATE TABLE IF NOT EXISTS location_pokemon (
    location_id INTEGER NOT NULL,
    pokemon_id  INTEGER NOT NULL,

    PRIMARY KEY (location_id, pokemon_id),

    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (pokemon_id)  REFERENCES pokemon(id)   ON DELETE CASCADE
);


-- ============================================================
-- 8) catches — ASIL TABLO: kim neyi yakaladı
-- ============================================================
-- CLI'da bu `state.pokedex` objesiydi. Uygulama kapanınca kayboluyordu.
--
-- Burada PRIMARY KEY'i (user_id, pokemon_id) YAPMADIM — bilinçli bir karar.
-- Çünkü aynı pokemonu birden fazla kez yakalayabilmelisin (3 tane pidgey).
-- Her yakalama ayrı bir satır, kendi id'si ve kendi nickname'i var.
--
-- Eğer "her pokemon en fazla bir kez" istersen: id sütununu sil,
-- PRIMARY KEY (user_id, pokemon_id) yap.
CREATE TABLE IF NOT EXISTS catches (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    pokemon_id INTEGER NOT NULL,
    nickname   TEXT,                              -- NULL olabilir: takma ad zorunlu değil
    caught_at  TEXT    NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id)    REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE
);


-- ============================================================
-- INDEX'LER
-- ============================================================
-- Index = kitabın arkasındaki dizin. Onsuz veritabanı tabloyu
-- baştan sona tarar (full scan). Kural: sık sık WHERE ile
-- filtrelediğin FOREIGN KEY sütunlarına index at.
--
-- PRIMARY KEY ve UNIQUE sütunlara SQLite zaten otomatik index kurar,
-- o yüzden onlar için tekrar yazmaya gerek yok.

-- "Bu kullanıcının pokedex'ini getir" sorgusu için:
CREATE INDEX IF NOT EXISTS idx_catches_user       ON catches(user_id);
-- "Bu pokemonu kaç kişi yakalamış" için:
CREATE INDEX IF NOT EXISTS idx_catches_pokemon    ON catches(pokemon_id);
-- Junction tablolarda ters yönde arama için (PK soldaki sütunu zaten kapsıyor):
CREATE INDEX IF NOT EXISTS idx_ptypes_type        ON pokemon_types(type_id);
CREATE INDEX IF NOT EXISTS idx_pstats_stat        ON pokemon_stats(stat_id);
CREATE INDEX IF NOT EXISTS idx_locpoke_pokemon    ON location_pokemon(pokemon_id);
