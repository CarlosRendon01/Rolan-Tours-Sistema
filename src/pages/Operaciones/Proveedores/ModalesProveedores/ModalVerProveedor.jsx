import {
  X, Building2, Phone, Mail, MapPin, CreditCard,
  FileText, Hash, Briefcase, DollarSign, Eye, Download,
  User, Globe, CheckCircle
} from 'lucide-react';
import './ModalVerProveedor.css';

const ModalVerProveedor = ({ proveedor, onCerrar }) => {

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

  // Obtener URLs de los archivos
  const fotoUrl = obtenerUrlArchivo(proveedor.foto_proveedor);
  const rfcUrl = obtenerUrlArchivo(proveedor.documento_rfc);
  const identificacionUrl = obtenerUrlArchivo(proveedor.identificacion);

  // Función para formatear teléfono
  const formatearTelefono = (telefono) => {
    if (!telefono) return 'N/A';
    const limpio = telefono.replace(/\D/g, '');
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(3, 6)}-${limpio.substring(6)}`;
    }
    return telefono;
  };

  // Función para obtener clase de badge de tipo de proveedor
  const obtenerClaseTipo = (tipo) => {
    const tipos = {
      'Transporte': 'transporte',
      'Hospedaje': 'hospedaje',
      'Restaurante': 'restaurante',
      'Tour': 'tour',
      'Otro': 'otro'
    };
    return tipos[tipo] || 'otro';
  };

  // Función para obtener icono de tipo de proveedor
  const obtenerIconoTipo = (tipo) => {
    switch (tipo) {
      case 'Transporte':
        return '🚚';
      case 'Hospedaje':
        return '🏨';
      case 'Restaurante':
        return '🍽️';
      case 'Tour':
        return '📦';
      default:
        return '📦';
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
      link.download = archivo.name || `${proveedor.nombre_razon_social}_${nombreDocumento}`;
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
      link.download = `${proveedor.nombre_razon_social}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    alert('No hay documento disponible para descargar');
  };

  const tieneDocumentos = fotoUrl || rfcUrl || identificacionUrl;

  return (
    <div className="mvp-overlay" onClick={onCerrar}>
      <div className="mvp-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvp-header">
          <div className="mvp-header-contenido">
            <Building2 size={28} className="mvp-icono-header" />
            <div>
              <h2>{proveedor.nombre_razon_social}</h2>
              <p className="mvp-subtitulo">
                Proveedor #{proveedor.id.toString().padStart(3, '0')}
              </p>
            </div>
          </div>
          <button className="mvp-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="mvp-body">
          <div className="mvp-contenido-principal">
            {/* Columna Izquierda */}
            <div className="mvp-columna-izquierda">
              {/* Hero Card */}
              <div className="mvp-proveedor-hero">
                <div className="mvp-proveedor-hero-content">
                  <h3 className="mvp-proveedor-titulo">
                    {proveedor.nombre_razon_social}
                  </h3>
                  <p className="mvp-proveedor-subtitulo">
                    {proveedor.correo || 'Sin correo electrónico'}
                  </p>
                  <div className="mvp-specs-grid">
                    <div className="mvp-spec-item">
                      <span className="mvp-spec-label">Tipo</span>
                      <span className="mvp-spec-valor">
                        {obtenerIconoTipo(proveedor.tipo_proveedor)} {proveedor.tipo_proveedor}
                      </span>
                    </div>
                    <div className="mvp-spec-item">
                      <span className="mvp-spec-label">RFC</span>
                      <span className="mvp-spec-valor">{proveedor.rfc || 'N/A'}</span>
                    </div>
                    <div className="mvp-spec-item">
                      <span className="mvp-spec-label">Estado</span>
                      <span className="mvp-spec-valor">
                        {proveedor.activo ? '✓ Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Foto del Proveedor */}
                <div className="mvp-proveedor-imagen-container">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={proveedor.nombre_razon_social}
                      className="mvp-proveedor-foto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const container = e.target.parentElement;
                        container.innerHTML = `
                          <div class="mvp-proveedor-sin-foto">
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
                    <div className="mvp-proveedor-sin-foto">
                      <Building2 size={48} />
                      <span>Sin imagen</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información General */}
              <div className="mvp-seccion-detalles">
                <h3 className="mvp-titulo-seccion">
                  <Building2 size={20} />
                  Información General
                </h3>
                <div className="mvp-detalles-grid">
                  <div className="mvp-detalle-item">
                    <div className="mvp-detalle-header">
                      <div className="mvp-detalle-icono">
                        <Building2 size={18} />
                      </div>
                      <span className="mvp-detalle-label">Razón Social</span>
                    </div>
                    <span className="mvp-detalle-valor">{proveedor.nombre_razon_social || 'N/A'}</span>
                  </div>

                  <div className="mvp-detalle-item">
                    <div className="mvp-detalle-header">
                      <div className="mvp-detalle-icono">
                        <Briefcase size={18} />
                      </div>
                      <span className="mvp-detalle-label">Tipo de Proveedor</span>
                    </div>
                    <span className={`mvp-badge-tipo ${obtenerClaseTipo(proveedor.tipo_proveedor)}`}>
                      {obtenerIconoTipo(proveedor.tipo_proveedor)} {proveedor.tipo_proveedor}
                    </span>
                  </div>

                  <div className="mvp-detalle-item">
                    <div className="mvp-detalle-header">
                      <div className="mvp-detalle-icono">
                        <CreditCard size={18} />
                      </div>
                      <span className="mvp-detalle-label">RFC</span>
                    </div>
                    <span className="mvp-detalle-valor destacado">{proveedor.rfc || 'N/A'}</span>
                  </div>

                  <div className="mvp-detalle-item">
                    <div className="mvp-detalle-header">
                      <div className="mvp-detalle-icono">
                        <DollarSign size={18} />
                      </div>
                      <span className="mvp-detalle-label">Método de Pago</span>
                    </div>
                    <span className="mvp-detalle-valor">{proveedor.metodo_pago || 'N/A'}</span>
                  </div>

                  <div className="mvp-detalle-item">
                    <div className="mvp-detalle-header">
                      <div className="mvp-detalle-icono">
                        <User size={18} />
                      </div>
                      <span className="mvp-detalle-label">Contacto</span>
                    </div>
                    <span className="mvp-detalle-valor">{proveedor.nombre_contacto || 'N/A'}</span>
                  </div>

                  <div className="mvp-detalle-item">
                    <div className="mvp-detalle-header">
                      <div className="mvp-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvp-detalle-label">ID</span>
                    </div>
                    <span className="mvp-detalle-valor">
                      #{proveedor.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Descripción del Servicio */}
              {proveedor.descripcion_servicio && (
                <div className="mvp-seccion-detalles">
                  <h3 className="mvp-titulo-seccion">
                    <FileText size={20} />
                    Descripción del Servicio
                  </h3>
                  <div className="mvp-descripcion-box">
                    <p>{proveedor.descripcion_servicio}</p>
                  </div>
                </div>
              )}

              {/* Documentos */}
              <div className="mvp-seccion-detalles">
                <h3 className="mvp-titulo-seccion">
                  <FileText size={20} />
                  Documentos Adjuntos
                </h3>
                <div className="mvp-documentos-grid">
                  {tieneDocumentos ? (
                    <>
                      {fotoUrl && (
                        <div className="mvp-documento-item">
                          <Building2 size={32} />
                          <span>Fotografía</span>
                          <div className="mvp-botones-documento">
                            <button
                              className="mvp-btn-descargar mvp-btn-ver"
                              onClick={() => handleVerDocumento(proveedor.foto_proveedor)}
                              title="Ver fotografía en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvp-btn-descargar mvp-btn-download"
                              onClick={() => handleDescargar(proveedor.foto_proveedor, 'foto')}
                              title="Descargar fotografía"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}

                      {rfcUrl && (
                        <div className="mvp-documento-item">
                          <CreditCard size={32} />
                          <span>RFC</span>
                          <div className="mvp-botones-documento">
                            <button
                              className="mvp-btn-descargar mvp-btn-ver"
                              onClick={() => handleVerDocumento(proveedor.documento_rfc)}
                              title="Ver RFC en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvp-btn-descargar mvp-btn-download"
                              onClick={() => handleDescargar(proveedor.documento_rfc, 'rfc')}
                              title="Descargar RFC"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}

                      {identificacionUrl && (
                        <div className="mvp-documento-item">
                          <User size={32} />
                          <span>Identificación</span>
                          <div className="mvp-botones-documento">
                            <button
                              className="mvp-btn-descargar mvp-btn-ver"
                              onClick={() => handleVerDocumento(proveedor.identificacion)}
                              title="Ver identificación en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvp-btn-descargar mvp-btn-download"
                              onClick={() => handleDescargar(proveedor.identificacion, 'identificacion')}
                              title="Descargar identificación"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="mvp-sin-documentos">No hay documentos adjuntos</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Información de Contacto */}
            <div className="mvp-columna-derecha">
              {/* Card de Contacto */}
              <div className="mvp-card-estadistica">
                <div className="mvp-card-header">
                  <h4 className="mvp-card-titulo">Información de Contacto</h4>
                  <Phone size={18} className="mvp-card-icono" />
                </div>
                <div className="mvp-contacto-lista">
                  <div className="mvp-contacto-item">
                    <span className="mvp-contacto-label">Nombre</span>
                    <span className="mvp-contacto-valor">
                      <User size={14} />
                      {proveedor.nombre_contacto || 'N/A'}
                    </span>
                  </div>
                  <div className="mvp-contacto-item">
                    <span className="mvp-contacto-label">Teléfono</span>
                    <span className="mvp-contacto-valor">
                      <Phone size={14} />
                      {formatearTelefono(proveedor.telefono)}
                    </span>
                  </div>
                  <div className="mvp-contacto-item">
                    <span className="mvp-contacto-label">Correo</span>
                    <span className="mvp-contacto-valor">
                      <Mail size={14} />
                      {proveedor.correo || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Dirección */}
              <div className="mvp-card-estadistica">
                <div className="mvp-card-header">
                  <h4 className="mvp-card-titulo">Dirección</h4>
                  <MapPin size={18} className="mvp-card-icono" />
                </div>
                <div className="mvp-direccion-container">
                  <div className="mvp-direccion-item">
                    <span className="mvp-direccion-label">Calle</span>
                    <span className="mvp-direccion-valor">
                      {proveedor.direccion || 'N/A'}
                    </span>
                  </div>
                  <div className="mvp-direccion-item">
                    <span className="mvp-direccion-label">Ciudad</span>
                    <span className="mvp-direccion-valor">
                      {proveedor.ciudad || 'N/A'}
                    </span>
                  </div>
                  <div className="mvp-direccion-item">
                    <span className="mvp-direccion-label">Estado</span>
                    <span className="mvp-direccion-valor">
                      {proveedor.entidad_federativa || 'N/A'}
                    </span>
                  </div>
                  <div className="mvp-direccion-item">
                    <span className="mvp-direccion-label">País</span>
                    <span className="mvp-direccion-valor">
                      <Globe size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      {proveedor.pais || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Estado */}
              <div className="mvp-card-estadistica">
                <div className="mvp-card-header">
                  <h4 className="mvp-card-titulo">Estado del Proveedor</h4>
                  <CheckCircle size={18} className="mvp-card-icono" />
                </div>
                <div className="mvp-direccion-container">
                  <div className="mvp-direccion-item" style={{
                    background: proveedor.activo ? '#dcfce7' : '#fee2e2',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: proveedor.activo ? '#166534' : '#991b1b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {proveedor.activo ? '✓ Activo' : '✗ Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mvp-footer">
          <button className="mvp-btn-cerrar-footer" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerProveedor;