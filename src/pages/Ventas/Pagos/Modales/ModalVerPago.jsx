import React from 'react';
import { X, User, DollarSign, Calendar, CreditCard, FileText, Package, Clock } from 'lucide-react';
import './ModalVerPago.css';

const ModalVerPago = ({ estaAbierto, alCerrar, pago }) => {
  if (!estaAbierto || !pago) return null;

  const obtenerColorEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pagado':
        return '#10b981';
      case 'vencido':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="modal-superposicion" onClick={alCerrar}>
      <div className="modal-contenedor" onClick={(e) => e.stopPropagation()}>
        {/* Encabezado del Modal */}
        <div className="modal-encabezado">
          <div className="modal-encabezado-contenido">
            <div className="modal-envoltorio-icono">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="modal-titulo">Detalles del Pago</h2>
              <p className="modal-subtitulo">Información completa del registro</p>
            </div>
          </div>
          <button 
            className="modal-boton-cerrar" 
            onClick={alCerrar}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="modal-cuerpo">
          {/* Estado del Pago */}
          <div className="modal-insignia-estado" style={{ 
            backgroundColor: `${obtenerColorEstado(pago.estado)}15`,
            borderColor: obtenerColorEstado(pago.estado)
          }}>
            <span className="modal-punto-estado" style={{ 
              backgroundColor: obtenerColorEstado(pago.estado) 
            }}></span>
            <span style={{ color: obtenerColorEstado(pago.estado) }}>
              {pago.estado}
            </span>
          </div>

          {/* Cuadrícula de Información */}
          <div className="modal-cuadricula-informacion">
            {/* ID */}
            <div className="modal-elemento-info">
              <div className="modal-etiqueta-info">
                <Package size={16} />
                <span>ID del Pago</span>
              </div>
              <div className="modal-valor-info">
                #{pago.id?.toString().padStart(3, '0')}
              </div>
            </div>

            {/* Cliente */}
            <div className="modal-elemento-info modal-info-destacado">
              <div className="modal-etiqueta-info">
                <User size={16} />
                <span>Cliente</span>
              </div>
              <div className="modal-valor-info modal-valor-grande">
                {pago.cliente}
              </div>
            </div>

            {/* Monto */}
            <div className="modal-elemento-info modal-info-destacado">
              <div className="modal-etiqueta-info">
                <DollarSign size={16} />
                <span>Monto</span>
              </div>
              <div className="modal-valor-info modal-valor-monto">
                {pago.monto}
              </div>
            </div>

            {/* Número de Factura */}
            <div className="modal-elemento-info">
              <div className="modal-etiqueta-info">
                <FileText size={16} />
                <span>Número de Factura</span>
              </div>
              <div className="modal-valor-info modal-valor-codigo">
                {pago.numeroFactura}
              </div>
            </div>

            {/* Fecha de Pago */}
            <div className="modal-elemento-info">
              <div className="modal-etiqueta-info">
                <Calendar size={16} />
                <span>Fecha de Pago</span>
              </div>
              <div className="modal-valor-info">
                {pago.fechaPago || <span className="modal-texto-vacio">No registrada</span>}
              </div>
            </div>

            {/* Fecha de Vencimiento */}
            <div className="modal-elemento-info">
              <div className="modal-etiqueta-info">
                <Clock size={16} />
                <span>Fecha de Vencimiento</span>
              </div>
              <div className="modal-valor-info">
                {pago.fechaVencimiento || <span className="modal-texto-vacio">No especificada</span>}
              </div>
            </div>

            {/* Método de Pago */}
            <div className="modal-elemento-info">
              <div className="modal-etiqueta-info">
                <CreditCard size={16} />
                <span>Método de Pago</span>
              </div>
              <div className="modal-valor-info">
                {pago.metodoPago || <span className="modal-texto-vacio">No especificado</span>}
              </div>
            </div>

            {/* Concepto */}
            <div className="modal-elemento-info modal-info-completo">
              <div className="modal-etiqueta-info">
                <FileText size={16} />
                <span>Concepto</span>
              </div>
              <div className="modal-valor-info modal-valor-concepto">
                {pago.concepto || <span className="modal-texto-vacio">Sin concepto</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="modal-pie">
          <button 
            className="modal-boton-secundario" 
            onClick={alCerrar}
          >
            Cerrar
          </button>
          <button 
            className="modal-boton-primario"
            onClick={() => {
              alert('Funcionalidad de impresión/descarga');
              // Aquí iría la lógica para imprimir o descargar
            }}
          >
            <FileText size={18} />
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerPago;