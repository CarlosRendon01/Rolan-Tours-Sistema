import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Receipt, 
  Calendar, 
  User, 
  CreditCard, 
  FileText, 
  CheckCircle 
} from 'lucide-react';
import './ModalReciboAbono.css';
import { generarPDFReciboAbono } from './generarPDFReciboAbono';

// ============================================
// UTILIDADES
// ============================================

const formatearFecha = (fecha) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-MX', opciones);
};

const formatearMoneda = (cantidad) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(cantidad);
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ModalReciboAbono = ({ abierto, onCerrar, pagoSeleccionado }) => {
  const [imprimiendo, setImprimiendo] = useState(false);
  const [abonoSeleccionado, setAbonoSeleccionado] = useState(null); // ✅ NUEVO
  const reciboRef = useRef(null);

  if (!abierto || !pagoSeleccionado) return null;

  // ✅ Filtrar solo abonos activos
  const abonosDisponibles = pagoSeleccionado.historialAbonos?.filter(abono => abono.activo !== false) || [];

  const fechaActual = new Date().toLocaleDateString('es-MX');
  
  // ✅ Generar número de recibo basado en el abono seleccionado
  const numeroRecibo = abonoSeleccionado 
    ? `REC-${pagoSeleccionado.id.toString().padStart(4, '0')}-${abonoSeleccionado.numeroAbono}`
    : `REC-${pagoSeleccionado.id.toString().padStart(4, '0')}`;

  // Handlers
  const manejarImprimir = () => {
    if (!abonoSeleccionado) {
      alert('Por favor selecciona un abono');
      return;
    }
    setImprimiendo(true);
    setTimeout(() => {
      window.print();
      setImprimiendo(false);
    }, 100);
  };

  const manejarDescargar = async () => {
    if (!abonoSeleccionado) {
      alert('Por favor selecciona un abono');
      return;
    }

    try {
      setImprimiendo(true);

      const datosRecibo = {
        numeroRecibo: numeroRecibo,
        cliente: {
          nombre: pagoSeleccionado.cliente.nombre,
          email: pagoSeleccionado.cliente.email,
          telefono: pagoSeleccionado.cliente.telefono || ''
        },
        servicio: {
          tipo: pagoSeleccionado.servicio.tipo,
          descripcion: pagoSeleccionado.servicio.descripcion,
          fechaTour: pagoSeleccionado.servicio.fechaTour
        },
        numeroContrato: pagoSeleccionado.numeroContrato,
        numeroAbono: abonoSeleccionado.numeroAbono,
        montoAbono: abonoSeleccionado.monto,
        fechaAbono: abonoSeleccionado.fecha,
        metodoPago: abonoSeleccionado.metodoPago,
        referencia: abonoSeleccionado.referencia,
        montoTotal: pagoSeleccionado.planPago.montoTotal,
        montoPagado: pagoSeleccionado.planPago.montoPagado,
        saldoPendiente: pagoSeleccionado.planPago.saldoPendiente,
        abonosRealizados: pagoSeleccionado.planPago.abonosRealizados,
        abonosPlaneados: pagoSeleccionado.planPago.abonosPlaneados,
        estado: pagoSeleccionado.estado,
        observaciones: pagoSeleccionado.observaciones || ''
      };

      await generarPDFReciboAbono(datosRecibo);
      
      console.log('PDF de abono generado exitosamente');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF del recibo de abono. Por favor, intente nuevamente.');
    } finally {
      setImprimiendo(false);
    }
  };

  const manejarClickOverlay = (e) => {
    if (e.target === e.currentTarget) {
      onCerrar();
    }
  };

  return (
    <div className="modal-recibo-overlay" onClick={manejarClickOverlay}>
      <div className="modal-recibo-contenedor" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="modal-recibo-header no-print">
          <div className="modal-recibo-titulo-seccion">
            <Receipt size={28} className="modal-recibo-icono-titulo" />
            <div>
              <h2 className="modal-recibo-titulo">Recibo de Pago por Abono</h2>
              <p className="modal-recibo-subtitulo">Selecciona el abono para generar el recibo</p>
            </div>
          </div>
          <button 
            className="modal-recibo-boton-cerrar" 
            onClick={onCerrar} 
            title="Cerrar (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* ✅ SELECTOR DE ABONOS */}
        <div className="modal-recibo-contenido" ref={reciboRef}>
          {abonosDisponibles.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280'
            }}>
              <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
              <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>No hay abonos disponibles</p>
            </div>
          ) : (
            <>
              {/* Lista de abonos para seleccionar */}
              <div style={{
                display: 'grid',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 1rem 0'
                }}>
                  Selecciona el abono para generar el recibo:
                </h3>
                {abonosDisponibles.map((abono) => {
                  const esSeleccionado = abonoSeleccionado?.id === abono.id;
                  
                  return (
                    <div
                      key={abono.id}
                      onClick={() => setAbonoSeleccionado(abono)}
                      style={{
                        padding: '1rem',
                        border: esSeleccionado ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        background: esSeleccionado ? '#eff6ff' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                    >
                      {esSeleccionado && (
                        <div style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          background: '#3b82f6',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CheckCircle size={16} />
                        </div>
                      )}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <p style={{
                            margin: 0,
                            fontWeight: '600',
                            color: esSeleccionado ? '#3b82f6' : '#374151',
                            fontSize: '1rem'
                          }}>
                            Abono #{abono.numeroAbono}
                          </p>
                          <p style={{
                            margin: '0.25rem 0 0 0',
                            fontSize: '0.875rem',
                            color: '#6b7280'
                          }}>
                            {new Date(abono.fecha).toLocaleDateString('es-MX')} • {abono.metodoPago}
                          </p>
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: esSeleccionado ? '#3b82f6' : '#374151'
                        }}>
                          ${abono.monto.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Preview del recibo si hay abono seleccionado */}
              {abonoSeleccionado && (
                <div className="recibo-documento">
                  {/* ... TODO EL HTML DEL RECIBO ORIGINAL ... */}
                  {/* (mantén todo el contenido visual del recibo como estaba) */}
                  
                  <div className="recibo-encabezado">
                    <div className="recibo-empresa">
                      <h1 className="recibo-empresa-nombre">Rolan Tours</h1>
                      <p className="recibo-empresa-info">RFC: OAX123456ABC</p>
                      <p className="recibo-empresa-info">Calle Hidalgo #123, Centro Histórico</p>
                      <p className="recibo-empresa-info">Oaxaca de Juárez, Oaxaca, México</p>
                      <p className="recibo-empresa-info">Tel: (951) 123-4567</p>
                    </div>
                    <div className="recibo-info-documento">
                      <div className="recibo-numero">
                        <span className="recibo-etiqueta">RECIBO No.</span>
                        <span className="recibo-valor-destacado">{numeroRecibo}</span>
                      </div>
                      <div className="recibo-fecha">
                        <Calendar size={16} />
                        <span>{fechaActual}</span>
                      </div>
                    </div>
                  </div>

                  <div className="recibo-divisor"></div>

                  {/* Resto del contenido del recibo igual que antes */}
                  {/* ... */}
                </div>
              )}
            </>
          )}
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="modal-recibo-acciones no-print">
          <button 
            className="modal-recibo-boton modal-recibo-boton-secundario" 
            onClick={onCerrar}
            disabled={imprimiendo}
          >
            <X size={18} />
            Cerrar
          </button>
          <button 
            className="modal-recibo-boton modal-recibo-boton-primario" 
            onClick={manejarDescargar}
            disabled={imprimiendo || !abonoSeleccionado}
          >
            <Download size={18} />
            {imprimiendo ? 'Generando PDF...' : 'Descargar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReciboAbono;