const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
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
};

exports.login = (req, res) => {
    const { email, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send("Usuário não encontrado");

        const valid = await bcrypt.compare(senha, user.senha);
        if (!valid) return res.status(401).send("Senha inválida");

        const token = jwt.sign({ id: user.id }, SECRET);
        res.send({ token });
        }
    );
};