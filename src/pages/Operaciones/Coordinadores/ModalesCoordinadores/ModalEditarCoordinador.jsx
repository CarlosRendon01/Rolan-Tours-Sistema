import { useState, useEffect, useCallback } from 'react';
import { X, Save, User, FileText, Phone, Briefcase } from 'lucide-react';
import './ModalEditarCoordinador.css';
import Swal from 'sweetalert2';

const ModalEditarCoordinador = ({ coordinador, onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    email: '',
    ciudad: '',
    estado: '',

    // Contacto
    telefono: '',
    telefono_emergencia: '',
    contacto_emergencia: '',

    // Profesional
    experiencia_anos: '',
    idiomas: '',
    especialidades: '',
    certificacion_oficial: false,
    costo_dia: '',
    nss: '',
    institucion_seguro: '',

    // Comentarios
    comentarios: '',

    // Documentos
    foto_coordinador: null,
    foto_ine: null,
    foto_certificaciones: null,
    foto_comprobante_domicilio: null,
    contrato_laboral: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('personales');
  const [guardando, setGuardando] = useState(false);

  // Cargar datos del coordinador cuando se abre el modal
  useEffect(() => {
    if (coordinador) {
      setFormData({
        nombre: coordinador.nombre || '',
        apellido_paterno: coordinador.apellido_paterno || '',
        apellido_materno: coordinador.apellido_materno || '',
        fecha_nacimiento: coordinador.fecha_nacimiento || '',
        email: coordinador.email || '',
        ciudad: coordinador.ciudad || '',
        estado: coordinador.estado || '',
        telefono: coordinador.telefono || '',
        telefono_emergencia: coordinador.telefono_emergencia || '',
        contacto_emergencia: coordinador.contacto_emergencia || '',
        experiencia_anos: coordinador.experiencia_anos || '',
        idiomas: coordinador.idiomas || '',
        especialidades: coordinador.especialidades || '',
        certificacion_oficial: coordinador.certificacion_oficial || false,
        costo_dia: coordinador.costo_dia || '',
        nss: coordinador.nss || '',
        institucion_seguro: coordinador.institucion_seguro || '',
        comentarios: coordinador.comentarios || '',
        foto_coordinador: coordinador.foto_coordinador || null,
        foto_ine: coordinador.foto_ine || null,
        foto_certificaciones: coordinador.foto_certificaciones || null,
        foto_comprobante_domicilio: coordinador.foto_comprobante_domicilio || null,
        contrato_laboral: coordinador.contrato_laboral || null
      });
    }
  }, [coordinador]);

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

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarTelefono = (telefono) => {
    const limpio = telefono.replace(/\D/g, '');
    return limpio.length === 10;
  };

  const validarNSS = (nss) => {
    const limpio = nss.replace(/\D/g, '');
    return limpio.length === 11;
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    // Validación datos personales
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
      const edad = calcularEdad(formData.fecha_nacimiento);
      if (edad < 18) {
        nuevosErrores.fecha_nacimiento = 'Debe ser mayor de 18 años';
      } else if (edad > 100) {
        nuevosErrores.fecha_nacimiento = 'La edad no puede ser mayor a 100 años';
      }
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!validarEmail(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (!formData.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }

    if (!formData.estado.trim()) {
      nuevosErrores.estado = 'El estado es requerido';
    }

    // Validación contacto
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    } else if (!validarTelefono(formData.telefono)) {
      nuevosErrores.telefono = 'Debe tener 10 dígitos';
    }

    if (!formData.telefono_emergencia.trim()) {
      nuevosErrores.telefono_emergencia = 'El teléfono de emergencia es requerido';
    } else if (!validarTelefono(formData.telefono_emergencia)) {
      nuevosErrores.telefono_emergencia = 'Debe tener 10 dígitos';
    }

    if (!formData.contacto_emergencia.trim()) {
      nuevosErrores.contacto_emergencia = 'El contacto de emergencia es requerido';
    }

    // Validación profesional
    if (!formData.experiencia_anos || parseInt(formData.experiencia_anos) < 0) {
      nuevosErrores.experiencia_anos = 'Los años de experiencia son requeridos';
    }

    if (!formData.idiomas.trim()) {
      nuevosErrores.idiomas = 'Los idiomas son requeridos';
    }

    if (!formData.especialidades.trim()) {
      nuevosErrores.especialidades = 'Las especialidades son requeridas';
    }

    if (!formData.costo_dia || parseFloat(formData.costo_dia) <= 0) {
      nuevosErrores.costo_dia = 'El costo por día debe ser mayor a 0';
    }

    if (!formData.nss.trim()) {
      nuevosErrores.nss = 'El NSS es requerido';
    } else if (!validarNSS(formData.nss)) {
      nuevosErrores.nss = 'El NSS debe tener 11 dígitos';
    }

    if (!formData.institucion_seguro.trim()) {
      nuevosErrores.institucion_seguro = 'La institución de seguro es requerida';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      // Determinar qué sección tiene errores
      const camposPersonales = ['nombre', 'apellido_paterno', 'apellido_materno', 'fecha_nacimiento', 'email', 'ciudad', 'estado'];
      const camposContacto = ['telefono', 'telefono_emergencia', 'contacto_emergencia'];
      const camposProfesionales = ['experiencia_anos', 'idiomas', 'especialidades', 'costo_dia', 'nss', 'institucion_seguro'];

      const erroresEnPersonales = Object.keys(nuevosErrores).some(key => camposPersonales.includes(key));
      const erroresEnContacto = Object.keys(nuevosErrores).some(key => camposContacto.includes(key));
      const erroresEnProfesionales = Object.keys(nuevosErrores).some(key => camposProfesionales.includes(key));

      if (erroresEnPersonales) {
        setSeccionActiva('personales');
      } else if (erroresEnContacto) {
        setSeccionActiva('contacto');
      } else if (erroresEnProfesionales) {
        setSeccionActiva('profesional');
      }

      // Focus en el primer campo con error
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

    setGuardando(true);

    try {
      const coordinadorData = {
        ...coordinador,
        nombre: formData.nombre,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        fecha_nacimiento: formData.fecha_nacimiento,
        email: formData.email,
        ciudad: formData.ciudad,
        estado: formData.estado,
        telefono: formData.telefono,
        telefono_emergencia: formData.telefono_emergencia,
        contacto_emergencia: formData.contacto_emergencia,
        experiencia_anos: parseInt(formData.experiencia_anos),
        idiomas: formData.idiomas,
        especialidades: formData.especialidades,
        certificacion_oficial: formData.certificacion_oficial,
        costo_dia: parseFloat(formData.costo_dia),
        nss: formData.nss,
        institucion_seguro: formData.institucion_seguro,
        comentarios: formData.comentarios,
        foto_coordinador: formData.foto_coordinador,
        foto_ine: formData.foto_ine,
        foto_certificaciones: formData.foto_certificaciones,
        foto_comprobante_domicilio: formData.foto_comprobante_domicilio,
        contrato_laboral: formData.contrato_laboral
      };

      // Guardar el nombre completo antes de cerrar
      const nombreCompleto = `${formData.nombre} ${formData.apellido_paterno}`;

      // Llamar a la función onGuardar del padre
      await onGuardar(coordinadorData);

      console.log('✅ Coordinador actualizado, cerrando modal primero...');

      // ✅ PRIMERO: Cerrar el modal
      onCerrar();

      // ✅ SEGUNDO: Esperar un poquito para que el modal se cierre
      await new Promise(resolve => setTimeout(resolve, 300));

      // ✅ TERCERO: Mostrar la alerta DESPUÉS de cerrar el modal
      console.log('✅ Mostrando alerta...');
      await Swal.fire({
        icon: 'success',
        title: '¡Coordinador Actualizado!',
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
          popup: 'swal-popup-custom',
          title: 'swal-title-custom',
          htmlContainer: 'swal-html-custom',
          confirmButton: 'swal-confirm-custom'
        }
      });

      console.log('✅ Alerta cerrada');

    } catch (error) {
      console.error('❌ Error al actualizar:', error);

      // Si hay error, también cerrar el modal primero
      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      await Swal.fire({
        icon: 'error',
        title: 'Error al Actualizar',
        html: `
          <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
            <p>Hubo un problema al actualizar el coordinador.</p>
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
  }, [formData, validarFormulario, onGuardar, coordinador, onCerrar]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="mec-error-mensaje">{error}</span>;
  };

  const renderSeccionPersonales = () => (
    <div className="mec-form-grid">
      <div className="mec-form-group">
        <label htmlFor="nombre">
          Nombre <span className="mec-required">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={errores.nombre ? 'input-error' : ''}
          placeholder="Ej: Pedro"
        />
        <MensajeError nombreCampo="nombre" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="apellido_paterno">
          Apellido Paterno <span className="mec-required">*</span>
        </label>
        <input
          type="text"
          id="apellido_paterno"
          name="apellido_paterno"
          value={formData.apellido_paterno}
          onChange={handleChange}
          className={errores.apellido_paterno ? 'input-error' : ''}
          placeholder="Ej: Martínez"
        />
        <MensajeError nombreCampo="apellido_paterno" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="apellido_materno">
          Apellido Materno <span className="mec-required">*</span>
        </label>
        <input
          type="text"
          id="apellido_materno"
          name="apellido_materno"
          value={formData.apellido_materno}
          onChange={handleChange}
          className={errores.apellido_materno ? 'input-error' : ''}
          placeholder="Ej: Flores"
        />
        <MensajeError nombreCampo="apellido_materno" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="fecha_nacimiento">
          Fecha de Nacimiento <span className="mec-required">*</span>
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

      <div className="mec-form-group">
        <label htmlFor="email">
          Correo Electrónico <span className="mec-required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errores.email ? 'input-error' : ''}
          placeholder="ejemplo@correo.com"
        />
        <MensajeError nombreCampo="email" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="ciudad">
          Ciudad <span className="mec-required">*</span>
        </label>
        <input
          type="text"
          id="ciudad"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          className={errores.ciudad ? 'input-error' : ''}
          placeholder="Ej: Ciudad de México"
        />
        <MensajeError nombreCampo="ciudad" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="estado">
          Estado <span className="mec-required">*</span>
        </label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className={errores.estado ? 'input-error' : ''}
        >
          <option value="">Selecciona un estado</option>
          <option value="Aguascalientes">Aguascalientes</option>
          <option value="Baja California">Baja California</option>
          <option value="Baja California Sur">Baja California Sur</option>
          <option value="Campeche">Campeche</option>
          <option value="Chiapas">Chiapas</option>
          <option value="Chihuahua">Chihuahua</option>
          <option value="CDMX">Ciudad de México</option>
          <option value="Coahuila">Coahuila</option>
          <option value="Colima">Colima</option>
          <option value="Durango">Durango</option>
          <option value="Guanajuato">Guanajuato</option>
          <option value="Guerrero">Guerrero</option>
          <option value="Hidalgo">Hidalgo</option>
          <option value="Jalisco">Jalisco</option>
          <option value="Estado de México">Estado de México</option>
          <option value="Michoacán">Michoacán</option>
          <option value="Morelos">Morelos</option>
          <option value="Nayarit">Nayarit</option>
          <option value="Nuevo León">Nuevo León</option>
          <option value="Oaxaca">Oaxaca</option>
          <option value="Puebla">Puebla</option>
          <option value="Querétaro">Querétaro</option>
          <option value="Quintana Roo">Quintana Roo</option>
          <option value="San Luis Potosí">San Luis Potosí</option>
          <option value="Sinaloa">Sinaloa</option>
          <option value="Sonora">Sonora</option>
          <option value="Tabasco">Tabasco</option>
          <option value="Tamaulipas">Tamaulipas</option>
          <option value="Tlaxcala">Tlaxcala</option>
          <option value="Veracruz">Veracruz</option>
          <option value="Yucatán">Yucatán</option>
          <option value="Zacatecas">Zacatecas</option>
        </select>
        <MensajeError nombreCampo="estado" />
      </div>
    </div>
  );

  const renderSeccionContacto = () => (
    <div className="mec-form-grid">
      <div className="mec-form-group">
        <label htmlFor="telefono">
          Teléfono Personal <span className="mec-required">*</span>
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={errores.telefono ? 'input-error' : ''}
          placeholder="5551234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="telefono_emergencia">
          Teléfono de Emergencia <span className="mec-required">*</span>
        </label>
        <input
          type="tel"
          id="telefono_emergencia"
          name="telefono_emergencia"
          value={formData.telefono_emergencia}
          onChange={handleChange}
          className={errores.telefono_emergencia ? 'input-error' : ''}
          placeholder="5559876543"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono_emergencia" />
      </div>

      <div className="mec-form-group form-group-full">
        <label htmlFor="contacto_emergencia">
          Nombre del Contacto de Emergencia <span className="mec-required">*</span>
        </label>
        <input
          type="text"
          id="contacto_emergencia"
          name="contacto_emergencia"
          value={formData.contacto_emergencia}
          onChange={handleChange}
          className={errores.contacto_emergencia ? 'input-error' : ''}
          placeholder="Ej: María Flores"
        />
        <MensajeError nombreCampo="contacto_emergencia" />
      </div>
    </div>
  );

  const renderSeccionProfesional = () => (
    <div className="mec-form-grid">
      <div className="mec-form-group">
        <label htmlFor="experiencia_anos">
          Años de Experiencia <span className="mec-required">*</span>
        </label>
        <input
          type="number"
          id="experiencia_anos"
          name="experiencia_anos"
          value={formData.experiencia_anos}
          onChange={handleChange}
          className={errores.experiencia_anos ? 'input-error' : ''}
          placeholder="5"
          min="0"
        />
        <MensajeError nombreCampo="experiencia_anos" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="costo_dia">
          Costo por Día (MXN) <span className="mec-required">*</span>
        </label>
        <input
          type="number"
          id="costo_dia"
          name="costo_dia"
          value={formData.costo_dia}
          onChange={handleChange}
          className={errores.costo_dia ? 'input-error' : ''}
          placeholder="1200"
          min="0"
          step="0.01"
        />
        <MensajeError nombreCampo="costo_dia" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="idiomas">
          Idiomas <span className="mec-required">*</span>
        </label>
        <input
          type="text"
          id="idiomas"
          name="idiomas"
          value={formData.idiomas}
          onChange={handleChange}
          className={errores.idiomas ? 'input-error' : ''}
          placeholder="Español, Inglés"
        />
        <MensajeError nombreCampo="idiomas" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="nss">
          NSS (Número de Seguridad Social) <span className="mec-required">*</span>
        </label>
        <input
          type="text"
          id="nss"
          name="nss"
          value={formData.nss}
          onChange={handleChange}
          className={errores.nss ? 'input-error' : ''}
          placeholder="12345678901"
          maxLength="11"
        />
        <MensajeError nombreCampo="nss" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="institucion_seguro">
          Institución de Seguro <span className="mec-required">*</span>
        </label>
        <select
          id="institucion_seguro"
          name="institucion_seguro"
          value={formData.institucion_seguro}
          onChange={handleChange}
          className={errores.institucion_seguro ? 'input-error' : ''}
        >
          <option value="">Selecciona una institución</option>
          <option value="IMSS">IMSS</option>
          <option value="ISSSTE">ISSSTE</option>
          <option value="Seguro Popular">Seguro Popular</option>
          <option value="Privado">Privado</option>
          <option value="Otro">Otro</option>
        </select>
        <MensajeError nombreCampo="institucion_seguro" />
      </div>

      <div className="mec-form-group">
        <label htmlFor="certificacion_oficial">
          <div className="mec-checkbox-container">
            <input
              type="checkbox"
              id="certificacion_oficial"
              name="certificacion_oficial"
              checked={formData.certificacion_oficial}
              onChange={handleChange}
            />
            <span className="mec-checkbox-label">Certificación Oficial</span>
          </div>
        </label>
      </div>

      <div className="mec-form-group form-group-full">
        <label htmlFor="especialidades">
          Especialidades <span className="mec-required">*</span>
        </label>
        <textarea
          id="especialidades"
          name="especialidades"
          value={formData.especialidades}
          onChange={handleChange}
          className={errores.especialidades ? 'input-error' : ''}
          placeholder="Logística, Gestión de equipos, etc."
          rows="2"
        />
        <MensajeError nombreCampo="especialidades" />
      </div>

      <div className="mec-form-group form-group-full">
        <label htmlFor="comentarios">Comentarios</label>
        <textarea
          id="comentarios"
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
    <div className="mec-form-grid-documentos">
      <div className="mec-form-group-file">
        <label htmlFor="foto_coordinador">
          <User size={20} />
          Fotografía del Coordinador
        </label>
        <input
          type="file"
          id="foto_coordinador"
          name="foto_coordinador"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_coordinador && (
          <span className="mec-file-name">
            {typeof formData.foto_coordinador === 'string'
              ? 'Archivo existente'
              : formData.foto_coordinador.name}
          </span>
        )}
      </div>

      <div className="mec-form-group-file">
        <label htmlFor="foto_ine">
          <FileText size={20} />
          INE
        </label>
        <input
          type="file"
          id="foto_ine"
          name="foto_ine"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_ine && (
          <span className="mec-file-name">
            {typeof formData.foto_ine === 'string'
              ? 'Archivo existente'
              : formData.foto_ine.name}
          </span>
        )}
      </div>

      <div className="mec-form-group-file">
        <label htmlFor="foto_certificaciones">
          <FileText size={20} />
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
          <span className="mec-file-name">
            {typeof formData.foto_certificaciones === 'string'
              ? 'Archivo existente'
              : formData.foto_certificaciones.name}
          </span>
        )}
      </div>

      <div className="mec-form-group-file">
        <label htmlFor="foto_comprobante_domicilio">
          <FileText size={20} />
          Comprobante de Domicilio
        </label>
        <input
          type="file"
          id="foto_comprobante_domicilio"
          name="foto_comprobante_domicilio"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_comprobante_domicilio && (
          <span className="mec-file-name">
            {typeof formData.foto_comprobante_domicilio === 'string'
              ? 'Archivo existente'
              : formData.foto_comprobante_domicilio.name}
          </span>
        )}
      </div>

      <div className="mec-form-group-file">
        <label htmlFor="contrato_laboral">
          <FileText size={20} />
          Contrato Laboral
        </label>
        <input
          type="file"
          id="contrato_laboral"
          name="contrato_laboral"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.contrato_laboral && (
          <span className="mec-file-name">
            {typeof formData.contrato_laboral === 'string'
              ? 'Archivo existente'
              : formData.contrato_laboral.name}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="mec-overlay" onClick={onCerrar}>
      <div className="mec-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mec-header">
          <h2>Editar Coordinador</h2>
          <button className="mec-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="mec-tabs">
          <button
            className={`mec-tab-button ${seccionActiva === 'personales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('personales')}
            type="button"
          >
            <User size={18} />
            Datos Personales
          </button>
          <button
            className={`mec-tab-button ${seccionActiva === 'contacto' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('contacto')}
            type="button"
          >
            <Phone size={18} />
            Contacto
          </button>
          <button
            className={`mec-tab-button ${seccionActiva === 'profesional' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('profesional')}
            type="button"
          >
            <Briefcase size={18} />
            Información Profesional
          </button>
          <button
            className={`mec-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <FileText size={18} />
            Documentos
          </button>
        </div>

        {/* Formulario (scrolleable) */}
        <form onSubmit={handleSubmit} className="mec-form">
          {seccionActiva === 'personales' && renderSeccionPersonales()}
          {seccionActiva === 'contacto' && renderSeccionContacto()}
          {seccionActiva === 'profesional' && renderSeccionProfesional()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        {/* Footer (FUERA del form, fijo en el bottom) */}
        <div className="mec-footer">
          <div className="mec-botones-izquierda">
            <button type="button" className="mec-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="mec-botones-derecha">
            <button
              type="button"
              className={`mec-btn-actualizar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Actualizando...' : 'Actualizar Coordinador'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarCoordinador;