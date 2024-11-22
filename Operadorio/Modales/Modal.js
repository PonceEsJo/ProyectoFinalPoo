const modal = document.getElementById("miModal");
const abrir = document.getElementById("añadir");
const cerrar = document.getElementById("cerrarModal");
const contenedorForm=document.getElementById("formContenedor");

abrir.addEventListener("click",()=>{
    modal.showModal();
    contenedorForm.innerHTML=`
        <form >
            <div class="contTitulo">
                <h3>Agregar Producto</h3>
            </div>
            <div class="contInfo">
                <label for="codigo" >Codigo Producto: </label>
                <input type="text" id="codigo" name="codigo" readonly>
                <label for="nombre">Nombre: </label>
                <input type="text" name="nombre" id="nombre">
                <label for="descripcion">Descripcion: </label>
                <textarea name="descripcion" id="descripcion"></textarea>
                <label for="precio" class="especial">Precio Unitario: </label>
                <input type="text" name="precio" id="precio">
                <label for="stock" class="especial">Stock: </label>
                <input type="number" min="0" name="stock" id="stock">
            </div>
            <div class="contButon">
                <button id="cerrarModal">Agregar Producto</button>
            </div>
        </form>
    `
});

cerrar.addEventListener("click",()=>{
    modal.close();
    contenedorForm.innerHTML=``
});