import Swal from 'sweetalert2';
import './ModalEliminarGuia.css';

/**
 * Modal de confirmación para eliminar un guía usando SweetAlert2
 * @param {Object} guia - Objeto con información del guía a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarGuia = async (guia, onConfirmar) => {
  // Validar datos del guía
  if (!guia?.nombre || !guia?.apellidoPaterno) {
    await modalError('Información del guía incompleta');
    return false;
  }

  const nombreCompleto = `${guia.nombre} ${guia.apellidoPaterno} ${guia.apellidoMaterno || ''}`.trim();

  const resultado = await Swal.fire({
    title: '¿Eliminar este guía?',
    html: `
      <div class="eliminar-guia-contenido">
        <p class="eliminar-guia-texto">¿Estás seguro de eliminar al guía:</p>
        <p class="eliminar-guia-guia">${nombreCompleto}</p>
        
        <div class="eliminar-guia-advertencia">
          <svg class="eliminar-guia-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
      popup: 'eliminar-guia-popup',
      title: 'eliminar-guia-titulo',
      htmlContainer: 'eliminar-guia-html',
      confirmButton: 'eliminar-guia-boton-confirmar',
      cancelButton: 'eliminar-guia-boton-cancelar',
      icon: 'eliminar-guia-icono',
      actions: 'eliminar-guia-acciones'
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
        await onConfirmar(guia);
      }

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-guia-exito-contenido">
            <p class="eliminar-guia-exito-texto">El guía ha sido eliminado exitosamente</p>
            <p class="eliminar-guia-exito-detalle">Guía: ${nombreCompleto}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-guia-popup',
          title: 'eliminar-guia-titulo-exito',
          htmlContainer: 'eliminar-guia-html',
          confirmButton: 'eliminar-guia-boton-exito',
          icon: 'eliminar-guia-icono-exito'
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
      popup: 'eliminar-guia-popup',
      title: 'eliminar-guia-titulo-error',
      confirmButton: 'eliminar-guia-boton-error',
      icon: 'eliminar-guia-icono-error'
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
      popup: 'eliminar-guia-popup-cargando',
      title: 'eliminar-guia-titulo-cargando'
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

export default modalEliminarGuia;