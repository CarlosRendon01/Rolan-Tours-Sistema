import Swal from 'sweetalert2';
import './ModalEliminarReserva.css';

/**
 * Modal de confirmación para eliminar un guía usando SweetAlert2
 * @param {Object} reserva - Objeto con información del guía a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarReserva = async (reserva, onConfirmar) => {
  // Validar datos del guía
  if (!reserva?.nombre || !reserva?.apellidoPaterno) {
    await modalError('Información del guía incompleta');
    return false;
  }

  const nombreCompleto = `${reserva.nombre} ${reserva.apellidoPaterno} ${reserva.apellidoMaterno || ''}`.trim();

  const resultado = await Swal.fire({
    title: '¿Eliminar este guía?',
    html: `
      <div class="eliminar-reserva-contenido">
        <p class="eliminar-reserva-texto">¿Estás seguro de eliminar al guía:</p>
        <p class="eliminar-reserva-reserva">${nombreCompleto}</p>
        
        <div class="eliminar-reserva-advertencia">
          <svg class="eliminar-reserva-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
      popup: 'eliminar-reserva-popup',
      title: 'eliminar-reserva-titulo',
      htmlContainer: 'eliminar-reserva-html',
      confirmButton: 'eliminar-reserva-boton-confirmar',
      cancelButton: 'eliminar-reserva-boton-cancelar',
      icon: 'eliminar-reserva-icono',
      actions: 'eliminar-reserva-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '420px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando guía...');

    try {
      if (onConfirmar) {
        await onConfirmar(reserva);
      }

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-reserva-exito-contenido">
            <p class="eliminar-reserva-exito-texto">El guía ha sido eliminado exitosamente</p>
            <p class="eliminar-reserva-exito-detalle">Guía: ${nombreCompleto}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-reserva-popup',
          title: 'eliminar-reserva-titulo-exito',
          htmlContainer: 'eliminar-reserva-html',
          confirmButton: 'eliminar-reserva-boton-exito',
          icon: 'eliminar-reserva-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar el guía. Intenta nuevamente.');
      console.error('Error al eliminar guía:', error);
      return false;
    }
  }

  return false;
};

/**
 * Modal de error genérico
 * @param {string} mensaje - Mensaje de error a mostrar
 */
export const modalError = async (mensaje = 'Ocurrió un error al procesar la solicitud') => {
  await Swal.fire({
    title: 'Error',
    text: mensaje,
    icon: 'error',
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'eliminar-reserva-popup',
      title: 'eliminar-reserva-titulo-error',
      confirmButton: 'eliminar-reserva-boton-error',
      icon: 'eliminar-reserva-icono-error'
    },
    buttonsStyling: false
  });
};

/**
 * Modal de cargando
 * @param {string} mensaje - Mensaje a mostrar mientras carga
 */
export const modalCargando = (mensaje = 'Procesando...') => {
  Swal.fire({
    title: mensaje,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    customClass: {
      popup: 'eliminar-reserva-popup-cargando',
      title: 'eliminar-reserva-titulo-cargando'
    },
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

/**
 * Cerrar modal de cargando
 */
export const cerrarModalCargando = () => {
  Swal.close();
};

export default modalEliminarReserva;