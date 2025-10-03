import React from 'react';
import { X, User, DollarSign, Calendar, CreditCard, FileText, Package, Clock, Hash } from 'lucide-react';
import './ModalVerPago.css';

const ModalVerPago = ({ estaAbierto, alCerrar, pago }) => {
  // Función para restaurar el scroll completamente
  const restaurarScroll = React.useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
  }, []);

  // Función mejorada para cerrar el modal
  const manejarCierre = React.useCallback(() => {
    restaurarScroll();
    alCerrar();
  }, [alCerrar, restaurarScroll]);

  if (!estaAbierto || !pago) {
    // Restaurar scroll cuando el modal no está visible
    React.useEffect(() => {
      restaurarScroll();
    });
    return null;
  }

  // Función para obtener color del estado
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

  // Manejar la tecla Escape y control del scroll
  React.useEffect(() => {
    const manejarTeclaEscape = (evento) => {
      if (evento.key === 'Escape') {
        manejarCierre();
      }
    };

    if (estaAbierto) {
      document.addEventListener('keydown', manejarTeclaEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', manejarTeclaEscape);
      restaurarScroll();
    };
  }, [estaAbierto, manejarCierre, restaurarScroll]);

  return (
    <div className="superposicion-modal-pago" onClick={manejarCierre}>
      <div className="contenido-modal-pago" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado-modal-pago">
          <button 
            className="boton-cerrar-modal-pago" 
            onClick={manejarCierre} 
            aria-label="Cerrar modal"
            type="button"
          >
            <X size={20} />
          </button>
          <h2 className="titulo-modal-pago">
            <FileText size={24} />
            Detalles del Pago
          </h2>
        </div>
        
        <div className="cuerpo-modal-pago">
          {/* Insignia de Estado */}
          <div className="contenedor-insignia-estado-pago">
            <div 
              className="insignia-estado-pago" 
              style={{ 
                backgroundColor: `${obtenerColorEstado(pago.estado)}15`,
                borderColor: obtenerColorEstado(pago.estado),
                color: obtenerColorEstado(pago.estado)
              }}
            >
              <span 
                className="punto-estado-pago" 
                style={{ backgroundColor: obtenerColorEstado(pago.estado) }}
              ></span>
              {pago.estado}
            </div>
          </div>

          <div className="lista-informacion-pago">
            {/* ID del Pago */}
            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <Hash size={16} />
                ID del Pago
              </div>
              <div className="valor-informacion-pago">
                #{pago.id?.toString().padStart(3, '0')}
              </div>
            </div>
            
            {/* Cliente */}
            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <User size={16} />
                Cliente
              </div>
              <div className="valor-informacion-pago">
                {pago.cliente}
              </div>
            </div>
            
            {/* Monto */}
            <div className="elemento-informacion-pago elemento-destacado-pago">
              <div className="etiqueta-informacion-pago">
                <DollarSign size={16} />
                Monto
              </div>
              <div className="valor-informacion-pago valor-monto-pago">
                {pago.monto}
              </div>
            </div>
            
            {/* Número de Factura */}
            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <FileText size={16} />
                Número de Factura
              </div>
              <div className="valor-informacion-pago">
                <span className="codigo-factura-pago">
                  {pago.numeroFactura}
                </span>
              </div>
            </div>
            
            {/* Fecha de Pago */}
            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <Calendar size={16} />
                Fecha de Pago
              </div>
              <div className="valor-informacion-pago">
                {pago.fechaPago || <span className="texto-vacio-pago">No registrada</span>}
              </div>
            </div>
            
            {/* Fecha de Vencimiento */}
            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <Clock size={16} />
                Fecha de Vencimiento
              </div>
              <div className="valor-informacion-pago">
                {pago.fechaVencimiento || <span className="texto-vacio-pago">No especificada</span>}
              </div>
            </div>
            
            {/* Método de Pago */}
            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <CreditCard size={16} />
                Método de Pago
              </div>
              <div className="valor-informacion-pago">
                {pago.metodoPago || <span className="texto-vacio-pago">No especificado</span>}
              </div>
            </div>
            
            {/* Concepto */}
            {pago.concepto && (
              <div className="elemento-informacion-pago">
                <div className="etiqueta-informacion-pago">
                  <FileText size={16} />
                  Concepto
                </div>
                <div className="valor-informacion-pago">
                  {pago.concepto}
                </div>
              </div>
            )}
          </div>
          
          {/* Botón de cerrar en la parte inferior */}
          <div className="contenedor-boton-inferior-pago">
            <button 
              className="boton-cerrar-inferior-pago" 
              onClick={manejarCierre}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerPago;