import React, { useState } from 'react';
import axios from 'axios';
import { X, RefreshCw, Info } from 'lucide-react';
import './ModalRegenerarRecibo.css';

const ModalRegenerarRecibo = ({ recibo, onConfirmar, onCerrar, isOpen }) => {
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
      const token = localStorage.getItem("token");

      // ✅ Llamar al backend para restaurar
      await axios.post(
        `http://127.0.0.1:8000/api/abonos/${recibo.id}/restore`,
        {
          motivo_regeneracion: motivoRegeneracion
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      await new Promise(resolve => setTimeout(resolve, 800));

      if (onConfirmar) {
        await onConfirmar(recibo, motivoRegeneracion);
      }

      onCerrar();
    } catch (error) {
      console.error('Error al regenerar:', error);
      alert('Error al regenerar el recibo. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-regenerar-overlay" onClick={onCerrar}>
      <div className="modal-regenerar-contenedor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-regenerar-header">
          <div className="modal-regenerar-icono-header">
            <RefreshCw size={24} />
          </div>
          <div className="modal-regenerar-titulo-seccion">
            <h2 className="modal-regenerar-titulo">Regenerar Recibo</h2>
            <p className="modal-regenerar-subtitulo">Restaurar recibo eliminado</p>
          </div>
          <button className="modal-regenerar-boton-cerrar" onClick={onCerrar} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-regenerar-contenido">
          <div className="modal-regenerar-alerta">
            <Info size={20} />
            <div>
              <p className="modal-regenerar-alerta-titulo">Acción de administrador</p>
              <p className="modal-regenerar-alerta-texto">
                Este recibo fue eliminado visualmente por un vendedor. Al regenerarlo,
                volverá a estar visible para todos los usuarios.
              </p>
            </div>
          </div>

          <div className="modal-regenerar-recibo-info">
            <div className="modal-regenerar-info-item">
              <span className="modal-regenerar-info-label">Número de Recibo:</span>
              <span className="modal-regenerar-info-value">{recibo.numeroRecibo}</span>
            </div>
            <div className="modal-regenerar-info-item">
              <span className="modal-regenerar-info-label">Cliente:</span>
              <span className="modal-regenerar-info-value">{recibo.cliente}</span>
            </div>
            <div className="modal-regenerar-info-item">
              <span className="modal-regenerar-info-label">Monto:</span>
              <span className="modal-regenerar-info-value modal-regenerar-destacado">
                {formatearMoneda(recibo.monto)}
              </span>
            </div>
            <div className="modal-regenerar-info-item">
              <span className="modal-regenerar-info-label">Fecha de Emisión:</span>
              <span className="modal-regenerar-info-value">{recibo.fechaEmision}</span>
            </div>
            <div className="modal-regenerar-info-item modal-regenerar-full-width">
              <span className="modal-regenerar-info-label">Concepto:</span>
              <span className="modal-regenerar-info-value">{recibo.concepto}</span>
            </div>
          </div>

          <div className="modal-regenerar-form-group">
            <label htmlFor="motivoRegeneracion" className="modal-regenerar-form-label">
              Motivo de regeneración (opcional)
            </label>
            <textarea
              id="motivoRegeneracion"
              className="modal-regenerar-form-textarea"
              placeholder="Ej: Error en la eliminación, solicitud del cliente, corrección administrativa..."
              value={motivoRegeneracion}
              onChange={(e) => setMotivoRegeneracion(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <span className="modal-regenerar-form-ayuda">
              {motivoRegeneracion.length}/200 caracteres
            </span>
          </div>
        </div>

        <div className="modal-regenerar-footer">
          <button
            className="modal-regenerar-boton-secundario"
            onClick={onCerrar}
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            className="modal-regenerar-boton-principal"
            onClick={manejarConfirmacion}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <RefreshCw size={16} className="modal-regenerar-icono-girando" />
                Regenerando...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Regenerar Recibo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegenerarRecibo;