import React, { useState } from 'react';
import { X, RotateCcw, CheckCircle } from 'lucide-react';
import './ModalReactivarPago.css';

const ModalReactivarPago = ({ estaAbierto, alCerrar, pago, alReactivar }) => {
  const [cargando, setCargando] = useState(false);

  if (!estaAbierto || !pago) return null;

  const mostrarNotificacionExito = () => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: '¡Pago Reactivado!',
        text: 'El pago ha sido reactivado correctamente y está visible para todos los usuarios',
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
        background: '#ffffff',
        backdrop: `rgba(44, 62, 80, 0.8) left top no-repeat`
      });
    } else {
      alert('El pago ha sido reactivado correctamente');
    }
  };

  const manejarReactivar = async () => {
    setCargando(true);
    
    try {
      // Simular delay de operación
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Ejecutar la función de reactivación
      if (alReactivar && typeof alReactivar === 'function') {
        await alReactivar(pago);
      }
      
      setCargando(false);
      
      // Mostrar notificación de éxito
      mostrarNotificacionExito();
      
      // Cerrar modal después de 500ms
      setTimeout(() => {
        alCerrar();
      }, 500);
      
    } catch (error) {
      console.error('Error al reactivar pago:', error);
      setCargando(false);
      
      if (typeof window !== 'undefined' && window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al reactivar el pago. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Reintentar',
          confirmButtonColor: '#dc3545'
        });
      } else {
        alert('Ocurrió un error al reactivar el pago. Por favor, intente nuevamente.');
      }
    }
  };

  const manejarCancelar = () => {
    if (!cargando) {
      alCerrar();
    }
  };

  return (
    <div className="modal-reactivar-overlay" onClick={manejarCancelar}>
      <div className="modal-reactivar-contenido" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-reactivar-cerrar" 
          onClick={manejarCancelar}
          disabled={cargando}
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        <div className="modal-reactivar-icono">
          <RotateCcw size={48} />
        </div>

        <h2 className="modal-reactivar-titulo">¿Reactivar este Pago?</h2>

        <p className="modal-reactivar-descripcion">
          El pago volverá a estar activo y visible para todos los usuarios del sistema.
        </p>

        <div className="modal-reactivar-info">
          <div className="modal-reactivar-info-item">
            <strong>Cliente:</strong>
            <span>{pago.cliente}</span>
          </div>
        </div>

        <div className="modal-reactivar-mensaje-exito">
          <CheckCircle size={20} />
          <span>Este pago volverá a estar <strong>visible para todos los usuarios</strong> del sistema.</span>
        </div>

        <div className="modal-reactivar-botones">
          <button 
            className="modal-reactivar-btn-cancelar" 
            onClick={manejarCancelar}
            disabled={cargando}
          >
            <X size={18} />
            Cancelar
          </button>
          <button 
            className="modal-reactivar-btn-confirmar" 
            onClick={manejarReactivar}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner-reactivar"></span>
                Reactivando...
              </>
            ) : (
              <>
                <RotateCcw size={18} />
                Sí, Reactivar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReactivarPago;