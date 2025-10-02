import React from 'react';
import { X, Download, Receipt, User, DollarSign, Calendar, CreditCard, FileText, Building } from 'lucide-react';
import './ModalGenerarRecibo.css';

const ModalGenerarRecibo = ({ estaAbierto, alCerrar, pago }) => {
  if (!estaAbierto || !pago) return null;

  const manejarDescargar = () => {
    // Aquí iría la lógica para generar y descargar el PDF del recibo
    console.log('Descargando recibo para:', pago);
    alert(`Descargando recibo ${pago.numeroFactura}\nCliente: ${pago.cliente}`);
    // En producción: generarPDFRecibo(pago);
  };

  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="modal-recibo-superposicion" onClick={alCerrar}>
      <div className="modal-recibo-contenedor" onClick={(e) => e.stopPropagation()}>
        {/* Encabezado */}
        <div className="modal-recibo-encabezado">
          <div className="modal-recibo-encabezado-contenido">
            <div className="modal-recibo-envoltorio-icono">
              <Receipt size={24} />
            </div>
            <div>
              <h2 className="modal-recibo-titulo">Recibo de Pago</h2>
              <p className="modal-recibo-subtitulo">Comprobante de transacción</p>
            </div>
          </div>
          <button 
            className="modal-recibo-boton-cerrar" 
            onClick={alCerrar}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo - Vista previa del recibo */}
        <div className="modal-recibo-cuerpo">
          <div className="modal-recibo-documento">
            {/* Encabezado del documento */}
            <div className="modal-recibo-doc-encabezado">
              <div className="modal-recibo-logo">
                <Building size={32} />
                <div>
                  <h3 className="modal-recibo-empresa-nombre">Tu Empresa S.A. de C.V.</h3>
                  <p className="modal-recibo-empresa-datos">RFC: EMP123456ABC</p>
                  <p className="modal-recibo-empresa-datos">Av. Principal #123, CDMX</p>
                </div>
              </div>
              <div className="modal-recibo-doc-info">
                <h4 className="modal-recibo-doc-titulo">RECIBO DE PAGO</h4>
                <p className="modal-recibo-doc-numero">No. {pago.numeroFactura}</p>
                <p className="modal-recibo-doc-fecha">{fechaActual}</p>
              </div>
            </div>

            <div className="modal-recibo-separador"></div>

            {/* Información del cliente */}
            <div className="modal-recibo-seccion">
              <h5 className="modal-recibo-seccion-titulo">
                <User size={18} />
                Datos del Cliente
              </h5>
              <div className="modal-recibo-seccion-contenido">
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">Nombre:</span>
                  <span className="modal-recibo-dato-valor">{pago.cliente}</span>
                </div>
              </div>
            </div>

            {/* Detalle del pago */}
            <div className="modal-recibo-seccion">
              <h5 className="modal-recibo-seccion-titulo">
                <FileText size={18} />
                Detalle del Pago
              </h5>
              <div className="modal-recibo-seccion-contenido">
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">Concepto:</span>
                  <span className="modal-recibo-dato-valor">{pago.concepto}</span>
                </div>
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">Método de Pago:</span>
                  <span className="modal-recibo-dato-valor">
                    {pago.metodoPago || 'No especificado'}
                  </span>
                </div>
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">Fecha de Pago:</span>
                  <span className="modal-recibo-dato-valor">{pago.fechaPago}</span>
                </div>
                <div className="modal-recibo-dato">
                  <span className="modal-recibo-dato-label">No. Factura:</span>
                  <span className="modal-recibo-dato-valor modal-recibo-codigo">
                    {pago.numeroFactura}
                  </span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="modal-recibo-total-contenedor">
              <div className="modal-recibo-total">
                <span className="modal-recibo-total-label">
                  <DollarSign size={20} />
                  Total Pagado:
                </span>
                <span className="modal-recibo-total-monto">{pago.monto}</span>
              </div>
            </div>

            {/* Pie del documento */}
            <div className="modal-recibo-doc-pie">
              <div className="modal-recibo-firma">
                <div className="modal-recibo-linea-firma"></div>
                <p className="modal-recibo-firma-texto">Firma Autorizada</p>
              </div>
              <div className="modal-recibo-nota">
                <p>Este documento es un comprobante de pago válido.</p>
                <p>Gracias por su preferencia.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="modal-recibo-pie">
          <button 
            className="modal-recibo-boton-secundario" 
            onClick={alCerrar}
          >
            Cerrar
          </button>
          <button 
            className="modal-recibo-boton-primario"
            onClick={manejarDescargar}
          >
            <Download size={18} />
            Descargar Recibo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGenerarRecibo;