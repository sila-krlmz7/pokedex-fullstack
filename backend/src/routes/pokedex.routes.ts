import express from "express";
import {getPokedex} from "../controllers/pokedex.controller.js";

const router = express.Router();
router.get("/:userId", getPokedex);

export default router