const express = require("express");
const router = express.Router();
const controller = require("../controllers/chControll");
const autenticar = require("../middleware/auth");

router.get("/", autenticar, controller.listar);
router.post("/", autenticar, controller.criar);
router.put("/:id", autenticar, controller.atualizar);

module.exports = router;