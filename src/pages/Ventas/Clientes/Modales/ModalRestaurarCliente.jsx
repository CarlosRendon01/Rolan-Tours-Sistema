import React, { useState } from 'react';
import { RotateCcw, X, CheckCircle } from 'lucide-react';
import './ModalRestaurarCliente.css';

const ModalRegenerarCliente = ({ cliente, alConfirmar, alCancelar }) => {
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
    <div className="modal-regenerar-overlay" onClick={manejarCancelar}>
      <div className="modal-regenerar-contenedor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-regenerar-header">
          <div className="modal-regenerar-icono-header">
            <RotateCcw size={24} />
          </div>
          <div className="modal-regenerar-titulo-seccion">
            <h2 className="modal-regenerar-titulo">¿Restaurar Cliente?</h2>
            <p className="modal-regenerar-subtitulo">Restaurar cliente eliminado</p>
          </div>
          <button 
            className="modal-regenerar-boton-cerrar" 
            onClick={manejarCancelar}
            disabled={restaurando}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-regenerar-contenido">
          <div className="modal-regenerar-mensaje-exito">
            <CheckCircle size={20} />
            <span>El cliente volverá a estar activo y visible para todos los usuarios.</span>
          </div>
        </div>

        <div className="modal-regenerar-footer">
          <button 
            className="modal-regenerar-boton-secundario" 
            onClick={manejarCancelar}
            disabled={restaurando}
          >
            <X size={18} />
            Cancelar
          </button>
          <button 
            className="modal-regenerar-boton-principal" 
            onClick={manejarConfirmar}
            disabled={restaurando}
          >
            {restaurando ? (
              <>
                <RotateCcw size={16} className="modal-regenerar-icono-girando" />
                Restaurando...
              </>
            ) : (
              <>
                <RotateCcw size={16} />
                Sí, Restaurar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegenerarCliente;