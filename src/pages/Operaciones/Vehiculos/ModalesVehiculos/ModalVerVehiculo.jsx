import { X, Car, Gauge, Fuel, TrendingDown, CreditCard, UserCircle, FileText, Calendar, Hash, Tag, Image as ImageIcon, Download } from 'lucide-react';
import './ModalVerVehiculo.css';

const ModalVerVehiculo = ({ vehiculo, onCerrar }) => {
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
  };

  const formatearDecimal = (valor) => {
    return parseFloat(valor).toFixed(2);
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-contenido modal-ver-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-contenido">
            <Car size={28} className="icono-header" />
            <div>
              <h2>{vehiculo.nombre}</h2>
              <p className="subtitulo-modal">
                {vehiculo.marca} {vehiculo.modelo} - {vehiculo.año}
              </p>
            </div>
          </div>
          <button className="btn-cerrar-modal" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body-ver">
          {/* Sección: Datos Operativos */}
          <div className="seccion-detalles">
            <h3 className="titulo-seccion">
              <Gauge size={20} />
              Datos Operativos
            </h3>
            <div className="detalles-grid">
              <div className="detalle-item">
                <div className="detalle-icono">
                  <Gauge size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Rendimiento</span>
                  <span className="detalle-valor">{formatearDecimal(vehiculo.rendimiento)} km/L</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <Fuel size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Precio Combustible</span>
                  <span className="detalle-valor">{formatearMoneda(vehiculo.precio_combustible)}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <TrendingDown size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Desgaste</span>
                  <span className="detalle-valor">{formatearDecimal(vehiculo.desgaste)}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <CreditCard size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Costo de Renta</span>
                  <span className="detalle-valor destacado">{formatearMoneda(vehiculo.costo_renta)}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <UserCircle size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Costo Chofer/Día</span>
                  <span className="detalle-valor destacado">{formatearMoneda(vehiculo.costo_chofer_dia)}</span>
                </div>
              </div>

              <div className="detalle-item detalle-total">
                <div className="detalle-icono">
                  <CreditCard size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Costo Total/Día</span>
                  <span className="detalle-valor total">
                    {formatearMoneda(vehiculo.costo_renta + vehiculo.costo_chofer_dia)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Información del Vehículo */}
          <div className="seccion-detalles">
            <h3 className="titulo-seccion">
              <Car size={20} />
              Información del Vehículo
            </h3>
            <div className="detalles-grid">
              <div className="detalle-item">
                <div className="detalle-icono">
                  <Car size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Marca</span>
                  <span className="detalle-valor">{vehiculo.marca || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <FileText size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Modelo</span>
                  <span className="detalle-valor">{vehiculo.modelo || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <Calendar size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Año</span>
                  <span className="detalle-valor">{vehiculo.año || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <Tag size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Color</span>
                  <span className="detalle-valor">{vehiculo.color || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <Hash size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">N° Placa</span>
                  <span className="detalle-valor">{vehiculo.numero_placa || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <UserCircle size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">N° Pasajeros</span>
                  <span className="detalle-valor">{vehiculo.numero_pasajeros || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <Hash size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Número de Serie</span>
                  <span className="detalle-valor">{vehiculo.numero_serie || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <Tag size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">NIP</span>
                  <span className="detalle-valor">{vehiculo.nip || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <Tag size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">N° de Tag</span>
                  <span className="detalle-valor">{vehiculo.numero_tag || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <Fuel size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">N° de Combustible</span>
                  <span className="detalle-valor">{vehiculo.numero_combustible || 'N/A'}</span>
                </div>
              </div>

              <div className="detalle-item">
                <div className="detalle-icono">
                  <Car size={20} />
                </div>
                <div className="detalle-info">
                  <span className="detalle-label">Vehículos Disponibles</span>
                  <span className="detalle-valor destacado">{vehiculo.vehiculos_disponibles || '0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Comentarios */}
          {vehiculo.comentarios && (
            <div className="seccion-detalles">
              <h3 className="titulo-seccion">
                <FileText size={20} />
                Comentarios
              </h3>
              <div className="comentarios-box">
                <p>{vehiculo.comentarios}</p>
              </div>
            </div>
          )}

          {/* Sección: Documentos */}
          {vehiculo.documentos && (
            <div className="seccion-detalles">
              <h3 className="titulo-seccion">
                <ImageIcon size={20} />
                Documentos Adjuntos
              </h3>
              <div className="documentos-grid">
                {vehiculo.documentos.foto_vehiculo && (
                  <div className="documento-item">
                    <ImageIcon size={24} />
                    <span>Foto de Vehículo</span>
                    <button className="btn-descargar">
                      <Download size={16} />
                      Ver
                    </button>
                  </div>
                )}

                {vehiculo.documentos.foto_poliza_seguro && (
                  <div className="documento-item">
                    <FileText size={24} />
                    <span>Póliza de Seguro</span>
                    <button className="btn-descargar">
                      <Download size={16} />
                      Ver
                    </button>
                  </div>
                )}

                {vehiculo.documentos.foto_factura && (
                  <div className="documento-item">
                    <FileText size={24} />
                    <span>Factura</span>
                    <button className="btn-descargar">
                      <Download size={16} />
                      Ver
                    </button>
                  </div>
                )}

                {vehiculo.documentos.foto_verificaciones && (
                  <div className="documento-item">
                    <FileText size={24} />
                    <span>Verificaciones</span>
                    <button className="btn-descargar">
                      <Download size={16} />
                      Ver
                    </button>
                  </div>
                )}

                {vehiculo.documentos.foto_folio_antt && (
                  <div className="documento-item">
                    <FileText size={24} />
                    <span>Folio ANTT</span>
                    <button className="btn-descargar">
                      <Download size={16} />
                      Ver
                    </button>
                  </div>
                )}

                {(!vehiculo.documentos.foto_vehiculo && 
                  !vehiculo.documentos.foto_poliza_seguro && 
                  !vehiculo.documentos.foto_factura && 
                  !vehiculo.documentos.foto_verificaciones && 
                  !vehiculo.documentos.foto_folio_antt) && (
                  <p className="sin-documentos">No hay documentos adjuntos</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cerrar" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerVehiculo;