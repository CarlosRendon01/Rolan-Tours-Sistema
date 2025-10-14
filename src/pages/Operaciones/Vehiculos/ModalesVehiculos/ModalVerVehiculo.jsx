import { 
  X, Car, Gauge, Fuel, TrendingDown, CreditCard, 
  UserCircle, FileText, Calendar, Hash, Tag, 
  Image as ImageIcon, Download, DollarSign, Activity, Eye  // ✅ Agregado Eye
} from 'lucide-react';
import './ModalVerVehiculo.css';

const ModalVerVehiculo = ({ vehiculo, onCerrar }) => {
  const formatearMoneda = (valor) => {
    if (!valor) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
  };

  const formatearDecimal = (valor) => {
    if (!valor) return '0.00';
    return parseFloat(valor).toFixed(2);
  };

  const calcularTotal = () => {
    const renta = parseFloat(vehiculo.costo_renta) || 0;
    const chofer = parseFloat(vehiculo.costo_chofer_dia) || 0;
    return renta + chofer;
  };

  const calcularPorcentajeDesgaste = () => {
    const desgaste = parseFloat(vehiculo.desgaste) || 0;
    return Math.min(desgaste * 10, 100);
  };

  // ✅ Función para ver documento en nueva pestaña
  const handleVerDocumento = (url) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  // ✅ Función para descargar documento
  const handleDescargar = (url, nombreDocumento) => {
    if (!url) return;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${vehiculo.nombre}_${nombreDocumento}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const documentos = [
    { key: 'foto_vehiculo', label: 'Foto de Vehículo', icono: ImageIcon },
    { key: 'foto_poliza_seguro', label: 'Póliza de Seguro', icono: FileText },
    { key: 'foto_factura', label: 'Factura', icono: FileText },
    { key: 'foto_verificaciones', label: 'Verificaciones', icono: FileText },
    { key: 'foto_folio_antt', label: 'Folio ANTT', icono: FileText }
  ];

  const tieneDocumentos = vehiculo.documentos && 
    documentos.some(doc => vehiculo.documentos[doc.key]);

  return (
    <div className="mvv-overlay" onClick={onCerrar}>
      <div className="mvv-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvv-header">
          <div className="mvv-header-contenido">
            <Car size={28} className="mvv-icono-header" />
            <div>
              <h2>{vehiculo.nombre || 'Vehículo Sin Nombre'}</h2>
              <p className="mvv-subtitulo">
                {vehiculo.marca} {vehiculo.modelo} - {vehiculo.año}
              </p>
            </div>
          </div>
          <button className="mvv-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="mvv-body">
          <div className="mvv-contenido-principal">
            {/* Columna Izquierda */}
            <div className="mvv-columna-izquierda">
              {/* Hero Card */}
              <div className="mvv-vehiculo-hero">
                <div className="mvv-vehiculo-hero-content">
                  <h3 className="mvv-vehiculo-titulo">{vehiculo.nombre}</h3>
                  <p className="mvv-vehiculo-subtitulo">
                    {vehiculo.numero_placa || 'Sin Placa'}
                  </p>
                  <div className="mvv-specs-grid">
                    <div className="mvv-spec-item">
                      <span className="mvv-spec-label">Pasajeros</span>
                      <span className="mvv-spec-valor">
                        {vehiculo.numero_pasajeros || 'N/A'}
                      </span>
                    </div>
                    <div className="mvv-spec-item">
                      <span className="mvv-spec-label">Año</span>
                      <span className="mvv-spec-valor">{vehiculo.año || 'N/A'}</span>
                    </div>
                    <div className="mvv-spec-item">
                      <span className="mvv-spec-label">Disponibles</span>
                      <span className="mvv-spec-valor">
                        {vehiculo.vehiculos_disponibles || '0'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Imagen del Vehículo */}
                <div className="mvv-vehiculo-imagen-container">
                  {vehiculo.documentos?.foto_vehiculo ? (
                    <img 
                      src={vehiculo.documentos.foto_vehiculo} 
                      alt={vehiculo.nombre}
                      className="mvv-vehiculo-imagen"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="mvv-vehiculo-sin-imagen">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M5 17h14v-4H5v4z"></path>
                              <path d="M20 7H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"></path>
                            </svg>
                            <span>Error al cargar imagen</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="mvv-vehiculo-sin-imagen">
                      <Car size={48} />
                      <span>Sin imagen</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Vehículo */}
              <div className="mvv-seccion-detalles">
                <h3 className="mvv-titulo-seccion">
                  <Car size={20} />
                  Información del Vehículo
                </h3>
                <div className="mvv-detalles-grid">
                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Car size={18} />
                      </div>
                      <span className="mvv-detalle-label">Marca</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.marca || 'N/A'}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <FileText size={18} />
                      </div>
                      <span className="mvv-detalle-label">Modelo</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.modelo || 'N/A'}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvv-detalle-label">Año</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.año || 'N/A'}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Tag size={18} />
                      </div>
                      <span className="mvv-detalle-label">Color</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.color || 'N/A'}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvv-detalle-label">Nº Placa</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.numero_placa || 'N/A'}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <UserCircle size={18} />
                      </div>
                      <span className="mvv-detalle-label">Nº Pasajeros</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.numero_pasajeros || 'N/A'}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvv-detalle-label">Número de Serie</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.numero_serie || 'N/A'}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Tag size={18} />
                      </div>
                      <span className="mvv-detalle-label">NIP</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.nip || 'N/A'}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Tag size={18} />
                      </div>
                      <span className="mvv-detalle-label">Nº de Tag</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.numero_tag || 'N/A'}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Fuel size={18} />
                      </div>
                      <span className="mvv-detalle-label">Nº de Combustible</span>
                    </div>
                    <span className="mvv-detalle-valor">{vehiculo.numero_combustible || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Datos Operativos */}
              <div className="mvv-seccion-detalles">
                <h3 className="mvv-titulo-seccion">
                  <Gauge size={20} />
                  Datos Operativos
                </h3>
                <div className="mvv-detalles-grid">
                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Gauge size={18} />
                      </div>
                      <span className="mvv-detalle-label">Rendimiento</span>
                    </div>
                    <span className="mvv-detalle-valor">
                      {formatearDecimal(vehiculo.rendimiento)} km/L
                    </span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Fuel size={18} />
                      </div>
                      <span className="mvv-detalle-label">Precio Combustible</span>
                    </div>
                    <span className="mvv-detalle-valor destacado">
                      {formatearMoneda(vehiculo.precio_combustible)}
                    </span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <TrendingDown size={18} />
                      </div>
                      <span className="mvv-detalle-label">Desgaste</span>
                    </div>
                    <span className="mvv-detalle-valor">{formatearDecimal(vehiculo.desgaste)}</span>
                  </div>

                  <div className="mvv-detalle-item">
                    <div className="mvv-detalle-header">
                      <div className="mvv-detalle-icono">
                        <Car size={18} />
                      </div>
                      <span className="mvv-detalle-label">Vehículos Disponibles</span>
                    </div>
                    <span className="mvv-detalle-valor destacado">
                      {vehiculo.vehiculos_disponibles || '0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comentarios */}
              {vehiculo.comentarios && (
                <div className="mvv-seccion-detalles">
                  <h3 className="mvv-titulo-seccion">
                    <FileText size={20} />
                    Comentarios
                  </h3>
                  <div className="mvv-comentarios-box">
                    <p>{vehiculo.comentarios}</p>
                  </div>
                </div>
              )}

              {/* ✅ Documentos - SECCIÓN ACTUALIZADA */}
              <div className="mvv-seccion-detalles">
                <h3 className="mvv-titulo-seccion">
                  <ImageIcon size={20} />
                  Documentos Adjuntos
                </h3>
                <div className="mvv-documentos-grid">
                  {tieneDocumentos ? (
                    documentos.map(doc => {
                      if (vehiculo.documentos && vehiculo.documentos[doc.key]) {
                        const Icono = doc.icono;
                        const urlDocumento = vehiculo.documentos[doc.key];
                        
                        return (
                          <div key={doc.key} className="mvv-documento-item">
                            <Icono size={32} />
                            <span>{doc.label}</span>
                            <div className="mvv-botones-documento">
                              <button 
                                className="mvv-btn-descargar mvv-btn-ver"
                                onClick={() => handleVerDocumento(urlDocumento)}
                                title="Ver documento en nueva pestaña"
                              >
                                <Eye size={16} />
                                Ver
                              </button>
                              <button 
                                className="mvv-btn-descargar mvv-btn-download"
                                onClick={() => handleDescargar(urlDocumento, doc.key)}
                                title="Descargar documento"
                              >
                                <Download size={16} />
                                Descargar
                              </button>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <p className="mvv-sin-documentos">No hay documentos adjuntos</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Estadísticas */}
            <div className="mvv-columna-derecha">
              {/* Card de Costos */}
              <div className="mvv-card-estadistica">
                <div className="mvv-card-header">
                  <h4 className="mvv-card-titulo">Costos Operativos</h4>
                  <DollarSign size={18} className="mvv-card-icono" />
                </div>
                <div className="mvv-costos-lista">
                  <div className="mvv-costo-item">
                    <span className="mvv-costo-label">Costo de Renta</span>
                    <span className="mvv-costo-valor">
                      {formatearMoneda(vehiculo.costo_renta)}
                    </span>
                  </div>
                  <div className="mvv-costo-item">
                    <span className="mvv-costo-label">Costo Chofer/Día</span>
                    <span className="mvv-costo-valor">
                      {formatearMoneda(vehiculo.costo_chofer_dia)}
                    </span>
                  </div>
                  <div className="mvv-costo-item mvv-costo-total">
                    <span className="mvv-costo-label">Total por Día</span>
                    <span className="mvv-costo-valor">
                      {formatearMoneda(calcularTotal())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Rendimiento */}
              <div className="mvv-card-estadistica">
                <div className="mvv-card-header">
                  <h4 className="mvv-card-titulo">Rendimiento</h4>
                  <Activity size={18} className="mvv-card-icono" />
                </div>
                <div className="mvv-stat-bar-container">
                  <div className="mvv-stat-bar-header">
                    <span className="mvv-stat-bar-label">Eficiencia Combustible</span>
                    <span className="mvv-stat-bar-valor">
                      {formatearDecimal(vehiculo.rendimiento)} km/L
                    </span>
                  </div>
                  <div className="mvv-stat-bar">
                    <div 
                      className="mvv-stat-bar-fill" 
                      style={{ width: `${Math.min((vehiculo.rendimiento / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mvv-stat-bar-container">
                  <div className="mvv-stat-bar-header">
                    <span className="mvv-stat-bar-label">Nivel de Desgaste</span>
                    <span className="mvv-stat-bar-valor">
                      {formatearDecimal(vehiculo.desgaste)}%
                    </span>
                  </div>
                  <div className="mvv-stat-bar">
                    <div 
                      className="mvv-stat-bar-fill" 
                      style={{ 
                        width: `${calcularPorcentajeDesgaste()}%`,
                        background: calcularPorcentajeDesgaste() > 70 
                          ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' 
                          : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card de Disponibilidad */}
              <div className="mvv-card-estadistica">
                <div className="mvv-card-header">
                  <h4 className="mvv-card-titulo">Disponibilidad</h4>
                  <Car size={18} className="mvv-card-icono" />
                </div>
                <div className="mvv-stat-bar-container">
                  <div className="mvv-stat-bar-header">
                    <span className="mvv-stat-bar-label">Unidades Disponibles</span>
                    <span className="mvv-stat-bar-valor">
                      {vehiculo.vehiculos_disponibles || 0} unidades
                    </span>
                  </div>
                  <div className="mvv-stat-bar">
                    <div 
                      className="mvv-stat-bar-fill" 
                      style={{ 
                        width: `${Math.min((vehiculo.vehiculos_disponibles / 10) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mvv-footer">
          <button className="mvv-btn-cerrar-footer" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerVehiculo;