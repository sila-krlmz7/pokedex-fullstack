import express from "express";
import cors from "cors";
import {config} from "./config.js";
import userRouter from "./routes/user.routes.js";
import "./db.js";
import catchRouter from "./routes/catch.routes.js"
import pokedexRouter from "./routes/pokedex.routes.js"

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/catch", catchRouter);
app.use("/api/pokedex", pokedexRouter);

app.listen(config.PORT, () => {
    console.log(`Server listening on ${config.PORT} PORT [${config.NODE_ENV}]`)
})
