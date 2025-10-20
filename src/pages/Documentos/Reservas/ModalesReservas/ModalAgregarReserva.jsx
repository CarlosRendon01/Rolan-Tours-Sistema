import { useState, useCallback } from 'react';
import { X, Save, User, FileText, Image } from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalAgregarReserva.css';

const ModalAgregarReserva = ({ onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    // Campos básicos
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    telefono: '',
    email: '',
    costo_dia: '',

    // Campos adicionales
    fecha_nacimiento: '',
    rfc: '',
    curp: '',
    nss: '',
    domicilio: '',
    ciudad: '',
    estado: '',
    codigo_postal: '',
    tipo_sangre: '',
    contacto_emergencia: '',
    telefono_emergencia: '',
    idiomas: '',
    experiencia_anos: '',
    especialidades: '',
    comentarios: '',

    // Documentos
    foto_reserva: null,
    foto_ine: null,
    foto_licencia: null,
    foto_comprobante_domicilio: null,
    foto_certificaciones: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('basicos');
  const [guardando, setGuardando] = useState(false);

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

    if (!formData.apellido_paterno.trim()) {
      nuevosErrores.apellido_paterno = 'El apellido paterno es requerido';
    }

    if (!formData.apellido_materno.trim()) {
      nuevosErrores.apellido_materno = 'El apellido materno es requerido';
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

    if (!formData.costo_dia || parseFloat(formData.costo_dia) <= 0) {
      nuevosErrores.costo_dia = 'El costo debe ser mayor a 0';
    }

    // Validaciones campos adicionales (obligatorios)
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
    if (!formData.codigo_postal || !cpRegex.test(formData.codigo_postal)) {
      nuevosErrores.codigo_postal = 'Debe tener 5 dígitos';
    }

    if (!formData.contacto_emergencia.trim()) {
      nuevosErrores.contacto_emergencia = 'Contacto requerido';
    }

    if (!formData.telefono_emergencia || !telefonoRegex.test(formData.telefono_emergencia)) {
      nuevosErrores.telefono_emergencia = 'Debe tener 10 dígitos';
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

      const camposBasicos = ['nombre', 'apellido_paterno', 'apellido_materno', 'telefono', 'email', 'costo_dia'];
      const camposAdicionales = ['fecha_nacimiento', 'domicilio', 'ciudad', 'estado', 'codigo_postal', 'contacto_emergencia', 'telefono_emergencia'];

      const erroresEnBasicos = Object.keys(nuevosErrores).some(key => camposBasicos.includes(key));
      const erroresEnAdicionales = Object.keys(nuevosErrores).some(key => camposAdicionales.includes(key));

      if (erroresEnBasicos) {
        setSeccionActiva('basicos');
      } else if (erroresEnAdicionales) {
        setSeccionActiva('adicionales');
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

    console.log('✅ Validación exitosa, guardando guía...');
    setGuardando(true);

    try {
      const reservaData = {
        nombre: formData.nombre,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        telefono: formData.telefono,
        email: formData.email,
        costo_dia: parseFloat(formData.costo_dia),
        fecha_nacimiento: formData.fecha_nacimiento,
        rfc: formData.rfc,
        curp: formData.curp,
        nss: formData.nss,
        domicilio: formData.domicilio,
        ciudad: formData.ciudad,
        estado: formData.estado,
        codigo_postal: formData.codigo_postal,
        tipo_sangre: formData.tipo_sangre,
        contacto_emergencia: formData.contacto_emergencia,
        telefono_emergencia: formData.telefono_emergencia,
        idiomas: formData.idiomas,
        experiencia_anos: formData.experiencia_anos ? parseInt(formData.experiencia_anos) : null,
        especialidades: formData.especialidades,
        comentarios: formData.comentarios,
        documentos: {
          foto_reserva: formData.foto_reserva,
          foto_ine: formData.foto_ine,
          foto_licencia: formData.foto_licencia,
          foto_comprobante_domicilio: formData.foto_comprobante_domicilio,
          foto_certificaciones: formData.foto_certificaciones
        }
      };

      console.log('📦 Datos a guardar:', reservaData);

      // Guardar el nombre completo del guía antes de cerrar
      const nombreCompleto = `${formData.nombre} ${formData.apellido_paterno} ${formData.apellido_materno}`;

      // Llamar a la función onGuardar del padre
      await onGuardar(reservaData);

      console.log('✅ Guía guardado, cerrando modal primero...');

      // ✅ PRIMERO: Cerrar el modal
      onCerrar();

      // ✅ SEGUNDO: Esperar un poquito para que el modal se cierre
      await new Promise(resolve => setTimeout(resolve, 300));

      // ✅ TERCERO: Mostrar la alerta DESPUÉS de cerrar el modal
      console.log('✅ Mostrando alerta...');
      await Swal.fire({
        icon: 'success',
        title: '¡Guía Agregado!',
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
          popup: 'swal-reserva-popup-custom',
          title: 'swal-reserva-title-custom',
          htmlContainer: 'swal-reserva-html-custom',
          confirmButton: 'swal-reserva-confirm-custom'
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
          <p>Hubo un problema al guardar el guía.</p>
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

    return <span className="modal-reserva-error-mensaje">{error}</span>;
  };

  const renderSeccionBasicos = () => (
    <div className="modal-reserva-form-grid">
      <div className="modal-reserva-form-group">
        <label htmlFor="nombre">
          Nombre <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={errores.nombre ? 'modal-reserva-input-error' : ''}
          placeholder="Ej: Juan"
        />
        <MensajeError nombreCampo="nombre" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="apellido_paterno">
          Apellido Paterno <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="text"
          id="apellido_paterno"
          name="apellido_paterno"
          value={formData.apellido_paterno}
          onChange={handleChange}
          className={errores.apellido_paterno ? 'modal-reserva-input-error' : ''}
          placeholder="Ej: López"
        />
        <MensajeError nombreCampo="apellido_paterno" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="apellido_materno">
          Apellido Materno <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="text"
          id="apellido_materno"
          name="apellido_materno"
          value={formData.apellido_materno}
          onChange={handleChange}
          className={errores.apellido_materno ? 'modal-reserva-input-error' : ''}
          placeholder="Ej: García"
        />
        <MensajeError nombreCampo="apellido_materno" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="telefono">
          Teléfono <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={errores.telefono ? 'modal-reserva-input-error' : ''}
          placeholder="9511234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="email">
          Email <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errores.email ? 'modal-reserva-input-error' : ''}
          placeholder="reserva@ejemplo.com"
        />
        <MensajeError nombreCampo="email" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="costo_dia">
          Costo por Día (MXN) <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="costo_dia"
          name="costo_dia"
          value={formData.costo_dia}
          onChange={handleChange}
          className={errores.costo_dia ? 'modal-reserva-input-error' : ''}
          placeholder="800.00"
        />
        <MensajeError nombreCampo="costo_dia" />
      </div>
    </div>
  );

  const renderSeccionAdicionales = () => (
    <div className="modal-reserva-form-grid">
      <div className="modal-reserva-form-group">
        <label htmlFor="fecha_nacimiento">
          Fecha de Nacimiento <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="date"
          id="fecha_nacimiento"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
          className={errores.fecha_nacimiento ? 'modal-reserva-input-error' : ''}
        />
        <MensajeError nombreCampo="fecha_nacimiento" />
      </div>

      <div className="modal-reserva-form-group">
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

      <div className="modal-reserva-form-group">
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

      <div className="modal-reserva-form-group">
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

      <div className="modal-reserva-form-group modal-reserva-form-group-full">
        <label htmlFor="domicilio">
          Domicilio <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="text"
          id="domicilio"
          name="domicilio"
          value={formData.domicilio}
          onChange={handleChange}
          className={errores.domicilio ? 'modal-reserva-input-error' : ''}
          placeholder="Calle, Número, Colonia"
        />
        <MensajeError nombreCampo="domicilio" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="ciudad">
          Ciudad <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="text"
          id="ciudad"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          className={errores.ciudad ? 'modal-reserva-input-error' : ''}
          placeholder="Oaxaca de Juárez"
        />
        <MensajeError nombreCampo="ciudad" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="estado">
          Estado <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="text"
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className={errores.estado ? 'modal-reserva-input-error' : ''}
          placeholder="Oaxaca"
        />
        <MensajeError nombreCampo="estado" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="codigo_postal">
          Código Postal <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="text"
          id="codigo_postal"
          name="codigo_postal"
          value={formData.codigo_postal}
          onChange={handleChange}
          className={errores.codigo_postal ? 'modal-reserva-input-error' : ''}
          placeholder="68000"
          maxLength="5"
        />
        <MensajeError nombreCampo="codigo_postal" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="tipo_sangre">Tipo de Sangre</label>
        <select
          id="tipo_sangre"
          name="tipo_sangre"
          value={formData.tipo_sangre}
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

      <div className="modal-reserva-form-group">
        <label htmlFor="contacto_emergencia">
          Contacto de Emergencia <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="text"
          id="contacto_emergencia"
          name="contacto_emergencia"
          value={formData.contacto_emergencia}
          onChange={handleChange}
          className={errores.contacto_emergencia ? 'modal-reserva-input-error' : ''}
          placeholder="Nombre completo"
        />
        <MensajeError nombreCampo="contacto_emergencia" />
      </div>

      <div className="modal-reserva-form-group">
        <label htmlFor="telefono_emergencia">
          Teléfono de Emergencia <span className="modal-reserva-required">*</span>
        </label>
        <input
          type="tel"
          id="telefono_emergencia"
          name="telefono_emergencia"
          value={formData.telefono_emergencia}
          onChange={handleChange}
          className={errores.telefono_emergencia ? 'modal-reserva-input-error' : ''}
          placeholder="9511234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono_emergencia" />
      </div>

      <div className="modal-reserva-form-group">
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

      <div className="modal-reserva-form-group">
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

      <div className="modal-reserva-form-group modal-reserva-form-group-full">
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

      <div className="modal-reserva-form-group modal-reserva-form-group-full">
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
    <div className="modal-reserva-form-grid-documentos">
      <div className="modal-reserva-form-group-file">
        <label htmlFor="foto_reserva">
          <Image size={20} />
          Foto del Guía
        </label>
        <input
          type="file"
          id="foto_reserva"
          name="foto_reserva"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_reserva && (
          <span className="modal-reserva-file-name">{formData.foto_reserva.name}</span>
        )}
      </div>

      <div className="modal-reserva-form-group-file">
        <label htmlFor="foto_ine">
          <FileText size={20} />
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
          <span className="modal-reserva-file-name">{formData.foto_ine.name}</span>
        )}
      </div>

      <div className="modal-reserva-form-group-file">
        <label htmlFor="foto_licencia">
          <FileText size={20} />
          Licencia de Conducir
        </label>
        <input
          type="file"
          id="foto_licencia"
          name="foto_licencia"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_licencia && (
          <span className="modal-reserva-file-name">{formData.foto_licencia.name}</span>
        )}
      </div>

      <div className="modal-reserva-form-group-file">
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
          <span className="modal-reserva-file-name">{formData.foto_comprobante_domicilio.name}</span>
        )}
      </div>

      <div className="modal-reserva-form-group-file">
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
          <span className="modal-reserva-file-name">{formData.foto_certificaciones.name}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-reserva-overlay" onClick={onCerrar}>
      <div className="modal-reserva-contenido modal-reserva-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-reserva-header">
          <h2>Agregar Nuevo Guía</h2>
          <button className="modal-reserva-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="modal-reserva-tabs">
          <button
            className={`modal-reserva-tab-button ${seccionActiva === 'basicos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('basicos')}
            type="button"
          >
            <User size={18} />
            Datos Básicos
          </button>
          <button
            className={`modal-reserva-tab-button ${seccionActiva === 'adicionales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('adicionales')}
            type="button"
          >
            <FileText size={18} />
            Información Adicional
          </button>
          <button
            className={`modal-reserva-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <Image size={18} />
            Documentos
          </button>
        </div>

        {/* Formulario (scrolleable) */}
        <form onSubmit={handleSubmit} className="modal-reserva-form">
          {seccionActiva === 'basicos' && renderSeccionBasicos()}
          {seccionActiva === 'adicionales' && renderSeccionAdicionales()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        {/* Footer (FUERA del form, fijo en el bottom) */}
        <div className="modal-reserva-footer">
          <div className="modal-reserva-botones-izquierda">
            <button type="button" className="modal-reserva-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="modal-reserva-botones-derecha">
            <button
              type="button"
              className={`modal-reserva-btn-guardar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Guardando...' : 'Guardar Guía'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarReserva;