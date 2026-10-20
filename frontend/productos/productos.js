
const API_PRODUCTOS = "http://localhost:3000/api/productos";

let productos = [];

async function iniciarProductos() {
  const tabla = document.getElementById("tablaProductos");
  if (!tabla) return;

  tabla.innerHTML = `
    <tr><td colspan="6">Cargando productos...</td></tr>
  `;

  try {
    const respuesta = await fetch(API_PRODUCTOS);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    productos = Array.isArray(datos) ? datos : datos.value;

    if (!Array.isArray(productos)) {
      throw new Error("La API no devolvió una lista de productos.");
    }

    renderProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error);
    tabla.innerHTML = `
      <tr>
        <td colspan="6">No se pudieron cargar los productos.</td>
      </tr>
    `;
  }
}

function renderProductos(lista = productos) {
  const tabla = document.getElementById("tablaProductos");
  if (!tabla) return;

  if (lista.length === 0) {
    tabla.innerHTML = `
      <tr><td colspan="6">No hay productos registrados.</td></tr>
    `;
    return;
  }

  tabla.innerHTML = "";

  lista.forEach(producto => {
    const fila = document.createElement("tr");

    [
      producto.id_producto,
      producto.codigo,
      producto.nombre,
      producto.precio_venta,
      producto.cantidad,
      producto.talla
    ].forEach(valor => {
      const celda = document.createElement("td");
      celda.textContent = valor ?? "";
      fila.appendChild(celda);
    });

    tabla.appendChild(fila);
  });
}

function buscarProducto() {
  const campo = document.getElementById("buscarProducto");
  if (!campo) return;

  const texto = campo.value.trim().toLowerCase();

  const filtrados = productos.filter(producto =>
    [
      producto.codigo,
      producto.referencia,
      producto.nombre,
      producto.color,
      producto.talla
    ].some(valor =>
      String(valor ?? "").toLowerCase().includes(texto)
    )
  );

  renderProductos(filtrados);
}

async function guardarProducto() {
  const obtener = id =>
    document.getElementById(id)?.value.trim() ?? "";

  const datos = {
    codigo: obtener("p_codigo"),
    referencia: obtener("p_referencia"),
    nombre: obtener("p_nombre"),
    id_categoria: obtener("p_categoria"),
    talla: obtener("p_talla"),
    color: obtener("p_color"),
    precio_compra: obtener("p_compra"),
    precio_venta: obtener("p_precio"),
    cantidad: obtener("p_cantidad"),
    stock_minimo: obtener("p_stock_minimo") || "5"
  };

  if (
    !datos.codigo ||
    !datos.referencia ||
    !datos.nombre ||
    !datos.id_categoria ||
    !datos.talla ||
    !datos.color ||
    datos.precio_compra === "" ||
    datos.precio_venta === "" ||
    datos.cantidad === ""
  ) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  const boton = document.querySelector(
    '.form button[onclick="guardarProducto()"]'
  );

  try {
    if (boton) {
      boton.disabled = true;
      boton.textContent = "Guardando...";
    }

    const respuesta = await fetch(API_PRODUCTOS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
    throw new Error(
    `Error HTTP: ${respuesta.status}\n` +
    `Mensaje: ${resultado.mensaje || "Error desconocido"}\n` +
    `Ruta: ${resultado.ruta || "No indicada"}\n` +
    `Método: ${resultado.metodo || "No indicado"}`
     );
    }
    alert(resultado.mensaje || "Producto guardado correctamente.");

    // Limpiar el formulario después de guardar.
    [
      "p_codigo",
      "p_referencia",
      "p_nombre",
      "p_categoria",
      "p_talla",
      "p_color",
      "p_compra",
      "p_precio",
      "p_cantidad"
    ].forEach(id => {
      const campo = document.getElementById(id);
      if (campo) campo.value = "";
    });

    const stock = document.getElementById("p_stock_minimo");
    if (stock) stock.value = "5";

    const busqueda = document.getElementById("buscarProducto");
    if (busqueda) busqueda.value = "";

    await iniciarProductos();

  } catch (error) {
    console.error("Error al guardar:", error);
    alert(error.message || "Error de conexión con el servidor.");
  } finally {
    if (boton) {
      boton.disabled = false;
      boton.textContent = "Guardar";
    }
  }
}

function editarProducto() {
  alert("La edición se conectará con el backend en el siguiente paso.");
}

function eliminarProducto() {
  alert("La eliminación se conectará con el backend en el siguiente paso.");
}
