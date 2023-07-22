const obtenerClientes = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query("SELECT * FROM Cliente", (err, rows) => {
      if (err) return res.send(err);

      res.json(rows);
    });
  });
};

const obtenerCliente = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      "SELECT id_Cliente,Nombre,Nombre_Tienda FROM Cliente WHERE Nombre = ?",
      [req.params.nombre],
      (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
      }
    );
  });
}

const infoCliente = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query(
      "SELECT Nombre,Nombre_Tienda FROM Cliente WHERE id_Cliente = ?",
      [req.params.id],
      (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
      }
    );
  });
}

const agregarCliente = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query("INSERT INTO Cliente set ?", [req.body], (err, rows) => {
      if (err) return res.send(err);
    });
  });
};

const eliminarCliente = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "DELETE FROM Cliente WHERE id_Cliente = ?",
      [req.params.id],
      (err, rows) => {
        if (err) return res.send(err);

        res.json(rows);
      }
    );
  });
};

const actualizarCliente = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "UPDATE Cliente set ? WHERE id_Cliente = ?",
      [req.body, req.params.id],
      (err, rows) => {
        if (err) return res.send(err);
      }
    );
  });
};

module.exports = {
  obtenerClientes,
  obtenerCliente,
  agregarCliente,
  eliminarCliente,
  actualizarCliente,
  infoCliente
};
