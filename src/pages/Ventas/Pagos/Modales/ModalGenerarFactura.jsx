import React, { useState } from 'react';
import { X, FileText, Download, Printer, Mail, CreditCard } from 'lucide-react';
import './ModalGenerarFactura.css';

const ModalGenerarFactura = ({ estaAbierto, alCerrar, pago }) => {
  const [generando, establecerGenerando] = useState(false);

  if (!estaAbierto || !pago) return null;

  const manejarGenerarFactura = async (formato) => {
    establecerGenerando(true);
    
    try {
      // Simulación de generación de factura
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`Factura generada en formato ${formato.toUpperCase()}\nCliente: ${pago.cliente}\nMonto: ${pago.monto}`);
      
      // Aquí iría la lógica real de generación
      console.log('Generando factura:', { pago, formato });
      
    } catch (error) {
      console.error('Error al generar factura:', error);
      alert('Error al generar la factura. Intente nuevamente.');
    } finally {
      establecerGenerando(false);
    }
  };

  const manejarEnviarEmail = async () => {
    establecerGenerando(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Factura enviada por email a:\n${pago.cliente}`);
      alCerrar();
    } catch (error) {
      console.error('Error al enviar email:', error);
      alert('Error al enviar el email. Intente nuevamente.');
    } finally {
      establecerGenerando(false);
    }
  };

  const manejarImprimir = () => {
    console.log('Imprimiendo factura:', pago);
    window.print();
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
              <p className="modal-factura-subtitulo">Factura No. {pago.numeroFactura}</p>
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
          {/* Información del pago */}
          <div className="modal-factura-info-pago">
            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Cliente:</span>
              <span className="modal-factura-valor">{pago.cliente}</span>
            </div>
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
          </div>

          {/* Opciones de generación */}
          <div className="modal-factura-opciones">
            <h3 className="modal-factura-opciones-titulo">Seleccione una opción:</h3>
            
            <div className="modal-factura-botones-grid">
              <button
                className="modal-factura-boton-opcion"
                onClick={() => manejarGenerarFactura('pdf')}
                disabled={generando}
              >
                <Download size={20} />
                <span>Descargar PDF</span>
              </button>

              <button
                className="modal-factura-boton-opcion"
                onClick={() => manejarGenerarFactura('xml')}
                disabled={generando}
              >
                <FileText size={20} />
                <span>Descargar XML</span>
              </button>

              <button
                className="modal-factura-boton-opcion"
                onClick={manejarImprimir}
                disabled={generando}
              >
                <Printer size={20} />
                <span>Imprimir</span>
              </button>

              <button
                className="modal-factura-boton-opcion"
                onClick={manejarEnviarEmail}
                disabled={generando}
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
              La factura se generará con todos los datos fiscales requeridos por el SAT.
              Incluirá el sello digital y código QR correspondiente.
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
            Cancelar
          </button>
        </div>

        {/* Loading Overlay */}
        {generando && (
          <div className="modal-factura-loading">
            <div className="modal-factura-spinner"></div>
            <p className="modal-factura-loading-texto">Generando factura...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalGenerarFactura;