document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // 1. Prevenir el envío del formulario y la recarga de la página
            event.preventDefault(); 

            // 2. Obtener los valores de los campos
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 3. Obtener los usuarios de la base de datos local
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // 4. Buscar un usuario que coincida con el email y la contraseña
            const foundUser = users.find(user => user.email === email && user.password === password);

            // 5. Comprobar si se encontró el usuario y redirigir según su rol
            if (foundUser) {
                // Guardar el usuario que inició sesión para usarlo en otras páginas
                sessionStorage.setItem('currentUser', JSON.stringify(foundUser));

                switch (foundUser.tipoUsuario) {
                    case 'administrador':
                        window.location.href = 'HTML-Admin/menuadmin.html';
                        break;
                    case 'vendedor':
                        // Asumiendo que tienes una vista para vendedor
                        window.location.href = 'HTML-Vendedor/menuvendedor.html'; 
                        break;
                    case 'cliente':
                        // Asumiendo que la vista de cliente es el index principal
                        window.location.href = 'index.html'; 
                        break;
                    default:
                        alert('Tipo de usuario no reconocido.');
                }
            } else {
                // 6. Si no se encuentra, mostrar un mensaje de error
                alert('Correo electrónico o contraseña incorrectos.');
            }
        });
    }
});