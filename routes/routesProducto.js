const express = require("express");
const routesProducto = express.Router();

routesProducto.get("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query("SELECT * FROM Producto", (err, rows) => {
      if (err) return res.send(err);

      res.json(rows);
    });
  });
});

routesProducto.get("/:nombre", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "SELECT Nombre,Cantidad_Disponible FROM Producto WHERE Nombre = ?",
      [req.params.nombre],
      (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
      }
    );
  });
});

routesProducto.post("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    const productoData = req.body;
    const nombreProducto = productoData.Nombre;
    const cantidadIntroducida = productoData.Cantidad_Disponible;

    conn.query(
      "SELECT id_Producto, Cantidad_Disponible FROM Producto WHERE Nombre = ?",
      [nombreProducto],
      (err, result) => {
        if (err) return res.send(err);

        if (result.length === 0) {
          // El producto no existe en la tabla Producto, se realiza la inserción
          conn.query(
            "INSERT INTO Producto SET ?",
            [productoData],
            (err, result) => {
              if (err) return res.send(err);

              res.json(result);
            }
          );
        } else {
          // El producto existe, se realiza la actualización de la cantidad disponible
          const idProducto = result[0].id_Producto;
          const cantidadActual = result[0].Cantidad_Disponible;
          const nuevaCantidad = cantidadActual + cantidadIntroducida;

          conn.query(
            "UPDATE Producto SET Cantidad_Disponible = ? WHERE id_Producto = ?",
            [nuevaCantidad, idProducto],
            (err, result) => {
              if (err) return res.send(err);

              res.json(result);
            }
          );
        }
      }
    );
  });
});



routesProducto.delete("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "DELETE FROM Producto WHERE id_Producto = ?",
      [req.params.id],
      (err, rows) => {
        if (err) return res.send(err);

        res.json(rows);
      }
    );
  });
});

routesProducto.put("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "UPDATE Producto set ? WHERE id_Producto = ?",
      [req.body, req.params.id],
      (err, rows) => {
        if (err) return res.send(err);
      }
    );
  });
});

module.exports = routesProducto;