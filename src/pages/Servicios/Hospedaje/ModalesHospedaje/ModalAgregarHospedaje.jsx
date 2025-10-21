import { useState, useCallback } from 'react';
import { X, Save, Home, DollarSign, FileText, Image, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalAgregarHospedaje.css';

const ModalAgregarHospedaje = ({ onGuardar, onCerrar, proveedores = [] }) => {
  const [formData, setFormData] = useState({
    // Datos generales
    nombre_servicio: '',
    tipo_hospedaje: '',
    tipo_habitacion: '',
    capacidad: '',
    descripcion_servicio: '',
    
    // Paquete y precios
    tipo_paquete: '',
    duracion_paquete: '',
    precio_base: '',
    moneda: 'MXN',
    incluye: '',
    restricciones: '',
    
    // Proveedor
    empresa_proveedora_id: '',
    ubicacion_hospedaje: '',
    servicios_instalaciones: '',
    disponibilidad: 'disponible', // ✅ Cambiado de true a 'disponible'
    
    // Documentos
    foto_servicio: null,
    
    // Administrativo
    codigo_servicio: '',
    estado: 'Activo'
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('generales');
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

    // Validaciones datos generales
    if (!formData.codigo_servicio.trim()) {
      nuevosErrores.codigo_servicio = 'El código del servicio es requerido';
    }

    if (!formData.nombre_servicio.trim()) {
      nuevosErrores.nombre_servicio = 'El nombre del servicio es requerido';
    }

    if (!formData.tipo_hospedaje) {
      nuevosErrores.tipo_hospedaje = 'El tipo de hospedaje es requerido';
    }

    if (!formData.tipo_habitacion) {
      nuevosErrores.tipo_habitacion = 'El tipo de habitación es requerido';
    }

    if (!formData.capacidad || parseInt(formData.capacidad) < 1) {
      nuevosErrores.capacidad = 'La capacidad debe ser al menos 1';
    }

    if (!formData.descripcion_servicio.trim()) {
      nuevosErrores.descripcion_servicio = 'La descripción es requerida';
    }

    // Validaciones paquete y precios
    if (!formData.tipo_paquete) {
      nuevosErrores.tipo_paquete = 'El tipo de paquete es requerido';
    }

    if (!formData.duracion_paquete.trim()) {
      nuevosErrores.duracion_paquete = 'La duración es requerida';
    }

    if (!formData.precio_base || parseFloat(formData.precio_base) <= 0) {
      nuevosErrores.precio_base = 'El precio debe ser mayor a 0';
    }

    if (!formData.incluye.trim()) {
      nuevosErrores.incluye = 'Especifica qué incluye el servicio';
    }

    // Validaciones proveedor
    if (!formData.empresa_proveedora_id) {
      nuevosErrores.empresa_proveedora_id = 'Selecciona un proveedor';
    }

    if (!formData.ubicacion_hospedaje.trim()) {
      nuevosErrores.ubicacion_hospedaje = 'La ubicación es requerida';
    }

    if (!formData.servicios_instalaciones.trim()) {
      nuevosErrores.servicios_instalaciones = 'Los servicios e instalaciones son requeridos';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      const camposGenerales = ['codigo_servicio', 'nombre_servicio', 'tipo_hospedaje', 'tipo_habitacion', 'capacidad', 'descripcion_servicio'];
      const camposPaquete = ['tipo_paquete', 'duracion_paquete', 'precio_base', 'moneda', 'incluye', 'restricciones'];
      const camposProveedor = ['empresa_proveedora_id', 'ubicacion_hospedaje', 'servicios_instalaciones'];

      const erroresEnGenerales = Object.keys(nuevosErrores).some(key => camposGenerales.includes(key));
      const erroresEnPaquete = Object.keys(nuevosErrores).some(key => camposPaquete.includes(key));
      const erroresEnProveedor = Object.keys(nuevosErrores).some(key => camposProveedor.includes(key));

      if (erroresEnGenerales) {
        setSeccionActiva('generales');
      } else if (erroresEnPaquete) {
        setSeccionActiva('paquete');
      } else if (erroresEnProveedor) {
        setSeccionActiva('proveedor');
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
      const proveedorSeleccionado = proveedores.find(p => p.id === parseInt(formData.empresa_proveedora_id));

      const hospedajeData = {
        codigo_servicio: formData.codigo_servicio,
        nombre_servicio: formData.nombre_servicio,
        tipo_hospedaje: formData.tipo_hospedaje,
        tipo_habitacion: formData.tipo_habitacion,
        capacidad: parseInt(formData.capacidad),
        descripcion_servicio: formData.descripcion_servicio,
        tipo_paquete: formData.tipo_paquete,
        duracion_paquete: formData.duracion_paquete,
        precio_base: parseFloat(formData.precio_base),
        moneda: formData.moneda,
        incluye: formData.incluye,
        restricciones: formData.restricciones,
        empresa_proveedora_id: parseInt(formData.empresa_proveedora_id),
        nombre_proveedor: proveedorSeleccionado?.nombre || '',
        ubicacion_hospedaje: formData.ubicacion_hospedaje,
        servicios_instalaciones: formData.servicios_instalaciones,
        disponibilidad: formData.disponibilidad === 'disponible', // ✅ Conversión a boolean
        foto_servicio: formData.foto_servicio,
        estado: formData.estado
      };

      const nombreServicio = formData.nombre_servicio;

      await onGuardar(hospedajeData);

      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      await Swal.fire({
        icon: 'success',
        title: '¡Hospedaje Agregado!',
        html: `
          <div style="font-size: 1.1rem; margin-top: 15px;">
            <strong style="color: #2563eb; font-size: 1.3rem;">${nombreServicio}</strong>
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
        backdrop: `rgba(0,0,0,0.6)`
      });

    } catch (error) {
      console.error('Error al guardar:', error);

      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      await Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        html: `
          <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
            <p>Hubo un problema al guardar el hospedaje.</p>
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
  }, [formData, validarFormulario, onGuardar, onCerrar, proveedores]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="modal-agregar-hosp-error-mensaje">{error}</span>;
  };

  const renderSeccionGenerales = () => (
    <>
      <div className="modal-agregar-hosp-form-grid">
        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="codigo_servicio">
            Código del Servicio <span className="modal-agregar-hosp-required">*</span>
          </label>
          <input
            type="text"
            id="codigo_servicio"
            name="codigo_servicio"
            value={formData.codigo_servicio}
            onChange={handleChange}
            className={errores.codigo_servicio ? 'modal-agregar-hosp-input-error' : ''}
            placeholder="Ej: HOS-HOT-001"
          />
          <MensajeError nombreCampo="codigo_servicio" />
        </div>

        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="nombre_servicio">
            Nombre del Servicio <span className="modal-agregar-hosp-required">*</span>
          </label>
          <input
            type="text"
            id="nombre_servicio"
            name="nombre_servicio"
            value={formData.nombre_servicio}
            onChange={handleChange}
            className={errores.nombre_servicio ? 'modal-agregar-hosp-input-error' : ''}
            placeholder="Ej: Habitación Doble Deluxe"
          />
          <MensajeError nombreCampo="nombre_servicio" />
        </div>

        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="tipo_hospedaje">
            Tipo de Hospedaje <span className="modal-agregar-hosp-required">*</span>
          </label>
          <select
            id="tipo_hospedaje"
            name="tipo_hospedaje"
            value={formData.tipo_hospedaje}
            onChange={handleChange}
            className={errores.tipo_hospedaje ? 'modal-agregar-hosp-input-error' : ''}
          >
            <option value="">Selecciona una opción</option>
            <option value="Hotel">Hotel</option>
            <option value="Cabaña">Cabaña</option>
            <option value="Hostal">Hostal</option>
            <option value="Villa">Villa</option>
            <option value="Apartamento">Apartamento</option>
          </select>
          <MensajeError nombreCampo="tipo_hospedaje" />
        </div>

        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="tipo_habitacion">
            Tipo de Habitación <span className="modal-agregar-hosp-required">*</span>
          </label>
          <select
            id="tipo_habitacion"
            name="tipo_habitacion"
            value={formData.tipo_habitacion}
            onChange={handleChange}
            className={errores.tipo_habitacion ? 'modal-agregar-hosp-input-error' : ''}
          >
            <option value="">Selecciona una opción</option>
            <option value="Individual">Individual</option>
            <option value="Doble">Doble</option>
            <option value="Suite">Suite</option>
            <option value="Familiar">Familiar</option>
            <option value="Compartida">Compartida</option>
          </select>
          <MensajeError nombreCampo="tipo_habitacion" />
        </div>

        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="capacidad">
            Capacidad (huéspedes) <span className="modal-agregar-hosp-required">*</span>
          </label>
          <input
            type="number"
            id="capacidad"
            name="capacidad"
            value={formData.capacidad}
            onChange={handleChange}
            className={errores.capacidad ? 'modal-agregar-hosp-input-error' : ''}
            placeholder="2"
            min="1"
          />
          <MensajeError nombreCampo="capacidad" />
        </div>

        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="estado">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="En mantenimiento">En mantenimiento</option>
          </select>
        </div>

        <div className="modal-agregar-hosp-form-group modal-agregar-hosp-form-group-full">
          <label htmlFor="descripcion_servicio">
            Descripción del Servicio <span className="modal-agregar-hosp-required">*</span>
          </label>
          <textarea
            id="descripcion_servicio"
            name="descripcion_servicio"
            value={formData.descripcion_servicio}
            onChange={handleChange}
            className={errores.descripcion_servicio ? 'modal-agregar-hosp-input-error' : ''}
            placeholder="Describe el hospedaje, servicios incluidos, características especiales..."
            rows="4"
          />
          <MensajeError nombreCampo="descripcion_servicio" />
        </div>
      </div>
    </>
  );

  const renderSeccionPaquete = () => (
    <>
      <div className="modal-agregar-hosp-form-grid-tres">
        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="tipo_paquete">
            Tipo de Paquete <span className="modal-agregar-hosp-required">*</span>
          </label>
          <select
            id="tipo_paquete"
            name="tipo_paquete"
            value={formData.tipo_paquete}
            onChange={handleChange}
            className={errores.tipo_paquete ? 'modal-agregar-hosp-input-error' : ''}
          >
            <option value="">Selecciona una opción</option>
            <option value="Por noche">Por noche</option>
            <option value="Por persona">Por persona</option>
            <option value="Por estancia">Por estancia</option>
            <option value="Por paquete">Por paquete</option>
            <option value="Por mes">Por mes</option>
            <option value="Por propiedad">Por propiedad</option>
          </select>
          <MensajeError nombreCampo="tipo_paquete" />
        </div>

        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="duracion_paquete">
            Duración del Paquete <span className="modal-agregar-hosp-required">*</span>
          </label>
          <input
            type="text"
            id="duracion_paquete"
            name="duracion_paquete"
            value={formData.duracion_paquete}
            onChange={handleChange}
            className={errores.duracion_paquete ? 'modal-agregar-hosp-input-error' : ''}
            placeholder="Ej: 1 noche, 2 noches, 30 días"
          />
          <MensajeError nombreCampo="duracion_paquete" />
        </div>

        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="moneda">
            Moneda
          </label>
          <select
            id="moneda"
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
          >
            <option value="MXN">MXN - Peso Mexicano</option>
            <option value="USD">USD - Dólar Americano</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>

        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="precio_base">
            Precio Base <span className="modal-agregar-hosp-required">*</span>
          </label>
          <input
            type="number"
            id="precio_base"
            name="precio_base"
            value={formData.precio_base}
            onChange={handleChange}
            className={errores.precio_base ? 'modal-agregar-hosp-input-error' : ''}
            placeholder="1200.00"
            step="0.01"
            min="0"
          />
          <MensajeError nombreCampo="precio_base" />
        </div>
      </div>

      <div className="modal-agregar-hosp-form-grid">
        <div className="modal-agregar-hosp-form-group modal-agregar-hosp-form-group-full">
          <label htmlFor="incluye">
            ¿Qué Incluye? <span className="modal-agregar-hosp-required">*</span>
          </label>
          <textarea
            id="incluye"
            name="incluye"
            value={formData.incluye}
            onChange={handleChange}
            className={errores.incluye ? 'modal-agregar-hosp-input-error' : ''}
            placeholder="Desayuno buffet, WiFi, estacionamiento, acceso a alberca..."
            rows="3"
          />
          <MensajeError nombreCampo="incluye" />
        </div>

        <div className="modal-agregar-hosp-form-group modal-agregar-hosp-form-group-full">
          <label htmlFor="restricciones">
            Restricciones y Políticas
          </label>
          <textarea
            id="restricciones"
            name="restricciones"
            value={formData.restricciones}
            onChange={handleChange}
            placeholder="Check-in: 15:00 hrs, Check-out: 12:00 hrs, cancelaciones..."
            rows="3"
          />
        </div>
      </div>
    </>
  );

  const renderSeccionProveedor = () => (
    <>
      <div className="modal-agregar-hosp-form-grid">
        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="empresa_proveedora_id">
            Empresa Proveedora <span className="modal-agregar-hosp-required">*</span>
          </label>
          <select
            id="empresa_proveedora_id"
            name="empresa_proveedora_id"
            value={formData.empresa_proveedora_id}
            onChange={handleChange}
            className={errores.empresa_proveedora_id ? 'modal-agregar-hosp-input-error' : ''}
          >
            <option value="">Selecciona un proveedor</option>
            {proveedores.map(proveedor => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
          <MensajeError nombreCampo="empresa_proveedora_id" />
        </div>

        {/* ✅ CAMPO DE DISPONIBILIDAD MEJORADO */}
        <div className="modal-agregar-hosp-form-group">
          <label htmlFor="disponibilidad">
            Disponibilidad
          </label>
          <select
            id="disponibilidad"
            name="disponibilidad"
            value={formData.disponibilidad}
            onChange={handleChange}
          >
            <option value="disponible">Disponible</option>
            <option value="no_disponible">No Disponible</option>
          </select>
        </div>

        <div className="modal-agregar-hosp-form-group modal-agregar-hosp-form-group-full">
          <label htmlFor="ubicacion_hospedaje">
            Ubicación <span className="modal-agregar-hosp-required">*</span>
          </label>
          <input
            type="text"
            id="ubicacion_hospedaje"
            name="ubicacion_hospedaje"
            value={formData.ubicacion_hospedaje}
            onChange={handleChange}
            className={errores.ubicacion_hospedaje ? 'modal-agregar-hosp-input-error' : ''}
            placeholder="Av. Costera Miguel Alemán #100, Acapulco"
          />
          <MensajeError nombreCampo="ubicacion_hospedaje" />
        </div>

        <div className="modal-agregar-hosp-form-group modal-agregar-hosp-form-group-full">
          <label htmlFor="servicios_instalaciones">
            Servicios e Instalaciones <span className="modal-agregar-hosp-required">*</span>
          </label>
          <textarea
            id="servicios_instalaciones"
            name="servicios_instalaciones"
            value={formData.servicios_instalaciones}
            onChange={handleChange}
            className={errores.servicios_instalaciones ? 'modal-agregar-hosp-input-error' : ''}
            placeholder="Alberca, gimnasio, restaurante, bar, spa, estacionamiento..."
            rows="3"
          />
          <MensajeError nombreCampo="servicios_instalaciones" />
        </div>
      </div>
    </>
  );

  const renderSeccionDocumentos = () => (
    <div className="modal-agregar-hosp-form-grid">
      <div className="modal-agregar-hosp-form-group-file modal-agregar-hosp-form-group-full">
        <label htmlFor="foto_servicio">
          <Image size={20} />
          Fotografía del Hospedaje
        </label>
        <input
          type="file"
          id="foto_servicio"
          name="foto_servicio"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_servicio && (
          <span className="modal-agregar-hosp-file-name">{formData.foto_servicio.name}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-agregar-hosp-overlay" onClick={onCerrar}>
      <div className="modal-agregar-hosp-contenido modal-agregar-hosp-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-agregar-hosp-header">
          <h2>Agregar Nuevo Hospedaje</h2>
          <button className="modal-agregar-hosp-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="modal-agregar-hosp-tabs">
          <button
            className={`modal-agregar-hosp-tab-button ${seccionActiva === 'generales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('generales')}
            type="button"
          >
            <Home size={18} />
            Datos Generales
          </button>
          <button
            className={`modal-agregar-hosp-tab-button ${seccionActiva === 'paquete' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('paquete')}
            type="button"
          >
            <DollarSign size={18} />
            Paquete y Precios
          </button>
          <button
            className={`modal-agregar-hosp-tab-button ${seccionActiva === 'proveedor' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('proveedor')}
            type="button"
          >
            <MapPin size={18} />
            Proveedor
          </button>
          <button
            className={`modal-agregar-hosp-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <Image size={18} />
            Documentos
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-agregar-hosp-form">
          {seccionActiva === 'generales' && renderSeccionGenerales()}
          {seccionActiva === 'paquete' && renderSeccionPaquete()}
          {seccionActiva === 'proveedor' && renderSeccionProveedor()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        {/* Footer */}
        <div className="modal-agregar-hosp-footer">
          <div className="modal-agregar-hosp-botones-izquierda">
            <button type="button" className="modal-agregar-hosp-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="modal-agregar-hosp-botones-derecha">
            <button
              type="button"
              className={`modal-agregar-hosp-btn-guardar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Guardando...' : 'Guardar Hospedaje'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarHospedaje;