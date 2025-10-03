import Swal from 'sweetalert2';
import './ModalEliminarAbono.css';

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
 * Formatea una fecha al formato largo en español
 */
const formatearFecha = (fecha) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-MX', opciones);
};

/**
 * Modal de confirmación para eliminar un pago
 * @param {Object} pago - Objeto con información del pago a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarPago = async (pago, onConfirmar) => {
  const resultado = await Swal.fire({
    title: '¿Eliminar este pago?',
    html: `
      <div class="eliminar-contenido">
        <div class="eliminar-alerta">
          <svg class="eliminar-alerta-icono" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="eliminar-alerta-texto">Esta acción no se puede deshacer y eliminará permanentemente todos los registros asociados.</p>
        </div>

        <div class="eliminar-info">
          <div class="eliminar-seccion">
            <div class="eliminar-campo">
              <span class="eliminar-etiqueta">Cliente:</span>
              <span class="eliminar-valor">${pago.cliente.nombre}</span>
            </div>
            <div class="eliminar-campo">
              <span class="eliminar-etiqueta">Email:</span>
              <span class="eliminar-valor-secundario">${pago.cliente.email}</span>
            </div>
          </div>

          <div class="eliminar-seccion">
            <div class="eliminar-campo">
              <span class="eliminar-etiqueta">Servicio:</span>
              <span class="eliminar-valor">${pago.servicio.tipo}</span>
            </div>
            <div class="eliminar-campo">
              <span class="eliminar-etiqueta">Descripción:</span>
              <span class="eliminar-valor-secundario">${pago.servicio.descripcion}</span>
            </div>
          </div>

          <div class="eliminar-seccion-financiera">
            <div class="eliminar-monto-item">
              <span class="eliminar-monto-label">Monto Total:</span>
              <span class="eliminar-monto-valor">${formatearMoneda(pago.planPago.montoTotal)}</span>
            </div>
            <div class="eliminar-monto-item">
              <span class="eliminar-monto-label">Pagado:</span>
              <span class="eliminar-monto-valor pagado">${formatearMoneda(pago.planPago.montoPagado)}</span>
            </div>
            <div class="eliminar-monto-item">
              <span class="eliminar-monto-label">Pendiente:</span>
              <span class="eliminar-monto-valor pendiente">${formatearMoneda(pago.planPago.saldoPendiente)}</span>
            </div>
          </div>

          ${pago.planPago.abonosRealizados > 0 ? `
            <div class="eliminar-advertencia-abonos">
              <svg class="eliminar-advertencia-icono" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01"/>
              </svg>
              <p>Este pago tiene <strong>${pago.planPago.abonosRealizados} abono(s)</strong> registrado(s) que también se eliminarán.</p>
            </div>
          ` : ''}

          <div class="eliminar-detalles">
            <div class="eliminar-detalle-item">
              <span>Contrato:</span>
              <span>${pago.numeroContrato}</span>
            </div>
            <div class="eliminar-detalle-item">
              <span>Fecha del Tour:</span>
              <span>${formatearFecha(pago.servicio.fechaTour)}</span>
            </div>
            <div class="eliminar-detalle-item">
              <span>Estado:</span>
              <span class="eliminar-estado ${pago.estado.toLowerCase()}">${pago.estado === 'FINALIZADO' ? 'Finalizado' : 'En Proceso'}</span>
            </div>
          </div>
        </div>

        <div class="eliminar-consecuencias">
          <p class="eliminar-consecuencias-titulo">Se eliminará permanentemente:</p>
          <ul class="eliminar-lista">
            <li>Toda la información del contrato y plan de pagos</li>
            <li>El historial completo de ${pago.planPago.abonosRealizados} abono(s)</li>
            <li>Los registros de métodos de pago utilizados</li>
            <li>Referencias a recibos generados</li>
          </ul>
        </div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar permanentemente',
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
    width: '600px',
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    }
  });

  if (resultado.isConfirmed) {
    // Mostrar modal de cargando
    modalCargando('Eliminando pago...');

    try {
      // Ejecutar la función de eliminación
      if (onConfirmar) {
        await onConfirmar(pago.id);
      }

      // Simular delay mínimo
      await new Promise(resolve => setTimeout(resolve, 800));

      // Cerrar modal de cargando
      Swal.close();

      // Mostrar mensaje de éxito
      await Swal.fire({
        title: '¡Eliminado exitosamente!',
        html: `
          <div class="eliminar-exito-contenido">
            <p class="eliminar-exito-texto">El pago ha sido eliminado permanentemente del sistema.</p>
            <div class="eliminar-exito-detalles">
              <div class="eliminar-exito-item">
                <span class="eliminar-exito-label">Cliente:</span>
                <span class="eliminar-exito-valor">${pago.cliente.nombre}</span>
              </div>
              <div class="eliminar-exito-item">
                <span class="eliminar-exito-label">Contrato:</span>
                <span class="eliminar-exito-valor">${pago.numeroContrato}</span>
              </div>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'eliminar-popup-exito',
          title: 'eliminar-titulo-exito',
          htmlContainer: 'eliminar-html',
          confirmButton: 'eliminar-boton-exito',
          icon: 'eliminar-icono-exito'
        },
        buttonsStyling: false,
        timer: 3500,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      // Cerrar modal de cargando
      Swal.close();

      // Mostrar error
      await modalError('Ocurrió un error al eliminar el pago. Por favor, intenta nuevamente.');
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
      popup: 'eliminar-popup-error',
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

export default modalEliminarPago;