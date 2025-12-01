import { useState, useCallback } from 'react';
import { X, Save, MapPin, DollarSign, Users, FileText, Image } from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalAgregarTours.css';

const ModalAgregarTours = ({ onGuardar, onCerrar, proveedores = [] }) => {
  const [formData, setFormData] = useState({
    // Datos generales
    nombre_tour: '',
    tipo_tour: '',
    duracion_tour: '',
    capacidad_maxima: '',
    descripcion_tour: '',
    nivel_dificultad: '',
    idiomas_disponibles: [],
    punto_partida: '',
    punto_llegada: '',
    hora_salida: '',
    hora_regreso: '',

    // Paquete y precios
    tipo_paquete: '',
    precio_base: '',
    moneda: 'MXN',
    incluye: '',
    no_incluye: '',
    descuento_disponible: false,
    iva_incluido: true,
    costo_por_nino: '',
    costo_por_adulto_mayor: '',
    temporada: '',

    // Proveedor
    operado_por: '',
    empresa_proveedora_id: '',
    guia_principal: '',
    contacto_proveedor: '',
    ubicacion_salida: '',
    disponibilidad: 'Diario',
    transporte_incluido: false,
    seguro_incluido: false,
    numero_licencia_guia: '',

    // Documentos
    foto_tour: null,

    // Administrativo
    codigo_tour: '',
    estado: 'activo'
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

  const handleIdiomasChange = useCallback((e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      idiomas_disponibles: checked
        ? [...prev.idiomas_disponibles, value]
        : prev.idiomas_disponibles.filter(idioma => idioma !== value)
    }));
  }, []);

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
    if (!formData.codigo_tour.trim()) {
      nuevosErrores.codigo_tour = 'El código del tour es requerido';
    }

    if (!formData.nombre_tour.trim()) {
      nuevosErrores.nombre_tour = 'El nombre del tour es requerido';
    }

    if (!formData.tipo_tour) {
      nuevosErrores.tipo_tour = 'El tipo de tour es requerido';
    }

    if (!formData.duracion_tour.trim()) {
      nuevosErrores.duracion_tour = 'La duración es requerida';
    }

    if (!formData.capacidad_maxima || parseInt(formData.capacidad_maxima) < 1) {
      nuevosErrores.capacidad_maxima = 'La capacidad debe ser al menos 1';
    }

    if (!formData.descripcion_tour.trim()) {
      nuevosErrores.descripcion_tour = 'La descripción es requerida';
    }

    if (!formData.nivel_dificultad) {
      nuevosErrores.nivel_dificultad = 'El nivel de dificultad es requerido';
    }

    if (formData.idiomas_disponibles.length === 0) {
      nuevosErrores.idiomas_disponibles = 'Selecciona al menos un idioma';
    }

    // Validaciones paquete y precios
    if (!formData.tipo_paquete) {
      nuevosErrores.tipo_paquete = 'El tipo de paquete es requerido';
    }

    if (!formData.precio_base || parseFloat(formData.precio_base) <= 0) {
      nuevosErrores.precio_base = 'El precio debe ser mayor a 0';
    }

    if (!formData.incluye.trim()) {
      nuevosErrores.incluye = 'Especifica qué incluye el tour';
    }

    // Validaciones proveedor
    if (!formData.operado_por.trim()) {
      nuevosErrores.operado_por = 'El operador es requerido';
    }

    if (!formData.empresa_proveedora_id) {
      nuevosErrores.empresa_proveedora_id = 'Selecciona un proveedor';
    }

    if (!formData.guia_principal.trim()) {
      nuevosErrores.guia_principal = 'El guía principal es requerido';
    }

    if (!formData.contacto_proveedor.trim()) {
      nuevosErrores.contacto_proveedor = 'El contacto es requerido';
    }

    if (!formData.ubicacion_salida.trim()) {
      nuevosErrores.ubicacion_salida = 'La ubicación de salida es requerida';
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      const camposGenerales = ['codigo_tour', 'nombre_tour', 'tipo_tour', 'duracion_tour', 'capacidad_maxima', 'descripcion_tour', 'nivel_dificultad', 'idiomas_disponibles', 'punto_partida', 'punto_llegada', 'hora_salida', 'hora_regreso'];
      const camposPaquete = ['tipo_paquete', 'precio_base', 'moneda', 'incluye', 'no_incluye', 'descuento_disponible', 'iva_incluido', 'costo_por_nino', 'costo_por_adulto_mayor', 'temporada'];
      const camposProveedor = ['operado_por', 'empresa_proveedora_id', 'guia_principal', 'contacto_proveedor', 'ubicacion_salida', 'disponibilidad', 'transporte_incluido', 'seguro_incluido', 'numero_licencia_guia'];

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

      const tourData = {
        codigo_tour: formData.codigo_tour,
        nombre_tour: formData.nombre_tour,
        tipo_tour: formData.tipo_tour,
        duracion_tour: formData.duracion_tour,
        capacidad_maxima: parseInt(formData.capacidad_maxima),
        descripcion_tour: formData.descripcion_tour,
        nivel_dificultad: formData.nivel_dificultad,
        idiomas_disponibles: formData.idiomas_disponibles,
        punto_partida: formData.punto_partida,
        punto_llegada: formData.punto_llegada,
        hora_salida: formData.hora_salida,
        hora_regreso: formData.hora_regreso,
        tipo_paquete: formData.tipo_paquete,
        precio_base: parseFloat(formData.precio_base),
        moneda: formData.moneda,
        incluye: formData.incluye,
        no_incluye: formData.no_incluye,
        descuento_disponible: formData.descuento_disponible,
        iva_incluido: formData.iva_incluido,
        costo_por_nino: formData.costo_por_nino ? parseFloat(formData.costo_por_nino) : null,
        costo_por_adulto_mayor: formData.costo_por_adulto_mayor ? parseFloat(formData.costo_por_adulto_mayor) : null,
        temporada: formData.temporada,
        operado_por: formData.operado_por,
        empresa_proveedora_id: parseInt(formData.empresa_proveedora_id),
        nombre_proveedor: proveedorSeleccionado?.nombre || '',
        guia_principal: formData.guia_principal,
        contacto_proveedor: formData.contacto_proveedor,
        ubicacion_salida: formData.ubicacion_salida,
        disponibilidad: formData.disponibilidad,
        transporte_incluido: formData.transporte_incluido,
        seguro_incluido: formData.seguro_incluido,
        numero_licencia_guia: formData.numero_licencia_guia,
        foto_tour: formData.foto_tour,
        estado: formData.estado,
        fecha_registro: new Date().toISOString().split('T')[0],
        usuario_registro: 'admin'
      };

      const nombreTour = formData.nombre_tour;

      await onGuardar(tourData);

      onCerrar();

      await new Promise(resolve => setTimeout(resolve, 300));

      await Swal.fire({
        icon: 'success',
        title: '¡Tour Agregado!',
        html: `
          <div style="font-size: 1.1rem; margin-top: 15px;">
            <strong style="color: #2563eb; font-size: 1.3rem;">${nombreTour}</strong>
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
            <p>Hubo un problema al guardar el tour.</p>
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
    return <span className="modal-agregar-tour-error-mensaje">{error}</span>;
  };

  const renderSeccionGenerales = () => (
    <>
      <div className="modal-agregar-tour-form-grid">
        <div className="modal-agregar-tour-form-group">
          <label htmlFor="codigo_tour">
            Código del Tour <span className="modal-agregar-tour-required">*</span>
          </label>
          <input
            type="text"
            id="codigo_tour"
            name="codigo_tour"
            value={formData.codigo_tour}
            onChange={handleChange}
            className={errores.codigo_tour ? 'modal-agregar-tour-input-error' : ''}
            placeholder="Ej: TUR-001"
          />
          <MensajeError nombreCampo="codigo_tour" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="nombre_tour">
            Nombre del Tour <span className="modal-agregar-tour-required">*</span>
          </label>
          <input
            type="text"
            id="nombre_tour"
            name="nombre_tour"
            value={formData.nombre_tour}
            onChange={handleChange}
            className={errores.nombre_tour ? 'modal-agregar-tour-input-error' : ''}
            placeholder="Ej: Cascadas de Hierve el Agua"
          />
          <MensajeError nombreCampo="nombre_tour" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="tipo_tour">
            Tipo de Tour <span className="modal-agregar-tour-required">*</span>
          </label>
          <select
            id="tipo_tour"
            name="tipo_tour"
            value={formData.tipo_tour}
            onChange={handleChange}
            className={errores.tipo_tour ? 'modal-agregar-tour-input-error' : ''}
          >
            <option value="">Selecciona una opción</option>
            <option value="Ecoturismo">Ecoturismo</option>
            <option value="Cultural">Cultural</option>
            <option value="Gastronómico">Gastronómico</option>
            <option value="Aventura">Aventura</option>
            <option value="Arqueológico">Arqueológico</option>
            <option value="Histórico">Histórico</option>
            <option value="Religioso">Religioso</option>
          </select>
          <MensajeError nombreCampo="tipo_tour" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="duracion_tour">
            Duración <span className="modal-agregar-tour-required">*</span>
          </label>
          <input
            type="text"
            id="duracion_tour"
            name="duracion_tour"
            value={formData.duracion_tour}
            onChange={handleChange}
            className={errores.duracion_tour ? 'modal-agregar-tour-input-error' : ''}
            placeholder="Ej: 8 horas, 2 días"
          />
          <MensajeError nombreCampo="duracion_tour" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="capacidad_maxima">
            Capacidad Máxima <span className="modal-agregar-tour-required">*</span>
          </label>
          <input
            type="number"
            id="capacidad_maxima"
            name="capacidad_maxima"
            value={formData.capacidad_maxima}
            onChange={handleChange}
            className={errores.capacidad_maxima ? 'modal-agregar-tour-input-error' : ''}
            placeholder="15"
            min="1"
          />
          <MensajeError nombreCampo="capacidad_maxima" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="nivel_dificultad">
            Nivel de Dificultad <span className="modal-agregar-tour-required">*</span>
          </label>
          <select
            id="nivel_dificultad"
            name="nivel_dificultad"
            value={formData.nivel_dificultad}
            onChange={handleChange}
            className={errores.nivel_dificultad ? 'modal-agregar-tour-input-error' : ''}
          >
            <option value="">Selecciona una opción</option>
            <option value="Bajo">Bajo</option>
            <option value="Medio">Medio</option>
            <option value="Alto">Alto</option>
          </select>
          <MensajeError nombreCampo="nivel_dificultad" />
        </div>

        <div className="modal-agregar-tour-form-group modal-agregar-tour-form-group-full">
          <label>
            Idiomas Disponibles <span className="modal-agregar-tour-required">*</span>
          </label>
          <div className="modal-agregar-tour-checkbox-group">
            <label className="modal-agregar-tour-checkbox-label">
              <input
                type="checkbox"
                value="Español"
                checked={formData.idiomas_disponibles.includes('Español')}
                onChange={handleIdiomasChange}
              />
              Español
            </label>
            <label className="modal-agregar-tour-checkbox-label">
              <input
                type="checkbox"
                value="Inglés"
                checked={formData.idiomas_disponibles.includes('Inglés')}
                onChange={handleIdiomasChange}
              />
              Inglés
            </label>
            <label className="modal-agregar-tour-checkbox-label">
              <input
                type="checkbox"
                value="Francés"
                checked={formData.idiomas_disponibles.includes('Francés')}
                onChange={handleIdiomasChange}
              />
              Francés
            </label>
            <label className="modal-agregar-tour-checkbox-label">
              <input
                type="checkbox"
                value="Alemán"
                checked={formData.idiomas_disponibles.includes('Alemán')}
                onChange={handleIdiomasChange}
              />
              Alemán
            </label>
            <label className="modal-agregar-tour-checkbox-label">
              <input
                type="checkbox"
                value="Italiano"
                checked={formData.idiomas_disponibles.includes('Italiano')}
                onChange={handleIdiomasChange}
              />
              Italiano
            </label>
          </div>
          <MensajeError nombreCampo="idiomas_disponibles" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="punto_partida">
            Punto de Partida
          </label>
          <input
            type="text"
            id="punto_partida"
            name="punto_partida"
            value={formData.punto_partida}
            onChange={handleChange}
            placeholder="Ej: Centro de Oaxaca"
          />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="punto_llegada">
            Punto de Llegada
          </label>
          <input
            type="text"
            id="punto_llegada"
            name="punto_llegada"
            value={formData.punto_llegada}
            onChange={handleChange}
            placeholder="Ej: Hierve el Agua"
          />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="hora_salida">
            Hora de Salida
          </label>
          <input
            type="time"
            id="hora_salida"
            name="hora_salida"
            value={formData.hora_salida}
            onChange={handleChange}
          />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="hora_regreso">
            Hora de Regreso
          </label>
          <input
            type="time"
            id="hora_regreso"
            name="hora_regreso"
            value={formData.hora_regreso}
            onChange={handleChange}
          />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="estado">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>

        <div className="modal-agregar-tour-form-group modal-agregar-tour-form-group-full">
          <label htmlFor="descripcion_tour">
            Descripción del Tour <span className="modal-agregar-tour-required">*</span>
          </label>
          <textarea
            id="descripcion_tour"
            name="descripcion_tour"
            value={formData.descripcion_tour}
            onChange={handleChange}
            className={errores.descripcion_tour ? 'modal-agregar-tour-input-error' : ''}
            placeholder="Describe el tour, actividades, lugares a visitar..."
            rows="4"
          />
          <MensajeError nombreCampo="descripcion_tour" />
        </div>
      </div>
    </>
  );

  const renderSeccionPaquete = () => (
    <>
      <div className="modal-agregar-tour-form-grid-tres">
        <div className="modal-agregar-tour-form-group">
          <label htmlFor="tipo_paquete">
            Tipo de Paquete <span className="modal-agregar-tour-required">*</span>
          </label>
          <select
            id="tipo_paquete"
            name="tipo_paquete"
            value={formData.tipo_paquete}
            onChange={handleChange}
            className={errores.tipo_paquete ? 'modal-agregar-tour-input-error' : ''}
          >
            <option value="">Selecciona una opción</option>
            <option value="Tour Completo">Tour Completo</option>
            <option value="Tour Medio Día">Tour Medio Día</option>
            <option value="Tour Gastronómico">Tour Gastronómico</option>
            <option value="Tour Aventura">Tour Aventura</option>
            <option value="Tour Cultural">Tour Cultural</option>
            <option value="Tour Día Completo">Tour Día Completo</option>
          </select>
          <MensajeError nombreCampo="tipo_paquete" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="precio_base">
            Precio Base <span className="modal-agregar-tour-required">*</span>
          </label>
          <input
            type="number"
            id="precio_base"
            name="precio_base"
            value={formData.precio_base}
            onChange={handleChange}
            className={errores.precio_base ? 'modal-agregar-tour-input-error' : ''}
            placeholder="850.00"
            step="0.01"
            min="0"
          />
          <MensajeError nombreCampo="precio_base" />
        </div>

        <div className="modal-agregar-tour-form-group">
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

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="costo_por_nino">
            Costo por Niño
          </label>
          <input
            type="number"
            id="costo_por_nino"
            name="costo_por_nino"
            value={formData.costo_por_nino}
            onChange={handleChange}
            placeholder="425.00"
            step="0.01"
            min="0"
          />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="costo_por_adulto_mayor">
            Costo Adulto Mayor
          </label>
          <input
            type="number"
            id="costo_por_adulto_mayor"
            name="costo_por_adulto_mayor"
            value={formData.costo_por_adulto_mayor}
            onChange={handleChange}
            placeholder="680.00"
            step="0.01"
            min="0"
          />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="temporada">
            Temporada
          </label>
          <select
            id="temporada"
            name="temporada"
            value={formData.temporada}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="Todo el año">Todo el año</option>
            <option value="Temporada alta">Temporada alta</option>
            <option value="Temporada baja">Temporada baja</option>
            <option value="Verano">Verano</option>
            <option value="Invierno">Invierno</option>
          </select>
        </div>
      </div>

      <div className="modal-agregar-tour-form-grid">
        <div className="modal-agregar-tour-form-group">
          <label className="modal-agregar-tour-checkbox-label">
            <input
              type="checkbox"
              name="descuento_disponible"
              checked={formData.descuento_disponible}
              onChange={handleChange}
            />
            Descuento Disponible
          </label>
        </div>

        <div className="modal-agregar-tour-form-group">
          <label className="modal-agregar-tour-checkbox-label">
            <input
              type="checkbox"
              name="iva_incluido"
              checked={formData.iva_incluido}
              onChange={handleChange}
            />
            IVA Incluido
          </label>
        </div>

        <div className="modal-agregar-tour-form-group modal-agregar-tour-form-group-full">
          <label htmlFor="incluye">
            ¿Qué Incluye? <span className="modal-agregar-tour-required">*</span>
          </label>
          <textarea
            id="incluye"
            name="incluye"
            value={formData.incluye}
            onChange={handleChange}
            className={errores.incluye ? 'modal-agregar-tour-input-error' : ''}
            placeholder="Transporte, Guía, Comida, Entradas..."
            rows="3"
          />
          <MensajeError nombreCampo="incluye" />
        </div>

        <div className="modal-agregar-tour-form-group modal-agregar-tour-form-group-full">
          <label htmlFor="no_incluye">
            No Incluye
          </label>
          <textarea
            id="no_incluye"
            name="no_incluye"
            value={formData.no_incluye}
            onChange={handleChange}
            placeholder="Bebidas alcohólicas, Propinas, Compras personales..."
            rows="3"
          />
        </div>
      </div>
    </>
  );

  const renderSeccionProveedor = () => (
    <>
      <div className="modal-agregar-tour-form-grid">
        <div className="modal-agregar-tour-form-group">
          <label htmlFor="operado_por">
            Operado Por <span className="modal-agregar-tour-required">*</span>
          </label>
          <input
            type="text"
            id="operado_por"
            name="operado_por"
            value={formData.operado_por}
            onChange={handleChange}
            className={errores.operado_por ? 'modal-agregar-tour-input-error' : ''}
            placeholder="Ej: Aventura Oaxaca"
          />
          <MensajeError nombreCampo="operado_por" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="empresa_proveedora_id">
            Empresa Proveedora <span className="modal-agregar-tour-required">*</span>
          </label>
          <select
            id="empresa_proveedora_id"
            name="empresa_proveedora_id"
            value={formData.empresa_proveedora_id}
            onChange={handleChange}
            className={errores.empresa_proveedora_id ? 'modal-agregar-tour-input-error' : ''}
          >
            <option value="">Selecciona un proveedor</option>
            {proveedores.map(proveedor => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre_razon_social || proveedor.nombre}
              </option>
            ))}
          </select>
          <MensajeError nombreCampo="empresa_proveedora_id" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="guia_principal">
            Guía Principal <span className="modal-agregar-tour-required">*</span>
          </label>
          <input
            type="text"
            id="guia_principal"
            name="guia_principal"
            value={formData.guia_principal}
            onChange={handleChange}
            className={errores.guia_principal ? 'modal-agregar-tour-input-error' : ''}
            placeholder="Ej: Juan Pérez"
          />
          <MensajeError nombreCampo="guia_principal" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="contacto_proveedor">
            Contacto Proveedor <span className="modal-agregar-tour-required">*</span>
          </label>
          <input
            type="tel"
            id="contacto_proveedor"
            name="contacto_proveedor"
            value={formData.contacto_proveedor}
            onChange={handleChange}
            className={errores.contacto_proveedor ? 'modal-agregar-tour-input-error' : ''}
            placeholder="9511234567"
          />
          <MensajeError nombreCampo="contacto_proveedor" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="numero_licencia_guia">
            Número de Licencia del Guía
          </label>
          <input
            type="text"
            id="numero_licencia_guia"
            name="numero_licencia_guia"
            value={formData.numero_licencia_guia}
            onChange={handleChange}
            placeholder="Ej: LIC-12345"
          />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label htmlFor="disponibilidad">
            Disponibilidad
          </label>
          <select
            id="disponibilidad"
            name="disponibilidad"
            value={formData.disponibilidad}
            onChange={handleChange}
          >
            <option value="Diario">Diario</option>
            <option value="Lunes a Viernes">Lunes a Viernes</option>
            <option value="Fines de semana">Fines de semana</option>
            <option value="Lunes a Sábado">Lunes a Sábado</option>
            <option value="Martes a Domingo">Martes a Domingo</option>
          </select>
        </div>

        <div className="modal-agregar-tour-form-group modal-agregar-tour-form-group-full">
          <label htmlFor="ubicacion_salida">
            Ubicación de Salida <span className="modal-agregar-tour-required">*</span>
          </label>
          <input
            type="text"
            id="ubicacion_salida"
            name="ubicacion_salida"
            value={formData.ubicacion_salida}
            onChange={handleChange}
            className={errores.ubicacion_salida ? 'modal-agregar-tour-input-error' : ''}
            placeholder="Ej: Zócalo de Oaxaca"
          />
          <MensajeError nombreCampo="ubicacion_salida" />
        </div>

        <div className="modal-agregar-tour-form-group">
          <label className="modal-agregar-tour-checkbox-label">
            <input
              type="checkbox"
              name="transporte_incluido"
              checked={formData.transporte_incluido}
              onChange={handleChange}
            />
            Transporte Incluido
          </label>
        </div>

        <div className="modal-agregar-tour-form-group">
          <label className="modal-agregar-tour-checkbox-label">
            <input
              type="checkbox"
              name="seguro_incluido"
              checked={formData.seguro_incluido}
              onChange={handleChange}
            />
            Seguro Incluido
          </label>
        </div>
      </div>
    </>
  );

  const renderSeccionDocumentos = () => (
    <div className="modal-agregar-tour-form-grid">
      <div className="modal-agregar-tour-form-group-file modal-agregar-tour-form-group-full">
        <label htmlFor="foto_tour">
          <Image size={20} />
          Fotografía del Tour
        </label>
        <input
          type="file"
          id="foto_tour"
          name="foto_tour"
          onChange={handleFileChange}
          accept="image/*"
        />
        {formData.foto_tour && (
          <span className="modal-agregar-tour-file-name">{formData.foto_tour.name}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-agregar-tour-overlay" onClick={onCerrar}>
      <div className="modal-agregar-tour-contenido modal-agregar-tour-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-agregar-tour-header">
          <h2>Agregar Nuevo Tour</h2>
          <button className="modal-agregar-tour-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="modal-agregar-tour-tabs">
          <button
            className={`modal-agregar-tour-tab-button ${seccionActiva === 'generales' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('generales')}
            type="button"
          >
            <MapPin size={18} />
            Datos Generales
          </button>
          <button
            className={`modal-agregar-tour-tab-button ${seccionActiva === 'paquete' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('paquete')}
            type="button"
          >
            <DollarSign size={18} />
            Paquete y Precios
          </button>
          <button
            className={`modal-agregar-tour-tab-button ${seccionActiva === 'proveedor' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('proveedor')}
            type="button"
          >
            <Users size={18} />
            Proveedor
          </button>
          <button
            className={`modal-agregar-tour-tab-button ${seccionActiva === 'documentos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('documentos')}
            type="button"
          >
            <Image size={18} />
            Documentos
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-agregar-tour-form">
          {seccionActiva === 'generales' && renderSeccionGenerales()}
          {seccionActiva === 'paquete' && renderSeccionPaquete()}
          {seccionActiva === 'proveedor' && renderSeccionProveedor()}
          {seccionActiva === 'documentos' && renderSeccionDocumentos()}
        </form>

        {/* Footer */}
        <div className="modal-agregar-tour-footer">
          <div className="modal-agregar-tour-botones-izquierda">
            <button type="button" className="modal-agregar-tour-btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
          <div className="modal-agregar-tour-botones-derecha">
            <button
              type="button"
              className={`modal-agregar-tour-btn-guardar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Guardando...' : 'Guardar Tour'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarTours;