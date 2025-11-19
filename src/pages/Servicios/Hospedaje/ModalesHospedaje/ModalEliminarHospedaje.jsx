import Swal from 'sweetalert2';
import './ModalEliminarHospedaje.css';

/**
 * Modal de confirmación para eliminar un hospedaje usando SweetAlert2
 * @param {Object} hospedaje - Objeto con información del hospedaje a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarHospedaje = async (hospedaje, onConfirmar) => {
  // Validar datos del hospedaje
  if (!hospedaje?.nombre_servicio || !hospedaje?.codigo_servicio) {
    await modalError('Información del hospedaje incompleta');
    return false;
  }

  const nombreServicio = hospedaje.nombre_servicio;
  const codigoServicio = hospedaje.codigo_servicio;

  const resultado = await Swal.fire({
    title: '¿Eliminar este hospedaje?',
    html: `
      <div class="eliminar-hosp-contenido">
        <p class="eliminar-hosp-texto">¿Estás seguro de eliminar el servicio:</p>
        <p class="eliminar-hosp-servicio">${nombreServicio}</p>
        <p class="eliminar-hosp-codigo">${codigoServicio}</p>
        
        <div class="eliminar-hosp-advertencia">
          <svg class="eliminar-hosp-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
      popup: 'eliminar-hosp-popup',
      title: 'eliminar-hosp-titulo',
      htmlContainer: 'eliminar-hosp-html',
      confirmButton: 'eliminar-hosp-boton-confirmar',
      cancelButton: 'eliminar-hosp-boton-cancelar',
      icon: 'eliminar-hosp-icono',
      actions: 'eliminar-hosp-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '420px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando hospedaje...');

    try {
      if (onConfirmar) {
        await onConfirmar(hospedaje);
      }

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-hosp-exito-contenido">
            <p class="eliminar-hosp-exito-texto">El hospedaje ha sido eliminado exitosamente</p>
            <p class="eliminar-hosp-exito-detalle">Servicio: ${nombreServicio}</p>
            <p class="eliminar-hosp-exito-detalle">${codigoServicio}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-hosp-popup',
          title: 'eliminar-hosp-titulo-exito',
          htmlContainer: 'eliminar-hosp-html',
          confirmButton: 'eliminar-hosp-boton-exito',
          icon: 'eliminar-hosp-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar el hospedaje. Intenta nuevamente.');
      console.error('Error al eliminar hospedaje:', error);
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
      popup: 'eliminar-hosp-popup',
      title: 'eliminar-hosp-titulo-error',
      confirmButton: 'eliminar-hosp-boton-error',
      icon: 'eliminar-hosp-icono-error'
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
      popup: 'eliminar-hosp-popup-cargando',
      title: 'eliminar-hosp-titulo-cargando'
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

export default modalEliminarHospedaje;