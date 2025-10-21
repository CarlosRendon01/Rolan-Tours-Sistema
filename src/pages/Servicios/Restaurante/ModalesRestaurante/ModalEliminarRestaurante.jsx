import Swal from 'sweetalert2';
import './ModalEliminarRestaurante.css';

/**
 * Modal de confirmación para eliminar un restaurante/paquete usando SweetAlert2
 * @param {Object} restaurante - Objeto con información del restaurante/paquete a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarRestaurante = async (restaurante, onConfirmar) => {
  // Validar datos del restaurante
  if (!restaurante?.nombreRestaurante) {
    await modalError('Información del restaurante incompleta');
    return false;
  }

  const tipoTexto = restaurante.tipo === 'restaurante' ? 'Restaurante' : 'Paquete';
  const tipoBadge = restaurante.tipo === 'restaurante' 
    ? '<span class="eliminar-rest-tipo">Restaurante</span>' 
    : '<span class="eliminar-rest-tipo" style="background: #fef3c7; color: #b45309;">Paquete</span>';

  const resultado = await Swal.fire({
    title: `¿Eliminar este ${tipoTexto.toLowerCase()}?`,
    html: `
      <div class="eliminar-rest-contenido">
        <p class="eliminar-rest-texto">¿Estás seguro de eliminar:</p>
        <p class="eliminar-rest-restaurante">${restaurante.nombreRestaurante}</p>
        ${tipoBadge}
        
        <div class="eliminar-rest-advertencia">
          <svg class="eliminar-rest-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <p>Esta acción no se puede deshacer. Se eliminará permanentemente del sistema.</p>
        </div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'eliminar-rest-popup',
      title: 'eliminar-rest-titulo',
      htmlContainer: 'eliminar-rest-html',
      confirmButton: 'eliminar-rest-boton-confirmar',
      cancelButton: 'eliminar-rest-boton-cancelar',
      icon: 'eliminar-rest-icono',
      actions: 'eliminar-rest-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '420px'
  });

  if (resultado.isConfirmed) {
    modalCargando(`Eliminando ${tipoTexto.toLowerCase()}...`);

    try {
      if (onConfirmar) {
        await onConfirmar(restaurante);
      }

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-rest-exito-contenido">
            <p class="eliminar-rest-exito-texto">El ${tipoTexto.toLowerCase()} ha sido eliminado exitosamente</p>
            <p class="eliminar-rest-exito-detalle">${tipoTexto}: ${restaurante.nombreRestaurante}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-rest-popup',
          title: 'eliminar-rest-titulo-exito',
          htmlContainer: 'eliminar-rest-html',
          confirmButton: 'eliminar-rest-boton-exito',
          icon: 'eliminar-rest-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError(`No se pudo eliminar el ${tipoTexto.toLowerCase()}. Intenta nuevamente.`);
      console.error(`Error al eliminar ${tipoTexto.toLowerCase()}:`, error);
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
      popup: 'eliminar-rest-popup',
      title: 'eliminar-rest-titulo-error',
      confirmButton: 'eliminar-rest-boton-error',
      icon: 'eliminar-rest-icono-error'
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
      popup: 'eliminar-rest-popup-cargando',
      title: 'eliminar-rest-titulo-cargando'
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

export default modalEliminarRestaurante;