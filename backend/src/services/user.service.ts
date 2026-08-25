import type {User} from "../types/user.js"

export class UserService {
    #users: User[] = []
    #nextId: number = 1;


    findAll(): User [] {
        return this.#users;
    }
    findById(id: number): User | undefined  {
        return this.#users.find(u => u.id === id)
    }

    create(name: string): User {
        const newUser: User = {id: this.#nextId++, name}
        this.#users.push(newUser)
        return newUser;
    }

    update(id: number, name: string): User | undefined {
        const user = this.findById(id);
        if(!user) {
            return undefined;
        }
        user.name = name;
        return user;
    }

    remove(id: number): boolean {
        const index = this.#users.findIndex(u => u.id === id);
        if (index === -1){
            return false;
        }
        this.#users.splice(index,1)
        return true;
    }
}
export const userService = new UserService();