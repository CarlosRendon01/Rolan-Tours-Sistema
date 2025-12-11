import React, { useState } from 'react';
import axios from 'axios';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import './ModalEliminarDefinitivoFactura.css';

const ModalEliminarDefinitivoFactura = ({ factura, onConfirmar, onCerrar, isOpen }) => {
  const [cargando, setCargando] = useState(false);
  const [motivoEliminacion, setMotivoEliminacion] = useState('');

  if (!isOpen) return null;

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  const manejarConfirmacion = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://127.0.0.1:8000/api/facturas/${factura.id}/force`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        data: {
          motivo_eliminacion: motivoEliminacion
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onConfirmar) {
        await onConfirmar(factura, motivoEliminacion);
      }

      onCerrar();
    } catch (error) {
      console.error('Error al eliminar definitivamente:', error);
      alert('Error al eliminar la factura. Por favor, intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-eliminar-def-fact-overlay" onClick={onCerrar}>
      <div className="modal-eliminar-def-fact-contenedor" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="modal-eliminar-def-fact-header">
          <div className="modal-eliminar-def-fact-icono-header">
            <Trash2  size={24} />
          </div>
          <div className="modal-eliminar-def-fact-titulo-seccion">
            <h2 className="modal-eliminar-def-fact-titulo">Eliminar Factura Definitivamente</h2>
            <p className="modal-eliminar-def-fact-subtitulo">Esta acción no se puede deshacer</p>
          </div>
          <button className="modal-eliminar-def-fact-boton-cerrar" onClick={onCerrar} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="modal-eliminar-def-fact-contenido">

          <div className="modal-eliminar-def-fact-alerta-critica">
            <AlertTriangle size={24} />
            <div>
              <p className="modal-eliminar-def-fact-alerta-titulo">⚠️ ADVERTENCIA CRÍTICA</p>
              <p className="modal-eliminar-def-fact-alerta-texto">
                Esta acción eliminará permanentemente la factura de la base de datos.
                No hay forma de recuperarla después de confirmar.
              </p>
            </div>
          </div>

          {/* INFO FACTURA */}
          <div className="modal-eliminar-def-fact-factura-info">
            <div className="modal-eliminar-def-fact-info-item">
              <span className="modal-eliminar-def-fact-info-label">Número de Factura:</span>
              <span className="modal-eliminar-def-fact-info-value">{factura.numeroFactura}</span>
            </div>

            <div className="modal-eliminar-def-fact-info-item">
              <span className="modal-eliminar-def-fact-info-label">Serie - Folio:</span>
              <span className="modal-eliminar-def-fact-info-value">
                Serie {factura.serie} - Folio {factura.folio}
              </span>
            </div>

            <div className="modal-eliminar-def-fact-info-item">
              <span className="modal-eliminar-def-fact-info-label">Cliente:</span>
              <span className="modal-eliminar-def-fact-info-value">{factura.cliente}</span>
            </div>

            <div className="modal-eliminar-def-fact-info-item">
              <span className="modal-eliminar-def-fact-info-label">RFC:</span>
              <span className="modal-eliminar-def-fact-info-value">{factura.rfc}</span>
            </div>

            <div className="modal-eliminar-def-fact-info-item">
              <span className="modal-eliminar-def-fact-info-label">Monto:</span>
              <span className="modal-eliminar-def-fact-info-value modal-eliminar-def-fact-destacado">
                {formatearMoneda(factura.monto)}
              </span>
            </div>

            <div className="modal-eliminar-def-fact-info-item">
              <span className="modal-eliminar-def-fact-info-label">Fecha de Emisión:</span>
              <span className="modal-eliminar-def-fact-info-value">{factura.fechaEmision}</span>
            </div>

            <div className="modal-eliminar-def-fact-info-item modal-eliminar-def-fact-full-width">
              <span className="modal-eliminar-def-fact-info-label">UUID:</span>
              <span className="modal-eliminar-def-fact-info-value" style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                {factura.uuid}
              </span>
            </div>
          </div>

          {/* MOTIVO */}
          <div className="modal-eliminar-def-fact-form-group">
            <label htmlFor="motivoEliminacion" className="modal-eliminar-def-fact-form-label">
              Motivo de eliminación definitiva (requerido)
            </label>

            <textarea
              id="motivoEliminacion"
              className="modal-eliminar-def-fact-form-textarea"
              placeholder="Ej: Factura duplicada, datos incorrectos irrecuperables, solicitud de auditoría..."
              value={motivoEliminacion}
              onChange={(e) => setMotivoEliminacion(e.target.value)}
              rows={3}
              maxLength={300}
            />

            <span className="modal-eliminar-def-fact-form-ayuda">
              {motivoEliminacion.length}/300 caracteres
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-eliminar-def-fact-footer">
          <button
            className="modal-eliminar-def-fact-boton-secundario"
            onClick={onCerrar}
            disabled={cargando}
          >
            Cancelar
          </button>

          <button
            className="modal-eliminar-def-fact-boton-peligro"
            onClick={manejarConfirmacion}
            disabled={!motivoEliminacion.trim() || cargando}
          >
            {cargando ? (
              <>
                <Trash2 size={16} className="modal-eliminar-def-fact-icono-girando" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Eliminar Definitivamente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarDefinitivoFactura;
