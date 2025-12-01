import {
  X, Home, DollarSign, MapPin, Calendar, Hash,
  Building, Users, Package, CheckCircle, XCircle,
  AlertCircle, Image as ImageIcon, Bed, Star, Clock,
  FileText, Info
} from 'lucide-react';
import './ModalVerHospedaje.css';

const ModalVerHospedaje = ({ hospedaje, onCerrar }) => {

  // Función para obtener URL de archivo
  const obtenerUrlArchivo = (archivo) => {
    if (!archivo) return null;

    if (typeof archivo === 'string') {
      return archivo;
    }

    if (archivo instanceof File) {
      return URL.createObjectURL(archivo);
    }

    return null;
  };

  const fotoUrl = obtenerUrlArchivo(hospedaje.foto_servicio);

  // Función para formatear precio
  const formatearPrecio = (precio, moneda = 'MXN') => {
    if (!precio) return 'N/A';

    const simbolos = {
      'MXN': '$',
      'USD': '$',
      'EUR': '€'
    };

    return `${simbolos[moneda] || '$'}${parseFloat(precio).toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${moneda}`;
  };

  // Función para obtener clase de estado
  const obtenerClaseEstado = (estado) => {
    const estados = {
      'Activo': 'activo',
      'Inactivo': 'inactivo',
      'En mantenimiento': 'mantenimiento'
    };
    return estados[estado] || 'activo';
  };

  // Función para obtener icono de estado
  const obtenerIconoEstado = (estado) => {
    const iconos = {
      'Activo': CheckCircle,
      'Inactivo': XCircle,
      'En mantenimiento': AlertCircle
    };
    return iconos[estado] || CheckCircle;
  };

  const IconoEstado = obtenerIconoEstado(hospedaje.estado);

  // Dividir servicios por comas
  const serviciosArray = hospedaje.servicios_instalaciones
    ? hospedaje.servicios_instalaciones.split(',').map(s => s.trim()).filter(s => s)
    : [];

  const incluyeArray = hospedaje.incluye
    ? hospedaje.incluye.split(',').map(s => s.trim()).filter(s => s)
    : [];

  return (
    <div className="mvh-overlay" onClick={onCerrar}>
      <div className="mvh-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvh-header">
          <div className="mvh-header-contenido">
            <Home size={28} className="mvh-icono-header" />
            <div>
              <h2>{hospedaje.nombre_servicio}</h2>
              <p className="mvh-subtitulo">
                {hospedaje.codigo_servicio}
              </p>
            </div>
          </div>
          <button className="mvh-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="mvh-body">
          <div className="mvh-contenido-principal">
            {/* Columna Izquierda */}
            <div className="mvh-columna-izquierda">
              {/* Hero Card */}
              <div className="mvh-hospedaje-hero">
                <div className="mvh-hospedaje-hero-content">
                  <h3 className="mvh-hospedaje-titulo">
                    {hospedaje.nombre_servicio}
                  </h3>
                  <p className="mvh-hospedaje-subtitulo">
                    {hospedaje.tipo_hospedaje} - {hospedaje.tipo_habitacion}
                  </p>
                  <div className="mvh-specs-grid">
                    <div className="mvh-spec-item">
                      <span className="mvh-spec-label">Capacidad</span>
                      <span className="mvh-spec-valor">
                        {hospedaje.capacidad || 'N/A'} personas
                      </span>
                    </div>
                    <div className="mvh-spec-item">
                      <span className="mvh-spec-label">Precio</span>
                      <span className="mvh-spec-valor">
                        {formatearPrecio(hospedaje.precio_base, hospedaje.moneda)}
                      </span>
                    </div>
                    <div className="mvh-spec-item">
                      <span className="mvh-spec-label">Estado</span>
                      <span className="mvh-spec-valor">
                        {hospedaje.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Foto del Hospedaje */}
                <div className="mvh-hospedaje-imagen-container">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={hospedaje.nombre_servicio}
                      className="mvh-hospedaje-foto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const container = e.target.parentElement;
                        container.innerHTML = `
                          <div class="mvh-hospedaje-sin-foto">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <span>Error al cargar imagen</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="mvh-hospedaje-sin-foto">
                      <ImageIcon size={48} />
                      <span>Sin fotografía</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información General */}
              <div className="mvh-seccion-detalles">
                <h3 className="mvh-titulo-seccion">
                  <Home size={20} />
                  Datos Generales
                </h3>
                <div className="mvh-detalles-grid">
                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvh-detalle-label">Código de Servicio</span>
                    </div>
                    <span className="mvh-detalle-valor destacado">{hospedaje.codigo_servicio || 'N/A'}</span>
                  </div>

                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <FileText size={18} />
                      </div>
                      <span className="mvh-detalle-label">Nombre del Servicio</span>
                    </div>
                    <span className="mvh-detalle-valor">{hospedaje.nombre_servicio || 'N/A'}</span>
                  </div>

                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <Building size={18} />
                      </div>
                      <span className="mvh-detalle-label">Tipo de Hospedaje</span>
                    </div>
                    <span className="mvh-detalle-valor">{hospedaje.tipo_hospedaje || 'N/A'}</span>
                  </div>

                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <Bed size={18} />
                      </div>
                      <span className="mvh-detalle-label">Tipo de Habitación</span>
                    </div>
                    <span className="mvh-detalle-valor">{hospedaje.tipo_habitacion || 'N/A'}</span>
                  </div>

                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <Users size={18} />
                      </div>
                      <span className="mvh-detalle-label">Capacidad</span>
                    </div>
                    <span className="mvh-detalle-valor">{hospedaje.capacidad || 'N/A'} personas</span>
                  </div>

                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <Info size={18} />
                      </div>
                      <span className="mvh-detalle-label">Estado</span>
                    </div>
                    <span className={`mvh-badge-estado ${obtenerClaseEstado(hospedaje.estado)}`}>
                      {hospedaje.estado || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Descripción del Servicio */}
              {hospedaje.descripcion_servicio && (
                <div className="mvh-seccion-detalles">
                  <h3 className="mvh-titulo-seccion">
                    <FileText size={20} />
                    Descripción del Servicio
                  </h3>
                  <div className="mvh-descripcion-box">
                    <p>{hospedaje.descripcion_servicio}</p>
                  </div>
                </div>
              )}

              {/* Información de Paquete y Precios */}
              <div className="mvh-seccion-detalles">
                <h3 className="mvh-titulo-seccion">
                  <DollarSign size={20} />
                  Paquete y Precios
                </h3>
                <div className="mvh-detalles-grid">
                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <Package size={18} />
                      </div>
                      <span className="mvh-detalle-label">Tipo de Paquete</span>
                    </div>
                    <span className="mvh-detalle-valor">{hospedaje.tipo_paquete || 'N/A'}</span>
                  </div>

                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <Clock size={18} />
                      </div>
                      <span className="mvh-detalle-label">Duración del Paquete</span>
                    </div>
                    <span className="mvh-detalle-valor">{hospedaje.duracion_paquete || 'N/A'}</span>
                  </div>

                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <DollarSign size={18} />
                      </div>
                      <span className="mvh-detalle-label">Precio Base</span>
                    </div>
                    <span className="mvh-detalle-valor destacado">
                      {formatearPrecio(hospedaje.precio_base, hospedaje.moneda)}
                    </span>
                  </div>

                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <DollarSign size={18} />
                      </div>
                      <span className="mvh-detalle-label">Moneda</span>
                    </div>
                    <span className="mvh-detalle-valor">{hospedaje.moneda || 'MXN'}</span>
                  </div>
                </div>
              </div>

              {/* ¿Qué Incluye? */}
              {hospedaje.incluye && (
                <div className="mvh-seccion-detalles">
                  <h3 className="mvh-titulo-seccion">
                    <CheckCircle size={20} />
                    ¿Qué Incluye?
                  </h3>
                  <div className="mvh-descripcion-box">
                    <p>{hospedaje.incluye}</p>
                  </div>
                </div>
              )}

              {/* Restricciones y Políticas */}
              {hospedaje.restricciones && (
                <div className="mvh-seccion-detalles">
                  <h3 className="mvh-titulo-seccion">
                    <AlertCircle size={20} />
                    Restricciones y Políticas
                  </h3>
                  <div className="mvh-descripcion-box">
                    <p>{hospedaje.restricciones}</p>
                  </div>
                </div>
              )}

              {/* Ubicación y Proveedor */}
              <div className="mvh-seccion-detalles">
                <h3 className="mvh-titulo-seccion">
                  <MapPin size={20} />
                  Proveedor y Ubicación
                </h3>
                <div className="mvh-detalles-grid">
                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <Building size={18} />
                      </div>
                      <span className="mvh-detalle-label">Empresa Proveedora</span>
                    </div>
                    <span className="mvh-detalle-valor">{hospedaje.nombre_proveedor || 'N/A'}</span>
                  </div>

                  <div className="mvh-detalle-item">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <Info size={18} />
                      </div>
                      <span className="mvh-detalle-label">Disponibilidad</span>
                    </div>
                    <span className={`mvh-badge-disponibilidad ${hospedaje.disponibilidad ? 'disponible' : 'no-disponible'}`}>
                      {hospedaje.disponibilidad ? 'Disponible' : 'No Disponible'}
                    </span>
                  </div>

                  <div className="mvh-detalle-item mvh-detalle-full">
                    <div className="mvh-detalle-header">
                      <div className="mvh-detalle-icono">
                        <MapPin size={18} />
                      </div>
                      <span className="mvh-detalle-label">Ubicación del Hospedaje</span>
                    </div>
                    <span className="mvh-detalle-valor">{hospedaje.ubicacion_hospedaje || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Servicios e Instalaciones */}
              {hospedaje.servicios_instalaciones && (
                <div className="mvh-seccion-detalles">
                  <h3 className="mvh-titulo-seccion">
                    <Star size={20} />
                    Servicios e Instalaciones
                  </h3>
                  <div className="mvh-descripcion-box">
                    <p>{hospedaje.servicios_instalaciones}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Columna Derecha - Información Adicional */}
            <div className="mvh-columna-derecha">
              {/* Card de Precio Resumen */}
              <div className="mvh-card-estadistica">
                <div className="mvh-card-header">
                  <h4 className="mvh-card-titulo">Información de Precio</h4>
                  <DollarSign size={18} className="mvh-card-icono" />
                </div>
                <div className="mvh-precio-container">
                  <div className="mvh-precio-item">
                    <span className="mvh-precio-label">Precio Base</span>
                    <span className="mvh-precio-valor mvh-precio-destacado">
                      {formatearPrecio(hospedaje.precio_base, hospedaje.moneda)}
                    </span>
                  </div>
                  <div className="mvh-precio-item">
                    <span className="mvh-precio-label">Tipo de Paquete</span>
                    <span className="mvh-precio-valor">
                      {hospedaje.tipo_paquete || 'N/A'}
                    </span>
                  </div>
                  <div className="mvh-precio-item">
                    <span className="mvh-precio-label">Duración</span>
                    <span className="mvh-precio-valor">
                      {hospedaje.duracion_paquete || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Estado */}
              <div className="mvh-card-estadistica">
                <div className="mvh-card-header">
                  <h4 className="mvh-card-titulo">Estado del Servicio</h4>
                  <IconoEstado size={18} className="mvh-card-icono" />
                </div>
                <div className="mvh-precio-container">
                  <div className="mvh-precio-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IconoEstado size={20} />
                      <span className="mvh-precio-label">Estado</span>
                    </div>
                    <span className={`mvh-badge-estado ${obtenerClaseEstado(hospedaje.estado)}`}>
                      {hospedaje.estado}
                    </span>
                  </div>
                  <div className="mvh-precio-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {hospedaje.disponibilidad ? (
                        <CheckCircle size={20} color="#10b981" />
                      ) : (
                        <XCircle size={20} color="#ef4444" />
                      )}
                      <span className="mvh-precio-label">Disponibilidad</span>
                    </div>
                    <span className={`mvh-badge-disponibilidad ${hospedaje.disponibilidad ? 'disponible' : 'no-disponible'}`}>
                      {hospedaje.disponibilidad ? 'Disponible' : 'No Disponible'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Capacidad y Tipo */}
              <div className="mvh-card-estadistica">
                <div className="mvh-card-header">
                  <h4 className="mvh-card-titulo">Características</h4>
                  <Home size={18} className="mvh-card-icono" />
                </div>
                <div className="mvh-precio-container">
                  <div className="mvh-precio-item">
                    <span className="mvh-precio-label">Tipo de Hospedaje</span>
                    <span className="mvh-precio-valor">
                      {hospedaje.tipo_hospedaje || 'N/A'}
                    </span>
                  </div>
                  <div className="mvh-precio-item">
                    <span className="mvh-precio-label">Tipo de Habitación</span>
                    <span className="mvh-precio-valor">
                      {hospedaje.tipo_habitacion || 'N/A'}
                    </span>
                  </div>
                  <div className="mvh-precio-item">
                    <span className="mvh-precio-label">Capacidad</span>
                    <span className="mvh-precio-valor">
                      {hospedaje.capacidad || 'N/A'} personas
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Servicios Incluidos */}
              {incluyeArray.length > 0 && (
                <div className="mvh-card-estadistica">
                  <div className="mvh-card-header">
                    <h4 className="mvh-card-titulo">Servicios Incluidos</h4>
                    <CheckCircle size={18} className="mvh-card-icono" />
                  </div>
                  <div className="mvh-servicios-lista">
                    {incluyeArray.map((servicio, index) => (
                      <div key={index} className="mvh-servicio-item">
                        <CheckCircle size={16} />
                        <span>{servicio}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card de Instalaciones */}
              {serviciosArray.length > 0 && (
                <div className="mvh-card-estadistica">
                  <div className="mvh-card-header">
                    <h4 className="mvh-card-titulo">Instalaciones</h4>
                    <Star size={18} className="mvh-card-icono" />
                  </div>
                  <div className="mvh-servicios-lista">
                    {serviciosArray.map((servicio, index) => (
                      <div key={index} className="mvh-servicio-item">
                        <CheckCircle size={16} />
                        <span>{servicio}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mvh-footer">
          <button className="mvh-btn-cerrar-footer" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerHospedaje;