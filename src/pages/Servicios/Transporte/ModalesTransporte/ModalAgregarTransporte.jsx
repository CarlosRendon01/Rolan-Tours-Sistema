import { useState, useCallback } from 'react';
import { X, Save, Truck, Package, DollarSign, MapPin, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalAgregarTransporte.css';

const ModalAgregarTransporte = ({ onGuardar, onCerrar, proveedores = [] }) => {
  const [formData, setFormData] = useState({
    // Datos generales
    nombre_servicio: '',
    tipo_transporte: '',
    capacidad: '',
    descripcion_servicio: '',
    
    // Paquete y precios
    tipo_paquete: '',
    duracion_paquete: '',
    precio_base: '',
    moneda: 'MXN',
    incluye: '',
    restricciones: '',
    
    // Relación con proveedores
    empresa_proveedora_id: '',
    nombre_proveedor: '',
    ubicacion_salida: '',
    ubicacion_destino: '',
    disponibilidad: true,
    
    // Información administrativa
    codigo_servicio: '',
    estado: 'Activo',
    
    // Foto
    foto_servicio: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('generales');
  const [guardando, setGuardando] = useState(false);

  // Opciones para los selectores
  const tiposTransporte = ['Taxi', 'Van', 'Autobús', 'Minibús', 'Sprinter', 'Camioneta', 'Auto Sedán'];
  const tiposPaquete = ['Por día', 'Por hora', 'Por viaje', 'Por semana', 'Por mes'];
  const monedas = ['MXN', 'USD'];
  const estados = ['Activo', 'Inactivo'];

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

    // Si se selecciona un proveedor, autollenar el nombre
    if (name === 'empresa_proveedora_id' && value) {
      const proveedorSeleccionado = proveedores.find(p => p.id === parseInt(value));
      if (proveedorSeleccionado) {
        setFormData(prev => ({
          ...prev,
          nombre_proveedor: proveedorSeleccionado.nombre
        }));
      }
    }

    if (errores[name]) {
      limpiarErrorCampo(name);
    }
  }, [errores, limpiarErrorCampo, proveedores]);

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

  const generarCodigoServicio = useCallback(() => {
    const tipoAbrev = formData.tipo_transporte.substring(0, 3).toUpperCase();
    const paqueteAbrev = formData.tipo_paquete.split(' ')[1]?.substring(0, 3).toUpperCase() || 'SRV';
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${tipoAbrev}-${paqueteAbrev}-${random}`;
  }, [formData.tipo_transporte, formData.tipo_paquete]);

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    // Validaciones datos generales (obligatorios)
    if (!formData.nombre_servicio.trim()) {
      nuevosErrores.nombre_servicio = 'El nombre del servicio es requerido';
    }

    if (!formData.tipo_transporte) {
      nuevosErrores.tipo_transporte = 'El tipo de transporte es requerido';
    }

    if (!formData.capacidad || parseInt(formData.capacidad) < 1 || parseInt(formData.capacidad) > 100) {
      nuevosErrores.capacidad = 'Capacidad inválida (1-100 pasajeros)';
    }

    if (!formData.descripcion_servicio.trim()) {
      nuevosErrores.descripcion_servicio = 'La descripción es requerida';
    }

    // Validaciones paquete y precios (obligatorios)
    if (!formData.tipo_paquete) {
      nuevosErrores.tipo_paquete = 'El tipo de paquete es requerido';
    }

    if (!formData.precio_base || parseFloat(formData.precio_base) <= 0) {
      nuevosErrores.precio_base = 'El precio debe ser mayor a 0';
    }

    if (!formData.moneda) {
      nuevosErrores.moneda = 'La moneda es requerida';
    }

    // Validaciones ubicaciones (obligatorias)
    if (!formData.ubicacion_salida.trim()) {
      nuevosErrores.ubicacion_salida = 'La ubicación de salida es requerida';
    }

    if (!formData.ubicacion_destino.trim()) {
      nuevosErrores.ubicacion_destino = 'La ubicación de destino es requerida';
    }

    if (formData.ubicacion_salida.trim() === formData.ubicacion_destino.trim()) {
      nuevosErrores.ubicacion_destino = 'El destino debe ser diferente al origen';
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

      const camposGenerales = ['nombre_servicio', 'tipo_transporte', 'capacidad', 'descripcion_servicio'];
      const camposPaquete = ['tipo_paquete', 'duracion_paquete', 'precio_base', 'moneda', 'incluye', 'restricciones'];
      const camposUbicacion = ['empresa_proveedora_id', 'ubicacion_salida', 'ubicacion_destino'];

      const erroresEnGenerales = Object.keys(nuevosErrores).some(key => camposGenerales.includes(key));
      const erroresEnPaquete = Object.keys(nuevosErrores).some(key => camposPaquete.includes(key));
      const erroresEnUbicacion = Object.keys(nuevosErrores).some(key => camposUbicacion.includes(key));

      if (erroresEnGenerales) {
        setSeccionActiva('generales');
      } else if (erroresEnPaquete) {
        setSeccionActiva('paquete');
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

    console.log('✅ Validación exitosa, guardando transporte...');
    setGuardando(true);

    try {
      // Generar código de servicio si no existe
      const codigoFinal = formData.codigo_servicio || generarCodigoServicio();

      const transporteData = {
        ...formData,
        codigo_servicio: codigoFinal,
        capacidad: parseInt(formData.capacidad),
        precio_base: parseFloat(formData.precio_base),
        fecha_registro: new Date().toISOString(),
      };

      console.log('📦 Datos a guardar:', transporteData);

      const nombreServicio = formData.nombre_servicio;

      await onGuardar(transporteData);

      console.log('✅ Transporte guardado, cerrando modal primero...');

      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('✅ Mostrando alerta...');
      await Swal.fire({
        icon: 'success',
        title: '¡Servicio Agregado!',
        html: `
          <div style="font-size: 1.1rem; margin-top: 15px;">
            <strong style="color: #2563eb; font-size: 1.3rem;">${nombreServicio}</strong>
            <p style="margin-top: 10px; color: #64748b;">ha sido registrado correctamente</p>
            <p style="margin-top: 5px; color: #94a3b8; font-size: 0.9rem;">Código: ${codigoFinal}</p>
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

      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      await Swal.fire({
        icon: 'error',
        title: 'Error al Guardar',
        html: `
          <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
            <p>Hubo un problema al guardar el servicio.</p>
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
  }, [formData, validarFormulario, onGuardar, onCerrar, generarCodigoServicio]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;

    return <span className="modal-transporte-error-mensaje">{error}</span>;
  };

  const renderSeccionGenerales = () => (
    <div className="modal-transporte-form-grid">
      <div className="modal-transporte-form-group">
        <label htmlFor="nombre_servicio">
          Nombre del Servicio <span className="modal-transporte-required">*</span>
        </label>
        <input
          type="text"
          id="nombre_servicio"
          name="nombre_servicio"
          value={formData.nombre_servicio}
          onChange={handleChange}
          className={errores.nombre_servicio ? 'modal-transporte-input-error' : ''}
          placeholder="Ej: Traslado Aeropuerto - Hotel"
        />
        <MensajeError nombreCampo="nombre_servicio" />
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="tipo_transporte">
          Tipo de Transporte <span className="modal-transporte-required">*</span>
        </label>
        <select
          id="tipo_transporte"
          name="tipo_transporte"
          value={formData.tipo_transporte}
          onChange={handleChange}
          className={errores.tipo_transporte ? 'modal-transporte-input-error' : ''}
        >
          <option value="">Seleccionar...</option>
          {tiposTransporte.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <MensajeError nombreCampo="tipo_transporte" />
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="capacidad">
          Capacidad (pasajeros) <span className="modal-transporte-required">*</span>
        </label>
        <input
          type="number"
          id="capacidad"
          name="capacidad"
          value={formData.capacidad}
          onChange={handleChange}
          className={errores.capacidad ? 'modal-transporte-input-error' : ''}
          placeholder="8"
          min="1"
          max="100"
        />
        <MensajeError nombreCampo="capacidad" />
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="codigo_servicio">
          Código de Servicio (opcional)
        </label>
        <input
          type="text"
          id="codigo_servicio"
          name="codigo_servicio"
          value={formData.codigo_servicio}
          onChange={handleChange}
          placeholder="Se generará automáticamente"
        />
        <span className="modal-transporte-hint">Si no se especifica, se generará automáticamente</span>
      </div>

      <div className="modal-transporte-form-group modal-transporte-form-group-full">
        <label htmlFor="descripcion_servicio">
          Descripción del Servicio <span className="modal-transporte-required">*</span>
        </label>
        <textarea
          id="descripcion_servicio"
          name="descripcion_servicio"
          value={formData.descripcion_servicio}
          onChange={handleChange}
          className={errores.descripcion_servicio ? 'modal-transporte-input-error' : ''}
          placeholder="Incluye: chofer profesional, combustible, seguro de viajero..."
          rows="3"
        />
        <MensajeError nombreCampo="descripcion_servicio" />
      </div>
    </div>
  );

  const renderSeccionPaquete = () => (
    <div className="modal-transporte-form-grid">
      <div className="modal-transporte-form-group">
        <label htmlFor="tipo_paquete">
          Tipo de Paquete <span className="modal-transporte-required">*</span>
        </label>
        <select
          id="tipo_paquete"
          name="tipo_paquete"
          value={formData.tipo_paquete}
          onChange={handleChange}
          className={errores.tipo_paquete ? 'modal-transporte-input-error' : ''}
        >
          <option value="">Seleccionar...</option>
          {tiposPaquete.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <MensajeError nombreCampo="tipo_paquete" />
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="duracion_paquete">
          Duración del Paquete
        </label>
        <input
          type="text"
          id="duracion_paquete"
          name="duracion_paquete"
          value={formData.duracion_paquete}
          onChange={handleChange}
          placeholder="Ej: 8 horas, 1 día, 3 días"
        />
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="precio_base">
          Precio Base <span className="modal-transporte-required">*</span>
        </label>
        <input
          type="number"
          id="precio_base"
          name="precio_base"
          value={formData.precio_base}
          onChange={handleChange}
          className={errores.precio_base ? 'modal-transporte-input-error' : ''}
          placeholder="1500.00"
          min="0"
          step="0.01"
        />
        <MensajeError nombreCampo="precio_base" />
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="moneda">
          Moneda <span className="modal-transporte-required">*</span>
        </label>
        <select
          id="moneda"
          name="moneda"
          value={formData.moneda}
          onChange={handleChange}
          className={errores.moneda ? 'modal-transporte-input-error' : ''}
        >
          {monedas.map(moneda => (
            <option key={moneda} value={moneda}>{moneda}</option>
          ))}
        </select>
        <MensajeError nombreCampo="moneda" />
      </div>

      <div className="modal-transporte-form-group modal-transporte-form-group-full">
        <label htmlFor="incluye">
          Incluye
        </label>
        <textarea
          id="incluye"
          name="incluye"
          value={formData.incluye}
          onChange={handleChange}
          placeholder="Agua embotellada, WiFi, aire acondicionado..."
          rows="2"
        />
      </div>

      <div className="modal-transporte-form-group modal-transporte-form-group-full">
        <label htmlFor="restricciones">
          Restricciones
        </label>
        <textarea
          id="restricciones"
          name="restricciones"
          value={formData.restricciones}
          onChange={handleChange}
          placeholder="No se permiten mascotas, equipaje máximo 2 maletas..."
          rows="2"
        />
      </div>
    </div>
  );

  const renderSeccionUbicacion = () => (
    <div className="modal-transporte-form-grid">
      <div className="modal-transporte-form-group">
        <label htmlFor="empresa_proveedora_id">
          Proveedor
        </label>
        <select
          id="empresa_proveedora_id"
          name="empresa_proveedora_id"
          value={formData.empresa_proveedora_id}
          onChange={handleChange}
        >
          <option value="">Seleccionar proveedor...</option>
          {proveedores.map(proveedor => (
            <option key={proveedor.id} value={proveedor.id}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="nombre_proveedor">
          Nombre del Proveedor
        </label>
        <input
          type="text"
          id="nombre_proveedor"
          name="nombre_proveedor"
          value={formData.nombre_proveedor}
          onChange={handleChange}
          placeholder="Se llenará automáticamente"
          readOnly={!!formData.empresa_proveedora_id}
        />
        <span className="modal-transporte-hint">
          {formData.empresa_proveedora_id ? 'Autollenado desde proveedor' : 'Puedes escribir manualmente'}
        </span>
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="ubicacion_salida">
          Ubicación de Salida <span className="modal-transporte-required">*</span>
        </label>
        <input
          type="text"
          id="ubicacion_salida"
          name="ubicacion_salida"
          value={formData.ubicacion_salida}
          onChange={handleChange}
          className={errores.ubicacion_salida ? 'modal-transporte-input-error' : ''}
          placeholder="Ej: Aeropuerto Internacional"
        />
        <MensajeError nombreCampo="ubicacion_salida" />
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="ubicacion_destino">
          Ubicación de Destino <span className="modal-transporte-required">*</span>
        </label>
        <input
          type="text"
          id="ubicacion_destino"
          name="ubicacion_destino"
          value={formData.ubicacion_destino}
          onChange={handleChange}
          className={errores.ubicacion_destino ? 'modal-transporte-input-error' : ''}
          placeholder="Ej: Zona Hotelera Centro"
        />
        <MensajeError nombreCampo="ubicacion_destino" />
      </div>

      <div className="modal-transporte-form-group">
        <label htmlFor="estado">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          {estados.map(estado => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>

      <div className="modal-transporte-form-group">
        <label className="modal-transporte-checkbox-label">
          <input
            type="checkbox"
            name="disponibilidad"
            checked={formData.disponibilidad}
            onChange={handleChange}
            className="modal-transporte-checkbox"
          />
          <span>Servicio disponible</span>
        </label>
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="modal-transporte-form-grid-documentos">
      <div className="modal-transporte-form-group-file">
        <label htmlFor="foto_servicio">
          <FileText size={20} />
          Fotografía del Vehículo/Servicio
        </label>
        <input
          type="file"
          id="foto_servicio"
          name="foto_servicio"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_servicio && (
          <span className="modal-transporte-file-name">{formData.foto_servicio.name}</span>
        )}
        <span className="modal-transporte-hint">Formatos: JPG, PNG (máx. 5MB)</span>
      </div>
    </div>
  );

  return (
    <div className="modal-transporte-overlay" onClick={onCerrar}>
      <div className="modal-transporte-contenido modal-transporte-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-transporte-header">
          <h2>Agregar Nuevo Servicio de Transporte</h2>
          <button className="modal-transporte-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="modal-transporte-tabs">
          <button
            className={`modal-transporte-tab-button ${seccionActiva === 'generales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('generales')}
            type="button"
          >
            <Truck size={18} />
            Datos Generales
          </button>
          <button
            className={`modal-transporte-tab-button ${seccionActiva === 'paquete' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('paquete')}
            type="button"
          >
            <Package size={18} />
            Paquete y Precios
          </button>
          <button
            className={`modal-transporte-tab-button ${seccionActiva === 'ubicacion' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('ubicacion')}
            type="button"
          >
            <MapPin size={18} />
            Ubicación y Proveedor
          </button>
          <button
            className={`modal-transporte-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <FileText size={18} />
            Documentos
          </button>
        </div>

        {/* Formulario (scrolleable) */}
        <form onSubmit={handleSubmit} className="modal-transporte-form">
          {seccionActiva === 'generales' && renderSeccionGenerales()}
          {seccionActiva === 'paquete' && renderSeccionPaquete()}
          {seccionActiva === 'ubicacion' && renderSeccionUbicacion()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        {/* Footer */}
        <div className="modal-transporte-footer">
          <div className="modal-transporte-botones-izquierda">
            <button type="button" className="modal-transporte-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="modal-transporte-botones-derecha">
            <button
              type="button"
              className={`modal-transporte-btn-guardar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Guardando...' : 'Guardar Servicio'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarTransporte;