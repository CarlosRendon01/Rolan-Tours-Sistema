import {
  X, MapPin, DollarSign, Users, Calendar, Hash,
  Building, Package, CheckCircle, XCircle,
  AlertCircle, Image as ImageIcon, Clock,
  FileText, Info, Compass, Route, Globe, Shield
} from 'lucide-react';
import './ModalVerTours.css';

const ModalVerTours = ({ tour, onCerrar }) => {

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

  const fotoUrl = obtenerUrlArchivo(tour.foto_tour);

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
    const estadosLowerCase = estado?.toLowerCase() || '';
    if (estadosLowerCase.includes('activo')) return 'activo';
    if (estadosLowerCase.includes('inactivo')) return 'inactivo';
    if (estadosLowerCase.includes('mantenimiento')) return 'mantenimiento';
    return 'activo';
  };

  // Función para obtener clase de dificultad
  const obtenerClaseDificultad = (dificultad) => {
    const dificultadLowerCase = dificultad?.toLowerCase() || '';
    if (dificultadLowerCase.includes('fácil') || dificultadLowerCase.includes('facil') || dificultadLowerCase.includes('bajo')) return 'facil';
    if (dificultadLowerCase.includes('moderado') || dificultadLowerCase.includes('medio')) return 'moderado';
    if (dificultadLowerCase.includes('difícil') || dificultadLowerCase.includes('dificil') || dificultadLowerCase.includes('alto')) return 'dificil';
    if (dificultadLowerCase.includes('extremo')) return 'extremo';
    return 'moderado';
  };

  // Función para obtener icono de estado
  const obtenerIconoEstado = (estado) => {
    const estadosLowerCase = estado?.toLowerCase() || '';
    if (estadosLowerCase.includes('activo')) return CheckCircle;
    if (estadosLowerCase.includes('inactivo')) return XCircle;
    if (estadosLowerCase.includes('mantenimiento')) return AlertCircle;
    return CheckCircle;
  };

  const IconoEstado = obtenerIconoEstado(tour.estado);

  // Dividir servicios por comas
  const incluyeArray = tour.incluye
    ? tour.incluye.split(',').map(s => s.trim()).filter(s => s)
    : [];

  const noIncluyeArray = tour.no_incluye
    ? tour.no_incluye.split(',').map(s => s.trim()).filter(s => s)
    : [];

  return (
    <div className="mvt-overlay" onClick={onCerrar}>
      <div className="mvt-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvt-header">
          <div className="mvt-header-contenido">
            <MapPin size={28} className="mvt-icono-header" />
            <div>
              <h2>{tour.nombre_tour}</h2>
              <p className="mvt-subtitulo">
                {tour.codigo_tour}
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
              <div className="mvt-tour-hero">
                <div className="mvt-tour-hero-content">
                  <h3 className="mvt-tour-titulo">
                    {tour.nombre_tour}
                  </h3>
                  <p className="mvt-tour-subtitulo">
                    {tour.tipo_tour} - {tour.duracion_tour}
                  </p>
                  <div className="mvt-specs-grid">
                    <div className="mvt-spec-item">
                      <span className="mvt-spec-label">Capacidad</span>
                      <span className="mvt-spec-valor">
                        {tour.capacidad_maxima || 'N/A'} personas
                      </span>
                    </div>
                    <div className="mvt-spec-item">
                      <span className="mvt-spec-label">Precio</span>
                      <span className="mvt-spec-valor">
                        {formatearPrecio(tour.precio_base, tour.moneda)}
                      </span>
                    </div>
                    <div className="mvt-spec-item">
                      <span className="mvt-spec-label">Nivel</span>
                      <span className="mvt-spec-valor">
                        {tour.nivel_dificultad}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Foto del Tour */}
                <div className="mvt-tour-imagen-container">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={tour.nombre_tour}
                      className="mvt-tour-foto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const container = e.target.parentElement;
                        container.innerHTML = `
                          <div class="mvt-tour-sin-foto">
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
                    <div className="mvt-tour-sin-foto">
                      <ImageIcon size={48} />
                      <span>Sin fotografía</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información General */}
              <div className="mvt-seccion-detalles">
                <h3 className="mvt-titulo-seccion">
                  <MapPin size={20} />
                  Datos Generales del Tour
                </h3>
                <div className="mvt-detalles-grid">
                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvt-detalle-label">Código del Tour</span>
                    </div>
                    <span className="mvt-detalle-valor destacado">{tour.codigo_tour || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <FileText size={18} />
                      </div>
                      <span className="mvt-detalle-label">Tipo de Tour</span>
                    </div>
                    <span className="mvt-detalle-valor">{tour.tipo_tour || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Clock size={18} />
                      </div>
                      <span className="mvt-detalle-label">Duración</span>
                    </div>
                    <span className="mvt-detalle-valor">{tour.duracion_tour || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Users size={18} />
                      </div>
                      <span className="mvt-detalle-label">Capacidad Máxima</span>
                    </div>
                    <span className="mvt-detalle-valor">{tour.capacidad_maxima || 'N/A'} personas</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Compass size={18} />
                      </div>
                      <span className="mvt-detalle-label">Nivel de Dificultad</span>
                    </div>
                    <span className={`mvt-badge-dificultad ${obtenerClaseDificultad(tour.nivel_dificultad)}`}>
                      {tour.nivel_dificultad || 'N/A'}
                    </span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvt-detalle-label">Disponibilidad</span>
                    </div>
                    <span className="mvt-detalle-valor">{tour.disponibilidad || 'N/A'}</span>
                  </div>

                  {tour.punto_partida && (
                    <div className="mvt-detalle-item">
                      <div className="mvt-detalle-header">
                        <div className="mvt-detalle-icono">
                          <MapPin size={18} />
                        </div>
                        <span className="mvt-detalle-label">Punto de Partida</span>
                      </div>
                      <span className="mvt-detalle-valor">{tour.punto_partida}</span>
                    </div>
                  )}

                  {tour.punto_llegada && (
                    <div className="mvt-detalle-item">
                      <div className="mvt-detalle-header">
                        <div className="mvt-detalle-icono">
                          <Route size={18} />
                        </div>
                        <span className="mvt-detalle-label">Punto de Llegada</span>
                      </div>
                      <span className="mvt-detalle-valor">{tour.punto_llegada}</span>
                    </div>
                  )}

                  {tour.hora_salida && (
                    <div className="mvt-detalle-item">
                      <div className="mvt-detalle-header">
                        <div className="mvt-detalle-icono">
                          <Clock size={18} />
                        </div>
                        <span className="mvt-detalle-label">Hora de Salida</span>
                      </div>
                      <span className="mvt-detalle-valor">{tour.hora_salida}</span>
                    </div>
                  )}

                  {tour.hora_regreso && (
                    <div className="mvt-detalle-item">
                      <div className="mvt-detalle-header">
                        <div className="mvt-detalle-icono">
                          <Clock size={18} />
                        </div>
                        <span className="mvt-detalle-label">Hora de Regreso</span>
                      </div>
                      <span className="mvt-detalle-valor">{tour.hora_regreso}</span>
                    </div>
                  )}

                  {tour.idiomas_disponibles && tour.idiomas_disponibles.length > 0 && (
                    <div className="mvt-detalle-item mvt-detalle-full">
                      <div className="mvt-detalle-header">
                        <div className="mvt-detalle-icono">
                          <Globe size={18} />
                        </div>
                        <span className="mvt-detalle-label">Idiomas Disponibles</span>
                      </div>
                      <div className="mvt-idiomas-lista">
                        {tour.idiomas_disponibles.map((idioma, index) => (
                          <span key={index} className="mvt-idioma-badge">{idioma}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {tour.descripcion_tour && (
                    <div className="mvt-detalle-item mvt-detalle-full">
                      <div className="mvt-detalle-header">
                        <div className="mvt-detalle-icono">
                          <FileText size={18} />
                        </div>
                        <span className="mvt-detalle-label">Descripción del Tour</span>
                      </div>
                      <div className="mvt-descripcion-box">
                        <div>{tour.descripcion_tour}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Proveedor */}
              <div className="mvt-seccion-detalles">
                <h3 className="mvt-titulo-seccion">
                  <Building size={20} />
                  Información del Proveedor
                </h3>
                <div className="mvt-detalles-grid">
                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Building size={18} />
                      </div>
                      <span className="mvt-detalle-label">Operado Por</span>
                    </div>
                    <span className="mvt-detalle-valor">{tour.operado_por || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Building size={18} />
                      </div>
                      <span className="mvt-detalle-label">Empresa Proveedora</span>
                    </div>
                    <span className="mvt-detalle-valor">{tour.nombre_proveedor || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Users size={18} />
                      </div>
                      <span className="mvt-detalle-label">Guía Principal</span>
                    </div>
                    <span className="mvt-detalle-valor">{tour.guia_principal || 'N/A'}</span>
                  </div>

                  <div className="mvt-detalle-item">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <Info size={18} />
                      </div>
                      <span className="mvt-detalle-label">Contacto</span>
                    </div>
                    <span className="mvt-detalle-valor">{tour.contacto_proveedor || 'N/A'}</span>
                  </div>

                  {tour.numero_licencia_guia && (
                    <div className="mvt-detalle-item">
                      <div className="mvt-detalle-header">
                        <div className="mvt-detalle-icono">
                          <FileText size={18} />
                        </div>
                        <span className="mvt-detalle-label">Licencia del Guía</span>
                      </div>
                      <span className="mvt-detalle-valor">{tour.numero_licencia_guia}</span>
                    </div>
                  )}

                  <div className="mvt-detalle-item mvt-detalle-full">
                    <div className="mvt-detalle-header">
                      <div className="mvt-detalle-icono">
                        <MapPin size={18} />
                      </div>
                      <span className="mvt-detalle-label">Ubicación de Salida</span>
                    </div>
                    <span className="mvt-detalle-valor">{tour.ubicacion_salida || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Información Adicional */}
            <div className="mvt-columna-derecha">
              {/* Card de Precio Resumen */}
              <div className="mvt-card-estadistica">
                <div className="mvt-card-header">
                  <h4 className="mvt-card-titulo">Información de Precio</h4>
                  <DollarSign size={18} className="mvt-card-icono" />
                </div>
                <div className="mvt-precio-container">
                  <div className="mvt-precio-item">
                    <span className="mvt-precio-label">Precio Base</span>
                    <span className="mvt-precio-valor mvt-precio-destacado">
                      {formatearPrecio(tour.precio_base, tour.moneda)}
                    </span>
                  </div>
                  <div className="mvt-precio-item">
                    <span className="mvt-precio-label">Tipo de Paquete</span>
                    <span className="mvt-precio-valor">
                      {tour.tipo_paquete || 'N/A'}
                    </span>
                  </div>
                  {tour.costo_por_nino && (
                    <div className="mvt-precio-item">
                      <span className="mvt-precio-label">Precio Niños</span>
                      <span className="mvt-precio-valor">
                        {formatearPrecio(tour.costo_por_nino, tour.moneda)}
                      </span>
                    </div>
                  )}
                  {tour.costo_por_adulto_mayor && (
                    <div className="mvt-precio-item">
                      <span className="mvt-precio-label">Precio Adultos Mayores</span>
                      <span className="mvt-precio-valor">
                        {formatearPrecio(tour.costo_por_adulto_mayor, tour.moneda)}
                      </span>
                    </div>
                  )}
                  {tour.temporada && (
                    <div className="mvt-precio-item">
                      <span className="mvt-precio-label">Temporada</span>
                      <span className="mvt-precio-valor">
                        {tour.temporada}
                      </span>
                    </div>
                  )}
                  <div className="mvt-precio-item">
                    <span className="mvt-precio-label">IVA Incluido</span>
                    <span className="mvt-precio-valor">
                      {tour.iva_incluido ? 'Sí' : 'No'}
                    </span>
                  </div>
                  {tour.descuento_disponible && (
                    <div className="mvt-precio-item">
                      <span className="mvt-precio-label">Descuento</span>
                      <span className="mvt-precio-valor" style={{ color: '#10b981' }}>
                        Disponible
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card de Estado */}
              <div className="mvt-card-estadistica">
                <div className="mvt-card-header">
                  <h4 className="mvt-card-titulo">Estado del Tour</h4>
                  <IconoEstado size={18} className="mvt-card-icono" />
                </div>
                <div className="mvt-precio-container">
                  <div className="mvt-precio-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IconoEstado size={20} />
                      <span className="mvt-precio-label">Estado</span>
                    </div>
                    <span className={`mvt-badge-estado ${obtenerClaseEstado(tour.estado)}`}>
                      {tour.estado}
                    </span>
                  </div>
                  <div className="mvt-precio-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {tour.transporte_incluido ? (
                        <CheckCircle size={20} color="#10b981" />
                      ) : (
                        <XCircle size={20} color="#ef4444" />
                      )}
                      <span className="mvt-precio-label">Transporte</span>
                    </div>
                    <span className="mvt-precio-valor">
                      {tour.transporte_incluido ? 'Incluido' : 'No Incluido'}
                    </span>
                  </div>
                  <div className="mvt-precio-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {tour.seguro_incluido ? (
                        <Shield size={20} color="#10b981" />
                      ) : (
                        <XCircle size={20} color="#ef4444" />
                      )}
                      <span className="mvt-precio-label">Seguro</span>
                    </div>
                    <span className="mvt-precio-valor">
                      {tour.seguro_incluido ? 'Incluido' : 'No Incluido'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Servicios Incluidos */}
              {incluyeArray.length > 0 && (
                <div className="mvt-card-estadistica">
                  <div className="mvt-card-header">
                    <h4 className="mvt-card-titulo">¿Qué Incluye?</h4>
                    <CheckCircle size={18} className="mvt-card-icono" />
                  </div>
                  <div className="mvt-servicios-lista">
                    {incluyeArray.map((servicio, index) => (
                      <div key={index} className="mvt-servicio-item">
                        <CheckCircle size={16} />
                        <span>{servicio}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card de No Incluye */}
              {noIncluyeArray.length > 0 && (
                <div className="mvt-card-estadistica">
                  <div className="mvt-card-header">
                    <h4 className="mvt-card-titulo">¿Qué No Incluye?</h4>
                    <XCircle size={18} className="mvt-card-icono" />
                  </div>
                  <div className="mvt-servicios-lista">
                    {noIncluyeArray.map((servicio, index) => (
                      <div key={index} className="mvt-servicio-item">
                        <XCircle size={16} color="#ef4444" />
                        <span>{servicio}</span>
                      </div>
                    ))}
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

export default ModalVerTours;