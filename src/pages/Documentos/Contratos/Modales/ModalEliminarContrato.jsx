import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import './ModalEliminarContrato.css';

/**
 * Componente Modal para eliminar contrato usando SweetAlert2
 * Se renderiza cuando contratoAEliminar tiene valor
 */
const ModalEliminarContrato = ({ contrato, alConfirmar, esAdministrador }) => {
  useEffect(() => {
    if (!contrato) return;

    const mostrarModal = async () => {
      // Validar datos del contrato
      if (!contrato?.nombre_cliente) {
        await modalError('Información del contrato incompleta');
        alConfirmar(null);
        return;
      }

      const nombreContrato = `${contrato.nombre_cliente} - ${contrato.destino || 'Destino no especificado'}`;

      const resultado = await Swal.fire({
        title: '¿Eliminar este contrato?',
        html: `
          <div class="eliminar-cto-contenido">
            <p class="eliminar-cto-texto">¿Estás seguro de eliminar el contrato:</p>
            <p class="eliminar-cto-contrato">${nombreContrato}</p>
            
            <div class="eliminar-cto-advertencia">
              <svg class="eliminar-cto-advertencia-icono" viewBox="0 0 20 20" fill="currentColor">
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
          popup: 'eliminar-cto-popup',
          title: 'eliminar-cto-titulo',
          htmlContainer: 'eliminar-cto-html',
          confirmButton: 'eliminar-cto-boton-confirmar',
          cancelButton: 'eliminar-cto-boton-cancelar',
          icon: 'eliminar-cto-icono',
          actions: 'eliminar-cto-acciones'
        },
        buttonsStyling: false,
        reverseButtons: true,
        focusCancel: true,
        width: '420px'
      });

      if (resultado.isConfirmed) {
        modalCargando('Eliminando contrato...');

        try {
          // Ejecutar la función de eliminación proporcionada
          await alConfirmar(contrato);

          // Delay mínimo para UX
          await new Promise(resolve => setTimeout(resolve, 600));

          Swal.close();

          // Mostrar éxito
          await Swal.fire({
            title: '¡Eliminado!',
            html: `
              <div class="eliminar-cto-exito-contenido">
                <p class="eliminar-cto-exito-texto">El contrato ha sido eliminado exitosamente</p>
                <p class="eliminar-cto-exito-detalle">Contrato: ${nombreContrato}</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'eliminar-cto-popup',
              title: 'eliminar-cto-titulo-exito',
              htmlContainer: 'eliminar-cto-html',
              confirmButton: 'eliminar-cto-boton-exito',
              icon: 'eliminar-cto-icono-exito'
            },
            buttonsStyling: false,
            timer: 3000,
            timerProgressBar: true
          });
        } catch (error) {
          Swal.close();
          await modalError('No se pudo eliminar el contrato. Intenta nuevamente.');
          console.error('Error al eliminar contrato:', error);
        }
      } else {
        // Usuario canceló
        alConfirmar(null);
      }
    };

    mostrarModal();
  }, [contrato, alConfirmar]);

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
      popup: 'eliminar-cto-popup',
      title: 'eliminar-cto-titulo-error',
      confirmButton: 'eliminar-cto-boton-error',
      icon: 'eliminar-cto-icono-error'
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
      popup: 'eliminar-cto-popup-cargando',
      title: 'eliminar-cto-titulo-cargando'
    },
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export default ModalEliminarContrato;