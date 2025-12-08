import Swal from 'sweetalert2';
import axios from 'axios';
import './ModalEliminarCoordinador.css';

export const modalEliminarCoordinador = async (coordinador, onConfirmar) => {
  // Validar datos del coordinador
  if (!coordinador?.nombre || !coordinador?.apellido_paterno) {
    await modalError('Información del coordinador incompleta');
    return false;
  }

  const nombreCompleto = `${coordinador.nombre} ${coordinador.apellido_paterno} ${coordinador.apellido_materno || ''}`.trim();

  const resultado = await Swal.fire({
    title: '¿Eliminar este coordinador?',
    html: `
      <div class="eliminar-coord-contenido">
        <p class="eliminar-coord-texto">¿Estás seguro de eliminar al coordinador:</p>
        <p class="eliminar-coord-coordinador">${nombreCompleto}</p>
        
        <div class="eliminar-coord-advertencia">
          <svg class="eliminar-coord-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
      popup: 'eliminar-coord-popup',
      title: 'eliminar-coord-titulo',
      htmlContainer: 'eliminar-coord-html',
      confirmButton: 'eliminar-coord-boton-confirmar',
      cancelButton: 'eliminar-coord-boton-cancelar',
      icon: 'eliminar-coord-icono',
      actions: 'eliminar-coord-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '420px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando coordinador...');

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/coordinadores/${coordinador.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      if (onConfirmar) {
        await onConfirmar(coordinador);
      }

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-coord-exito-contenido">
            <p class="eliminar-coord-exito-texto">El coordinador ha sido eliminado exitosamente</p>
            <p class="eliminar-coord-exito-detalle">Coordinador: ${nombreCompleto}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-coord-popup',
          title: 'eliminar-coord-titulo-exito',
          htmlContainer: 'eliminar-coord-html',
          confirmButton: 'eliminar-coord-boton-exito',
          icon: 'eliminar-coord-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar el coordinador. Intenta nuevamente.');
      console.error('Error al eliminar coordinador:', error);
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
      popup: 'eliminar-coord-popup',
      title: 'eliminar-coord-titulo-error',
      confirmButton: 'eliminar-coord-boton-error',
      icon: 'eliminar-coord-icono-error'
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
      popup: 'eliminar-coord-popup-cargando',
      title: 'eliminar-coord-titulo-cargando'
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

export default modalEliminarCoordinador;