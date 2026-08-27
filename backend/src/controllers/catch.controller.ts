import type {Request, Response} from "express";
import {catchService} from "../services/catch.service.js";
import {userService} from "../services/user.service.js";

export async function catchPokemon(req: Request, res: Response) {
    const userId = Number(req.body.userId);
    const pokemonName = req.body.pokemonName;

    if (!userId || Number.isNaN(userId)) {
        return res.status(400).json({error: "userId zorunlu ve sayı olmalı"});
    }

    if (!pokemonName || typeof pokemonName!== "string") {
        return res.status(400).json({error: "pokemonName zorunlu ve string olmalı"});
    }

    if (!userService.findById(userId)) {
        return res.status(404).json({error: "Kullanıcı bulunamadı"});
    }

    try {
        const result = await catchService.catchPokemon(userId, pokemonName);
        res.status(201).json(result);
    } catch (err) {
        console.log(err);
        res.status(404).json({error: `Pokemon bulunamadı: ${pokemonName}`});
    }
}