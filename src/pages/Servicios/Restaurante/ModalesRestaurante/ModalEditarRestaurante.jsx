import { useState, useEffect, useCallback } from 'react';
import { X, Save, UtensilsCrossed, Package, MapPin, FileText } from 'lucide-react';
import './ModalEditarRestaurante.css';
import Swal from 'sweetalert2';

const ModalEditarRestaurante = ({ restaurante, onGuardar, onCerrar, proveedores = [] }) => {
  const [formData, setFormData] = useState({
    // Datos generales
    nombre_servicio: '',
    tipo_servicio: '',
    categoria: '',
    descripcion_servicio: '',
    capacidad: '',
    
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
    ubicacion_restaurante: '',
    horario_servicio: '',
    disponibilidad: true,
    codigo_servicio: '',
    estado: 'Activo',
    
    // Documentos
    foto_servicio: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('generales');
  const [guardando, setGuardando] = useState(false);

  // Listas de opciones
  const tiposServicio = ['Desayuno', 'Comida', 'Cena', 'Buffet', 'Menú Especial'];
  const categorias = ['Casual', 'Gourmet', 'Familiar', 'Buffet', 'Café'];
  const tiposPaquete = ['Por persona', 'Por grupo', 'Por menú', 'Buffet libre'];
  const monedas = ['MXN', 'USD'];
  const estados = ['Activo', 'Inactivo', 'Mantenimiento'];

  // Cargar datos del restaurante cuando se abre el modal
  useEffect(() => {
    if (restaurante) {
      setFormData({
        nombre_servicio: restaurante.nombre_servicio || '',
        tipo_servicio: restaurante.tipo_servicio || '',
        categoria: restaurante.categoria || '',
        descripcion_servicio: restaurante.descripcion_servicio || '',
        capacidad: restaurante.capacidad || '',
        tipo_paquete: restaurante.tipo_paquete || '',
        duracion_paquete: restaurante.duracion_paquete || '',
        precio_base: restaurante.precio_base || '',
        moneda: restaurante.moneda || 'MXN',
        incluye: restaurante.incluye || '',
        restricciones: restaurante.restricciones || '',
        empresa_proveedora_id: restaurante.empresa_proveedora_id || '',
        nombre_proveedor: restaurante.nombre_proveedor || '',
        ubicacion_restaurante: restaurante.ubicacion_restaurante || '',
        horario_servicio: restaurante.horario_servicio || '',
        disponibilidad: restaurante.disponibilidad !== undefined ? restaurante.disponibilidad : true,
        codigo_servicio: restaurante.codigo_servicio || '',
        estado: restaurante.estado || 'Activo',
        foto_servicio: restaurante.foto_servicio || null
      });
    }
  }, [restaurante]);

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

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    // Validaciones datos generales (obligatorios)
    if (!formData.nombre_servicio.trim()) {
      nuevosErrores.nombre_servicio = 'El nombre del servicio es requerido';
    }

    if (!formData.tipo_servicio) {
      nuevosErrores.tipo_servicio = 'El tipo de servicio es requerido';
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = 'La categoría es requerida';
    }

    if (!formData.descripcion_servicio.trim()) {
      nuevosErrores.descripcion_servicio = 'La descripción es requerida';
    }

    if (formData.capacidad && (parseInt(formData.capacidad) < 1 || parseInt(formData.capacidad) > 500)) {
      nuevosErrores.capacidad = 'Capacidad inválida (1-500 comensales)';
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

    // Validaciones ubicación (obligatorios)
    if (!formData.ubicacion_restaurante.trim()) {
      nuevosErrores.ubicacion_restaurante = 'La ubicación es requerida';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      // Determinar qué sección tiene errores
      const camposGenerales = ['nombre_servicio', 'tipo_servicio', 'categoria', 'descripcion_servicio', 'capacidad'];
      const camposPaquete = ['tipo_paquete', 'duracion_paquete', 'precio_base', 'moneda', 'incluye', 'restricciones'];
      const camposUbicacion = ['empresa_proveedora_id', 'ubicacion_restaurante', 'horario_servicio'];

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
      const restauranteData = {
        ...restaurante,
        nombre_servicio: formData.nombre_servicio,
        tipo_servicio: formData.tipo_servicio,
        categoria: formData.categoria,
        descripcion_servicio: formData.descripcion_servicio,
        capacidad: formData.capacidad ? parseInt(formData.capacidad) : null,
        tipo_paquete: formData.tipo_paquete,
        duracion_paquete: formData.duracion_paquete,
        precio_base: parseFloat(formData.precio_base),
        moneda: formData.moneda,
        incluye: formData.incluye,
        restricciones: formData.restricciones,
        empresa_proveedora_id: formData.empresa_proveedora_id,
        nombre_proveedor: formData.nombre_proveedor,
        ubicacion_restaurante: formData.ubicacion_restaurante,
        horario_servicio: formData.horario_servicio,
        disponibilidad: formData.disponibilidad,
        codigo_servicio: formData.codigo_servicio,
        estado: formData.estado,
        foto_servicio: formData.foto_servicio
      };

      // Guardar el nombre del servicio antes de cerrar
      const nombreServicio = formData.nombre_servicio;

      // Llamar a la función onGuardar del padre
      await onGuardar(restauranteData);

      console.log('✅ Restaurante actualizado, cerrando modal primero...');

      // ✅ PRIMERO: Cerrar el modal
      onCerrar();

      // ✅ SEGUNDO: Esperar un poquito para que el modal se cierre
      await new Promise(resolve => setTimeout(resolve, 300));

      // ✅ TERCERO: Mostrar la alerta DESPUÉS de cerrar el modal
      console.log('✅ Mostrando alerta...');
      await Swal.fire({
        icon: 'success',
        title: '¡Servicio Actualizado!',
        html: `
          <div style="font-size: 1.1rem; margin-top: 15px;">
            <strong style="color: #2563eb; font-size: 1.3rem;">${nombreServicio}</strong>
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
            <p>Hubo un problema al actualizar el servicio de restaurante.</p>
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
  }, [formData, validarFormulario, onGuardar, restaurante, onCerrar]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="mer-error-mensaje">{error}</span>;
  };

  const renderSeccionGenerales = () => (
    <div className="mer-form-grid">
      <div className="mer-form-group">
        <label htmlFor="nombre_servicio">
          Nombre del Servicio <span className="mer-required">*</span>
        </label>
        <input
          type="text"
          id="nombre_servicio"
          name="nombre_servicio"
          value={formData.nombre_servicio}
          onChange={handleChange}
          className={errores.nombre_servicio ? 'input-error' : ''}
          placeholder="Ej: Desayuno Continental"
        />
        <MensajeError nombreCampo="nombre_servicio" />
      </div>

      <div className="mer-form-group">
        <label htmlFor="tipo_servicio">
          Tipo de Servicio <span className="mer-required">*</span>
        </label>
        <select
          id="tipo_servicio"
          name="tipo_servicio"
          value={formData.tipo_servicio}
          onChange={handleChange}
          className={errores.tipo_servicio ? 'input-error' : ''}
        >
          <option value="">Seleccionar...</option>
          {tiposServicio.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <MensajeError nombreCampo="tipo_servicio" />
      </div>

      <div className="mer-form-group">
        <label htmlFor="categoria">
          Categoría <span className="mer-required">*</span>
        </label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className={errores.categoria ? 'input-error' : ''}
        >
          <option value="">Seleccionar...</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <MensajeError nombreCampo="categoria" />
      </div>

      <div className="mer-form-group">
        <label htmlFor="capacidad">
          Capacidad (comensales)
        </label>
        <input
          type="number"
          id="capacidad"
          name="capacidad"
          value={formData.capacidad}
          onChange={handleChange}
          className={errores.capacidad ? 'input-error' : ''}
          placeholder="50"
          min="1"
          max="500"
        />
        <MensajeError nombreCampo="capacidad" />
      </div>

      <div className="mer-form-group form-group-full">
        <label htmlFor="descripcion_servicio">
          Descripción del Servicio <span className="mer-required">*</span>
        </label>
        <textarea
          id="descripcion_servicio"
          name="descripcion_servicio"
          value={formData.descripcion_servicio}
          onChange={handleChange}
          className={errores.descripcion_servicio ? 'input-error' : ''}
          placeholder="Describe el servicio de restaurante..."
          rows="3"
        />
        <MensajeError nombreCampo="descripcion_servicio" />
      </div>
    </div>
  );

  const renderSeccionPaquete = () => (
    <div className="mer-form-grid">
      <div className="mer-form-group">
        <label htmlFor="tipo_paquete">
          Tipo de Paquete <span className="mer-required">*</span>
        </label>
        <select
          id="tipo_paquete"
          name="tipo_paquete"
          value={formData.tipo_paquete}
          onChange={handleChange}
          className={errores.tipo_paquete ? 'input-error' : ''}
        >
          <option value="">Seleccionar...</option>
          {tiposPaquete.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <MensajeError nombreCampo="tipo_paquete" />
      </div>

      <div className="mer-form-group">
        <label htmlFor="duracion_paquete">
          Duración del Paquete
        </label>
        <input
          type="text"
          id="duracion_paquete"
          name="duracion_paquete"
          value={formData.duracion_paquete}
          onChange={handleChange}
          placeholder="Ej: 2 horas, 3 tiempos"
        />
      </div>

      <div className="mer-form-group">
        <label htmlFor="precio_base">
          Precio Base <span className="mer-required">*</span>
        </label>
        <input
          type="number"
          id="precio_base"
          name="precio_base"
          value={formData.precio_base}
          onChange={handleChange}
          className={errores.precio_base ? 'input-error' : ''}
          placeholder="350.00"
          step="0.01"
          min="0"
        />
        <MensajeError nombreCampo="precio_base" />
      </div>

      <div className="mer-form-group">
        <label htmlFor="moneda">
          Moneda <span className="mer-required">*</span>
        </label>
        <select
          id="moneda"
          name="moneda"
          value={formData.moneda}
          onChange={handleChange}
        >
          {monedas.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="mer-form-group form-group-full">
        <label htmlFor="incluye">
          Incluye
        </label>
        <textarea
          id="incluye"
          name="incluye"
          value={formData.incluye}
          onChange={handleChange}
          placeholder="Ej: Entrada, plato fuerte, postre, bebida..."
          rows="2"
        />
      </div>

      <div className="mer-form-group form-group-full">
        <label htmlFor="restricciones">
          Restricciones
        </label>
        <textarea
          id="restricciones"
          name="restricciones"
          value={formData.restricciones}
          onChange={handleChange}
          placeholder="Ej: Horario, cupo mínimo, reservación anticipada..."
          rows="2"
        />
      </div>
    </div>
  );

  const renderSeccionUbicacion = () => (
    <div className="mer-form-grid">
      <div className="mer-form-group">
        <label htmlFor="empresa_proveedora_id">
          Restaurante/Proveedor
        </label>
        <select
          id="empresa_proveedora_id"
          name="empresa_proveedora_id"
          value={formData.empresa_proveedora_id}
          onChange={handleChange}
        >
          <option value="">Seleccionar restaurante...</option>
          {proveedores.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      <div className="mer-form-group">
        <label htmlFor="nombre_proveedor">
          Nombre del Restaurante
        </label>
        <input
          type="text"
          id="nombre_proveedor"
          name="nombre_proveedor"
          value={formData.nombre_proveedor}
          onChange={handleChange}
          placeholder="Nombre del restaurante"
          readOnly={!!formData.empresa_proveedora_id}
        />
      </div>

      <div className="mer-form-group">
        <label htmlFor="ubicacion_restaurante">
          Ubicación <span className="mer-required">*</span>
        </label>
        <input
          type="text"
          id="ubicacion_restaurante"
          name="ubicacion_restaurante"
          value={formData.ubicacion_restaurante}
          onChange={handleChange}
          className={errores.ubicacion_restaurante ? 'input-error' : ''}
          placeholder="Dirección del restaurante"
        />
        <MensajeError nombreCampo="ubicacion_restaurante" />
      </div>

      <div className="mer-form-group">
        <label htmlFor="horario_servicio">
          Horario de Servicio
        </label>
        <input
          type="text"
          id="horario_servicio"
          name="horario_servicio"
          value={formData.horario_servicio}
          onChange={handleChange}
          placeholder="Ej: 08:00 - 23:00 hrs"
        />
      </div>

      <div className="mer-form-group">
        <label htmlFor="codigo_servicio">
          Código de Servicio
        </label>
        <input
          type="text"
          id="codigo_servicio"
          name="codigo_servicio"
          value={formData.codigo_servicio}
          onChange={handleChange}
          placeholder="Ej: REST-DES-001"
        />
      </div>

      <div className="mer-form-group">
        <label htmlFor="estado">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          {estados.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <div className="mer-form-group">
        <label className="mer-checkbox-label">
          <input
            type="checkbox"
            name="disponibilidad"
            checked={formData.disponibilidad}
            onChange={handleChange}
          />
          <span>Servicio disponible</span>
        </label>
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="mer-form-grid-documentos">
      <div className="mer-form-group-file">
        <label htmlFor="foto_servicio">
          <FileText size={20} />
          Fotografía del Servicio/Platillo
        </label>
        <input
          type="file"
          id="foto_servicio"
          name="foto_servicio"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_servicio && (
          <span className="mer-file-name">
            {typeof formData.foto_servicio === 'string'
              ? 'Archivo existente'
              : formData.foto_servicio.name}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="mer-overlay" onClick={onCerrar}>
      <div className="mer-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mer-header">
          <h2>Editar Servicio de Restaurante</h2>
          <button className="mer-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="mer-tabs">
          <button
            className={`mer-tab-button ${seccionActiva === 'generales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('generales')}
            type="button"
          >
            <UtensilsCrossed size={18} />
            Datos Generales
          </button>
          <button
            className={`mer-tab-button ${seccionActiva === 'paquete' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('paquete')}
            type="button"
          >
            <Package size={18} />
            Paquete y Precios
          </button>
          <button
            className={`mer-tab-button ${seccionActiva === 'ubicacion' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('ubicacion')}
            type="button"
          >
            <MapPin size={18} />
            Ubicación y Proveedor
          </button>
          <button
            className={`mer-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <FileText size={18} />
            Documentos
          </button>
        </div>

        {/* Formulario (scrolleable) */}
        <form onSubmit={handleSubmit} className="mer-form">
          {seccionActiva === 'generales' && renderSeccionGenerales()}
          {seccionActiva === 'paquete' && renderSeccionPaquete()}
          {seccionActiva === 'ubicacion' && renderSeccionUbicacion()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        {/* Footer (FUERA del form, fijo en el bottom) */}
        <div className="mer-footer">
          <div className="mer-botones-izquierda">
            <button type="button" className="mer-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="mer-botones-derecha">
            <button
              type="button"
              className={`mer-btn-actualizar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Actualizando...' : 'Actualizar Servicio'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarRestaurante;