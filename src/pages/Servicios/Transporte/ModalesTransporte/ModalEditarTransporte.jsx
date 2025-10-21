import { useState, useEffect, useCallback } from 'react';
import { X, Save, Truck, Package, DollarSign, MapPin, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalEditarTransporte.css';

const ModalEditarTransporte = ({ transporte, onGuardar, onCerrar, proveedores = [] }) => {
  const [formData, setFormData] = useState({
    nombre_servicio: '',
    tipo_transporte: '',
    capacidad: '',
    descripcion_servicio: '',
    tipo_paquete: '',
    duracion_paquete: '',
    precio_base: '',
    moneda: 'MXN',
    incluye: '',
    restricciones: '',
    empresa_proveedora_id: '',
    nombre_proveedor: '',
    ubicacion_salida: '',
    ubicacion_destino: '',
    disponibilidad: true,
    codigo_servicio: '',
    estado: 'Activo',
    foto_servicio: null
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('generales');
  const [guardando, setGuardando] = useState(false);

  // Listas de opciones
  const tiposTransporte = ['Taxi', 'Van', 'Autobús', 'Minibús', 'Sprinter', 'Camioneta', 'Auto Sedán'];
  const tiposPaquete = ['Por día', 'Por hora', 'Por viaje', 'Por semana', 'Por mes'];
  const monedas = ['MXN', 'USD'];
  const estados = ['Activo', 'Inactivo', 'Mantenimiento'];

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (transporte) {
      setFormData({
        nombre_servicio: transporte.nombre_servicio || '',
        tipo_transporte: transporte.tipo_transporte || '',
        capacidad: transporte.capacidad || '',
        descripcion_servicio: transporte.descripcion_servicio || '',
        tipo_paquete: transporte.tipo_paquete || '',
        duracion_paquete: transporte.duracion_paquete || '',
        precio_base: transporte.precio_base || '',
        moneda: transporte.moneda || 'MXN',
        incluye: transporte.incluye || '',
        restricciones: transporte.restricciones || '',
        empresa_proveedora_id: transporte.empresa_proveedora_id || '',
        nombre_proveedor: transporte.nombre_proveedor || '',
        ubicacion_salida: transporte.ubicacion_salida || '',
        ubicacion_destino: transporte.ubicacion_destino || '',
        disponibilidad: transporte.disponibilidad ?? true,
        codigo_servicio: transporte.codigo_servicio || '',
        estado: transporte.estado || 'Activo',
        foto_servicio: transporte.foto_servicio || null
      });
    }
  }, [transporte]);

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErrores((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[nombreCampo];
      return nuevosErrores;
    });
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));

      if (name === 'empresa_proveedora_id' && value) {
        const proveedorSeleccionado = proveedores.find((p) => p.id === parseInt(value));
        if (proveedorSeleccionado) {
          setFormData((prev) => ({
            ...prev,
            nombre_proveedor: proveedorSeleccionado.nombre
          }));
        }
      }

      if (errores[name]) limpiarErrorCampo(name);
    },
    [errores, limpiarErrorCampo, proveedores]
  );

  const handleFileChange = useCallback(
    (e) => {
      const { name, files } = e.target;
      if (files && files[0]) {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0]
        }));

        if (errores[name]) limpiarErrorCampo(name);
      }
    },
    [errores, limpiarErrorCampo]
  );

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    if (!formData.nombre_servicio.trim())
      nuevosErrores.nombre_servicio = 'El nombre del servicio es requerido';
    if (!formData.tipo_transporte) nuevosErrores.tipo_transporte = 'El tipo de transporte es requerido';
    if (!formData.capacidad || parseInt(formData.capacidad) < 1 || parseInt(formData.capacidad) > 100)
      nuevosErrores.capacidad = 'Capacidad inválida (1-100 pasajeros)';
    if (!formData.descripcion_servicio.trim())
      nuevosErrores.descripcion_servicio = 'La descripción es requerida';
    if (!formData.tipo_paquete) nuevosErrores.tipo_paquete = 'El tipo de paquete es requerido';
    if (!formData.precio_base || parseFloat(formData.precio_base) <= 0)
      nuevosErrores.precio_base = 'El precio debe ser mayor a 0';
    if (!formData.moneda) nuevosErrores.moneda = 'La moneda es requerida';
    if (!formData.ubicacion_salida.trim())
      nuevosErrores.ubicacion_salida = 'La ubicación de salida es requerida';
    if (!formData.ubicacion_destino.trim())
      nuevosErrores.ubicacion_destino = 'La ubicación de destino es requerida';
    if (formData.ubicacion_salida.trim() === formData.ubicacion_destino.trim())
      nuevosErrores.ubicacion_destino = 'El destino debe ser diferente al origen';

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const nuevosErrores = validarFormulario();

      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        const camposGenerales = ['nombre_servicio', 'tipo_transporte', 'capacidad', 'descripcion_servicio'];
        const camposPaquete = ['tipo_paquete', 'duracion_paquete', 'precio_base', 'moneda'];
        const camposUbicacion = ['empresa_proveedora_id', 'ubicacion_salida', 'ubicacion_destino'];

        const erroresEnGenerales = Object.keys(nuevosErrores).some((key) => camposGenerales.includes(key));
        const erroresEnPaquete = Object.keys(nuevosErrores).some((key) => camposPaquete.includes(key));
        const erroresEnUbicacion = Object.keys(nuevosErrores).some((key) => camposUbicacion.includes(key));

        if (erroresEnGenerales) setSeccionActiva('generales');
        else if (erroresEnPaquete) setSeccionActiva('paquete');
        else if (erroresEnUbicacion) setSeccionActiva('ubicacion');

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
        const transporteActualizado = {
          ...transporte,
          ...formData,
          capacidad: parseInt(formData.capacidad),
          precio_base: parseFloat(formData.precio_base)
        };

        await onGuardar(transporteActualizado);
        onCerrar();

        await new Promise((resolve) => setTimeout(resolve, 300));

        await Swal.fire({
          icon: 'success',
          title: '¡Servicio Actualizado!',
          html: `
            <div style="font-size: 1.1rem; margin-top: 15px;">
              <strong style="color: #2563eb; font-size: 1.3rem;">${formData.nombre_servicio}</strong>
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
          backdrop: `rgba(0,0,0,0.6)`
        });
      } catch (error) {
        console.error('❌ Error al actualizar:', error);
        onCerrar();

        await new Promise((resolve) => setTimeout(resolve, 300));

        await Swal.fire({
          icon: 'error',
          title: 'Error al Actualizar',
          html: `
            <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
              <p>Hubo un problema al actualizar el servicio de transporte.</p>
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
    },
    [formData, validarFormulario, onGuardar, transporte, onCerrar]
  );

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="modal-transporte-error-mensaje">{error}</span>;
  };

  const renderSeccionGenerales = () => (
    <div className="modal-transporte-form-grid">
      <div className="modal-transporte-form-group">
        <label>Nombre del Servicio *</label>
        <input
          type="text"
          name="nombre_servicio"
          value={formData.nombre_servicio}
          onChange={handleChange}
          className={errores.nombre_servicio ? 'modal-transporte-input-error' : ''}
        />
        <MensajeError nombreCampo="nombre_servicio" />
      </div>

      <div className="modal-transporte-form-group">
        <label>Tipo de Transporte *</label>
        <select
          name="tipo_transporte"
          value={formData.tipo_transporte}
          onChange={handleChange}
          className={errores.tipo_transporte ? 'modal-transporte-input-error' : ''}
        >
          <option value="">Seleccionar...</option>
          {tiposTransporte.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <MensajeError nombreCampo="tipo_transporte" />
      </div>

      <div className="modal-transporte-form-group">
        <label>Capacidad (pasajeros) *</label>
        <input
          type="number"
          name="capacidad"
          value={formData.capacidad}
          onChange={handleChange}
          min="1"
          max="100"
        />
        <MensajeError nombreCampo="capacidad" />
      </div>

      <div className="modal-transporte-form-group">
        <label>Código de Servicio</label>
        <input
          type="text"
          name="codigo_servicio"
          value={formData.codigo_servicio}
          onChange={handleChange}
          placeholder="Ej: TRV-001"
        />
      </div>

      <div className="modal-transporte-form-group modal-transporte-form-group-full">
        <label>Descripción *</label>
        <textarea
          name="descripcion_servicio"
          value={formData.descripcion_servicio}
          onChange={handleChange}
          rows="3"
        />
        <MensajeError nombreCampo="descripcion_servicio" />
      </div>
    </div>
  );

  const renderSeccionPaquete = () => (
    <div className="modal-transporte-form-grid">
      <div className="modal-transporte-form-group">
        <label>Tipo de Paquete *</label>
        <select
          name="tipo_paquete"
          value={formData.tipo_paquete}
          onChange={handleChange}
          className={errores.tipo_paquete ? 'modal-transporte-input-error' : ''}
        >
          <option value="">Seleccionar...</option>
          {tiposPaquete.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <MensajeError nombreCampo="tipo_paquete" />
      </div>

      <div className="modal-transporte-form-group">
        <label>Duración</label>
        <input type="text" name="duracion_paquete" value={formData.duracion_paquete} onChange={handleChange} />
      </div>

      <div className="modal-transporte-form-group">
        <label>Precio Base *</label>
        <input
          type="number"
          name="precio_base"
          value={formData.precio_base}
          onChange={handleChange}
          step="0.01"
          min="0"
        />
        <MensajeError nombreCampo="precio_base" />
      </div>

      <div className="modal-transporte-form-group">
        <label>Moneda *</label>
        <select name="moneda" value={formData.moneda} onChange={handleChange}>
          {monedas.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-transporte-form-group modal-transporte-form-group-full">
        <label>Incluye</label>
        <textarea name="incluye" value={formData.incluye} onChange={handleChange} rows="2" />
      </div>

      <div className="modal-transporte-form-group modal-transporte-form-group-full">
        <label>Restricciones</label>
        <textarea name="restricciones" value={formData.restricciones} onChange={handleChange} rows="2" />
      </div>
    </div>
  );

  const renderSeccionUbicacion = () => (
    <div className="modal-transporte-form-grid">
      <div className="modal-transporte-form-group">
        <label>Proveedor</label>
        <select name="empresa_proveedora_id" value={formData.empresa_proveedora_id} onChange={handleChange}>
          <option value="">Seleccionar proveedor...</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-transporte-form-group">
        <label>Nombre del Proveedor</label>
        <input
          type="text"
          name="nombre_proveedor"
          value={formData.nombre_proveedor}
          onChange={handleChange}
          readOnly={!!formData.empresa_proveedora_id}
        />
      </div>

      <div className="modal-transporte-form-group">
        <label>Ubicación de Salida *</label>
        <input type="text" name="ubicacion_salida" value={formData.ubicacion_salida} onChange={handleChange} />
        <MensajeError nombreCampo="ubicacion_salida" />
      </div>

      <div className="modal-transporte-form-group">
        <label>Ubicación de Destino *</label>
        <input type="text" name="ubicacion_destino" value={formData.ubicacion_destino} onChange={handleChange} />
        <MensajeError nombreCampo="ubicacion_destino" />
      </div>

      <div className="modal-transporte-form-group">
        <label>Estado</label>
        <select name="estado" value={formData.estado} onChange={handleChange}>
          {estados.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-transporte-form-group">
        <label className="modal-transporte-checkbox-label">
          <input type="checkbox" name="disponibilidad" checked={formData.disponibilidad} onChange={handleChange} />
          <span>Servicio disponible</span>
        </label>
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="modal-transporte-form-grid-documentos">
      <div className="modal-transporte-form-group-file">
        <label htmlFor="foto_servicio">
          <FileText size={20} /> Fotografía del Vehículo/Servicio
        </label>
        <input type="file" id="foto_servicio" name="foto_servicio" onChange={handleFileChange} accept="image/*" />
        {formData.foto_servicio && (
          <span className="modal-transporte-file-name">
            {typeof formData.foto_servicio === 'string'
              ? 'Imagen existente'
              : formData.foto_servicio.name}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-transporte-overlay" onClick={onCerrar}>
      <div className="modal-transporte-contenido modal-transporte-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-transporte-header">
          <h2>Editar Servicio de Transporte</h2>
          <button className="modal-transporte-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        <div className="modal-transporte-tabs">
          <button
            className={`modal-transporte-tab-button ${seccionActiva === 'generales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('generales')}
          >
            <Truck size={18} /> Datos Generales
          </button>
          <button
            className={`modal-transporte-tab-button ${seccionActiva === 'paquete' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('paquete')}
          >
            <Package size={18} /> Paquete y Precios
          </button>
          <button
            className={`modal-transporte-tab-button ${seccionActiva === 'ubicacion' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('ubicacion')}
          >
            <MapPin size={18} /> Ubicación y Proveedor
          </button>
          <button
            className={`modal-transporte-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
          >
            <FileText size={18} /> Documentos
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-transporte-form">
          {seccionActiva === 'generales' && renderSeccionGenerales()}
          {seccionActiva === 'paquete' && renderSeccionPaquete()}
          {seccionActiva === 'ubicacion' && renderSeccionUbicacion()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

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
              <span>{guardando ? 'Actualizando...' : 'Actualizar Servicio'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarTransporte;
