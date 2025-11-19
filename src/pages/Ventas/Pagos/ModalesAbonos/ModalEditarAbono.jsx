import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  Hash,
  AlertCircle,
  Clock,
  Info,
  CheckCircle
} from 'lucide-react';
import './ModalEditarAbono.css';

// ============================================
// CONSTANTES
// ============================================

const TIPOS_SERVICIO = [
  'Tour Arqueológico',
  'Tour Gastronómico',
  'Tour Ecoturístico',
  'Tour Cultural',
  'Tour Personalizado',
  'Paquete Completo'
];

const FRECUENCIAS_PAGO = [
  { value: 'semanal', label: 'Semanal' },
  { value: 'quincenal', label: 'Quincenal' },
  { value: 'mensual', label: 'Mensual' },
  { value: 'bimestral', label: 'Bimestral' }
];

const VALIDADORES = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  telefono: (tel) => /^[\d\s\-()]+$/.test(tel) && tel.replace(/\D/g, '').length >= 10,
  longitudMinima: (texto, min) => texto.trim().length >= min,
  numeroPositivo: (num) => parseFloat(num) > 0,
  rangoNumero: (num, min, max) => num >= min && num <= max
};

// ============================================
// HOOK PERSONALIZADO
// ============================================

const useEditarAbonoForm = (pagoSeleccionado, abierto) => {
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [camposModificados, setCamposModificados] = useState(new Set());
  const primerCampoConError = useRef(null);
  
  const [formData, setFormData] = useState({
    nombreCliente: '',
    emailCliente: '',
    telefonoCliente: '',
    tipoServicio: '',
    descripcionServicio: '',
    fechaTour: '',
    montoTotal: '',
    numeroAbonos: '',
    abonoMinimo: '',
    fechaPrimerAbono: '',
    numeroContrato: '',
    frecuenciaPago: 'mensual',
    observaciones: ''
  });

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (abierto && pagoSeleccionado) {
      const datosIniciales = {
        nombreCliente: pagoSeleccionado.cliente.nombre || '',
        emailCliente: pagoSeleccionado.cliente.email || '',
        telefonoCliente: pagoSeleccionado.cliente.telefono || '',
        tipoServicio: pagoSeleccionado.servicio.tipo || '',
        descripcionServicio: pagoSeleccionado.servicio.descripcion || '',
        fechaTour: pagoSeleccionado.servicio.fechaTour || '',
        montoTotal: pagoSeleccionado.planPago.montoTotal || '',
        numeroAbonos: pagoSeleccionado.planPago.abonosPlaneados || '',
        abonoMinimo: pagoSeleccionado.planPago.abonoMinimo || '',
        fechaPrimerAbono: pagoSeleccionado.proximoVencimiento !== 'Finalizado' ? pagoSeleccionado.proximoVencimiento : '',
        numeroContrato: pagoSeleccionado.numeroContrato || '',
        frecuenciaPago: pagoSeleccionado.frecuenciaPago || 'mensual',
        observaciones: pagoSeleccionado.observaciones || ''
      };
      
      setFormData(datosIniciales);
      setErrores({});
      setCamposModificados(new Set());
    }
  }, [abierto, pagoSeleccionado]);

  // Calcular abono mínimo
  const calcularAbonoMinimo = useCallback((monto, numAbonos) => {
    if (monto > 0 && numAbonos > 0) {
      return Math.ceil(monto / numAbonos);
    }
    return '';
  }, []);

  // Manejar cambios en los campos
  const manejarCambio = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const nuevoForm = { ...prev, [name]: value };
      
      // Calcular abono mínimo automáticamente
      if (name === 'montoTotal' || name === 'numeroAbonos') {
        const monto = name === 'montoTotal' ? parseFloat(value) : parseFloat(prev.montoTotal);
        const numAbonos = name === 'numeroAbonos' ? parseInt(value) : parseInt(prev.numeroAbonos);
        nuevoForm.abonoMinimo = calcularAbonoMinimo(monto, numAbonos);
      }
      
      return nuevoForm;
    });

    // Marcar campo como modificado
    setCamposModificados(prev => new Set([...prev, name]));

    // Limpiar error del campo
    if (errores[name]) {
      setErrores(prev => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[name];
        return nuevosErrores;
      });
    }
  }, [errores, calcularAbonoMinimo]);

  // Normalizar fecha para comparación
  const normalizarFecha = (fecha) => {
    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setHours(0, 0, 0, 0);
    return fechaNormalizada;
  };

  // Validar formulario completo
  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};
    primerCampoConError.current = null;

    // Validaciones de cliente
    if (!VALIDADORES.longitudMinima(formData.nombreCliente, 3)) {
      nuevosErrores.nombreCliente = !formData.nombreCliente.trim() 
        ? 'El nombre del cliente es obligatorio'
        : 'El nombre debe tener al menos 3 caracteres';
      if (!primerCampoConError.current) primerCampoConError.current = 'nombreCliente';
    }

    if (!formData.emailCliente.trim()) {
      nuevosErrores.emailCliente = 'El email es obligatorio';
      if (!primerCampoConError.current) primerCampoConError.current = 'emailCliente';
    } else if (!VALIDADORES.email(formData.emailCliente)) {
      nuevosErrores.emailCliente = 'Formato de email inválido';
      if (!primerCampoConError.current) primerCampoConError.current = 'emailCliente';
    }

    if (!formData.telefonoCliente.trim()) {
      nuevosErrores.telefonoCliente = 'El teléfono es obligatorio';
      if (!primerCampoConError.current) primerCampoConError.current = 'telefonoCliente';
    } else if (!VALIDADORES.telefono(formData.telefonoCliente)) {
      nuevosErrores.telefonoCliente = 'Formato de teléfono inválido';
      if (!primerCampoConError.current) primerCampoConError.current = 'telefonoCliente';
    }

    // Validaciones de servicio
    if (!formData.tipoServicio.trim()) {
      nuevosErrores.tipoServicio = 'Debe seleccionar un tipo de servicio';
      if (!primerCampoConError.current) primerCampoConError.current = 'tipoServicio';
    }

    if (!VALIDADORES.longitudMinima(formData.descripcionServicio, 10)) {
      nuevosErrores.descripcionServicio = !formData.descripcionServicio.trim()
        ? 'La descripción es obligatoria'
        : 'La descripción debe tener al menos 10 caracteres';
      if (!primerCampoConError.current) primerCampoConError.current = 'descripcionServicio';
    }

    if (!formData.fechaTour) {
      nuevosErrores.fechaTour = 'La fecha del tour es obligatoria';
      if (!primerCampoConError.current) primerCampoConError.current = 'fechaTour';
    } else {
      const fechaTour = normalizarFecha(formData.fechaTour);
      const hoy = normalizarFecha(new Date());
      
      if (fechaTour < hoy) {
        nuevosErrores.fechaTour = 'La fecha del tour no puede ser en el pasado';
        if (!primerCampoConError.current) primerCampoConError.current = 'fechaTour';
      }
    }

    // Validaciones de plan de pago
    if (!VALIDADORES.numeroPositivo(formData.montoTotal)) {
      nuevosErrores.montoTotal = 'El monto total debe ser mayor a 0';
      if (!primerCampoConError.current) primerCampoConError.current = 'montoTotal';
    } else if (parseFloat(formData.montoTotal) > 1000000) {
      nuevosErrores.montoTotal = 'El monto total parece demasiado alto';
      if (!primerCampoConError.current) primerCampoConError.current = 'montoTotal';
    }

    const numAbonos = parseInt(formData.numeroAbonos);
    if (!numAbonos || !VALIDADORES.rangoNumero(numAbonos, 1, 24)) {
      nuevosErrores.numeroAbonos = numAbonos <= 0 
        ? 'Debe haber al menos 1 abono'
        : 'Máximo 24 abonos permitidos';
      if (!primerCampoConError.current) primerCampoConError.current = 'numeroAbonos';
    }

    if (!VALIDADORES.numeroPositivo(formData.abonoMinimo)) {
      nuevosErrores.abonoMinimo = 'El abono mínimo debe ser mayor a 0';
      if (!primerCampoConError.current) primerCampoConError.current = 'abonoMinimo';
    } else {
      const totalMinimo = parseFloat(formData.abonoMinimo) * parseInt(formData.numeroAbonos);
      const montoTotal = parseFloat(formData.montoTotal);
      
      if (totalMinimo < montoTotal) {
        const diferencia = (montoTotal - totalMinimo).toFixed(2);
        nuevosErrores.abonoMinimo = `Insuficiente. Faltan ${diferencia} para cubrir el total`;
        if (!primerCampoConError.current) primerCampoConError.current = 'abonoMinimo';
      }
    }

    if (!formData.fechaPrimerAbono && pagoSeleccionado?.estado !== 'FINALIZADO') {
      nuevosErrores.fechaPrimerAbono = 'La fecha del próximo abono es obligatoria';
      if (!primerCampoConError.current) primerCampoConError.current = 'fechaPrimerAbono';
    } else if (formData.fechaPrimerAbono) {
      const fechaAbono = normalizarFecha(formData.fechaPrimerAbono);
      const hoy = normalizarFecha(new Date());
      
      if (fechaAbono < hoy) {
        nuevosErrores.fechaPrimerAbono = 'La fecha no puede ser en el pasado';
        if (!primerCampoConError.current) primerCampoConError.current = 'fechaPrimerAbono';
      }
    }

    if (!VALIDADORES.longitudMinima(formData.numeroContrato, 3)) {
      nuevosErrores.numeroContrato = !formData.numeroContrato.trim()
        ? 'El número de contrato es obligatorio'
        : 'El número de contrato debe tener al menos 3 caracteres';
      if (!primerCampoConError.current) primerCampoConError.current = 'numeroContrato';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }, [formData, pagoSeleccionado]);

  // Scroll al primer error
  const scrollAPrimerError = useCallback(() => {
    if (primerCampoConError.current) {
      const elemento = document.getElementById(primerCampoConError.current);
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        elemento.focus();
      }
    }
  }, []);

  return {
    formData,
    errores,
    guardando,
    camposModificados,
    setGuardando,
    manejarCambio,
    validarFormulario,
    scrollAPrimerError
  };
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ModalEditarAbono = ({ abierto, onCerrar, onGuardar, pagoSeleccionado }) => {
  const {
    formData,
    errores,
    guardando,
    camposModificados,
    setGuardando,
    manejarCambio,
    validarFormulario,
    scrollAPrimerError
  } = useEditarAbonoForm(pagoSeleccionado, abierto);

  // Manejar guardar
  const manejarGuardar = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      scrollAPrimerError();
      return;
    }

    setGuardando(true);

    try {
      // TODO: Reemplazar con llamada real a API en producción
      await new Promise(resolve => setTimeout(resolve, 1000));

      const datosActualizados = {
        id: pagoSeleccionado.id,
        ...formData,
        camposModificados: Array.from(camposModificados)
      };

      onGuardar(datosActualizados);
      onCerrar();
    } catch (error) {
      console.error('Error al guardar:', error);
      setErrores({ general: 'Error al guardar los cambios. Intenta nuevamente.' });
    } finally {
      setGuardando(false);
    }
  };

  // Manejar cerrar
  const manejarCerrar = () => {
    if (!guardando) {
      onCerrar();
    }
  };

  // Manejar clic fuera del modal
  const manejarClickOverlay = (e) => {
    if (e.target === e.currentTarget) {
      manejarCerrar();
    }
  };

  // Manejar tecla Escape
  useEffect(() => {
    const manejarTecla = (e) => {
      if (e.key === 'Escape' && abierto && !guardando) {
        manejarCerrar();
      }
    };

    if (abierto) {
      document.addEventListener('keydown', manejarTecla);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', manejarTecla);
      document.body.style.overflow = '';
    };
  }, [abierto, guardando]);

  if (!abierto) return null;

  return (
    <div className="modal-editar-overlay" onClick={manejarClickOverlay}>
      <div className="modal-editar-contenedor" onClick={(e) => e.stopPropagation()}>
        
        {/* ===== HEADER ===== */}
        <div className="modal-editar-header">
          <div className="modal-editar-header-contenido">
            <div className="modal-editar-icono-header">
              <FileText size={32} />
            </div>
            <div className="modal-editar-textos-header">
              <h2 className="modal-editar-titulo">Editar Contrato de Pago</h2>
              <p className="modal-editar-subtitulo">
                Actualiza la información del contrato #{pagoSeleccionado?.numeroContrato || 'N/A'}
              </p>
              <div className="modal-editar-metadata">
                <span className="modal-editar-metadata-item">
                  <User size={14} />
                  {pagoSeleccionado?.cliente?.nombre || 'Sin cliente'}
                </span>
                <span className="modal-editar-metadata-item">
                  <Calendar size={14} />
                  Creado: {new Date().toLocaleDateString('es-MX')}
                </span>
                <span className="modal-editar-metadata-item">
                  <Clock size={14} />
                  Estado: {pagoSeleccionado?.estado || 'Activo'}
                </span>
              </div>
            </div>
          </div>
          <button
            className="modal-editar-boton-cerrar"
            onClick={manejarCerrar}
            disabled={guardando}
            aria-label="Cerrar modal"
            title="Cerrar (Esc)"
          >
            <X size={22} />
          </button>
        </div>

        {/* ===== CONTENIDO / FORMULARIO ===== */}
        <div className="modal-editar-contenido">
          
          {/* Sección: Información del Cliente */}
          <div className="modal-editar-seccion">
            <div className="modal-editar-seccion-header">
              <div className="modal-editar-seccion-icono">
                <User size={18} />
              </div>
              <h3 className="modal-editar-seccion-titulo">Información del Cliente</h3>
            </div>
            
            <div className="modal-editar-grid">
              {/* Nombre */}
              <div className="modal-editar-campo">
                <label htmlFor="nombreCliente" className="modal-editar-label">
                  Nombre Completo <span className="modal-editar-label-requerido">*</span>
                </label>
                <input
                  type="text"
                  id="nombreCliente"
                  name="nombreCliente"
                  value={formData.nombreCliente}
                  onChange={manejarCambio}
                  className={`modal-editar-input modal-editar-input-sin-icono ${errores.nombreCliente ? 'modal-editar-input-error' : ''}`}
                  placeholder="Juan Pérez García"
                  disabled={guardando}
                  autoComplete="name"
                />
                {errores.nombreCliente && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.nombreCliente}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="modal-editar-campo">
                <label htmlFor="emailCliente" className="modal-editar-label">
                  Correo Electrónico <span className="modal-editar-label-requerido">*</span>
                </label>
                <input
                  type="email"
                  id="emailCliente"
                  name="emailCliente"
                  value={formData.emailCliente}
                  onChange={manejarCambio}
                  className={`modal-editar-input modal-editar-input-sin-icono ${errores.emailCliente ? 'modal-editar-input-error' : ''}`}
                  placeholder="correo@ejemplo.com"
                  disabled={guardando}
                  autoComplete="email"
                />
                {errores.emailCliente && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.emailCliente}
                  </span>
                )}
              </div>

              {/* Teléfono */}
              <div className="modal-editar-campo modal-editar-campo-completo">
                <label htmlFor="telefonoCliente" className="modal-editar-label">
                  Teléfono de Contacto <span className="modal-editar-label-requerido">*</span>
                </label>
                <input
                  type="tel"
                  id="telefonoCliente"
                  name="telefonoCliente"
                  value={formData.telefonoCliente}
                  onChange={manejarCambio}
                  className={`modal-editar-input modal-editar-input-sin-icono ${errores.telefonoCliente ? 'modal-editar-input-error' : ''}`}
                  placeholder="951-123-4567"
                  disabled={guardando}
                  autoComplete="tel"
                />
                {errores.telefonoCliente && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.telefonoCliente}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sección: Información del Servicio */}
          <div className="modal-editar-seccion">
            <div className="modal-editar-seccion-header">
              <div className="modal-editar-seccion-icono">
                <Calendar size={18} />
              </div>
              <h3 className="modal-editar-seccion-titulo">Información del Servicio</h3>
            </div>
            
            <div className="modal-editar-grid">
              {/* Tipo de Servicio */}
              <div className="modal-editar-campo">
                <label htmlFor="tipoServicio" className="modal-editar-label">
                  Tipo de Servicio <span className="modal-editar-label-requerido">*</span>
                </label>
                <select
                  id="tipoServicio"
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={manejarCambio}
                  className={`modal-editar-select modal-editar-select-sin-icono ${errores.tipoServicio ? 'modal-editar-input-error' : ''}`}
                  disabled={guardando}
                >
                  <option value="">Seleccionar tipo...</option>
                  {TIPOS_SERVICIO.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errores.tipoServicio && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.tipoServicio}
                  </span>
                )}
              </div>

              {/* Fecha del Tour */}
              <div className="modal-editar-campo">
                <label htmlFor="fechaTour" className="modal-editar-label">
                  Fecha del Tour <span className="modal-editar-label-requerido">*</span>
                </label>
                <div className="modal-editar-input-wrapper">
                  <Calendar size={16} className="modal-editar-input-icono" />
                  <input
                    type="date"
                    id="fechaTour"
                    name="fechaTour"
                    value={formData.fechaTour}
                    onChange={manejarCambio}
                    className={`modal-editar-input ${errores.fechaTour ? 'modal-editar-input-error' : ''}`}
                    disabled={guardando}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errores.fechaTour && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.fechaTour}
                  </span>
                )}
              </div>

              {/* Descripción del Servicio */}
              <div className="modal-editar-campo modal-editar-campo-completo">
                <label htmlFor="descripcionServicio" className="modal-editar-label">
                  Descripción del Servicio <span className="modal-editar-label-requerido">*</span>
                </label>
                <textarea
                  id="descripcionServicio"
                  name="descripcionServicio"
                  value={formData.descripcionServicio}
                  onChange={manejarCambio}
                  className={`modal-editar-textarea ${errores.descripcionServicio ? 'modal-editar-input-error' : ''}`}
                  placeholder="Describe detalladamente el servicio contratado..."
                  rows={3}
                  disabled={guardando}
                />
                {errores.descripcionServicio && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.descripcionServicio}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sección: Plan de Pago */}
          <div className="modal-editar-seccion">
            <div className="modal-editar-seccion-header">
              <div className="modal-editar-seccion-icono">
                <DollarSign size={18} />
              </div>
              <h3 className="modal-editar-seccion-titulo">Plan de Pago</h3>
            </div>
            
            <div className="modal-editar-grid">
              {/* Monto Total */}
              <div className="modal-editar-campo">
                <label htmlFor="montoTotal" className="modal-editar-label">
                  Monto Total <span className="modal-editar-label-requerido">*</span>
                </label>
                <div className="modal-editar-input-wrapper">
                  <DollarSign size={16} className="modal-editar-input-icono" />
                  <input
                    type="number"
                    id="montoTotal"
                    name="montoTotal"
                    value={formData.montoTotal}
                    onChange={manejarCambio}
                    className={`modal-editar-input ${errores.montoTotal ? 'modal-editar-input-error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={guardando}
                  />
                </div>
                {errores.montoTotal && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.montoTotal}
                  </span>
                )}
              </div>

              {/* Número de Abonos */}
              <div className="modal-editar-campo">
                <label htmlFor="numeroAbonos" className="modal-editar-label">
                  Número de Abonos <span className="modal-editar-label-requerido">*</span>
                </label>
                <div className="modal-editar-input-wrapper">
                  <Hash size={16} className="modal-editar-input-icono" />
                  <input
                    type="number"
                    id="numeroAbonos"
                    name="numeroAbonos"
                    value={formData.numeroAbonos}
                    onChange={manejarCambio}
                    className={`modal-editar-input ${errores.numeroAbonos ? 'modal-editar-input-error' : ''}`}
                    placeholder="0"
                    min="1"
                    max="24"
                    disabled={guardando}
                  />
                </div>
                {errores.numeroAbonos && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.numeroAbonos}
                  </span>
                )}
              </div>

              {/* Abono Mínimo */}
              <div className="modal-editar-campo">
                <label htmlFor="abonoMinimo" className="modal-editar-label">
                  Abono Mínimo <span className="modal-editar-label-requerido">*</span>
                </label>
                <div className="modal-editar-input-wrapper">
                  <DollarSign size={16} className="modal-editar-input-icono" />
                  <input
                    type="number"
                    id="abonoMinimo"
                    name="abonoMinimo"
                    value={formData.abonoMinimo}
                    onChange={manejarCambio}
                    className={`modal-editar-input ${errores.abonoMinimo ? 'modal-editar-input-error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={guardando}
                  />
                </div>
                {errores.abonoMinimo && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.abonoMinimo}
                  </span>
                )}
              </div>

              {/* Frecuencia de Pago */}
              <div className="modal-editar-campo">
                <label htmlFor="frecuenciaPago" className="modal-editar-label">
                  Frecuencia de Pago <span className="modal-editar-label-requerido">*</span>
                </label>
                <select
                  id="frecuenciaPago"
                  name="frecuenciaPago"
                  value={formData.frecuenciaPago}
                  onChange={manejarCambio}
                  className="modal-editar-select modal-editar-select-sin-icono"
                  disabled={guardando}
                >
                  {FRECUENCIAS_PAGO.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
              </div>

              {/* Próximo Vencimiento */}
              <div className="modal-editar-campo">
                <label htmlFor="fechaPrimerAbono" className="modal-editar-label">
                  Próximo Vencimiento <span className="modal-editar-label-requerido">*</span>
                </label>
                <div className="modal-editar-input-wrapper">
                  <Calendar size={16} className="modal-editar-input-icono" />
                  <input
                    type="date"
                    id="fechaPrimerAbono"
                    name="fechaPrimerAbono"
                    value={formData.fechaPrimerAbono}
                    onChange={manejarCambio}
                    className={`modal-editar-input ${errores.fechaPrimerAbono ? 'modal-editar-input-error' : ''}`}
                    disabled={guardando}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errores.fechaPrimerAbono && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.fechaPrimerAbono}
                  </span>
                )}
              </div>

              {/* Número de Contrato */}
              <div className="modal-editar-campo">
                <label htmlFor="numeroContrato" className="modal-editar-label">
                  Número de Contrato <span className="modal-editar-label-requerido">*</span>
                </label>
                <input
                  type="text"
                  id="numeroContrato"
                  name="numeroContrato"
                  value={formData.numeroContrato}
                  onChange={manejarCambio}
                  className={`modal-editar-input modal-editar-input-sin-icono ${errores.numeroContrato ? 'modal-editar-input-error' : ''}`}
                  placeholder="CONT-001"
                  disabled={guardando}
                />
                {errores.numeroContrato && (
                  <span className="modal-editar-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.numeroContrato}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sección: Observaciones */}
          <div className="modal-editar-seccion">
            <div className="modal-editar-seccion-header">
              <div className="modal-editar-seccion-icono">
                <FileText size={18} />
              </div>
              <h3 className="modal-editar-seccion-titulo">Observaciones</h3>
            </div>
            
            <div className="modal-editar-campo">
              <label htmlFor="observaciones" className="modal-editar-label">
                Notas Adicionales
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={manejarCambio}
                className="modal-editar-textarea"
                placeholder="Agrega cualquier nota o detalle adicional sobre este contrato..."
                rows={4}
                disabled={guardando}
              />
            </div>
          </div>
        </div>

        {/* ===== FOOTER CON ACCIONES ===== */}
        <div className="modal-editar-footer">
          <div className="modal-editar-footer-info">
            <Info size={16} />
            <span>Los campos con * son obligatorios</span>
          </div>
          
          <div className="modal-editar-acciones">
            <button
              type="button"
              className="modal-editar-boton modal-editar-boton-cancelar"
              onClick={manejarCerrar}
              disabled={guardando}
            >
              <X size={18} />
              Cancelar
            </button>
            
            <button
              type="button"
              className="modal-editar-boton modal-editar-boton-guardar"
              onClick={manejarGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <div className="modal-editar-spinner"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarAbono;