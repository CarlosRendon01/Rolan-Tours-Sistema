import { useState, useCallback } from 'react';
import { X, Save, Car, FileText, Image } from 'lucide-react';
import './ModalVehiculo.css';

const ModalVehiculo = ({ onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    // Campos básicos
    nombre: '',
    rendimiento: '',
    precio_combustible: '',
    desgaste: '',
    costo_renta: '',
    costo_chofer_dia: '',

    // Campos adicionales
    numero_serie: '',
    nip: '',
    numero_tag: '',
    numero_combustible: '',
    marca: '',
    modelo: '',
    color: '',
    año: '',
    numero_placa: '',
    numero_pasajeros: '',
    comentarios: '',
    vehiculos_disponibles: '',

    // Documentos
    foto_vehiculo: null,
    foto_poliza_seguro: null,
    foto_factura: null,
    foto_verificaciones: null,
    foto_folio_antt: null
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

    if (!formData.rendimiento || parseFloat(formData.rendimiento) <= 0) {
      nuevosErrores.rendimiento = 'El rendimiento debe ser mayor a 0';
    }

    if (!formData.precio_combustible || parseFloat(formData.precio_combustible) <= 0) {
      nuevosErrores.precio_combustible = 'El precio debe ser mayor a 0';
    }

    if (!formData.desgaste || parseFloat(formData.desgaste) < 0) {
      nuevosErrores.desgaste = 'El desgaste no puede ser negativo';
    }

    if (!formData.costo_renta || parseFloat(formData.costo_renta) <= 0) {
      nuevosErrores.costo_renta = 'El costo debe ser mayor a 0';
    }

    if (!formData.costo_chofer_dia || parseFloat(formData.costo_chofer_dia) <= 0) {
      nuevosErrores.costo_chofer_dia = 'El costo debe ser mayor a 0';
    }

    // Validaciones campos adicionales (obligatorios)
    if (!formData.marca.trim()) {
      nuevosErrores.marca = 'La marca es requerida';
    }

    if (!formData.modelo.trim()) {
      nuevosErrores.modelo = 'El modelo es requerido';
    }

    const añoActual = new Date().getFullYear();
    if (!formData.año || parseInt(formData.año) < 1900 || parseInt(formData.año) > añoActual + 1) {
      nuevosErrores.año = 'Año inválido';
    }

    if (!formData.numero_placa.trim()) {
      nuevosErrores.numero_placa = 'La placa es requerida';
    }

    if (!formData.numero_pasajeros || parseInt(formData.numero_pasajeros) <= 0) {
      nuevosErrores.numero_pasajeros = 'Debe ser mayor a 0';
    }

    if (!formData.vehiculos_disponibles || parseInt(formData.vehiculos_disponibles) < 0) {
      nuevosErrores.vehiculos_disponibles = 'Campo requerido';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      // Determinar qué sección tiene errores
      const camposBasicos = ['nombre', 'rendimiento', 'precio_combustible', 'desgaste', 'costo_renta', 'costo_chofer_dia'];
      const camposAdicionales = ['marca', 'modelo', 'año', 'numero_placa', 'numero_pasajeros', 'vehiculos_disponibles'];

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
      const vehiculoData = {
        // Campos básicos
        nombre: formData.nombre,
        rendimiento: parseFloat(formData.rendimiento),
        precio_combustible: parseFloat(formData.precio_combustible),
        desgaste: parseFloat(formData.desgaste),
        costo_renta: parseFloat(formData.costo_renta),
        costo_chofer_dia: parseFloat(formData.costo_chofer_dia),

        // Campos adicionales
        numero_serie: formData.numero_serie,
        nip: formData.nip,
        numero_tag: formData.numero_tag,
        numero_combustible: formData.numero_combustible,
        marca: formData.marca,
        modelo: formData.modelo,
        color: formData.color,
        año: parseInt(formData.año),
        numero_placa: formData.numero_placa,
        numero_pasajeros: parseInt(formData.numero_pasajeros),
        comentarios: formData.comentarios,
        vehiculos_disponibles: parseInt(formData.vehiculos_disponibles),

        // Documentos
        documentos: {
          foto_vehiculo: formData.foto_vehiculo,
          foto_poliza_seguro: formData.foto_poliza_seguro,
          foto_factura: formData.foto_factura,
          foto_verificaciones: formData.foto_verificaciones,
          foto_folio_antt: formData.foto_folio_antt
        }
      };

      await onGuardar(vehiculoData);
    } finally {
      setGuardando(false);
    }
  }, [formData, validarFormulario, onGuardar]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;

    return <span className="error-mensaje">{error}</span>;
  };

  const renderSeccionBasicos = () => (
    <div className="form-grid">
      <div className="form-group">
        <label htmlFor="nombre">
          Nombre del Vehículo <span className="required">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={errores.nombre ? 'input-error' : ''}
          placeholder="Ej: Sprinter Mercedes-Benz"
        />
        <MensajeError nombreCampo="nombre" />
      </div>

      <div className="form-group">
        <label htmlFor="rendimiento">
          Rendimiento (km/L) <span className="required">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="rendimiento"
          name="rendimiento"
          value={formData.rendimiento}
          onChange={handleChange}
          className={errores.rendimiento ? 'input-error' : ''}
          placeholder="12.50"
        />
        <MensajeError nombreCampo="rendimiento" />
      </div>

      <div className="form-group">
        <label htmlFor="precio_combustible">
          Precio Combustible (MXN) <span className="required">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="precio_combustible"
          name="precio_combustible"
          value={formData.precio_combustible}
          onChange={handleChange}
          className={errores.precio_combustible ? 'input-error' : ''}
          placeholder="24.50"
        />
        <MensajeError nombreCampo="precio_combustible" />
      </div>

      <div className="form-group">
        <label htmlFor="desgaste">
          Desgaste <span className="required">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="desgaste"
          name="desgaste"
          value={formData.desgaste}
          onChange={handleChange}
          className={errores.desgaste ? 'input-error' : ''}
          placeholder="0.15"
        />
        <MensajeError nombreCampo="desgaste" />
      </div>

      <div className="form-group">
        <label htmlFor="costo_renta">
          Costo Renta (MXN) <span className="required">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="costo_renta"
          name="costo_renta"
          value={formData.costo_renta}
          onChange={handleChange}
          className={errores.costo_renta ? 'input-error' : ''}
          placeholder="2500.00"
        />
        <MensajeError nombreCampo="costo_renta" />
      </div>

      <div className="form-group">
        <label htmlFor="costo_chofer_dia">
          Costo Chofer/Día (MXN) <span className="required">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="costo_chofer_dia"
          name="costo_chofer_dia"
          value={formData.costo_chofer_dia}
          onChange={handleChange}
          className={errores.costo_chofer_dia ? 'input-error' : ''}
          placeholder="800.00"
        />
        <MensajeError nombreCampo="costo_chofer_dia" />
      </div>
    </div>
  );

  const renderSeccionAdicionales = () => (
    <div className="form-grid">
      <div className="form-group">
        <label htmlFor="marca">
          Marca <span className="required">*</span>
        </label>
        <input
          type="text"
          id="marca"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          className={errores.marca ? 'input-error' : ''}
          placeholder="Ej: Mercedes-Benz"
        />
        <MensajeError nombreCampo="marca" />
      </div>

      <div className="form-group">
        <label htmlFor="modelo">
          Modelo <span className="required">*</span>
        </label>
        <input
          type="text"
          id="modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          className={errores.modelo ? 'input-error' : ''}
          placeholder="Ej: Sprinter 2024"
        />
        <MensajeError nombreCampo="modelo" />
      </div>

      <div className="form-group">
        <label htmlFor="año">
          Año <span className="required">*</span>
        </label>
        <input
          type="number"
          id="año"
          name="año"
          value={formData.año}
          onChange={handleChange}
          className={errores.año ? 'input-error' : ''}
          placeholder="2024"
        />
        <MensajeError nombreCampo="año" />
      </div>

      <div className="form-group">
        <label htmlFor="color">Color</label>
        <input
          type="text"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Ej: Blanco"
        />
      </div>

      <div className="form-group">
        <label htmlFor="numero_placa">
          N° Placa <span className="required">*</span>
        </label>
        <input
          type="text"
          id="numero_placa"
          name="numero_placa"
          value={formData.numero_placa}
          onChange={handleChange}
          className={errores.numero_placa ? 'input-error' : ''}
          placeholder="ABC-123-XY"
        />
        <MensajeError nombreCampo="numero_placa" />
      </div>

      <div className="form-group">
        <label htmlFor="numero_pasajeros">
          N° Pasajeros <span className="required">*</span>
        </label>
        <input
          type="number"
          id="numero_pasajeros"
          name="numero_pasajeros"
          value={formData.numero_pasajeros}
          onChange={handleChange}
          className={errores.numero_pasajeros ? 'input-error' : ''}
          placeholder="15"
        />
        <MensajeError nombreCampo="numero_pasajeros" />
      </div>

      <div className="form-group">
        <label htmlFor="numero_serie">Número de Serie</label>
        <input
          type="text"
          id="numero_serie"
          name="numero_serie"
          value={formData.numero_serie}
          onChange={handleChange}
          placeholder="WDB9066661N123456"
        />
      </div>

      <div className="form-group">
        <label htmlFor="nip">NIP</label>
        <input
          type="text"
          id="nip"
          name="nip"
          value={formData.nip}
          onChange={handleChange}
          placeholder="1234"
        />
      </div>

      <div className="form-group">
        <label htmlFor="numero_tag">N° de Tag</label>
        <input
          type="text"
          id="numero_tag"
          name="numero_tag"
          value={formData.numero_tag}
          onChange={handleChange}
          placeholder="TAG-001"
        />
      </div>

      <div className="form-group">
        <label htmlFor="numero_combustible">N° de Combustible</label>
        <input
          type="text"
          id="numero_combustible"
          name="numero_combustible"
          value={formData.numero_combustible}
          onChange={handleChange}
          placeholder="COMB-12345"
        />
      </div>

      <div className="form-group">
        <label htmlFor="vehiculos_disponibles">
          Vehículos Disponibles <span className="required">*</span>
        </label>
        <input
          type="number"
          id="vehiculos_disponibles"
          name="vehiculos_disponibles"
          value={formData.vehiculos_disponibles}
          onChange={handleChange}
          className={errores.vehiculos_disponibles ? 'input-error' : ''}
          placeholder="3"
        />
        <MensajeError nombreCampo="vehiculos_disponibles" />
      </div>

      <div className="form-group form-group-full">
        <label htmlFor="comentarios">Comentarios</label>
        <textarea
          id="comentarios"
          name="comentarios"
          value={formData.comentarios}
          onChange={handleChange}
          placeholder="Información adicional sobre el vehículo..."
          rows="3"
        />
      </div>
    </div>
  );

  const renderSeccionDocumentos = () => (
    <div className="form-grid-documentos">
      <div className="form-group-file">
        <label htmlFor="foto_vehiculo">
          <Image size={20} />
          Foto de Vehículo
        </label>
        <input
          type="file"
          id="foto_vehiculo"
          name="foto_vehiculo"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_vehiculo && (
          <span className="file-name">{formData.foto_vehiculo.name}</span>
        )}
      </div>

      <div className="form-group-file">
        <label htmlFor="foto_poliza_seguro">
          <FileText size={20} />
          Póliza de Seguro
        </label>
        <input
          type="file"
          id="foto_poliza_seguro"
          name="foto_poliza_seguro"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_poliza_seguro && (
          <span className="file-name">{formData.foto_poliza_seguro.name}</span>
        )}
      </div>

      <div className="form-group-file">
        <label htmlFor="foto_factura">
          <FileText size={20} />
          Factura
        </label>
        <input
          type="file"
          id="foto_factura"
          name="foto_factura"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_factura && (
          <span className="file-name">{formData.foto_factura.name}</span>
        )}
      </div>

      <div className="form-group-file">
        <label htmlFor="foto_verificaciones">
          <FileText size={20} />
          Verificaciones
        </label>
        <input
          type="file"
          id="foto_verificaciones"
          name="foto_verificaciones"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_verificaciones && (
          <span className="file-name">{formData.foto_verificaciones.name}</span>
        )}
      </div>

      <div className="form-group-file">
        <label htmlFor="foto_folio_antt">
          <FileText size={20} />
          Folio ANTT
        </label>
        <input
          type="file"
          id="foto_folio_antt"
          name="foto_folio_antt"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_folio_antt && (
          <span className="file-name">{formData.foto_folio_antt.name}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Agregar Nuevo Vehículo</h2>
          <button className="btn-cerrar-modal" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="modal-tabs">
          <button
            className={`tab-button ${seccionActiva === 'basicos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('basicos')}
            type="button"
          >
            <Car size={18} />
            Datos Básicos
          </button>
          <button
            className={`tab-button ${seccionActiva === 'adicionales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('adicionales')}
            type="button"
          >
            <FileText size={18} />
            Información Adicional
          </button>
          <button
            className={`tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <Image size={18} />
            Documentos
          </button>
        </div>

        {/* Formulario (scrolleable) */}
        <form onSubmit={handleSubmit} className="modal-form">
          {seccionActiva === 'basicos' && renderSeccionBasicos()}
          {seccionActiva === 'adicionales' && renderSeccionAdicionales()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        {/* Footer (FUERA del form, fijo en el bottom) */}
        <div className="modal-footer">
          <div className="botones-izquierda">
            <button type="button" className="btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="botones-derecha">
            <button 
              type="button" 
              className={`btn-guardar ${guardando ? 'loading' : ''}`} 
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Guardando...' : 'Guardar Vehículo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVehiculo;