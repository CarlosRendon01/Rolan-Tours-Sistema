import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import './ModalEliminarCliente.css';

const ModalEliminarCliente = ({ cliente, alConfirmar, esAdministrador }) => {
  const [cargando, setCargando] = useState(false);

  const manejarCancelar = () => {
    if (!cargando) {
      alConfirmar(null);
    }
  };

  const mostrarNotificacionExito = () => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: '¡Cliente Eliminado!',
        text: 'El cliente ha sido eliminado correctamente del sistema',
        icon: 'success',
        iconHtml: '✓',
        iconColor: '#28a745',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#28a745',
        timer: 3000,
        timerProgressBar: true,
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
      alert('El cliente ha sido eliminado correctamente');
    }
  };

  const manejarEliminar = async () => {
    try {
      setCargando(true);
      
      // Ejecutar la eliminación
      await alConfirmar(cliente);
      
      setCargando(false);
      
      // Mostrar notificación de éxito
      mostrarNotificacionExito();
      
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      setCargando(false);
      
      if (typeof window !== 'undefined' && window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el cliente. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Reintentar',
          confirmButtonColor: '#dc3545',
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
    }
  };

  if (!cliente) return null;

  return (
    <div className="modal-overlay-simple" onClick={manejarCancelar}>
      <div className="modal-container-simple" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-btn" 
          onClick={manejarCancelar} 
          disabled={cargando}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="modal-icon-simple">
          <div className="modal-icon-circle">
            <AlertTriangle size={48} strokeWidth={2} />
          </div>
        </div>

        <h3 className="modal-title-simple">¿Eliminar Cliente?</h3>
        
        <p className="modal-message-simple">
          Esta acción eliminará a <strong>{cliente.nombre}</strong> del sistema.
        </p>

        <div className="modal-buttons-simple">
          <button 
            className="btn-simple btn-cancel-simple" 
            onClick={manejarCancelar}
            disabled={cargando}
          >
            Cancelar
          </button>
          <button 
            className="btn-simple btn-confirm-simple" 
            onClick={manejarEliminar}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner"></span>
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarCliente;