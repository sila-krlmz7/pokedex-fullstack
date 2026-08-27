import type {Request, Response} from "express";
import {pokedexService} from "../services/pokedex.service.js";
import {userService} from "../services/user.service.js";

export function getPokedex(req: Request, res: Response) {
    const userId = Number(req.params.userId);

    if (!userId || Number.isNaN(userId)) {
        return res.status(400).json({ error: "Geçersiz userId" });
    }

    if (!userService.findById(userId)) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const pokedex = pokedexService.findByUser(userId);
    res.json(pokedex);
}
