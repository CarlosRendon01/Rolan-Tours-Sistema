import Swal from 'sweetalert2';
import './ModalEliminarVehiculo.css';

/**
 * Modal de confirmación para eliminar un vehículo usando SweetAlert2
 * @param {Object} vehiculo - Objeto con información del vehículo a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarVehiculo = async (vehiculo, onConfirmar) => {
  // Validar datos del vehículo
  if (!vehiculo?.nombre) {
    await modalError('Información del vehículo incompleta');
    return false;
  }

  const resultado = await Swal.fire({
    title: '¿Eliminar este vehículo?',
    html: `
      <div class="eliminar-contenido">
        <p class="eliminar-texto">¿Estás seguro de eliminar el vehículo:</p>
        <p class="eliminar-cliente">${vehiculo.nombre}</p>
        
        <div class="eliminar-advertencia">
          <svg class="eliminar-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
      popup: 'eliminar-popup',
      title: 'eliminar-titulo',
      htmlContainer: 'eliminar-html',
      confirmButton: 'eliminar-boton-confirmar',
      cancelButton: 'eliminar-boton-cancelar',
      icon: 'eliminar-icono',
      actions: 'eliminar-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '420px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando vehículo...');

    try {
      if (onConfirmar) {
        await onConfirmar(vehiculo);
      }

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-exito-contenido">
            <p class="eliminar-exito-texto">El vehículo ha sido eliminado exitosamente</p>
            <p class="eliminar-exito-detalle">Vehículo: ${vehiculo.nombre}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-popup',
          title: 'eliminar-titulo-exito',
          htmlContainer: 'eliminar-html',
          confirmButton: 'eliminar-boton-exito',
          icon: 'eliminar-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar el vehículo. Intenta nuevamente.');
      console.error('Error al eliminar vehículo:', error);
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
      popup: 'eliminar-popup',
      title: 'eliminar-titulo-error',
      confirmButton: 'eliminar-boton-error',
      icon: 'eliminar-icono-error'
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
      popup: 'eliminar-popup-cargando',
      title: 'eliminar-titulo-cargando'
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

export default modalEliminarVehiculo;