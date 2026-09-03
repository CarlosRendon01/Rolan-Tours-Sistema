import React, { useState, useEffect, useCallback } from 'react';

// ─── Estilos ────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

.mco-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: mcoFadeIn 0.2s ease;
}

@media (min-width: 640px) {
  .mco-overlay { align-items: center; }
}

.mco-modal {
  background: #fff;
  width: 100%;
  max-width: 560px;
  max-height: 92vh;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
  animation: mcoSlideUp 0.32s cubic-bezier(0.34,1.56,0.64,1);
  font-family: 'Sora', sans-serif;
}

@media (min-width: 640px) {
  .mco-modal {
    border-radius: 20px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.22);
    animation: mcoSlideUpCenter 0.32s cubic-bezier(0.34,1.56,0.64,1);
  }
}

/* Header */
.mco-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  padding: 20px 20px 0;
  position: relative;
  flex-shrink: 0;
}
.mco-header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.mco-header-icon {
  width: 42px; height: 42px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.mco-header-texts { flex: 1; }
.mco-header-title {
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 2px;
  letter-spacing: -0.3px;
}
.mco-header-sub {
  color: rgba(255,255,255,0.75);
  font-size: 13px;
  font-weight: 500;
  margin: 0;
}
.mco-btn-close {
  width: 36px; height: 36px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  transition: background 0.2s;
  flex-shrink: 0;
}
.mco-btn-close:hover { background: rgba(255,255,255,0.28); }
.mco-header-deco {
  height: 5px;
  background: linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
  border-radius: 3px 3px 0 0;
}

/* Body */
.mco-body {
  overflow-y: auto;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mco-body::-webkit-scrollbar { width: 5px; }
.mco-body::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
.mco-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

/* Info viaje */
.mco-info-viaje {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}
.mco-info-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}
.mco-info-row span.icon { font-size: 14px; }

/* Criterio */
.mco-criterio {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  margin-bottom: 8px;
}
.mco-criterio:hover {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
}
.mco-criterio-header {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 4px;
}
.mco-criterio-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.mco-criterio-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}
.mco-criterio-desc {
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 10px;
  padding-left: 41px;
}
.mco-stars {
  display: flex;
  gap: 6px;
  padding-left: 41px;
}
.mco-star-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 28px;
  padding: 2px;
  transition: transform 0.15s;
  line-height: 1;
}
.mco-star-btn:hover { transform: scale(1.2); }
.mco-star-filled { color: #FBBF24; }
.mco-star-empty  { color: #D1D5DB; }
.mco-rating-label {
  font-size: 11px;
  font-weight: 600;
  margin-top: 6px;
  padding-left: 41px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Promedio */
.mco-promedio {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border: 1px solid #c4b5fd;
  border-radius: 14px;
  padding: 18px;
  text-align: center;
  margin: 4px 0 8px;
}
.mco-promedio-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #6d28d9;
  margin-bottom: 10px;
}
.mco-promedio-num {
  font-size: 44px;
  font-weight: 700;
  color: #5b21b6;
  line-height: 1;
}
.mco-promedio-label {
  font-size: 13px;
  color: #7c3aed;
  margin-top: 2px;
}
.mco-promedio-stars {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 22px;
}

/* Comentarios */
.mco-comments-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 8px;
}
.mco-comments-header {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 10px;
}
.mco-textarea {
  width: 100%;
  min-height: 90px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  font-family: 'Sora', sans-serif;
  color: #1e293b;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
}
.mco-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}
.mco-char-count {
  font-size: 11px;
  color: #94a3b8;
  text-align: right;
  margin-top: 4px;
}

/* Nota */
.mco-nota {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 12px;
  font-size: 12px;
  color: #1d4ed8;
  line-height: 1.5;
  margin-bottom: 8px;
}

/* Footer */
.mco-footer {
  padding: 14px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  background: #fff;
}
.mco-btn-cancel {
  flex: 1;
  padding: 12px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all 0.2s;
}
.mco-btn-cancel:hover { border-color: #9ca3af; background: #f9fafb; }

.mco-btn-save {
  flex: 2;
  padding: 12px;
  border: none;
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 12px rgba(37,99,235,0.35);
}
.mco-btn-save:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.mco-btn-save:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  box-shadow: none;
  cursor: not-allowed;
}

@keyframes mcoFadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes mcoSlideUp {
  from { opacity: 0; transform: translateY(60px) }
  to   { opacity: 1; transform: translateY(0) }
}
@keyframes mcoSlideUpCenter {
  from { opacity: 0; transform: translateY(40px) scale(0.97) }
  to   { opacity: 1; transform: translateY(0) scale(1) }
}
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getColorCalificacion = (v) => {
  if (v === 0) return { color: '#9CA3AF', texto: 'Sin calificar' };
  if (v <= 2)  return { color: '#EF4444', texto: 'Deficiente' };
  if (v === 3) return { color: '#F59E0B', texto: 'Regular' };
  if (v === 4) return { color: '#3B82F6', texto: 'Bueno' };
  return { color: '#10B981', texto: 'Excelente' };
};

const Estrellas = ({ valor, setValor }) => (
  <div className="mco-stars">
    {[1,2,3,4,5].map(s => (
      <button
        key={s}
        className="mco-star-btn"
        onClick={() => setValor(s)}
        type="button"
        aria-label={`${s} estrellas`}
      >
        <span className={s <= valor ? 'mco-star-filled' : 'mco-star-empty'}>★</span>
      </button>
    ))}
  </div>
);

const CRITERIOS = [
  { key: 'vehiculoLimpio', titulo: 'Vehículo limpio',     desc: 'Limpieza interior y exterior del vehículo',          icon: '🚗', bg: '#dbeafe', color: '#3B82F6' },
  { key: 'franela',        titulo: 'Franela',              desc: 'Uso de franela para limpieza y mantenimiento',       icon: '✨', bg: '#ede9fe', color: '#8B5CF6' },
  { key: 'puntualidad',    titulo: 'Puntualidad',          desc: 'Cumplimiento de horarios de salida y llegada',       icon: '⏰', bg: '#d1fae5', color: '#10B981' },
  { key: 'uniforme',       titulo: 'Uniforme',             desc: 'Uso correcto y presentación del uniforme',           icon: '👕', bg: '#fef3c7', color: '#F59E0B' },
  { key: 'bitacora',       titulo: 'Bitácora',             desc: 'Registro correcto y completo de la bitácora',        icon: '📋', bg: '#fee2e2', color: '#EF4444' },
  { key: 'rendimiento',    titulo: 'Rendimiento',          desc: 'Eficiencia en el consumo de combustible',            icon: '⚡', bg: '#cffafe', color: '#06B6D4' },
  { key: 'encuesta',       titulo: 'Encuesta',             desc: 'Aplicación de encuestas a clientes',                 icon: '💬', bg: '#fce7f3', color: '#EC4899' },
  { key: 'errores',        titulo: 'Errores',              desc: 'Ausencia de errores operativos durante el viaje',    icon: '⚠️', bg: '#ffedd5', color: '#F97316' },
  { key: 'objetosOlvidados', titulo: 'Objetos olvidados', desc: 'Gestión adecuada de objetos olvidados por clientes', icon: '💼', bg: '#ccfbf1', color: '#14B8A6' },
  { key: 'golpesRayones',  titulo: 'Golpes y rayones',     desc: 'Estado del vehículo sin daños nuevos',               icon: '🛡️', bg: '#ecfccb', color: '#84CC16' },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export const ModalCalificarOperador = ({ visible, viaje, onClose, onGuardar }) => {
  const [vals, setVals] = useState(Object.fromEntries(CRITERIOS.map(c => [c.key, 0])));
  const [comentarios, setComentarios] = useState('');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleCancelar(); };
    if (visible) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  const setVal = useCallback((key, v) => setVals(prev => ({ ...prev, [key]: v })), []);

  const todas = CRITERIOS.every(c => vals[c.key] > 0);
  const promedio = todas
    ? (CRITERIOS.reduce((s, c) => s + vals[c.key], 0) / CRITERIOS.length).toFixed(1)
    : '0.0';

  const handleGuardar = () => {
    if (!todas) return;
    const data = { ...vals, comentarios, fecha: new Date().toISOString(), promedio };
    onGuardar(data);
    reset();
  };

  const reset = () => {
    setVals(Object.fromEntries(CRITERIOS.map(c => [c.key, 0])));
    setComentarios('');
  };

  const handleCancelar = () => {
    if (CRITERIOS.some(c => vals[c.key] > 0) || comentarios) {
      if (!window.confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.')) return;
    }
    reset();
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      <style>{css}</style>
      <div className="mco-overlay" onClick={handleCancelar}>
        <div className="mco-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">

          {/* Header */}
          <div className="mco-header">
            <div className="mco-header-top">
              <div className="mco-header-icon">⭐</div>
              <div className="mco-header-texts">
                <p className="mco-header-title">Calificar Conductor</p>
                <p className="mco-header-sub">
                  {viaje?.operador?.nombre} {viaje?.operador?.apellidos}
                </p>
              </div>
              <button className="mco-btn-close" onClick={handleCancelar} aria-label="Cerrar">✕</button>
            </div>
            <div className="mco-header-deco" />
          </div>

          {/* Body */}
          <div className="mco-body">
            <div className="mco-info-viaje">
              <div className="mco-info-row">
                <span className="icon">📄</span> Folio: {viaje?.folio}
              </div>
              <div className="mco-info-row">
                <span className="icon">🗺️</span> {viaje?.ruta?.origen} → {viaje?.ruta?.destino}
              </div>
            </div>

            {CRITERIOS.map(c => {
              const v = vals[c.key];
              const { color, texto } = getColorCalificacion(v);
              return (
                <div className="mco-criterio" key={c.key}>
                  <div className="mco-criterio-header">
                    <div className="mco-criterio-icon" style={{ background: c.bg }}>
                      {c.icon}
                    </div>
                    <p className="mco-criterio-title">{c.titulo}</p>
                  </div>
                  <p className="mco-criterio-desc">{c.desc}</p>
                  <Estrellas valor={v} setValor={(val) => setVal(c.key, val)} />
                  {v > 0 && (
                    <p className="mco-rating-label" style={{ color }}>{texto}</p>
                  )}
                </div>
              );
            })}

            {todas && (
              <div className="mco-promedio">
                <div className="mco-promedio-header">
                  <span>📊</span> Calificación General
                </div>
                <div className="mco-promedio-num">{promedio}</div>
                <div className="mco-promedio-label">de 5.0</div>
                <div className="mco-promedio-stars">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: s <= Math.round(parseFloat(promedio)) ? '#FBBF24' : '#D1D5DB' }}>★</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mco-comments-section">
              <div className="mco-comments-header">
                <span>💬</span> Comentarios adicionales (opcional)
              </div>
              <textarea
                className="mco-textarea"
                placeholder="Agrega observaciones o comentarios sobre el desempeño del conductor..."
                value={comentarios}
                onChange={e => e.target.value.length <= 500 && setComentarios(e.target.value)}
                rows={4}
              />
              <p className="mco-char-count">{comentarios.length}/500 caracteres</p>
            </div>

            <div className="mco-nota">
              <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
              El conductor recibirá una notificación una vez que guardes esta calificación. La evaluación quedará registrada en su historial.
            </div>
          </div>

          {/* Footer */}
          <div className="mco-footer">
            <button className="mco-btn-cancel" onClick={handleCancelar} type="button">
              ✕ Cancelar
            </button>
            <button
              className="mco-btn-save"
              onClick={handleGuardar}
              disabled={!todas}
              type="button"
            >
              ✔ Guardar Calificación
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default ModalCalificarOperador;