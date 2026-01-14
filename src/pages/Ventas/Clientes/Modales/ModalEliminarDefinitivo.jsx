import React, { useCallback, useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import './ModalEliminarDefinitivo.css';

const ModalEliminarDefinitivo = ({ cliente, alConfirmar, alCancelar }) => {
  const [eliminando, setEliminando] = useState(false);

  const mostrarNotificacionExito = async () => {
    if (typeof window !== 'undefined' && window.Swal) {
      await window.Swal.fire({
        title: '¡Eliminado Permanentemente!',
        text: 'El cliente ha sido eliminado de forma definitiva de la base de datos',
        icon: 'success',
        iconHtml: '✓',
        iconColor: '#dc2626',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#dc2626',
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        },
        customClass: {
          popup: 'swal-popup-custom-editar',
          title: 'swal-title-custom-editar',
          content: 'swal-content-custom-editar',
          confirmButton: 'swal-button-custom-editar',
          icon: 'swal-icon-success-custom'
        },
        background: '#ffffff',
        backdrop: `
          rgba(44, 62, 80, 0.8)
          left top
          no-repeat
        `
      });
    } else {
      alert('El cliente ha sido eliminado permanentemente');
    }
  };

  const mostrarNotificacionError = () => async () => {
    if (typeof window !== 'undefined' && window.Swal) {
      awaitwindow.Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar el cliente permanentemente. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Reintentar',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'swal-popup-custom-editar',
          title: 'swal-title-custom-editar',
          content: 'swal-content-custom-editar',
          confirmButton: 'swal-button-error-editar'
        }
      });
    } else {
      alert('Error al eliminar el cliente. Intenta nuevamente.');
    }
  };

  const manejarConfirmar = useCallback(async () => {
    if (!cliente || eliminando) return;

    try {
      setEliminando(true);

      await alConfirmar(cliente);

      await mostrarNotificacionExito();

      setEliminando(false);
      setTimeout(() => {
        alConfirmar(null);
      }, 500);

    } catch (error) {
      setEliminando(false);
      await mostrarNotificacionError();
    }
  }, [cliente, alConfirmar, alCancelar]);

  const manejarCancelar = useCallback(() => {
    if (!eliminando) {
      alCancelar();
    }
  }, [eliminando, alCancelar]);

  if (!cliente) return null;

  return (
    <div className="modal-eliminar-overlay" onClick={manejarCancelar}>
      <div className="modal-eliminar-contenedor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-eliminar-header">
          <div className="modal-eliminar-icono-header">
            <Trash2 size={24} />
          </div>
          <div className="modal-eliminar-titulo-seccion">
            <h2 className="modal-eliminar-titulo">Eliminar Definitivamente</h2>
            <p className="modal-eliminar-subtitulo">Esta acción no se puede deshacer</p>
          </div>
          <button
            className="modal-eliminar-boton-cerrar"
            onClick={manejarCancelar}
            disabled={eliminando}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-eliminar-contenido">
          <div className="modal-eliminar-alerta">
            <AlertTriangle size={20} />
            <div className="modal-eliminar-alerta-content">
              <p className="modal-eliminar-alerta-titulo">¡Advertencia Crítica!</p>
              <p className="modal-eliminar-alerta-texto">
                Esta acción eliminará el cliente de forma <strong>permanente</strong> de la base de datos.
                No podrá recuperarse después de confirmar esta operación.
              </p>
            </div>
          </div>

          <div className="modal-eliminar-recibo-info">
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Nombre:</span>
              <span className="modal-eliminar-info-value modal-eliminar-destacado">
                {cliente.nombre || 'N/A'}
              </span>
            </div>
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Apellidos:</span>
              <span className="modal-eliminar-info-value">
                {cliente.apellidos || 'N/A'}
              </span>
            </div>
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Teléfono:</span>
              <span className="modal-eliminar-info-value">
                {cliente.telefono || 'N/A'}
              </span>
            </div>
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Correo:</span>
              <span className="modal-eliminar-info-value">
                {cliente.correo || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-eliminar-footer">
          <button
            className="modal-eliminar-boton-secundario"
            onClick={manejarCancelar}
            disabled={eliminando}
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            className="modal-eliminar-boton-peligro"
            onClick={manejarConfirmar}
            disabled={eliminando}
          >
            {eliminando ? (
              <>
                <Trash2 size={16} className="modal-eliminar-icono-girando" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Eliminar Permanentemente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarDefinitivo;