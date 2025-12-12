import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import './ModalEliminarOrden.css';

const ModalEliminarOrden = ({ orden, alConfirmar, esAdministrador }) => {
  useEffect(() => {
    if (!orden) return;

    const mostrarModal = async () => {
      // Validar datos de la orden
      if (!orden?.folio && !orden?.nombre_cliente) {
        await modalError('Información de la orden incompleta');
        alConfirmar(null);
        return;
      }

      const nombreOrden = orden.nombre_cliente 
        ? `${orden.nombre_cliente} - Folio #${orden.folio}` 
        : `Orden #${orden.folio || orden.id}`;

      const resultado = await Swal.fire({
        title: '¿Eliminar esta orden?',
        html: `
          <div class="eliminar-ord-contenido">
            <p class="eliminar-ord-texto">¿Estás seguro de eliminar la orden:</p>
            <p class="eliminar-ord-orden">${nombreOrden}</p>
            
            <div class="eliminar-ord-advertencia">
              <svg class="eliminar-ord-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
          popup: 'eliminar-ord-popup',
          title: 'eliminar-ord-titulo',
          htmlContainer: 'eliminar-ord-html',
          confirmButton: 'eliminar-ord-boton-confirmar',
          cancelButton: 'eliminar-ord-boton-cancelar',
          icon: 'eliminar-ord-icono',
          actions: 'eliminar-ord-acciones'
        },
        buttonsStyling: false,
        reverseButtons: true,
        focusCancel: true,
        width: '420px'
      });

      if (resultado.isConfirmed) {
        modalCargando('Eliminando orden...');

        try {
          // Ejecutar la función de eliminación proporcionada
          await alConfirmar(orden);

          // Delay mínimo para UX
          await new Promise(resolve => setTimeout(resolve, 600));

          Swal.close();

          // Mostrar éxito
          await Swal.fire({
            title: '¡Eliminada!',
            html: `
              <div class="eliminar-ord-exito-contenido">
                <p class="eliminar-ord-exito-texto">La orden ha sido eliminada exitosamente</p>
                <p class="eliminar-ord-exito-detalle">Orden: ${nombreOrden}</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'eliminar-ord-popup',
              title: 'eliminar-ord-titulo-exito',
              htmlContainer: 'eliminar-ord-html',
              confirmButton: 'eliminar-ord-boton-exito',
              icon: 'eliminar-ord-icono-exito'
            },
            buttonsStyling: false,
            timer: 3000,
            timerProgressBar: true
          });
        } catch (error) {
          Swal.close();
          await modalError('No se pudo eliminar la orden. Intenta nuevamente.');
          console.error('Error al eliminar orden:', error);
        }
      } else {
        // Usuario canceló
        alConfirmar(null);
      }
    };

    mostrarModal();
  }, [orden, alConfirmar]);

  // Este componente no renderiza nada visible, el modal es manejado por SweetAlert2
  return null;
};

/**
 * Modal de error genérico
 * @param {string} mensaje - Mensaje de error a mostrar
 */
const modalError = async (mensaje = 'Ocurrió un error al procesar la solicitud') => {
  await Swal.fire({
    title: 'Error',
    text: mensaje,
    icon: 'error',
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'eliminar-ord-popup',
      title: 'eliminar-ord-titulo-error',
      confirmButton: 'eliminar-ord-boton-error',
      icon: 'eliminar-ord-icono-error'
    },
    buttonsStyling: false
  });
};

/**
 * Modal de cargando
 * @param {string} mensaje - Mensaje a mostrar mientras carga
 */
const modalCargando = (mensaje = 'Procesando...') => {
  Swal.fire({
    title: mensaje,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    customClass: {
      popup: 'eliminar-ord-popup-cargando',
      title: 'eliminar-ord-titulo-cargando'
    },
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export default ModalEliminarOrden;