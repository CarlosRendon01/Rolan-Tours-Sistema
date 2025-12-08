import { useState, useCallback } from 'react';
import { X, Save, User, Phone, Mail, Briefcase, FileText, Image } from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalAgregarCoordinador.css';

const ModalAgregarCoordinador = ({ onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    // Información Principal
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    telefono: '',
    email: '',
    ciudad: '',
    estado: '',

    // Información Laboral y Profesional
    nss: '',
    institucion_seguro: '',
    contacto_emergencia: '',
    telefono_emergencia: '',
    costo_dia: '',
    idiomas: '',
    experiencia_anos: '',
    especialidades: '',
    certificacion_oficial: false,
    comentarios: '',

    // Documentos
    foto_coordinador: null,
    foto_ine: null,
    foto_certificaciones: null,
    foto_comprobante_domicilio: null,
    contrato_laboral: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('principal');
  const [guardando, setGuardando] = useState(false);

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErrores((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[nombreCampo];
      return nuevosErrores;
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errores[name]) {
      limpiarErrorCampo(name);
    }
  }, [errores, limpiarErrorCampo]);

  const handleFileChange = useCallback((e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));

      if (errores[name]) {
        limpiarErrorCampo(name);
      }
    }
  }, [errores, limpiarErrorCampo]);

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    // Validaciones Información Principal (obligatorios)
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido_paterno.trim()) {
      nuevosErrores.apellido_paterno = 'El apellido paterno es requerido';
    }

    if (!formData.apellido_materno.trim()) {
      nuevosErrores.apellido_materno = 'El apellido materno es requerido';
    }

    if (!formData.fecha_nacimiento) {
      nuevosErrores.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const fechaNac = new Date(formData.fecha_nacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      if (edad < 18 || edad > 100) {
        nuevosErrores.fecha_nacimiento = 'Edad debe estar entre 18 y 100 años';
      }
    }

    // Validación de teléfono
    const regexTelefono = /^\d{10}$/;
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    } else if (!regexTelefono.test(formData.telefono)) {
      nuevosErrores.telefono = 'Debe contener 10 dígitos';
    }

    // Validación de correo electrónico
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo es requerido';
    } else if (!regexEmail.test(formData.email)) {
      nuevosErrores.email = 'Correo electrónico inválido';
    }

    if (!formData.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }

    if (!formData.estado.trim()) {
      nuevosErrores.estado = 'El estado es requerido';
    }

    // Validaciones Información Laboral (obligatorios)
    const regexNSS = /^\d{11}$/;
    if (!formData.nss.trim()) {
      nuevosErrores.nss = 'El NSS es requerido';
    } else if (!regexNSS.test(formData.nss)) {
      nuevosErrores.nss = 'Debe contener 11 dígitos';
    }

    if (!formData.institucion_seguro.trim()) {
      nuevosErrores.institucion_seguro = 'La institución de seguro es requerida';
    }

    if (!formData.contacto_emergencia.trim()) {
      nuevosErrores.contacto_emergencia = 'El contacto de emergencia es requerido';
    }

    if (!formData.telefono_emergencia.trim()) {
      nuevosErrores.telefono_emergencia = 'El teléfono de emergencia es requerido';
    } else if (!regexTelefono.test(formData.telefono_emergencia)) {
      nuevosErrores.telefono_emergencia = 'Debe contener 10 dígitos';
    }

    if (!formData.costo_dia || parseFloat(formData.costo_dia) <= 0) {
      nuevosErrores.costo_dia = 'El costo por día debe ser mayor a 0';
    }

    if (!formData.idiomas.trim()) {
      nuevosErrores.idiomas = 'Los idiomas son requeridos';
    }

    if (!formData.experiencia_anos || parseInt(formData.experiencia_anos) < 0) {
      nuevosErrores.experiencia_anos = 'La experiencia debe ser mayor o igual a 0';
    }

    if (!formData.especialidades.trim()) {
      nuevosErrores.especialidades = 'Las especialidades son requeridas';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    console.log('🔍 Iniciando validación...');

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      console.log('❌ Errores de validación:', nuevosErrores);

      const camposPrincipal = ['nombre', 'apellido_paterno', 'apellido_materno', 'fecha_nacimiento', 'telefono', 'email', 'ciudad', 'estado'];
      const camposLaboral = ['nss', 'institucion_seguro', 'contacto_emergencia', 'telefono_emergencia', 'costo_dia', 'idiomas', 'experiencia_anos', 'especialidades'];

      const erroresEnPrincipal = Object.keys(nuevosErrores).some(key => camposPrincipal.includes(key));
      const erroresEnLaboral = Object.keys(nuevosErrores).some(key => camposLaboral.includes(key));

      if (erroresEnPrincipal) {
        setSeccionActiva('principal');
      } else if (erroresEnLaboral) {
        setSeccionActiva('laboral');
      }

      setTimeout(() => {
        const primerCampoConError = Object.keys(nuevosErrores)[0];
        const elemento = document.querySelector(`[name="${primerCampoConError}"]`);
        if (elemento) {
          elemento.focus();
          elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      return;
    }

    console.log('✅ Validación exitosa, guardando coordinador...');
    setGuardando(true);

    try {
      const coordinadorData = {
        nombre: formData.nombre,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        fecha_nacimiento: formData.fecha_nacimiento,
        telefono: formData.telefono,
        email: formData.email,
        ciudad: formData.ciudad,
        estado: formData.estado,
        nss: formData.nss,
        institucion_seguro: formData.institucion_seguro,
        contacto_emergencia: formData.contacto_emergencia,
        telefono_emergencia: formData.telefono_emergencia,
        costo_dia: parseFloat(formData.costo_dia),
        idiomas: formData.idiomas,
        experiencia_anos: parseInt(formData.experiencia_anos),
        especialidades: formData.especialidades,
        certificacion_oficial: formData.certificacion_oficial,
        comentarios: formData.comentarios,
        foto_coordinador: formData.foto_coordinador,
        foto_ine: formData.foto_ine,
        foto_certificaciones: formData.foto_certificaciones,
        foto_comprobante_domicilio: formData.foto_comprobante_domicilio,
        contrato_laboral: formData.contrato_laboral
      };

      console.log('📦 Datos a guardar:', coordinadorData);

      const nombreCompleto = `${formData.nombre} ${formData.apellido_paterno}`;

      await onGuardar(coordinadorData);

      console.log('✅ Coordinador guardado, cerrando modal primero...');

      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('✅ Mostrando alerta...');
      await Swal.fire({
        icon: 'success',
        title: '¡Coordinador Agregado!',
        html: `
        <div style="font-size: 1.1rem; margin-top: 15px;">
          <strong style="color: #2563eb; font-size: 1.3rem;">${nombreCompleto}</strong>
          <p style="margin-top: 10px; color: #64748b;">ha sido registrado correctamente</p>
        </div>
      `,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        width: '500px',
        padding: '2rem',
        backdrop: `rgba(0,0,0,0.6)`,
        customClass: {
          popup: 'swal-coord-popup-custom',
          title: 'swal-coord-title-custom',
          htmlContainer: 'swal-coord-html-custom',
          confirmButton: 'swal-coord-confirm-custom'
        }
      });

      console.log('✅ Alerta cerrada');

    } catch (error) {
      console.error('❌ Error al guardar:', error);

      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      await Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        html: `
        <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
          <p>Hubo un problema al guardar el coordinador.</p>
          <p style="margin-top: 8px;">Por favor, inténtalo de nuevo.</p>
        </div>
      `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: true
      });
    } finally {
      setGuardando(false);
    }
  }, [formData, validarFormulario, onGuardar, onCerrar]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;

    return <span className="modal-coord-error-mensaje">{error}</span>;
  };

  const renderSeccionPrincipal = () => (
    <div className="modal-coord-form-grid">
      <div className="modal-coord-form-group">
        <label htmlFor="coord-nombre">
          Nombre <span className="modal-coord-required">*</span>
        </label>
        <input
          type="text"
          id="coord-nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={errores.nombre ? 'modal-coord-input-error' : ''}
          placeholder="Ej: María"
        />
        <MensajeError nombreCampo="nombre" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-apellido_paterno">
          Apellido Paterno <span className="modal-coord-required">*</span>
        </label>
        <input
          type="text"
          id="coord-apellido_paterno"
          name="apellido_paterno"
          value={formData.apellido_paterno}
          onChange={handleChange}
          className={errores.apellido_paterno ? 'modal-coord-input-error' : ''}
          placeholder="Ej: Hernández"
        />
        <MensajeError nombreCampo="apellido_paterno" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-apellido_materno">
          Apellido Materno <span className="modal-coord-required">*</span>
        </label>
        <input
          type="text"
          id="coord-apellido_materno"
          name="apellido_materno"
          value={formData.apellido_materno}
          onChange={handleChange}
          className={errores.apellido_materno ? 'modal-coord-input-error' : ''}
          placeholder="Ej: Rodríguez"
        />
        <MensajeError nombreCampo="apellido_materno" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-fecha_nacimiento">
          Fecha de Nacimiento <span className="modal-coord-required">*</span>
        </label>
        <input
          type="date"
          id="coord-fecha_nacimiento"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
          className={errores.fecha_nacimiento ? 'modal-coord-input-error' : ''}
        />
        <MensajeError nombreCampo="fecha_nacimiento" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-telefono">
          Teléfono <span className="modal-coord-required">*</span>
        </label>
        <input
          type="tel"
          id="coord-telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={errores.telefono ? 'modal-coord-input-error' : ''}
          placeholder="5551234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-email">
          Correo Electrónico <span className="modal-coord-required">*</span>
        </label>
        <input
          type="email"
          id="coord-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errores.email ? 'modal-coord-input-error' : ''}
          placeholder="coordinador@empresa.com"
        />
        <MensajeError nombreCampo="email" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-ciudad">
          Ciudad <span className="modal-coord-required">*</span>
        </label>
        <input
          type="text"
          id="coord-ciudad"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          className={errores.ciudad ? 'modal-coord-input-error' : ''}
          placeholder="Ej: Ciudad de México"
        />
        <MensajeError nombreCampo="ciudad" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-estado">
          Estado <span className="modal-coord-required">*</span>
        </label>
        <input
          type="text"
          id="coord-estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className={errores.estado ? 'modal-coord-input-error' : ''}
          placeholder="Ej: CDMX"
        />
        <MensajeError nombreCampo="estado" />
      </div>
    </div>
  );

  const renderSeccionLaboral = () => (
    <div className="modal-coord-form-grid">
      <div className="modal-coord-form-group">
        <label htmlFor="coord-nss">
          NSS (Número de Seguro Social) <span className="modal-coord-required">*</span>
        </label>
        <input
          type="text"
          id="coord-nss"
          name="nss"
          value={formData.nss}
          onChange={handleChange}
          className={errores.nss ? 'modal-coord-input-error' : ''}
          placeholder="12345678901"
          maxLength="11"
        />
        <MensajeError nombreCampo="nss" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-institucion_seguro">
          Institución de Seguro <span className="modal-coord-required">*</span>
        </label>
        <select
          id="coord-institucion_seguro"
          name="institucion_seguro"
          value={formData.institucion_seguro}
          onChange={handleChange}
          className={errores.institucion_seguro ? 'modal-coord-input-error' : ''}
        >
          <option value="">Seleccione una institución</option>
          <option value="IMSS">IMSS</option>
          <option value="ISSSTE">ISSSTE</option>
          <option value="Seguro Popular">Seguro Popular</option>
          <option value="Privado">Privado</option>
          <option value="Otro">Otro</option>
        </select>
        <MensajeError nombreCampo="institucion_seguro" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-contacto_emergencia">
          Contacto de Emergencia <span className="modal-coord-required">*</span>
        </label>
        <input
          type="text"
          id="coord-contacto_emergencia"
          name="contacto_emergencia"
          value={formData.contacto_emergencia}
          onChange={handleChange}
          className={errores.contacto_emergencia ? 'modal-coord-input-error' : ''}
          placeholder="Nombre del contacto"
        />
        <MensajeError nombreCampo="contacto_emergencia" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-telefono_emergencia">
          Teléfono de Emergencia <span className="modal-coord-required">*</span>
        </label>
        <input
          type="tel"
          id="coord-telefono_emergencia"
          name="telefono_emergencia"
          value={formData.telefono_emergencia}
          onChange={handleChange}
          className={errores.telefono_emergencia ? 'modal-coord-input-error' : ''}
          placeholder="5559876543"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono_emergencia" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-costo_dia">
          Costo por Día <span className="modal-coord-required">*</span>
        </label>
        <input
          type="number"
          id="coord-costo_dia"
          name="costo_dia"
          value={formData.costo_dia}
          onChange={handleChange}
          className={errores.costo_dia ? 'modal-coord-input-error' : ''}
          placeholder="1200"
          min="0"
          step="0.01"
        />
        <MensajeError nombreCampo="costo_dia" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-experiencia_anos">
          Años de Experiencia <span className="modal-coord-required">*</span>
        </label>
        <input
          type="number"
          id="coord-experiencia_anos"
          name="experiencia_anos"
          value={formData.experiencia_anos}
          onChange={handleChange}
          className={errores.experiencia_anos ? 'modal-coord-input-error' : ''}
          placeholder="5"
          min="0"
        />
        <MensajeError nombreCampo="experiencia_anos" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-idiomas">
          Idiomas <span className="modal-coord-required">*</span>
        </label>
        <input
          type="text"
          id="coord-idiomas"
          name="idiomas"
          value={formData.idiomas}
          onChange={handleChange}
          className={errores.idiomas ? 'modal-coord-input-error' : ''}
          placeholder="Ej: Español, Inglés"
        />
        <MensajeError nombreCampo="idiomas" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-especialidades">
          Especialidades <span className="modal-coord-required">*</span>
        </label>
        <input
          type="text"
          id="coord-especialidades"
          name="especialidades"
          value={formData.especialidades}
          onChange={handleChange}
          className={errores.especialidades ? 'modal-coord-input-error' : ''}
          placeholder="Ej: Logística, Gestión de equipos"
        />
        <MensajeError nombreCampo="especialidades" />
      </div>

      <div className="modal-coord-form-group">
        <label htmlFor="coord-certificacion_oficial">
          Certificación Oficial <span className="modal-coord-required">*</span>
        </label>
        <select
          id="coord-certificacion_oficial"
          name="certificacion_oficial"
          value={formData.certificacion_oficial ? 'si' : 'no'}
          onChange={(e) => handleChange({
            target: {
              name: 'certificacion_oficial',
              value: e.target.value === 'si',
              type: 'select'
            }
          })}
          className={errores.certificacion_oficial ? 'modal-coord-input-error' : ''}
        >
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>
        <MensajeError nombreCampo="certificacion_oficial" />
      </div>

      <div className="modal-coord-form-group modal-coord-form-group-full">
        <label htmlFor="coord-comentarios">Comentarios</label>
        <textarea
          id="coord-comentarios"
          name="comentarios"
          value={formData.comentarios}
          onChange={handleChange}
          placeholder="Información adicional sobre el coordinador..."
          rows="3"
        />
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="modal-coord-form-grid-documentos">
      <div className="modal-coord-form-group-file">
        <label htmlFor="coord-foto_coordinador">
          <Image size={20} />
          Fotografía del Coordinador <span className="modal-coord-required">*</span>
        </label>
        <input
          type="file"
          id="coord-foto_coordinador"
          name="foto_coordinador"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_coordinador && (
          <span className="modal-coord-file-name">{formData.foto_coordinador.name}</span>
        )}
      </div>

      <div className="modal-coord-form-group-file">
        <label htmlFor="coord-foto_ine">
          <FileText size={20} />
          INE / Identificación Oficial <span className="modal-coord-required">*</span>
        </label>
        <input
          type="file"
          id="coord-foto_ine"
          name="foto_ine"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_ine && (
          <span className="modal-coord-file-name">{formData.foto_ine.name}</span>
        )}
      </div>

      <div className="modal-coord-form-group-file">
        <label htmlFor="coord-foto_certificaciones">
          <FileText size={20} />
          Certificaciones
        </label>
        <input
          type="file"
          id="coord-foto_certificaciones"
          name="foto_certificaciones"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_certificaciones && (
          <span className="modal-coord-file-name">{formData.foto_certificaciones.name}</span>
        )}
      </div>

      <div className="modal-coord-form-group-file">
        <label htmlFor="coord-foto_comprobante_domicilio">
          <FileText size={20} />
          Comprobante de Domicilio
        </label>
        <input
          type="file"
          id="coord-foto_comprobante_domicilio"
          name="foto_comprobante_domicilio"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_comprobante_domicilio && (
          <span className="modal-coord-file-name">{formData.foto_comprobante_domicilio.name}</span>
        )}
      </div>

      <div className="modal-coord-form-group-file">
        <label htmlFor="coord-contrato_laboral">
          <FileText size={20} />
          Contrato Laboral (Opcional)
        </label>
        <input
          type="file"
          id="coord-contrato_laboral"
          name="contrato_laboral"
          onChange={handleFileChange}
          accept="application/pdf"
        />
        {formData.contrato_laboral && (
          <span className="modal-coord-file-name">{formData.contrato_laboral.name}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-coord-overlay" onClick={onCerrar}>
      <div className="modal-coord-contenido modal-coord-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-coord-header">
          <h2>Agregar Nuevo Coordinador</h2>
          <button className="modal-coord-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="modal-coord-tabs">
          <button
            className={`modal-coord-tab-button ${seccionActiva === 'principal' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('principal')}
            type="button"
          >
            <User size={18} />
            Información Principal
          </button>
          <button
            className={`modal-coord-tab-button ${seccionActiva === 'laboral' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('laboral')}
            type="button"
          >
            <Briefcase size={18} />
            Información Laboral
          </button>
          <button
            className={`modal-coord-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <FileText size={18} />
            Documentos
          </button>
        </div>

        {/* Formulario (scrolleable) */}
        <form onSubmit={handleSubmit} className="modal-coord-form">
          {seccionActiva === 'principal' && renderSeccionPrincipal()}
          {seccionActiva === 'laboral' && renderSeccionLaboral()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        {/* Footer (FUERA del form, fijo en el bottom) */}
        <div className="modal-coord-footer">
          <div className="modal-coord-botones-izquierda">
            <button type="button" className="modal-coord-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="modal-coord-botones-derecha">
            <button
              type="button"
              className={`modal-coord-btn-guardar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Guardando...' : 'Guardar Coordinador'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarCoordinador;