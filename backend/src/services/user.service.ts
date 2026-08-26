import type {User} from "../types/user.js"
import {db} from "../db.js"

export class UserService {
   
    findAll(): User [] {
        return db
            .prepare("SELECT id, name FROM users ORDER BY id")
            .all() as User [];
    }

    findById(id: number): User | undefined  {
        return db
            .prepare("SELECT id, name FROM users WHERE id = ?")
            .get(id) as User | undefined;
    }

    create(name: string): User {
        const result = db
            .prepare("INSERT INTO users (name) VALUES (?)")
            .run(name);
        return {id:Number(result.lastInsertRowid), name };
    }

    update(id: number, name: string): User | undefined {
        const result = db
            .prepare("UPDATE users SET name = ? WHERE id = ?")
            .run(name, id);
        if(result.changes === 0) {
            return undefined;
        }
        return {id, name};
    }

    remove(id: number): boolean {
        const result = db
            .prepare("DELETE FROM users WHERE id = ?")
            .run(id);
        return result.changes > 0;
    }
}
export const userService = new UserService();