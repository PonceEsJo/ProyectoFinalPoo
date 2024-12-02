const agregarProductoBtn = document.getElementById('agregarProducto');
const productosTable = document.getElementById('productosTable');
const totalElement = document.getElementById('total');
const productoSelect = document.getElementById('producto'); // Suponiendo que tienes un select con los productos
const cantidadInput = document.getElementById('cantidad');

let productos = []; // Arreglo para almacenar los productos agregados

agregarProductoBtn.addEventListener('click', () => {
    const productoSeleccionado = productoSelect.value;
    const cantidad = cantidadInput.value;

    // Obtener el precio unitario (aquí debes obtenerlo de tu fuente de datos)
    const precioUnitario = obtenerPrecioUnitario(productoSeleccionado);

    // Crear una nueva fila en la tabla
    const newRow = productosTable.insertRow();
    const cells = [productoSeleccionado, cantidad, precioUnitario, cantidad * precioUnitario, 'Eliminar'];
    cells.forEach(cellText => {
        const cell = newRow.insertCell();
        cell.textContent = cellText;
    });

    // Agregar un botón de eliminar en la última celda
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.addEventListener('click', () => {
        newRow.remove();
        // Actualizar el total
        calcularTotal();
    });
    newRow.cells[newRow.cells.length - 1].appendChild(deleteBtn);

    // Agregar el producto al arreglo
    productos.push({
        producto: productoSeleccionado,
        cantidad: cantidad,
        precioUnitario: precioUnitario
    });

    // Calcular el total
    calcularTotal();
});

function calcularTotal() {
    let total = 0;
    productos.forEach(producto => {
        total += producto.cantidad * producto.precioUnitario;
    });
    totalElement.textContent = total.toFixed(2);
}

// Función para obtener el precio unitario (adapta según tu fuente de datos)
function obtenerPrecioUnitario(producto) {
    // Aquí buscarías el precio del producto en tu base de datos o en un arreglo de productos
    // Por ejemplo:
    const precios = {
        'Producto A': 10,
        'Producto B': 15
    };
    return precios[producto] || 0;
}