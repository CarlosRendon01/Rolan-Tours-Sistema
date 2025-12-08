import React, { useState } from 'react';
import axios from "axios";
import { RotateCcw, X, AlertCircle, CheckCircle } from 'lucide-react';

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
      // Simular llamada a API
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={manejarCerrar}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          animation: 'slideUp 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RotateCcw size={20} color="white" />
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'white'
              }}>
                Reactivar Abono
              </h2>
              <p style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                Restaurar visibilidad del pago
              </p>
            </div>
          </div>
          <button
            onClick={manejarCerrar}
            disabled={procesando}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: procesando ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: procesando ? 0.5 : 1
            }}
            onMouseEnter={e => !procesando && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={e => !procesando && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
          >
            <X size={18} color="white" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Alerta de información */}
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: '#d1fae5',
            border: '1px solid #6ee7b7',
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#065f46',
                fontWeight: '600'
              }}>
                Esta acción reactivará el abono
              </p>
              <p style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.8125rem',
                color: '#047857',
                lineHeight: '1.4'
              }}>
                El abono volverá a ser visible para todos los vendedores y se podrán realizar acciones sobre él nuevamente.
              </p>
            </div>
          </div>

          {/* Información del abono */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Detalles del Abono
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>ID:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                  #{abono.id.toString().padStart(3, '0')}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Cliente:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                  {abono.cliente.nombre}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Servicio:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                  {abono.servicio.tipo}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Monto Total:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>
                  ${abono.planPago.montoTotal.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Progreso:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                  {abono.planPago.abonosRealizados} de {abono.planPago.abonosPlaneados} abonos
                </span>
              </div>
            </div>
          </div>

          {/* Motivo de reactivación */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="motivo-reactivacion"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}
            >
              Motivo de Reactivación <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              id="motivo-reactivacion"
              value={motivoReactivacion}
              onChange={(e) => setMotivoReactivacion(e.target.value)}
              disabled={procesando}
              placeholder="Describe el motivo por el cual se reactiva este abono..."
              maxLength={500}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#9ca3af'
            }}>
              <span>Este motivo quedará registrado en el historial</span>
              <span>{motivoReactivacion.length}/500</span>
            </div>
          </div>

          {/* Confirmación */}
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <CheckCircle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#92400e',
                fontWeight: '600'
              }}>
                ¿Estás seguro de reactivar este abono?
              </p>
              <p style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.8125rem',
                color: '#b45309',
                lineHeight: '1.4'
              }}>
                Los vendedores podrán ver y gestionar este abono nuevamente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
          background: '#f9fafb'
        }}>
          <button
            onClick={manejarCerrar}
            disabled={procesando}
            style={{
              padding: '0.625rem 1.25rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: 'white',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: procesando ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: procesando ? 0.5 : 1
            }}
            onMouseEnter={e => !procesando && (e.currentTarget.style.background = '#f9fafb')}
            onMouseLeave={e => !procesando && (e.currentTarget.style.background = 'white')}
          >
            Cancelar
          </button>
          <button
            onClick={manejarReactivar}
            disabled={procesando || !motivoReactivacion.trim()}
            style={{
              padding: '0.625rem 1.25rem',
              border: 'none',
              borderRadius: '8px',
              background: !motivoReactivacion.trim() ? '#d1d5db' : '#10b981',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: procesando || !motivoReactivacion.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: procesando ? 0.7 : 1
            }}
            onMouseEnter={e => {
              if (!procesando && motivoReactivacion.trim()) {
                e.currentTarget.style.background = '#059669';
              }
            }}
            onMouseLeave={e => {
              if (!procesando && motivoReactivacion.trim()) {
                e.currentTarget.style.background = '#10b981';
              }
            }}
          >
            {procesando ? (
              <>
                <div style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ModalReactivarAbono;