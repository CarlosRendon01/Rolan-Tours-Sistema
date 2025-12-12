import React, { useState } from 'react';
import { X, RotateCcw, CheckCircle } from 'lucide-react';
import './ModalRestaurarContrato.css';

const ModalRestaurarContrato = ({ contrato, alConfirmar, alCancelar }) => {
  const [restaurando, setRestaurando] = useState(false);

  if (!contrato) return null;

  const manejarConfirmar = async () => {
    setRestaurando(true);
    try {
      await alConfirmar(contrato);

      await new Promise(resolve => setTimeout(resolve, 800));

      alCancelar();
    } catch (error) {
      console.error('Error al restaurar contrato:', error);
      alert('Error al restaurar el contrato. Intenta nuevamente.');
    } finally {
      setRestaurando(false);
    }
  };

  const manejarCancelar = () => {
    if (!restaurando) {
      alCancelar();
    }
  };

  return (
    <div className="modal-restaurar-overlay" onClick={manejarCancelar}>
      <div className="modal-restaurar-contenedor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-restaurar-header">
          <div className="modal-restaurar-icono-header">
            <RotateCcw size={24} />
          </div>
          <div className="modal-restaurar-titulo-seccion">
            <h2 className="modal-restaurar-titulo">Restaurar Contrato</h2>
            <p className="modal-restaurar-subtitulo">Reactivar contrato eliminado</p>
          </div>
          <button 
            className="modal-restaurar-boton-cerrar" 
            onClick={manejarCancelar}
            disabled={restaurando}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-restaurar-contenido">
          <div className="modal-restaurar-alerta">
            <CheckCircle size={20} />
            <div>
              <p className="modal-restaurar-alerta-titulo">Acción de administrador</p>
              <p className="modal-restaurar-alerta-texto">
                Este contrato fue eliminado. Al restaurarlo, volverá a estar 
                activo y visible para todos los usuarios.
              </p>
            </div>
          </div>

          <div className="modal-restaurar-contrato-info">
            <div className="modal-restaurar-info-item">
              <span className="modal-restaurar-info-label">Cliente:</span>
              <span className="modal-restaurar-info-value">{contrato.cliente?.nombre || 'N/A'}</span>
            </div>
            <div className="modal-restaurar-info-item">
              <span className="modal-restaurar-info-label">Estado:</span>
              <span className="modal-restaurar-info-value modal-restaurar-destacado">
                Se reactivará
              </span>
            </div>
          </div>
        </div>

        <div className="modal-restaurar-footer">
          <button
            className="modal-restaurar-boton-secundario"
            onClick={manejarCancelar}
            disabled={restaurando}
          >
            Cancelar
          </button>
          <button
            className="modal-restaurar-boton-principal"
            onClick={manejarConfirmar}
            disabled={restaurando}
          >
            {restaurando ? (
              <>
                <RotateCcw size={16} className="modal-restaurar-icono-girando" />
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

export default ModalRestaurarContrato;