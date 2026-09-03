import React, { useState, useEffect } from 'react';

// ─── Estilos ─────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

.mdv-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: mdvFadeIn 0.2s ease;
}
@media (min-width: 640px) { .mdv-overlay { align-items: center; } }

.mdv-modal {
  background: #fff;
  width: 100%;
  max-width: 600px;
  max-height: 92vh;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
  animation: mdvSlideUp 0.32s cubic-bezier(0.34,1.56,0.64,1);
  font-family: 'Sora', sans-serif;
}
@media (min-width: 640px) {
  .mdv-modal { border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.22); animation: mdvSlideUpCenter 0.32s cubic-bezier(0.34,1.56,0.64,1); }
}

/* Header */
.mdv-header {
  background: linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%);
  padding: 20px 20px 0;
  flex-shrink: 0;
}
.mdv-header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.mdv-header-icon {
  width: 42px; height: 42px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.mdv-header-texts { flex: 1; }
.mdv-header-title { color: #fff; font-size: 17px; font-weight: 700; margin: 0 0 2px; letter-spacing: -0.3px; }
.mdv-header-sub { color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500; margin: 0; }
.mdv-btn-close {
  width: 36px; height: 36px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 8px; color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; transition: background 0.2s; flex-shrink: 0;
}
.mdv-btn-close:hover { background: rgba(255,255,255,0.28); }
.mdv-header-deco {
  height: 5px;
  background: linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
  border-radius: 3px 3px 0 0;
}

/* Body */
.mdv-body { overflow-y: auto; flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 0; }
.mdv-body::-webkit-scrollbar { width: 5px; }
.mdv-body::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
.mdv-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

/* Sección */
.mdv-seccion { margin-bottom: 16px; }
.mdv-seccion-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 700; color: #475569;
  text-transform: uppercase; letter-spacing: 0.6px;
  margin-bottom: 8px;
}
.mdv-seccion-header span.icon { font-size: 16px; }
.mdv-card {
  background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
  padding: 14px; transition: border-color 0.2s;
}

/* Operador */
.mdv-operador-row { display: flex; align-items: center; gap: 12px; }
.mdv-avatar {
  width: 44px; height: 44px; border-radius: 12px;
  background: #1e3a8a; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; flex-shrink: 0;
}
.mdv-operador-name { font-size: 15px; font-weight: 600; color: #1e293b; margin: 0 0 2px; }
.mdv-operador-id { font-size: 12px; color: #94a3b8; margin: 0; }

/* Ruta */
.mdv-ruta { display: flex; flex-direction: column; gap: 0; }
.mdv-ruta-item { display: flex; align-items: center; gap: 10px; }
.mdv-ruta-dot-w { display: flex; flex-direction: column; align-items: center; width: 18px; }
.mdv-dot-origen { width: 10px; height: 10px; border-radius: 50%; background: #10B981; }
.mdv-dot-destino { width: 10px; height: 10px; border-radius: 50%; background: #EF4444; }
.mdv-linea-ruta { width: 2px; height: 18px; background: #e5e7eb; margin: 2px 0; }
.mdv-ruta-label { font-size: 11px; color: #94a3b8; font-weight: 500; margin: 0 0 1px; }
.mdv-ruta-val { font-size: 14px; font-weight: 600; color: #1e293b; margin: 0; }
.mdv-sep { height: 1px; background: #f1f5f9; margin: 12px 0; }
.mdv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mdv-detail-item { display: flex; align-items: flex-start; gap: 8px; }
.mdv-detail-icon { font-size: 16px; margin-top: 1px; }
.mdv-detail-label { font-size: 11px; color: #94a3b8; margin: 0 0 1px; }
.mdv-detail-val { font-size: 13px; font-weight: 600; color: #1e293b; margin: 0; }

/* Unidad */
.mdv-unidad-row { display: flex; align-items: center; gap: 12px; }
.mdv-unidad-icon { font-size: 32px; }
.mdv-unidad-num { font-size: 18px; font-weight: 700; color: #b91c1c; margin: 0 0 2px; }
.mdv-unidad-placas { font-size: 12px; color: #6b7280; margin: 0 0 1px; }
.mdv-unidad-tipo { font-size: 12px; color: #94a3b8; margin: 0; }

/* KM */
.mdv-km-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 10px; }
.mdv-km-item { text-align: center; }
.mdv-km-label { font-size: 11px; color: #94a3b8; margin: 0 0 2px; }
.mdv-km-val { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
.mdv-km-arrow { font-size: 18px; color: #9ca3af; }
.mdv-km-recorrido {
  display: flex; align-items: center; gap: 10px;
  background: #ecfdf5; border-radius: 10px; padding: 10px 14px;
  margin-bottom: 8px;
}
.mdv-km-gasolina {
  display: flex; align-items: center; gap: 10px;
  background: #fffbeb; border-radius: 10px; padding: 10px 14px;
}
.mdv-mini-icon { font-size: 22px; }
.mdv-sub-label { font-size: 12px; color: #6b7280; margin: 0 0 1px; }
.mdv-sub-val { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0; }

/* Encuesta */
.mdv-encuesta-card {
  background: linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%);
  border: 1px solid #fde68a; border-radius: 12px; padding: 16px;
}
.mdv-cal-num { font-size: 40px; font-weight: 700; color: #b45309; line-height: 1; }
.mdv-stars { display: flex; gap: 3px; font-size: 18px; margin-top: 4px; }
.mdv-stars-sm { display: flex; gap: 2px; font-size: 15px; }
.mdv-star-filled { color: #FBBF24; }
.mdv-star-empty  { color: #D1D5DB; }
.mdv-sep-enc { height: 1px; background: #fde68a; margin: 10px 0; }
.mdv-enc-detalles { display: flex; flex-direction: column; gap: 8px; }
.mdv-enc-item { display: flex; align-items: center; justify-content: space-between; }
.mdv-enc-label { font-size: 13px; color: #78716c; font-weight: 500; }
.mdv-comentario-label { font-size: 12px; font-weight: 600; color: #78716c; margin: 8px 0 4px; }
.mdv-comentario-txt { font-size: 13px; color: #44403c; font-style: italic; }

/* Gastos */
.mdv-gasto-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
.mdv-gasto-concepto { font-size: 13px; color: #374151; font-weight: 500; }
.mdv-comprobante { display: inline-flex; align-items: center; gap: 4px; background: #d1fae5; border-radius: 4px; padding: 2px 6px; font-size: 11px; color: #065f46; margin-top: 2px; }
.mdv-gasto-monto { font-size: 14px; font-weight: 700; color: #1e293b; }
.mdv-sep-g { height: 1px; background: #f3f4f6; }
.mdv-total-row { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; }
.mdv-total-label { font-size: 13px; font-weight: 600; color: #374151; }
.mdv-total-monto { font-size: 18px; font-weight: 700; color: #1e293b; }

/* Fotos */
.mdv-fotos-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
@media (min-width: 400px) { .mdv-fotos-grid { grid-template-columns: repeat(3, 1fr); } }
.mdv-foto-wrap {
  position: relative; border-radius: 10px; overflow: hidden;
  aspect-ratio: 4/3; background: #f1f5f9; cursor: pointer;
  transition: transform 0.2s;
}
.mdv-foto-wrap:hover { transform: scale(1.02); }
.mdv-foto-img { width: 100%; height: 100%; object-fit: cover; }
.mdv-foto-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s;
  font-size: 22px; color: #fff;
}
.mdv-foto-wrap:hover .mdv-foto-overlay { opacity: 1; }
.mdv-foto-angulo {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  color: #fff; font-size: 11px; font-weight: 500;
  padding: 4px 6px;
}

/* Estado entrega */
.mdv-estado-card {
  border-radius: 10px; padding: 14px;
  display: flex; align-items: center; justify-content: center;
  gap: 10px; font-size: 15px; font-weight: 600; margin: 10px 0;
}
.mdv-estado-ok { background: #d1fae5; color: #065f46; }
.mdv-estado-dano { background: #fef3c7; color: #92400e; }
.mdv-danos-desc {
  background: #fff7ed; border: 1px solid #fed7aa;
  border-radius: 8px; padding: 10px 12px;
  font-size: 13px; color: #7c2d12; line-height: 1.5;
}
.mdv-danos-label { font-weight: 600; margin: 0 0 4px; font-size: 12px; }

/* Foto daño */
.mdv-foto-dano-sec { margin-top: 10px; }
.mdv-foto-dano-header {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #dc2626;
  margin-bottom: 8px;
}
.mdv-badge-marcas {
  background: #dc2626; color: #fff;
  font-size: 11px; font-weight: 700;
  border-radius: 10px; padding: 1px 6px;
  display: inline-flex; align-items: center; gap: 2px;
}
.mdv-foto-dano-wrap {
  position: relative; border-radius: 10px; overflow: hidden;
  width: 100%; aspect-ratio: 4/3; background: #f1f5f9; cursor: pointer;
}
.mdv-foto-dano-img { width: 100%; height: 100%; object-fit: cover; }
.mdv-foto-dano-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.25);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s; font-size: 22px; color: #fff;
}
.mdv-foto-dano-wrap:hover .mdv-foto-dano-overlay { opacity: 1; }
.mdv-dano-info-row {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: #dc2626; margin-top: 6px;
}
/* Leyenda daños */
.mdv-leyenda { margin-top: 10px; }
.mdv-leyenda-title { font-size: 12px; font-weight: 600; color: #374151; margin: 0 0 8px; }
.mdv-leyenda-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.mdv-leyenda-item {
  display: flex; align-items: center; gap: 5px;
  background: #f8fafc; border: 1px solid #e5e7eb;
  border-radius: 6px; padding: 3px 8px;
  font-size: 12px; color: #374151;
}
.mdv-leyenda-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }

/* Marca daño */
.mdv-marca {
  position: absolute;
  width: 28px; height: 28px;
  margin-left: -14px; margin-top: -14px;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.mdv-marca-halo {
  position: absolute;
  width: 28px; height: 28px; border-radius: 50%;
  opacity: 0.35;
}
.mdv-marca-inner {
  width: 18px; height: 18px;
  border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; color: #fff;
  position: relative;
}

/* Observaciones */
.mdv-obs { background: #fafbfc; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; }
.mdv-obs-txt { font-size: 13px; color: #374151; line-height: 1.6; margin: 0; }

/* Footer */
.mdv-footer { padding: 14px 20px; border-top: 1px solid #f1f5f9; flex-shrink: 0; background: #fff; }
.mdv-btn-calificar {
  width: 100%; padding: 13px;
  border: none; background: linear-gradient(135deg, #1e3a8a, #2563eb);
  border-radius: 10px; font-size: 14px; font-weight: 600; color: #fff;
  cursor: pointer; font-family: 'Sora', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 12px rgba(37,99,235,0.35);
}
.mdv-btn-calificar:hover { opacity: 0.9; transform: translateY(-1px); }
.mdv-calificado-banner {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  color: #065f46; font-size: 14px; font-weight: 600;
  background: #d1fae5; border-radius: 10px; padding: 13px;
}

/* Lightbox */
.mdv-lightbox {
  position: fixed; inset: 0; background: rgba(0,0,0,0.92);
  z-index: 2000; display: flex; align-items: center; justify-content: center;
  animation: mdvFadeIn 0.15s ease;
}
.mdv-lightbox-img { max-width: 95vw; max-height: 90vh; object-fit: contain; border-radius: 6px; }
.mdv-lightbox-close {
  position: absolute; top: 16px; right: 16px;
  background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
  color: #fff; border-radius: 8px; width: 38px; height: 38px;
  cursor: pointer; font-size: 20px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.mdv-lightbox-close:hover { background: rgba(255,255,255,0.3); }

@keyframes mdvFadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes mdvSlideUp { from { opacity: 0; transform: translateY(60px) } to { opacity: 1; transform: translateY(0) } }
@keyframes mdvSlideUpCenter { from { opacity: 0; transform: translateY(40px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TIPOS_DANO = [
  { id: 'golpe', nombre: 'Golpe', color: '#DC2626', forma: 'circle' },
  { id: 'rayon', nombre: 'Rayón', color: '#F59E0B', forma: 'square' },
  { id: 'abolladura', nombre: 'Abolladura', color: '#8B5CF6', forma: 'diamond' },
  { id: 'fisura', nombre: 'Fisura', color: '#3B82F6', forma: 'triangle' },
  { id: 'faltante', nombre: 'Faltante', color: '#EF4444', forma: 'x' },
  { id: 'otro', nombre: 'Otro', color: '#6B7280', forma: 'star' },
];
const getTipoConfig = (tipo) => TIPOS_DANO.find(t => t.id === tipo) || TIPOS_DANO[0];

const Stars = ({ val, size = 18 }) => (
  <div className={size < 18 ? 'mdv-stars-sm' : 'mdv-stars'}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} className={s <= val ? 'mdv-star-filled' : 'mdv-star-empty'}>★</span>
    ))}
  </div>
);

const getNivelGasolina = (nivel) => ({
  lleno: { texto: 'Tanque Lleno', color: '#10B981' },
  medio: { texto: 'Medio Tanque', color: '#F59E0B' },
  vacio: { texto: 'Tanque Vacío', color: '#EF4444' },
}[nivel] || { texto: 'No especificado', color: '#6B7280' });

const FORMAS_CSS = {
  circle: { borderRadius: '50%' },
  square: { borderRadius: '3px' },
  diamond: { borderRadius: '3px', transform: 'rotate(45deg)' },
  triangle: { borderRadius: '3px' },
  x: { borderRadius: '50%' },
  star: { borderRadius: '50%' },
};
const FORMA_LABEL = { triangle: '▲', x: '✕', star: '★', diamond: '◆' };

// ─── Componente principal ─────────────────────────────────────────────────────
export const ModalDetalleViaje = ({ visible, viaje, onClose, onCalificar }) => {
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { fotoSeleccionada ? setFotoSeleccionada(null) : onClose(); } };
    if (visible) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, fotoSeleccionada]);

  if (!visible || !viaje) return null;

  const contarDanosPorTipo = () => {
    if (!viaje.entrega?.fotoDano?.marcas) return {};
    return viaje.entrega.fotoDano.marcas.reduce((acc, m) => {
      acc[m.tipo] = (acc[m.tipo] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <>
      <style>{css}</style>
      <div className="mdv-overlay" onClick={onClose}>
        <div className="mdv-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">

          {/* Header */}
          <div className="mdv-header">
            <div className="mdv-header-top">
              <div className="mdv-header-icon">📋</div>
              <div className="mdv-header-texts">
                <p className="mdv-header-title">Detalles del Viaje</p>
                <p className="mdv-header-sub">Folio: {viaje.folio}</p>
              </div>
              <button className="mdv-btn-close" onClick={onClose} aria-label="Cerrar">✕</button>
            </div>
            <div className="mdv-header-deco" />
          </div>

          {/* Body */}
          <div className="mdv-body">

            {/* Operador */}
            <div className="mdv-seccion">
              <div className="mdv-seccion-header"><span className="icon">👤</span> Operador</div>
              <div className="mdv-card">
                <div className="mdv-operador-row">
                  <div className="mdv-avatar">{viaje.operador?.iniciales}</div>
                  <div>
                    <p className="mdv-operador-name">{viaje.operador?.nombre} {viaje.operador?.apellidos}</p>
                    <p className="mdv-operador-id">ID: {viaje.operador?.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info viaje */}
            <div className="mdv-seccion">
              <div className="mdv-seccion-header"><span className="icon">🗺️</span> Información del Viaje</div>
              <div className="mdv-card">
                <div className="mdv-ruta">
                  <div className="mdv-ruta-item">
                    <div className="mdv-ruta-dot-w"><div className="mdv-dot-origen" /></div>
                    <div><p className="mdv-ruta-label">Origen</p><p className="mdv-ruta-val">{viaje.ruta?.origen}</p></div>
                  </div>
                  <div className="mdv-ruta-item">
                    <div className="mdv-ruta-dot-w"><div className="mdv-linea-ruta" /><div className="mdv-dot-destino" /></div>
                    <div><p className="mdv-ruta-label">Destino</p><p className="mdv-ruta-val">{viaje.ruta?.destino}</p></div>
                  </div>
                </div>
                <div className="mdv-sep" />
                <div className="mdv-grid">
                  {[
                    ['🏢', 'Cliente', viaje.cliente],
                    ['📅', 'Fecha inicio', viaje.fechaInicio],
                    ['🕐', 'Hora inicio', viaje.horaInicio],
                    ['✅', 'Finalizado', `${viaje.fechaFin} - ${viaje.horaFin}`],
                    ['⏳', 'Duración', viaje.duracion],
                    ['👥', 'Pasajeros', viaje.pasajeros],
                  ].map(([icon, label, val]) => (
                    <div className="mdv-detail-item" key={label}>
                      <span className="mdv-detail-icon">{icon}</span>
                      <div><p className="mdv-detail-label">{label}</p><p className="mdv-detail-val">{val}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Unidad */}
            <div className="mdv-seccion">
              <div className="mdv-seccion-header"><span className="icon">🚌</span> Unidad</div>
              <div className="mdv-card">
                <div className="mdv-unidad-row">
                  <span className="mdv-unidad-icon">🚌</span>
                  <div>
                    <p className="mdv-unidad-num">{viaje.unidad?.numero}</p>
                    <p className="mdv-unidad-placas">Placas: {viaje.unidad?.placas}</p>
                    <p className="mdv-unidad-tipo">{viaje.unidad?.tipo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kilometraje */}
            {viaje.kilometraje && (
              <div className="mdv-seccion">
                <div className="mdv-seccion-header"><span className="icon">⚡</span> Kilometraje y Combustible</div>
                <div className="mdv-card">
                  <div className="mdv-km-row">
                    <div className="mdv-km-item">
                      <p className="mdv-km-label">Inicial</p>
                      <p className="mdv-km-val">{viaje.kilometraje.inicial?.toLocaleString() || 0} km</p>
                    </div>
                    <span className="mdv-km-arrow">→</span>
                    <div className="mdv-km-item">
                      <p className="mdv-km-label">Final</p>
                      <p className="mdv-km-val">{viaje.kilometraje.final?.toLocaleString() || 0} km</p>
                    </div>
                  </div>
                  <div className="mdv-km-recorrido">
                    <span className="mdv-mini-icon">🏁</span>
                    <div>
                      <p className="mdv-sub-label">Kilómetros Recorridos</p>
                      <p className="mdv-sub-val">{viaje.kilometraje.recorridos?.toLocaleString() || 0} km</p>
                    </div>
                  </div>
                  {viaje.kilometraje.litrosGasolina && (
                    <div className="mdv-km-gasolina" style={{ marginTop: 8 }}>
                      <span className="mdv-mini-icon">⛽</span>
                      <div>
                        <p className="mdv-sub-label">Gasolina Cargada</p>
                        <p className="mdv-sub-val">{viaje.kilometraje.litrosGasolina} litros</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Encuesta */}
            {viaje.encuestaCliente && (
              <div className="mdv-seccion">
                <div className="mdv-seccion-header"><span className="icon">⭐</span> Encuesta del Cliente</div>
                <div className="mdv-encuesta-card">
                  <div className="mdv-cal-num">{viaje.encuestaCliente.calificacion?.toFixed(1) || '5.0'}</div>
                  <Stars val={viaje.encuestaCliente.calificacion || 5} />
                  {viaje.encuestaCliente.detalles && (
                    <>
                      <div className="mdv-sep-enc" />
                      <div className="mdv-enc-detalles">
                        {Object.entries(viaje.encuestaCliente.detalles).map(([k, v]) => (
                          <div className="mdv-enc-item" key={k}>
                            <span className="mdv-enc-label" style={{ textTransform: 'capitalize' }}>{k}</span>
                            <Stars val={v} size={15} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {viaje.encuestaCliente.comentarios && (
                    <>
                      <div className="mdv-sep-enc" />
                      <p className="mdv-comentario-label">Comentarios:</p>
                      <p className="mdv-comentario-txt">"{viaje.encuestaCliente.comentarios}"</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Gastos */}
            {viaje.gastos && (
              <div className="mdv-seccion">
                <div className="mdv-seccion-header"><span className="icon">🧾</span> Gastos del Viaje</div>
                <div className="mdv-card">
                  {viaje.gastos.items?.map((item, i) => (
                    <React.Fragment key={i}>
                      <div className="mdv-gasto-row">
                        <div>
                          <p className="mdv-gasto-concepto">{item.concepto}</p>
                          {item.comprobante && <span className="mdv-comprobante">📎 Con comprobante</span>}
                        </div>
                        <p className="mdv-gasto-monto">${item.monto.toFixed(2)}</p>
                      </div>
                      {i < viaje.gastos.items.length - 1 && <div className="mdv-sep-g" />}
                    </React.Fragment>
                  ))}
                  <div className="mdv-sep-g" style={{ margin: '8px 0' }} />
                  <div className="mdv-total-row">
                    <p className="mdv-total-label">Total de gastos</p>
                    <p className="mdv-total-monto">${viaje.gastos.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fotos de Inicio */}
            {viaje.fotosInicio?.length > 0 && (
              <div className="mdv-seccion">
                <div className="mdv-seccion-header"><span className="icon">🚀</span> Fotos de Inicio</div>
                <div className="mdv-fotos-grid">
                  {viaje.fotosInicio.map((foto, index) => (
                    <div className="mdv-foto-wrap" key={foto.id || `inicio-${index}`} onClick={() => setFotoSeleccionada(foto.uri)}>
                      <img src={foto.uri} alt={foto.angulo} className="mdv-foto-img" />
                      <div className="mdv-foto-overlay">⛶</div>
                      <div className="mdv-foto-angulo">{foto.angulo}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fotos entrega */}
            {viaje.entrega?.fotos?.length > 0 && (
              <div className="mdv-seccion">
                <div className="mdv-seccion-header"><span className="icon">📷</span> Fotos de Entrega</div>
                <div className="mdv-fotos-grid">
                  {viaje.entrega.fotos.map(foto => (
                    <div className="mdv-foto-wrap" key={foto.id} onClick={() => setFotoSeleccionada(foto.uri)}>
                      <img src={foto.uri} alt={foto.angulo} className="mdv-foto-img" />
                      <div className="mdv-foto-overlay">⛶</div>
                      <div className="mdv-foto-angulo">{foto.angulo}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estado unidad */}
            {viaje.entrega && (
              <div className="mdv-seccion">
                <div className="mdv-seccion-header"><span className="icon">🛡️</span> Estado de la Unidad al Entregar</div>
                <div className="mdv-card">
                  {viaje.entrega.nivelGasolina && (() => {
                    const ni = getNivelGasolina(viaje.entrega.nivelGasolina);
                    return (
                      <div className="mdv-km-recorrido" style={{ marginBottom: 10, background: `${ni.color}15` }}>
                        <span className="mdv-mini-icon">⛽</span>
                        <div>
                          <p className="mdv-sub-label">Nivel de Gasolina</p>
                          <p className="mdv-sub-val" style={{ color: ni.color }}>{ni.texto}</p>
                        </div>
                      </div>
                    );
                  })()}
                  <div className={`mdv-estado-card ${viaje.entrega.tieneDanos ? 'mdv-estado-dano' : 'mdv-estado-ok'}`}>
                    <span style={{ fontSize: 24 }}>{viaje.entrega.tieneDanos ? '⚠️' : '✅'}</span>
                    {viaje.entrega.tieneDanos ? 'Con Daños' : 'Sin Daños'}
                  </div>
                  {viaje.entrega.tieneDanos && viaje.entrega.descripcionDanos && (
                    <div className="mdv-danos-desc">
                      <p className="mdv-danos-label">Descripción de daños:</p>
                      {viaje.entrega.descripcionDanos}
                    </div>
                  )}
                  {viaje.entrega.tieneDanos && viaje.entrega.fotoDano && (
                    <div className="mdv-foto-dano-sec">
                      <div className="mdv-foto-dano-header">
                        <span>⚠️</span> Foto del Área Dañada
                        {viaje.entrega.fotoDano.marcas?.length > 0 && (
                          <span className="mdv-badge-marcas">📍 {viaje.entrega.fotoDano.marcas.length}</span>
                        )}
                      </div>
                      <div className="mdv-foto-dano-wrap" onClick={() => setFotoSeleccionada(viaje.entrega.fotoDano.uri)}>
                        <img src={viaje.entrega.fotoDano.uri} alt="Daño" className="mdv-foto-dano-img" />
                        {viaje.entrega.fotoDano.marcas?.map((m, i) => {
                          const tc = getTipoConfig(m.tipo);
                          return (
                            <div
                              key={m.id}
                              className="mdv-marca"
                              style={{ left: `${m.x}%`, top: `${m.y}%` }}
                            >
                              <div className="mdv-marca-halo" style={{ background: tc.color }} />
                              <div
                                className="mdv-marca-inner"
                                style={{ background: tc.color, ...FORMAS_CSS[tc.forma] }}
                              >
                                {FORMA_LABEL[tc.forma] || (i + 1)}
                              </div>
                            </div>
                          );
                        })}
                        <div className="mdv-foto-dano-overlay">⛶</div>
                      </div>
                      <div className="mdv-dano-info-row">
                        ℹ️ Se marcó{' '}
                        {viaje.entrega.fotoDano.marcas?.length === 1
                          ? '1 punto'
                          : `${viaje.entrega.fotoDano.marcas?.length} puntos`} de daño
                      </div>
                      {viaje.entrega.fotoDano.marcas?.length > 0 && (
                        <div className="mdv-leyenda">
                          <p className="mdv-leyenda-title">Tipos de Daño Marcados:</p>
                          <div className="mdv-leyenda-grid">
                            {TIPOS_DANO.map(tipo => {
                              const cnt = contarDanosPorTipo()[tipo.id] || 0;
                              if (!cnt) return null;
                              return (
                                <div className="mdv-leyenda-item" key={tipo.id}>
                                  <div className="mdv-leyenda-dot" style={{ background: tipo.color }} />
                                  {tipo.nombre} ({cnt})
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Observaciones */}
            {viaje.observaciones && (
              <div className="mdv-seccion">
                <div className="mdv-seccion-header"><span className="icon">💬</span> Observaciones</div>
                <div className="mdv-obs"><p className="mdv-obs-txt">{viaje.observaciones}</p></div>
              </div>
            )}

          </div>

          {/* Footer */}
          {viaje.estado === 'pendiente_revision' && onCalificar && (
            <div className="mdv-footer">
              <button className="mdv-btn-calificar" onClick={onCalificar} type="button">
                ⭐ Calificar Operador
              </button>
            </div>
          )}
          {viaje.estado === 'calificado' && viaje.calificacionAdmin && (
            <div className="mdv-footer">
              <div className="mdv-calificado-banner">✅ Viaje ya calificado</div>
            </div>
          )}

        </div>
      </div>

      {/* Lightbox */}
      {fotoSeleccionada && (
        <div className="mdv-lightbox" onClick={() => setFotoSeleccionada(null)}>
          <button className="mdv-lightbox-close" onClick={() => setFotoSeleccionada(null)} aria-label="Cerrar foto">✕</button>
          <img src={fotoSeleccionada} alt="Vista completa" className="mdv-lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};

export default ModalDetalleViaje;