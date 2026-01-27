import {
  X, User, Phone, Mail, Calendar, CreditCard,
  FileText, Hash, MapPin, Globe, Award,
  UserCircle, Eye, Download, Briefcase, DollarSign,
  Home, Users
} from 'lucide-react';
import './ModalVerGuia.css';
import { API_CONFIG } from '../../../../config/api';

const ModalVerGuia = ({ guia, onCerrar }) => {

  const obtenerUrlArchivo = (archivo) => {
    if (!archivo) return null;
    if (typeof archivo === 'string') return archivo;
    if (archivo instanceof File) return URL.createObjectURL(archivo);
    return null;
  };

  const fotoUrl = obtenerUrlArchivo(guia.foto || guia.documentos?.foto_guia);
  const ineUrl = obtenerUrlArchivo(guia.ine || guia.documentos?.foto_ine);
  const licenciaUrl = obtenerUrlArchivo(guia.documentos?.foto_licencia);
  const comprobanteUrl = obtenerUrlArchivo(guia.documentos?.foto_comprobante_domicilio);
  const certificacionesUrl = obtenerUrlArchivo(guia.certificado || guia.documentos?.foto_certificaciones);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '-';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const formatearTelefono = (telefono) => {
    if (!telefono) return 'N/A';
    const limpio = telefono.replace(/\D/g, '');
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(3, 6)}-${limpio.substring(6)}`;
    }
    return telefono;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearMoneda = (cantidad) => {
    if (!cantidad) return 'N/A';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad);
  };

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

  const handleDescargar = async (tipoDocumento) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const url = `${API_CONFIG.BASE_URL}/guias/${guia.id}/documentos/${tipoDocumento}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers.get('content-disposition');
      let filename = `${guia.nombre}_${guia.apellido_paterno}_${tipoDocumento}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);

    } catch (error) {
      console.error('Error al descargar:', error);
    }
  };

  const tieneDocumentos = fotoUrl || ineUrl || licenciaUrl || comprobanteUrl || certificacionesUrl;

  const idiomasArray = Array.isArray(guia.idiomas)
    ? guia.idiomas
    : (guia.idiomas ? guia.idiomas.split(',').map(i => i.trim()) : []);

  return (
    <div className="mvg-overlay" onClick={onCerrar}>
      <div className="mvg-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvg-header">
          <div className="mvg-header-contenido">
            <User size={28} className="mvg-icono-header" />
            <div>
              <h2>{guia.nombre} {guia.apellidoPaterno} {guia.apellidoMaterno}</h2>
              <p className="mvg-subtitulo">
                Guía Turístico #{guia.id.toString().padStart(3, '0')}
              </p>
            </div>
          </div>
          <button className="mvg-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="mvg-body">
          <div className="mvg-contenido-principal">
            <div className="mvg-columna-izquierda">
              <div className="mvg-guia-hero">
                <div className="mvg-guia-hero-content">
                  <h3 className="mvg-guia-titulo">
                    {guia.nombre} {guia.apellidoPaterno}
                  </h3>
                  <p className="mvg-guia-subtitulo">
                    {guia.correoElectronico || guia.email || 'Sin correo electrónico'}
                  </p>
                  <div className="mvg-specs-grid">
                    <div className="mvg-spec-item">
                      <span className="mvg-spec-label">Edad</span>
                      <span className="mvg-spec-valor">
                        {calcularEdad(guia.fecha_nacimiento) || 'N/A'} años
                      </span>
                    </div>
                    <div className="mvg-spec-item">
                      <span className="mvg-spec-label">Experiencia</span>
                      <span className="mvg-spec-valor">
                        {guia.experienciaAnos || guia.experiencia_anos || 'N/A'} años
                      </span>
                    </div>
                    <div className="mvg-spec-item">
                      <span className="mvg-spec-label">Costo/Día</span>
                      <span className="mvg-spec-valor">
                        {formatearMoneda(guia.costoDia || guia.costo_dia)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mvg-guia-imagen-container">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={`${guia.nombre} ${guia.apellidoPaterno}`}
                      className="mvg-guia-foto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const container = e.target.parentElement;
                        container.innerHTML = `
                          <div class="mvg-guia-sin-foto">
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
                    <div className="mvg-guia-sin-foto">
                      <User size={48} />
                      <span>Sin fotografía</span>
                    </div>
                  )}
                </div>
              </div>

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
                      {guia.nombre} {guia.apellidoPaterno} {guia.apellidoMaterno}
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
                      {formatearFecha(guia.fechaNacimiento || guia.fecha_nacimiento)}
                    </span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvg-detalle-label">Edad</span>
                    </div>
                    <span className="mvg-detalle-valor">{calcularEdad(guia.fecha_nacimiento) || 'N/A'} años</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Mail size={18} />
                      </div>
                      <span className="mvg-detalle-label">Correo Electrónico</span>
                    </div>
                    <span className="mvg-detalle-valor destacado">
                      {guia.correoElectronico || guia.email || 'N/A'}
                    </span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvg-detalle-label">NSS</span>
                    </div>
                    <span className="mvg-detalle-valor">{guia.nss || 'N/A'}</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvg-detalle-label">ID</span>
                    </div>
                    <span className="mvg-detalle-valor">
                      #{guia.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>
              </div>
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
                      <span className="mvg-detalle-label">Ciudad</span>
                    </div>
                    <span className="mvg-detalle-valor">{guia.ciudad || 'N/A'}</span>
                  </div>

                  <div className="mvg-detalle-item">
                    <div className="mvg-detalle-header">
                      <div className="mvg-detalle-icono">
                        <MapPin size={18} />
                      </div>
                      <span className="mvg-detalle-label">Estado</span>
                    </div>
                    <span className="mvg-detalle-valor">{guia.estado || 'N/A'}</span>
                  </div>
                </div>
              </div>

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
                      {guia.experienciaAnos || guia.experiencia_anos || 'N/A'} años
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
                      {formatearMoneda(guia.costoDia || guia.costo_dia)}
                    </span>
                  </div>
                </div>
              </div>

              {(guia.especialidades) && (
                <div className="mvg-seccion-detalles">
                  <h3 className="mvg-titulo-seccion">
                    <Award size={20} />
                    Especialidades
                  </h3>
                  <div className="mvg-especialidades-box">
                    <p>{guia.especialidades}</p>
                  </div>
                </div>
              )}

              {guia.comentarios && (
                <div className="mvg-seccion-detalles">
                  <h3 className="mvg-titulo-seccion">
                    <FileText size={20} />
                    Comentarios
                  </h3>
                  <div className="mvg-comentarios-box">
                    <p>{guia.comentarios}</p>
                  </div>
                </div>
              )}

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
                              onClick={() => handleVerDocumento(guia.foto || guia.documentos?.foto_guia)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar('foto_guia')}
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
                              onClick={() => handleVerDocumento(guia.ine || guia.documentos?.foto_ine)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar('foto_ine')}
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
                              onClick={() => handleVerDocumento(guia.documentos?.foto_licencia)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar('foto_licencia')}
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
                              onClick={() => handleVerDocumento(guia.documentos?.foto_comprobante_domicilio)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar('foto_comprobante_domicilio')}
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
                              onClick={() => handleVerDocumento(guia.certificado || guia.documentos?.foto_certificaciones)}
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              className="mvg-btn-descargar mvg-btn-download"
                              onClick={() => handleDescargar('foto_certificaciones')}
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

            <div className="mvg-columna-derecha">
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
                      {formatearTelefono(guia.telefonoPersonal || guia.telefono)}
                    </span>
                  </div>
                  <div className="mvg-telefono-item">
                    <span className="mvg-telefono-label">Teléfono Familiar</span>
                    <span className="mvg-telefono-valor">
                      <Phone size={14} />
                      {formatearTelefono(guia.telefonoFamiliar || guia.telefono_emergencia)}
                    </span>
                  </div>
                  {guia.telefonoEmpresa && (
                    <div className="mvg-telefono-item">
                      <span className="mvg-telefono-label">Teléfono Empresa</span>
                      <span className="mvg-telefono-valor">
                        <Phone size={14} />
                        {formatearTelefono(guia.telefonoEmpresa)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mvg-card-estadistica">
                <div className="mvg-card-header">
                  <h4 className="mvg-card-titulo">Contacto de Emergencia</h4>
                  <Users size={18} className="mvg-card-icono" />
                </div>
                <div className="mvg-experiencia-container">
                  <div className="mvg-experiencia-item">
                    <span className="mvg-experiencia-label">Nombre</span>
                    <span className="mvg-experiencia-valor">
                      {guia.contactoEmergencia || guia.contacto_emergencia || 'N/A'}
                    </span>
                  </div>
                  <div className="mvg-experiencia-item">
                    <span className="mvg-experiencia-label">Teléfono</span>
                    <span className="mvg-experiencia-valor">
                      {formatearTelefono(guia.telefonoEmergencia || guia.telefono_emergencia)}
                    </span>
                  </div>
                  {(guia.tipoSangre || guia.tipo_sangre) && (
                    <div className="mvg-experiencia-item">
                      <span className="mvg-experiencia-label">Tipo de Sangre</span>
                      <span className="mvg-experiencia-valor">
                        {guia.tipoSangre || guia.tipo_sangre}
                      </span>
                    </div>
                  )}
                </div>
              </div>

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
export default ModalVerGuia;