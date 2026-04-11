const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// importar rotas
const authRoutes = require("./routes/auth");
const chamadosRoutes = require("./routes/chamados");

// usar rotas
app.use(authRoutes);
app.use("/chamados", chamadosRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});