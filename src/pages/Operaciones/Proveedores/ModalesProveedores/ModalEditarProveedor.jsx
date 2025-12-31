import { useState, useEffect, useCallback } from 'react';
import { X, Save, Building2, Phone, MapPin, FileText, CreditCard } from 'lucide-react';
import './ModalEditarProveedor.css';
import Swal from 'sweetalert2';

const ModalEditarProveedor = ({ proveedor, onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    nombre_razon_social: '',
    tipo_proveedor: '',
    rfc: '',
    descripcion_servicio: '',
    metodo_pago: '',
    nombre_contacto: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: '',
    entidad_federativa: '',
    pais: '',
    foto_proveedor: null,
    documento_rfc: null,
    identificacion: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('general');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (proveedor) {
      setFormData({
        nombre_razon_social: proveedor.nombre_razon_social || '',
        tipo_proveedor: proveedor.tipo_proveedor || '',
        rfc: proveedor.rfc || '',
        descripcion_servicio: proveedor.descripcion_servicio || '',
        metodo_pago: proveedor.metodo_pago || '',
        nombre_contacto: proveedor.nombre_contacto || '',
        telefono: proveedor.telefono || '',
        correo: proveedor.correo || '',
        direccion: proveedor.direccion || '',
        ciudad: proveedor.ciudad || '',
        entidad_federativa: proveedor.entidad_federativa || '',
        pais: proveedor.pais || '',
        foto_proveedor: proveedor.foto_proveedor || null,
        documento_rfc: proveedor.documento_rfc || null,
        identificacion: proveedor.identificacion || null
      });
    }
  }, [proveedor]);

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

  const validarRFC = (rfc) => {
    const regex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/;
    return regex.test(rfc.toUpperCase());
  };

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    if (!formData.nombre_razon_social.trim()) {
      nuevosErrores.nombre_razon_social = 'La razón social es requerida';
    }

    if (!formData.tipo_proveedor) {
      nuevosErrores.tipo_proveedor = 'El tipo de proveedor es requerido';
    }

    if (!formData.rfc.trim()) {
      nuevosErrores.rfc = 'El RFC es requerido';
    } else if (!validarRFC(formData.rfc)) {
      nuevosErrores.rfc = 'RFC inválido';
    }

    if (!formData.metodo_pago) {
      nuevosErrores.metodo_pago = 'El método de pago es requerido';
    }

    if (!formData.nombre_contacto.trim()) {
      nuevosErrores.nombre_contacto = 'El nombre de contacto es requerido';
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    } else if (!validarTelefono(formData.telefono)) {
      nuevosErrores.telefono = 'Debe tener 10 dígitos';
    }

    if (formData.correo && !validarEmail(formData.correo)) {
      nuevosErrores.correo = 'Email inválido';
    }

    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es requerida';
    }

    if (!formData.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }

    if (!formData.entidad_federativa.trim()) {
      nuevosErrores.entidad_federativa = 'El estado es requerido';
    }

    if (!formData.pais.trim()) {
      nuevosErrores.pais = 'El país es requerido';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      const camposGenerales = ['nombre_razon_social', 'tipo_proveedor', 'rfc', 'descripcion_servicio', 'metodo_pago'];
      const camposContacto = ['nombre_contacto', 'telefono', 'correo'];
      const camposDireccion = ['direccion', 'ciudad', 'entidad_federativa', 'pais'];

      const erroresEnGenerales = Object.keys(nuevosErrores).some(key => camposGenerales.includes(key));
      const erroresEnContacto = Object.keys(nuevosErrores).some(key => camposContacto.includes(key));
      const erroresEnDireccion = Object.keys(nuevosErrores).some(key => camposDireccion.includes(key));

      if (erroresEnGenerales) {
        setSeccionActiva('general');
      } else if (erroresEnContacto) {
        setSeccionActiva('contacto');
      } else if (erroresEnDireccion) {
        setSeccionActiva('direccion');
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
        ...proveedor,
        nombre_razon_social: formData.nombre_razon_social,
        tipo_proveedor: formData.tipo_proveedor,
        rfc: formData.rfc.toUpperCase(),
        descripcion_servicio: formData.descripcion_servicio,
        metodo_pago: formData.metodo_pago,
        nombre_contacto: formData.nombre_contacto,
        telefono: formData.telefono,
        correo: formData.correo,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        entidad_federativa: formData.entidad_federativa,
        pais: formData.pais,
        foto_proveedor: formData.foto_proveedor,
        documento_rfc: formData.documento_rfc,
        identificacion: formData.identificacion
      };

      const nombreProveedor = formData.nombre_razon_social;
      await onGuardar(proveedorData);
      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));
      await Swal.fire({
        icon: 'success',
        title: '¡Proveedor Actualizado!',
        html: `
          <div style="font-size: 1.1rem; margin-top: 15px;">
            <strong style="color: #10b981; font-size: 1.3rem;">${nombreProveedor}</strong>
            <p style="margin-top: 10px; color: #64748b;">ha sido actualizado correctamente</p>
          </div>
        `,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        width: '500px',
        padding: '2rem',
        backdrop: `rgba(0,0,0,0.6)`,
        customClass: {
          popup: 'swal-popup-custom-proveedor',
          title: 'swal-title-custom-proveedor',
          htmlContainer: 'swal-html-custom-proveedor',
          confirmButton: 'swal-confirm-custom-proveedor'
        }
      });


    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));
      await Swal.fire({
        icon: 'error',
        title: 'Error al Actualizar',
        html: `
          <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
            <p>Hubo un problema al actualizar el proveedor.</p>
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
  }, [formData, validarFormulario, onGuardar, proveedor, onCerrar]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="mep-error-mensaje">{error}</span>;
  };

  const renderSeccionGeneral = () => (
    <div className="mep-form-grid">
      <div className="mep-form-group form-group-full">
        <label htmlFor="nombre_razon_social">
          Nombre o Razón Social <span className="mep-required">*</span>
        </label>
        <input
          type="text"
          id="nombre_razon_social"
          name="nombre_razon_social"
          value={formData.nombre_razon_social}
          onChange={handleChange}
          className={errores.nombre_razon_social ? 'input-error' : ''}
          placeholder="Ej: Transportes del Pacífico S.A. de C.V."
        />
        <MensajeError nombreCampo="nombre_razon_social" />
      </div>

      <div className="mep-form-group">
        <label htmlFor="tipo_proveedor">
          Tipo de Proveedor <span className="mep-required">*</span>
        </label>
        <select
          id="tipo_proveedor"
          name="tipo_proveedor"
          value={formData.tipo_proveedor}
          onChange={handleChange}
          className={errores.tipo_proveedor ? 'input-error' : ''}
        >
          <option value="">Seleccionar tipo</option>
          <option value="Transporte">🚚 Transporte</option>
          <option value="Hospedaje">🏨 Hospedaje</option>
          <option value="Restaurante">🍽️ Restaurante</option>
          <option value="Tour">📦 Tour</option>
          <option value="Otro">📦 Otro</option>
        </select>
        <MensajeError nombreCampo="tipo_proveedor" />
      </div>

      <div className="mep-form-group">
        <label htmlFor="rfc">
          RFC <span className="mep-required">*</span>
        </label>
        <input
          type="text"
          id="rfc"
          name="rfc"
          value={formData.rfc}
          onChange={handleChange}
          className={errores.rfc ? 'input-error' : ''}
          placeholder="Ej: TPA920315KL8"
          maxLength="13"
          style={{ textTransform: 'uppercase' }}
        />
        <MensajeError nombreCampo="rfc" />
      </div>

      <div className="mep-form-group">
        <label htmlFor="metodo_pago">
          Método de Pago <span className="mep-required">*</span>
        </label>
        <select
          id="metodo_pago"
          name="metodo_pago"
          value={formData.metodo_pago}
          onChange={handleChange}
          className={errores.metodo_pago ? 'input-error' : ''}
        >
          <option value="">Seleccionar método</option>
          <option value="Efectivo">💵 Efectivo</option>
          <option value="Transferencia">🏦 Transferencia</option>
          <option value="Cheque">📝 Cheque</option>
          <option value="Tarjeta">💳 Tarjeta</option>
        </select>
        <MensajeError nombreCampo="metodo_pago" />
      </div>

      <div className="mep-form-group form-group-full">
        <label htmlFor="descripcion_servicio">Descripción del Servicio</label>
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
    <div className="mep-form-grid">
      <div className="mep-form-group">
        <label htmlFor="nombre_contacto">
          Nombre de Contacto <span className="mep-required">*</span>
        </label>
        <input
          type="text"
          id="nombre_contacto"
          name="nombre_contacto"
          value={formData.nombre_contacto}
          onChange={handleChange}
          className={errores.nombre_contacto ? 'input-error' : ''}
          placeholder="Ej: Roberto Martínez García"
        />
        <MensajeError nombreCampo="nombre_contacto" />
      </div>

      <div className="mep-form-group">
        <label htmlFor="telefono">
          Teléfono <span className="mep-required">*</span>
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

      <div className="mep-form-group form-group-full">
        <label htmlFor="correo">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          className={errores.correo ? 'input-error' : ''}
          placeholder="contacto@empresa.com"
        />
        <MensajeError nombreCampo="correo" />
      </div>
    </div>
  );
  const renderSeccionDireccion = () => (
    <div className="mep-form-grid">
      <div className="mep-form-group form-group-full">
        <label htmlFor="direccion">
          Dirección <span className="mep-required">*</span>
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className={errores.direccion ? 'input-error' : ''}
          placeholder="Ej: Av. Insurgentes Sur 1234"
        />
        <MensajeError nombreCampo="direccion" />
      </div>

      <div className="mep-form-group">
        <label htmlFor="ciudad">
          Ciudad <span className="mep-required">*</span>
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

      <div className="mep-form-group">
        <label htmlFor="entidad_federativa">
          Estado <span className="mep-required">*</span>
        </label>
        <input
          type="text"
          id="entidad_federativa"
          name="entidad_federativa"
          value={formData.entidad_federativa}
          onChange={handleChange}
          className={errores.entidad_federativa ? 'input-error' : ''}
          placeholder="Ej: Ciudad de México"
        />
        <MensajeError nombreCampo="entidad_federativa" />
      </div>

      <div className="mep-form-group">
        <label htmlFor="pais">
          País <span className="mep-required">*</span>
        </label>
        <input
          type="text"
          id="pais"
          name="pais"
          value={formData.pais}
          onChange={handleChange}
          className={errores.pais ? 'input-error' : ''}
          placeholder="Ej: México"
        />
        <MensajeError nombreCampo="pais" />
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="mep-form-grid-documentos">
      <div className="mep-form-group-file">
        <label htmlFor="foto_proveedor">
          <Building2 size={20} />
          Fotografía del Proveedor
        </label>
        <input
          type="file"
          id="foto_proveedor"
          name="foto_proveedor"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_proveedor && (
          <span className="mep-file-name">
            {typeof formData.foto_proveedor === 'string'
              ? 'Archivo existente'
              : formData.foto_proveedor.name}
          </span>
        )}
      </div>

      <div className="mep-form-group-file">
        <label htmlFor="documento_rfc">
          <CreditCard size={20} />
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
          <span className="mep-file-name">
            {typeof formData.documento_rfc === 'string'
              ? 'Archivo existente'
              : formData.documento_rfc.name}
          </span>
        )}
      </div>

      <div className="mep-form-group-file">
        <label htmlFor="identificacion">
          <FileText size={20} />
          Identificación
        </label>
        <input
          type="file"
          id="identificacion"
          name="identificacion"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.identificacion && (
          <span className="mep-file-name">
            {typeof formData.identificacion === 'string'
              ? 'Archivo existente'
              : formData.identificacion.name}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="mep-overlay" onClick={onCerrar}>
      <div className="mep-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mep-header">
          <h2>Editar Proveedor</h2>
          <button className="mep-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        <div className="mep-tabs">
          <button
            className={`mep-tab-button ${seccionActiva === 'general' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('general')}
            type="button"
          >
            <Building2 size={18} />
            Información General
          </button>
          <button
            className={`mep-tab-button ${seccionActiva === 'contacto' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('contacto')}
            type="button"
          >
            <Phone size={18} />
            Contacto
          </button>
          <button
            className={`mep-tab-button ${seccionActiva === 'direccion' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('direccion')}
            type="button"
          >
            <MapPin size={18} />
            Dirección
          </button>
          <button
            className={`mep-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <FileText size={18} />
            Documentos
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mep-form">
          {seccionActiva === 'general' && renderSeccionGeneral()}
          {seccionActiva === 'contacto' && renderSeccionContacto()}
          {seccionActiva === 'direccion' && renderSeccionDireccion()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        <div className="mep-footer">
          <div className="mep-botones-izquierda">
            <button type="button" className="mep-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="mep-botones-derecha">
            <button
              type="button"
              className={`mep-btn-actualizar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Actualizando...' : 'Actualizar Proveedor'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalEditarProveedor;