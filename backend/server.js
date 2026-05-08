require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const authRoutes = require("./routes/auth");
const chamadosRoutes = require("./routes/chamados");

app.use("/auth", authRoutes);
app.use("/chamados", chamadosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});