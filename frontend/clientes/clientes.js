let clientes = [];

function iniciarClientes() {
  renderClientes();
}

function guardarCliente() {
  const n = document.getElementById("cli_nombre").value;
  const t = document.getElementById("cli_tel").value;

  clientes.push({ nombre: n, tel: t });

  renderClientes();
}

function renderClientes() {
  const t = document.getElementById("tablaClientes");
  t.innerHTML = "";

  clientes.forEach(c => {
    t.innerHTML += `<tr><td>${c.nombre}</td><td>${c.tel}</td></tr>`;
  });
}