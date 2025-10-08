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
  const reciboRef = useRef(null);

  if (!abierto || !pagoSeleccionado) return null;

  // Calcular datos del recibo
  const ultimoAbono = pagoSeleccionado.historialAbonos?.[pagoSeleccionado.historialAbonos.length - 1];
  const fechaActual = new Date().toLocaleDateString('es-MX');
  const numeroRecibo = `REC-${pagoSeleccionado.id.toString().padStart(4, '0')}-${pagoSeleccionado.planPago.abonosRealizados}`;

  // Handlers
  const manejarImprimir = () => {
    setImprimiendo(true);
    setTimeout(() => {
      window.print();
      setImprimiendo(false);
    }, 100);
  };

  const manejarDescargar = async () => {
    try {
      setImprimiendo(true);

      // Mapear los datos del pago al formato que espera generarPDFReciboAbono
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
        numeroAbono: ultimoAbono ? ultimoAbono.numeroAbono : 1,
        montoAbono: ultimoAbono ? ultimoAbono.monto : 0,
        fechaAbono: ultimoAbono ? ultimoAbono.fecha : new Date().toISOString(),
        metodoPago: ultimoAbono ? ultimoAbono.metodoPago : 'No especificado',
        referencia: ultimoAbono ? ultimoAbono.referencia : '',
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
        
        {/* ===== HEADER ===== */}
        <div className="modal-recibo-header no-print">
          <div className="modal-recibo-titulo-seccion">
            <Receipt size={28} className="modal-recibo-icono-titulo" />
            <div>
              <h2 className="modal-recibo-titulo">Recibo de Pago</h2>
              <p className="modal-recibo-subtitulo">Comprobante de abono realizado</p>
            </div>
          </div>
          <button 
            className="modal-recibo-boton-cerrar" 
            onClick={onCerrar} 
            title="Cerrar (Esc)"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===== CONTENIDO DEL RECIBO ===== */}
        <div className="modal-recibo-contenido" ref={reciboRef}>
          <div className="recibo-documento">
            
            {/* Encabezado del Recibo */}
            <div className="recibo-encabezado">
              <div className="recibo-empresa">
                <h1 className="recibo-empresa-nombre">Rolan Tours</h1>
                <p className="recibo-empresa-info">RFC: OAX123456ABC</p>
                <p className="recibo-empresa-info">Calle Hidalgo #123, Centro Histórico</p>
                <p className="recibo-empresa-info">Oaxaca de Juárez, Oaxaca, México</p>
                <p className="recibo-empresa-info">Tel: (951) 123-4567</p>
                <p className="recibo-empresa-info">info@oaxacatours.com</p>
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

            {/* Información del Cliente */}
            <div className="recibo-seccion">
              <h3 className="recibo-seccion-titulo">
                <User size={18} />
                Datos del Cliente
              </h3>
              <div className="recibo-grid">
                <div className="recibo-campo">
                  <span className="recibo-campo-etiqueta">Nombre:</span>
                  <span className="recibo-campo-valor">{pagoSeleccionado.cliente.nombre}</span>
                </div>
                <div className="recibo-campo">
                  <span className="recibo-campo-etiqueta">Email:</span>
                  <span className="recibo-campo-valor">{pagoSeleccionado.cliente.email}</span>
                </div>
                {pagoSeleccionado.cliente.telefono && (
                  <div className="recibo-campo">
                    <span className="recibo-campo-etiqueta">Teléfono:</span>
                    <span className="recibo-campo-valor">{pagoSeleccionado.cliente.telefono}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Información del Servicio */}
            <div className="recibo-seccion">
              <h3 className="recibo-seccion-titulo">
                <FileText size={18} />
                Detalles del Servicio
              </h3>
              <div className="recibo-grid">
                <div className="recibo-campo">
                  <span className="recibo-campo-etiqueta">Tipo de Tour:</span>
                  <span className="recibo-campo-valor">{pagoSeleccionado.servicio.tipo}</span>
                </div>
                <div className="recibo-campo">
                  <span className="recibo-campo-etiqueta">Descripción:</span>
                  <span className="recibo-campo-valor">{pagoSeleccionado.servicio.descripcion}</span>
                </div>
                <div className="recibo-campo">
                  <span className="recibo-campo-etiqueta">Fecha del Tour:</span>
                  <span className="recibo-campo-valor">{formatearFecha(pagoSeleccionado.servicio.fechaTour)}</span>
                </div>
                <div className="recibo-campo">
                  <span className="recibo-campo-etiqueta">Contrato:</span>
                  <span className="recibo-campo-valor">{pagoSeleccionado.numeroContrato}</span>
                </div>
              </div>
            </div>

            {/* Detalle del Pago */}
            <div className="recibo-seccion">
              <h3 className="recibo-seccion-titulo">
                <CreditCard size={18} />
                Detalle del Pago
              </h3>
              
              {ultimoAbono && (
                <div className="recibo-pago-destacado">
                  <div className="recibo-pago-info">
                    <span className="recibo-pago-etiqueta">Abono No. {ultimoAbono.numeroAbono}</span>
                    <span className="recibo-pago-monto">{formatearMoneda(ultimoAbono.monto)}</span>
                  </div>
                  <div className="recibo-pago-detalles">
                    <div className="recibo-pago-detalle-item">
                      <span>Fecha:</span>
                      <span>{formatearFecha(ultimoAbono.fecha)}</span>
                    </div>
                    <div className="recibo-pago-detalle-item">
                      <span>Método de Pago:</span>
                      <span>{ultimoAbono.metodoPago}</span>
                    </div>
                    {ultimoAbono.referencia && (
                      <div className="recibo-pago-detalle-item">
                        <span>Referencia:</span>
                        <span>{ultimoAbono.referencia}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="recibo-resumen">
                <div className="recibo-resumen-linea">
                  <span>Monto Total del Servicio:</span>
                  <span>{formatearMoneda(pagoSeleccionado.planPago.montoTotal)}</span>
                </div>
                <div className="recibo-resumen-linea">
                  <span>Total Pagado:</span>
                  <span>{formatearMoneda(pagoSeleccionado.planPago.montoPagado)}</span>
                </div>
                <div className="recibo-resumen-linea recibo-resumen-destacado">
                  <span>Saldo Pendiente:</span>
                  <span>{formatearMoneda(pagoSeleccionado.planPago.saldoPendiente)}</span>
                </div>
                <div className="recibo-progreso-info">
                  <span>
                    Abonos Realizados: {pagoSeleccionado.planPago.abonosRealizados} de {pagoSeleccionado.planPago.abonosPlaneados}
                  </span>
                </div>
              </div>
            </div>

            {/* Estado del Pago */}
            {pagoSeleccionado.estado === 'FINALIZADO' && (
              <div className="recibo-estado-finalizado">
                <CheckCircle size={24} />
                <span>¡Pago Completado!</span>
              </div>
            )}

            {/* Notas y Términos */}
            <div className="recibo-notas">
              <p className="recibo-nota-texto">
                <strong>Nota:</strong> Este recibo es un comprobante de pago parcial. 
                La factura fiscal se generará una vez completado el pago total del servicio.
              </p>
              {pagoSeleccionado.observaciones && (
                <p className="recibo-nota-texto">
                  <strong>Observaciones:</strong> {pagoSeleccionado.observaciones}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="recibo-footer">
              <div className="recibo-firma">
                <div className="recibo-linea-firma"></div>
                <p className="recibo-firma-texto">Firma y Sello</p>
              </div>
              <div className="recibo-footer-info">
                <p>Documento generado electrónicamente</p>
                <p>Fecha de emisión: {fechaActual}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BOTONES DE ACCIÓN ===== */}
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
            disabled={imprimiendo}
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