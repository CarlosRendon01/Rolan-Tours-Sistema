import Swal from 'sweetalert2';
import './ModalEliminarProveedor.css';

/**
 * Modal de confirmación para eliminar un proveedor usando SweetAlert2
 * @param {Object} proveedor - Objeto con información del proveedor a eliminar
 * @param {Function} onConfirmar - Callback cuando se confirma la eliminación
 * @returns {Promise<boolean>} - true si se confirmó la eliminación, false si se canceló
 */
export const modalEliminarProveedor = async (proveedor, onConfirmar) => {
  // Validar datos del proveedor
  if (!proveedor?.nombre_razon_social) {
    await modalError('Información del proveedor incompleta');
    return false;
  }

  // Función para obtener clase de badge de tipo
  const obtenerClaseTipo = (tipo) => {
    const tipos = {
      'Transporte': 'transporte',
      'Hospedaje': 'hospedaje',
      'Restaurante': 'restaurante',
      'Otro': 'otro'
    };
    return tipos[tipo] || 'otro';
  };

  // Función para obtener icono de tipo
  const obtenerIconoTipo = (tipo) => {
    switch(tipo) {
      case 'Transporte':
        return '🚚';
      case 'Hospedaje':
        return '🏨';
      case 'Restaurante':
        return '🍽️';
      default:
        return '📦';
    }
  };

  const nombreProveedor = proveedor.nombre_razon_social;
  const tipoProveedor = proveedor.tipo_proveedor || 'Otro';
  const claseTipo = obtenerClaseTipo(tipoProveedor);
  const iconoTipo = obtenerIconoTipo(tipoProveedor);

  const resultado = await Swal.fire({
    title: '¿Eliminar este proveedor?',
    html: `
      <div class="eliminar-prov-contenido">
        <p class="eliminar-prov-texto">¿Estás seguro de eliminar al proveedor:</p>
        <p class="eliminar-prov-proveedor">${nombreProveedor}</p>
        <span class="eliminar-prov-tipo ${claseTipo}">${iconoTipo} ${tipoProveedor}</span>
        
        <div class="eliminar-prov-advertencia">
          <svg class="eliminar-prov-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
      popup: 'eliminar-prov-popup',
      title: 'eliminar-prov-titulo',
      htmlContainer: 'eliminar-prov-html',
      confirmButton: 'eliminar-prov-boton-confirmar',
      cancelButton: 'eliminar-prov-boton-cancelar',
      icon: 'eliminar-prov-icono',
      actions: 'eliminar-prov-acciones'
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    width: '420px'
  });

  if (resultado.isConfirmed) {
    modalCargando('Eliminando proveedor...');

    try {
      if (onConfirmar) {
        await onConfirmar(proveedor);
      }

      // Delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 600));

      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        title: '¡Eliminado!',
        html: `
          <div class="eliminar-prov-exito-contenido">
            <p class="eliminar-prov-exito-texto">El proveedor ha sido eliminado exitosamente</p>
            <p class="eliminar-prov-exito-detalle">Proveedor: ${nombreProveedor}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'eliminar-prov-popup',
          title: 'eliminar-prov-titulo-exito',
          htmlContainer: 'eliminar-prov-html',
          confirmButton: 'eliminar-prov-boton-exito',
          icon: 'eliminar-prov-icono-exito'
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });

      return true;
    } catch (error) {
      Swal.close();
      await modalError('No se pudo eliminar el proveedor. Intenta nuevamente.');
      console.error('Error al eliminar proveedor:', error);
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
      popup: 'eliminar-prov-popup',
      title: 'eliminar-prov-titulo-error',
      confirmButton: 'eliminar-prov-boton-error',
      icon: 'eliminar-prov-icono-error'
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
      popup: 'eliminar-prov-popup-cargando',
      title: 'eliminar-prov-titulo-cargando'
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

export default modalEliminarProveedor;