const abrirModal=document.querySelector("[data-id='abrir-modal']");
const cerrarModal=document.querySelector("[data-id='cerrar-modal']");
const dialog=document.querySelector(".modal")

abrirModal.addEventListener("click",()=>{
    dialog.showModal();
});

cerrarModal.addEventListener("click",()=>{
    dialog.close();
})