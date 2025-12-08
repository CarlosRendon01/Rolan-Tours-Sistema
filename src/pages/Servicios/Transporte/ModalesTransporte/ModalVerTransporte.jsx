import {
  X, Truck, DollarSign, MapPin, Package,
  FileText, Hash, CheckCircle, AlertCircle, XCircle,
  Eye, Download, Building2, Navigation, Flag
} from 'lucide-react';
import './ModalVerTransporte.css';

const ModalVerTransporte = ({ transporte, onCerrar }) => {

  // Función para convertir File a URL
  const obtenerUrlArchivo = (archivo) => {
    if (!archivo) return null;

    // Si ya es una URL string, retornarla
    if (typeof archivo === 'string') {
      return archivo;
    }

    // Si es un objeto File, crear URL temporal
    if (archivo instanceof File) {
      return URL.createObjectURL(archivo);
    }

    return null;
  };

  // Obtener URL de la foto del servicio
  const fotoUrl = obtenerUrlArchivo(transporte.foto_servicio);

  // Función para formatear precio
  const formatearPrecio = (precio, moneda) => {
    if (!precio) return 'N/A';
    const simbolo = moneda === 'USD' ? '$' : '$';
    return `${simbolo}${parseFloat(precio).toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${moneda}`;
  };

  // Función para obtener badge de estado
  const obtenerBadgeEstado = (estado) => {
    const estados = {
      'Activo': { clase: 'activo', icono: CheckCircle },
      'Inactivo': { clase: 'inactivo', icono: XCircle },
      'Mantenimiento': { clase: 'mantenimiento', icono: AlertCircle }
    };

    return estados[estado] || { clase: 'inactivo', icono: XCircle };
  };

  // Función para obtener badge de disponibilidad
  const obtenerBadgeDisponibilidad = (disponible) => {
    if (disponible) {
      return { clase: 'disponible', texto: 'Disponible', icono: CheckCircle };
    }
    return { clase: 'no-disponible', texto: 'No Disponible', icono: XCircle };
  };

  // Función para ver documento
  const handleVerDocumento = (archivo) => {
    if (!archivo) {
      alert('No hay documento disponible para visualizar');
      return;
    }

    if (archivo instanceof File) {
      const url = URL.createObjectURL(archivo);
      window.open(url, '_blank');
      return;
    }

    if (typeof archivo === 'string' && archivo !== 'null' && archivo !== null) {
      window.open(archivo, '_blank');
      return;
    }

    alert('No hay documento disponible para visualizar');
  };

  // Función para descargar documento
  const handleDescargar = (archivo, nombreDocumento) => {
    if (!archivo) {
      alert('No hay documento disponible para descargar');
      return;
    }

    if (archivo instanceof File) {
      const url = URL.createObjectURL(archivo);
      const link = document.createElement('a');
      link.href = url;
      link.download = archivo.name || `${transporte.nombre_servicio}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    if (typeof archivo === 'string') {
      const link = document.createElement('a');
      link.href = archivo;
      link.download = `${transporte.nombre_servicio}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    alert('No hay documento disponible para descargar');
  };

  const estadoBadge = obtenerBadgeEstado(transporte.estado);
  const disponibilidadBadge = obtenerBadgeDisponibilidad(transporte.disponibilidad);
  const IconoEstado = estadoBadge.icono;
  const IconoDisponibilidad = disponibilidadBadge.icono;

  return (
    <div className="mvt-overlay" onClick={onCerrar}>
      <div className="mvt-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvt-header">
          <div className="mvt-header-contenido">
            <Truck size={28} className="mvt-icono-header" />
            <div>
              <h2>{transporte.nombre_servicio}</h2>
              <p className="mvt-subtitulo">
                {transporte.codigo_servicio ? `Código: ${transporte.codigo_servicio}` : `Servicio #${transporte.id?.toString().padStart(3, '0')}`}
              </p>
            </div>
          </div>
          <button className="mvt-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="mvt-body">
          <div className="mvt-contenido-principal">
            {/* Columna Izquierda */}
            <div className="mvt-columna-izquierda">
              {/* Hero Card */}
              <div className="mvt-transporte-hero">
                <div className="mvt-transporte-hero-content">
                  <h3 className="mvt-transporte-titulo">
                    {transporte.nombre_servicio}
                  </h3>
                  <p className="mvt-transporte-subtitulo">
                    {transporte.tipo_transporte}
                  </p>
                  <div className="mvt-specs-grid">
                    <div className="mvt-spec-item">
                      <span className="mvt-spec-label">Capacidad</span>
                      <span className="mvt-spec-valor">
                        {transporte.capacidad || 'N/A'} pax
                      </span>
                    </div>
                    <div className="mvt-spec-item">
                      <span className="mvt-spec-label">Precio Base</span>
                      <span className="mvt-spec-valor">
                        {formatearPrecio(transporte.precio_base, transporte.moneda)}
                      </span>
                    </div>
                    <div className="mvt-spec-item">
                      <span className="mvt-spec-label">Estado</span>
                      <span className="mvt-spec-valor">
                        {transporte.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Foto del Servicio */}
                <div className="mvt-transporte-imagen-container">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={transporte.nombre_servicio}
                      className="mvt-transporte-foto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const container = e.target.parentElement;
                        container.innerHTML = `
                          <div class="mvt-transporte-sin-foto">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span>Error al cargar imagen</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="mvt-transporte-sin-foto">
                      <Truck size={48} />
                      <span>Sin fotografía del servicio</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información General */}
              <div className="mvt-seccion-detalles">
                <h3 className="mvt-titulo-seccion">
                  <FileText size={20} />
                  Información General
                </h3>
                <div className="mvt-detalles-grid">
                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Truck size={18} />
                      </div>
                      <span className="mvt-detalle-label">Tipo de Transporte</span>
                    </div>
                    <span className="mvt-detalle-valor">{transporte.tipo_transporte || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Package size={18} />
                      </div>
                      <span className="mvt-detalle-label">Capacidad</span>
                    </div>
                    <span className="mvt-detalle-valor">{transporte.capacidad || 'N/A'} pasajeros</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvt-detalle-label">Código de Servicio</span>
                    </div>
                    <span className="mvt-detalle-valor">{transporte.codigo_servicio || 'Sin código'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Building2 size={18} />
                      </div>
                      <span className="mvt-detalle-label">Proveedor</span>
                    </div>
                    <span className="mvt-detalle-valor destacado">
                      {transporte.nombre_proveedor || 'Sin proveedor'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {transporte.descripcion_servicio && (
                <div className="mvt-seccion-detalles">
                  <h3 className="mvt-titulo-seccion">
                    <FileText size={20} />
                    Descripción del Servicio
                  </h3>
                  <div className="mvt-descripcion-box">
                    <p>{transporte.descripcion_servicio}</p>
                  </div>
                </div>
              )}

              {/* Información de Paquete */}
              <div className="mvt-seccion-detalles">
                <h3 className="mvt-titulo-seccion">
                  <Package size={20} />
                  Información de Paquete y Precios
                </h3>
                <div className="mvt-detalles-grid">
                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Package size={18} />
                      </div>
                      <span className="mvt-detalle-label">Tipo de Paquete</span>
                    </div>
                    <span className="mvt-detalle-valor">{transporte.tipo_paquete || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <FileText size={18} />
                      </div>
                      <span className="mvt-detalle-label">Duración</span>
                    </div>
                    <span className="mvt-detalle-valor">{transporte.duracion_paquete || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <DollarSign size={18} />
                      </div>
                      <span className="mvt-detalle-label">Precio Base</span>
                    </div>
                    <span className="mvt-detalle-valor destacado">
                      {formatearPrecio(transporte.precio_base, transporte.moneda)}
                    </span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <DollarSign size={18} />
                      </div>
                      <span className="mvt-detalle-label">Moneda</span>
                    </div>
                    <span className="mvt-detalle-valor">{transporte.moneda || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Ubicaciones */}
              <div className="mvt-seccion-detalles">
                <h3 className="mvt-titulo-seccion">
                  <MapPin size={20} />
                  Ubicaciones
                </h3>
                <div className="mvt-detalles-grid">
                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Navigation size={18} />
                      </div>
                      <span className="mvt-detalle-label">Ubicación de Salida</span>
                    </div>
                    <span className="mvt-detalle-valor">{transporte.ubicacion_salida || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Flag size={18} />
                      </div>
                      <span className="mvt-detalle-label">Ubicación de Destino</span>
                    </div>
                    <span className="mvt-detalle-valor">{transporte.ubicacion_destino || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Incluye */}
              {transporte.incluye && (
                <div className="mvt-seccion-detalles">
                  <h3 className="mvt-titulo-seccion">
                    <CheckCircle size={20} />
                    Incluye
                  </h3>
                  <div className="mvt-descripcion-box">
                    <p>{transporte.incluye}</p>
                  </div>
                </div>
              )}

              {/* Restricciones */}
              {transporte.restricciones && (
                <div className="mvt-seccion-detalles">
                  <h3 className="mvt-titulo-seccion">
                    <AlertCircle size={20} />
                    Restricciones
                  </h3>
                  <div className="mvt-descripcion-box mvt-restricciones">
                    <p>{transporte.restricciones}</p>
                  </div>
                </div>
              )}

              {/* Foto del Servicio */}
              {fotoUrl && (
                <div className="mvt-seccion-detalles">
                  <h3 className="mvt-titulo-seccion">
                    <FileText size={20} />
                    Fotografía del Servicio
                  </h3>
                  <div className="mvt-documentos-grid">
                    <div className="mvt-documento-item">
                      <Truck size={32} />
                      <span>Fotografía del Vehículo/Servicio</span>
                      <div className="mvt-botones-documento">
                        <button
                          className="mvt-btn-descargar mvt-btn-ver"
                          onClick={() => handleVerDocumento(transporte.foto_servicio)}
                          title="Ver fotografía en nueva pestaña"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                        <button
                          className="mvt-btn-descargar mvt-btn-download"
                          onClick={() => handleDescargar(transporte.foto_servicio, 'foto_servicio')}
                          title="Descargar fotografía"
                        >
                          <Download size={16} />
                          Descargar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Columna Derecha - Estado y Disponibilidad */}
            <div className="mvt-columna-derecha">
              {/* Card de Estado */}
              <div className="mvt-card-estadistica">
                <div className="mvt-card-header">
                  <h4 className="mvt-card-titulo">Estado del Servicio</h4>
                  <IconoEstado size={18} className="mvt-card-icono" />
                </div>
                <div className="mvt-estado-container">
                  <div className="mvt-estado-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IconoEstado size={20} />
                      <span className="mvt-estado-label">Estado</span>
                    </div>
                    <span className={`mvt-badge-estado ${estadoBadge.clase}`}>
                      {transporte.estado}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Disponibilidad */}
              <div className="mvt-card-estadistica">
                <div className="mvt-card-header">
                  <h4 className="mvt-card-titulo">Disponibilidad</h4>
                  <IconoDisponibilidad size={18} className="mvt-card-icono" />
                </div>
                <div className="mvt-estado-container">
                  <div className="mvt-estado-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IconoDisponibilidad size={20} />
                      <span className="mvt-estado-label">Estado</span>
                    </div>
                    <span className={`mvt-badge-estado ${disponibilidadBadge.clase}`}>
                      {disponibilidadBadge.texto}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Resumen */}
              <div className="mvt-card-estadistica mvt-card-resumen">
                <div className="mvt-card-header">
                  <h4 className="mvt-card-titulo">Resumen del Servicio</h4>
                  <FileText size={18} className="mvt-card-icono" />
                </div>
                <div className="mvt-resumen-lista">
                  <div className="mvt-resumen-item">
                    <span className="mvt-resumen-label">Tipo de Transporte</span>
                    <span className="mvt-resumen-valor">{transporte.tipo_transporte}</span>
                  </div>
                  <div className="mvt-resumen-item">
                    <span className="mvt-resumen-label">Capacidad</span>
                    <span className="mvt-resumen-valor">{transporte.capacidad} pax</span>
                  </div>
                  <div className="mvt-resumen-item">
                    <span className="mvt-resumen-label">Tipo de Paquete</span>
                    <span className="mvt-resumen-valor">{transporte.tipo_paquete}</span>
                  </div>
                  <div className="mvt-resumen-item">
                    <span className="mvt-resumen-label">Precio</span>
                    <span className="mvt-resumen-valor mvt-precio-destacado">
                      {formatearPrecio(transporte.precio_base, transporte.moneda)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Proveedor */}
              {transporte.nombre_proveedor && (
                <div className="mvt-card-estadistica">
                  <div className="mvt-card-header">
                    <h4 className="mvt-card-titulo">Información del Proveedor</h4>
                    <Building2 size={18} className="mvt-card-icono" />
                  </div>
                  <div className="mvt-proveedor-container">
                    <div className="mvt-proveedor-info">
                      <Building2 size={32} className="mvt-proveedor-icono" />
                      <div>
                        <span className="mvt-proveedor-nombre">{transporte.nombre_proveedor}</span>
                        {transporte.empresa_proveedora_id && (
                          <span className="mvt-proveedor-id">
                            ID: {transporte.empresa_proveedora_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mvt-footer">
          <button className="mvt-btn-cerrar-footer" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerTransporte;