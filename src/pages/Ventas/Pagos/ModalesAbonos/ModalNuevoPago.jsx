import React, { useState } from 'react';
import { X, User, Calendar, DollarSign, FileText, CreditCard, AlertCircle, Save } from 'lucide-react';
import './ModalNuevoPago.css';

const ModalNuevoPago = ({ abierto, onCerrar, onGuardar }) => {
  const [formulario, setFormulario] = useState({
    clienteId: '',
    nombreCliente: '',
    emailCliente: '',
    telefonoCliente: '',
    tipoServicio: '',
    descripcionServicio: '',
    fechaTour: '',
    montoTotal: '',
    numeroAbonos: '3',
    abonoMinimo: '',
    frecuenciaPago: 'semanal',
    fechaPrimerAbono: '',
    numeroContrato: '',
    observaciones: ''
  });

  const [errores, setErrores] = useState({});

  const tiposServicio = [
    'Tour Arqueológico',
    'Tour Gastronómico',
    'Tour Ecoturístico',
    'Tour Cultural',
    'Tour Aventura',
    'Tour Personalizado'
  ];

  const frecuenciasPago = [
    { valor: 'semanal', etiqueta: 'Semanal' },
    { valor: 'quincenal', etiqueta: 'Quincenal' },
    { valor: 'mensual', etiqueta: 'Mensual' }
  ];

  const manejarCambio = (campo, valor) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: valor
    }));

    if (errores[campo]) {
      setErrores(prev => ({
        ...prev,
        [campo]: null
      }));
    }

    if (campo === 'montoTotal' || campo === 'numeroAbonos') {
      const monto = campo === 'montoTotal' ? parseFloat(valor) : parseFloat(formulario.montoTotal);
      const abonos = campo === 'numeroAbonos' ? parseInt(valor) : parseInt(formulario.numeroAbonos);
      
      if (!isNaN(monto) && !isNaN(abonos) && abonos > 0) {
        const abonoCalculado = Math.ceil(monto / abonos);
        setFormulario(prev => ({
          ...prev,
          [campo]: valor,
          abonoMinimo: abonoCalculado.toString()
        }));
      }
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.nombreCliente.trim()) {
      nuevosErrores.nombreCliente = 'El nombre del cliente es obligatorio';
    }
    if (!formulario.emailCliente.trim()) {
      nuevosErrores.emailCliente = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formulario.emailCliente)) {
      nuevosErrores.emailCliente = 'Email inválido';
    }

    if (!formulario.tipoServicio) {
      nuevosErrores.tipoServicio = 'Selecciona un tipo de servicio';
    }
    if (!formulario.fechaTour) {
      nuevosErrores.fechaTour = 'La fecha del tour es obligatoria';
    }

    if (!formulario.montoTotal || parseFloat(formulario.montoTotal) <= 0) {
      nuevosErrores.montoTotal = 'El monto total debe ser mayor a 0';
    }
    if (!formulario.numeroAbonos || parseInt(formulario.numeroAbonos) < 2) {
      nuevosErrores.numeroAbonos = 'Debe haber al menos 2 abonos';
    }
    if (!formulario.fechaPrimerAbono) {
      nuevosErrores.fechaPrimerAbono = 'La fecha del primer abono es obligatoria';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnviar = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onGuardar(formulario);
      limpiarFormulario();
      onCerrar();
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      clienteId: '',
      nombreCliente: '',
      emailCliente: '',
      telefonoCliente: '',
      tipoServicio: '',
      descripcionServicio: '',
      fechaTour: '',
      montoTotal: '',
      numeroAbonos: '3',
      abonoMinimo: '',
      frecuenciaPago: 'semanal',
      fechaPrimerAbono: '',
      numeroContrato: '',
      observaciones: ''
    });
    setErrores({});
  };

  const manejarCancelar = () => {
    limpiarFormulario();
    onCerrar();
  };

  if (!abierto) return null;

  const montoPorAbono = formulario.montoTotal && formulario.numeroAbonos 
    ? (parseFloat(formulario.montoTotal) / parseInt(formulario.numeroAbonos)).toFixed(2)
    : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-contenedor">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-titulo">Registrar Nuevo Pago por Abonos</h2>
            <p className="modal-subtitulo">Complete la información del cliente y el plan de pagos</p>
          </div>
          <button className="modal-boton-cerrar" onClick={manejarCancelar}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={manejarEnviar} className="modal-body">
          {/* Sección: Información del Cliente */}
          <div className="modal-seccion">
            <div className="modal-seccion-header">
              <User size={20} className="modal-icono-seccion cliente" />
              <h3 className="modal-seccion-titulo">Información del Cliente</h3>
            </div>

            <div className="modal-grid">
              <div className="modal-campo">
                <label className="modal-label">Nombre Completo *</label>
                <input
                  type="text"
                  value={formulario.nombreCliente}
                  onChange={(e) => manejarCambio('nombreCliente', e.target.value)}
                  className={`modal-input ${errores.nombreCliente ? 'error' : ''}`}
                  placeholder="Ej: Juan Pérez García"
                />
                {errores.nombreCliente && (
                  <p className="modal-error">
                    <AlertCircle size={12} /> {errores.nombreCliente}
                  </p>
                )}
              </div>

              <div className="modal-campo">
                <label className="modal-label">Email *</label>
                <input
                  type="email"
                  value={formulario.emailCliente}
                  onChange={(e) => manejarCambio('emailCliente', e.target.value)}
                  className={`modal-input ${errores.emailCliente ? 'error' : ''}`}
                  placeholder="cliente@ejemplo.com"
                />
                {errores.emailCliente && (
                  <p className="modal-error">
                    <AlertCircle size={12} /> {errores.emailCliente}
                  </p>
                )}
              </div>

              <div className="modal-campo">
                <label className="modal-label">Teléfono</label>
                <input
                  type="tel"
                  value={formulario.telefonoCliente}
                  onChange={(e) => manejarCambio('telefonoCliente', e.target.value)}
                  className="modal-input"
                  placeholder="951 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Sección: Información del Servicio */}
          <div className="modal-seccion">
            <div className="modal-seccion-header">
              <Calendar size={20} className="modal-icono-seccion servicio" />
              <h3 className="modal-seccion-titulo">Información del Servicio</h3>
            </div>

            <div className="modal-grid">
              <div className="modal-campo">
                <label className="modal-label">Tipo de Servicio *</label>
                <select
                  value={formulario.tipoServicio}
                  onChange={(e) => manejarCambio('tipoServicio', e.target.value)}
                  className={`modal-select ${errores.tipoServicio ? 'error' : ''}`}
                >
                  <option value="">Seleccionar...</option>
                  {tiposServicio.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errores.tipoServicio && (
                  <p className="modal-error">
                    <AlertCircle size={12} /> {errores.tipoServicio}
                  </p>
                )}
              </div>

              <div className="modal-campo">
                <label className="modal-label">Fecha del Tour *</label>
                <input
                  type="date"
                  value={formulario.fechaTour}
                  onChange={(e) => manejarCambio('fechaTour', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`modal-input ${errores.fechaTour ? 'error' : ''}`}
                />
                {errores.fechaTour && (
                  <p className="modal-error">
                    <AlertCircle size={12} /> {errores.fechaTour}
                  </p>
                )}
              </div>

              <div className="modal-campo modal-campo-completo">
                <label className="modal-label">Descripción del Servicio</label>
                <input
                  type="text"
                  value={formulario.descripcionServicio}
                  onChange={(e) => manejarCambio('descripcionServicio', e.target.value)}
                  className="modal-input"
                  placeholder="Ej: Monte Albán + Hierve el Agua"
                />
              </div>
            </div>
          </div>

          {/* Sección: Plan de Pago */}
          <div className="modal-seccion">
            <div className="modal-seccion-header">
              <DollarSign size={20} className="modal-icono-seccion pago" />
              <h3 className="modal-seccion-titulo">Plan de Pago</h3>
            </div>

            <div className="modal-grid modal-grid-4">
              <div className="modal-campo">
                <label className="modal-label">Monto Total *</label>
                <div className="modal-input-monto">
                  <span className="modal-simbolo-moneda">$</span>
                  <input
                    type="number"
                    value={formulario.montoTotal}
                    onChange={(e) => manejarCambio('montoTotal', e.target.value)}
                    min="0"
                    step="0.01"
                    className={`modal-input con-simbolo ${errores.montoTotal ? 'error' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {errores.montoTotal && (
                  <p className="modal-error">
                    <AlertCircle size={12} /> {errores.montoTotal}
                  </p>
                )}
              </div>

              <div className="modal-campo">
                <label className="modal-label">Número de Abonos *</label>
                <input
                  type="number"
                  value={formulario.numeroAbonos}
                  onChange={(e) => manejarCambio('numeroAbonos', e.target.value)}
                  min="2"
                  max="12"
                  className={`modal-input ${errores.numeroAbonos ? 'error' : ''}`}
                />
                {errores.numeroAbonos && (
                  <p className="modal-error">
                    <AlertCircle size={12} /> {errores.numeroAbonos}
                  </p>
                )}
              </div>

              <div className="modal-campo">
                <label className="modal-label">Frecuencia de Pago</label>
                <select
                  value={formulario.frecuenciaPago}
                  onChange={(e) => manejarCambio('frecuenciaPago', e.target.value)}
                  className="modal-select"
                >
                  {frecuenciasPago.map(freq => (
                    <option key={freq.valor} value={freq.valor}>{freq.etiqueta}</option>
                  ))}
                </select>
              </div>

              <div className="modal-campo">
                <label className="modal-label">Fecha Primer Abono *</label>
                <input
                  type="date"
                  value={formulario.fechaPrimerAbono}
                  onChange={(e) => manejarCambio('fechaPrimerAbono', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`modal-input ${errores.fechaPrimerAbono ? 'error' : ''}`}
                />
                {errores.fechaPrimerAbono && (
                  <p className="modal-error">
                    <AlertCircle size={12} /> {errores.fechaPrimerAbono}
                  </p>
                )}
              </div>
            </div>

            {/* Resumen del Plan */}
            {formulario.montoTotal && formulario.numeroAbonos && (
              <div className="modal-resumen">
                <div className="modal-resumen-header">
                  <CreditCard size={16} />
                  <strong>Resumen del Plan de Pagos:</strong>
                </div>
                <div className="modal-resumen-contenido">
                  <p>• Monto por abono: <strong>${montoPorAbono}</strong></p>
                  <p>• Total: <strong>${parseFloat(formulario.montoTotal).toFixed(2)}</strong> en <strong>{formulario.numeroAbonos} pagos</strong></p>
                  <p>• Frecuencia: <strong>{frecuenciasPago.find(f => f.valor === formulario.frecuenciaPago)?.etiqueta}</strong></p>
                </div>
              </div>
            )}
          </div>

          {/* Sección: Información Adicional */}
          <div className="modal-seccion">
            <div className="modal-seccion-header">
              <FileText size={20} className="modal-icono-seccion adicional" />
              <h3 className="modal-seccion-titulo">Información Adicional</h3>
            </div>

            <div className="modal-grid-simple">
              <div className="modal-campo">
                <label className="modal-label">Número de Contrato</label>
                <input
                  type="text"
                  value={formulario.numeroContrato}
                  onChange={(e) => manejarCambio('numeroContrato', e.target.value)}
                  className="modal-input"
                  placeholder="CONT-001"
                />
              </div>

              <div className="modal-campo">
                <label className="modal-label">Observaciones</label>
                <textarea
                  value={formulario.observaciones}
                  onChange={(e) => manejarCambio('observaciones', e.target.value)}
                  rows={3}
                  className="modal-textarea"
                  placeholder="Notas adicionales sobre el pago o el servicio..."
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" onClick={manejarCancelar} className="modal-boton-cancelar">
            Cancelar
          </button>
          <button type="submit" onClick={manejarEnviar} className="modal-boton-guardar">
            <Save size={18} />
            <span>Guardar Pago</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNuevoPago;