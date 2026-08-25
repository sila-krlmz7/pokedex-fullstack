# pokedex-fullstack

Sıla'nın Express.js öğrenme projesi. Bu dosya, yeni bir sohbet açıldığında Claude'un
Sıla'nın seviyesini ve kurs planını baştan bilmesi için var.

## Bağlam

Sıla, boot.dev tarzı bir kursta `~/Desktop/pokedex` altında **TypeScript ile CLI Pokedex**
projesini bitirdi (REPL + PokeAPI + cache). Şimdi aynı fikri **Express.js backend**'e
taşıyarak Express öğreniyor. Bu repo o iş için.

İletişim dili: **Türkçe**.

## Sıla'nın halihazırda bildikleri (CLI pokedex'te fiilen yazdıkları)

Bunları TEKRAR ANLATMA, biliyor kabul et:

- **TypeScript**: `type` alias, union (`string | null`), `Record<string, T>`, generics
  (`CacheEntry<T>`, `add<T>(key, val)`), `class`, private field (`#cache`),
  `static readonly`, rest params (`...args: string[]`), `import type`, opsiyonel param
- **ESM**: `"type": "module"`, import'larda `.js` uzantısı, `tsc` ile build
- **Async**: `async/await`, `Promise<void>`, `fetch` + `response.json()`, try/catch/finally
- **Node**: `readline` (`createInterface`, `rl.on("line")`, `rl.prompt()`), `process.stdin`,
  `setInterval`/`clearInterval`, `NodeJS.Timeout`
- **Test**: vitest (`vitest --run`), `.test.ts` dosyaları
- **Mimari desenler**: command registry (`Record<string, CLICommand>`), tek bir `State`
  objesini fonksiyonlara geçirmek, TTL'li cache (reap loop ile)
- **Git/GitHub**: commit atma, `gh` CLI kurulu ve `sila-krlmz7` olarak authenticate

## Bilmedikleri / bu kursta öğrenecekleri

- HTTP'nin kendisi: request/response döngüsü, status kodları, header'lar, JSON body
- Express: routing, `req`/`res`, route params, query string, `express.json()`
- Middleware kavramı ve zinciri, `next()`
- Merkezi hata yönetimi (4 argümanlı error middleware)
- `@types/express` ile tipleme
- Veritabanı deneyimi yok (şimdilik in-memory yeterli)
- Ortam değişkeni / config yönetimi yok

## Kurs planı — Sadece Express backend, ~1.5 saat

Kapsam kararı: **frontend YOK.** Sadece REST API, curl/Postman ile test.

| Ders | Konu | Süre |
|------|------|------|
| 1 | Express kurulumu, ilk server, routing (`GET /api/locations`, `GET /api/pokemon/:name`) | ~30 dk |
| 2 | Middleware zinciri, `express.json()`, logger middleware, merkezi hata yönetimi | ~30 dk |
| 3 | PokeAPI + Cache katmanını CLI projesinden taşıma, `POST /api/catch`, `GET /api/pokedex` | ~30 dk |

Her ders sonunda bir commit. Commit mesajı formatı CLI projesindeki gibi: `L1: ...`, `L2: ...`

## Öğretme yöntemi

Boot.dev tarzı: **konuyu kısaca anlat → görev ver → Sıla yazsın → incele ve düzelt.**
Kodun tamamını baştan yazıp vermek yerine iskeleti bırakıp doldurtmak tercih edilir.
Sıla zaten TS biliyor, sözdizimi anlatımına vakit harcama; Express'e özgü kavramlara odaklan.

## Teknik tercihler

- TypeScript + ESM (CLI projesiyle aynı kurulum)
- `tsc` ile build, `node dist/...` ile çalıştır
- Test gerekirse vitest
