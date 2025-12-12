import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import './ModalEliminarDefinitivo.css';

const ModalEliminarDefinitivo = ({ cliente, alConfirmar, alCancelar }) => {
  if (!cliente) return null;

  const manejarConfirmar = () => {
    alConfirmar(cliente);
  };

  return (
    <div className="modal-eliminar-overlay" onClick={alCancelar}>
      <div className="modal-eliminar-contenedor" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
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
            onClick={alCancelar} 
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="modal-eliminar-contenido">
          {/* Alerta de advertencia */}
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

          {/* Información del cliente */}
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

        {/* FOOTER */}
        <div className="modal-eliminar-footer">
          <button 
            className="modal-eliminar-boton-secundario" 
            onClick={alCancelar}
          >
            <X size={16} />
            Cancelar
          </button>
          <button 
            className="modal-eliminar-boton-peligro" 
            onClick={manejarConfirmar}
          >
            <Trash2 size={16} />
            Eliminar Permanentemente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarDefinitivo;