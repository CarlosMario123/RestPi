const express = require("express");
const routesCliente = express.Router();
const {
  obtenerClientes,
  obtenerCliente,
  agregarCliente,
  eliminarCliente,
  actualizarCliente,
} = require("../controllers/clienteControles");

routesCliente.get("/", obtenerClientes);

routesCliente.get("/:nombre", obtenerCliente);

routesCliente.post("/", agregarCliente);

routesCliente.delete("/:id", eliminarCliente);

routesCliente.put("/:id", actualizarCliente);

module.exports = routesCliente;
