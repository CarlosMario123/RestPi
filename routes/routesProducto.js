const express = require("express");
const { obtenerProductos, obtenerProducto, productoID, agregarProducto, eliminarProducto, actualizarProducto, productoNombre } = require("../controllers/productoController");
const routesProducto = express.Router();

routesProducto.get("/", obtenerProductos);

routesProducto.get("/name/:id", obtenerProducto);


routesProducto.get("/:nombre", productoNombre);


routesProducto.get("/id/:id", productoID);

routesProducto.post("/", agregarProducto);


routesProducto.delete("/:id", eliminarProducto);

routesProducto.put("/:id", actualizarProducto);

module.exports = routesProducto;