import type {Pokemon, CatchResult} from "../types/pokemon.js"
import {db} from "../db.js";

type PokemonRow = {id: number; name: string; base_experience: number};

export class CatchService {

    async #ensurePokemon(name: string): Promise<PokemonRow> {
        const existing = db
            .prepare("SELECT id, name, base_experience FROM pokemon WHERE name = ?")
            .get(name) as PokemonRow | undefined;

        if (existing) {
            return existing;
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) {
            throw new Error(`Pokemon bulunamadı: ${name}`);
        }
        const data = (await response.json()) as Pokemon;

        db.prepare(
            `INSERT OR IGNORE INTO pokemon (id, name, base_experience, height, weight)
             VALUES (?, ?, ?, ?, ?)`
        ).run(data.id, data.name, data.base_experience, data.height, data.weight);

        return {
            id: data.id,
            name: data.name,
            base_experience: data.base_experience,
        };
    }

    async catchPokemon(userId: number, pokemonName: string): Promise<CatchResult> {
        const pokemon = await this.#ensurePokemon(pokemonName);

        const catchThreshold = Math.min(pokemon.base_experience / 300, 0.9);
        const caught = Math.random() > catchThreshold;

        if (caught) {
            db.prepare("INSERT INTO catches (user_id, pokemon_id) VALUES (?, ?)")
              .run(userId, pokemon.id);
        }

        return {
            caught,
            pokemon: { id: pokemon.id, name: pokemon.name },
        };
    }
}

export const catchService = new CatchService();
