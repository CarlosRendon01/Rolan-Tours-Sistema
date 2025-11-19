import { 
  X, UtensilsCrossed, MapPin, DollarSign, Package, 
  FileText, Clock, Eye, Download, CheckCircle, 
  AlertCircle, XCircle, Building2, Calendar, Hash
} from 'lucide-react';
import './ModalVerRestaurante.css';

const ModalVerRestaurante = ({ restaurante, onCerrar }) => {
  
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

  // Obtener URL de la foto
  const fotoUrl = obtenerUrlArchivo(restaurante.foto_servicio);
  
  // Función para formatear precio
  const formatearPrecio = (precio, moneda) => {
    if (!precio) return 'N/A';
    const precioNum = parseFloat(precio);
    const simbolo = moneda === 'USD' ? '$' : '$';
    return `${simbolo}${precioNum.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${moneda}`;
  };

  // Función para obtener icono de estado
  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'Activo':
        return { icono: CheckCircle, clase: 'activo', texto: 'Activo' };
      case 'Inactivo':
        return { icono: XCircle, clase: 'inactivo', texto: 'Inactivo' };
      case 'Mantenimiento':
        return { icono: AlertCircle, clase: 'mantenimiento', texto: 'Mantenimiento' };
      default:
        return { icono: AlertCircle, clase: 'inactivo', texto: 'Desconocido' };
    }
  };

  // Función para ver documento
  const handleVerDocumento = (archivo) => {
    if (!archivo) {
      alert('No hay documento disponible para visualizar');
      return;
    }
    
    // Si es un objeto File, crear URL temporal
    if (archivo instanceof File) {
      const url = URL.createObjectURL(archivo);
      window.open(url, '_blank');
      return;
    }
    
    // Si es una URL string
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
    
    // Si es un objeto File
    if (archivo instanceof File) {
      const url = URL.createObjectURL(archivo);
      const link = document.createElement('a');
      link.href = url;
      link.download = archivo.name || `${restaurante.nombre_servicio}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }
    
    // Si es una URL string
    if (typeof archivo === 'string') {
      const link = document.createElement('a');
      link.href = archivo;
      link.download = `${restaurante.nombre_servicio}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    alert('No hay documento disponible para descargar');
  };

  const estadoInfo = obtenerIconoEstado(restaurante.estado);
  const IconoEstado = estadoInfo.icono;

  return (
    <div className="mvr-overlay" onClick={onCerrar}>
      <div className="mvr-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvr-header">
          <div className="mvr-header-contenido">
            <UtensilsCrossed size={28} className="mvr-icono-header" />
            <div>
              <h2>{restaurante.nombre_servicio}</h2>
              <p className="mvr-subtitulo">
                {restaurante.tipo_servicio} • {restaurante.categoria}
              </p>
            </div>
          </div>
          <button className="mvr-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="mvr-body">
          <div className="mvr-contenido-principal">
            {/* Columna Izquierda */}
            <div className="mvr-columna-izquierda">
              {/* Hero Card */}
              <div className="mvr-servicio-hero">
                <div className="mvr-servicio-hero-content">
                  <h3 className="mvr-servicio-titulo">
                    {restaurante.nombre_servicio}
                  </h3>
                  <p className="mvr-servicio-subtitulo">
                    {restaurante.descripcion_servicio || 'Sin descripción'}
                  </p>
                  <div className="mvr-specs-grid">
                    <div className="mvr-spec-item">
                      <span className="mvr-spec-label">Tipo</span>
                      <span className="mvr-spec-valor">
                        {restaurante.tipo_servicio || 'N/A'}
                      </span>
                    </div>
                    <div className="mvr-spec-item">
                      <span className="mvr-spec-label">Categoría</span>
                      <span className="mvr-spec-valor">{restaurante.categoria || 'N/A'}</span>
                    </div>
                    <div className="mvr-spec-item">
                      <span className="mvr-spec-label">Precio</span>
                      <span className="mvr-spec-valor">
                        {formatearPrecio(restaurante.precio_base, restaurante.moneda)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Foto del Servicio */}
                <div className="mvr-servicio-imagen-container">
                  {fotoUrl ? (
                    <img 
                      src={fotoUrl} 
                      alt={restaurante.nombre_servicio}
                      className="mvr-servicio-foto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const container = e.target.parentElement;
                        container.innerHTML = `
                          <div class="mvr-servicio-sin-foto">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <span>Error al cargar imagen</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="mvr-servicio-sin-foto">
                      <UtensilsCrossed size={48} />
                      <span>Sin fotografía</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información General */}
              <div className="mvr-seccion-detalles">
                <h3 className="mvr-titulo-seccion">
                  <FileText size={20} />
                  Información General
                </h3>
                <div className="mvr-detalles-grid">
                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <UtensilsCrossed size={18} />
                      </div>
                      <span className="mvr-detalle-label">Nombre del Servicio</span>
                    </div>
                    <span className="mvr-detalle-valor">{restaurante.nombre_servicio || 'N/A'}</span>
                  </div>

                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <Package size={18} />
                      </div>
                      <span className="mvr-detalle-label">Tipo de Servicio</span>
                    </div>
                    <span className="mvr-detalle-valor">{restaurante.tipo_servicio || 'N/A'}</span>
                  </div>

                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <FileText size={18} />
                      </div>
                      <span className="mvr-detalle-label">Categoría</span>
                    </div>
                    <span className="mvr-detalle-valor">{restaurante.categoria || 'N/A'}</span>
                  </div>

                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvr-detalle-label">Capacidad</span>
                    </div>
                    <span className="mvr-detalle-valor">
                      {restaurante.capacidad ? `${restaurante.capacidad} comensales` : 'N/A'}
                    </span>
                  </div>

                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvr-detalle-label">Código de Servicio</span>
                    </div>
                    <span className="mvr-detalle-valor destacado">
                      {restaurante.codigo_servicio || 'N/A'}
                    </span>
                  </div>

                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <IconoEstado size={18} />
                      </div>
                      <span className="mvr-detalle-label">Estado</span>
                    </div>
                    <span className={`mvr-badge-estado ${estadoInfo.clase}`}>
                      {estadoInfo.texto}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de Paquete y Precios */}
              <div className="mvr-seccion-detalles">
                <h3 className="mvr-titulo-seccion">
                  <DollarSign size={20} />
                  Paquete y Precios
                </h3>
                <div className="mvr-detalles-grid">
                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <Package size={18} />
                      </div>
                      <span className="mvr-detalle-label">Tipo de Paquete</span>
                    </div>
                    <span className="mvr-detalle-valor">{restaurante.tipo_paquete || 'N/A'}</span>
                  </div>

                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <Clock size={18} />
                      </div>
                      <span className="mvr-detalle-label">Duración</span>
                    </div>
                    <span className="mvr-detalle-valor">{restaurante.duracion_paquete || 'N/A'}</span>
                  </div>

                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <DollarSign size={18} />
                      </div>
                      <span className="mvr-detalle-label">Precio Base</span>
                    </div>
                    <span className="mvr-detalle-valor destacado">
                      {formatearPrecio(restaurante.precio_base, restaurante.moneda)}
                    </span>
                  </div>

                  <div className="mvr-detalle-item">
                    <div className="mvr-detalle-header">
                      <div className="mvr-detalle-icono">
                        <DollarSign size={18} />
                      </div>
                      <span className="mvr-detalle-label">Moneda</span>
                    </div>
                    <span className="mvr-detalle-valor">{restaurante.moneda || 'MXN'}</span>
                  </div>
                </div>
              </div>

              {/* Incluye */}
              {restaurante.incluye && (
                <div className="mvr-seccion-detalles">
                  <h3 className="mvr-titulo-seccion">
                    <CheckCircle size={20} />
                    Incluye
                  </h3>
                  <div className="mvr-comentarios-box">
                    <p>{restaurante.incluye}</p>
                  </div>
                </div>
              )}

              {/* Restricciones */}
              {restaurante.restricciones && (
                <div className="mvr-seccion-detalles">
                  <h3 className="mvr-titulo-seccion">
                    <AlertCircle size={20} />
                    Restricciones
                  </h3>
                  <div className="mvr-comentarios-box">
                    <p>{restaurante.restricciones}</p>
                  </div>
                </div>
              )}

              {/* Documentos */}
              {fotoUrl && (
                <div className="mvr-seccion-detalles">
                  <h3 className="mvr-titulo-seccion">
                    <FileText size={20} />
                    Documentos Adjuntos
                  </h3>
                  <div className="mvr-documentos-grid">
                    <div className="mvr-documento-item">
                      <UtensilsCrossed size={32} />
                      <span>Fotografía del Servicio</span>
                      <div className="mvr-botones-documento">
                        <button 
                          className="mvr-btn-descargar mvr-btn-ver"
                          onClick={() => handleVerDocumento(restaurante.foto_servicio)}
                          title="Ver fotografía en nueva pestaña"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                        <button 
                          className="mvr-btn-descargar mvr-btn-download"
                          onClick={() => handleDescargar(restaurante.foto_servicio, 'foto_servicio')}
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

            {/* Columna Derecha - Información de Ubicación */}
            <div className="mvr-columna-derecha">
              {/* Card de Ubicación */}
              <div className="mvr-card-estadistica">
                <div className="mvr-card-header">
                  <h4 className="mvr-card-titulo">Ubicación</h4>
                  <MapPin size={18} className="mvr-card-icono" />
                </div>
                <div className="mvr-ubicacion-lista">
                  <div className="mvr-ubicacion-item">
                    <span className="mvr-ubicacion-label">Dirección</span>
                    <span className="mvr-ubicacion-valor">
                      {restaurante.ubicacion_restaurante || 'N/A'}
                    </span>
                  </div>
                  {restaurante.horario_servicio && (
                    <div className="mvr-ubicacion-item">
                      <span className="mvr-ubicacion-label">Horario</span>
                      <span className="mvr-ubicacion-valor">
                        <Clock size={14} />
                        {restaurante.horario_servicio}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card de Proveedor */}
              <div className="mvr-card-estadistica">
                <div className="mvr-card-header">
                  <h4 className="mvr-card-titulo">Proveedor</h4>
                  <Building2 size={18} className="mvr-card-icono" />
                </div>
                <div className="mvr-proveedor-lista">
                  {restaurante.nombre_proveedor && (
                    <div className="mvr-proveedor-item">
                      <span className="mvr-proveedor-label">Nombre</span>
                      <span className="mvr-proveedor-valor">
                        {restaurante.nombre_proveedor}
                      </span>
                    </div>
                  )}
                  {restaurante.empresa_proveedora_id && (
                    <div className="mvr-proveedor-item">
                      <span className="mvr-proveedor-label">ID Proveedor</span>
                      <span className="mvr-proveedor-valor">
                        #{restaurante.empresa_proveedora_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card de Disponibilidad */}
              <div className="mvr-card-estadistica">
                <div className="mvr-card-header">
                  <h4 className="mvr-card-titulo">Estado del Servicio</h4>
                  <CheckCircle size={18} className="mvr-card-icono" />
                </div>
                <div className="mvr-disponibilidad-container">
                  <div className="mvr-disponibilidad-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IconoEstado size={20} />
                      <span className="mvr-disponibilidad-label">Estado</span>
                    </div>
                    <span className={`mvr-badge-estado ${estadoInfo.clase}`}>
                      {estadoInfo.texto}
                    </span>
                  </div>
                  <div className="mvr-disponibilidad-item">
                    <span className="mvr-disponibilidad-label">Disponibilidad</span>
                    <span className={`mvr-badge-disponibilidad ${restaurante.disponibilidad ? 'disponible' : 'no-disponible'}`}>
                      {restaurante.disponibilidad ? 'Disponible' : 'No Disponible'}
                    </span>
                  </div>
                  {restaurante.fecha_registro && (
                    <div className="mvr-disponibilidad-item">
                      <span className="mvr-disponibilidad-label">Fecha de Registro</span>
                      <span className="mvr-disponibilidad-valor">
                        <Calendar size={14} />
                        {new Date(restaurante.fecha_registro).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mvr-footer">
          <button className="mvr-btn-cerrar-footer" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerRestaurante;