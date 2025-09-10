document.addEventListener('DOMContentLoaded', () => {
    // Revisa si ya existen usuarios en la base de datos local
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Si no hay usuarios, crea los 3 usuarios por defecto
    if (users.length === 0) {
        console.log('Base de datos local vacía. Creando usuarios por defecto...');

        const defaultUsers = [
            {
                run: "1111111-1",
                nombre: "Admin",
                apellidos: "Principal",
                email: "admin@profesor.duoc.cl", // Correo válido
                fechaNacimiento: "2000-01-01",
                region: "Metropolitana de Santiago",
                comuna: "Santiago",
                direccion: "Oficina Central 1",
                password: "admin",
                tipoUsuario: "administrador"
            },
            {
                run: "2222222-2",
                nombre: "Vendedor",
                apellidos: "Estrella",
                email: "vendedor@duoc.cl", // Correo válido
                fechaNacimiento: "1995-05-05",
                region: "Valparaíso",
                comuna: "Viña del Mar",
                direccion: "Sucursal Costa 2",
                password: "vendedor",
                tipoUsuario: "vendedor"
            },
            {
                run: "3333333-3",
                nombre: "Cliente",
                apellidos: "Fiel",
                email: "cliente@gmail.com", // Correo válido
                fechaNacimiento: "1998-10-10",
                region: "Biobío",
                comuna: "Concepción",
                direccion: "Mi Casa 3",
                password: "cliente",
                tipoUsuario: "cliente"
            }
        ];

        // Guarda los usuarios por defecto en la base de datos local
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        console.log('Usuarios por defecto válidos creados exitosamente.');
    } else {
        console.log('La base de datos local ya contiene datos.');
    }
});