
require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jeans_kadonia",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error al conectar con MySQL:", err.message);
    return;
  }

  console.log("Base de datos de Kadonia conectada correctamente");
  connection.release();
});

module.exports = db;
