import { 
  X, User, Phone, Mail, Calendar, CreditCard, 
  FileText, Hash, Shield, MapPin, DollarSign,
  UserCircle, CheckCircle, XCircle, Eye, Download,
  Briefcase, Globe, Award, Home, Building2
} from 'lucide-react';
import './ModalVerCoordinador.css';

const ModalVerCoordinador = ({ coordinador, onCerrar }) => {
  
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
  const fotoUrl = obtenerUrlArchivo(coordinador.foto_coordinador);
  const ineUrl = obtenerUrlArchivo(coordinador.foto_ine);
  const certificacionesUrl = obtenerUrlArchivo(coordinador.foto_certificaciones);
  const comprobanteUrl = obtenerUrlArchivo(coordinador.foto_comprobante_domicilio);
  const contratoUrl = obtenerUrlArchivo(coordinador.contrato_laboral);
  
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

  // Función para calcular edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Función para formatear moneda
  const formatearMoneda = (cantidad) => {
    if (!cantidad && cantidad !== 0) return 'N/A';
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
      link.download = archivo.name || `${coordinador.nombre}_${coordinador.apellido_paterno}_${nombreDocumento}`;
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
      link.download = `${coordinador.nombre}_${coordinador.apellido_paterno}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    alert('No hay documento disponible para descargar');
  };

  const tieneDocumentos = fotoUrl || ineUrl || certificacionesUrl || comprobanteUrl || contratoUrl;
  const edad = calcularEdad(coordinador.fecha_nacimiento);

  return (
    <div className="mvc-overlay" onClick={onCerrar}>
      <div className="mvc-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvc-header">
          <div className="mvc-header-contenido">
            <Briefcase size={28} className="mvc-icono-header" />
            <div>
              <h2>{coordinador.nombre} {coordinador.apellido_paterno} {coordinador.apellido_materno}</h2>
              <p className="mvc-subtitulo">
                Coordinador #{coordinador.id.toString().padStart(3, '0')}
              </p>
            </div>
          </div>
          <button className="mvc-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="mvc-body">
          <div className="mvc-contenido-principal">
            {/* Columna Izquierda */}
            <div className="mvc-columna-izquierda">
              {/* Hero Card */}
              <div className="mvc-coordinador-hero">
                <div className="mvc-coordinador-hero-content">
                  <h3 className="mvc-coordinador-titulo">
                    {coordinador.nombre} {coordinador.apellido_paterno}
                  </h3>
                  <p className="mvc-coordinador-subtitulo">
                    {coordinador.email || 'Sin correo electrónico'}
                  </p>
                  <div className="mvc-specs-grid">
                    <div className="mvc-spec-item">
                      <span className="mvc-spec-label">Edad</span>
                      <span className="mvc-spec-valor">
                        {edad} años
                      </span>
                    </div>
                    <div className="mvc-spec-item">
                      <span className="mvc-spec-label">Experiencia</span>
                      <span className="mvc-spec-valor">{coordinador.experiencia_anos || 0} años</span>
                    </div>
                    <div className="mvc-spec-item">
                      <span className="mvc-spec-label">Certificación</span>
                      <span className="mvc-spec-valor">
                        {coordinador.certificacion_oficial ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Foto del Coordinador */}
                <div className="mvc-coordinador-imagen-container">
                  {fotoUrl ? (
                    <img 
                      src={fotoUrl} 
                      alt={`${coordinador.nombre} ${coordinador.apellido_paterno}`}
                      className="mvc-coordinador-foto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const container = e.target.parentElement;
                        container.innerHTML = `
                          <div class="mvc-coordinador-sin-foto">
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
                    <div className="mvc-coordinador-sin-foto">
                      <User size={48} />
                      <span>Sin fotografía</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información Personal */}
              <div className="mvc-seccion-detalles">
                <h3 className="mvc-titulo-seccion">
                  <UserCircle size={20} />
                  Información Personal
                </h3>
                <div className="mvc-detalles-grid">
                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <User size={18} />
                      </div>
                      <span className="mvc-detalle-label">Nombre Completo</span>
                    </div>
                    <span className="mvc-detalle-valor">
                      {coordinador.nombre} {coordinador.apellido_paterno} {coordinador.apellido_materno}
                    </span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvc-detalle-label">Fecha de Nacimiento</span>
                    </div>
                    <span className="mvc-detalle-valor">{formatearFecha(coordinador.fecha_nacimiento)}</span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvc-detalle-label">Edad</span>
                    </div>
                    <span className="mvc-detalle-valor">{edad} años</span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <Mail size={18} />
                      </div>
                      <span className="mvc-detalle-label">Correo Electrónico</span>
                    </div>
                    <span className="mvc-detalle-valor destacado">
                      {coordinador.email || 'N/A'}
                    </span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <MapPin size={18} />
                      </div>
                      <span className="mvc-detalle-label">Ciudad</span>
                    </div>
                    <span className="mvc-detalle-valor">{coordinador.ciudad || 'N/A'}</span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <MapPin size={18} />
                      </div>
                      <span className="mvc-detalle-label">Estado</span>
                    </div>
                    <span className="mvc-detalle-valor">{coordinador.estado || 'N/A'}</span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvc-detalle-label">ID</span>
                    </div>
                    <span className="mvc-detalle-valor">
                      #{coordinador.id.toString().padStart(3, '0')}
                    </span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <CreditCard size={18} />
                      </div>
                      <span className="mvc-detalle-label">NSS</span>
                    </div>
                    <span className="mvc-detalle-valor">{coordinador.nss || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Información Profesional */}
              <div className="mvc-seccion-detalles">
                <h3 className="mvc-titulo-seccion">
                  <Briefcase size={20} />
                  Información Profesional
                </h3>
                <div className="mvc-detalles-grid">
                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <Award size={18} />
                      </div>
                      <span className="mvc-detalle-label">Años de Experiencia</span>
                    </div>
                    <span className="mvc-detalle-valor">{coordinador.experiencia_anos || 0} años</span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <Globe size={18} />
                      </div>
                      <span className="mvc-detalle-label">Idiomas</span>
                    </div>
                    <span className="mvc-detalle-valor">{coordinador.idiomas || 'N/A'}</span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <Shield size={18} />
                      </div>
                      <span className="mvc-detalle-label">Certificación Oficial</span>
                    </div>
                    <span className={`mvc-badge-certificacion ${coordinador.certificacion_oficial ? 'certificado' : 'no-certificado'}`}>
                      {coordinador.certificacion_oficial ? (
                        <>
                          <CheckCircle size={16} />
                          Certificado
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          No Certificado
                        </>
                      )}
                    </span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <FileText size={18} />
                      </div>
                      <span className="mvc-detalle-label">Especialidades</span>
                    </div>
                    <span className="mvc-detalle-valor">{coordinador.especialidades || 'N/A'}</span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <Building2 size={18} />
                      </div>
                      <span className="mvc-detalle-label">Institución de Seguro</span>
                    </div>
                    <span className="mvc-detalle-valor">{coordinador.institucion_seguro || 'N/A'}</span>
                  </div>

                  <div className="mvc-detalle-item">
                    <div className="mvc-detalle-header">
                      <div className="mvc-detalle-icono">
                        <DollarSign size={18} />
                      </div>
                      <span className="mvc-detalle-label">Costo por Día</span>
                    </div>
                    <span className="mvc-detalle-valor destacado">
                      {formatearMoneda(coordinador.costo_dia)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comentarios */}
              {coordinador.comentarios && (
                <div className="mvc-seccion-detalles">
                  <h3 className="mvc-titulo-seccion">
                    <FileText size={20} />
                    Comentarios
                  </h3>
                  <div className="mvc-comentarios-box">
                    <p>{coordinador.comentarios}</p>
                  </div>
                </div>
              )}

              {/* Documentos */}
              <div className="mvc-seccion-detalles">
                <h3 className="mvc-titulo-seccion">
                  <FileText size={20} />
                  Documentos Adjuntos
                </h3>
                <div className="mvc-documentos-grid">
                  {tieneDocumentos ? (
                    <>
                      {fotoUrl && (
                        <div className="mvc-documento-item">
                          <UserCircle size={32} />
                          <span>Fotografía</span>
                          <div className="mvc-botones-documento">
                            <button 
                              className="mvc-btn-descargar mvc-btn-ver"
                              onClick={() => handleVerDocumento(coordinador.foto_coordinador)}
                              title="Ver fotografía en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button 
                              className="mvc-btn-descargar mvc-btn-download"
                              onClick={() => handleDescargar(coordinador.foto_coordinador, 'foto')}
                              title="Descargar fotografía"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {ineUrl && (
                        <div className="mvc-documento-item">
                          <CreditCard size={32} />
                          <span>INE</span>
                          <div className="mvc-botones-documento">
                            <button 
                              className="mvc-btn-descargar mvc-btn-ver"
                              onClick={() => handleVerDocumento(coordinador.foto_ine)}
                              title="Ver INE en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button 
                              className="mvc-btn-descargar mvc-btn-download"
                              onClick={() => handleDescargar(coordinador.foto_ine, 'ine')}
                              title="Descargar INE"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}

                      {certificacionesUrl && (
                        <div className="mvc-documento-item">
                          <Award size={32} />
                          <span>Certificaciones</span>
                          <div className="mvc-botones-documento">
                            <button 
                              className="mvc-btn-descargar mvc-btn-ver"
                              onClick={() => handleVerDocumento(coordinador.foto_certificaciones)}
                              title="Ver certificaciones en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button 
                              className="mvc-btn-descargar mvc-btn-download"
                              onClick={() => handleDescargar(coordinador.foto_certificaciones, 'certificaciones')}
                              title="Descargar certificaciones"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}

                      {comprobanteUrl && (
                        <div className="mvc-documento-item">
                          <Home size={32} />
                          <span>Comprobante de Domicilio</span>
                          <div className="mvc-botones-documento">
                            <button 
                              className="mvc-btn-descargar mvc-btn-ver"
                              onClick={() => handleVerDocumento(coordinador.foto_comprobante_domicilio)}
                              title="Ver comprobante en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button 
                              className="mvc-btn-descargar mvc-btn-download"
                              onClick={() => handleDescargar(coordinador.foto_comprobante_domicilio, 'comprobante_domicilio')}
                              title="Descargar comprobante"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}

                      {contratoUrl && (
                        <div className="mvc-documento-item">
                          <FileText size={32} />
                          <span>Contrato Laboral</span>
                          <div className="mvc-botones-documento">
                            <button 
                              className="mvc-btn-descargar mvc-btn-ver"
                              onClick={() => handleVerDocumento(coordinador.contrato_laboral)}
                              title="Ver contrato en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button 
                              className="mvc-btn-descargar mvc-btn-download"
                              onClick={() => handleDescargar(coordinador.contrato_laboral, 'contrato')}
                              title="Descargar contrato"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="mvc-sin-documentos">No hay documentos adjuntos</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Información de Contacto */}
            <div className="mvc-columna-derecha">
              {/* Card de Teléfonos */}
              <div className="mvc-card-estadistica">
                <div className="mvc-card-header">
                  <h4 className="mvc-card-titulo">Teléfonos de Contacto</h4>
                  <Phone size={18} className="mvc-card-icono" />
                </div>
                <div className="mvc-telefonos-lista">
                  <div className="mvc-telefono-item">
                    <span className="mvc-telefono-label">Teléfono Personal</span>
                    <span className="mvc-telefono-valor">
                      <Phone size={14} />
                      {formatearTelefono(coordinador.telefono)}
                    </span>
                  </div>
                  <div className="mvc-telefono-item">
                    <span className="mvc-telefono-label">Teléfono Emergencia</span>
                    <span className="mvc-telefono-valor">
                      <Phone size={14} />
                      {formatearTelefono(coordinador.telefono_emergencia)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Contacto de Emergencia */}
              <div className="mvc-card-estadistica">
                <div className="mvc-card-header">
                  <h4 className="mvc-card-titulo">Contacto de Emergencia</h4>
                  <Shield size={18} className="mvc-card-icono" />
                </div>
                <div className="mvc-costo-container">
                  <div className="mvc-costo-item">
                    <span className="mvc-costo-label">Nombre</span>
                    <span className="mvc-telefono-valor" style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {coordinador.contacto_emergencia || 'N/A'}
                    </span>
                  </div>
                  <div className="mvc-costo-item">
                    <span className="mvc-costo-label">Teléfono</span>
                    <span className="mvc-telefono-valor">
                      <Phone size={14} />
                      {formatearTelefono(coordinador.telefono_emergencia)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Información Económica */}
              <div className="mvc-card-estadistica">
                <div className="mvc-card-header">
                  <h4 className="mvc-card-titulo">Información Económica</h4>
                  <DollarSign size={18} className="mvc-card-icono" />
                </div>
                <div className="mvc-costo-container">
                  <div className="mvc-costo-item">
                    <span className="mvc-costo-label">Costo por Día</span>
                    <span className="mvc-costo-valor">
                      {formatearMoneda(coordinador.costo_dia)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mvc-footer">
          <button className="mvc-btn-cerrar-footer" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerCoordinador;