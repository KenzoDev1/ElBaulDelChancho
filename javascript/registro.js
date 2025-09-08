// registro.js

//Asegurando de que se cargó la página
document.addEventListener('DOMContentLoaded', () => {

    const registroFormulario = document.getElementById('registroFormulario');

    registroFormulario.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obteniendo los valores del formulario
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        if  (password !== confirmPassword) {
            alert('Las contraseñas no coinciden. Por favor, intentelo de nuevo.');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.username === username || user.email === email);

        if (userExists) {
            alert('El nombre de usuario o el correo electrónico ya están registrados.');
            return;
        }

        const newUser = {
            username: username,
            email: email,
            password: password,
            // Por defecto al crear empieza con el rol de CLIENTE
            role: USER_ROLES.CLIENTE
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('¡Registro exitoso! ¡Bienvenido, ' + newUser.username +'! Ahora serás redirigido al inicio de sesión.');
        window.location.href = 'login.html';
    })
});