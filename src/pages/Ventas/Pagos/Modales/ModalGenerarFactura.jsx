import React, { useState } from 'react';
import { X, FileText, Download, Printer, Mail, CreditCard, AlertCircle } from 'lucide-react';
import './ModalGenerarFactura.css';

const ModalGenerarFactura = ({ estaAbierto, alCerrar, pago }) => {
  const [generando, establecerGenerando] = useState(false);
  const [error, establecerError] = useState(null);

  if (!estaAbierto || !pago) return null;

  // ✅ NUEVO: Validación de datos fiscales completos
  const validarDatosFiscales = () => {
    const camposFaltantes = [];
    
    if (!pago.rfcCliente) camposFaltantes.push('RFC del cliente');
    if (!pago.razonSocialCliente) camposFaltantes.push('Razón Social');
    if (!pago.usoCFDI) camposFaltantes.push('Uso de CFDI');
    if (!pago.formaPago) camposFaltantes.push('Forma de Pago');
    
    return camposFaltantes;
  };

  // ✅ NUEVO: Verificar si ya tiene factura generada
  const yaEstaFacturado = () => {
    return pago.facturaGenerada === true || pago.uuidFactura;
  };

  // ✅ MEJORADO: Generación de factura con validaciones
  const manejarGenerarFactura = async (formato) => {
    establecerError(null);

    // Validación 1: Verificar si ya está facturado
    if (yaEstaFacturado()) {
      establecerError('Este pago ya tiene una factura generada. No se pueden generar facturas duplicadas.');
      return;
    }

    // Validación 2: Verificar datos fiscales completos
    const camposFaltantes = validarDatosFiscales();
    if (camposFaltantes.length > 0) {
      establecerError(`Faltan datos fiscales requeridos: ${camposFaltantes.join(', ')}`);
      return;
    }

    // Validación 3: Verificar que el pago esté completado
    if (pago.estatus !== 'completado' && pago.estatus !== 'liquidado') {
      establecerError('Solo se pueden facturar pagos completados o liquidados.');
      return;
    }

    establecerGenerando(true);
    
    try {
      // ✅ NUEVO: Llamada real a API de facturación
      const response = await fetch('/api/facturacion/generar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Agregar token de autenticación si es necesario
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          pagoId: pago.id,
          numeroFactura: pago.numeroFactura,
          formato: formato.toUpperCase(),
          datosFacturacion: {
            cliente: pago.cliente,
            rfcCliente: pago.rfcCliente,
            razonSocialCliente: pago.razonSocialCliente,
            usoCFDI: pago.usoCFDI,
            formaPago: pago.formaPago,
            metodoPago: pago.metodoPago,
            moneda: pago.moneda || 'MXN',
            lugarExpedicion: pago.lugarExpedicion,
            subtotal: pago.subtotal,
            iva: pago.iva,
            total: pago.monto,
            concepto: pago.concepto,
            fechaPago: pago.fechaPago
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al generar la factura');
      }

      // ✅ NUEVO: Descargar el archivo generado
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Factura-${pago.numeroFactura}.${formato.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Mostrar mensaje de éxito
      alert(`✅ Factura generada exitosamente en formato ${formato.toUpperCase()}\n\nFactura: ${pago.numeroFactura}\nCliente: ${pago.cliente}`);
      
      // Cerrar el modal después del éxito
      alCerrar();
      
    } catch (error) {
      console.error('Error al generar factura:', error);
      establecerError(error.message || 'Error al generar la factura. Intente nuevamente.');
    } finally {
      establecerGenerando(false);
    }
  };

  // ✅ MEJORADO: Enviar por email con validaciones
  const manejarEnviarEmail = async () => {
    establecerError(null);

    if (yaEstaFacturado() && !pago.uuidFactura) {
      establecerError('Primero debe generar la factura antes de enviarla por email.');
      return;
    }

    if (!pago.emailCliente) {
      establecerError('No se encontró el email del cliente.');
      return;
    }

    establecerGenerando(true);
    
    try {
      const response = await fetch('/api/facturacion/enviar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pagoId: pago.id,
          numeroFactura: pago.numeroFactura,
          emailDestino: pago.emailCliente,
          nombreCliente: pago.cliente
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar el email');
      }

      alert(`✅ Factura enviada exitosamente por email a:\n${pago.emailCliente}`);
      alCerrar();
      
    } catch (error) {
      console.error('Error al enviar email:', error);
      establecerError('Error al enviar el email. Intente nuevamente.');
    } finally {
      establecerGenerando(false);
    }
  };

  // ✅ MEJORADO: Imprimir con ventana de previsualización
  const manejarImprimir = () => {
    if (!yaEstaFacturado() && !pago.uuidFactura) {
      establecerError('Debe generar la factura antes de imprimirla.');
      return;
    }

    // Abrir ventana de impresión o previsualización
    const ventanaImpresion = window.open(`/factura/preview/${pago.numeroFactura}`, '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.focus();
    } else {
      establecerError('Por favor, permita ventanas emergentes para imprimir.');
    }
  };

  return (
    <div className="modal-factura-overlay" onClick={alCerrar}>
      <div className="modal-factura-contenedor" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-factura-header">
          <div className="modal-factura-header-contenido">
            <div className="modal-factura-icono-principal">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 className="modal-factura-titulo">Generar Factura</h2>
              <p className="modal-factura-subtitulo">
                Factura No. {pago.numeroFactura}
                {yaEstaFacturado() && <span className="modal-factura-badge-facturado"> • Ya facturado</span>}
              </p>
            </div>
          </div>
          <button 
            className="modal-factura-boton-cerrar"
            onClick={alCerrar}
            disabled={generando}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-factura-body">
          {/* ✅ NUEVO: Mensaje de error */}
          {error && (
            <div className="modal-factura-alerta-error">
              <AlertCircle size={20} className="modal-factura-alerta-icono" />
              <p className="modal-factura-alerta-texto">{error}</p>
            </div>
          )}

          {/* ✅ NUEVO: Alerta si ya está facturado */}
          {yaEstaFacturado() && (
            <div className="modal-factura-alerta-warning">
              <AlertCircle size={20} className="modal-factura-alerta-icono" />
              <div>
                <p className="modal-factura-alerta-texto">
                  <strong>Este pago ya tiene una factura generada.</strong>
                </p>
                {pago.uuidFactura && (
                  <p className="modal-factura-alerta-texto-small">
                    UUID: {pago.uuidFactura}
                  </p>
                )}
                <p className="modal-factura-alerta-texto-small">
                  Puede descargar o enviar la factura existente, pero no generar una nueva.
                </p>
              </div>
            </div>
          )}

          {/* Información del pago */}
          <div className="modal-factura-info-pago">
            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Cliente:</span>
              <span className="modal-factura-valor">{pago.cliente}</span>
            </div>
            {pago.rfcCliente && (
              <div className="modal-factura-info-item">
                <span className="modal-factura-label">RFC:</span>
                <span className="modal-factura-valor">{pago.rfcCliente}</span>
              </div>
            )}
            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Monto:</span>
              <span className="modal-factura-valor modal-factura-monto">{pago.monto}</span>
            </div>
            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Fecha de Pago:</span>
              <span className="modal-factura-valor">{pago.fechaPago}</span>
            </div>
            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Método de Pago:</span>
              <span className="modal-factura-valor">{pago.metodoPago}</span>
            </div>
            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Concepto:</span>
              <span className="modal-factura-valor">{pago.concepto}</span>
            </div>
            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Estatus:</span>
              <span className={`modal-factura-badge modal-factura-badge-${pago.estatus}`}>
                {pago.estatus}
              </span>
            </div>
          </div>

          {/* Opciones de generación */}
          <div className="modal-factura-opciones">
            <h3 className="modal-factura-opciones-titulo">
              {yaEstaFacturado() ? 'Opciones de factura existente:' : 'Seleccione una opción:'}
            </h3>
            
            <div className="modal-factura-botones-grid">
              <button
                className="modal-factura-boton-opcion"
                onClick={() => manejarGenerarFactura('pdf')}
                disabled={generando || yaEstaFacturado()}
                title={yaEstaFacturado() ? 'Ya existe una factura para este pago' : 'Generar y descargar PDF'}
              >
                <Download size={20} />
                <span>{yaEstaFacturado() ? 'Descargar PDF' : 'Generar PDF'}</span>
              </button>

              <button
                className="modal-factura-boton-opcion"
                onClick={() => manejarGenerarFactura('xml')}
                disabled={generando || yaEstaFacturado()}
                title={yaEstaFacturado() ? 'Ya existe una factura para este pago' : 'Generar y descargar XML'}
              >
                <FileText size={20} />
                <span>{yaEstaFacturado() ? 'Descargar XML' : 'Generar XML'}</span>
              </button>

              <button
                className="modal-factura-boton-opcion"
                onClick={manejarImprimir}
                disabled={generando}
                title="Imprimir factura"
              >
                <Printer size={20} />
                <span>Imprimir</span>
              </button>

              <button
                className="modal-factura-boton-opcion"
                onClick={manejarEnviarEmail}
                disabled={generando}
                title="Enviar factura por correo electrónico"
              >
                <Mail size={20} />
                <span>Enviar por Email</span>
              </button>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="modal-factura-nota">
            <div className="modal-factura-nota-icono">
              <FileText size={16} />
            </div>
            <p className="modal-factura-nota-texto">
              {yaEstaFacturado() 
                ? 'Esta factura ya fue generada y timbrada ante el SAT. Puede descargarla o enviarla nuevamente.'
                : 'La factura será un CFDI 4.0 válido ante el SAT, con sello digital, cadena original y código QR para verificación. El XML y PDF cumplirán con todos los requisitos fiscales vigentes.'
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-factura-footer">
          <button
            className="modal-factura-boton-cancelar"
            onClick={alCerrar}
            disabled={generando}
          >
            Cerrar
          </button>
        </div>

        {/* Loading Overlay */}
        {generando && (
          <div className="modal-factura-loading">
            <div className="modal-factura-spinner"></div>
            <p className="modal-factura-loading-texto">
              {yaEstaFacturado() ? 'Procesando...' : 'Generando y timbrando factura...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalGenerarFactura;