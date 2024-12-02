document.getElementById("miFormulario").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita el envío automático del formulario.
  
    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      // Obtén los datos de usuarios desde la API
      const response = await fetch("http://localhost:8080/api/Usuario"); // Endpoint de la API

      if (!response.ok) throw new Error("Error al obtener datos de la API");
  
      const users = await response.json(); // Lista de usuarios
      let operario = false; // Bandera para verificar si el usuario es válido
      let administrador= false;
      let idUsuario;
  
      // Recorre la lista de usuarios con un forEach
      users.forEach((user) => {
        if (user.correo === username && user.contraseña === password && user.rol==="Operario") {
          operario = true;
          idUsuario=user.id;
        }else if(user.correo === username && user.contraseña === password && user.rol==="Administrador"){
          administrador=true;
          idUsuario=user.id;
        }
      });
  
      // Verifica si las credenciales son correctas
      if (operario) {
        localStorage.getItem("idUsuario",idUsuario);
        window.location.href = "/Operadorio/vistas/perfilOperario.html";// Redirige a otra página
      } else if(administrador){
        localStorage.getItem("idUsuario",idUsuario);
        window.location.href= "/Administrador/perfilAdministrador.html";
      }else {
        alert("Credenciales incorrectas"); // Muestra mensaje si no coincide
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  });
  
  