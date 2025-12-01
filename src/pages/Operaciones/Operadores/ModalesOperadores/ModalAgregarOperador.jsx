import { useState, useCallback } from 'react';
import { X, Save, User, FileText, Image, Phone, Mail, Calendar, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalAgregarOperador.css';
import CredencialOperador from '../Credenciales/CredencialOperador';

const ModalAgregarOperador = ({ onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    correoElectronico: '',
    
    // Teléfonos
    telefonoEmergencia: '',
    telefonoPersonal: '',
    telefonoFamiliar: '',
    
    // Datos de licencia
    numeroLicencia: '',
    fechaVigenciaLicencia: '',
    fechaVencimientoLicencia: '',
    fechaVencimientoExamen: '',
    
    // Comentarios
    comentarios: '',
    
    // Documentos
    foto: null,
    ine: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('personales');
  const [guardando, setGuardando] = useState(false);

  // Función para obtener URL segura de la foto para vista previa
  const obtenerFotoUrl = () => {
    if (!formData.foto) return null;
    if (formData.foto instanceof File) {
      try {
        return URL.createObjectURL(formData.foto);
      } catch (error) {
        console.error('Error al crear URL de foto:', error);
        return null;
      }
    }
    return null;
  };

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

    // Validaciones datos personales (obligatorios)
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.apellidoPaterno.trim()) {
      nuevosErrores.apellidoPaterno = 'El apellido paterno es requerido';
    }

    if (!formData.apellidoMaterno.trim()) {
      nuevosErrores.apellidoMaterno = 'El apellido materno es requerido';
    }

    if (!formData.edad || parseInt(formData.edad) < 18 || parseInt(formData.edad) > 100) {
      nuevosErrores.edad = 'Edad inválida (18-100 años)';
    }

    // Validación de correo electrónico
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correoElectronico.trim()) {
      nuevosErrores.correoElectronico = 'El correo es requerido';
    } else if (!regexEmail.test(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = 'Correo electrónico inválido';
    }

    // Validaciones teléfonos (obligatorios)
    const regexTelefono = /^\d{10}$/;
    
    if (!formData.telefonoEmergencia.trim()) {
      nuevosErrores.telefonoEmergencia = 'El teléfono de emergencia es requerido';
    } else if (!regexTelefono.test(formData.telefonoEmergencia)) {
      nuevosErrores.telefonoEmergencia = 'Debe contener 10 dígitos';
    }

    if (!formData.telefonoPersonal.trim()) {
      nuevosErrores.telefonoPersonal = 'El teléfono personal es requerido';
    } else if (!regexTelefono.test(formData.telefonoPersonal)) {
      nuevosErrores.telefonoPersonal = 'Debe contener 10 dígitos';
    }

    if (formData.telefonoFamiliar && !regexTelefono.test(formData.telefonoFamiliar)) {
      nuevosErrores.telefonoFamiliar = 'Debe contener 10 dígitos';
    }

    // Validaciones licencia (obligatorios)
    if (!formData.numeroLicencia.trim()) {
      nuevosErrores.numeroLicencia = 'El número de licencia es requerido';
    }

    if (!formData.fechaVigenciaLicencia) {
      nuevosErrores.fechaVigenciaLicencia = 'La fecha de vigencia es requerida';
    }

    if (!formData.fechaVencimientoLicencia) {
      nuevosErrores.fechaVencimientoLicencia = 'La fecha de vencimiento es requerida';
    }

    if (!formData.fechaVencimientoExamen) {
      nuevosErrores.fechaVencimientoExamen = 'La fecha de vencimiento del examen es requerida';
    }

    // Validar que la fecha de vencimiento sea posterior a la de vigencia
    if (formData.fechaVigenciaLicencia && formData.fechaVencimientoLicencia) {
      if (new Date(formData.fechaVencimientoLicencia) <= new Date(formData.fechaVigenciaLicencia)) {
        nuevosErrores.fechaVencimientoLicencia = 'Debe ser posterior a la fecha de vigencia';
      }
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

      const camposPersonales = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'edad', 'correoElectronico'];
      const camposTelefonos = ['telefonoEmergencia', 'telefonoPersonal', 'telefonoFamiliar'];
      const camposLicencia = ['numeroLicencia', 'fechaVigenciaLicencia', 'fechaVencimientoLicencia', 'fechaVencimientoExamen'];

      const erroresEnPersonales = Object.keys(nuevosErrores).some(key => camposPersonales.includes(key));
      const erroresEnTelefonos = Object.keys(nuevosErrores).some(key => camposTelefonos.includes(key));
      const erroresEnLicencia = Object.keys(nuevosErrores).some(key => camposLicencia.includes(key));

      if (erroresEnPersonales) {
        setSeccionActiva('personales');
      } else if (erroresEnTelefonos) {
        setSeccionActiva('contacto');
      } else if (erroresEnLicencia) {
        setSeccionActiva('licencia');
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

    console.log('✅ Validación exitosa, guardando operador...');
    setGuardando(true);

    try {
      const operadorData = {
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        edad: parseInt(formData.edad),
        correoElectronico: formData.correoElectronico,
        telefonoEmergencia: formData.telefonoEmergencia,
        telefonoPersonal: formData.telefonoPersonal,
        telefonoFamiliar: formData.telefonoFamiliar,
        numeroLicencia: formData.numeroLicencia,
        fechaVigenciaLicencia: formData.fechaVigenciaLicencia,
        fechaVencimientoLicencia: formData.fechaVencimientoLicencia,
        fechaVencimientoExamen: formData.fechaVencimientoExamen,
        comentarios: formData.comentarios,
        foto: formData.foto,
        ine: formData.ine
      };

      console.log('📦 Datos a guardar:', operadorData);

      // Guardar el nombre del operador antes de cerrar
      const nombreCompleto = `${formData.nombre} ${formData.apellidoPaterno}`;

      // Llamar a la función onGuardar del padre
      await onGuardar(operadorData);

      console.log('✅ Operador guardado, cerrando modal primero...');

      // ✅ PRIMERO: Cerrar el modal
      onCerrar();

      // ✅ SEGUNDO: Esperar un poquito para que el modal se cierre
      await new Promise(resolve => setTimeout(resolve, 300));

      // ✅ TERCERO: Mostrar la alerta DESPUÉS de cerrar el modal
      console.log('✅ Mostrando alerta...');
      await Swal.fire({
        icon: 'success',
        title: '¡Operador Agregado!',
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
          popup: 'swal-popup-custom',
          title: 'swal-title-custom',
          htmlContainer: 'swal-html-custom',
          confirmButton: 'swal-confirm-custom'
        }
      });

      console.log('✅ Alerta cerrada');

    } catch (error) {
      console.error('❌ Error al guardar:', error);

      // Si hay error, también cerrar el modal primero
      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      await Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        html: `
        <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
          <p>Hubo un problema al guardar el operador.</p>
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

    return <span className="modal-agregar-error-mensaje">{error}</span>;
  };

  const renderSeccionPersonales = () => (
    <div className="modal-agregar-form-grid">
      <div className="modal-agregar-form-group">
        <label htmlFor="nombre">
          Nombre <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={errores.nombre ? 'modal-agregar-input-error' : ''}
          placeholder="Ej: Juan"
        />
        <MensajeError nombreCampo="nombre" />
      </div>

      <div className="modal-agregar-form-group">
        <label htmlFor="apellidoPaterno">
          Apellido Paterno <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="text"
          id="apellidoPaterno"
          name="apellidoPaterno"
          value={formData.apellidoPaterno}
          onChange={handleChange}
          className={errores.apellidoPaterno ? 'modal-agregar-input-error' : ''}
          placeholder="Ej: García"
        />
        <MensajeError nombreCampo="apellidoPaterno" />
      </div>

      <div className="modal-agregar-form-group">
        <label htmlFor="apellidoMaterno">
          Apellido Materno <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="text"
          id="apellidoMaterno"
          name="apellidoMaterno"
          value={formData.apellidoMaterno}
          onChange={handleChange}
          className={errores.apellidoMaterno ? 'modal-agregar-input-error' : ''}
          placeholder="Ej: López"
        />
        <MensajeError nombreCampo="apellidoMaterno" />
      </div>

      <div className="modal-agregar-form-group">
        <label htmlFor="edad">
          Edad <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="number"
          id="edad"
          name="edad"
          value={formData.edad}
          onChange={handleChange}
          className={errores.edad ? 'modal-agregar-input-error' : ''}
          placeholder="35"
          min="18"
          max="100"
        />
        <MensajeError nombreCampo="edad" />
      </div>

      <div className="modal-agregar-form-group modal-agregar-form-group-full">
        <label htmlFor="correoElectronico">
          Correo Electrónico <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="email"
          id="correoElectronico"
          name="correoElectronico"
          value={formData.correoElectronico}
          onChange={handleChange}
          className={errores.correoElectronico ? 'modal-agregar-input-error' : ''}
          placeholder="ejemplo@correo.com"
        />
        <MensajeError nombreCampo="correoElectronico" />
      </div>
    </div>
  );

  const renderSeccionContacto = () => (
    <div className="modal-agregar-form-grid">
      <div className="modal-agregar-form-group">
        <label htmlFor="telefonoEmergencia">
          Teléfono de Emergencia <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="tel"
          id="telefonoEmergencia"
          name="telefonoEmergencia"
          value={formData.telefonoEmergencia}
          onChange={handleChange}
          className={errores.telefonoEmergencia ? 'modal-agregar-input-error' : ''}
          placeholder="5551234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefonoEmergencia" />
      </div>

      <div className="modal-agregar-form-group">
        <label htmlFor="telefonoPersonal">
          Teléfono Personal <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="tel"
          id="telefonoPersonal"
          name="telefonoPersonal"
          value={formData.telefonoPersonal}
          onChange={handleChange}
          className={errores.telefonoPersonal ? 'modal-agregar-input-error' : ''}
          placeholder="5559876543"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefonoPersonal" />
      </div>

      <div className="modal-agregar-form-group">
        <label htmlFor="telefonoFamiliar">
          Teléfono Familiar
        </label>
        <input
          type="tel"
          id="telefonoFamiliar"
          name="telefonoFamiliar"
          value={formData.telefonoFamiliar}
          onChange={handleChange}
          className={errores.telefonoFamiliar ? 'modal-agregar-input-error' : ''}
          placeholder="5556547890"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefonoFamiliar" />
      </div>
    </div>
  );

  const renderSeccionLicencia = () => (
    <div className="modal-agregar-form-grid">
      <div className="modal-agregar-form-group">
        <label htmlFor="numeroLicencia">
          Número de Licencia <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="text"
          id="numeroLicencia"
          name="numeroLicencia"
          value={formData.numeroLicencia}
          onChange={handleChange}
          className={errores.numeroLicencia ? 'modal-agregar-input-error' : ''}
          placeholder="LIC-2024-001"
        />
        <MensajeError nombreCampo="numeroLicencia" />
      </div>

      <div className="modal-agregar-form-group">
        <label htmlFor="fechaVigenciaLicencia">
          Fecha de Vigencia <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="date"
          id="fechaVigenciaLicencia"
          name="fechaVigenciaLicencia"
          value={formData.fechaVigenciaLicencia}
          onChange={handleChange}
          className={errores.fechaVigenciaLicencia ? 'modal-agregar-input-error' : ''}
        />
        <MensajeError nombreCampo="fechaVigenciaLicencia" />
      </div>

      <div className="modal-agregar-form-group">
        <label htmlFor="fechaVencimientoLicencia">
          Fecha de Vencimiento <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="date"
          id="fechaVencimientoLicencia"
          name="fechaVencimientoLicencia"
          value={formData.fechaVencimientoLicencia}
          onChange={handleChange}
          className={errores.fechaVencimientoLicencia ? 'modal-agregar-input-error' : ''}
        />
        <MensajeError nombreCampo="fechaVencimientoLicencia" />
      </div>

      <div className="modal-agregar-form-group">
        <label htmlFor="fechaVencimientoExamen">
          Vencimiento de Examen <span className="modal-agregar-required">*</span>
        </label>
        <input
          type="date"
          id="fechaVencimientoExamen"
          name="fechaVencimientoExamen"
          value={formData.fechaVencimientoExamen}
          onChange={handleChange}
          className={errores.fechaVencimientoExamen ? 'modal-agregar-input-error' : ''}
        />
        <MensajeError nombreCampo="fechaVencimientoExamen" />
      </div>

      <div className="modal-agregar-form-group modal-agregar-form-group-full">
        <label htmlFor="comentarios">Comentarios</label>
        <textarea
          id="comentarios"
          name="comentarios"
          value={formData.comentarios}
          onChange={handleChange}
          placeholder="Información adicional sobre el operador..."
          rows="3"
        />
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="modal-agregar-form-grid-documentos">
      <div className="modal-agregar-form-group-file">
        <label htmlFor="foto">
          <Image size={20} />
          Fotografía del Operador
        </label>
        <input
          type="file"
          id="foto"
          name="foto"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto && (
          <span className="modal-agregar-file-name">{formData.foto.name}</span>
        )}
      </div>

      <div className="modal-agregar-form-group-file">
        <label htmlFor="ine">
          <FileText size={20} />
          INE / Identificación Oficial
        </label>
        <input
          type="file"
          id="ine"
          name="ine"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.ine && (
          <span className="modal-agregar-file-name">{formData.ine.name}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-agregar-overlay" onClick={onCerrar}>
      <div className="modal-agregar-contenido modal-agregar-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-agregar-header">
          <h2>Agregar Nuevo Operador</h2>
          <button className="modal-agregar-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="modal-agregar-tabs">
          <button
            className={`modal-agregar-tab-button ${seccionActiva === 'personales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('personales')}
            type="button"
          >
            <User size={18} />
            Datos Personales
          </button>
          <button
            className={`modal-agregar-tab-button ${seccionActiva === 'contacto' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('contacto')}
            type="button"
          >
            <Phone size={18} />
            Contacto
          </button>
          <button
            className={`modal-agregar-tab-button ${seccionActiva === 'licencia' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('licencia')}
            type="button"
          >
            <Calendar size={18} />
            Licencia
          </button>
          <button
            className={`modal-agregar-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <Image size={18} />
            Documentos
          </button>
        </div>

        {/* Contenedor con dos columnas: Formulario + Vista Previa */}
        <div className="modal-agregar-contenedor-principal">
          {/* Columna Izquierda - Formulario */}
          <div className="modal-agregar-columna-formulario">
            <form onSubmit={handleSubmit} className="modal-agregar-form">
              {seccionActiva === 'personales' && renderSeccionPersonales()}
              {seccionActiva === 'contacto' && renderSeccionContacto()}
              {seccionActiva === 'licencia' && renderSeccionLicencia()}
              {seccionActiva === 'documentos' && renderSeccionDocumentos()}
            </form>
          </div>

          {/* Columna Derecha - Vista Previa de Credencial */}
          <div className="modal-agregar-columna-preview">
            <div className="modal-agregar-preview-header">
              <CreditCard size={20} />
              <h3>Vista Previa de Credencial</h3>
            </div>
            <div className="modal-agregar-preview-content">
              <CredencialOperador 
                operador={{
                  ...formData,
                  cargo: 'Conductor', // Valor por defecto
                  foto: obtenerFotoUrl()
                }} 
              />
            </div>
            <div className="modal-agregar-preview-info">
              <FileText size={16} />
              <p>Esta es una vista previa en tiempo real de cómo se verá la credencial del operador.</p>
            </div>
          </div>
        </div>

        {/* Footer (FUERA del form, fijo en el bottom) */}
        <div className="modal-agregar-footer">
          <div className="modal-agregar-botones-izquierda">
            <button type="button" className="modal-agregar-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="modal-agregar-botones-derecha">
            <button
              type="button"
              className={`modal-agregar-btn-guardar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Guardando...' : 'Guardar Operador'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarOperador;