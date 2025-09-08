document.addEventListener('DOMContentLoaded', () => {
    const loginFormulario = document.getElementById('loginFormulario');

    loginFormulario.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obteniendo valores del formulario Login
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        //  Obteniendo la lista de usuario y contraseña
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // busca un usuario que coincida con algun usuario de la lista
        const foundUser = users.find(user =>
            user.username === username && user.password === password
        );

        if (foundUser){
            const roleName = USER_NAME_ROLES[foundUser.role] || 'Usuario';
            alert(`¡Inicio de sesión Exitoso! Bienvenido, ${roleName} ${foundUser.username}!`);

            switch (foundUser.role) {
                case USER_ROLES.ADMIN:
                    window.location.href = 'HTML-Admin/menuadmin.html';
                    break;
                case USER_ROLES.VENDEDOR:
                    window.location.href = 'HTML-Cliente/menucliente.html'; // Asumiendo que Vendedor y Cliente comparten menú
                    break;
                case USER_ROLES.CLIENTE:
                    window.location.href = 'HTML-Cliente/menucliente.html';
                    break;
                default:
                    // Opcional: manejar roles desconocidos, aunque no debería ocurrir.
                    break;
            }
        } else {
            alert('Nombre de usuario o contraseña incorrectos.');
        }

        loginFormulario.reset();
    });
});