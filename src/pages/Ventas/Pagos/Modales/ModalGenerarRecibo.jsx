import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Receipt, 
  Calendar, 
  User, 
  CreditCard, 
  FileText, 
  CheckCircle,
  DollarSign
} from 'lucide-react';
import './ModalGenerarRecibo.css';
import { generarPDFRecibo } from '../ModalesRecibos/generarPDFRecibo';

// ============================================
// UTILIDADES
// ============================================

const formatearFecha = (fechaString) => {
  // Si viene en formato DD/MM/YYYY
  if (fechaString && fechaString.includes('/')) {
    const [dia, mes, anio] = fechaString.split('/');
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return fechaString;
};

const convertirFechaAISO = (fechaString) => {
  // Convierte DD/MM/YYYY a formato ISO (YYYY-MM-DD)
  if (fechaString && fechaString.includes('/')) {
    const [dia, mes, anio] = fechaString.split('/');
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }
  return fechaString;
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ModalGenerarRecibo = ({ estaAbierto, alCerrar, pago }) => {
  const [imprimiendo, setImprimiendo] = useState(false);
  const reciboRef = useRef(null);

  if (!estaAbierto || !pago) return null;

  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const numeroRecibo = `REC-${pago.id.toString().padStart(4, '0')}`;

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

      // Mapear los datos del pago al formato que espera generarPDFRecibo
      const datosRecibo = {
        numeroRecibo: numeroRecibo,
        cliente: pago.cliente,
        fechaEmision: convertirFechaAISO(pago.fechaPago),
        concepto: pago.concepto,
        monto: parseFloat(pago.monto.replace(/[$,]/g, '')), // Convertir "$15,000.00" a 15000
        metodoPago: pago.metodoPago || 'No especificado',
        estado: pago.estado === 'Pagado' ? 'Emitido' : 'Pendiente',
        numeroFactura: pago.numeroFactura
      };

      await generarPDFRecibo(datosRecibo);
      
      console.log('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    } finally {
      setImprimiendo(false);
    }
  };

  const manejarClickOverlay = (e) => {
    if (e.target === e.currentTarget) {
      alCerrar();
    }
  };

  return (
    <div className="modal-recibo-superposicion" onClick={manejarClickOverlay}>
      <div className="modal-recibo-contenedor" onClick={(e) => e.stopPropagation()}>
        
        {/* ===== HEADER ===== */}
        <div className="modal-recibo-encabezado no-print">
          <div className="modal-recibo-encabezado-contenido">
            <Receipt size={28} className="modal-recibo-envoltorio-icono" />
            <div>
              <h2 className="modal-recibo-titulo">Recibo de Pago</h2>
              <p className="modal-recibo-subtitulo">Comprobante de transacción completada</p>
            </div>
          </div>
          <button 
            className="modal-recibo-boton-cerrar" 
            onClick={alCerrar}
            title="Cerrar (Esc)"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===== CONTENIDO DEL RECIBO ===== */}
        <div className="modal-recibo-cuerpo" ref={reciboRef}>
          <div className="modal-recibo-documento">
            
            {/* Encabezado del Recibo */}
            <div className="modal-recibo-doc-encabezado">
              <div className="modal-recibo-logo">
                <h1 className="modal-recibo-empresa-nombre">Tu Empresa S.A. de C.V.</h1>
                <p className="modal-recibo-empresa-datos">RFC: EMP123456ABC</p>
                <p className="modal-recibo-empresa-datos">Av. Principal #123</p>
                <p className="modal-recibo-empresa-datos">Ciudad de México, CDMX</p>
                <p className="modal-recibo-empresa-datos">Tel: (55) 1234-5678</p>
                <p className="modal-recibo-empresa-datos">contacto@tuempresa.com</p>
              </div>
              <div className="modal-recibo-doc-info">
                <div className="modal-recibo-doc-titulo">
                  <span className="modal-recibo-etiqueta">RECIBO No.</span>
                  <span className="modal-recibo-doc-numero">{numeroRecibo}</span>
                </div>
                <div className="modal-recibo-doc-fecha">
                  <Calendar size={16} />
                  <span>{fechaActual}</span>
                </div>
              </div>
            </div>

            <div className="modal-recibo-separador"></div>

            {/* Información del Cliente */}
            <div className="modal-recibo-seccion">
              <h3 className="modal-recibo-seccion-titulo">
                <User size={18} />
                Datos del Cliente
              </h3>
              <div className="modal-recibo-seccion-contenido">
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">Nombre:</span>
                  <span className="modal-recibo-dato-valor">{pago.cliente}</span>
                </div>
              </div>
            </div>

            {/* Detalle del Pago */}
            <div className="modal-recibo-seccion">
              <h3 className="modal-recibo-seccion-titulo">
                <FileText size={18} />
                Detalle del Servicio
              </h3>
              <div className="modal-recibo-seccion-contenido">
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">Concepto:</span>
                  <span className="modal-recibo-dato-valor">{pago.concepto}</span>
                </div>
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">No. Factura:</span>
                  <span className="modal-recibo-dato-valor modal-recibo-codigo">
                    {pago.numeroFactura}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del Pago */}
            <div className="modal-recibo-seccion">
              <h3 className="modal-recibo-seccion-titulo">
                <CreditCard size={18} />
                Información del Pago
              </h3>
              <div className="modal-recibo-seccion-contenido">
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">Método de Pago:</span>
                  <span className="modal-recibo-dato-valor">
                    {pago.metodoPago || 'No especificado'}
                  </span>
                </div>
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">Fecha de Pago:</span>
                  <span className="modal-recibo-dato-valor">
                    {formatearFecha(pago.fechaPago)}
                  </span>
                </div>
                {pago.fechaVencimiento && (
                  <div className="modal-recibo-dato">
                    <span className="modal-recibo-dato-label">Fecha de Vencimiento:</span>
                    <span className="modal-recibo-dato-valor">
                      {formatearFecha(pago.fechaVencimiento)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Pagado */}
            <div className="modal-recibo-total-contenedor">
              <div className="modal-recibo-total">
                <span className="modal-recibo-total-label">
                  <DollarSign size={20} />
                  Total Pagado:
                </span>
                <span className="modal-recibo-total-monto">{pago.monto}</span>
              </div>
            </div>

            {/* Estado del Pago - PAGADO COMPLETO */}
            {pago.estado === 'Pagado' && (
              <div className="modal-recibo-estado-finalizado">
                <CheckCircle size={24} />
                <span>¡Pago Completado Exitosamente!</span>
              </div>
            )}

            {/* Footer del Documento */}
            <div className="modal-recibo-doc-pie">
              <div className="modal-recibo-firma">
                <div className="modal-recibo-linea-firma"></div>
                <p className="modal-recibo-firma-texto">Firma y Sello Autorizado</p>
              </div>
              <div className="modal-recibo-nota">
                <p>Este documento es un comprobante de pago válido.</p>
                <p>Documento generado electrónicamente</p>
                <p>Fecha de emisión: {fechaActual}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BOTONES DE ACCIÓN ===== */}
        <div className="modal-recibo-pie no-print">
          <button 
            className="modal-recibo-boton-secundario" 
            onClick={alCerrar}
            disabled={imprimiendo}
          >
            <X size={18} />
            Cerrar
          </button>
          <button 
            className="modal-recibo-boton-primario"
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

export default ModalGenerarRecibo;