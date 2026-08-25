import express from "express";
import { config } from "./config.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);

app.listen(config.PORT, () => {
    console.log(`Server listening on ${config.PORT} PORT [${config.NODE_ENV}]`)
})
