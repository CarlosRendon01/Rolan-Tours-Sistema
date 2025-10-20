import { useState, useEffect, useCallback } from 'react';
import { X, Save, User, FileText } from 'lucide-react';
import './ModalEditarReserva.css';
import Swal from 'sweetalert2';

const ModalEditarReserva = ({ reserva, onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    // Campos básicos
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    email: '',
    costoDia: '',

    // Campos adicionales
    fechaNacimiento: '',
    rfc: '',
    curp: '',
    nss: '',
    domicilio: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    tipoSangre: '',
    contactoEmergencia: '',
    telefonoEmergencia: '',
    idiomas: '',
    experienciaAnos: '',
    especialidades: '',
    comentarios: '',

    // Documentos
    foto: null,
    ine: null,
    licencia: null,
    comprobanteDomicilio: null,
    certificaciones: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('basicos');
  const [guardando, setGuardando] = useState(false);

  // Cargar datos del guía cuando se abre el modal
  useEffect(() => {
    if (reserva) {
      // Convertir idiomas de array a string si es necesario
      const idiomasString = Array.isArray(reserva.idiomas)
        ? reserva.idiomas.join(', ')
        : reserva.idiomas || '';

      setFormData({
        // Campos básicos
        nombre: reserva.nombre || '',
        apellidoPaterno: reserva.apellidoPaterno || '',
        apellidoMaterno: reserva.apellidoMaterno || '',
        telefono: reserva.telefonoPersonal || '',
        email: reserva.correoElectronico || '',
        costoDia: reserva.costoDia || '',

        // Campos adicionales
        fechaNacimiento: reserva.fechaNacimiento || '',
        rfc: reserva.rfc || '',
        curp: reserva.curp || '',
        nss: reserva.nss || '',
        domicilio: reserva.domicilio || '',
        ciudad: reserva.ciudad || '',
        estado: reserva.estado || '',
        codigoPostal: reserva.codigoPostal || '',
        tipoSangre: reserva.tipoSangre || '',
        contactoEmergencia: reserva.contactoEmergencia || '',
        telefonoEmergencia: reserva.telefonoEmergencia || '',
        idiomas: idiomasString,
        experienciaAnos: reserva.experienciaAnos || '',
        especialidades: reserva.especialidades || '',
        comentarios: reserva.comentarios || '',

        // Documentos
        foto: reserva.foto || reserva.documentos?.foto_reserva || null,
        ine: reserva.ine || reserva.documentos?.foto_ine || null,
        licencia: reserva.documentos?.foto_licencia || null,
        comprobanteDomicilio: reserva.documentos?.foto_comprobante_domicilio || null,
        certificaciones: reserva.certificado || reserva.documentos?.foto_certificaciones || null
      });
    }
  }, [reserva]);

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

    // Validaciones campos básicos (obligatorios)
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.apellidoPaterno.trim()) {
      nuevosErrores.apellidoPaterno = 'El apellido paterno es requerido';
    }

    if (!formData.apellidoMaterno.trim()) {
      nuevosErrores.apellidoMaterno = 'El apellido materno es requerido';
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

    if (!formData.costoDia || parseFloat(formData.costoDia) <= 0) {
      nuevosErrores.costoDia = 'El costo debe ser mayor a 0';
    }

    // Validaciones campos adicionales (obligatorios)
    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'La fecha es requerida';
    } else {
      // Validar que sea mayor de 18 años
      const fechaNac = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }
      if (edad < 18) {
        nuevosErrores.fechaNacimiento = 'Debe ser mayor de 18 años';
      }
    }

    if (!formData.domicilio.trim()) {
      nuevosErrores.domicilio = 'El domicilio es requerido';
    }

    if (!formData.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }

    if (!formData.estado.trim()) {
      nuevosErrores.estado = 'El estado es requerido';
    }

    // Validar código postal (5 dígitos)
    const cpRegex = /^\d{5}$/;
    if (!formData.codigoPostal || !cpRegex.test(formData.codigoPostal)) {
      nuevosErrores.codigoPostal = 'Debe tener 5 dígitos';
    }

    if (!formData.contactoEmergencia.trim()) {
      nuevosErrores.contactoEmergencia = 'Contacto requerido';
    }

    if (!formData.telefonoEmergencia || !telefonoRegex.test(formData.telefonoEmergencia)) {
      nuevosErrores.telefonoEmergencia = 'Debe tener 10 dígitos';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      // Determinar qué sección tiene errores
      const camposBasicos = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'telefono', 'email', 'costoDia'];
      const camposAdicionales = ['fechaNacimiento', 'rfc', 'curp', 'nss', 'domicilio', 'ciudad', 'estado', 'codigoPostal', 'tipoSangre', 'contactoEmergencia', 'telefonoEmergencia', 'idiomas', 'experienciaAnos', 'especialidades'];

      const erroresEnBasicos = Object.keys(nuevosErrores).some(key => camposBasicos.includes(key));
      const erroresEnAdicionales = Object.keys(nuevosErrores).some(key => camposAdicionales.includes(key));

      if (erroresEnBasicos) {
        setSeccionActiva('basicos');
      } else if (erroresEnAdicionales) {
        setSeccionActiva('adicionales');
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
      // Convertir idiomas de string a array
      const idiomasArray = formData.idiomas
        .split(',')
        .map(idioma => idioma.trim())
        .filter(idioma => idioma.length > 0);

      // Calcular edad desde fecha de nacimiento
      const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
          edad--;
        }
        return edad;
      };

      const reservaData = {
        ...reserva,
        // Campos básicos
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        telefonoPersonal: formData.telefono,
        correoElectronico: formData.email,
        costoDia: parseFloat(formData.costoDia),

        // Campos adicionales
        fechaNacimiento: formData.fechaNacimiento,
        edad: calcularEdad(formData.fechaNacimiento),
        rfc: formData.rfc,
        curp: formData.curp,
        nss: formData.nss,
        domicilio: formData.domicilio,
        ciudad: formData.ciudad,
        estado: formData.estado,
        codigoPostal: formData.codigoPostal,
        tipoSangre: formData.tipoSangre,
        contactoEmergencia: formData.contactoEmergencia,
        telefonoEmergencia: formData.telefonoEmergencia,
        idiomas: idiomasArray,
        experienciaAnos: formData.experienciaAnos ? parseInt(formData.experienciaAnos) : null,
        especialidades: formData.especialidades,
        comentarios: formData.comentarios,

        // Documentos
        foto: formData.foto,
        ine: formData.ine,
        documentos: {
          foto_reserva: formData.foto,
          foto_ine: formData.ine,
          foto_licencia: formData.licencia,
          foto_comprobante_domicilio: formData.comprobanteDomicilio,
          foto_certificaciones: formData.certificaciones
        }
      };

      // Guardar el nombre completo antes de cerrar
      const nombreCompleto = `${formData.nombre} ${formData.apellidoPaterno}`;

      // Llamar a la función onGuardar del padre
      await onGuardar(reservaData);

      console.log('✅ Guía actualizado, cerrando modal primero...');

      // ✅ PRIMERO: Cerrar el modal
      onCerrar();

      // ✅ SEGUNDO: Esperar un poquito para que el modal se cierre
      await new Promise(resolve => setTimeout(resolve, 300));

      // ✅ TERCERO: Mostrar la alerta DESPUÉS de cerrar el modal
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
          popup: 'swal-popup-custom-reserva',
          title: 'swal-title-custom-reserva',
          htmlContainer: 'swal-html-custom-reserva',
          confirmButton: 'swal-confirm-custom-reserva'
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
  }, [formData, validarFormulario, onGuardar, reserva, onCerrar]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="meg-error-mensaje">{error}</span>;
  };

  const renderSeccionBasicos = () => (
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
          placeholder="Ej: María"
        />
        <MensajeError nombreCampo="nombre" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="apellidoPaterno">
          Apellido Paterno <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="apellidoPaterno"
          name="apellidoPaterno"
          value={formData.apellidoPaterno}
          onChange={handleChange}
          className={errores.apellidoPaterno ? 'input-error' : ''}
          placeholder="Ej: Fernández"
        />
        <MensajeError nombreCampo="apellidoPaterno" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="apellidoMaterno">
          Apellido Materno <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="apellidoMaterno"
          name="apellidoMaterno"
          value={formData.apellidoMaterno}
          onChange={handleChange}
          className={errores.apellidoMaterno ? 'input-error' : ''}
          placeholder="Ej: Rodríguez"
        />
        <MensajeError nombreCampo="apellidoMaterno" />
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
          placeholder="reserva@ejemplo.com"
        />
        <MensajeError nombreCampo="email" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="costoDia">
          Costo por Día (MXN) <span className="meg-required">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="costoDia"
          name="costoDia"
          value={formData.costoDia}
          onChange={handleChange}
          className={errores.costoDia ? 'input-error' : ''}
          placeholder="800.00"
        />
        <MensajeError nombreCampo="costoDia" />
      </div>
    </div>
  );

  const renderSeccionAdicionales = () => (
    <div className="meg-form-grid">
      <div className="meg-form-group">
        <label htmlFor="fechaNacimiento">
          Fecha de Nacimiento <span className="meg-required">*</span>
        </label>
        <input
          type="date"
          id="fechaNacimiento"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          className={errores.fechaNacimiento ? 'input-error' : ''}
        />
        <MensajeError nombreCampo="fechaNacimiento" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="rfc">RFC</label>
        <input
          type="text"
          id="rfc"
          name="rfc"
          value={formData.rfc}
          onChange={handleChange}
          placeholder="LOPC850101ABC"
          maxLength="13"
        />
      </div>

      <div className="meg-form-group">
        <label htmlFor="curp">CURP</label>
        <input
          type="text"
          id="curp"
          name="curp"
          value={formData.curp}
          onChange={handleChange}
          placeholder="LOPC850101HOCSRR01"
          maxLength="18"
        />
      </div>

      <div className="meg-form-group">
        <label htmlFor="nss">NSS</label>
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

      <div className="meg-form-group form-group-full">
        <label htmlFor="domicilio">
          Domicilio <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="domicilio"
          name="domicilio"
          value={formData.domicilio}
          onChange={handleChange}
          className={errores.domicilio ? 'input-error' : ''}
          placeholder="Calle, Número, Colonia"
        />
        <MensajeError nombreCampo="domicilio" />
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
        <label htmlFor="codigoPostal">
          Código Postal <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="codigoPostal"
          name="codigoPostal"
          value={formData.codigoPostal}
          onChange={handleChange}
          className={errores.codigoPostal ? 'input-error' : ''}
          placeholder="68000"
          maxLength="5"
        />
        <MensajeError nombreCampo="codigoPostal" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="tipoSangre">Tipo de Sangre</label>
        <select
          id="tipoSangre"
          name="tipoSangre"
          value={formData.tipoSangre}
          onChange={handleChange}
        >
          <option value="">Seleccionar</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      <div className="meg-form-group">
        <label htmlFor="contactoEmergencia">
          Contacto de Emergencia <span className="meg-required">*</span>
        </label>
        <input
          type="text"
          id="contactoEmergencia"
          name="contactoEmergencia"
          value={formData.contactoEmergencia}
          onChange={handleChange}
          className={errores.contactoEmergencia ? 'input-error' : ''}
          placeholder="Nombre completo"
        />
        <MensajeError nombreCampo="contactoEmergencia" />
      </div>

      <div className="meg-form-group">
        <label htmlFor="telefonoEmergencia">
          Teléfono de Emergencia <span className="meg-required">*</span>
        </label>
        <input
          type="tel"
          id="telefonoEmergencia"
          name="telefonoEmergencia"
          value={formData.telefonoEmergencia}
          onChange={handleChange}
          className={errores.telefonoEmergencia ? 'input-error' : ''}
          placeholder="9511234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefonoEmergencia" />
      </div>

      <div className="meg-form-group">
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

      <div className="meg-form-group">
        <label htmlFor="experienciaAnos">Años de Experiencia</label>
        <input
          type="number"
          id="experienciaAnos"
          name="experienciaAnos"
          value={formData.experienciaAnos}
          onChange={handleChange}
          placeholder="5"
          min="0"
        />
      </div>

      <div className="meg-form-group form-group-full">
        <label htmlFor="especialidades">Especialidades</label>
        <textarea
          id="especialidades"
          name="especialidades"
          value={formData.especialidades}
          onChange={handleChange}
          placeholder="Turismo cultural, ecoturismo, tours históricos..."
          rows="2"
        />
      </div>

      <div className="meg-form-group form-group-full">
        <label htmlFor="comentarios">Comentarios</label>
        <textarea
          id="comentarios"
          name="comentarios"
          value={formData.comentarios}
          onChange={handleChange}
          placeholder="Información adicional sobre el guía..."
          rows="3"
        />
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="meg-form-grid-documentos">
      <div className="meg-form-group-file">
        <label htmlFor="foto">
          <User size={20} />
          Foto del Guía
        </label>
        <input
          type="file"
          id="foto"
          name="foto"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto && (
          <span className="meg-file-name">
            {typeof formData.foto === 'string'
              ? 'Archivo existente'
              : formData.foto.name}
          </span>
        )}
      </div>

      <div className="meg-form-group-file">
        <label htmlFor="ine">
          <FileText size={20} />
          INE / Identificación
        </label>
        <input
          type="file"
          id="ine"
          name="ine"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.ine && (
          <span className="meg-file-name">
            {typeof formData.ine === 'string'
              ? 'Archivo existente'
              : formData.ine.name}
          </span>
        )}
      </div>

      <div className="meg-form-group-file">
        <label htmlFor="licencia">
          <FileText size={20} />
          Licencia de Conducir
        </label>
        <input
          type="file"
          id="licencia"
          name="licencia"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.licencia && (
          <span className="meg-file-name">
            {typeof formData.licencia === 'string'
              ? 'Archivo existente'
              : formData.licencia.name}
          </span>
        )}
      </div>

      <div className="meg-form-group-file">
        <label htmlFor="comprobanteDomicilio">
          <FileText size={20} />
          Comprobante de Domicilio
        </label>
        <input
          type="file"
          id="comprobanteDomicilio"
          name="comprobanteDomicilio"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.comprobanteDomicilio && (
          <span className="meg-file-name">
            {typeof formData.comprobanteDomicilio === 'string'
              ? 'Archivo existente'
              : formData.comprobanteDomicilio.name}
          </span>
        )}
      </div>

      <div className="meg-form-group-file">
        <label htmlFor="certificaciones">
          <FileText size={20} />
          Certificaciones
        </label>
        <input
          type="file"
          id="certificaciones"
          name="certificaciones"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.certificaciones && (
          <span className="meg-file-name">
            {typeof formData.certificaciones === 'string'
              ? 'Archivo existente'
              : formData.certificaciones.name}
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
            className={`meg-tab-button ${seccionActiva === 'basicos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('basicos')}
            type="button"
          >
            <User size={18} />
            Datos Básicos
          </button>
          <button
            className={`meg-tab-button ${seccionActiva === 'adicionales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('adicionales')}
            type="button"
          >
            <FileText size={18} />
            Información Adicional
          </button>
          <button
            className={`meg-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <FileText size={18} />
            Documentos
          </button>
        </div>

        {/* Formulario (scrolleable) */}
        <form onSubmit={handleSubmit} className="meg-form">
          {seccionActiva === 'basicos' && renderSeccionBasicos()}
          {seccionActiva === 'adicionales' && renderSeccionAdicionales()}
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

export default ModalEditarReserva;