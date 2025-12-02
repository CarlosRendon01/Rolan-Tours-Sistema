import Swal from 'sweetalert2';
import './ModalEliminarTransporte.css';

/**
 * Modal de confirmación para eliminar un servicio de transporte usando SweetAlert2
 * @param {Object} transporte - Objeto con información del transporte a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarTransporte = async (transporte, onConfirmar) => {
  // Validar datos del transporte
  if (!transporte?.nombre_servicio) {
    await modalError('Información del servicio de transporte incompleta');
    return false;
  }

  const nombreServicio = transporte.nombre_servicio;
  const codigoServicio = transporte.codigo_servicio
    ? `Código: ${transporte.codigo_servicio}`
    : `Servicio #${transporte.id?.toString().padStart(3, '0')}`;

  const resultado = await Swal.fire({
    title: '¿Eliminar este servicio de transporte?',
    html: `
      <div class="eliminar-trans-contenido">
        <p class="eliminar-trans-texto">¿Estás seguro de eliminar el servicio:</p>
        <p class="eliminar-trans-servicio">${nombreServicio}</p>
        <p class="eliminar-trans-codigo">${codigoServicio}</p>
        
        <div class="eliminar-trans-advertencia">
          <svg class="eliminar-trans-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
      popup: 'eliminar-trans-popup',
      title: 'eliminar-trans-titulo',
      htmlContainer: 'eliminar-trans-html',
      confirmButton: 'eliminar-trans-boton-confirmar',
      cancelButton: 'eliminar-trans-boton-cancelar',
      icon: 'eliminar-trans-icono',
      actions: 'eliminar-trans-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '420px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando servicio de transporte...');

    try {
      if (onConfirmar) {
        await onConfirmar(transporte);
      }

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-trans-exito-contenido">
            <p class="eliminar-trans-exito-texto">El servicio de transporte ha sido eliminado exitosamente</p>
            <p class="eliminar-trans-exito-detalle">Servicio: ${nombreServicio}</p>
            <p class="eliminar-trans-exito-codigo">${codigoServicio}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-trans-popup',
          title: 'eliminar-trans-titulo-exito',
          htmlContainer: 'eliminar-trans-html',
          confirmButton: 'eliminar-trans-boton-exito',
          icon: 'eliminar-trans-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar el servicio de transporte. Intenta nuevamente.');
      console.error('Error al eliminar transporte:', error);
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
      popup: 'eliminar-trans-popup',
      title: 'eliminar-trans-titulo-error',
      confirmButton: 'eliminar-trans-boton-error',
      icon: 'eliminar-trans-icono-error'
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
      popup: 'eliminar-trans-popup-cargando',
      title: 'eliminar-trans-titulo-cargando'
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

export default modalEliminarTransporte;