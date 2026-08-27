import express from "express";
import {catchPokemon} from "../controllers/catch.controller.js";

const router = express.Router();
router.post("/", catchPokemon);

export default router