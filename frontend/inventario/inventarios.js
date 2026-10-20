
const API_INVENTARIO = "http://localhost:3000/api/productos";

let inventario = [];

async function iniciarInventario() {
  const tabla = document.getElementById("tablaInventario");
  const mensaje = document.getElementById("mensajeInventario");

  if (!tabla) return;

  tabla.innerHTML =
    '<tr><td colspan="9">Cargando inventario...</td></tr>';

  if (mensaje) mensaje.textContent = "";

  try {
    const respuesta = await fetch(API_INVENTARIO);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos)) {
      throw new Error("La API no devolvió una lista de productos.");
    }

    inventario = datos;
    renderInventario();

  } catch (error) {
    console.error("Error al cargar inventario:", error);

    tabla.innerHTML =
      '<tr><td colspan="9">No se pudo cargar el inventario. Verifica el backend.</td></tr>';

    if (mensaje) mensaje.textContent = error.message;
  }
}

function renderInventario() {
  const tabla = document.getElementById("tablaInventario");
  const mensaje = document.getElementById("mensajeInventario");

  if (!tabla) return;

  const totalProductos = inventario.length;

  const totalUnidades = inventario.reduce(
    (total, producto) =>
      total + Number(producto.cantidad || 0),
    0
  );

  const productosStockBajo = inventario.filter(producto =>
    Number(producto.cantidad || 0) <=
    Number(producto.stock_minimo ?? 5)
  );

  const totalProductosElemento =
    document.getElementById("totalProductos");

  const totalUnidadesElemento =
    document.getElementById("totalUnidades");

  const totalStockBajoElemento =
    document.getElementById("totalStockBajo");

  if (totalProductosElemento) {
    totalProductosElemento.textContent = totalProductos;
  }

  if (totalUnidadesElemento) {
    totalUnidadesElemento.textContent = totalUnidades;
  }

  if (totalStockBajoElemento) {
    totalStockBajoElemento.textContent =
      productosStockBajo.length;
  }

  if (inventario.length === 0) {
    tabla.innerHTML =
      '<tr><td colspan="9">No hay productos registrados.</td></tr>';
    return;
  }

  tabla.innerHTML = "";

  inventario.forEach(producto => {
    const cantidad = Number(producto.cantidad || 0);
    const minimo = Number(producto.stock_minimo ?? 5);
    const stockBajo = cantidad <= minimo;

    const fila = document.createElement("tr");

    if (stockBajo) fila.classList.add("stock-bajo");

    const valores = [
      producto.id_producto,
      producto.codigo,
      producto.nombre,
      producto.talla,
      producto.color,
      cantidad,
      minimo,
      `$${Number(producto.precio_venta || 0).toLocaleString("es-CO")}`,
      stockBajo ? "STOCK BAJO" : "Disponible"
    ];

    valores.forEach(valor => {
      const celda = document.createElement("td");
      celda.textContent = valor ?? "";
      fila.appendChild(celda);
    });

    tabla.appendChild(fila);
  });

  if (mensaje) {
    mensaje.textContent = productosStockBajo.length
      ? `Atención: ${productosStockBajo.length} producto(s) tienen stock bajo.`
      : "Inventario actualizado. No hay productos con stock bajo.";
  }
}

window.iniciarInventario = iniciarInventario;
