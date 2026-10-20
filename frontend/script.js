const menuItems = document.querySelectorAll(".sidebar ul li");
const contenido = document.getElementById("contenido-principal");
const titulo = document.getElementById("titulo-pagina");

async function cargarPagina(page, nombrePagina) {
    try {
       const ruta = new URL(page, window.location.href);
       const response = await fetch(ruta);

        if (!response.ok) {
            throw new Error("Archivo no encontrado");
        }

        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        contenido.innerHTML = doc.body.innerHTML;
        titulo.textContent = nombrePagina;
        if (page === "productos/productos.html") {
    iniciarProductos();
       }
       if (page === "inventario/inventario.html") {
    iniciarInventario();
}
        // Si carga dashboard, renderiza gráficas
        if (page === "dashboard/dashboard.html") {
            cargarGraficas();
            actualizarDashboard();
         }
    } catch (error) {
        contenido.innerHTML = `
            <h2>Error</h2>
            <p>No se pudo cargar ${page}</p>
        `;
    }
}
// FUNCIÓN PARA LAS GRÁFICAS
function cargarGraficas() {

    const lineCanvas = document.getElementById("lineChart");
    const pieCanvas = document.getElementById("pieChart");

    if (lineCanvas) {
        new Chart(lineCanvas, {
            type: 'line',
            data: {
                labels: ['Lun','Mar','Mie','Jue','Vie','Sab','Dom'],
                datasets: [{
                    label: 'Ventas',
                    data: [12,19,8,15,22,18,25],
                    borderWidth: 2
                }]
            }
        });
    }

    if (pieCanvas) {
        new Chart(pieCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Jeans','Camisas','Zapatos'],
                datasets: [{
                    data: [40,30,30]
                }]
            }
        });
    }
}


// eventos menú
menuItems.forEach(item => {

    item.addEventListener("click", (event) => {

        const page = item.getAttribute("data-page");

        // si no tiene data-page no hace fetch
        if(!page){
            return;
        }

        const nombre = item.textContent.trim();

        cargarPagina(page, nombre);

    });

});

// cargar dashboard automáticamente
window.addEventListener("DOMContentLoaded", () => {
    cargarPagina("dashboard/dashboard.html", "Dashboard");
});
const productosBtn = document.getElementById("productos-btn");
const menuProductos = document.getElementById("menuProductos");

productosBtn.addEventListener("click", function(event){

    event.stopPropagation();

    if(menuProductos.style.display==="block"){
        menuProductos.style.display="none";
    }else{
        menuProductos.style.display="block";
    }

});
const inventarioBtn = document.getElementById("inventario-btn");

if (inventarioBtn) {
    inventarioBtn.addEventListener("click", function() {
        mostrarInventario();
    });
}
menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const page = item.getAttribute("data-page");

        if(!page) return;

        const nombre = item.textContent.trim();

        cargarPagina(page,nombre);

    });

});
let productoEncontrado = null;
function mostrarInventario() {

    const tabla = document.getElementById("tablaInventario");

    if (!tabla) return;

    const productosGuardados =
        JSON.parse(localStorage.getItem("productos")) || [];

    tabla.innerHTML = "";

    productosGuardados.forEach(producto => {

        tabla.innerHTML += `
            <tr>
                <td>${producto.codigo}</td>
                <td>${producto.referencia}</td>
                <td>${producto.talla}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precioDetal}</td>
                <td>${producto.precioMayor}</td>
            </tr>
        `;
    });
}
document.addEventListener("click", function(){

    setTimeout(() => {
        mostrarInventario();
    }, 200);

});
function actualizarDashboard() {

    const productos =
        JSON.parse(localStorage.getItem("productos")) || [];

    const totalProductos =
        document.getElementById("total-productos");

    if(totalProductos){
        totalProductos.textContent = productos.length;
    }
}
