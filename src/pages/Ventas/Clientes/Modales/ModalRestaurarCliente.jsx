import React, { useState } from 'react';
import { RotateCcw, X, CheckCircle } from 'lucide-react';
import './ModalRestaurarCliente.css';

const ModalRestaurarCliente = ({ cliente, alConfirmar, alCancelar }) => {
  const [restaurando, setRestaurando] = useState(false);

  const mostrarNotificacionExito = () => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: '¡Cliente Restaurado!',
        text: 'El cliente ha sido restaurado correctamente y está activo nuevamente',
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
      alert('El cliente ha sido restaurado correctamente');
    }
  };

  const manejarConfirmar = async () => {
    try {
      setRestaurando(true);
      
      // Ejecutar la restauración
      await alConfirmar(cliente);
      
      setRestaurando(false);
      
      // Mostrar notificación de éxito
      mostrarNotificacionExito();
      
    } catch (error) {
      console.error('Error al restaurar cliente:', error);
      setRestaurando(false);
      
      if (typeof window !== 'undefined' && window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al restaurar el cliente. Por favor, intenta nuevamente.',
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
        alert('Error al restaurar el cliente. Intenta nuevamente.');
      }
    }
  };

  const manejarCancelar = () => {
    if (!restaurando) {
      alCancelar();
    }
  };

  if (!cliente) return null;

  return (
    <div className="modal-restaurar-overlay" onClick={manejarCancelar}>
      <div className="modal-restaurar-contenido" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-restaurar-cerrar" 
          onClick={manejarCancelar}
          disabled={restaurando}
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        <div className="modal-restaurar-icono">
          <RotateCcw size={48} />
        </div>

        <h2 className="modal-restaurar-titulo">¿Restaurar Cliente?</h2>

        

        <div className="modal-restaurar-mensaje-exito">
          <CheckCircle size={20} />
          <span>El cliente volverá a estar activo y visible para todos los usuarios.</span>
        </div>

        <div className="modal-restaurar-botones">
          <button 
            className="modal-restaurar-btn-cancelar" 
            onClick={manejarCancelar}
            disabled={restaurando}
          >
            <X size={18} />
            Cancelar
          </button>
          <button 
            className="modal-restaurar-btn-confirmar" 
            onClick={manejarConfirmar}
            disabled={restaurando}
          >
            {restaurando ? (
              <>
                <span className="spinner-restaurar"></span>
                Restaurando...
              </>
            ) : (
              <>
                <RotateCcw size={18} />
                Sí, Restaurar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRestaurarCliente;