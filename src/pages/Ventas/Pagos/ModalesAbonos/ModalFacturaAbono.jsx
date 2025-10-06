import React, { useState, useRef } from 'react';
import { X, Printer, Download, FileText, Calendar, User, Building2, CheckCircle, AlertCircle, Hash, Package, CreditCard } from 'lucide-react';
import './ModalFacturaAbono.css';

const ModalFacturaAbono = ({ abierto, onCerrar, pagoSeleccionado, datosEmpresa = {} }) => {
  const [imprimiendo, setImprimiendo] = useState(false);
  const [generandoFactura, setGenerandoFactura] = useState(false);
  const [error, setError] = useState(null);
  const facturaRef = useRef(null);

  if (!abierto || !pagoSeleccionado) return null;

  // ===============================================
  // UTILIDADES DE FORMATEO
  // ===============================================
  const formatearFecha = (fecha, opciones = {}) => {
    const opcionesDefecto = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-MX', { ...opcionesDefecto, ...opciones });
  };

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad || 0);
  };

  // ===============================================
  // VALIDACIONES
  // ===============================================
  const validarRFC = (rfc) => {
    if (!rfc) return false;
    const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;
    return rfcPattern.test(rfc.toUpperCase().trim());
  };

  const validarEmail = (email) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validarDatosFiscales = () => {
    const errores = [];
    
    if (!pagoSeleccionado.cliente?.email || !validarEmail(pagoSeleccionado.cliente.email)) {
      errores.push('Email del cliente inválido');
    }
    
    if (!pagoSeleccionado.cliente?.rfc || !validarRFC(pagoSeleccionado.cliente.rfc)) {
      errores.push('RFC del cliente inválido o faltante');
    }
    
    if (!pagoSeleccionado.servicio) {
      errores.push('Información del servicio incompleta');
    }
    
    if (!pagoSeleccionado.planPago?.montoTotal || pagoSeleccionado.planPago.montoTotal <= 0) {
      errores.push('Monto total inválido');
    }
    
    return errores;
  };

  const yaEstaFacturado = () => {
    return pagoSeleccionado.facturaGenerada === true || pagoSeleccionado.uuidFactura;
  };

  const puedeGenerarFactura = () => {
    return (
      (pagoSeleccionado.estado === 'FINALIZADO' || 
       pagoSeleccionado.estado === 'COMPLETADO') && 
      !yaEstaFacturado() &&
      (pagoSeleccionado.planPago?.saldoPendiente === 0 || 
       pagoSeleccionado.planPago?.saldoPendiente === null)
    );
  };

  // ===============================================
  // CÁLCULOS FISCALES
  // ===============================================
  const calcularImpuestos = () => {
    const subtotal = pagoSeleccionado.planPago?.montoTotal || 0;
    const tasaIVA = pagoSeleccionado.tasaIVA || 0.16; // 16% por defecto
    const iva = subtotal * tasaIVA;
    const total = subtotal + iva;
    
    return { subtotal, iva, tasaIVA, total };
  };

  const { subtotal, iva, tasaIVA, total } = calcularImpuestos();

  // ===============================================
  // DATOS DE LA FACTURA
  // ===============================================
  const fechaActual = new Date().toLocaleDateString('es-MX');
  const numeroFactura = `FAC-${String(pagoSeleccionado.id || '0000').padStart(4, '0')}`;
  const folioFiscal = pagoSeleccionado.uuidFactura || 
    `${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Datos de empresa (con fallbacks)
  const empresa = {
    nombre: datosEmpresa.nombre || 'Oaxaca Tours S.A. de C.V.',
    rfc: datosEmpresa.rfc || 'OAX123456ABC',
    regimen: datosEmpresa.regimen || '601 - General de Ley Personas Morales',
    direccion: datosEmpresa.direccion || 'Calle Hidalgo #123, Centro Histórico',
    codigoPostal: datosEmpresa.codigoPostal || '68000',
    ciudad: datosEmpresa.ciudad || 'Oaxaca de Juárez, Oaxaca',
    telefono: datosEmpresa.telefono || '(951) 123-4567',
    certificadoSAT: datosEmpresa.certificadoSAT || '00001000000123456789',
    certificadoEmisor: datosEmpresa.certificadoEmisor || '00001000000987654321'
  };

  // ===============================================
  // MANEJADORES DE EVENTOS
  // ===============================================
  const manejarImprimir = () => {
    if (!yaEstaFacturado()) {
      setError('Debe generar la factura antes de imprimirla.');
      return;
    }

    setImprimiendo(true);
    setTimeout(() => {
      window.print();
      setImprimiendo(false);
    }, 100);
  };

  const manejarDescargar = async () => {
    if (!yaEstaFacturado()) {
      setError('Debe generar la factura antes de descargarla.');
      return;
    }

    setError(null);
    setImprimiendo(true);

    try {
      const response = await fetch(`/api/facturacion/descargar/${pagoSeleccionado.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/pdf' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al descargar la factura');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Factura-${numeroFactura}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al descargar:', error);
      setError(error.message || 'Error al descargar la factura. Intente nuevamente.');
    } finally {
      setImprimiendo(false);
    }
  };

  const manejarGenerarFactura = async () => {
    setError(null);

    // Validación 1: Ya facturado
    if (yaEstaFacturado()) {
      setError('Este pago ya tiene una factura generada. No se pueden generar facturas duplicadas.');
      return;
    }

    // Validación 2: Datos fiscales
    const erroresValidacion = validarDatosFiscales();
    if (erroresValidacion.length > 0) {
      setError(`Datos incompletos o inválidos:\n• ${erroresValidacion.join('\n• ')}`);
      return;
    }

    // Validación 3: Estado del pago
    if (!puedeGenerarFactura()) {
      setError(`Solo se pueden facturar pagos completados. Saldo pendiente: ${formatearMoneda(pagoSeleccionado.planPago?.saldoPendiente || 0)}`);
      return;
    }

    setGenerandoFactura(true);
    
    try {
      const response = await fetch('/api/facturacion/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pagoId: pagoSeleccionado.id,
          numeroFactura,
          tipo: 'ABONO',
          datosFacturacion: {
            cliente: pagoSeleccionado.cliente.nombre,
            rfcCliente: pagoSeleccionado.cliente.rfc,
            email: pagoSeleccionado.cliente.email,
            usoCFDI: pagoSeleccionado.usoCFDI || 'G03',
            formaPago: pagoSeleccionado.formaPago || 'PPD',
            metodoPago: pagoSeleccionado.metodoPago || 'Mixto',
            moneda: 'MXN',
            subtotal,
            iva,
            tasaIVA,
            total,
            concepto: pagoSeleccionado.servicio.tipo,
            descripcion: pagoSeleccionado.servicio.descripcion,
            numeroContrato: pagoSeleccionado.numeroContrato,
            historialAbonos: pagoSeleccionado.historialAbonos
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Manejo específico de errores
        if (response.status === 422) {
          throw new Error('Datos fiscales inválidos. Verifica RFC y Régimen Fiscal.');
        } else if (response.status === 503) {
          throw new Error('Servicio del SAT no disponible. Intenta más tarde.');
        } else if (response.status === 409) {
          throw new Error('Ya existe una factura para este pago.');
        } else {
          throw new Error(errorData.mensaje || 'Error al generar la factura');
        }
      }

      const result = await response.json();

      // Actualizar estado del pago
      if (pagoSeleccionado.facturaGenerada !== undefined) {
        pagoSeleccionado.facturaGenerada = true;
      }
      if (result.uuid) {
        pagoSeleccionado.uuidFactura = result.uuid;
      }
      
      alert(`✅ Factura generada y timbrada exitosamente ante el SAT\n\nFolio Fiscal (UUID): ${result.uuid || folioFiscal}\nFactura: ${numeroFactura}`);
      
      setTimeout(() => onCerrar(), 1500);
      
    } catch (error) {
      console.error('Error al generar factura:', error);
      setError(error.message || 'Error al generar la factura. Intente nuevamente.');
    } finally {
      setGenerandoFactura(false);
    }
  };

  const manejarCerrar = () => {
    if (!generandoFactura) {
      setError(null);
      onCerrar();
    }
  };

  // ===============================================
  // RENDER
  // ===============================================
  return (
    <div className="modal-factura-overlay" onClick={manejarCerrar}>
      <div className="modal-factura-contenedor" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="modal-factura-header no-print">
          <div className="modal-factura-header-contenido">
            <div className="modal-factura-icono-principal">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 className="modal-factura-titulo">
                Factura Fiscal
                {yaEstaFacturado() && <span className="modal-factura-badge-facturado">• Ya facturado</span>}
              </h2>
              <p className="modal-factura-subtitulo">
                Comprobante Fiscal Digital por Internet (CFDI) - {numeroFactura}
              </p>
            </div>
          </div>
          <button 
            className="modal-factura-boton-cerrar" 
            onClick={manejarCerrar}
            title="Cerrar"
            disabled={generandoFactura}
          >
            <X size={20} />
          </button>
        </div>

        {/* ALERTAS */}
        {error && (
          <div className="modal-factura-alerta-error no-print">
            <AlertCircle size={20} />
            <p className="modal-factura-alerta-texto">{error}</p>
          </div>
        )}

        {yaEstaFacturado() && (
          <div className="modal-factura-alerta-success no-print">
            <CheckCircle size={20} />
            <div>
              <p className="modal-factura-alerta-titulo">Factura generada exitosamente</p>
              {pagoSeleccionado.uuidFactura && (
                <p className="modal-factura-alerta-texto-small">
                  UUID: {pagoSeleccionado.uuidFactura}
                </p>
              )}
              <p className="modal-factura-alerta-texto-small">
                Esta factura fue timbrada ante el SAT. Puede descargarla o imprimirla.
              </p>
            </div>
          </div>
        )}

        {!puedeGenerarFactura() && !yaEstaFacturado() && (
          <div className="modal-factura-alerta-warning no-print">
            <AlertCircle size={20} />
            <div>
              <p className="modal-factura-alerta-titulo">Pago pendiente de completar</p>
              <p className="modal-factura-alerta-texto-small">
                Para generar la factura, el pago debe estar completado. 
                Saldo pendiente: {formatearMoneda(pagoSeleccionado.planPago?.saldoPendiente || 0)}
              </p>
            </div>
          </div>
        )}

        {/* CONTENIDO */}
        <div className="modal-factura-contenido" ref={facturaRef}>
          <div className="factura-documento">
            
            {/* Encabezado */}
            <div className="factura-encabezado">
              <div className="factura-emisor">
                <h1 className="factura-empresa-nombre">{empresa.nombre}</h1>
                <div className="factura-empresa-detalles">
                  <p><strong>RFC:</strong> {empresa.rfc}</p>
                  <p><strong>Régimen Fiscal:</strong> {empresa.regimen}</p>
                  <p>{empresa.direccion}</p>
                  <p>C.P. {empresa.codigoPostal}, {empresa.ciudad}</p>
                  <p>Tel: {empresa.telefono}</p>
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
                  <span className="factura-cert-valor">{empresa.certificadoSAT}</span>
                </div>
                <div className="factura-certificado-item">
                  <span className="factura-cert-label">No. Certificado Emisor:</span>
                  <span className="factura-cert-valor">{empresa.certificadoEmisor}</span>
                </div>
              </div>
            </div>

            {/* Receptor */}
            <div className="factura-seccion">
              <h3 className="factura-seccion-titulo">
                <User size={18} />
                Receptor
              </h3>
              <div className="factura-grid">
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Nombre / Razón Social:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.cliente?.nombre || 'N/A'}</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">RFC:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.cliente?.rfc || 'XAXX010101000'}</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Email:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.cliente?.email || 'N/A'}</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Uso CFDI:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.usoCFDI || 'G03'} - Gastos en general</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Régimen Fiscal:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.cliente?.regimen || '605 - Sueldos y Salarios'}</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Domicilio Fiscal:</span>
                  <span className="factura-campo-valor">C.P. {pagoSeleccionado.cliente?.codigoPostal || '68000'}</span>
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
                          <strong>{pagoSeleccionado.servicio?.tipo || 'Servicio Turístico'}</strong>
                          <span>{pagoSeleccionado.servicio?.descripcion || 'Servicio de tour'}</span>
                          <span className="factura-concepto-extra">
                            Fecha del Tour: {formatearFecha(pagoSeleccionado.servicio?.fechaTour || new Date())}
                          </span>
                          <span className="factura-concepto-extra">
                            Contrato: {pagoSeleccionado.numeroContrato || 'N/A'}
                          </span>
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
                <div>
                  <h4>Método de Pago</h4>
                  <p>PPD - Pago en Parcialidades o Diferido</p>
                </div>
                <div>
                  <h4>Forma de Pago</h4>
                  <p>{pagoSeleccionado.metodoPago || 'Mixto (Efectivo, Transferencia, Tarjeta)'}</p>
                </div>
                <div>
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
                  <span>IVA ({(tasaIVA * 100).toFixed(0)}%):</span>
                  <span>{formatearMoneda(iva)}</span>
                </div>
                <div className="factura-total-linea total">
                  <span>Total:</span>
                  <span>{formatearMoneda(total)}</span>
                </div>
              </div>
            </div>

            {/* Historial de Pagos */}
            {pagoSeleccionado.historialAbonos?.length > 0 && (
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
                        <span>Abono {abono.numeroAbono || index + 1}</span>
                      </div>
                      <div className="factura-historial-detalles">
                        <span>{formatearFecha(abono.fecha)}</span>
                        <span>{abono.metodoPago || 'Efectivo'}</span>
                        <span className="factura-historial-monto">{formatearMoneda(abono.monto)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="factura-historial-resumen">
                  <span>Total de Abonos Realizados:</span>
                  <span className="factura-historial-total">
                    {pagoSeleccionado.planPago?.abonosRealizados || pagoSeleccionado.historialAbonos.length} abonos
                  </span>
                </div>
              </div>
            )}

            {/* Sellos Digitales */}
            <div className="factura-sello">
              <h4>Sello Digital del CFDI</h4>
              <p className="factura-sello-texto">
                {pagoSeleccionado.selloCFDI || 'hA3kL9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH=='}
              </p>
            </div>

            <div className="factura-sello">
              <h4>Sello Digital del SAT</h4>
              <p className="factura-sello-texto">
                {pagoSeleccionado.selloSAT || 'xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5=='}
              </p>
            </div>

            {/* Cadena Original */}
            <div className="factura-cadena">
              <h4>Cadena Original del Complemento de Certificación Digital del SAT</h4>
              <p className="factura-cadena-texto">
                {pagoSeleccionado.cadenaOriginal || `||1.1|${folioFiscal}|${fechaActual}|${empresa.rfc}|${pagoSeleccionado.cliente?.nombre || 'N/A'}|${total}|${empresa.certificadoSAT}||`}
              </p>
            </div>

            {/* Código QR */}
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

        {/* BOTONES DE ACCIÓN */}
        <div className="modal-factura-acciones no-print">
          <button 
            className="modal-factura-boton modal-factura-boton-cancelar" 
            onClick={manejarCerrar}
            disabled={generandoFactura}
          >
            Cerrar
          </button>
          
          {puedeGenerarFactura() && (
            <button 
              className="modal-factura-boton modal-factura-boton-generar" 
              onClick={manejarGenerarFactura}
              disabled={generandoFactura}
            >
              <CheckCircle size={18} />
              {generandoFactura ? 'Generando...' : 'Generar y Timbrar'}
            </button>
          )}

          {yaEstaFacturado() && (
            <>
              <button 
                className="modal-factura-boton modal-factura-boton-secundario" 
                onClick={manejarImprimir}
                disabled={imprimiendo}
              >
                <Printer size={18} />
                Imprimir
              </button>

              <button 
                className="modal-factura-boton modal-factura-boton-primario" 
                onClick={manejarDescargar}
                disabled={imprimiendo}
              >
                <Download size={18} />
                Descargar PDF
              </button>
            </>
          )}
        </div>

        {/* LOADING OVERLAY */}
        {(generandoFactura || imprimiendo) && (
          <div className="modal-factura-loading">
            <div className="modal-factura-spinner"></div>
            <p className="modal-factura-loading-texto">
              {generandoFactura ? 'Generando y timbrando factura ante el SAT...' : 'Procesando...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalFacturaAbono;