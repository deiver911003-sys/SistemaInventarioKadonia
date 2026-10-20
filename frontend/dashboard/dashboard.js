function actualizarDashboard(){

    const productos =
    JSON.parse(localStorage.getItem("productos")) || [];

    const ventas =
    JSON.parse(localStorage.getItem("ventas")) || [];

    const compras =
    JSON.parse(localStorage.getItem("compras")) || [];

    // TARJETAS

    document.getElementById("total-productos")
    .textContent = productos.length;

    document.getElementById("ventas-hoy")
    .textContent = ventas.length;

    document.getElementById("compras-hoy")
    .textContent = compras.length;

    const stockBajo =
    productos.filter(p => Number(p.cantidad) <= 5);

    document.getElementById("stock-bajo")
    .textContent = stockBajo.length;

    // LISTA STOCK BAJO

    const lista =
    document.getElementById("lista-stock");

    lista.innerHTML = "";

    stockBajo.forEach(producto => {

        lista.innerHTML += `
            <li>
                ${producto.referencia}
                (${producto.cantidad})
            </li>
        `;

    });

    // ÚLTIMAS VENTAS

    const tabla =
    document.getElementById("tabla-ventas");

    tabla.innerHTML = "";

    ventas.slice(-5).reverse().forEach(venta => {

        tabla.innerHTML += `
            <tr>
                <td>${venta.id}</td>
                <td>${venta.cliente}</td>
                <td>${venta.producto}</td>
                <td>$${venta.total}</td>
            </tr>
        `;

    });

}
function cargarGraficas(){

    const lineChart =
    document.getElementById("lineChart");

    if(lineChart){

        new Chart(lineChart,{

            type:"line",

            data:{
                labels:[
                    "Lun","Mar","Mie",
                    "Jue","Vie","Sab","Dom"
                ],

                datasets:[{

                    label:"Ventas",

                    data:[
                        12,19,8,15,22,18,25
                    ]

                }]
            }

        });

    }

    const pieChart =
    document.getElementById("pieChart");

    if(pieChart){

        new Chart(pieChart,{

            type:"doughnut",

            data:{
                labels:[
                    "Jeans",
                    "Camisas",
                    "Zapatos"
                ],

                datasets:[{

                    data:[40,30,30]

                }]
            }

        });

    }

}
cargarGraficas();
actualizarDashboard();