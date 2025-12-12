import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import './ModalEliminarCliente.css';

/**
 * Componente Modal para eliminar cliente usando SweetAlert2
 * Se renderiza cuando clienteAEliminar tiene valor
 */
const ModalEliminarCliente = ({ cliente, alConfirmar, esAdministrador }) => {
  useEffect(() => {
    if (!cliente) return;

    const mostrarModal = async () => {
      // Validar datos del cliente
      if (!cliente?.nombre) {
        await modalError('Información del cliente incompleta');
        alConfirmar(null);
        return;
      }

      const nombreCliente = cliente.nombre.trim();

      const resultado = await Swal.fire({
        title: '¿Eliminar este cliente?',
        html: `
          <div class="eliminar-cli-contenido">
            <p class="eliminar-cli-texto">¿Estás seguro de eliminar al cliente:</p>
            <p class="eliminar-cli-cliente">${nombreCliente}</p>
            
            <div class="eliminar-cli-advertencia">
              <svg class="eliminar-cli-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <p>Esta acción no se puede deshacer</p>
            </div>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'eliminar-cli-popup',
          title: 'eliminar-cli-titulo',
          htmlContainer: 'eliminar-cli-html',
          confirmButton: 'eliminar-cli-boton-confirmar',
          cancelButton: 'eliminar-cli-boton-cancelar',
          icon: 'eliminar-cli-icono',
          actions: 'eliminar-cli-acciones'
        },
        buttonsStyling: false,
        reverseButtons: true,
        focusCancel: true,
        width: '420px'
      });

      if (resultado.isConfirmed) {
        modalCargando('Eliminando cliente...');

        try {
          // Ejecutar la función de eliminación proporcionada
          await alConfirmar(cliente);

          // Delay mínimo para UX
          await new Promise(resolve => setTimeout(resolve, 600));

          Swal.close();

          // Mostrar éxito
          await Swal.fire({
            title: '¡Eliminado!',
            html: `
              <div class="eliminar-cli-exito-contenido">
                <p class="eliminar-cli-exito-texto">El cliente ha sido eliminado exitosamente</p>
                <p class="eliminar-cli-exito-detalle">Cliente: ${nombreCliente}</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'eliminar-cli-popup',
              title: 'eliminar-cli-titulo-exito',
              htmlContainer: 'eliminar-cli-html',
              confirmButton: 'eliminar-cli-boton-exito',
              icon: 'eliminar-cli-icono-exito'
            },
            buttonsStyling: false,
            timer: 3000,
            timerProgressBar: true
          });
        } catch (error) {
          Swal.close();
          await modalError('No se pudo eliminar el cliente. Intenta nuevamente.');
          console.error('Error al eliminar cliente:', error);
        }
      } else {
        // Usuario canceló
        alConfirmar(null);
      }
    };

    mostrarModal();
  }, [cliente, alConfirmar]);

  // Este componente no renderiza nada visible, el modal es manejado por SweetAlert2
  return null;
};

/**
 * Modal de error genérico
 * @param {string} mensaje - Mensaje de error a mostrar
 */
const modalError = async (mensaje = 'Ocurrió un error al procesar la solicitud') => {
  await Swal.fire({
    title: 'Error',
    text: mensaje,
    icon: 'error',
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'eliminar-cli-popup',
      title: 'eliminar-cli-titulo-error',
      confirmButton: 'eliminar-cli-boton-error',
      icon: 'eliminar-cli-icono-error'
    },
    buttonsStyling: false
  });
};

/**
 * Modal de cargando
 * @param {string} mensaje - Mensaje a mostrar mientras carga
 */
const modalCargando = (mensaje = 'Procesando...') => {
  Swal.fire({
    title: mensaje,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    customClass: {
      popup: 'eliminar-cli-popup-cargando',
      title: 'eliminar-cli-titulo-cargando'
    },
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export default ModalEliminarCliente;