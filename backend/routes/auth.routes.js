
const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      mensaje: "Debes ingresar el usuario y la contraseña"
    });
  }

  const sql = `
    SELECT id_usuario, nombre, usuario, password, rol, estado
    FROM usuarios
    WHERE usuario = ?
    LIMIT 1
  `;

  db.query(sql, [usuario], async (err, resultados) => {
    if (err) {
      console.error("Error consultando usuarios:", err.message);
      return res.status(500).json({
        mensaje: "Error al consultar la base de datos"
      });
    }

    if (resultados.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      });
    }

    const user = resultados[0];

    if (user.estado === 0 || user.estado === false) {
      return res.status(403).json({
        mensaje: "El usuario está desactivado"
      });
    }

    let passwordCorrecta = false;

    try {
      // Contraseñas guardadas con bcrypt
      if (
        typeof user.password === "string" &&
        user.password.startsWith("$2")
      ) {
        passwordCorrecta = await bcrypt.compare(
          password,
          user.password
        );
      } else {
        // No se permite iniciar sesión con contraseñas sin hash.
        return res.status(500).json({
          mensaje: "La contraseña de este usuario debe actualizarse de forma segura"
        });
      }
    } catch (error) {
      console.error("Error verificando contraseña:", error.message);
      return res.status(500).json({
        mensaje: "No se pudo verificar la contraseña"
      });
    }

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Usuario o contraseña incorrectos"
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        mensaje: "Falta configurar JWT_SECRET en el archivo .env"
      });
    }

    const token = jwt.sign(
      {
        id: user.id_usuario,
        usuario: user.usuario,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: user.id_usuario,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.rol
      }
    });
  });
});

module.exports = router;
