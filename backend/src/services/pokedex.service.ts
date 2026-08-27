import {db} from "../db.js";

export type CaughtPokemon = {
    catchId: number;
    pokemonId: number;
    name: string;
    caughtAt: string;
};

export class PokedexService {

    findByUser(userId: number): CaughtPokemon[] {
        return db.prepare(
            `SELECT c.id        AS catchId,
                    p.id        AS pokemonId,
                    p.name      AS name,
                    c.caught_at AS caughtAt
             FROM catches c
             JOIN pokemon p ON p.id = c.pokemon_id
             WHERE c.user_id = ?
             ORDER BY c.caught_at DESC`
        ).all(userId) as CaughtPokemon[];
    }
}

export const pokedexService = new PokedexService();
