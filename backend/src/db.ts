import {DatabaseSync} from "node:sqlite";
import {config} from "./config.js"

export const db = new DatabaseSync(config.DB_FILE);
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`);
console.log(`Veritabanına bağlanıldı: ${config.DB_FILE}`)