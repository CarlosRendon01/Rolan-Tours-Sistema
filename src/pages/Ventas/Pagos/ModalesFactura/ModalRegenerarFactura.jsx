import React, { useState } from 'react';
import { X, RefreshCw, Info } from 'lucide-react';
import './ModalRegenerarFactura.css';

const ModalRegenerarFactura = ({ factura, onConfirmar, onCerrar, isOpen }) => {
  const [cargando, setCargando] = useState(false);
  const [motivoRegeneracion, setMotivoRegeneracion] = useState('');

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
      await new Promise(resolve => setTimeout(resolve, 800));
      if (onConfirmar) {
        await onConfirmar(factura, motivoRegeneracion);
      }
      onCerrar();
    } catch (error) {
      console.error('Error al regenerar:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-regenerar-fact-overlay" onClick={onCerrar}>
      <div className="modal-regenerar-fact-contenedor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-regenerar-fact-header">
          <div className="modal-regenerar-fact-icono-header">
            <RefreshCw size={24} />
          </div>
          <div className="modal-regenerar-fact-titulo-seccion">
            <h2 className="modal-regenerar-fact-titulo">Regenerar Factura</h2>
            <p className="modal-regenerar-fact-subtitulo">Restaurar factura eliminada</p>
          </div>
          <button className="modal-regenerar-fact-boton-cerrar" onClick={onCerrar} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-regenerar-fact-contenido">
          <div className="modal-regenerar-fact-alerta">
            <Info size={20} />
            <div>
              <p className="modal-regenerar-fact-alerta-titulo">Acción de administrador</p>
              <p className="modal-regenerar-fact-alerta-texto">
                Esta factura fue eliminada visualmente por un vendedor. Al regenerarla, 
                volverá a estar visible para todos los usuarios.
              </p>
            </div>
          </div>

          <div className="modal-regenerar-fact-factura-info">
            <div className="modal-regenerar-fact-info-item">
              <span className="modal-regenerar-fact-info-label">Número de Factura:</span>
              <span className="modal-regenerar-fact-info-value">{factura.numeroFactura}</span>
            </div>
            <div className="modal-regenerar-fact-info-item">
              <span className="modal-regenerar-fact-info-label">Serie - Folio:</span>
              <span className="modal-regenerar-fact-info-value">
                Serie {factura.serie} - Folio {factura.folio}
              </span>
            </div>
            <div className="modal-regenerar-fact-info-item">
              <span className="modal-regenerar-fact-info-label">Cliente:</span>
              <span className="modal-regenerar-fact-info-value">{factura.cliente}</span>
            </div>
            <div className="modal-regenerar-fact-info-item">
              <span className="modal-regenerar-fact-info-label">RFC:</span>
              <span className="modal-regenerar-fact-info-value">{factura.rfc}</span>
            </div>
            <div className="modal-regenerar-fact-info-item">
              <span className="modal-regenerar-fact-info-label">Monto:</span>
              <span className="modal-regenerar-fact-info-value modal-regenerar-fact-destacado">
                {formatearMoneda(factura.monto)}
              </span>
            </div>
            <div className="modal-regenerar-fact-info-item">
              <span className="modal-regenerar-fact-info-label">Fecha de Emisión:</span>
              <span className="modal-regenerar-fact-info-value">{factura.fechaEmision}</span>
            </div>
            <div className="modal-regenerar-fact-info-item modal-regenerar-fact-full-width">
              <span className="modal-regenerar-fact-info-label">UUID:</span>
              <span className="modal-regenerar-fact-info-value" style={{ 
                fontSize: '0.75rem', 
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                {factura.uuid}
              </span>
            </div>
          </div>

          <div className="modal-regenerar-fact-form-group">
            <label htmlFor="motivoRegeneracion" className="modal-regenerar-fact-form-label">
              Motivo de regeneración (opcional)
            </label>
            <textarea
              id="motivoRegeneracion"
              className="modal-regenerar-fact-form-textarea"
              placeholder="Ej: Error en la eliminación, solicitud del cliente, corrección administrativa..."
              value={motivoRegeneracion}
              onChange={(e) => setMotivoRegeneracion(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <span className="modal-regenerar-fact-form-ayuda">
              {motivoRegeneracion.length}/200 caracteres
            </span>
          </div>
        </div>

        <div className="modal-regenerar-fact-footer">
          <button 
            className="modal-regenerar-fact-boton-secundario" 
            onClick={onCerrar}
            disabled={cargando}
          >
            Cancelar
          </button>
          <button 
            className="modal-regenerar-fact-boton-principal"
            onClick={manejarConfirmacion}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <RefreshCw size={16} className="modal-regenerar-fact-icono-girando" />
                Regenerando...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Regenerar Factura
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegenerarFactura;