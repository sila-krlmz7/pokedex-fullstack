import {DatabaseSync} from "node:sqlite";
import {config} from "./config.js"
import {readFileSync} from "node:fs";
import {join} from "node:path";

export const db = new DatabaseSync(config.DB_FILE);
db.exec(`PRAGMA foreign_keys = ON`);

const schemaPath = join(import.meta.dirname, "db", "schema.sql");
const schema = readFileSync(schemaPath, "utf8");
db.exec(schema);

console.log(`Veritabanına bağlanıldı: ${config.DB_FILE}`)