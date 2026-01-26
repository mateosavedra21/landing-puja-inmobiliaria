/*----------------------- Tabla ----------------------*/
  let editId = null;
  let registros = [];

  obtenerBandidos();

  function obtenerBandidos() {
  document.getElementById('loader').style.display = 'block';
  fetch('http://127.0.0.1:8000/api/obtener-bandidos')
    .then(r => r.json())
    .then(data => {
      registros = data.data;     // 1️⃣ guardas TODOS los datos
      pintarTabla(registros);    // 2️⃣ pintas la tabla
    })
    .catch(console.error);
}


  function abrirEditar(id, nombre, celular, correo, tipo, detalle) {
    editId = id;

    document.getElementById('edit-name').value = nombre;
    document.getElementById('edit-celular').value = celular;
    document.getElementById('edit-correo').value = correo;

    document.getElementById('edit-tipo').value = tipo || '';
    document.getElementById('edit-detalle').value = detalle || '';

    toggleDetalle();

    new bootstrap.Modal(document.getElementById('modalEditar')).show();
  }

  function guardarEdicion() {
    fetch(`http://127.0.0.1:8000/api/editar-bandido/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('edit-name').value,
        celular: document.getElementById('edit-celular').value,
        correo: document.getElementById('edit-correo').value,
        tipoConsulta: document.getElementById('edit-tipo').value,
        detalleConsulta: document.getElementById('edit-detalle').value
      })
    })
    .then(r => r.json())
    .then(() => {
      const modalEl = document.getElementById('modalEditar');
      bootstrap.Modal.getInstance(modalEl).hide();

      obtenerBandidos();
     })
    .catch(console.error);
  }

function eliminar(id) {
  Swal.fire({
    title: '¿Eliminar registro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://127.0.0.1:8000/api/eliminar-bandido/${id}`, {
        method: 'DELETE'
      })
      .then(() => {
        Swal.fire('Eliminado', 'Registro eliminado correctamente', 'success');
        obtenerBandidos();
      })
      .catch(console.error);
    }
  });
}


  function toggleDetalle() {
    const tipo = document.getElementById('edit-tipo').value;
    const detalle = document.getElementById('edit-detalle');

    if (tipo === 'otros') {
      detalle.classList.remove('d-none');
    } else {
      detalle.classList.add('d-none');
      detalle.value = '';
    }
  }
  // para que el textarea aparezca/oculte cuando cambias el select
  document.getElementById('edit-tipo').addEventListener('change', toggleDetalle);
  
  function pintarTabla(lista) {
  const tbody = document.getElementById('tabla-consultas');
  tbody.innerHTML = '';

  lista.forEach((item, index) => {
    tbody.innerHTML += `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td>${item.nombre_apellido}</td>
        <td>${item.celular}</td>
        <td>${item.correo}</td>
        <td>${item.tipo_consulta ?? '-'}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-primary me-2"
            onclick="abrirEditar(${item.id},
              '${item.nombre_apellido}',
              '${item.celular}',
              '${item.correo}',
              '${item.tipo_consulta ?? ''}',
              '${item.detalle_consulta ?? ''}'
            )">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button class="btn btn-sm btn-outline-danger"
            onclick="eliminar(${item.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  document.getElementById('loader').style.display = 'none';

}

document.getElementById('buscador').addEventListener('keyup', function () {
  const texto = this.value.toLowerCase();

  const filtrados = registros.filter(item =>
    item.nombre_apellido.toLowerCase().includes(texto) ||
    item.correo.toLowerCase().includes(texto)
  );

  pintarTabla(filtrados);
});


