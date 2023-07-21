const express = require("express");
const routesVenta = express.Router();

routesVenta.get("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query("SELECT * FROM Venta", (err, rows) => {
      if (err) return res.send(err);

      res.json(rows);
    });
  });
});

routesVenta.get("/:month/:year", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      `SELECT Producto.id_Producto, Producto.Nombre, SUM(Venta.Cantidad_Vendida) AS Total_Vendido
      FROM Venta
      JOIN Producto ON Venta.id_Producto = Producto.id_Producto
      WHERE YEAR(Venta.Fecha_entrega) = ${req.params.year} AND MONTH(Venta.Fecha_entrega) = ${req.params.month}
      GROUP BY Venta.id_Producto, Producto.Nombre
      ORDER BY Total_Vendido asc limit 1;`,
      (err, rows) => {
        if (err) return res.send(err);

        res.json(rows);
      }
    );
  });
});

routesVenta.get("/Productos/:year/:month", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      `SELECT id_Venta,id_Cliente,Venta.id_Producto,Cantidad_Vendida,Total_Vendido,Fecha_entrega, Producto.Nombre FROM Venta join Producto WHERE YEAR(Venta.Fecha_entrega)=${req.params.year} AND MONTH(Venta.Fecha_entrega)=${req.params.month} and Venta.id_Producto = Producto.id_Producto;`,
      (err, rows) => {
        if (err) return res.send(err);

        res.json(rows);
      }
    );
  });
});

routesVenta.post("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    const ventaData = req.body; // Datos de la venta proporcionados en el cuerpo de la solicitud
    const idProducto = ventaData.id_Producto; // ID_Producto vendido
    let Cantidad_Disponible = ventaData.Cantidad_Disponible; // Can disponible de la tabla venta

    // Verificar si el producto existe en la tabla Producto
    conn.query(
      "SELECT Nombre FROM Producto WHERE Nombre = ?",
      [idProducto],
      (err, result) => {
        if (err) return res.send(err);

        if (result.length === 0) {
          // El producto no existe en la tabla Producto
          return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Realizar la inserción en la tabla Venta
        conn.query("INSERT INTO Venta SET ?", [ventaData], (err, result) => {
          if (err) return res.send(err);

          // Actualizar la cantidad disponible en la tabla Producto
          conn.query(
            "UPDATE Producto SET Cantidad_Disponible = Cantidad_Disponible - ? WHERE Nombre = ?",
            [ventaData.Cantidad_Vendida, idProducto],
            (err, result) => {
              if (err) return res.send(err);

              conn.query(
                "SELECT Cantidad_Disponible FROM Producto",
                (err, rows) => {
                  if (err) return res.send(err);

                  if ((Cantidad_Disponible = 0)) {
                    conn.query(
                      "DELETE FROM Producto WHERE Cantidad_Disponible = 0",
                      (err, rows) => {
                        
                        if (err) return res.send(err);

                        res.json(rows);
                      }
                    );
                  }

                  res.json(rows);
                }
              );

              res.json(result);
            }
          );
        });
      }
    );
  });
});

routesVenta.delete("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "DELETE FROM Venta WHERE id_Venta = ?",
      [req.params.id],
      (err, rows) => {
        if (err) return res.send(err);

        res.json(rows);
      }
    );
  });
});

routesVenta.put("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "UPDATE Venta set ? WHERE id_Venta = ?",
      [req.body, req.params.id],
      (err, rows) => {
        if (err) return res.send(err);
      }
    );
  });
});

module.exports = routesVenta;
