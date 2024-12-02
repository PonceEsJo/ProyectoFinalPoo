llenarTabla();
// Selección de elementos de los modales y botones
const modalAñadir = document.getElementById("miModalAñadir");
const modalEditar = document.getElementById("miModalEditar");

const openAñadir = document.getElementById("añadir");
const closeAñadir = document.getElementById("cerrarAñadir");
const closeEditar = document.getElementById("cerrarEditar");

// Abrir y cerrar modal de añadir
openAñadir.addEventListener("click", () => modalAñadir.showModal());
closeAñadir.addEventListener("click", () => modalAñadir.close());
closeEditar.addEventListener("click", () => modalEditar.close());

// Manejo del envío del formulario de añadir
document.getElementById("miFormularioAñadir").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    // Validar campos
    if (!nombre || !correo || !direccion || !telefono) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const datos = { nombre, correo, direccion, telefono };

    try {
        const response = await fetch("http://localhost:8080/api/Proveedor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        if (!response.ok) throw new Error("Error al enviar los datos a la API");

        alert("Datos enviados correctamente");
        llenarTabla(); // Actualizar tabla
        modalAñadir.close();
    } catch (error) {
        console.error("Hubo un problema al enviar los datos:", error);
        alert("Error al enviar los datos. Intenta de nuevo.");
    }
});

// Llenar tabla con datos del servidor
async function llenarTabla() {
    try {
        const response = await fetch("http://localhost:8080/api/Proveedor");
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();
        const tableBody = document.getElementById("tbody");
        let rows = "";

        data.forEach((element, index) => {
            rows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${element.nombre}</td>
                    <td>${element.correo}</td>
                    <td>${element.direccion}</td>
                    <td>${element.telefono}</td>
                    <td>
                        <button class="editar" data-id="${element.id}">Editar</button>
                        <button class="eliminar" data-id="${element.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = rows;
        configurarBotones(data); // Agregar eventos a botones dinámicos
    } catch (error) {
        console.error("Hubo un problema al obtener los datos:", error);
    }
}

// Configurar botones dinámicos
function configurarBotones(data) {
    document.querySelectorAll(".editar").forEach((button) => {
        button.addEventListener("click", (e) => {
            const proveedorId = parseInt(e.target.dataset.id);
            const proveedor = data.find((item) => item.id === proveedorId);

            if (proveedor) {
                document.getElementById("name").value = proveedor.nombre;
                document.getElementById("email").value = proveedor.correo;
                document.getElementById("ubi").value = proveedor.direccion;
                document.getElementById("phone").value = proveedor.telefono;
                modalEditar.showModal();
                editar(proveedorId);
            }
        });
    });

    document.querySelectorAll(".eliminar").forEach((button) => {
        button.addEventListener("click", async (e) => {
            const proveedorId = e.target.dataset.id;
            const confirmar = confirm(`¿Desea eliminar el proveedor con ID: ${proveedorId}?`);

            if (confirmar) {
                await eliminarProveedor(proveedorId);
                llenarTabla(); // Actualizar tabla
            }
        });
    });
}
function editar(id){
    document.getElementById("miFormularioEditar").onsubmit= async function(event){
        event.preventDefault();

        const nombre=document.getElementById("name").value;
        const correo=document.getElementById("email").value;
        const direccion=document.getElementById("ubi").value;
        const telefono=document.getElementById("phone").value;

        const datos={
            nombre:nombre,
            correo:correo,
            direccion:direccion,
            telefono:telefono
        };
        try{
            const response = await fetch(`http://localhost:8080/api/Proveedor/actualizar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar los datos a la API");
            }

            const resultado = await response.json();
            console.log("Respuesta de la API:", resultado);
            alert("Datos actualizados correctamente");

            // Recargar la tabla y cerrar el modal
            location.reload();
            modalEditar.close();
        }catch(error){
            console.error("Hubo un problema al actualizar los datos:", error);
            alert("Error al actualizar los datos. Intenta de nuevo.");
        }
    }
}
// Función para eliminar un proveedor
async function eliminarProveedor(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/Proveedor/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al eliminar el proveedor");

        alert("Proveedor eliminado correctamente");
    } catch (error) {
        console.error("Hubo un problema al eliminar el proveedor:", error);
        alert("Error al eliminar el proveedor. Intenta de nuevo.");
    }
}




