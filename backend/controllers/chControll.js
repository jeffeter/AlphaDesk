const db = require("../database/db");

exports.criar = (req, res) => {
    const { titulo, descricao } = req.body;

    db.run(
        "INSERT INTO chamados (titulo, descricao, status, user_id) VALUES (?, ?, ?, ?)",
        [titulo, descricao, "aberto", req.user.id],
        function (err) {
        if (err) return res.status(500).send(err);
        res.send({ id: this.lastID });
        }
    );
};

exports.listar = (req, res) => {
    db.all(
        "SELECT * FROM chamados WHERE user_id = ?",
        [req.user.id],
        (err, rows) => {
        if (err) return res.status(500).send(err);
        res.send(rows);
        }
    );
};

exports.atualizar = (req, res) => {
    const { status } = req.body;

    db.run(
        "UPDATE chamados SET status = ? WHERE id = ? AND user_id = ?",
        [status, req.params.id, req.user.id],
        function (err) {
        if (err) return res.status(500).send(err);
        res.send({ updated: this.changes });
        }
    );
};