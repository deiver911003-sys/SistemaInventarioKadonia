const usuarios = [
    {
        usuario: "admin",
        password: "123",
        rol: "administrador"
    },
    {
        usuario: "vendedor",
        password: "123",
        rol: "vendedor"
    },
    {
        usuario: "supervisor",
        password: "123",
        rol: "supervisor"
    }
];

document.getElementById("loginForm").addEventListener("submit", function(e){

    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    const usuarioValido = usuarios.find(user =>
        user.usuario === usuario &&
        user.password === password
    );

    if(usuarioValido){

        if(usuarioValido.rol === "administrador"){
            window.location.href = "admin.html";
        }

        else if(usuarioValido.rol === "vendedor"){
            window.location.href = "vendedor.html";
        }

        else if(usuarioValido.rol === "supervisor"){
            window.location.href = "supervisor.html";
        }

    }else{
        document.getElementById("mensaje").innerHTML =
        "Usuario o contraseña incorrectos";
    }

});
async function login() {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "admin",
      password: "1234"
    })
  });

  const data = await res.json();

  localStorage.setItem("token", data.token);
}