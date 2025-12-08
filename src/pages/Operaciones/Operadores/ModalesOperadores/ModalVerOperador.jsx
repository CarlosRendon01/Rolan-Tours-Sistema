import { 
  X, User, Phone, Mail, Calendar, CreditCard, 
  FileText, Hash, Shield, Clock, Eye, Download,
  UserCircle, CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import './ModalVerOperador.css';
import CredencialOperador from '../Credenciales/CredencialOperador';

const ModalVerOperador = ({ operador, onCerrar }) => {
  
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
  const fotoUrl = obtenerUrlArchivo(operador.foto);
  const ineUrl = obtenerUrlArchivo(operador.ine);
  
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

  // Función para obtener estado de vigencia
  const obtenerEstadoVigencia = (fechaVencimiento) => {
    if (!fechaVencimiento) return { clase: 'vencida', texto: 'Sin fecha', icono: XCircle };
    
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferenciaDias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 0) {
      return { clase: 'vencida', texto: 'Vencida', icono: XCircle };
    } else if (diferenciaDias <= 30) {
      return { clase: 'por-vencer', texto: 'Por vencer', icono: AlertCircle };
    } else {
      return { clase: 'vigente', texto: 'Vigente', icono: CheckCircle };
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
      link.download = archivo.name || `${operador.nombre}_${operador.apellidoPaterno}_${nombreDocumento}`;
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
      link.download = `${operador.nombre}_${operador.apellidoPaterno}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    alert('No hay documento disponible para descargar');
  };

  const tieneDocumentos = fotoUrl || ineUrl;

  const estadoLicencia = obtenerEstadoVigencia(operador.fechaVencimientoLicencia);
  const estadoExamen = obtenerEstadoVigencia(operador.fechaVencimientoExamen);
  const IconoLicencia = estadoLicencia.icono;
  const IconoExamen = estadoExamen.icono;

  return (
    <div className="mvo-overlay" onClick={onCerrar}>
      <div className="mvo-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mvo-header">
          <div className="mvo-header-contenido">
            <User size={28} className="mvo-icono-header" />
            <div>
              <h2>{operador.nombre} {operador.apellidoPaterno} {operador.apellidoMaterno}</h2>
              <p className="mvo-subtitulo">
                Operador #{operador.id.toString().padStart(3, '0')}
              </p>
            </div>
          </div>
          <button className="mvo-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="mvo-body">
          <div className="mvo-contenido-principal">
            {/* Columna Izquierda */}
            <div className="mvo-columna-izquierda">
              {/* Hero Card */}
              <div className="mvo-operador-hero">
                <div className="mvo-operador-hero-content">
                  <h3 className="mvo-operador-titulo">
                    {operador.nombre} {operador.apellidoPaterno}
                  </h3>
                  <p className="mvo-operador-subtitulo">
                    {operador.correoElectronico || 'Sin correo electrónico'}
                  </p>
                  <div className="mvo-specs-grid">
                    <div className="mvo-spec-item">
                      <span className="mvo-spec-label">Edad</span>
                      <span className="mvo-spec-valor">
                        {operador.edad || 'N/A'} años
                      </span>
                    </div>
                    <div className="mvo-spec-item">
                      <span className="mvo-spec-label">Licencia</span>
                      <span className="mvo-spec-valor">{operador.numeroLicencia || 'N/A'}</span>
                    </div>
                    <div className="mvo-spec-item">
                      <span className="mvo-spec-label">Estado</span>
                      <span className="mvo-spec-valor">
                        {estadoLicencia.texto}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Credencial del Operador */}
                <div className="mvo-operador-imagen-container">
                  <CredencialOperador operador={operador} />
                </div>
              </div>

              {/* Información Personal */}
              <div className="mvo-seccion-detalles">
                <h3 className="mvo-titulo-seccion">
                  <UserCircle size={20} />
                  Información Personal
                </h3>
                <div className="mvo-detalles-grid">
                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <User size={18} />
                      </div>
                      <span className="mvo-detalle-label">Nombre</span>
                    </div>
                    <span className="mvo-detalle-valor">{operador.nombre || 'N/A'}</span>
                  </div>

                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <User size={18} />
                      </div>
                      <span className="mvo-detalle-label">Apellido Paterno</span>
                    </div>
                    <span className="mvo-detalle-valor">{operador.apellidoPaterno || 'N/A'}</span>
                  </div>

                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <User size={18} />
                      </div>
                      <span className="mvo-detalle-label">Apellido Materno</span>
                    </div>
                    <span className="mvo-detalle-valor">{operador.apellidoMaterno || 'N/A'}</span>
                  </div>

                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvo-detalle-label">Edad</span>
                    </div>
                    <span className="mvo-detalle-valor">{operador.edad || 'N/A'} años</span>
                  </div>

                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <Mail size={18} />
                      </div>
                      <span className="mvo-detalle-label">Correo Electrónico</span>
                    </div>
                    <span className="mvo-detalle-valor destacado">
                      {operador.correoElectronico || 'N/A'}
                    </span>
                  </div>

                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <Hash size={18} />
                      </div>
                      <span className="mvo-detalle-label">ID</span>
                    </div>
                    <span className="mvo-detalle-valor">
                      #{operador.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de Licencia */}
              <div className="mvo-seccion-detalles">
                <h3 className="mvo-titulo-seccion">
                  <Shield size={20} />
                  Información de Licencia
                </h3>
                <div className="mvo-detalles-grid">
                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <CreditCard size={18} />
                      </div>
                      <span className="mvo-detalle-label">Número de Licencia</span>
                    </div>
                    <span className="mvo-detalle-valor">{operador.numeroLicencia || 'N/A'}</span>
                  </div>

                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvo-detalle-label">Vigencia Licencia</span>
                    </div>
                    <span className="mvo-detalle-valor">
                      {formatearFecha(operador.fechaVigenciaLicencia)}
                    </span>
                  </div>

                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <Calendar size={18} />
                      </div>
                      <span className="mvo-detalle-label">Vencimiento Licencia</span>
                    </div>
                    <span className="mvo-detalle-valor destacado">
                      {formatearFecha(operador.fechaVencimientoLicencia)}
                    </span>
                  </div>

                  <div className="mvo-detalle-item">
                    <div className="mvo-detalle-header">
                      <div className="mvo-detalle-icono">
                        <Clock size={18} />
                      </div>
                      <span className="mvo-detalle-label">Vencimiento Examen</span>
                    </div>
                    <span className="mvo-detalle-valor">
                      {formatearFecha(operador.fechaVencimientoExamen)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comentarios */}
              {operador.comentarios && (
                <div className="mvo-seccion-detalles">
                  <h3 className="mvo-titulo-seccion">
                    <FileText size={20} />
                    Comentarios
                  </h3>
                  <div className="mvo-comentarios-box">
                    <p>{operador.comentarios}</p>
                  </div>
                </div>
              )}

              {/* Documentos */}
              <div className="mvo-seccion-detalles">
                <h3 className="mvo-titulo-seccion">
                  <FileText size={20} />
                  Documentos Adjuntos
                </h3>
                <div className="mvo-documentos-grid">
                  {tieneDocumentos ? (
                    <>
                      {fotoUrl && (
                        <div className="mvo-documento-item">
                          <UserCircle size={32} />
                          <span>Fotografía</span>
                          <div className="mvo-botones-documento">
                            <button 
                              className="mvo-btn-descargar mvo-btn-ver"
                              onClick={() => handleVerDocumento(operador.foto)}
                              title="Ver fotografía en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button 
                              className="mvo-btn-descargar mvo-btn-download"
                              onClick={() => handleDescargar(operador.foto, 'foto')}
                              title="Descargar fotografía"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {ineUrl && (
                        <div className="mvo-documento-item">
                          <CreditCard size={32} />
                          <span>INE</span>
                          <div className="mvo-botones-documento">
                            <button 
                              className="mvo-btn-descargar mvo-btn-ver"
                              onClick={() => handleVerDocumento(operador.ine)}
                              title="Ver INE en nueva pestaña"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button 
                              className="mvo-btn-descargar mvo-btn-download"
                              onClick={() => handleDescargar(operador.ine, 'ine')}
                              title="Descargar INE"
                            >
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="mvo-sin-documentos">No hay documentos adjuntos</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Información de Contacto */}
            <div className="mvo-columna-derecha">
              {/* Card de Teléfonos */}
              <div className="mvo-card-estadistica">
                <div className="mvo-card-header">
                  <h4 className="mvo-card-titulo">Teléfonos de Contacto</h4>
                  <Phone size={18} className="mvo-card-icono" />
                </div>
                <div className="mvo-telefonos-lista">
                  <div className="mvo-telefono-item">
                    <span className="mvo-telefono-label">Teléfono Personal</span>
                    <span className="mvo-telefono-valor">
                      <Phone size={14} />
                      {formatearTelefono(operador.telefonoPersonal)}
                    </span>
                  </div>
                  <div className="mvo-telefono-item">
                    <span className="mvo-telefono-label">Teléfono Emergencia</span>
                    <span className="mvo-telefono-valor">
                      <Phone size={14} />
                      {formatearTelefono(operador.telefonoEmergencia)}
                    </span>
                  </div>
                  <div className="mvo-telefono-item">
                    <span className="mvo-telefono-label">Teléfono Familiar</span>
                    <span className="mvo-telefono-valor">
                      <Phone size={14} />
                      {formatearTelefono(operador.telefonoFamiliar)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Estado de Licencia */}
              <div className="mvo-card-estadistica">
                <div className="mvo-card-header">
                  <h4 className="mvo-card-titulo">Estado de Licencia</h4>
                  <Shield size={18} className="mvo-card-icono" />
                </div>
                <div className="mvo-vigencia-container">
                  <div className="mvo-vigencia-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IconoLicencia size={20} />
                      <span className="mvo-vigencia-label">Licencia</span>
                    </div>
                    <span className={`mvo-badge-vigencia ${estadoLicencia.clase}`}>
                      {estadoLicencia.texto}
                    </span>
                  </div>
                  <div className="mvo-vigencia-item">
                    <span className="mvo-vigencia-label">Vence el:</span>
                    <span className="mvo-vigencia-valor">
                      {formatearFecha(operador.fechaVencimientoLicencia)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card de Estado de Examen */}
              <div className="mvo-card-estadistica">
                <div className="mvo-card-header">
                  <h4 className="mvo-card-titulo">Estado de Examen</h4>
                  <FileText size={18} className="mvo-card-icono" />
                </div>
                <div className="mvo-vigencia-container">
                  <div className="mvo-vigencia-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IconoExamen size={20} />
                      <span className="mvo-vigencia-label">Examen</span>
                    </div>
                    <span className={`mvo-badge-vigencia ${estadoExamen.clase}`}>
                      {estadoExamen.texto}
                    </span>
                  </div>
                  <div className="mvo-vigencia-item">
                    <span className="mvo-vigencia-label">Vence el:</span>
                    <span className="mvo-vigencia-valor">
                      {formatearFecha(operador.fechaVencimientoExamen)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mvo-footer">
          <button className="mvo-btn-cerrar-footer" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerOperador;