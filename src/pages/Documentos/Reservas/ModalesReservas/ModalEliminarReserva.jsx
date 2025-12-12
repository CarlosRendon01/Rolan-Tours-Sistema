import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import './ModalEliminarReserva.css';

/**
 * Componente Modal para eliminar reserva usando SweetAlert2
 * Se renderiza cuando reservaAEliminar tiene valor
 */
const ModalEliminarReserva = ({ reserva, alConfirmar }) => {
  useEffect(() => {
    if (!reserva) return;

    const mostrarModal = async () => {
      // Validar datos de la reserva
      if (!reserva?.nombreCliente && !reserva?.id) {
        await modalError('Información de la reserva incompleta');
        alConfirmar(null);
        return;
      }

      const nombreReserva = reserva.nombreCliente 
        ? `${reserva.nombreCliente}` 
        : `Reserva #${reserva.id}`;

      const resultado = await Swal.fire({
        title: '¿Eliminar esta reserva?',
        html: `
          <div class="eliminar-res-contenido">
            <p class="eliminar-res-texto">¿Estás seguro de eliminar la reserva de:</p>
            <p class="eliminar-res-reserva">${nombreReserva}</p>
            
            <div class="eliminar-res-advertencia">
              <svg class="eliminar-res-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
          popup: 'eliminar-res-popup',
          title: 'eliminar-res-titulo',
          htmlContainer: 'eliminar-res-html',
          confirmButton: 'eliminar-res-boton-confirmar',
          cancelButton: 'eliminar-res-boton-cancelar',
          icon: 'eliminar-res-icono',
          actions: 'eliminar-res-acciones'
        },
        buttonsStyling: false,
        reverseButtons: true,
        focusCancel: true,
        width: '420px'
      });

      if (resultado.isConfirmed) {
        modalCargando('Eliminando reserva...');

        try {
          // Ejecutar la función de eliminación proporcionada
          await alConfirmar(reserva);

          // Delay mínimo para UX
          await new Promise(resolve => setTimeout(resolve, 600));

          Swal.close();

          // Mostrar éxito
          await Swal.fire({
            title: '¡Eliminada!',
            html: `
              <div class="eliminar-res-exito-contenido">
                <p class="eliminar-res-exito-texto">La reserva ha sido eliminada exitosamente</p>
                <p class="eliminar-res-exito-detalle">Reserva: ${nombreReserva}</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'eliminar-res-popup',
              title: 'eliminar-res-titulo-exito',
              htmlContainer: 'eliminar-res-html',
              confirmButton: 'eliminar-res-boton-exito',
              icon: 'eliminar-res-icono-exito'
            },
            buttonsStyling: false,
            timer: 3000,
            timerProgressBar: true
          });
        } catch (error) {
          Swal.close();
          await modalError('No se pudo eliminar la reserva. Intenta nuevamente.');
          console.error('Error al eliminar reserva:', error);
        }
      } else {
        // Usuario canceló
        alConfirmar(null);
      }
    };

    mostrarModal();
  }, [reserva, alConfirmar]);

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
      popup: 'eliminar-res-popup',
      title: 'eliminar-res-titulo-error',
      confirmButton: 'eliminar-res-boton-error',
      icon: 'eliminar-res-icono-error'
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
      popup: 'eliminar-res-popup-cargando',
      title: 'eliminar-res-titulo-cargando'
    },
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export default ModalEliminarReserva;