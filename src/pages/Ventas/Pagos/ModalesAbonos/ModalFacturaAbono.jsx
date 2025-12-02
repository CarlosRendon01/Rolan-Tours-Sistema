import React, { useState, useRef } from 'react';
import axios from 'axios';
import { X, Printer, Download, FileText, Calendar, User, Building2, CheckCircle, AlertCircle, Hash, Package, CreditCard, Coins } from 'lucide-react';
import './ModalFacturaAbono.css';
import { generarPDFFactura, imprimirFactura } from '../ModalesFactura/generarPDFFactura';

const ModalFacturaAbono = ({ abierto, onCerrar, pagoSeleccionado, datosEmpresa = {}, onFacturar }) => {
  const [abonoSeleccionado, setAbonoSeleccionado] = useState(null);
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
  // SEPARAR ABONOS FACTURADOS Y SIN FACTURAR
  // ===============================================
  const abonosSinFacturar = pagoSeleccionado.historialAbonos?.filter(
    abono => !abono.facturaGenerada
  ) || [];

  const abonosFacturados = pagoSeleccionado.historialAbonos?.filter(
    abono => abono.facturaGenerada
  ) || [];

  // ===============================================
  // CÁLCULOS FISCALES PARA EL ABONO SELECCIONADO
  // ===============================================
  const calcularImpuestos = (monto) => {
    const subtotal = monto;
    const tasaIVA = 0.16;
    const iva = subtotal * tasaIVA;
    const total = subtotal + iva;

    return { subtotal, iva, tasaIVA, total };
  };

  const impuestosAbono = abonoSeleccionado ? calcularImpuestos(abonoSeleccionado.monto) : null;

  // ===============================================
  // DATOS DE LA EMPRESA
  // ===============================================
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

  const manejarGenerarFactura = async () => {
    if (!abonoSeleccionado) {
      setError('Por favor selecciona un abono para facturar');
      return;
    }

    setError(null);
    setGenerandoFactura(true);

    try {
      const token = localStorage.getItem("token");
      const impuestosTemp = calcularImpuestos(abonoSeleccionado.monto);

      // ✅ Enviar al backend
      const response = await axios.post(
        'http://127.0.0.1:8000/api/facturas',
        {
          abono_id: abonoSeleccionado.id,
          numero_factura: `FAC-${String(pagoSeleccionado.id).padStart(4, '0')}-${abonoSeleccionado.numeroAbono}`,
          monto: impuestosTemp.total,
          fecha_emision: new Date().toISOString().split('T')[0],
          fecha_timbrado: new Date().toISOString().split('T')[0],
          uso_cfdi: pagoSeleccionado.usoCFDI || 'G03',
          metodo_pago: abonoSeleccionado.metodoPago,
          forma_pago: 'PPD',
          email_envio: pagoSeleccionado.cliente.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      console.log('✅ Factura generada:', response.data);

      alert(`✅ Factura generada y timbrada exitosamente ante el SAT\n\nFolio: ${response.data.data.numero_factura}\nUUID: ${response.data.data.uuid}\nAbono: #${abonoSeleccionado.numeroAbono}`);

      // ✅ Recargar datos
      if (onFacturar) {
        await onFacturar();
      }

      setAbonoSeleccionado(null);
      setTimeout(() => onCerrar(), 1500);;

    } catch (error) {
      console.error('Error al generar factura:', error);
      const mensajeError = error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al generar la factura. Intente nuevamente.';
      setError(mensajeError);
    } finally {
      setGenerandoFactura(false);
    }
  };

  const manejarDescargarFactura = async (abono) => {
    setError(null);
    setImprimiendo(true);

    try {
      const impuestosDescarga = calcularImpuestos(abono.monto);

      // Preparar datos de la factura para el PDF
      const datosFactura = {
        id: pagoSeleccionado.id,
        numeroFactura: abono.numeroFactura,
        uuidFactura: abono.uuid,
        uuid: abono.uuid,
        cliente: pagoSeleccionado.cliente,
        servicio: {
          ...pagoSeleccionado.servicio,
          tipo: `Abono #${abono.numeroAbono} - ${pagoSeleccionado.servicio.tipo}`,
          descripcion: `${pagoSeleccionado.servicio.descripcion} | Fecha de abono: ${formatearFecha(abono.fecha)}`
        },
        usoCFDI: pagoSeleccionado.usoCFDI,
        metodoPago: abono.metodoPago,
        numeroContrato: pagoSeleccionado.numeroContrato,
        historialAbonos: [abono], // Solo el abono específico
        subtotal: impuestosDescarga.subtotal,
        tasaIVA: impuestosDescarga.tasaIVA,
        planPago: {
          montoTotal: impuestosDescarga.subtotal
        },
        selloCFDI: pagoSeleccionado.selloCFDI,
        selloSAT: pagoSeleccionado.selloSAT,
        cadenaOriginal: pagoSeleccionado.cadenaOriginal
      };

      // Generar el PDF usando la función importada
      await generarPDFFactura(datosFactura, empresa);

      console.log('PDF generado exitosamente para factura:', abono.numeroFactura);

    } catch (error) {
      console.error('Error al descargar:', error);
      setError(error.message || 'Error al descargar la factura. Intente nuevamente.');
    } finally {
      setImprimiendo(false);
    }
  };

  const manejarImprimirFactura = (abono) => {
    setImprimiendo(true);
    setError(null);

    try {
      const impuestosImpresion = calcularImpuestos(abono.monto);

      const datosFactura = {
        id: pagoSeleccionado.id,
        numeroFactura: abono.numeroFactura,
        uuidFactura: abono.uuid,
        uuid: abono.uuid,
        cliente: pagoSeleccionado.cliente,
        servicio: {
          ...pagoSeleccionado.servicio,
          tipo: `Abono #${abono.numeroAbono} - ${pagoSeleccionado.servicio.tipo}`
        },
        usoCFDI: pagoSeleccionado.usoCFDI,
        metodoPago: abono.metodoPago,
        numeroContrato: pagoSeleccionado.numeroContrato,
        historialAbonos: [abono],
        subtotal: impuestosImpresion.subtotal,
        tasaIVA: impuestosImpresion.tasaIVA,
        planPago: {
          montoTotal: impuestosImpresion.subtotal
        }
      };

      imprimirFactura(datosFactura, empresa);

    } catch (error) {
      console.error('Error al imprimir:', error);
      setError(error.message || 'Error al imprimir la factura. Intente nuevamente.');
    } finally {
      setTimeout(() => {
        setImprimiendo(false);
      }, 500);
    }
  };

  const manejarCerrar = () => {
    if (!generandoFactura) {
      setError(null);
      setAbonoSeleccionado(null);
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
          <div className="modal-factura-titulo-seccion">
            <div className="modal-factura-icono-titulo">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="modal-factura-titulo">
                Facturación por Abono Individual
              </h2>
              <p className="modal-factura-subtitulo">
                Generar factura CFDI para cada abono realizado
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
          <div className="modal-factura-alerta" style={{ background: '#fee2e2', borderBottom: '1px solid #fecaca', color: '#991b1b' }}>
            <AlertCircle size={20} />
            <div>
              <p className="modal-factura-alerta-titulo">Error</p>
              <p className="modal-factura-alerta-texto" style={{ whiteSpace: 'pre-line' }}>{error}</p>
            </div>
          </div>
        )}

        {/* CONTENIDO */}
        <div className="modal-factura-contenido" ref={facturaRef}>

          {/* Información del Cliente y Servicio */}
          <div className="factura-documento" style={{ marginBottom: '1.5rem' }}>
            <div className="factura-seccion">
              <h3 className="factura-seccion-titulo">
                <User size={18} />
                Información del Cliente
              </h3>
              <div className="factura-grid">
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Cliente:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.cliente?.nombre || 'N/A'}</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">RFC:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.cliente?.rfc || 'XAXX010101000'}</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Servicio:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.servicio?.tipo || 'N/A'}</span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Contrato:</span>
                  <span className="factura-campo-valor">{pagoSeleccionado.numeroContrato}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Abonos Disponibles para Facturar */}
          <div className="factura-documento" style={{ marginBottom: '1.5rem' }}>
            <div className="factura-seccion">
              <h3 className="factura-seccion-titulo">
                <Coins size={18} />
                Abonos Disponibles para Facturar ({abonosSinFacturar.length})
              </h3>

              {abonosSinFacturar.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                  <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>No hay abonos pendientes de facturar</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                    Todos los abonos ya tienen factura generada
                  </p>
                </div>
              ) : (
                <div className="factura-historial">
                  {abonosSinFacturar.map((abono) => {
                    const esSeleccionado = abonoSeleccionado?.numeroAbono === abono.numeroAbono;
                    const impuestosTemp = calcularImpuestos(abono.monto);

                    return (
                      <div
                        key={abono.numeroAbono}
                        onClick={() => setAbonoSeleccionado(abono)}
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        className="factura-historial-item"
                      >
                        {esSeleccionado && (
                          <div style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            background: '#4338ca',
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
                          border: esSeleccionado ? '2px solid #4338ca' : '1px solid #e5e7eb',
                          background: esSeleccionado ? '#f0f4ff' : '#f9fafb',
                          borderRadius: '8px',
                          padding: '1rem'
                        }}>
                          <div className="factura-historial-numero" style={{
                            color: esSeleccionado ? '#4338ca' : '#10b981'
                          }}>
                            <Coins size={16} />
                            <span>Abono #{abono.numeroAbono}</span>
                          </div>
                          <div className="factura-historial-detalles">
                            <span>{formatearFecha(abono.fecha)}</span>
                            <span>{abono.metodoPago || 'Efectivo'}</span>
                            <span className="factura-historial-monto">{formatearMoneda(abono.monto)}</span>
                          </div>
                          <div style={{
                            marginTop: '0.5rem',
                            paddingTop: '0.5rem',
                            borderTop: '1px solid #e5e7eb',
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            <strong style={{ color: '#374151' }}>Total con IVA:</strong> {formatearMoneda(impuestosTemp.total)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Preview de Factura */}
          {abonoSeleccionado && impuestosAbono && (
            <div className="factura-documento" style={{
              border: '2px solid #4338ca',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)'
            }}>
              <div className="factura-seccion">
                <h3 className="factura-seccion-titulo" style={{ color: '#4338ca' }}>
                  <FileText size={18} />
                  Preview de Factura - Abono #{abonoSeleccionado.numeroAbono}
                </h3>

                <div className="factura-info-fiscal">
                  <div className="factura-campo">
                    <span className="factura-campo-etiqueta">Número de Factura:</span>
                    <span className="factura-campo-valor" style={{ color: '#4338ca', fontWeight: '700' }}>
                      FAC-{String(pagoSeleccionado.id).padStart(4, '0')}-{abonoSeleccionado.numeroAbono}
                    </span>
                  </div>

                  <div className="factura-divisor" style={{ margin: '1rem 0' }}></div>

                  <div className="factura-totales">
                    <div className="factura-total-linea">
                      <span>Subtotal:</span>
                      <span>{formatearMoneda(impuestosAbono.subtotal)}</span>
                    </div>
                    <div className="factura-total-linea">
                      <span>IVA ({(impuestosAbono.tasaIVA * 100).toFixed(0)}%):</span>
                      <span>{formatearMoneda(impuestosAbono.iva)}</span>
                    </div>
                    <div className="factura-total-linea total">
                      <span>Total:</span>
                      <span>{formatearMoneda(impuestosAbono.total)}</span>
                    </div>
                  </div>

                  <div className="factura-cadena" style={{ marginTop: '1rem' }}>
                    <h4>Nota Importante</h4>
                    <p className="factura-cadena-texto" style={{ fontFamily: 'inherit' }}>
                      Esta factura corresponde únicamente al <strong>Abono #{abonoSeleccionado.numeroAbono}</strong> realizado el {formatearFecha(abonoSeleccionado.fecha)} mediante {abonoSeleccionado.metodoPago}.
                      {abonoSeleccionado.referencia && ` Referencia: ${abonoSeleccionado.referencia}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historial de Facturas Generadas */}
          {abonosFacturados.length > 0 && (
            <div className="factura-documento" style={{ marginTop: '1.5rem' }}>
              <div className="factura-seccion">
                <h3 className="factura-seccion-titulo">
                  <CheckCircle size={18} />
                  Facturas Generadas ({abonosFacturados.length})
                </h3>
                <div className="factura-historial">
                  {abonosFacturados.map((abono) => (
                    <div
                      key={abono.numeroAbono}
                      className="factura-historial-item"
                      style={{
                        background: '#d1fae5',
                        border: '1px solid #a7f3d0'
                      }}
                    >
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            fontWeight: '600',
                            color: '#065f46',
                            fontSize: '0.875rem'
                          }}>
                            {abono.numeroFactura}
                          </span>
                          <span style={{
                            background: '#059669',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.625rem',
                            fontWeight: '600'
                          }}>
                            FACTURADO
                          </span>
                        </div>
                        <div className="factura-historial-detalles">
                          <span>Abono #{abono.numeroAbono}</span>
                          <span>{formatearFecha(abono.fechaFacturacion)}</span>
                          <span className="factura-historial-monto">{formatearMoneda(abono.monto)}</span>
                        </div>
                        {abono.uuid && (
                          <div style={{
                            fontSize: '0.6875rem',
                            color: '#047857',
                            fontFamily: 'monospace',
                            marginTop: '0.5rem',
                            wordBreak: 'break-all'
                          }}>
                            UUID: {abono.uuid}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          onClick={() => manejarImprimirFactura(abono)}
                          disabled={imprimiendo}
                          className="modal-factura-boton secundario"
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.8125rem'
                          }}
                        >
                          <Printer size={14} />
                          Imprimir
                        </button>
                        <button
                          onClick={() => manejarDescargarFactura(abono)}
                          disabled={imprimiendo}
                          className="modal-factura-boton primario"
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.8125rem'
                          }}
                        >
                          <Download size={14} />
                          PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="modal-factura-acciones no-print">
          <button
            className="modal-factura-boton secundario"
            onClick={manejarCerrar}
            disabled={generandoFactura}
          >
            Cerrar
          </button>

          {abonoSeleccionado && (
            <button
              className="modal-factura-boton generar"
              onClick={manejarGenerarFactura}
              disabled={generandoFactura}
            >
              <CheckCircle size={18} />
              {generandoFactura ? 'Generando...' : `Generar Factura - Abono #${abonoSeleccionado.numeroAbono}`}
            </button>
          )}
        </div>

        {/* LOADING OVERLAY */}
        {(generandoFactura || imprimiendo) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            zIndex: 9999,
            borderRadius: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{
              color: 'white',
              fontSize: '0.9375rem',
              fontWeight: '600',
              margin: 0
            }}>
              {generandoFactura ? 'Generando y timbrando factura ante el SAT...' : 'Procesando...'}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ModalFacturaAbono;