import Swal from 'sweetalert2';
import './ModalEliminarFactura.css';

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
 * Trunca un UUID para mostrar
 */
const truncarUUID = (uuid, length = 20) => {
  if (!uuid) return 'N/A';
  return uuid.length > length ? `${uuid.substring(0, length)}...` : uuid;
};

/**
 * Modal de confirmación para eliminar una factura
 * @param {Object} factura - Objeto con información de la factura a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarFactura = async (factura, onConfirmar) => {
  // Validar datos de la factura
  if (!factura?.numeroFactura || !factura?.cliente || !factura?.monto) {
    await modalError('Información de la factura incompleta');
    return false;
  }

  const esTimbrada = factura.estado === 'Timbrada' || factura.estado === 'TIMBRADA';
  const esCancelada = factura.estado === 'Cancelada' || factura.estado === 'CANCELADA';

  const resultado = await Swal.fire({
    title: '¿Eliminar esta factura?',
    html: `
      <div class="eliminar-factura-contenido">
        <p class="eliminar-factura-texto">¿Estás seguro de eliminar la factura:</p>
        <p class="eliminar-factura-numero">${factura.numeroFactura}</p>
        ${factura.serie && factura.folio ? `
          <p class="eliminar-factura-serie">Serie ${factura.serie} - Folio ${factura.folio}</p>
        ` : ''}
        <span class="eliminar-factura-estado ${esTimbrada ? 'timbrada' : 'cancelada'}">
          ${esTimbrada ? '✓ Timbrada' : '✕ Cancelada'}
        </span>
        <p class="eliminar-factura-cliente">${factura.cliente}</p>
        ${factura.rfc ? `<p class="eliminar-factura-rfc">RFC: ${factura.rfc}</p>` : ''}
        <p class="eliminar-factura-monto">${formatearMoneda(factura.monto)}</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'eliminar-factura-popup',
      title: 'eliminar-factura-titulo',
      htmlContainer: 'eliminar-factura-html',
      confirmButton: 'eliminar-factura-boton-confirmar',
      cancelButton: 'eliminar-factura-boton-cancelar',
      icon: 'eliminar-factura-icono',
      actions: 'eliminar-factura-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '400px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando factura...');

    try {
      if (onConfirmar) {
        await onConfirmar(factura.id);
      }

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminada!',
        html: `
          <div class="eliminar-factura-exito-contenido">
            <p class="eliminar-factura-exito-texto">La factura ha sido eliminada exitosamente</p>
            <p class="eliminar-factura-exito-detalle">
              Factura: <span class="eliminar-factura-exito-numero">${factura.numeroFactura}</span>
            </p>
            <p class="eliminar-factura-exito-detalle">Cliente: ${factura.cliente}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-factura-popup',
          title: 'eliminar-factura-titulo-exito',
          htmlContainer: 'eliminar-factura-html',
          confirmButton: 'eliminar-factura-boton-exito',
          icon: 'eliminar-factura-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar la factura. Intenta nuevamente.');
      console.error('Error al eliminar factura:', error);
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
      popup: 'eliminar-factura-popup',
      title: 'eliminar-factura-titulo-error',
      confirmButton: 'eliminar-factura-boton-error',
      icon: 'eliminar-factura-icono-error'
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
      popup: 'eliminar-factura-popup-cargando',
      title: 'eliminar-factura-titulo-cargando'
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

export default modalEliminarFactura;