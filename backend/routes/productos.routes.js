
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM productos LIMIT 5", (err, resultados) => {
    if (err) {
      console.error("Error consultando productos:", err);

      return res.status(500).json({
        mensaje: "Error al consultar los productos",
        codigo: err.code,
        detalle: err.message
      });
    }

    res.json(resultados);
  });
});
// POST: Guardar un producto nuevo en MySQL
router.post("/", (req, res) => {
  const {
    codigo,
    referencia,
    nombre,
    id_categoria,
    talla,
    color,
    precio_compra,
    precio_venta,
    cantidad,
    stock_minimo
  } = req.body;

  // Validar campos obligatorios
  if (
    !codigo ||
    !referencia ||
    !nombre ||
    id_categoria === undefined ||
    id_categoria === null ||
    !talla ||
    !color ||
    precio_compra === undefined ||
    precio_venta === undefined ||
    cantidad === undefined
  ) {
    return res.status(400).json({
      mensaje: "Completa todos los campos obligatorios."
    });
  }

  const categoria = Number(id_categoria);
  const compra = Number(precio_compra);
  const venta = Number(precio_venta);
  const unidades = Number(cantidad);
  const minimo = stock_minimo === undefined || stock_minimo === ""
    ? 5
    : Number(stock_minimo);

  if (
    !Number.isInteger(categoria) ||
    categoria <= 0 ||
    !Number.isFinite(compra) ||
    compra < 0 ||
    !Number.isFinite(venta) ||
    venta < 0 ||
    !Number.isInteger(unidades) ||
    unidades < 0 ||
    !Number.isInteger(minimo) ||
    minimo < 0
  ) {
    return res.status(400).json({
      mensaje: "Revisa la categoría, los precios y las cantidades."
    });
  }

  const sql = `
    INSERT INTO productos (
      codigo,
      referencia,
      nombre,
      id_categoria,
      talla,
      color,
      precio_compra,
      precio_venta,
      cantidad,
      stock_minimo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    codigo.trim(),
    referencia.trim(),
    nombre.trim(),
    categoria,
    String(talla).trim(),
    color.trim(),
    compra,
    venta,
    unidades,
    minimo
  ];

  db.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error("Error al guardar producto:", err.message);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          mensaje: "El código del producto o la referencia ya existen."
        });
      }

      if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
          mensaje: "La categoría seleccionada no existe."
        });
      }

      return res.status(500).json({
        mensaje: "No se pudo guardar el producto."
      });
    }

    return res.status(201).json({
      mensaje: "Producto guardado correctamente.",
      id_producto: resultado.insertId
    });
  });
});
// Aquí termina la nueva ruta POST
module.exports = router;