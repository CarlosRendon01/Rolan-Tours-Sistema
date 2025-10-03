import React, { useState, useRef } from 'react';
import { X, Printer, Download, FileText, Calendar, User, Building2, CheckCircle, AlertCircle, Hash, Package } from 'lucide-react';
import './ModalFacturaAbono.css';

const ModalFacturaAbono = ({ abierto, onCerrar, pagoSeleccionado }) => {
  const [imprimiendo, setImprimiendo] = useState(false);
  const [generandoFactura, setGenerandoFactura] = useState(false);
  const facturaRef = useRef(null);

  if (!abierto || !pagoSeleccionado) return null;

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

  const manejarImprimir = () => {
    setImprimiendo(true);
    setTimeout(() => {
      window.print();
      setImprimiendo(false);
    }, 100);
  };

  const manejarDescargar = () => {
    alert('Función de descarga de PDF en desarrollo. Se integrará con biblioteca de generación de PDFs.');
  };

  const manejarGenerarFactura = () => {
    setGenerandoFactura(true);
    setTimeout(() => {
      alert('Factura generada exitosamente. En producción, esto se integrará con el sistema del SAT.');
      setGenerandoFactura(false);
    }, 2000);
  };

  const fechaActual = new Date().toLocaleDateString('es-MX');
  const numeroFactura = `FAC-${pagoSeleccionado.id.toString().padStart(4, '0')}`;
  const folioFiscal = `${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  
  // Calcular impuestos (IVA 16%)
  const subtotal = pagoSeleccionado.planPago.montoTotal;
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const puedeGenerarFactura = pagoSeleccionado.estado === 'FINALIZADO' && !pagoSeleccionado.facturaGenerada;

  return (
    <div className="modal-factura-overlay" onClick={onCerrar}>
      <div className="modal-factura-contenedor" onClick={(e) => e.stopPropagation()}>
        {/* Header del Modal */}
        <div className="modal-factura-header no-print">
          <div className="modal-factura-titulo-seccion">
            <FileText size={24} className="modal-factura-icono-titulo" />
            <div>
              <h2 className="modal-factura-titulo">Factura Fiscal</h2>
              <p className="modal-factura-subtitulo">Comprobante Fiscal Digital por Internet (CFDI)</p>
            </div>
          </div>
          <button className="modal-factura-boton-cerrar" onClick={onCerrar} title="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Alerta si no puede generar factura */}
        {!puedeGenerarFactura && (
          <div className="modal-factura-alerta">
            <AlertCircle size={20} />
            <div>
              <p className="modal-factura-alerta-titulo">
                {pagoSeleccionado.facturaGenerada 
                  ? 'Factura ya generada'
                  : 'Pago pendiente de completar'}
              </p>
              <p className="modal-factura-alerta-texto">
                {pagoSeleccionado.facturaGenerada
                  ? 'Esta factura ya fue generada previamente. Puedes descargar o imprimir el documento.'
                  : `Para generar la factura, el pago debe estar completado. Saldo pendiente: ${formatearMoneda(pagoSeleccionado.planPago.saldoPendiente)}`}
              </p>
            </div>
          </div>
        )}

        {/* Contenido de la Factura */}
        <div className="modal-factura-contenido" ref={facturaRef}>
          <div className="factura-documento">
            {/* Encabezado */}
            <div className="factura-encabezado">
              <div className="factura-emisor">
                <h1 className="factura-empresa-nombre">Oaxaca Tours S.A. de C.V.</h1>
                <div className="factura-empresa-detalles">
                  <p><strong>RFC:</strong> OAX123456ABC</p>
                  <p><strong>Régimen Fiscal:</strong> 601 - General de Ley Personas Morales</p>
                  <p>Calle Hidalgo #123, Centro Histórico</p>
                  <p>C.P. 68000, Oaxaca de Juárez, Oaxaca</p>
                  <p>Tel: (951) 123-4567</p>
                </div>
              </div>
              <div className="factura-info-documento">
                <div className="factura-tipo">
                  <span className="factura-tipo-badge">FACTURA</span>
                  <span className="factura-tipo-cfdi">CFDI 4.0</span>
                </div>
                <div className="factura-numero">
                  <span className="factura-etiqueta">FOLIO:</span>
                  <span className="factura-valor-destacado">{numeroFactura}</span>
                </div>
                <div className="factura-fecha-grupo">
                  <div className="factura-fecha-item">
                    <Calendar size={14} />
                    <div>
                      <span className="factura-fecha-label">Fecha Emisión:</span>
                      <span className="factura-fecha-valor">{fechaActual}</span>
                    </div>
                  </div>
                  <div className="factura-fecha-item">
                    <Calendar size={14} />
                    <div>
                      <span className="factura-fecha-label">Fecha Certificación:</span>
                      <span className="factura-fecha-valor">{fechaActual}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="factura-divisor"></div>

            {/* Información Fiscal */}
            <div className="factura-info-fiscal">
              <div className="factura-folio-fiscal">
                <Hash size={16} />
                <div>
                  <span className="factura-folio-label">Folio Fiscal (UUID):</span>
                  <span className="factura-folio-valor">{folioFiscal}</span>
                </div>
              </div>
              <div className="factura-certificados">
                <div className="factura-certificado-item">
                  <span className="factura-cert-label">No. Certificado SAT:</span>
                  <span className="factura-cert-valor">00001000000123456789</span>
                </div>
                <div className="factura-certificado-item">
                  <span className="factura-cert-label">No. Certificado Emisor:</span>
                  <span className="factura-cert-valor">00001000000987654321</span>
                </div>
              </div>
            </div>

            {/* Receptor (Cliente) */}
            <div className="factura-seccion">
              <h3 className="factura-seccion-titulo">
                <User size={18} />
                Receptor
              </h3>
              <div className="factura-grid">
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Nombre / Razón Social:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.cliente.nombre}</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">RFC:</span>
                  <span className="factura-campo-valor">XAXX010101000</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Email:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.cliente.email}</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Uso CFDI:</span>
                  <span className="factura-campo-valor">G03 - Gastos en general</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Régimen Fiscal:</span>
                  <span className="factura-campo-valor">605 - Sueldos y Salarios</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Domicilio Fiscal:</span>
                  <span className="factura-campo-valor">C.P. 68000, Oaxaca</span>
                </div>
              </div>
            </div>

            {/* Conceptos */}
            <div className="factura-seccion">
              <h3 className="factura-seccion-titulo">
                <Package size={18} />
                Conceptos
              </h3>
              <div className="factura-tabla-conceptos">
                <table className="factura-tabla">
                  <thead>
                    <tr>
                      <th>Clave</th>
                      <th>Cantidad</th>
                      <th>Unidad</th>
                      <th>Descripción</th>
                      <th>Precio Unitario</th>
                      <th>Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>90111501</td>
                      <td>1</td>
                      <td>E48 - Servicio</td>
                      <td>
                        <div className="factura-concepto-desc">
                          <strong>{pagoSeleccionado.servicio.tipo}</strong>
                          <span>{pagoSeleccionado.servicio.descripcion}</span>
                          <span className="factura-concepto-extra">Fecha del Tour: {formatearFecha(pagoSeleccionado.servicio.fechaTour)}</span>
                          <span className="factura-concepto-extra">Contrato: {pagoSeleccionado.numeroContrato}</span>
                        </div>
                      </td>
                      <td className="factura-monto">{formatearMoneda(subtotal)}</td>
                      <td className="factura-monto">{formatearMoneda(subtotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totales */}
            <div className="factura-totales-seccion">
              <div className="factura-info-adicional">
                <div className="factura-metodo-pago">
                  <h4>Método de Pago</h4>
                  <p>PPD - Pago en Parcialidades o Diferido</p>
                </div>
                <div className="factura-forma-pago">
                  <h4>Forma de Pago</h4>
                  <p>Mixto (Efectivo, Transferencia, Tarjeta)</p>
                </div>
                <div className="factura-moneda">
                  <h4>Moneda</h4>
                  <p>MXN - Peso Mexicano</p>
                </div>
              </div>

              <div className="factura-totales">
                <div className="factura-total-linea">
                  <span>Subtotal:</span>
                  <span>{formatearMoneda(subtotal)}</span>
                </div>
                <div className="factura-total-linea">
                  <span>IVA (16%):</span>
                  <span>{formatearMoneda(iva)}</span>
                </div>
                <div className="factura-total-linea total">
                  <span>Total:</span>
                  <span>{formatearMoneda(total)}</span>
                </div>
              </div>
            </div>

            {/* Historial de Pagos */}
            <div className="factura-seccion">
              <h3 className="factura-seccion-titulo">
                <Building2 size={18} />
                Historial de Pagos
              </h3>
              <div className="factura-historial">
                {pagoSeleccionado.historialAbonos.map((abono, index) => (
                  <div key={index} className="factura-historial-item">
                    <div className="factura-historial-numero">
                      <CheckCircle size={16} />
                      <span>Abono {abono.numeroAbono}</span>
                    </div>
                    <div className="factura-historial-detalles">
                      <span>{formatearFecha(abono.fecha)}</span>
                      <span>{abono.metodoPago}</span>
                      <span className="factura-historial-monto">{formatearMoneda(abono.monto)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="factura-historial-resumen">
                <span>Total de Abonos Realizados:</span>
                <span className="factura-historial-total">{pagoSeleccionado.planPago.abonosRealizados} abonos</span>
              </div>
            </div>

            {/* Sello Digital */}
            <div className="factura-sello">
              <h4>Sello Digital del CFDI</h4>
              <p className="factura-sello-texto">
                hA3kL9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH==
              </p>
            </div>

            <div className="factura-sello">
              <h4>Sello Digital del SAT</h4>
              <p className="factura-sello-texto">
                xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5==
              </p>
            </div>

            {/* Cadena Original */}
            <div className="factura-cadena">
              <h4>Cadena Original del Complemento de Certificación Digital del SAT</h4>
              <p className="factura-cadena-texto">
                ||1.1|{folioFiscal}|{fechaActual}|OAX123456ABC|{pagoSeleccionado.cliente.nombre}|{total}|00001000000123456789||
              </p>
            </div>

            {/* Código QR Placeholder */}
            <div className="factura-qr">
              <div className="factura-qr-placeholder">
                <FileText size={48} />
                <p>Código QR</p>
                <span>Escanea para verificar</span>
              </div>
              <div className="factura-qr-info">
                <p><strong>Este documento es una representación impresa de un CFDI</strong></p>
                <p>Puede verificar la autenticidad de este documento en:</p>
                <p className="factura-qr-link">https://verificacfdi.facturaelectronica.sat.gob.mx/</p>
              </div>
            </div>

            {/* Footer */}
            <div className="factura-footer">
              <p>Este documento fue generado electrónicamente y es válido sin firma autógrafa</p>
              <p>Fecha y hora de certificación: {new Date().toLocaleString('es-MX')}</p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="modal-factura-acciones no-print">
          <button className="modal-factura-boton secundario" onClick={onCerrar}>
            Cerrar
          </button>
          {puedeGenerarFactura && (
            <button 
              className="modal-factura-boton generar" 
              onClick={manejarGenerarFactura}
              disabled={generandoFactura}
            >
              <CheckCircle size={18} />
              {generandoFactura ? 'Generando...' : 'Generar Factura SAT'}
            </button>
          )}
          
          <button 
            className="modal-factura-boton primario" 
            onClick={manejarDescargar}
            disabled={imprimiendo}
          >
            <Download size={18} />
            Descargar PDF
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ModalFacturaAbono;