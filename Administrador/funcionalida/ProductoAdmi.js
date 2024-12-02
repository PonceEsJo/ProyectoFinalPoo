// Referencias a elementos del DOM
llenarTabla();
const modalAñadir = document.getElementById("miModalAñadir");
const modalEditar = document.getElementById("miModalEditar");

const openAñadir = document.getElementById("añadir");
const closeAñadir = document.getElementById("cerrarAñadir");

const closeEditar = document.getElementById("cerrarEditar");

// Manejo de eventos para abrir y cerrar el modal de "añadir"
openAñadir.addEventListener("click", () => {
    llenarSelect();
    modalAñadir.showModal();
});

closeAñadir.addEventListener("click", () => {
    modalAñadir.close();
});

document.getElementById("miFormularioAñadir").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const proveId = parseInt(document.getElementById("selecProveedor").value);

    if (!nombre || !descripcion || isNaN(precio) || isNaN(stock) || isNaN(proveId)) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    const datos = {
        nombre,
        descripcion,
        precio_unitario: precio,
        stock,
        proveedor: { id: proveId },
    };

    try {
        const response = await fetch("http://localhost:8080/api/Producto");
        if (!response.ok) throw new Error("Error al obtener la lista de productos.");

        const productos = await response.json();
        const productoExistente = productos.find(elemt => elemt.nombre.toLowerCase() === nombre.toLowerCase());

        if (productoExistente) {
            datos.stock += productoExistente.stock;
            const updateResponse = await fetch(`http://localhost:8080/api/Producto/actualizar/${productoExistente.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });

            if (!updateResponse.ok) throw new Error("Error al actualizar el producto.");

            alert("Producto actualizado correctamente.");
        } else {
            const createResponse = await fetch("http://localhost:8080/api/Producto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });

            if (!createResponse.ok) throw new Error("Error al añadir el producto.");

            alert("Producto añadido correctamente.");
        }

        llenarTabla(); // Actualizar tabla sin recargar
        modalAñadir.close();
    } catch (error) {
        console.error("Hubo un problema al enviar los datos:", error);
        alert("Error al procesar los datos. Intenta de nuevo.");
    }
});

async function llenarSelect() {
    try {
        const response = await fetch("http://localhost:8080/api/Proveedor");
        if (!response.ok) throw new Error("Error al obtener los datos del proveedor.");

        const data = await response.json();
        const select = document.getElementById("selecProveedor");

        let options = "<option value=''>--Seleccione--</option>";
        data.forEach(element => {
            options += `<option value="${element.id}">${element.nombre}</option>`;
        });

        select.innerHTML = options;
    } catch (error) {
        console.error("Error al llenar el select de proveedores:", error);
    }
}

async function llenarTabla() {
    try {
        const response = await fetch("http://localhost:8080/api/Producto");
        if (!response.ok) throw new Error("Error al obtener los productos.");

        const data = await response.json();
        const tableBody = document.getElementById("tbody");
        let rows = "";

        data.forEach((element, index) => {
            rows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${element.nombre}</td>
                    <td>${element.descripcion}</td>
                    <td>${element.precio_unitario}</td>
                    <td>${element.stock}</td>
                    <td>
                        <button class="editar" data-id="${element.id}">Editar</button>
                        <button class="eliminar" data-id="${element.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = rows;
        configurarBotones(data);
    } catch (error) {
        console.error("Error al llenar la tabla:", error);
    }
}

function configurarBotones(data) {
    document.querySelectorAll(".editar").forEach((button) => {
        button.addEventListener("click", (e) => {
            const productoId = parseInt(e.target.dataset.id);
            const producto = data.find((item) => item.id === productoId);

            if (producto) {
                document.getElementById("nombre").value = producto.nombre;
                document.getElementById("descripcion").value = producto.descripcion;
                document.getElementById("precio").value = producto.precio_unitario;
                document.getElementById("stock").value = producto.stock;
                modalEditar.showModal();
                // Lógica adicional para editar
            }
        });
    });

    document.querySelectorAll(".eliminar").forEach((button) => {
        button.addEventListener("click", async (e) => {
            const productoId = e.target.dataset.id;
            const confirmar = confirm(`¿Desea eliminar el producto con ID: ${productoId}?`);

            if (confirmar) {
                try {
                    const response = await fetch(`http://localhost:8080/api/Producto/${productoId}`, { method: "DELETE" });
                    if (!response.ok) throw new Error("Error al eliminar el producto.");

                    alert("Producto eliminado correctamente.");
                    llenarTabla();
                } catch (error) {
                    console.error("Error al eliminar el producto:", error);
                    alert("Error al eliminar el producto. Intenta de nuevo.");
                }
            }
        });
    });
}




