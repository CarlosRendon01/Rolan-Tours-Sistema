import Swal from 'sweetalert2';
import axios from "axios";
import './modalEliminarPago.css';

/**
 * Modal de confirmación para eliminar un pago
 * @param {Object} pago - Objeto con información del pago
 * @param {Function} onConfirm - Callback cuando se confirma la eliminación
 */
export const modalEliminarPago = async (pago, onConfirm) => {
  const resultado = await Swal.fire({
    title: '¿Eliminar pago?',
    html: `
      <div class="alerta-contenido">
        <p class="alerta-texto">¿Estás seguro de eliminar el pago de:</p>
        <p class="alerta-cliente">${pago.cliente?.nombre || 'Sin nombre'}</p>
        <p class="alerta-monto">${pago.planPago.montoTotal}</p>
        
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'alerta-popup',
      title: 'alerta-titulo',
      htmlContainer: 'alerta-html',
      confirmButton: 'alerta-boton-confirmar',
      cancelButton: 'alerta-boton-cancelar',
      icon: 'alerta-icono',
      actions: 'alerta-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '400px'
  });

  if (resultado.isConfirmed) {
    // Ejecutar la función de eliminación
    const token = localStorage.getItem("token");
    await axios.delete(`http://127.0.0.1:8000/api/pagos/${pago.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (onConfirm) {
      await onConfirm(pago);
    }

    // Mostrar mensaje de éxito
    await Swal.fire({
      title: '¡Eliminado!',
      html: `
        <div class="alerta-contenido-exito">
          <p class="alerta-texto-exito">El pago ha sido eliminado exitosamente</p>
          <p class="alerta-detalle-exito">Cliente: ${pago.cliente?.nombre || 'Sin nombre'}</p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'alerta-popup',
        title: 'alerta-titulo-exito',
        htmlContainer: 'alerta-html',
        confirmButton: 'alerta-boton-exito',
        icon: 'alerta-icono-exito'
      },
      buttonsStyling: false,
      timer: 3000,
      timerProgressBar: true
    });

    return true;
  }

  return false;
};

/**
 * Modal de error genérica
 * @param {string} mensaje - Mensaje de error a mostrar
 */
export const modalError = async (mensaje = 'Ocurrió un error al procesar la solicitud') => {
  await Swal.fire({
    title: 'Error',
    text: mensaje,
    icon: 'error',
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'alerta-popup',
      title: 'alerta-titulo-error',
      confirmButton: 'alerta-boton-error',
      icon: 'alerta-icono-error'
    },
    buttonsStyling: false
  });
};

/**
 * Modal de cargando
 */
export const modalCargando = (mensaje = 'Procesando...') => {
  Swal.fire({
    title: mensaje,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    customClass: {
      popup: 'alerta-popup-cargando',
      title: 'alerta-titulo-cargando'
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