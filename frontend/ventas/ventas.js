let ventas = [];

function iniciarVentas() {
  renderVentas();
}

function agregarVenta() {
  const p = document.getElementById("v_producto").value;
  const c = document.getElementById("v_cantidad").value;

  ventas.push({ id: Date.now(), producto: p, cantidad: c });

  renderVentas();
}

function renderVentas() {
  const t = document.getElementById("tablaVentas");
  t.innerHTML = "";

  ventas.forEach(v => {
    t.innerHTML += `<tr><td>${v.producto}</td><td>${v.cantidad}</td></tr>`;
  });
}