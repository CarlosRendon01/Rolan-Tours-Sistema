import Swal from 'sweetalert2';
import axios from 'axios';
import './ModalEliminarOperador.css';

/**
 * Modal de confirmación para eliminar un operador usando SweetAlert2
 * @param {Object} operador - Objeto con información del operador a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarOperador = async (operador, onConfirmar) => {
  // Validar datos del operador
  if (!operador?.nombre || !operador?.apellidoPaterno) {
    await modalError('Información del operador incompleta');
    return false;
  }

  const nombreCompleto = `${operador.nombre} ${operador.apellidoPaterno} ${operador.apellidoMaterno || ''}`.trim();

  const resultado = await Swal.fire({
    title: '¿Eliminar este operador?',
    html: `
      <div class="eliminar-op-contenido">
        <p class="eliminar-op-texto">¿Estás seguro de eliminar al operador:</p>
        <p class="eliminar-op-operador">${nombreCompleto}</p>
        
        <div class="eliminar-op-advertencia">
          <svg class="eliminar-op-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
      popup: 'eliminar-op-popup',
      title: 'eliminar-op-titulo',
      htmlContainer: 'eliminar-op-html',
      confirmButton: 'eliminar-op-boton-confirmar',
      cancelButton: 'eliminar-op-boton-cancelar',
      icon: 'eliminar-op-icono',
      actions: 'eliminar-op-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '420px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando operador...');

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/operadores/${operador.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      if (onConfirmar) {
        await onConfirmar(operador);
      }

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-op-exito-contenido">
            <p class="eliminar-op-exito-texto">El operador ha sido eliminado exitosamente</p>
            <p class="eliminar-op-exito-detalle">Operador: ${nombreCompleto}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-op-popup',
          title: 'eliminar-op-titulo-exito',
          htmlContainer: 'eliminar-op-html',
          confirmButton: 'eliminar-op-boton-exito',
          icon: 'eliminar-op-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar el operador. Intenta nuevamente.');
      console.error('Error al eliminar operador:', error);
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
      popup: 'eliminar-op-popup',
      title: 'eliminar-op-titulo-error',
      confirmButton: 'eliminar-op-boton-error',
      icon: 'eliminar-op-icono-error'
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
      popup: 'eliminar-op-popup-cargando',
      title: 'eliminar-op-titulo-cargando'
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

export default modalEliminarOperador;