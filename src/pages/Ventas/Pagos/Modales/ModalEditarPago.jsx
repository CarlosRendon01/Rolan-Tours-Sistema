import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import axios from "axios";
import Swal from 'sweetalert2';
import './ModalEditarPago.css';

const ModalEditarPago = ({ estaAbierto, alCerrar, pago, alGuardar }) => {
  const formatearFechaParaInput = (fecha) => {
    if (!fecha) return '';
    // Si la fecha tiene hora (formato datetime), extraer solo la fecha
    if (fecha.includes(' ')) {
      return fecha.split(' ')[0];
    }
    // Si ya está en formato correcto, devolverla
    return fecha;
  };

  const [formulario, establecerFormulario] = useState({
    cliente: '',
    monto: '',
    fechaVencimiento: '',
    metodoPago: '',
    concepto: '',
  });

  const [errores, establecerErrores] = useState({});
  const [guardando, establecerGuardando] = useState(false);

  useEffect(() => {
    if (pago && estaAbierto) {
      establecerFormulario({
        cliente: pago.cliente?.nombre || "Sin cliente",
        monto: pago.planPago?.montoTotal || 0,
        metodoPago: pago.metodoPago || "Sin método",
        fechaVencimiento: formatearFechaParaInput(pago.proximoVencimiento),
        concepto: pago.observaciones || ""
      });
      establecerErrores({});
    }
  }, [pago, estaAbierto]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    establecerFormulario(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando se modifica
    if (errores[name]) {
      establecerErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.cliente.trim()) {
      nuevosErrores.cliente = 'El cliente es requerido';
    }

    if (formulario.monto === null || formulario.monto === "" || isNaN(formulario.monto)) {
      nuevosErrores.monto = "El monto es requerido";
    } else if (parseFloat(formulario.monto) <= 0) {
      nuevosErrores.monto = 'El monto debe ser mayor que 0';
    }

    if (!formulario.fechaVencimiento.trim() || !formulario.fechaVencimiento.trim()) {
      nuevosErrores.fechaVencimiento = 'La fecha de vencimiento es requerida';
    }

    if (!formulario.concepto.trim()) {
      nuevosErrores.concepto = 'El concepto es requerido';
    }

    establecerErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarGuardar = async () => {
    if (!validarFormulario()) {
      return;
    }

    establecerGuardando(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        monto_total: Number(formulario.monto),
        metodo_pago: formulario.metodoPago || null,
        fecha_finalizacion: formulario.fechaVencimiento || null,
        observaciones: formulario.concepto || null,
      };

      const res = await axios.put(
        `http://127.0.0.1:8000/api/pagos/${pago.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Llamar función de guardado del padre
      if (alGuardar) {
        alGuardar(res.data.data);
      }

      // Cerrar modal
      alCerrar();

      // Mostrar mensaje de éxito
      await Swal.fire({
        title: '¡Pago actualizado!',
        text: `Los datos del pago de ${formulario.cliente} han sido actualizados`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'alerta-popup',
          title: 'alerta-titulo-exito',
          confirmButton: 'alerta-boton-exito',
          icon: 'alerta-icono-exito'
        },
        buttonsStyling: false,
        timer: 2500,
        timerProgressBar: true,
        width: '380px'
      });

    } catch (error) {
      console.error('Error al guardar:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el pago. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'alerta-popup',
          title: 'alerta-titulo-error',
          confirmButton: 'alerta-boton-error'
        },
        buttonsStyling: false,
        width: '380px'
      });
    } finally {
      establecerGuardando(false);
    }
  };

  const manejarCerrar = () => {
    if (!guardando) {
      establecerFormulario({
        cliente: '',
        monto: '',
        fechaVencimiento: '',
        metodoPago: '',
        concepto: '',
      });
      establecerErrores({});
      alCerrar();
    }
  };

  if (!estaAbierto || !pago) return null;

  return (
    <div className="modal-editar-overlay" onClick={manejarCerrar}>
      <div className="modal-editar-contenedor" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-editar-header">
          <div className="modal-editar-header-contenido">
            <div className="modal-editar-icono-principal">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="modal-editar-titulo">Editar Pago Vencido</h2>
              <p className="modal-editar-subtitulo">Actualizar información del pago</p>
            </div>
          </div>
          <button
            className="modal-editar-boton-cerrar"
            onClick={manejarCerrar}
            disabled={guardando}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-editar-body">
          <form className="modal-editar-formulario" onSubmit={(e) => e.preventDefault()}>
            {/* Cliente */}
            <div className="modal-editar-campo">
              <label htmlFor="cliente" className="modal-editar-label">
                Cliente <span className="modal-editar-requerido">*</span>
              </label>
              <input
                type="text"
                id="cliente"
                name="cliente"
                value={formulario.cliente}
                onChange={manejarCambio}
                className={`modal-editar-input ${errores.cliente ? 'modal-editar-input-error' : ''}`}
                placeholder="Nombre del cliente"
                disabled={guardando}
              />
              {errores.cliente && (
                <span className="modal-editar-mensaje-error">{errores.cliente}</span>
              )}
            </div>

            {/* Monto */}
            <div className="modal-editar-campo">
              <label htmlFor="monto" className="modal-editar-label">
                Monto <span className="modal-editar-requerido">*</span>
              </label>
              <div className="modal-editar-input-grupo">
                <span className="modal-editar-input-prefijo">$</span>
                <input
                  type="text"
                  id="monto"
                  name="monto"
                  value={formulario.monto}
                  onChange={manejarCambio}
                  className={`modal-editar-input modal-editar-input-monto ${errores.monto ? 'modal-editar-input-error' : ''}`}
                  placeholder="0.00"
                  disabled={guardando}
                />
              </div>
              {errores.monto && (
                <span className="modal-editar-mensaje-error">{errores.monto}</span>
              )}
            </div>

            {/* Fecha de Vencimiento */}
            <div className="modal-editar-campo">
              <label htmlFor="fechaVencimiento" className="modal-editar-label">
                Fecha de Vencimiento <span className="modal-editar-requerido">*</span>
              </label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={formulario.fechaVencimiento}
                onChange={manejarCambio}
                className={`modal-editar-input ${errores.fechaVencimiento ? 'modal-editar-input-error' : ''}`}
                disabled={guardando}
              />
              {errores.fechaVencimiento && (
                <span className="modal-editar-mensaje-error">{errores.fechaVencimiento}</span>
              )}
            </div>

            {/* Método de Pago */}
            <div className="modal-editar-campo">
              <label htmlFor="metodoPago" className="modal-editar-label">
                Método de Pago
              </label>
              <select
                id="metodoPago"
                name="metodoPago"
                value={formulario.metodoPago}
                onChange={manejarCambio}
                className="modal-editar-input modal-editar-select"
                disabled={guardando}
              >
                <option value="">Seleccionar método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            {/* Concepto */}
            <div className="modal-editar-campo">
              <label htmlFor="concepto" className="modal-editar-label">
                Concepto <span className="modal-editar-requerido">*</span>
              </label>
              <textarea
                id="concepto"
                name="concepto"
                value={formulario.concepto}
                onChange={manejarCambio}
                className={`modal-editar-textarea ${errores.concepto ? 'modal-editar-input-error' : ''}`}
                placeholder="Descripción del servicio o producto"
                rows="3"
                disabled={guardando}
              />
              {errores.concepto && (
                <span className="modal-editar-mensaje-error">{errores.concepto}</span>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="modal-editar-footer">
          <button
            className="modal-editar-boton-cancelar"
            onClick={manejarCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            className="modal-editar-boton-guardar"
            onClick={manejarGuardar}
            disabled={guardando}
          >
            <Save size={18} />
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        {/* Loading Overlay */}
        {guardando && (
          <div className="modal-editar-loading">
            <div className="modal-editar-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalEditarPago;