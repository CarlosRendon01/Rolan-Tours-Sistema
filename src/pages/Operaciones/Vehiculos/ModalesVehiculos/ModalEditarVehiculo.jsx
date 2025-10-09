import { useState, useEffect } from 'react';
import { X, Save, Car, FileText, Image } from 'lucide-react';
import './ModalEditarVehiculo.css';

const ModalEditarVehiculo = ({ vehiculo, onGuardar, onCerrar }) => {
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

  // Cargar datos del vehículo cuando se abre el modal
  useEffect(() => {
    if (vehiculo) {
      setFormData({
        nombre: vehiculo.nombre || '',
        rendimiento: vehiculo.rendimiento || '',
        precio_combustible: vehiculo.precio_combustible || '',
        desgaste: vehiculo.desgaste || '',
        costo_renta: vehiculo.costo_renta || '',
        costo_chofer_dia: vehiculo.costo_chofer_dia || '',
        numero_serie: vehiculo.numero_serie || '',
        nip: vehiculo.nip || '',
        numero_tag: vehiculo.numero_tag || '',
        numero_combustible: vehiculo.numero_combustible || '',
        marca: vehiculo.marca || '',
        modelo: vehiculo.modelo || '',
        color: vehiculo.color || '',
        año: vehiculo.año || '',
        numero_placa: vehiculo.numero_placa || '',
        numero_pasajeros: vehiculo.numero_pasajeros || '',
        comentarios: vehiculo.comentarios || '',
        vehiculos_disponibles: vehiculo.vehiculos_disponibles || '',
        foto_vehiculo: vehiculo.documentos?.foto_vehiculo || null,
        foto_poliza_seguro: vehiculo.documentos?.foto_poliza_seguro || null,
        foto_factura: vehiculo.documentos?.foto_factura || null,
        foto_verificaciones: vehiculo.documentos?.foto_verificaciones || null,
        foto_folio_antt: vehiculo.documentos?.foto_folio_antt || null
      });
    }
  }, [vehiculo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      if (errores[name]) {
        setErrores(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.rendimiento || parseFloat(formData.rendimiento) <= 0) {
      nuevosErrores.rendimiento = 'El rendimiento debe ser mayor a 0';
    }

    if (!formData.precio_combustible || parseFloat(formData.precio_combustible) <= 0) {
      nuevosErrores.precio_combustible = 'El precio de combustible debe ser mayor a 0';
    }

    if (!formData.desgaste || parseFloat(formData.desgaste) < 0) {
      nuevosErrores.desgaste = 'El desgaste no puede ser negativo';
    }

    if (!formData.costo_renta || parseFloat(formData.costo_renta) <= 0) {
      nuevosErrores.costo_renta = 'El costo de renta debe ser mayor a 0';
    }

    if (!formData.costo_chofer_dia || parseFloat(formData.costo_chofer_dia) <= 0) {
      nuevosErrores.costo_chofer_dia = 'El costo del chofer debe ser mayor a 0';
    }

    if (!formData.marca.trim()) {
      nuevosErrores.marca = 'La marca es requerida';
    }

    if (!formData.modelo.trim()) {
      nuevosErrores.modelo = 'El modelo es requerido';
    }

    if (!formData.año || parseInt(formData.año) < 1900 || parseInt(formData.año) > new Date().getFullYear() + 1) {
      nuevosErrores.año = 'Año inválido';
    }

    if (!formData.numero_placa.trim()) {
      nuevosErrores.numero_placa = 'La placa es requerida';
    }

    if (!formData.numero_pasajeros || parseInt(formData.numero_pasajeros) <= 0) {
      nuevosErrores.numero_pasajeros = 'El número de pasajeros debe ser mayor a 0';
    }

    if (!formData.vehiculos_disponibles || parseInt(formData.vehiculos_disponibles) < 0) {
      nuevosErrores.vehiculos_disponibles = 'Debe especificar vehículos disponibles';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      const vehiculoData = {
        ...vehiculo,
        nombre: formData.nombre,
        rendimiento: parseFloat(formData.rendimiento),
        precio_combustible: parseFloat(formData.precio_combustible),
        desgaste: parseFloat(formData.desgaste),
        costo_renta: parseFloat(formData.costo_renta),
        costo_chofer_dia: parseFloat(formData.costo_chofer_dia),
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
        documentos: {
          foto_vehiculo: formData.foto_vehiculo,
          foto_poliza_seguro: formData.foto_poliza_seguro,
          foto_factura: formData.foto_factura,
          foto_verificaciones: formData.foto_verificaciones,
          foto_folio_antt: formData.foto_folio_antt
        }
      };

      onGuardar(vehiculoData);
    }
  };

  const renderSeccionBasicos = () => (
    <div className="form-grid">
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Vehículo *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={errores.nombre ? 'input-error' : ''}
          placeholder="Ej: Sprinter Mercedes-Benz"
        />
        {errores.nombre && <span className="error-mensaje">{errores.nombre}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rendimiento">Rendimiento (km/L) *</label>
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
        {errores.rendimiento && <span className="error-mensaje">{errores.rendimiento}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="precio_combustible">Precio Combustible (MXN) *</label>
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
        {errores.precio_combustible && <span className="error-mensaje">{errores.precio_combustible}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="desgaste">Desgaste *</label>
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
        {errores.desgaste && <span className="error-mensaje">{errores.desgaste}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="costo_renta">Costo Renta (MXN) *</label>
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
        {errores.costo_renta && <span className="error-mensaje">{errores.costo_renta}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="costo_chofer_dia">Costo Chofer/Día (MXN) *</label>
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
        {errores.costo_chofer_dia && <span className="error-mensaje">{errores.costo_chofer_dia}</span>}
      </div>
    </div>
  );

  const renderSeccionAdicionales = () => (
    <div className="form-grid">
      <div className="form-group">
        <label htmlFor="marca">Marca *</label>
        <input
          type="text"
          id="marca"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          className={errores.marca ? 'input-error' : ''}
          placeholder="Ej: Mercedes-Benz"
        />
        {errores.marca && <span className="error-mensaje">{errores.marca}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="modelo">Modelo *</label>
        <input
          type="text"
          id="modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          className={errores.modelo ? 'input-error' : ''}
          placeholder="Ej: Sprinter 2024"
        />
        {errores.modelo && <span className="error-mensaje">{errores.modelo}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="año">Año *</label>
        <input
          type="number"
          id="año"
          name="año"
          value={formData.año}
          onChange={handleChange}
          className={errores.año ? 'input-error' : ''}
          placeholder="2024"
        />
        {errores.año && <span className="error-mensaje">{errores.año}</span>}
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
        <label htmlFor="numero_placa">N° Placa *</label>
        <input
          type="text"
          id="numero_placa"
          name="numero_placa"
          value={formData.numero_placa}
          onChange={handleChange}
          className={errores.numero_placa ? 'input-error' : ''}
          placeholder="ABC-123-XY"
        />
        {errores.numero_placa && <span className="error-mensaje">{errores.numero_placa}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="numero_pasajeros">N° Pasajeros *</label>
        <input
          type="number"
          id="numero_pasajeros"
          name="numero_pasajeros"
          value={formData.numero_pasajeros}
          onChange={handleChange}
          className={errores.numero_pasajeros ? 'input-error' : ''}
          placeholder="15"
        />
        {errores.numero_pasajeros && <span className="error-mensaje">{errores.numero_pasajeros}</span>}
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
        <label htmlFor="vehiculos_disponibles">Vehículos Disponibles *</label>
        <input
          type="number"
          id="vehiculos_disponibles"
          name="vehiculos_disponibles"
          value={formData.vehiculos_disponibles}
          onChange={handleChange}
          className={errores.vehiculos_disponibles ? 'input-error' : ''}
          placeholder="3"
        />
        {errores.vehiculos_disponibles && <span className="error-mensaje">{errores.vehiculos_disponibles}</span>}
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
          <span className="file-name">
            {typeof formData.foto_vehiculo === 'string' 
              ? 'Archivo existente' 
              : formData.foto_vehiculo.name}
          </span>
        )}
      </div>

      <div className="form-group-file">
        <label htmlFor="foto_poliza_seguro">
          <FileText size={20} />
          Foto Póliza de Seguro
        </label>
        <input
          type="file"
          id="foto_poliza_seguro"
          name="foto_poliza_seguro"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_poliza_seguro && (
          <span className="file-name">
            {typeof formData.foto_poliza_seguro === 'string' 
              ? 'Archivo existente' 
              : formData.foto_poliza_seguro.name}
          </span>
        )}
      </div>

      <div className="form-group-file">
        <label htmlFor="foto_factura">
          <FileText size={20} />
          Foto de Factura
        </label>
        <input
          type="file"
          id="foto_factura"
          name="foto_factura"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_factura && (
          <span className="file-name">
            {typeof formData.foto_factura === 'string' 
              ? 'Archivo existente' 
              : formData.foto_factura.name}
          </span>
        )}
      </div>

      <div className="form-group-file">
        <label htmlFor="foto_verificaciones">
          <FileText size={20} />
          Foto Verificaciones
        </label>
        <input
          type="file"
          id="foto_verificaciones"
          name="foto_verificaciones"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_verificaciones && (
          <span className="file-name">
            {typeof formData.foto_verificaciones === 'string' 
              ? 'Archivo existente' 
              : formData.foto_verificaciones.name}
          </span>
        )}
      </div>

      <div className="form-group-file">
        <label htmlFor="foto_folio_antt">
          <FileText size={20} />
          Foto Folio ANTT
        </label>
        <input
          type="file"
          id="foto_folio_antt"
          name="foto_folio_antt"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        {formData.foto_folio_antt && (
          <span className="file-name">
            {typeof formData.foto_folio_antt === 'string' 
              ? 'Archivo existente' 
              : formData.foto_folio_antt.name}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Vehículo</h2>
          <button className="btn-cerrar-modal" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

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

        <form onSubmit={handleSubmit} className="modal-form">
          {seccionActiva === 'basicos' && renderSeccionBasicos()}
          {seccionActiva === 'adicionales' && renderSeccionAdicionales()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}

          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-actualizar">
              <Save size={20} />
              <span>Actualizar Vehículo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarVehiculo;