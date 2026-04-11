const jwt = require("jsonwebtoken");

const SECRET = "segredo_super";

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

module.exports = autenticar;