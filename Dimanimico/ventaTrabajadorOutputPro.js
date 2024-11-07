document.addEventListener("DOMContentLoaded", () => {

    const hamBurger = document.querySelector(".toggle-btn");

    // Manejar el toggle del sidebar
    hamBurger.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.toggle("expand");
    });


    const modalAgregar = new bootstrap.Modal(document.getElementById('salidaPro'));
    const openModalAgregar = document.querySelector(".btn-botonSA");

    // Función para abrir el modal
    openModalAgregar.addEventListener("click", () => {
        modalAgregar.show();
    });

});