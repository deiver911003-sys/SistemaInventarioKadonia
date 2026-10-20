let usuarios = [];

function iniciarUsuarios() {
  renderUsuarios();
}

function guardarUsuario() {
  const n = document.getElementById("u_nombre").value;
  const r = document.getElementById("u_rol").value;

  usuarios.push({ nombre: n, rol: r });

  renderUsuarios();
}

function renderUsuarios() {
  const t = document.getElementById("tablaUsuarios");
  t.innerHTML = "";

  usuarios.forEach(u => {
    t.innerHTML += `<tr><td>${u.nombre}</td><td>${u.rol}</td></tr>`;
  });
}