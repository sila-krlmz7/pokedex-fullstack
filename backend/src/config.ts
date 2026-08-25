import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().int().min(1024).max(65535).default(8080),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DB_FILE: z.string().min(1).default("data.db"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Geçersiz ortam değişkenleri:");
    for (const issue of parsed.error.issues) {
        console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
}

export const config = parsed.data;