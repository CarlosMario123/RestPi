const obtenerProductos = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query("SELECT * FROM Producto", (err, rows) => {
      if (err) return res.send(err);

      res.json(rows);
    });
  });
};

const obtenerProducto = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "SELECT Nombre,Kilos FROM Producto WHERE id_Producto  = ?",
      [req.params.id],
      (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
      }
    );
  });
};

const productoID = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "SELECT Cantidad_Disponible FROM Producto WHERE id_Producto  = ?",
      [req.params.id],
      (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
      }
    );
  });
};

const agregarProducto = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    const productoData = req.body;
    const nombreProducto = productoData.Nombre;
    const cantidadIntroducida = productoData.Cantidad_Disponible;
    const Producto_id = productoData.id_Producto;

    conn.query(
      "SELECT id_Producto, Cantidad_Disponible, Estado FROM Producto WHERE id_Producto = ? ",
      [Producto_id],
      (err, result) => {
        if (err) return res.send(err);
         console.log(result)
        if (result.length == 0) {
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
          let nuevoEstado = result[0].Estado;

          // Verificar si la nueva cantidad es mayor a 0 para cambiar el estado a "Activo"
          if (nuevaCantidad > 0) {
            nuevoEstado = "Activo";
          }

          conn.query(
            "UPDATE Producto SET Cantidad_Disponible = ?, Estado = ? WHERE id_Producto = ?",
            [nuevaCantidad, nuevoEstado, idProducto],
            (err, result) => {
              if (err) return res.send(err);

              res.json(result);
            }
          );
        }
      }
    );
  });
};

const eliminarProducto = (req, res) => {
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
};

const actualizarProducto = (req, res) => {
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
};

const productoNombre = (req, res) => {
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
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  productoID,
  agregarProducto,
  eliminarProducto,
  actualizarProducto,
  productoNombre
};
