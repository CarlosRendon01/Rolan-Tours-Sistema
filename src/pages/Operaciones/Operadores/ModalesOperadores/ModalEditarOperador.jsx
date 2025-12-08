import { useState, useEffect, useCallback } from 'react';
import { X, Save, User, FileText, CreditCard, Phone } from 'lucide-react';
import './ModalEditarOperador.css';
import Swal from 'sweetalert2';
import CredencialOperador from '../Credenciales/CredencialOperador';

const ModalEditarOperador = ({ operador, onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    correoElectronico: '',

    // Teléfonos
    telefonoPersonal: '',
    telefonoEmergencia: '',
    telefonoFamiliar: '',

    // Licencia
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
    if (typeof formData.foto === 'string') {
      return formData.foto;
    }
    return null;
  };

  // Cargar datos del operador cuando se abre el modal
  useEffect(() => {
    if (operador) {
      setFormData({
        nombre: operador.nombre || '',
        apellidoPaterno: operador.apellidoPaterno || '',
        apellidoMaterno: operador.apellidoMaterno || '',
        edad: operador.edad || '',
        correoElectronico: operador.correoElectronico || '',
        telefonoPersonal: operador.telefonoPersonal || '',
        telefonoEmergencia: operador.telefonoEmergencia || '',
        telefonoFamiliar: operador.telefonoFamiliar || '',
        numeroLicencia: operador.numeroLicencia || '',
        fechaVigenciaLicencia: operador.fechaVigenciaLicencia || '',
        fechaVencimientoLicencia: operador.fechaVencimientoLicencia || '',
        fechaVencimientoExamen: operador.fechaVencimientoExamen || '',
        comentarios: operador.comentarios || '',
        foto: operador.foto || null,
        ine: operador.ine || null
      });
    }
  }, [operador]);

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

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarTelefono = (telefono) => {
    const limpio = telefono.replace(/\D/g, '');
    return limpio.length === 10;
  };

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    // Validación datos personales
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
      nuevosErrores.edad = 'La edad debe estar entre 18 y 100 años';
    }

    if (formData.correoElectronico && !validarEmail(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = 'Email inválido';
    }

    // Validación teléfonos
    if (!formData.telefonoPersonal.trim()) {
      nuevosErrores.telefonoPersonal = 'El teléfono personal es requerido';
    } else if (!validarTelefono(formData.telefonoPersonal)) {
      nuevosErrores.telefonoPersonal = 'Debe tener 10 dígitos';
    }

    if (!formData.telefonoEmergencia.trim()) {
      nuevosErrores.telefonoEmergencia = 'El teléfono de emergencia es requerido';
    } else if (!validarTelefono(formData.telefonoEmergencia)) {
      nuevosErrores.telefonoEmergencia = 'Debe tener 10 dígitos';
    }

    if (formData.telefonoFamiliar && !validarTelefono(formData.telefonoFamiliar)) {
      nuevosErrores.telefonoFamiliar = 'Debe tener 10 dígitos';
    }

    // Validación licencia
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
      const vigencia = new Date(formData.fechaVigenciaLicencia);
      const vencimiento = new Date(formData.fechaVencimientoLicencia);
      if (vencimiento <= vigencia) {
        nuevosErrores.fechaVencimientoLicencia = 'Debe ser posterior a la fecha de vigencia';
      }
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      // Determinar qué sección tiene errores
      const camposPersonales = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'edad', 'correoElectronico'];
      const camposContacto = ['telefonoPersonal', 'telefonoEmergencia', 'telefonoFamiliar'];
      const camposLicencia = ['numeroLicencia', 'fechaVigenciaLicencia', 'fechaVencimientoLicencia', 'fechaVencimientoExamen'];

      const erroresEnPersonales = Object.keys(nuevosErrores).some(key => camposPersonales.includes(key));
      const erroresEnContacto = Object.keys(nuevosErrores).some(key => camposContacto.includes(key));
      const erroresEnLicencia = Object.keys(nuevosErrores).some(key => camposLicencia.includes(key));

      if (erroresEnPersonales) {
        setSeccionActiva('personales');
      } else if (erroresEnContacto) {
        setSeccionActiva('contacto');
      } else if (erroresEnLicencia) {
        setSeccionActiva('licencia');
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
      const operadorData = {
        ...operador,
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        edad: parseInt(formData.edad),
        correoElectronico: formData.correoElectronico,
        telefonoPersonal: formData.telefonoPersonal,
        telefonoEmergencia: formData.telefonoEmergencia,
        telefonoFamiliar: formData.telefonoFamiliar,
        numeroLicencia: formData.numeroLicencia,
        fechaVigenciaLicencia: formData.fechaVigenciaLicencia,
        fechaVencimientoLicencia: formData.fechaVencimientoLicencia,
        fechaVencimientoExamen: formData.fechaVencimientoExamen,
        comentarios: formData.comentarios,
        foto: formData.foto,
        ine: formData.ine
      };

      // Guardar el nombre completo antes de cerrar
      const nombreCompleto = `${formData.nombre} ${formData.apellidoPaterno}`;

      // ✅ ESPERAR a que la petición al backend termine completamente
      await onGuardar(operadorData);

      console.log('✅ Operador actualizado exitosamente en el backend');

      // ✅ AHORA SÍ: Cerrar el modal DESPUÉS de que se guardó en el backend
      onCerrar();

      // ✅ Esperar un poquito para que el modal se cierre
      await new Promise(resolve => setTimeout(resolve, 300));

      // ✅ Mostrar la alerta de éxito
      console.log('✅ Mostrando alerta...');
      await Swal.fire({
        icon: 'success',
        title: '¡Operador Actualizado!',
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

    } catch (error) {
      console.error('❌ Error al actualizar:', error);

      // Si hay error, cerrar el modal
      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      await Swal.fire({
        icon: 'error',
        title: 'Error al Actualizar',
        html: `
      <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
        <p>Hubo un problema al actualizar el operador.</p>
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
  }, [formData, validarFormulario, onGuardar, operador, onCerrar]);
  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="meo-error-mensaje">{error}</span>;
  };


  const renderSeccionPersonales = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="nombre">
          Nombre <span className="meo-required">*</span>
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

      <div className="meo-form-group">
        <label htmlFor="apellidoPaterno">
          Apellido Paterno <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="apellidoPaterno"
          name="apellidoPaterno"
          value={formData.apellidoPaterno}
          onChange={handleChange}
          className={errores.apellidoPaterno ? 'input-error' : ''}
          placeholder="Ej: García"
        />
        <MensajeError nombreCampo="apellidoPaterno" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="apellidoMaterno">
          Apellido Materno <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="apellidoMaterno"
          name="apellidoMaterno"
          value={formData.apellidoMaterno}
          onChange={handleChange}
          className={errores.apellidoMaterno ? 'input-error' : ''}
          placeholder="Ej: López"
        />
        <MensajeError nombreCampo="apellidoMaterno" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="edad">
          Edad <span className="meo-required">*</span>
        </label>
        <input
          type="number"
          id="edad"
          name="edad"
          value={formData.edad}
          onChange={handleChange}
          className={errores.edad ? 'input-error' : ''}
          placeholder="35"
          min="18"
          max="100"
        />
        <MensajeError nombreCampo="edad" />
      </div>

      <div className="meo-form-group form-group-full">
        <label htmlFor="correoElectronico">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="correoElectronico"
          name="correoElectronico"
          value={formData.correoElectronico}
          onChange={handleChange}
          className={errores.correoElectronico ? 'input-error' : ''}
          placeholder="ejemplo@correo.com"
        />
        <MensajeError nombreCampo="correoElectronico" />
      </div>

      <div className="meo-form-group form-group-full">
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

  const renderSeccionContacto = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="telefonoPersonal">
          Teléfono Personal <span className="meo-required">*</span>
        </label>
        <input
          type="tel"
          id="telefonoPersonal"
          name="telefonoPersonal"
          value={formData.telefonoPersonal}
          onChange={handleChange}
          className={errores.telefonoPersonal ? 'input-error' : ''}
          placeholder="5551234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefonoPersonal" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="telefonoEmergencia">
          Teléfono de Emergencia <span className="meo-required">*</span>
        </label>
        <input
          type="tel"
          id="telefonoEmergencia"
          name="telefonoEmergencia"
          value={formData.telefonoEmergencia}
          onChange={handleChange}
          className={errores.telefonoEmergencia ? 'input-error' : ''}
          placeholder="5559876543"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefonoEmergencia" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="telefonoFamiliar">
          Teléfono Familiar
        </label>
        <input
          type="tel"
          id="telefonoFamiliar"
          name="telefonoFamiliar"
          value={formData.telefonoFamiliar}
          onChange={handleChange}
          className={errores.telefonoFamiliar ? 'input-error' : ''}
          placeholder="5556547890"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefonoFamiliar" />
      </div>
    </div>
  );

  const renderSeccionLicencia = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="numeroLicencia">
          Número de Licencia <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="numeroLicencia"
          name="numeroLicencia"
          value={formData.numeroLicencia}
          onChange={handleChange}
          className={errores.numeroLicencia ? 'input-error' : ''}
          placeholder="LIC-2024-001"
        />
        <MensajeError nombreCampo="numeroLicencia" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="fechaVigenciaLicencia">
          Fecha de Vigencia <span className="meo-required">*</span>
        </label>
        <input
          type="date"
          id="fechaVigenciaLicencia"
          name="fechaVigenciaLicencia"
          value={formData.fechaVigenciaLicencia}
          onChange={handleChange}
          className={errores.fechaVigenciaLicencia ? 'input-error' : ''}
        />
        <MensajeError nombreCampo="fechaVigenciaLicencia" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="fechaVencimientoLicencia">
          Fecha de Vencimiento de Licencia <span className="meo-required">*</span>
        </label>
        <input
          type="date"
          id="fechaVencimientoLicencia"
          name="fechaVencimientoLicencia"
          value={formData.fechaVencimientoLicencia}
          onChange={handleChange}
          className={errores.fechaVencimientoLicencia ? 'input-error' : ''}
        />
        <MensajeError nombreCampo="fechaVencimientoLicencia" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="fechaVencimientoExamen">
          Fecha de Vencimiento de Examen <span className="meo-required">*</span>
        </label>
        <input
          type="date"
          id="fechaVencimientoExamen"
          name="fechaVencimientoExamen"
          value={formData.fechaVencimientoExamen}
          onChange={handleChange}
          className={errores.fechaVencimientoExamen ? 'input-error' : ''}
        />
        <MensajeError nombreCampo="fechaVencimientoExamen" />
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="meo-form-grid-documentos">
      <div className="meo-form-group-file">
        <label htmlFor="foto">
          <User size={20} />
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
          <span className="meo-file-name">
            {typeof formData.foto === 'string'
              ? 'Archivo existente'
              : formData.foto.name}
          </span>
        )}
      </div>

      <div className="meo-form-group-file">
        <label htmlFor="ine">
          <CreditCard size={20} />
          INE
        </label>
        <input
          type="file"
          id="ine"
          name="ine"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.ine && (
          <span className="meo-file-name">
            {typeof formData.ine === 'string'
              ? 'Archivo existente'
              : formData.ine.name}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="meo-overlay" onClick={onCerrar}>
      <div className="meo-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="meo-header">
          <h2>Editar Operador</h2>
          <button className="meo-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="meo-tabs">
          <button
            className={`meo-tab-button ${seccionActiva === 'personales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('personales')}
            type="button"
          >
            <User size={18} />
            Datos Personales
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'contacto' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('contacto')}
            type="button"
          >
            <Phone size={18} />
            Contacto
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'licencia' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('licencia')}
            type="button"
          >
            <CreditCard size={18} />
            Licencia
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <FileText size={18} />
            Documentos
          </button>
        </div>

        {/* Contenedor con dos columnas: Formulario + Vista Previa */}
        <div className="meo-contenedor-principal">
          {/* Columna Izquierda - Formulario */}
          <div className="meo-columna-formulario">
            <form onSubmit={handleSubmit} className="meo-form">
              {seccionActiva === 'personales' && renderSeccionPersonales()}
              {seccionActiva === 'contacto' && renderSeccionContacto()}
              {seccionActiva === 'licencia' && renderSeccionLicencia()}
              {seccionActiva === 'documentos' && renderSeccionDocumentos()}
            </form>
          </div>

          {/* Columna Derecha - Vista Previa de Credencial */}
          <div className="meo-columna-preview">
            <div className="meo-preview-header">
              <CreditCard size={20} />
              <h3>Vista Previa de Credencial</h3>
            </div>
            <div className="meo-preview-content">
              <CredencialOperador
                operador={{
                  ...formData,
                  cargo: 'Conductor',
                  foto: obtenerFotoUrl()
                }}
              />
            </div>
            <div className="meo-preview-info">
              <FileText size={16} />
              <p>Vista previa en tiempo real de la credencial actualizada.</p>
            </div>
          </div>
        </div>

        {/* Footer (FUERA del form, fijo en el bottom) */}
        <div className="meo-footer">
          <div className="meo-botones-izquierda">
            <button type="button" className="meo-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="meo-botones-derecha">
            <button
              type="button"
              className={`meo-btn-actualizar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Actualizando...' : 'Actualizar Operador'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarOperador;