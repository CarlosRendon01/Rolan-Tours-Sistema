import Swal from 'sweetalert2';
import axios from 'axios';
import './ModalEliminarRecibo.css';

/**
 * Formatea una cantidad como moneda mexicana
 */
const formatearMoneda = (cantidad) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(cantidad);
};

/**
 * Formatea una fecha
 */
const formatearFecha = (fecha) => {
  try {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return fecha;
  }
};

/**
 * Modal de confirmación para eliminar un recibo
 * @param {Object} recibo - Objeto con información del recibo a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarRecibo = async (recibo, onConfirmar) => {
  // Validar datos del recibo
  if (!recibo?.numeroRecibo || !recibo?.cliente || !recibo?.monto) {
    await modalError('Información del recibo incompleta');
    return false;
  }

  const resultado = await Swal.fire({
    title: '¿Eliminar este recibo?',
    html: `
      <div class="eliminar-recibo-contenido">
        <p class="eliminar-recibo-texto">¿Estás seguro de eliminar el recibo:</p>
        <p class="eliminar-recibo-numero">${recibo.numeroRecibo}</p>
        <p class="eliminar-recibo-cliente">${recibo.cliente}</p>
        <p class="eliminar-recibo-monto">${formatearMoneda(recibo.monto)}</p>
        <p class="eliminar-recibo-aviso">Esta acción no se puede deshacer</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'eliminar-recibo-popup',
      title: 'eliminar-recibo-titulo',
      htmlContainer: 'eliminar-recibo-html',
      confirmButton: 'eliminar-recibo-boton-confirmar',
      cancelButton: 'eliminar-recibo-boton-cancelar',
      icon: 'eliminar-recibo-icono',
      actions: 'eliminar-recibo-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '400px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando recibo...');

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/abonos/${recibo.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      await new Promise(resolve => setTimeout(resolve, 600));
      Swal.close();

      await Swal.fire({
        title: '¡Eliminado!',
        html: `
        <div class="eliminar-recibo-exito-contenido">
          <p class="eliminar-recibo-exito-texto">El recibo ha sido eliminado exitosamente</p>
          <p class="eliminar-recibo-exito-detalle">
            Recibo: <span class="eliminar-recibo-exito-numero">${recibo.numeroRecibo}</span>
          </p>
          <p class="eliminar-recibo-exito-detalle">Cliente: ${recibo.cliente}</p>
        </div>
      `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-recibo-popup',
          title: 'eliminar-recibo-titulo-exito',
          htmlContainer: 'eliminar-recibo-html',
          confirmButton: 'eliminar-recibo-boton-exito',
          icon: 'eliminar-recibo-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      if (onConfirmar) await onConfirmar();

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar el recibo. Intenta nuevamente.');
      console.error('Error al eliminar recibo:', error);
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
      popup: 'eliminar-recibo-popup',
      title: 'eliminar-recibo-titulo-error',
      confirmButton: 'eliminar-recibo-boton-error',
      icon: 'eliminar-recibo-icono-error'
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
      popup: 'eliminar-recibo-popup-cargando',
      title: 'eliminar-recibo-titulo-cargando'
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

export default modalEliminarRecibo;