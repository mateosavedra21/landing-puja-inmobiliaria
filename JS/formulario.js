/*---------------------FORMULARIO----------------------*/

document.getElementById('formPuja').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        celular: document.getElementById('celular').value,
        correo: document.getElementById('correo').value,
        tipoConsulta: document.getElementById('tipoConsulta').value,
        detalleConsulta: document.getElementById('detalleConsulta').value
    };

    fetch('http://127.0.0.1:8000/api/guardar-bandido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {

        if (data.errores) {
            // ❌ Mostrar errores como toast
            Object.values(data.errores).forEach(errorArray => {
                errorArray.forEach(errorMsg => {
                    Swal.fire({
                        toast: true,
                        icon: 'error',
                        title: errorMsg,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                });
            });
            return;
        }

        // ✔️ Éxito
        Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Consulta enviada correctamente',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        document.getElementById('formPuja').reset();
    })
    .catch(error => {
        Swal.fire({
            toast: true,
            icon: 'error',
            title: 'Error de conexión con el servidor',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        console.error(error);
    });
});
