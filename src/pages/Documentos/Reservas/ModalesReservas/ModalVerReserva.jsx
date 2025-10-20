import {
  X, User, Phone, Mail, Calendar, CreditCard,
  FileText, Hash, MapPin, Globe, Award,
  UserCircle, Eye, Download, Briefcase, DollarSign,
  Home, Users
} from 'lucide-react';
import './ModalVerReserva.css';

const ModalVerReserva = ({ reserva, onCerrar }) => {

  // Función para convertir File a URL
  const obtenerUrlArchivo = (archivo) => {
    if (!archivo) return null;
    if (typeof archivo === 'string') return archivo;
    if (archivo instanceof File) return URL.createObjectURL(archivo);
    return null;
  };

  // Obtener URLs de los archivos
  const fotoUrl = obtenerUrlArchivo(reserva.foto || reserva.documentos?.foto_reserva);
  const ineUrl = obtenerUrlArchivo(reserva.ine || reserva.documentos?.foto_ine);
  const licenciaUrl = obtenerUrlArchivo(reserva.documentos?.foto_licencia);
  const comprobanteUrl = obtenerUrlArchivo(reserva.documentos?.foto_comprobante_domicilio);
  const certificacionesUrl = obtenerUrlArchivo(reserva.certificado || reserva.documentos?.foto_certificaciones);

  // Función para formatear teléfono
  const formatearTelefono = (telefono) => {
    if (!telefono) return 'N/A';
    const limpio = telefono.replace(/\D/g, '');
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(3, 6)}-${limpio.substring(6)}`;
    }
    return telefono;
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para formatear moneda
  const formatearMoneda = (cantidad) => {
    if (!cantidad) return 'N/A';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad);
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
      link.download = archivo.name || `${reserva.nombre}_${reserva.apellidoPaterno}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    if (typeof archivo === 'string') {
      const link = document.createElement('a');
      link.href = archivo;
      link.download = `${reserva.nombre}_${reserva.apellidoPaterno}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    alert('No hay documento disponible para descargar');
  };

  const tieneDocumentos = fotoUrl || ineUrl || licenciaUrl || comprobanteUrl || certificacionesUrl;

  // Procesar idiomas
  const idiomasArray = Array.isArray(reserva.idiomas)
    ? reserva.idiomas
    : (reserva.idiomas ? reserva.idiomas.split(',').map(i => i.trim()) : []);

  return (
    <div className="mvg-overlay" onClick={onCerrar}>
      <div className="mvg-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvg-header">
          <div className="mvg-header-contenido">
            <User size={28} className="mvg-icono-header" />
            <div>
              <h2>{reserva.nombre} {reserva.apellidoPaterno} {reserva.apellidoMaterno}</h2>
              <p className="mvg-subtitulo">
                Guía Turístico #{reserva.id.toString().padStart(3, '0')}
              </p>
            </div>
          </div>
          <button className="mvg-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="mvg-body">
          <div className="mvg-contenido-principal">
            {/* Columna Izquierda */}
            <div className="mvg-columna-izquierda">
              {/* Hero Card */}
              <div className="mvg-reserva-hero">
                <div className="mvg-reserva-hero-content">
                  <h3 className="mvg-reserva-titulo">
                    {reserva.nombre} {reserva.apellidoPaterno}
                  </h3>
                  <p className="mvg-reserva-subtitulo">
                    {reserva.correoElectronico || reserva.email || 'Sin correo electrónico'}
                  </p>
                  <div className="mvg-specs-grid">
                    <div className="mvg-spec-item">
                      <span className="mvg-spec-label">Edad</span>
                      <span className="mvg-spec-valor">
                        {reserva.edad || 'N/A'} años
                      </span>
                    </div>
                    <div className="mvg-spec-item">
                      <span className="mvg-spec-label">Experiencia</span>
                      <span className="mvg-spec-valor">
                        {reserva.experienciaAnos || reserva.experiencia_anos || 'N/A'} años
                      </span>
                    </div>
                    <div className="mvg-spec-item">
                      <span className="mvg-spec-label">Costo/Día</span>
                      <span className="mvg-spec-valor">
                        {formatearMoneda(reserva.costoDia || reserva.costo_dia)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Foto del Guía */}
                <div className="mvg-reserva-imagen-container">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={`${reserva.nombre} ${reserva.apellidoPaterno}`}
                      className="mvg-reserva-foto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const container = e.target.parentElement;
                        container.innerHTML = `
                          <div class="mvg-reserva-sin-foto">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Error al cargar foto</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="mvg-reserva-sin-foto">
                      <User size={48} />
                      <span>Sin fotografía</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información Personal */}
              <div className="mvg-seccion-detalles">
                <h3 className="mvg-titulo-seccion">
                  <UserCircle size={20} />
                  Información Personal
                </h3>
                <div className="mvg-detalles-grid">
                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <User size={18} />
                      </div>
                      <span className="mvg-detalle-label">Nombre Completo</span>
                    </div>
                    <span className="mvg-detalle-valor">
                      {reserva.nombre} {reserva.apellidoPaterno} {reserva.apellidoMaterno}
                    </span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvg-detalle-label">Fecha de Nacimiento</span>
                    </div>
                    <span className="mvg-detalle-valor">
                      {formatearFecha(reserva.fechaNacimiento || reserva.fecha_nacimiento)}
                    </span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvg-detalle-label">Edad</span>
                    </div>
                    <span className="mvg-detalle-valor">{reserva.edad || 'N/A'} años</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Mail size={18} />
                      </div>
                      <span className="mvg-detalle-label">Correo Electrónico</span>
                    </div>
                    <span className="mvg-detalle-valor destacado">
                      {reserva.correoElectronico || reserva.email || 'N/A'}
                    </span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <CreditCard size={18} />
                      </div>
                      <span className="mvg-detalle-label">RFC</span>
                    </div>
                    <span className="mvg-detalle-valor">{reserva.rfc || 'N/A'}</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <CreditCard size={18} />
                      </div>
                      <span className="mvg-detalle-label">CURP</span>
                    </div>
                    <span className="mvg-detalle-valor">{reserva.curp || 'N/A'}</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvg-detalle-label">NSS</span>
                    </div>
                    <span className="mvg-detalle-valor">{reserva.nss || 'N/A'}</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvg-detalle-label">ID</span>
                    </div>
                    <span className="mvg-detalle-valor">
                      #{reserva.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de Domicilio */}
              <div className="mvg-seccion-detalles">
                <h3 className="mvg-titulo-seccion">
                  <Home size={20} />
                  Domicilio
                </h3>
                <div className="mvg-detalles-grid">
                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <MapPin size={18} />
                      </div>
                      <span className="mvg-detalle-label">Dirección</span>
                    </div>
                    <span className="mvg-detalle-valor">{reserva.domicilio || 'N/A'}</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <MapPin size={18} />
                      </div>
                      <span className="mvg-detalle-label">Ciudad</span>
                    </div>
                    <span className="mvg-detalle-valor">{reserva.ciudad || 'N/A'}</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <MapPin size={18} />
                      </div>
                      <span className="mvg-detalle-label">Estado</span>
                    </div>
                    <span className="mvg-detalle-valor">{reserva.estado || 'N/A'}</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvg-detalle-label">Código Postal</span>
                    </div>
                    <span className="mvg-detalle-valor">
                      {reserva.codigoPostal || reserva.codigo_postal || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información Profesional */}
              <div className="mvg-seccion-detalles">
                <h3 className="mvg-titulo-seccion">
                  <Briefcase size={20} />
                  Información Profesional
                </h3>
                <div className="mvg-detalles-grid">
                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Award size={18} />
                      </div>
                      <span className="mvg-detalle-label">Años de Experiencia</span>
                    </div>
                    <span className="mvg-detalle-valor">
                      {reserva.experienciaAnos || reserva.experiencia_anos || 'N/A'} años
                    </span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <DollarSign size={18} />
                      </div>
                      <span className="mvg-detalle-label">Costo por Día</span>
                    </div>
                    <span className="mvg-detalle-valor destacado">
                      {formatearMoneda(reserva.costoDia || reserva.costo_dia)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Especialidades */}
              {(reserva.especialidades) && (
                <div className="mvg-seccion-detalles">
                  <h3 className="mvg-titulo-seccion">
                    <Award size={20} />
                    Especialidades
                  </h3>
                  <div className="mvg-especialidades-box">
                    <p>{reserva.especialidades}</p>
                  </div>
                </div>
              )}

              {/* Comentarios */}
              {reserva.comentarios && (
                <div className="mvg-seccion-detalles">
                  <h3 className="mvg-titulo-seccion">
                    <FileText size={20} />
                    Comentarios
                  </h3>
                  <div className="mvg-comentarios-box">
                    <p>{reserva.comentarios}</p>
                  </div>
                </div>
              )}

              {/* Documentos */}
              <div className="mvg-seccion-detalles">
                <h3 className="mvg-titulo-seccion">
                  <FileText size={20} />
                  Documentos Adjuntos
                </h3>
                <div className="mvg-documentos-grid">
                  {tieneDocumentos ? (
                    <>
                      {fotoUrl && (
                        <div className="mvg-documento-item">
                          <UserCircle size={32} />
                          <span>Fotografía</span>
                          <div className="mvg-botones-documento">
                            <button
                              className="mvg-btn-descargar mvg-btn-ver"
                              onClick={() => handleVerDocumento(reserva.foto || reserva.documentos?.foto_reserva)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar(reserva.foto || reserva.documentos?.foto_reserva, 'foto')}
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}

                      {ineUrl && (
                        <div className="mvg-documento-item">
                          <CreditCard size={32} />
                          <span>INE</span>
                          <div className="mvg-botones-documento">
                            <button
                              className="mvg-btn-descargar mvg-btn-ver"
                              onClick={() => handleVerDocumento(reserva.ine || reserva.documentos?.foto_ine)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar(reserva.ine || reserva.documentos?.foto_ine, 'ine')}
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}

                      {licenciaUrl && (
                        <div className="mvg-documento-item">
                          <CreditCard size={32} />
                          <span>Licencia de Conducir</span>
                          <div className="mvg-botones-documento">
                            <button
                              className="mvg-btn-descargar mvg-btn-ver"
                              onClick={() => handleVerDocumento(reserva.documentos?.foto_licencia)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar(reserva.documentos?.foto_licencia, 'licencia')}
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}

                      {comprobanteUrl && (
                        <div className="mvg-documento-item">
                          <FileText size={32} />
                          <span>Comprobante de Domicilio</span>
                          <div className="mvg-botones-documento">
                            <button
                              className="mvg-btn-descargar mvg-btn-ver"
                              onClick={() => handleVerDocumento(reserva.documentos?.foto_comprobante_domicilio)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar(reserva.documentos?.foto_comprobante_domicilio, 'comprobante')}
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}

                      {certificacionesUrl && (
                        <div className="mvg-documento-item">
                          <Award size={32} />
                          <span>Certificaciones</span>
                          <div className="mvg-botones-documento">
                            <button
                              className="mvg-btn-descargar mvg-btn-ver"
                              onClick={() => handleVerDocumento(reserva.certificado || reserva.documentos?.foto_certificaciones)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar(reserva.certificado || reserva.documentos?.foto_certificaciones, 'certificaciones')}
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="mvg-sin-documentos">No hay documentos adjuntos</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="mvg-columna-derecha">
              {/* Card de Teléfonos */}
              <div className="mvg-card-estadistica">
                <div className="mvg-card-header">
                  <h4 className="mvg-card-titulo">Teléfonos de Contacto</h4>
                  <Phone size={18} className="mvg-card-icono" />
                </div>
                <div className="mvg-telefonos-lista">
                  <div className="mvg-telefono-item">
                    <span className="mvg-telefono-label">Teléfono Personal</span>
                    <span className="mvg-telefono-valor">
                      <Phone size={14} />
                      {formatearTelefono(reserva.telefonoPersonal || reserva.telefono)}
                    </span>
                  </div>
                  <div className="mvg-telefono-item">
                    <span className="mvg-telefono-label">Teléfono Familiar</span>
                    <span className="mvg-telefono-valor">
                      <Phone size={14} />
                      {formatearTelefono(reserva.telefonoFamiliar || reserva.telefono_emergencia)}
                    </span>
                  </div>
                  {reserva.telefonoEmpresa && (
                    <div className="mvg-telefono-item">
                      <span className="mvg-telefono-label">Teléfono Empresa</span>
                      <span className="mvg-telefono-valor">
                        <Phone size={14} />
                        {formatearTelefono(reserva.telefonoEmpresa)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card de Contacto de Emergencia */}
              <div className="mvg-card-estadistica">
                <div className="mvg-card-header">
                  <h4 className="mvg-card-titulo">Contacto de Emergencia</h4>
                  <Users size={18} className="mvg-card-icono" />
                </div>
                <div className="mvg-experiencia-container">
                  <div className="mvg-experiencia-item">
                    <span className="mvg-experiencia-label">Nombre</span>
                    <span className="mvg-experiencia-valor">
                      {reserva.contactoEmergencia || reserva.contacto_emergencia || 'N/A'}
                    </span>
                  </div>
                  <div className="mvg-experiencia-item">
                    <span className="mvg-experiencia-label">Teléfono</span>
                    <span className="mvg-experiencia-valor">
                      {formatearTelefono(reserva.telefonoEmergencia || reserva.telefono_emergencia)}
                    </span>
                  </div>
                  {(reserva.tipoSangre || reserva.tipo_sangre) && (
                    <div className="mvg-experiencia-item">
                      <span className="mvg-experiencia-label">Tipo de Sangre</span>
                      <span className="mvg-experiencia-valor">
                        {reserva.tipoSangre || reserva.tipo_sangre}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card de Idiomas */}
              {idiomasArray.length > 0 && (
                <div className="mvg-card-estadistica">
                  <div className="mvg-card-header">
                    <h4 className="mvg-card-titulo">Idiomas</h4>
                    <Globe size={18} className="mvg-card-icono" />
                  </div>
                  <div className="mvg-idiomas-container">
                    {idiomasArray.map((idioma, idx) => (
                      <span key={idx} className="mvg-idioma-badge">
                        <Globe size={14} />
                        {idioma}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mvg-footer">
          <button className="mvg-btn-cerrar-footer" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerReserva;