import { unsubscribe } from "diagnostics_channel";
import express from "express";

const app = express();
const PORT = 8080;

app.use(express.json());

type User = {
    id: number;
    name: string;
}

const users: User[] = [];
let nextId = 1;

// get
app.get("/", (req, res) => {
    // console.log("Hello World"); olmaz
    res.send("Hello World");
})

app.get("/api/hello", (req, res) => {
    res.json({message: "Hello World"})
} )

app.get("/api/hello/:name", (req, res) => {
    const name = req.params.name;
    res.json({message: `Hello ${name}`})
})

app.get("/api/users", (req, res) => {
    res.json(users)
})

// post
app.post("/api/users", (req, res)=> {
    const name = req.body.name

    if(!name || typeof name !== "string") {
        return res.status(400).json({error: "name zorunlu ve string olmalı"})
    }

    const user: User = {id: nextId++, name}
    users.push(user)

    res.status(201).json(user)
})


app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if(!user) {
        return res.status(404).json({error: "kullancı bulunamadı"})
    }

    res.json(user)
})


app.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const name = req.body.name;

    if(!name || typeof name !== "string") {
        return res.status(400).json({error: "name zorunlu ve string olmalı"})
    }
    
    const user = users.find(u => u.id === id)

    if(!user) {
        return res.status(404).json({error: "kullancı bulunamadı"})
    }

    user.name = name
    res.json(user)
})


app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {                     
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    users.splice(index, 1);
    res.sendStatus(204);
  });


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT} PORT`)
})