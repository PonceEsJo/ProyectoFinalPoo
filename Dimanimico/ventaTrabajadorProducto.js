document.addEventListener("DOMContentLoaded", () => {
    const hamBurger = document.querySelector(".toggle-btn");

    const modalEliminar = new bootstrap.Modal(document.getElementById('eliminar'));
    const openModalBtns = document.querySelectorAll(".btn-eliminar");

    const modalModificar = new bootstrap.Modal(document.getElementById('modificar'));
    const openModalModificar = document.querySelectorAll(".btn-modificar");

    const botonModificar = document.querySelectorAll("#producTable .btn-modificar");

    const botonEliminar = document.querySelectorAll("#producTable .btn-eliminar");

    const idTabla = document.querySelector(".cont-form");


    // Función para abrir el modal
    openModalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            modalEliminar.show();
        });
    });

    openModalModificar.forEach(btn => {
        btn.addEventListener("click", () => {
            modalModificar.show();
        });
    });

    // Manejar el toggle del sidebar
    hamBurger.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.toggle("expand");
    });

    botonModificar.forEach((button) => {
        button.addEventListener("click", () => {
            const fila = button.closest("tr");
            const id = fila.querySelector('[name="idproducto"]').textContent;
            idTabla.innerHTML = `
            <div class="inline">
                <label class="label-number">Codigo Producto:</label>
                <input class="input-number" type="text" readonly value=${id}>
            </div>
            <div>
                <label class="label-text">Nombre Producto:</label>
                <input class="input-text" type="text" readonly>
            </div>
            <div class="inline">
                <label class="label-number">Cantidad Producto:</label>
                <input class="input-number" type="number" value="0" min="0">
            </div>
            <div class="form-linea"></div>
            <div>
                <label class="label-text">Nombre del Trabajador:</label>
                <input class="input-text" type="text" readonly>
            </div>
            <div class="inline">
                <label class="label-number">Hora de Ingreso:</label>
                <input class="input-date" type="date">
            </div>
    `;
        });
    });

    botonEliminar.forEach((button) => {
        button.addEventListener("click", () => {
            const fila = button.closest("tr");
            const id = fila.querySelector('[name="idproducto"]').textContent;
        });
    });




});

