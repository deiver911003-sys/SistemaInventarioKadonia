
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas del sistema
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/productos", require("./routes/productos.routes"));

// Comprobar conexión con MySQL
app.get("/api/salud", (req, res) => {
  db.query("SELECT DATABASE() AS base, 1 AS conectado", (err, results) => {
    if (err) {
      console.error("ERROR REAL DE MYSQL:", err.message);

      return res.status(500).json({
        servidor: "Activo",
        mysql: "Error de conexión",
        detalle: err.message
      });
    }

    res.json({
      servidor: "Activo",
      mysql: "Conectado",
      baseDatos: results[0].base
    });
  });
});

// Manejo de rutas inexistentes: siempre al final
app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method
  });
});

app.listen(PORT, () => {
  console.log(`Kadonia funcionando en http://localhost:${PORT}`);
});
