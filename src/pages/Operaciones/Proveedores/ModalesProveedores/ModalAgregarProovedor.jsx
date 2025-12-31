import { useState, useCallback } from 'react';
import { X, Save, Building2, Phone, MapPin, FileText, Image, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalAgregarProovedor.css';

const ModalAgregarProveedor = ({ onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    nombre_razon_social: '',
    tipo_proveedor: '',
    rfc: '',
    descripcion_servicio: '',
    nombre_contacto: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: '',
    entidad_federativa: '',
    pais: 'México',
    metodo_pago: '',
    foto_proveedor: null,
    documento_rfc: null,
    identificacion: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('generales');
  const [guardando, setGuardando] = useState(false);

  const estadosMexico = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
    'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
  ];

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

    if (!formData.nombre_razon_social.trim()) {
      nuevosErrores.nombre_razon_social = 'La razón social es requerida';
    }

    if (!formData.tipo_proveedor) {
      nuevosErrores.tipo_proveedor = 'El tipo de proveedor es requerido';
    }

    const regexRFC = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    if (!formData.rfc.trim()) {
      nuevosErrores.rfc = 'El RFC es requerido';
    } else if (!regexRFC.test(formData.rfc.toUpperCase())) {
      nuevosErrores.rfc = 'RFC inválido (formato: ABC123456XYZ)';
    }

    if (!formData.nombre_contacto.trim()) {
      nuevosErrores.nombre_contacto = 'El nombre de contacto es requerido';
    }

    const regexTelefono = /^\d{10}$/;
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    } else if (!regexTelefono.test(formData.telefono)) {
      nuevosErrores.telefono = 'Debe contener 10 dígitos';
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo es requerido';
    } else if (!regexEmail.test(formData.correo)) {
      nuevosErrores.correo = 'Correo electrónico inválido';
    }

    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es requerida';
    }

    if (!formData.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }

    if (!formData.entidad_federativa) {
      nuevosErrores.entidad_federativa = 'El estado es requerido';
    }

    if (!formData.pais.trim()) {
      nuevosErrores.pais = 'El país es requerido';
    }

    if (!formData.metodo_pago) {
      nuevosErrores.metodo_pago = 'El método de pago es requerido';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();


    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      const camposGenerales = ['nombre_razon_social', 'tipo_proveedor', 'rfc', 'descripcion_servicio'];
      const camposContacto = ['nombre_contacto', 'telefono', 'correo'];
      const camposUbicacion = ['direccion', 'ciudad', 'entidad_federativa', 'pais', 'metodo_pago'];

      const erroresEnGenerales = Object.keys(nuevosErrores).some(key => camposGenerales.includes(key));
      const erroresEnContacto = Object.keys(nuevosErrores).some(key => camposContacto.includes(key));
      const erroresEnUbicacion = Object.keys(nuevosErrores).some(key => camposUbicacion.includes(key));

      if (erroresEnGenerales) {
        setSeccionActiva('generales');
      } else if (erroresEnContacto) {
        setSeccionActiva('contacto');
      } else if (erroresEnUbicacion) {
        setSeccionActiva('ubicacion');
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

    setGuardando(true);

    try {
      const proveedorData = {
        nombre_razon_social: formData.nombre_razon_social,
        tipo_proveedor: formData.tipo_proveedor,
        rfc: formData.rfc.toUpperCase(),
        descripcion_servicio: formData.descripcion_servicio,
        nombre_contacto: formData.nombre_contacto,
        telefono: formData.telefono,
        correo: formData.correo,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        entidad_federativa: formData.entidad_federativa,
        pais: formData.pais,
        metodo_pago: formData.metodo_pago,
        foto_proveedor: formData.foto_proveedor,
        documento_rfc: formData.documento_rfc,
        identificacion: formData.identificacion,
      };


      const nombreProveedor = formData.nombre_razon_social;
      await onGuardar(proveedorData);
      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));
      await Swal.fire({
        icon: 'success',
        title: '¡Proveedor Agregado!',
        html: `
          <div style="font-size: 1.1rem; margin-top: 15px;">
            <strong style="color: #7c3aed; font-size: 1.3rem;">${nombreProveedor}</strong>
            <p style="margin-top: 10px; color: #64748b;">ha sido registrado correctamente</p>
          </div>
        `,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7c3aed',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        width: '500px',
        padding: '2rem',
        backdrop: `rgba(0,0,0,0.6)`,
        customClass: {
          popup: 'swal-proveedor-popup',
          title: 'swal-proveedor-title',
          htmlContainer: 'swal-proveedor-html',
          confirmButton: 'swal-proveedor-confirm'
        }
      });


    } catch (error) {
      console.error('❌ Error al guardar:', error);
      onCerrar();
      await new Promise(resolve => setTimeout(resolve, 300));
      await Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        html: `
          <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
            <p>Hubo un problema al guardar el proveedor.</p>
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

    return <span className="modal-proveedor-error-mensaje">{error}</span>;
  };

  const renderSeccionGenerales = () => (
    <div className="modal-proveedor-form-grid">
      <div className="modal-proveedor-form-group modal-proveedor-form-group-full">
        <label htmlFor="nombre_razon_social">
          Razón Social / Nombre Comercial <span className="modal-proveedor-required">*</span>
        </label>
        <input
          type="text"
          id="nombre_razon_social"
          name="nombre_razon_social"
          value={formData.nombre_razon_social}
          onChange={handleChange}
          className={errores.nombre_razon_social ? 'modal-proveedor-input-error' : ''}
          placeholder="Ej: Transportes del Pacífico S.A. de C.V."
        />
        <MensajeError nombreCampo="nombre_razon_social" />
      </div>

      <div className="modal-proveedor-form-group">
        <label htmlFor="tipo_proveedor">
          Tipo de Proveedor <span className="modal-proveedor-required">*</span>
        </label>
        <select
          id="tipo_proveedor"
          name="tipo_proveedor"
          value={formData.tipo_proveedor}
          onChange={handleChange}
          className={errores.tipo_proveedor ? 'modal-proveedor-input-error' : ''}
        >
          <option value="">Seleccionar tipo...</option>
          <option value="Transporte">Transporte</option>
          <option value="Hospedaje">Hospedaje</option>
          <option value="Restaurante">Restaurante</option>
          <option value="Tour">Tour</option>
          <option value="Otro">Otro</option>
        </select>
        <MensajeError nombreCampo="tipo_proveedor" />
      </div>

      <div className="modal-proveedor-form-group">
        <label htmlFor="rfc">
          RFC <span className="modal-proveedor-required">*</span>
        </label>
        <input
          type="text"
          id="rfc"
          name="rfc"
          value={formData.rfc}
          onChange={handleChange}
          className={errores.rfc ? 'modal-proveedor-input-error' : ''}
          placeholder="ABC123456XYZ"
          maxLength="13"
          style={{ textTransform: 'uppercase' }}
        />
        <MensajeError nombreCampo="rfc" />
      </div>

      <div className="modal-proveedor-form-group modal-proveedor-form-group-full">
        <label htmlFor="descripcion_servicio">
          Descripción del Servicio
        </label>
        <textarea
          id="descripcion_servicio"
          name="descripcion_servicio"
          value={formData.descripcion_servicio}
          onChange={handleChange}
          placeholder="Describe los servicios que ofrece el proveedor..."
          rows="3"
        />
      </div>
    </div>
  );

  const renderSeccionContacto = () => (
    <div className="modal-proveedor-form-grid">
      <div className="modal-proveedor-form-group modal-proveedor-form-group-full">
        <label htmlFor="nombre_contacto">
          Nombre del Contacto <span className="modal-proveedor-required">*</span>
        </label>
        <input
          type="text"
          id="nombre_contacto"
          name="nombre_contacto"
          value={formData.nombre_contacto}
          onChange={handleChange}
          className={errores.nombre_contacto ? 'modal-proveedor-input-error' : ''}
          placeholder="Ej: Roberto Martínez García"
        />
        <MensajeError nombreCampo="nombre_contacto" />
      </div>

      <div className="modal-proveedor-form-group">
        <label htmlFor="telefono">
          Teléfono <span className="modal-proveedor-required">*</span>
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={errores.telefono ? 'modal-proveedor-input-error' : ''}
          placeholder="5551234567"
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono" />
      </div>

      <div className="modal-proveedor-form-group">
        <label htmlFor="correo">
          Correo Electrónico <span className="modal-proveedor-required">*</span>
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          className={errores.correo ? 'modal-proveedor-input-error' : ''}
          placeholder="ejemplo@correo.com"
        />
        <MensajeError nombreCampo="correo" />
      </div>
    </div>
  );

  const renderSeccionUbicacion = () => (
    <div className="modal-proveedor-form-grid">
      <div className="modal-proveedor-form-group modal-proveedor-form-group-full">
        <label htmlFor="direccion">
          Dirección <span className="modal-proveedor-required">*</span>
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className={errores.direccion ? 'modal-proveedor-input-error' : ''}
          placeholder="Av. Insurgentes Sur 1234, Col. Centro"
        />
        <MensajeError nombreCampo="direccion" />
      </div>

      <div className="modal-proveedor-form-group">
        <label htmlFor="ciudad">
          Ciudad <span className="modal-proveedor-required">*</span>
        </label>
        <input
          type="text"
          id="ciudad"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          className={errores.ciudad ? 'modal-proveedor-input-error' : ''}
          placeholder="Ciudad de México"
        />
        <MensajeError nombreCampo="ciudad" />
      </div>

      <div className="modal-proveedor-form-group">
        <label htmlFor="entidad_federativa">
          Estado <span className="modal-proveedor-required">*</span>
        </label>
        <select
          id="entidad_federativa"
          name="entidad_federativa"
          value={formData.entidad_federativa}
          onChange={handleChange}
          className={errores.entidad_federativa ? 'modal-proveedor-input-error' : ''}
        >
          <option value="">Seleccionar estado...</option>
          {estadosMexico.map(estado => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
        <MensajeError nombreCampo="entidad_federativa" />
      </div>

      <div className="modal-proveedor-form-group">
        <label htmlFor="pais">
          País <span className="modal-proveedor-required">*</span>
        </label>
        <input
          type="text"
          id="pais"
          name="pais"
          value={formData.pais}
          onChange={handleChange}
          className={errores.pais ? 'modal-proveedor-input-error' : ''}
          placeholder="México"
        />
        <MensajeError nombreCampo="pais" />
      </div>

      <div className="modal-proveedor-form-group">
        <label htmlFor="metodo_pago">
          Método de Pago <span className="modal-proveedor-required">*</span>
        </label>
        <select
          id="metodo_pago"
          name="metodo_pago"
          value={formData.metodo_pago}
          onChange={handleChange}
          className={errores.metodo_pago ? 'modal-proveedor-input-error' : ''}
        >
          <option value="">Seleccionar método...</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Otro">Otro</option>
        </select>
        <MensajeError nombreCampo="metodo_pago" />
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="modal-proveedor-form-grid-documentos">
      <div className="modal-proveedor-form-group-file">
        <label htmlFor="foto_proveedor">
          <Image size={20} />
          Fotografía / Logo
        </label>
        <input
          type="file"
          id="foto_proveedor"
          name="foto_proveedor"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_proveedor && (
          <span className="modal-proveedor-file-name">{formData.foto_proveedor.name}</span>
        )}
      </div>

      <div className="modal-proveedor-form-group-file">
        <label htmlFor="documento_rfc">
          <FileText size={20} />
          Documento RFC
        </label>
        <input
          type="file"
          id="documento_rfc"
          name="documento_rfc"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.documento_rfc && (
          <span className="modal-proveedor-file-name">{formData.documento_rfc.name}</span>
        )}
      </div>

      <div className="modal-proveedor-form-group-file">
        <label htmlFor="identificacion">
          <FileText size={20} />
          Identificación Oficial
        </label>
        <input
          type="file"
          id="identificacion"
          name="identificacion"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.identificacion && (
          <span className="modal-proveedor-file-name">{formData.identificacion.name}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-proveedor-overlay" onClick={onCerrar}>
      <div className="modal-proveedor-contenido modal-proveedor-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-proveedor-header">
          <h2>Agregar Nuevo Proveedor</h2>
          <button className="modal-proveedor-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        <div className="modal-proveedor-tabs">
          <button
            className={`modal-proveedor-tab-button ${seccionActiva === 'generales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('generales')}
            type="button"
          >
            <Building2 size={18} />
            Datos Generales
          </button>
          <button
            className={`modal-proveedor-tab-button ${seccionActiva === 'contacto' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('contacto')}
            type="button"
          >
            <Phone size={18} />
            Contacto
          </button>
          <button
            className={`modal-proveedor-tab-button ${seccionActiva === 'ubicacion' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('ubicacion')}
            type="button"
          >
            <MapPin size={18} />
            Ubicación y Pago
          </button>
          <button
            className={`modal-proveedor-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <Image size={18} />
            Documentos
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-proveedor-form">
          {seccionActiva === 'generales' && renderSeccionGenerales()}
          {seccionActiva === 'contacto' && renderSeccionContacto()}
          {seccionActiva === 'ubicacion' && renderSeccionUbicacion()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        <div className="modal-proveedor-footer">
          <div className="modal-proveedor-botones-izquierda">
            <button type="button" className="modal-proveedor-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="modal-proveedor-botones-derecha">
            <button
              type="button"
              className={`modal-proveedor-btn-guardar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Guardando...' : 'Guardar Proveedor'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalAgregarProveedor;