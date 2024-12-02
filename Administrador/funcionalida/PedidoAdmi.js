// Variables globales para modales
const modalAñadir = document.getElementById("miModalAñadir");
const modalEditar = document.getElementById("miModalEditar");

// Botones de interacción con los modales
const openAñadir = document.getElementById("añadir");
const closeAñadir = document.getElementById("cerrarAñadir");
const closeEditar = document.getElementById("cerrarEditar");

// Manejadores para abrir y cerrar el modal "Añadir"
openAñadir.addEventListener("click", () => {
    llenarSelects();
    modalAñadir.showModal();
});

closeAñadir.addEventListener("click", () => {
    modalAñadir.close();
});

// Mapeo de proveedores y productos
const proveedoresYProductos = {};

// Función para llenar los selects de proveedores y productos
async function llenarSelects() {
    try {
        const response = await fetch("http://localhost:8080/api/Proveedor");
        if (!response.ok) throw new Error("Error al obtener los datos de proveedores.");

        const proveedoresData = await response.json();
        proveedoresData.forEach(proveedor => {
            proveedoresYProductos[proveedor.id] = proveedor.productos || [];
        });

        // Llenar el select de proveedores
        const selectProveedor = document.getElementById("selecProveedor");
        selectProveedor.innerHTML = '<option value="">--Seleccione un proveedor--</option>';

        proveedoresData.forEach(proveedor => {
            const option = document.createElement("option");
            option.value = proveedor.id;
            option.textContent = proveedor.nombre;
            selectProveedor.appendChild(option);
        });

        // Actualizar los productos si hay un proveedor seleccionado inicialmente
        if (selectProveedor.value) {
            actualizarProductos(selectProveedor.value);
        }
    } catch (error) {
        console.error("Error al llenar los selects:", error);
        alert("No se pudieron cargar los proveedores. Intenta más tarde.");
    }
}

// Función para actualizar el select de productos según el proveedor seleccionado
function actualizarProductos(proveedorId) {
    const selectProducto = document.getElementById("selecProducto");
    selectProducto.innerHTML = '<option value="">--Seleccione un producto--</option>';

    const productos = proveedoresYProductos[proveedorId] || [];
    productos.forEach(producto => {
        const option = document.createElement("option");
        option.value = producto.id;
        option.textContent = producto.nombre;
        selectProducto.appendChild(option);
    });
}

// Función para actualizar el precio al seleccionar un producto
function actualizarPrecio() {
    const selectProducto = document.getElementById("selecProducto");
    const inputPrecio = document.getElementById("precio");
    const productoId = selectProducto.value;

    if (productoId) {
        for (const proveedorId in proveedoresYProductos) {
            const producto = proveedoresYProductos[proveedorId].find(p => p.id === parseInt(productoId));
            if (producto) {
                inputPrecio.value = producto.precio_unitario || '';
                break;
            }
        }
    } else {
        inputPrecio.value = '';
    }
}

// Escuchar cambios en el select de proveedores y productos
document.getElementById("selecProveedor").addEventListener("change", function () {
    const proveedorSeleccionado = this.value;
    actualizarProductos(proveedorSeleccionado);
    document.getElementById("precio").value = ''; // Limpiar precio
});

document.getElementById("selecProducto").addEventListener("change", actualizarPrecio);

// Establecer fecha actual en el input de tipo date
document.addEventListener("DOMContentLoaded", () => {
    const inputDate = document.getElementById("fecha");
    const hoy = new Date();
    inputDate.value = hoy.toISOString().split('T')[0];

    document.getElementById("precio")?.addEventListener("input", agregartotal);
    document.getElementById("cantidad")?.addEventListener("input", agregartotal);
});

// Cálculo del total
function agregartotal() {
    const precio = parseFloat(document.getElementById("precio")?.value) || 0;
    const cantidad = parseFloat(document.getElementById("cantidad")?.value) || 0;

    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.value = (precio * cantidad).toFixed(2);
    }
}

// Manejador de envío del formulario
document.getElementById("miFormularioAñadir").addEventListener("submit", async function (event) {
    event.preventDefault();

    const selectProveedor = document.getElementById("selecProveedor");
    const selectProducto = document.getElementById("selecProducto");
    const cantidad = parseFloat(document.getElementById("cantidad")?.value) || 0;
    const precio = parseFloat(document.getElementById("precio")?.value) || 0;

    const proveedorId = selectProveedor.value;
    const productoId = selectProducto.value;

    // Validación de campos obligatorios
    if (!proveedorId) {
        alert("Por favor, selecciona un proveedor.");
        return;
    }
    if (!productoId) {
        alert("Por favor, selecciona un producto.");
        return;
    }
    if (cantidad <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }
    if (precio <= 0) {
        alert("Por favor, ingresa un precio válido.");
        return;
    }

    // Formatear la fecha al formato "yyyy/MM/dd"
    const fechaInput = document.getElementById("fecha").value;
    const fechaFormateada = fechaInput.split('-').join('/');

    const datos = {
        fecha_creacion: fechaFormateada,
        estado: document.getElementById("estado").value,
        total: document.getElementById("total").value,
        proveedor: { id: proveedorId }
    };

    try {
        const response = await fetch("http://localhost:8080/api/Pedido", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error("Error en la respuesta del servidor:", response.status, errorDetails);
            throw new Error("Error al enviar los datos a la API.");
        }

        const resultado = await response.json();
        console.log("Respuesta de la API:", resultado);
        alert("Datos enviados correctamente");

        // Llenar la tabla y cerrar el modal
        await llenarTabla(proveedorId, productoId, cantidad, precio);
        modalAñadir.close();
    } catch (error) {
        console.error("Hubo un problema al enviar los datos:", error);
        alert("Error al enviar los datos. Intenta de nuevo.");
    }

    try {
        const response = await fetch("http://localhost:8080/api/Pedido");
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();

        // Enviar cada pedido a la API de OrdenCompra
        for (const element of data) {
            const datosOrdenCompra = {
                estado: element.estado,
                fecha_generacion: element.fecha_creacion,
                total: element.total,
                pedido: { id: element.id }
            };

            try {
                await fetch("http://localhost:8080/api/OrdenCompra", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosOrdenCompra)
                });
            } catch (error) {
                console.error("Error al enviar la orden de compra:", error);
            }
        }
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
    }
});

// Función para llenar la tabla
async function llenarTabla(proveedorId, productoId, cantidad, precio) {
    try {
        const response = await fetch("http://localhost:8080/api/Pedido");
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();
        const tableBody = document.getElementById("tbody");
        let rows = "";
        let id = 1;

        data.forEach((element) => {
            rows += `
                <tr>
                    <td>${id}</td>
                    <td>${proveedorId}</td>
                    <td>${productoId}</td>
                    <td>${cantidad}</td>
                    <td>${precio}</td>
                    <td>${element.fecha_creacion}</td>
                    <td>${element.estado}</td>
                    <td>${element.total}</td>
                </tr>
            `;
            id++;
        });

        tableBody.innerHTML = rows;
    } catch (error) {
        console.error("Error al llenar la tabla:", error);
        alert("No se pudo cargar la tabla de pedidos. Intenta más tarde.");
    }
}
