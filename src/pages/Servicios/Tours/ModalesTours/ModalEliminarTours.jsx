import Swal from 'sweetalert2';
import './ModalEliminarTours.css';

/**
 * Modal de confirmación para eliminar un tour usando SweetAlert2
 * @param {Object} tour - Objeto con información del tour a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarTour = async (tour, onConfirmar) => {
  // Validar datos del tour
  if (!tour?.nombre_tour || !tour?.codigo_tour) {
    await modalError('Información del tour incompleta');
    return false;
  }

  const nombreTour = tour.nombre_tour;
  const codigoTour = tour.codigo_tour;

  const resultado = await Swal.fire({
    title: '¿Eliminar este tour?',
    html: `
      <div class="eliminar-tour-contenido">
        <p class="eliminar-tour-texto">¿Estás seguro de eliminar el tour:</p>
        <p class="eliminar-tour-nombre">${nombreTour}</p>
        <p class="eliminar-tour-codigo">${codigoTour}</p>
        
        <div class="eliminar-tour-advertencia">
          <svg class="eliminar-tour-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
      popup: 'eliminar-tour-popup',
      title: 'eliminar-tour-titulo',
      htmlContainer: 'eliminar-tour-html',
      confirmButton: 'eliminar-tour-boton-confirmar',
      cancelButton: 'eliminar-tour-boton-cancelar',
      icon: 'eliminar-tour-icono',
      actions: 'eliminar-tour-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '420px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando tour...');

    try {
      if (onConfirmar) {
        await onConfirmar(tour);
      }

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-tour-exito-contenido">
            <p class="eliminar-tour-exito-texto">El tour ha sido eliminado exitosamente</p>
            <p class="eliminar-tour-exito-detalle">Tour: ${nombreTour}</p>
            <p class="eliminar-tour-exito-detalle">${codigoTour}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-tour-popup',
          title: 'eliminar-tour-titulo-exito',
          htmlContainer: 'eliminar-tour-html',
          confirmButton: 'eliminar-tour-boton-exito',
          icon: 'eliminar-tour-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar el tour. Intenta nuevamente.');
      console.error('Error al eliminar tour:', error);
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
      popup: 'eliminar-tour-popup',
      title: 'eliminar-tour-titulo-error',
      confirmButton: 'eliminar-tour-boton-error',
      icon: 'eliminar-tour-icono-error'
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
      popup: 'eliminar-tour-popup-cargando',
      title: 'eliminar-tour-titulo-cargando'
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

export default modalEliminarTour;