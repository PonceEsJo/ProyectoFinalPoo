// Llamada a la función para llenar la tabla al cargar la página
llenarTabla();

// Selección de elementos de los modales y botones
const modalAñadir = document.getElementById("miModalAñadir");
const modalEditar = document.getElementById("miModalEditar");

const openAñadir = document.getElementById("añadir");
const closeAñadir = document.getElementById("cerrarAñadir");

const openEditar = document.querySelectorAll(".editar");
const eliminar = document.querySelectorAll(".eliminar");
const closeEditar = document.getElementById("cerrarEditar");

// Manejo de eventos para abrir y cerrar el modal de añadir
openAñadir.addEventListener("click", () => {
    modalAñadir.showModal();
});

closeAñadir.addEventListener("click", () => {
    modalAñadir.close();
});

// Función para manejar la sumisión del formulario de agregar
document.getElementById("miFormularioAgregar").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;
    const confContraseña = document.getElementById("confContraseña").value;

    // Verificación de contraseñas
    if (contraseña !== confContraseña) {
        alert("Las contraseñas son diferentes");
        return;
    }

    const rol = document.getElementById("opcion").value;

    const datos = {
        nombre: nombre,
        correo: correo,
        contraseña: contraseña,
        rol: rol
    };

    try {
        const response = await fetch("http://localhost:8080/api/Usuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error("Error al enviar los datos a la API");
        }

        const resultado = await response.json();
        console.log("Respuesta de la API:", resultado);
        alert("Datos enviados correctamente");

        // Recargar la tabla y cerrar el modal
        location.reload();
        modalAñadir.close();
    } catch (error) {
        console.error("Hubo un problema al enviar los datos:", error);
        alert("Error al enviar los datos. Intenta de nuevo.");
    }
});

// Función para llenar la tabla con los datos de la API
async function llenarTabla() {
    try {
        const response = await fetch("http://localhost:8080/api/Usuario");
        if (!response.ok) {
            throw new Error("Error al obtener los datos");
        }

        const data = await response.json();
        const tableBody = document.getElementById("tbody");
        let rows = "";
        let id = 1;

        data.forEach((element) => {
            rows += `
                <tr>
                    <td>${id}</td>
                    <td>${element.nombre}</td>
                    <td>${element.correo}</td>
                    <td>${element.rol}</td>
                    <td>
                        <button class="editar" data-id="${element.id}">Editar</button>
                        <button class="eliminar" data-id="${element.id}">Eliminar</button>
                    </td>
                </tr>
            `;
            id++;
        });

        tableBody.innerHTML = rows;

        // Agregar eventos a los botones de edición y eliminación
        document.querySelectorAll(".editar").forEach((button) => {
            button.addEventListener("click", (e) => {
                const UsuarioId = parseInt(e.target.dataset.id);
                const Usuario = data.find((item) => item.id === UsuarioId);
                if (Usuario) {
                    document.getElementById("name").value = Usuario.nombre;
                    document.getElementById("email").value = Usuario.correo;
                    document.getElementById("password").value = Usuario.contraseña;
                    document.getElementById("elige").value = Usuario.rol; // Asegúrate de que el nombre del input coincida

                    modalEditar.showModal();
                    // Pasar el id al evento de edición
                    configurarFormularioEditar(UsuarioId);
                }
            });
        });

        document.querySelectorAll(".eliminar").forEach((button) => {
            button.addEventListener("click", async (e) => {
                const UsuarioId = e.target.dataset.id;
                const confirmar = confirm(`Desea eliminar este Usuario con ID: ${UsuarioId}`);
                if (confirmar) {
                    await eliminarUsuario(UsuarioId);
                }
                location.reload();
            });
        });
    } catch (error) {
        console.error("Hubo un problema con la solicitud");
    }
}

// Configurar el evento de envío del formulario de edición
function configurarFormularioEditar(id) {
    document.getElementById("miFormularioEditar").onsubmit = async function (event) {
        event.preventDefault();

        const nombre = document.getElementById("name").value;
        const correo = document.getElementById("email").value;
        const contraseña = document.getElementById("password").value;
        const rol = document.getElementById("elige").value;

        const datos = {
            nombre: nombre,
            correo: correo,
            contraseña: contraseña, // Corrige si es necesario
            rol: rol
        };

        try {
            const response = await fetch(`http://localhost:8080/api/Usuario/actualizar/${id}`, {
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
        } catch (error) {
            console.error("Hubo un problema al actualizar los datos:", error);
            alert("Error al actualizar los datos. Intenta de nuevo.");
        }
    };
}
async function eliminarUsuario(UsuarioId) {
    try {
        const response = await fetch(`http://localhost:8080/api/Usuario/${UsuarioId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el proveedor. Código de estado: ${response.status}`);
        }

        // Verificar si la respuesta tiene contenido JSON
        if (response.status !== 204) {
            const resultado = await response.json(); // Solo intenta esto si estás seguro de que hay contenido
            console.log("Respuesta de la API:", resultado);
        } else {
            console.log("Proveedor eliminado correctamente, no hay contenido en la respuesta.");
        }

    } catch (error) {
        console.error("Error al eliminar el proveedor:", error);
    }
}

