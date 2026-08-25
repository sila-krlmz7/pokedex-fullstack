import type {Request, Response} from "express";
import {userService} from "../services/user.service.js";

export function getAllUsers(req: Request, res: Response) {
  const users = userService.findAll();
  res.json(users)
}

export function getUserById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = userService.findById(id);
  if(!user) {
        return res.status(404).json({error: "Kullanıcı bulunamadı"})
  }
  res.json(user)
}

export function createUser(req: Request, res: Response) {
  const name = req.body.name
  if(!name || typeof name !== "string") {
    return res.status(400).json({error: "name zorunlu ve string olmalı"})
  }

  const user = userService.create(name);
  res.status(201).json(user)
}

export function updateUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const name = req.body.name;

  if(!name || typeof name !== "string") {
    return res.status(400).json({error: "name zorunlu ve string olmalı"})
  }

  const user = userService.update(id, name);

  if(!user) {
    return res.status(404).json({error: "Kullanıcı bulunamadı"})
  }
  res.json(user)
}

export function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const deleted = userService.remove(id)
  if (!deleted) {                     
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  }
  res.sendStatus(204);
}