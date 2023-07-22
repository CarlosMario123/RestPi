const express = require("express");
const cors = require("cors");
const myconn = require("express-myconnection");
const routesVenta = require("../routes/routesVenta");
const routesCliente = require("../routes/routesCliente");
const routesProducto = require("../routes/routesProducto");
const createConnection = require("../dataBase/dbConfig");

class Server {
  constructor() {
    this.server = express();
    this.Middlewares();
    this.Routes();
  }

  Middlewares() {
    this.server.use(myconn(createConnection, "single"));
    this.server.use(express.json());
    this.server.use(cors());
  }

  Routes() {
    this.server.get("/", (req, res) => {
      res.send("Bienvenido a la api");
    });

    this.server.use("/Cliente", routesCliente);
    this.server.use("/Producto", routesProducto);
    this.server.use("/Venta", routesVenta);
  }

  startServer(port) {
    this.server.set("port", port || 9000);
    this.server.listen(this.server.get("port"), () => {
      console.log("server corriendo en el puerto", this.server.get("port"));
    });
  }
}

module.exports = Server;
