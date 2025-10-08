import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, CreditCard, AlertCircle, Save, Info } from 'lucide-react';
import './ModalAgregarAbono.css';

const ModalAgregarAbono = ({ abierto, onCerrar, onGuardar, pagoSeleccionado }) => {
  const [formulario, setFormulario] = useState({
    montoAbono: '',
    fechaAbono: new Date().toISOString().split('T')[0],
    metodoPago: 'efectivo',
    referencia: '',
    observaciones: ''
  });

  const [errores, setErrores] = useState({});

  const metodosPago = [
    { valor: 'efectivo', etiqueta: 'Efectivo' },
    { valor: 'transferencia', etiqueta: 'Transferencia Bancaria' },
    { valor: 'tarjeta', etiqueta: 'Tarjeta de Crédito/Débito' },
    { valor: 'deposito', etiqueta: 'Depósito Bancario' },
    { valor: 'cheque', etiqueta: 'Cheque' }
  ];

  // Calcular el saldo pendiente y el monto sugerido
  const saldoPendiente = pagoSeleccionado?.planPago?.saldoPendiente || 0;
  const abonoMinimo = pagoSeleccionado?.planPago?.abonoMinimo || 0;
  const abonosSugerido = Math.min(abonoMinimo, saldoPendiente);

  useEffect(() => {
    if (abierto && pagoSeleccionado) {
      // Pre-llenar el monto sugerido
      setFormulario(prev => ({
        ...prev,
        montoAbono: abonosSugerido.toString()
      }));
    }
  }, [abierto, pagoSeleccionado, abonosSugerido]);

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
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.montoAbono || parseFloat(formulario.montoAbono) <= 0) {
      nuevosErrores.montoAbono = 'El monto del abono debe ser mayor a 0';
    } else if (parseFloat(formulario.montoAbono) > saldoPendiente) {
      nuevosErrores.montoAbono = `El monto no puede exceder el saldo pendiente ($${saldoPendiente.toLocaleString()})`;
    }

    if (!formulario.fechaAbono) {
      nuevosErrores.fechaAbono = 'La fecha del abono es obligatoria';
    }

    if (!formulario.metodoPago) {
      nuevosErrores.metodoPago = 'Selecciona un método de pago';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnviar = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      const datosAbono = {
        ...formulario,
        montoAbono: parseFloat(formulario.montoAbono),
        pagoId: pagoSeleccionado.id,
        numeroAbono: pagoSeleccionado.planPago.abonosRealizados + 1
      };
      
      onGuardar(datosAbono);
      limpiarFormulario();
      onCerrar();
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      montoAbono: '',
      fechaAbono: new Date().toISOString().split('T')[0],
      metodoPago: 'efectivo',
      referencia: '',
      observaciones: ''
    });
    setErrores({});
  };

  const manejarCancelar = () => {
    limpiarFormulario();
    onCerrar();
  };

  const establecerMontoCompleto = () => {
    setFormulario(prev => ({
      ...prev,
      montoAbono: saldoPendiente.toString()
    }));
  };

  if (!abierto || !pagoSeleccionado) return null;

  const montoIngresado = parseFloat(formulario.montoAbono) || 0;
  const nuevoSaldo = saldoPendiente - montoIngresado;
  const seCompletara = nuevoSaldo === 0;
  const porcentajeActual = ((pagoSeleccionado.planPago.montoPagado / pagoSeleccionado.planPago.montoTotal) * 100).toFixed(1);
  const nuevoPorcentaje = (((pagoSeleccionado.planPago.montoPagado + montoIngresado) / pagoSeleccionado.planPago.montoTotal) * 100).toFixed(1);

  return (
    <div className="modal-abono-overlay">
      <div className="modal-abono-contenedor">
        {/* Header */}
        <div className="modal-abono-header">
          <div>
            <h2 className="modal-abono-titulo">Agregar Nuevo Abono</h2>
            <p className="modal-abono-subtitulo">
              {pagoSeleccionado.cliente.nombre} - {pagoSeleccionado.numeroContrato}
            </p>
          </div>
          <button className="modal-abono-boton-cerrar" onClick={manejarCancelar}>
            <X size={20} />
          </button>
        </div>

        

        {/* Body - Formulario */}
        <form onSubmit={manejarEnviar} className="modal-abono-body">
          {/* Monto del Abono */}
          <div className="modal-abono-seccion">
            <div className="modal-abono-seccion-header">
              <DollarSign size={20} className="modal-abono-icono-seccion" />
              <h3 className="modal-abono-seccion-titulo">Información del Abono</h3>
            </div>

            <div className="modal-abono-campo-grupo">
              <div className="modal-abono-campo">
                <label className="modal-abono-label">Monto del Abono *</label>
                <div className="modal-abono-input-monto-contenedor">
                  <div className="modal-abono-input-monto">
                    <span className="modal-abono-simbolo-moneda">$</span>
                    <input
                      type="number"
                      value={formulario.montoAbono}
                      onChange={(e) => manejarCambio('montoAbono', e.target.value)}
                      min="0"
                      step="0.01"
                      max={saldoPendiente}
                      className={`modal-abono-input con-simbolo ${errores.montoAbono ? 'error' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={establecerMontoCompleto}
                    className="modal-abono-boton-liquidar"
                    title="Liquidar saldo completo"
                  >
                    Liquidar Todo
                  </button>
                </div>
                {errores.montoAbono && (
                  <p className="modal-abono-error">
                    <AlertCircle size={12} /> {errores.montoAbono}
                  </p>
                )}
                <p className="modal-abono-ayuda">
                  Abono mínimo sugerido: ${abonoMinimo.toLocaleString()}
                </p>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">Fecha del Abono *</label>
                <input
                  type="date"
                  value={formulario.fechaAbono}
                  onChange={(e) => manejarCambio('fechaAbono', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`modal-abono-input ${errores.fechaAbono ? 'error' : ''}`}
                />
                {errores.fechaAbono && (
                  <p className="modal-abono-error">
                    <AlertCircle size={12} /> {errores.fechaAbono}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="modal-abono-seccion">
            <div className="modal-abono-seccion-header">
              <CreditCard size={20} className="modal-abono-icono-seccion" />
              <h3 className="modal-abono-seccion-titulo">Método de Pago</h3>
            </div>

            <div className="modal-abono-campo-grupo">
              <div className="modal-abono-campo">
                <label className="modal-abono-label">Forma de Pago *</label>
                <select
                  value={formulario.metodoPago}
                  onChange={(e) => manejarCambio('metodoPago', e.target.value)}
                  className={`modal-abono-select ${errores.metodoPago ? 'error' : ''}`}
                >
                  {metodosPago.map(metodo => (
                    <option key={metodo.valor} value={metodo.valor}>
                      {metodo.etiqueta}
                    </option>
                  ))}
                </select>
                {errores.metodoPago && (
                  <p className="modal-abono-error">
                    <AlertCircle size={12} /> {errores.metodoPago}
                  </p>
                )}
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">
                  Referencia / No. de Operación
                </label>
                <input
                  type="text"
                  value={formulario.referencia}
                  onChange={(e) => manejarCambio('referencia', e.target.value)}
                  className="modal-abono-input"
                  placeholder="Ej: REF-123456 o No. de cheque"
                />
              </div>
            </div>

            <div className="modal-abono-campo">
              <label className="modal-abono-label">Observaciones</label>
              <textarea
                value={formulario.observaciones}
                onChange={(e) => manejarCambio('observaciones', e.target.value)}
                rows={3}
                className="modal-abono-textarea"
                placeholder="Notas adicionales sobre este abono..."
              />
            </div>
          </div>

          {/* Resumen del Nuevo Estado */}
          {montoIngresado > 0 && (
            <div className={`modal-abono-resumen ${seCompletara ? 'completo' : ''}`}>
              <div className="modal-abono-resumen-header">
                <Info size={16} />
                <strong>{seCompletara ? '¡Pago Completado!' : 'Resumen del Abono'}</strong>
              </div>
              <div className="modal-abono-resumen-contenido">
                <p>• Monto del abono: <strong>${montoIngresado.toLocaleString()}</strong></p>
                <p>• Nuevo total pagado: <strong>${(pagoSeleccionado.planPago.montoPagado + montoIngresado).toLocaleString()}</strong></p>
                <p>• Nuevo saldo pendiente: <strong>${nuevoSaldo.toLocaleString()}</strong></p>
                <p>• Nuevo progreso: <strong>{nuevoPorcentaje}%</strong></p>
                {seCompletara && (
                  <p className="modal-abono-mensaje-completo">
                    🎉 Este abono completará el pago total. El estado cambiará a "Finalizado".
                  </p>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="modal-abono-footer">
          <button type="button" onClick={manejarCancelar} className="modal-abono-boton-cancelar">
            Cancelar
          </button>
          <button type="submit" onClick={manejarEnviar} className="modal-abono-boton-guardar">
            <Save size={18} />
            <span>Registrar Abono</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarAbono;