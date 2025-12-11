import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import './ModalEliminarDefinitivo.css';

const ModalEliminarDefinitivo = ({ contrato, alConfirmar, alCancelar }) => {
  if (!contrato) return null;

  const manejarConfirmar = () => {
    alConfirmar(contrato);
  };

  return (
    <div className="modal-eliminar-def-overlay">
      <div className="modal-eliminar-def-contenido">
        <button className="modal-eliminar-def-cerrar" onClick={alCancelar}>
          <X size={24} />
        </button>

        <div className="modal-eliminar-def-icono">
          <AlertTriangle size={56} />
        </div>

        <h2 className="modal-eliminar-def-titulo">âš ï¸ Â¡ADVERTENCIA!</h2>

        <div className="modal-eliminar-def-alerta-principal">
          <p className="modal-eliminar-def-texto-peligro">
            Esta acciÃ³n es IRREVERSIBLE
          </p>
        </div>

        <p className="modal-eliminar-def-descripcion">
          Â¿EstÃ¡ completamente seguro de <strong>ELIMINAR DEFINITIVAMENTE</strong> este contrato del sistema sin posibilidad de recuperaciÃ³n?
        </p>

        <div className="modal-eliminar-def-botones">
          <button className="modal-eliminar-def-btn-cancelar" onClick={alCancelar}>
            <X size={18} />
            Cancelar
          </button>
          <button className="modal-eliminar-def-btn-confirmar" onClick={manejarConfirmar}>
            <Trash2 size={18} />
            SÃ­, Eliminar Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarDefinitivo;