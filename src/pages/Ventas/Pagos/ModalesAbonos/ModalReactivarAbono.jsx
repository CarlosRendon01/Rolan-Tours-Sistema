import React, { useState } from 'react';
import axios from "axios";
import { RotateCcw, X, AlertCircle, CheckCircle } from 'lucide-react';
import './ModalReactivarAbono.css';

const ModalReactivarAbono = ({ estaAbierto, alCerrar, abono, alReactivar }) => {
  const [procesando, setProcesando] = useState(false);
  const [motivoReactivacion, setMotivoReactivacion] = useState('');

  if (!estaAbierto || !abono) return null;

  const manejarReactivar = async () => {
    if (!motivoReactivacion.trim()) {
      alert('Por favor, ingresa un motivo para la reactivación');
      return;
    }

    setProcesando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/api/abonos/${abono.id}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      if (alReactivar) {
        await alReactivar(abono);
      }

      setMotivoReactivacion('');
      alCerrar();
    } catch (error) {
      console.error('Error al reactivar:', error);
      alert('Hubo un error al reactivar el abono');
    } finally {
      setProcesando(false);
    }
  };

  const manejarCerrar = () => {
    if (!procesando) {
      setMotivoReactivacion('');
      alCerrar();
    }
  };

  return (
    <div className="modal-overlay" onClick={manejarCerrar}>
  <div className="modal-container modal-reactivar" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <RotateCcw size={20} color="white" />
            </div>
            <div>
              <h2 className="header-title">Reactivar Abono</h2>
              <p className="header-subtitle">Restaurar visibilidad del pago</p>
            </div>
          </div>
          <button
            onClick={manejarCerrar}
            disabled={procesando}
            className={`close-button ${procesando ? 'disabled' : ''}`}
          >
            <X size={18} color="white" />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Alerta de información */}
          <div className="alert-info">
            <AlertCircle size={20} color="#059669" className="alert-icon" />
            <div>
              <p className="alert-title">Esta acción reactivará el abono</p>
              <p className="alert-text">
                El abono volverá a ser visible para todos los vendedores y se podrán realizar acciones sobre él nuevamente.
              </p>
            </div>
          </div>

          {/* Información del abono */}
          <div className="abono-info">
            <h3 className="info-title">Detalles del Abono</h3>

            <div className="info-details">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">
                  #{abono.id.toString().padStart(3, '0')}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Cliente:</span>
                <span className="detail-value">{abono.cliente.nombre}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Servicio:</span>
                <span className="detail-value">{abono.servicio.tipo}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Monto Total:</span>
                <span className="detail-value amount">
                  ${abono.planPago.montoTotal.toLocaleString()}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Progreso:</span>
                <span className="detail-value">
                  {abono.planPago.abonosRealizados} de {abono.planPago.abonosPlaneados} abonos
                </span>
              </div>
            </div>
          </div>

          {/* Motivo de reactivación */}
          <div className="motivo-container">
            <label htmlFor="motivo-reactivacion" className="motivo-label">
              Motivo de Reactivación <span className="required">*</span>
            </label>
            <textarea
              id="motivo-reactivacion"
              value={motivoReactivacion}
              onChange={(e) => setMotivoReactivacion(e.target.value)}
              disabled={procesando}
              placeholder="Describe el motivo por el cual se reactiva este abono..."
              maxLength={500}
              rows={4}
              className="motivo-textarea"
            />
            <div className="motivo-footer">
              <span>Este motivo quedará registrado en el historial</span>
              <span>{motivoReactivacion.length}/500</span>
            </div>
          </div>

          {/* Confirmación */}
          <div className="alert-warning">
            <CheckCircle size={20} color="#d97706" className="alert-icon" />
            <div>
              <p className="alert-title">¿Estás seguro de reactivar este abono?</p>
              <p className="alert-text">
                Los vendedores podrán ver y gestionar este abono nuevamente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={manejarCerrar}
            disabled={procesando}
            className={`button button-cancel ${procesando ? 'disabled' : ''}`}
          >
            Cancelar
          </button>
          <button
            onClick={manejarReactivar}
            disabled={procesando || !motivoReactivacion.trim()}
            className={`button button-reactivar ${procesando || !motivoReactivacion.trim() ? 'disabled' : ''}`}
          >
            {procesando ? (
              <>
                <div className="spinner" />
                Reactivando...
              </>
            ) : (
              <>
                <RotateCcw size={14} />
                Reactivar Abono
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReactivarAbono;