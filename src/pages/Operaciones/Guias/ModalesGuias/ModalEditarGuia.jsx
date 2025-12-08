import { useState, useEffect, useCallback } from 'react';
import { X, Save, User, Briefcase, Image } from 'lucide-react';
import './ModalEditarGuia.css';
import Swal from 'sweetalert2';

const ModalEditarGuia = ({ guia, onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    // 🧾 Datos Personales
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    telefono: '',
    email: '',
    ciudad: '',
    estado: '',
    nss: '',
    institucion_seguro: '',
    contacto_emergencia: '',
    telefono_emergencia: '',

    // 💼 Información Profesional
    costo_dia: '',
    idiomas: '',
    experiencia_anos: '',
    especialidades: '',
    certificacion_oficial: '',
    zona_servicio: '',
    estado_operativo: 'activo',

    // 📄 Documentos
    foto_guia: null,
    foto_ine: null,
    foto_certificaciones: null,
    foto_licencia: null,
    foto_comprobante_domicilio: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('personales');
  const [guardando, setGuardando] = useState(false);

  // Cargar datos del guía cuando se abre el modal
  useEffect(() => {
    if (guia) {
      // Convertir idiomas de array a string si es necesario
      const idiomasString = Array.isArray(guia.idiomas)
        ? guia.idiomas.join(', ')
        : guia.idiomas || '';

      setFormData({
        // 🧾 Datos Personales
        nombre: guia.nombre || '',
        apellido_paterno: guia.apellido_paterno || '',
        apellido_materno: guia.apellido_materno || '',
        fecha_nacimiento: guia.fecha_nacimiento || '',
        telefono: guia.telefono || '',
        email: guia.email || '',
        ciudad: guia.ciudad || '',
        estado: guia.estado || '',
        nss: guia.nss || '',
        institucion_seguro: guia.institucion_seguro || '',
        contacto_emergencia: guia.contacto_emergencia || '',
        telefono_emergencia: guia.telefono_emergencia || '',

        // 💼 Info Profesional
        costo_dia: guia.costo_dia || '',
        idiomas: idiomasString,
        experiencia_anos: guia.experiencia_anos || '',
        especialidades: guia.especialidades || '',
        certificacion_oficial: guia.certificacion_oficial || '',
        zona_servicio: guia.zona_servicio || '',
        estado_operativo: guia.estado_operativo || 'activo',

        // 📄 Documentos
        foto_guia: guia.documentos?.foto_guia || null,
        foto_ine: guia.documentos?.foto_ine || null,
        foto_certificaciones: guia.documentos?.foto_certificaciones || null,
        foto_licencia: guia.documentos?.foto_licencia || null,
        foto_comprobante_domicilio: guia.documentos?.foto_comprobante_domicilio || null
      });
    }
  }, [guia]);

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErrores((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[nombreCampo];
      return nuevosErrores;
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    // 🧾 Datos Personales (obligatorios)
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido_paterno.trim()) {
      nuevosErrores.apellido_paterno = 'Apellido requerido';
    }

    if (!formData.apellido_materno.trim()) {
      nuevosErrores.apellido_materno = 'Apellido requerido';
    }

    // Validar teléfono (10 dígitos)
    const telefonoRegex = /^\d{10}$/;
    if (!formData.telefono || !telefonoRegex.test(formData.telefono)) {
      nuevosErrores.telefono = 'Debe tener 10 dígitos';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (!formData.fecha_nacimiento) {
      nuevosErrores.fecha_nacimiento = 'La fecha es requerida';
    } else {
      // Validar que sea mayor de 18 años
      const fechaNac = new Date(formData.fecha_nacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }
      if (edad < 18) {
        nuevosErrores.fecha_nacimiento = 'Debe ser mayor de 18 años';
      }
    }

    if (!formData.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }

    if (!formData.estado.trim()) {
      nuevosErrores.estado = 'El estado es requerido';
    }

    if (!formData.institucion_seguro) {
      nuevosErrores.institucion_seguro = 'Seleccione una institución';
    }

    if (!formData.contacto_emergencia.trim()) {
      nuevosErrores.contacto_emergencia = 'Contacto requerido';
    }

    if (!formData.telefono_emergencia || !telefonoRegex.test(formData.telefono_emergencia)) {
      nuevosErrores.telefono_emergencia = 'Debe tener 10 dígitos';
    }

    // 💼 Información Profesional (obligatorios)
    if (!formData.costo_dia || parseFloat(formData.costo_dia) <= 0) {
      nuevosErrores.costo_dia = 'El costo debe ser mayor a 0';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    console.log('📋 Iniciando validación...');

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      console.log('❌ Errores de validación:', nuevosErrores);

      const camposPersonales = ['nombre', 'apellido_paterno', 'apellido_materno', 'telefono', 'email', 'fecha_nacimiento', 'ciudad', 'estado', 'institucion_seguro', 'contacto_emergencia', 'telefono_emergencia'];
      const camposProfesionales = ['costo_dia', 'idiomas', 'experiencia_anos', 'certificacion_oficial', 'zona_servicio'];

      const erroresEnPersonales = Object.keys(nuevosErrores).some(key => camposPersonales.includes(key));
      const erroresEnProfesionales = Object.keys(nuevosErrores).some(key => camposProfesionales.includes(key));

      if (erroresEnPersonales) {
        setSeccionActiva('personales');
      } else if (erroresEnProfesionales) {
        setSeccionActiva('profesionales');
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

    console.log('✅ Validación exitosa, actualizando guía...');
    setGuardando(true);

    try {
      const guiaData = {
        ...guia,
        // 🧾 Datos Personales
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

        // 💼 Info Profesional
        costo_dia: parseFloat(formData.costo_dia),
        idiomas: formData.idiomas,
        experiencia_anos: formData.experiencia_anos ? parseInt(formData.experiencia_anos) : null,
        especialidades: formData.especialidades,
        certificacion_oficial: formData.certificacion_oficial,
        zona_servicio: formData.zona_servicio,
        estado_operativo: formData.estado_operativo,

        // 📄 Documentos
        documentos: {
          foto_guia: formData.foto_guia,
          foto_ine: formData.foto_ine,
          foto_certificaciones: formData.foto_certificaciones,
          foto_licencia: formData.foto_licencia,
          foto_comprobante_domicilio: formData.foto_comprobante_domicilio
        }
      };

      console.log('📦 Datos a actualizar:', guiaData);

      const nombreCompleto = `${formData.nombre} ${formData.apellido_paterno} ${formData.apellido_materno}`;

      await onGuardar(guiaData);

      console.log('✅ Guía actualizado, cerrando modal primero...');

      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('✅ Mostrando alerta...');
      await Swal.fire({
        icon: 'success',
        title: '¡Guía Actualizado!',
        html: `
        <div style="font-size: 1.1rem; margin-top: 15px;">
          <strong style="color: #2563eb; font-size: 1.3rem;">${nombreCompleto}</strong>
          <p style="margin-top: 10px; color: #64748b;">ha sido actualizado correctamente</p>
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
          popup: 'swal-popup-custom-guia',
          title: 'swal-title-custom-guia',
          htmlContainer: 'swal-html-custom-guia',
          confirmButton: 'swal-confirm-custom-guia'
        }
      });

      console.log('✅ Alerta cerrada');

    } catch (error) {
      console.error('❌ Error al actualizar:', error);

      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      await Swal.fire({
        icon: 'error',
        title: 'Error al Actualizar',
        html: `
        <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
          <p>Hubo un problema al actualizar el guía.</p>
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
  }, [formData, validarFormulario, onGuardar, guia, onCerrar]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;

    return <span className="meg-error-mensaje">{error}</span>;
  };

  const renderSeccionPersonales = () => (
    <div className="meg-form-grid">
      <div className="meg-form-group">
        <label htmlFor="nombre">
          Nombre <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={errores.nombre ? 'input-error' : ''}
          placeholder="Ej: Juan"
        />
        <MensajeError nombreCampo="nombre" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="apellido_paterno">
          Apellido Paterno <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="apellido_paterno"
          name="apellido_paterno"
          value={formData.apellido_paterno}
          onChange={handleChange}
          className={errores.apellido_paterno ? 'input-error' : ''}
          placeholder="Ej: López"
        />
        <MensajeError nombreCampo="apellido_paterno" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="apellido_materno">
          Apellido Materno <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="apellido_materno"
          name="apellido_materno"
          value={formData.apellido_materno}
          onChange={handleChange}
          className={errores.apellido_materno ? 'input-error' : ''}
          placeholder="Ej: García"
        />
        <MensajeError nombreCampo="apellido_materno" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="fecha_nacimiento">
          Fecha de Nacimiento <span className="meg-required">*</span>
        </label>
        <input
          type="date"
          id="fecha_nacimiento"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
          className={errores.fecha_nacimiento ? 'input-error' : ''}
        />
        <MensajeError nombreCampo="fecha_nacimiento" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="telefono">
          Teléfono <span className="meg-required">*</span>
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={errores.telefono ? 'input-error' : ''}
          placeholder="9511234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="email">
          Email <span className="meg-required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errores.email ? 'input-error' : ''}
          placeholder="guia@ejemplo.com"
        />
        <MensajeError nombreCampo="email" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="ciudad">
          Ciudad <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="ciudad"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          className={errores.ciudad ? 'input-error' : ''}
          placeholder="Oaxaca de Juárez"
        />
        <MensajeError nombreCampo="ciudad" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="estado">
          Estado <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className={errores.estado ? 'input-error' : ''}
          placeholder="Oaxaca"
        />
        <MensajeError nombreCampo="estado" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="nss">NSS o No. Seguro Médico</label>
        <input
          type="text"
          id="nss"
          name="nss"
          value={formData.nss}
          onChange={handleChange}
          placeholder="12345678901"
          maxLength="11"
        />
      </div>

      <div className="meg-form-group">
        <label htmlFor="institucion_seguro">
          Institución de Seguro <span className="meg-required">*</span>
        </label>
        <select
          id="institucion_seguro"
          name="institucion_seguro"
          value={formData.institucion_seguro}
          onChange={handleChange}
          className={errores.institucion_seguro ? 'input-error' : ''}
        >
          <option value="">Seleccionar</option>
          <option value="IMSS">IMSS</option>
          <option value="Privado">Seguro Privado</option>
          <option value="Otro">Otro</option>
        </select>
        <MensajeError nombreCampo="institucion_seguro" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="contacto_emergencia">
          Contacto de Emergencia <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="contacto_emergencia"
          name="contacto_emergencia"
          value={formData.contacto_emergencia}
          onChange={handleChange}
          className={errores.contacto_emergencia ? 'input-error' : ''}
          placeholder="Nombre completo"
        />
        <MensajeError nombreCampo="contacto_emergencia" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="telefono_emergencia">
          Teléfono de Emergencia <span className="meg-required">*</span>
        </label>
        <input
          type="tel"
          id="telefono_emergencia"
          name="telefono_emergencia"
          value={formData.telefono_emergencia}
          onChange={handleChange}
          className={errores.telefono_emergencia ? 'input-error' : ''}
          placeholder="9511234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono_emergencia" />
      </div>
    </div>
  );

  const renderSeccionProfesionales = () => (
    <div className="meg-form-grid">
      <div className="meg-form-group">
        <label htmlFor="costo_dia">
          Costo por Día (MXN) <span className="meg-required">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="costo_dia"
          name="costo_dia"
          value={formData.costo_dia}
          onChange={handleChange}
          className={errores.costo_dia ? 'input-error' : ''}
          placeholder="800.00"
        />
        <MensajeError nombreCampo="costo_dia" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="experiencia_anos">Años de Experiencia</label>
        <input
          type="number"
          id="experiencia_anos"
          name="experiencia_anos"
          value={formData.experiencia_anos}
          onChange={handleChange}
          placeholder="5"
          min="0"
        />
      </div>

      <div className="meg-form-group">
        <label htmlFor="certificacion_oficial">Certificación Oficial</label>
        <input
          type="text"
          id="certificacion_oficial"
          name="certificacion_oficial"
          value={formData.certificacion_oficial}
          onChange={handleChange}
          placeholder="Ej: SECTUR-OAX-2024-001"
        />
      </div>

      <div className="meg-form-group">
        <label htmlFor="estado_operativo">
          Estado Operativo <span className="meg-required">*</span>
        </label>
        <select
          id="estado_operativo"
          name="estado_operativo"
          value={formData.estado_operativo}
          onChange={handleChange}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="meg-form-group meg-form-group-full">
        <label htmlFor="idiomas">Idiomas</label>
        <input
          type="text"
          id="idiomas"
          name="idiomas"
          value={formData.idiomas}
          onChange={handleChange}
          placeholder="Español, Inglés, Francés"
        />
      </div>

      <div className="meg-form-group meg-form-group-full">
        <label htmlFor="zona_servicio">Zona de Servicio</label>
        <input
          type="text"
          id="zona_servicio"
          name="zona_servicio"
          value={formData.zona_servicio}
          onChange={handleChange}
          placeholder="Ej: Oaxaca Centro, Monte Albán, Mitla"
        />
      </div>

      <div className="meg-form-group meg-form-group-full">
        <label htmlFor="especialidades">Especialidades</label>
        <textarea
          id="especialidades"
          name="especialidades"
          value={formData.especialidades}
          onChange={handleChange}
          placeholder="Turismo cultural, ecoturismo, tours históricos..."
          rows="3"
        />
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="meg-form-grid-documentos">
      <div className="meg-form-group-file">
        <label htmlFor="foto_guia">
          <Image size={20} />
          Foto del Guía
        </label>
        <input
          type="file"
          id="foto_guia"
          name="foto_guia"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_guia && (
          <span className="meg-file-name">
            {typeof formData.foto_guia === 'string'
              ? 'Archivo existente'
              : formData.foto_guia.name}
          </span>
        )}
      </div>

      <div className="meg-form-group-file">
        <label htmlFor="foto_ine">
          <Image size={20} />
          INE / Identificación
        </label>
        <input
          type="file"
          id="foto_ine"
          name="foto_ine"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_ine && (
          <span className="meg-file-name">
            {typeof formData.foto_ine === 'string'
              ? 'Archivo existente'
              : formData.foto_ine.name}
          </span>
        )}
      </div>

      <div className="meg-form-group-file">
        <label htmlFor="foto_certificaciones">
          <Image size={20} />
          Certificaciones
        </label>
        <input
          type="file"
          id="foto_certificaciones"
          name="foto_certificaciones"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_certificaciones && (
          <span className="meg-file-name">
            {typeof formData.foto_certificaciones === 'string'
              ? 'Archivo existente'
              : formData.foto_certificaciones.name}
          </span>
        )}
      </div>

      <div className="meg-form-group-file">
        <label htmlFor="foto_licencia">
          <Image size={20} />
          Licencia de Conducir (Opcional)
        </label>
        <input
          type="file"
          id="foto_licencia"
          name="foto_licencia"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_licencia && (
          <span className="meg-file-name">
            {typeof formData.foto_licencia === 'string'
              ? 'Archivo existente'
              : formData.foto_licencia.name}
          </span>
        )}
      </div>

      <div className="meg-form-group-file">
        <label htmlFor="foto_comprobante_domicilio">
          <Image size={20} />
          Comprobante de Domicilio (Opcional)
        </label>
        <input
          type="file"
          id="foto_comprobante_domicilio"
          name="foto_comprobante_domicilio"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_comprobante_domicilio && (
          <span className="meg-file-name">
            {typeof formData.foto_comprobante_domicilio === 'string'
              ? 'Archivo existente'
              : formData.foto_comprobante_domicilio.name}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="meg-overlay" onClick={onCerrar}>
      <div className="meg-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="meg-header">
          <h2>Editar Guía</h2>
          <button className="meg-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="meg-tabs">
          <button
            className={`meg-tab-button ${seccionActiva === 'personales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('personales')}
            type="button"
          >
            <User size={18} />
            Datos Personales
          </button>
          <button
            className={`meg-tab-button ${seccionActiva === 'profesionales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('profesionales')}
            type="button"
          >
            <Briefcase size={18} />
            Info Profesional
          </button>
          <button
            className={`meg-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <Image size={18} />
            Documentación
          </button>
        </div>

        {/* Formulario (scrolleable) */}
        <form onSubmit={handleSubmit} className="meg-form">
          {seccionActiva === 'personales' && renderSeccionPersonales()}
          {seccionActiva === 'profesionales' && renderSeccionProfesionales()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        {/* Footer (FUERA del form, fijo en el bottom) */}
        <div className="meg-footer">
          <div className="meg-botones-izquierda">
            <button type="button" className="meg-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="meg-botones-derecha">
            <button
              type="button"
              className={`meg-btn-actualizar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Actualizando...' : 'Actualizar Guía'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarGuia;