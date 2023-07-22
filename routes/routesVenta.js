const express = require("express");
const {
  obtenerVentas,
  productoVendido,
  productoFecha,
  agregarVenta,
  eliminarVenta,
  actualizarVenta,
  mejorCliente
} = require("../controllers/ventaController");

const routesVenta = express.Router();

routesVenta.get("/", obtenerVentas);

routesVenta.get("/:month/:year", productoVendido);

routesVenta.get("/Productos/:year/:month", productoFecha);

routesVenta.get('/mejorCliente',mejorCliente)

routesVenta.post("/", agregarVenta);

routesVenta.delete("/:id", eliminarVenta);

routesVenta.put("/:id", actualizarVenta);

module.exports = routesVenta;
