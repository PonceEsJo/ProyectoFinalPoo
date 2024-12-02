const modalAñadir = document.getElementById("miModalAñadir");
const modalEditar =document.getElementById("miModalEditar");

const openAñadir = document.getElementById("añadir");
const openEditar = document.querySelectorAll(".editar");

const closeAñadir =document.getElementById("cerrarAñadir");
const closeEditar=document.getElementById("cerrarEditar");

openAñadir.addEventListener("click",()=>{
    modalAñadir.showModal();
});


openEditar.forEach(button  => {
    button.addEventListener("click",()=>{
        modalEditar.showModal();
    });
});

closeAñadir.addEventListener("click",()=>{
    modalAñadir.close();
});

closeEditar.addEventListener("click",()=>{
    modalEditar.close();
});