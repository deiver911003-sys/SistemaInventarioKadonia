let compras = [];

function iniciarCompras() {
  renderCompras();
}

function agregarCompra() {
  const p = document.getElementById("c_producto").value;
  const c = document.getElementById("c_cantidad").value;

  compras.push({ producto: p, cantidad: c });

  renderCompras();
}

function renderCompras() {
  const t = document.getElementById("tablaCompras");
  t.innerHTML = "";

  compras.forEach(c => {
    t.innerHTML += `<tr><td>${c.producto}</td><td>${c.cantidad}</td></tr>`;
  });
}