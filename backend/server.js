const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./database.db");

db.run(`
    CREATE TABLE IF NOT EXISTS chamados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    descricao TEXT,
    status TEXT
    )
    `);

app.post("/chamados", autenticar, (req, res) => {
    const { titulo, descricao } = req.body;

    db.run(
        "INSERT INTO chamados (titulo, descricao, status) VALUES (?, ?, ?)",
        [titulo, descricao, "aberto"],
        function(err) {
            if (err) return res.status(500).send(err);
            res.send({ id: this.lastID });
        }
    );
});

app.get("/chamados", autenticar, (req, res) => {
    db.all("SELECT * FROM chamados", [], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.send(rows);
    });
});

app.put("/chamados/:id", autenticar, (req, res) => {
    const { status } = req.body;

    db.run(
        "UPDATE chamados SET status = ? WHERE id = ?",
        [status, req.params.id],
        function (err) {
            if (err) return res.status(500).send(err);
            res.send({ updated: this.changes });
        }
    );
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});


db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    senha TEXT
    )
`);


const bcrypt = require("bcrypt");

app.post("/register", async (req, res) => {
    const { email, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    db.run(
        "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
        [email, hash],
        function (err) {
            if (err) return res.status(500).send("Erro ao cadastrar");
            res.send("Usuário criado");
        }
    );
});


const jwt = require("jsonwebtoken");

const SECRET = "segredo_super";

app.post("/login", (req, res) => {
    const {email, senha} = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (err, user) => {

            if(err) return res.status(500).send(err);
            
            if (!user) return res.status(404).send("usuário não encontrado");

            const valid = await bcrypt.compare(senha, user.senha);
            if (!valid) return res.status(401).send("senha inválida");

            const token = jwt.sign({ id: user.id }, SECRET);
            res.send({ token });
        }
    );
});


function autenticar(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).send("Sem token");

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).send("Token inválido");
    }
}

