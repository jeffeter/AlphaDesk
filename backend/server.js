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

app.post("/chamados", (req, res) => {
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

app.get("/chamados", (req, res) => {
    db.all("SELECT * FROM chamados", [], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.send(rows);
    });
});

app.put("/chamados/:id", (req, res) => {
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