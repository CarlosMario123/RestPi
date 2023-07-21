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

routesVenta.post("/", async (req, res) => {
  try {
    const conn = await req.getConnection();

    const ventaData = req.body;
    const idProducto = ventaData.id_Producto;

    const result = await conn.query(
      "SELECT id_Producto, Cantidad_Disponible FROM Producto WHERE id_Producto = ?",
      [idProducto]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const cantidadVendida = ventaData.Cantidad_Vendida;
    const cantidadDisponible = result[0].Cantidad_Disponible;

    if (cantidadDisponible < cantidadVendida) {
      return res.status(400).json({ error: "No hay suficiente cantidad disponible para vender" });
    }

    const nuevaCantidadDisponible = cantidadDisponible - cantidadVendida;

    await conn.beginTransaction();

    try {
      await conn.query("UPDATE Producto SET Cantidad_Disponible = ? WHERE id_Producto = ?", [
        nuevaCantidadDisponible,
        idProducto,
      ]);

      await conn.query("INSERT INTO Venta SET ?", [ventaData]);

      if (nuevaCantidadDisponible <= 0) {
        await conn.query("DELETE FROM Producto WHERE id_Producto = ?", [idProducto]);
      }

      await conn.commit();
      res.json({ message: "Venta realizada y producto eliminado si Cantidad_Disponible <= 0" });
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  } catch (err) {
    res.send(err);
  }
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
