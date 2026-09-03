import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  X,
  DollarSign,
  CreditCard,
  AlertCircle,
  Save,
  Info,
} from "lucide-react";
import "./ModalAgregarAbono.css";
import { API_CONFIG } from "../../../../config/api";

const ModalAgregarAbono = ({
  abierto,
  onCerrar,
  onGuardar,
  pagoSeleccionado,
}) => {
  const [formulario, setFormulario] = useState({
    montoAbono: "",
    fechaAbono: new Date().toISOString().split("T")[0],
    metodoPago: "efectivo",
    referencia: "",
    observaciones: "",
    comprobante: null,
  });

  const [previewComprobante, setPreviewComprobante] = useState(null);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const manejarComprobante = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const maxSize = 5 * 1024 * 1024;
    if (archivo.size > maxSize) {
      setErrores(prev => ({ ...prev, comprobante: "El archivo no debe superar 5MB" }));
      return;
    }

    setFormulario(prev => ({ ...prev, comprobante: archivo }));

    if (archivo.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewComprobante(e.target.result);
      reader.readAsDataURL(archivo);
    } else {
      setPreviewComprobante("pdf");
    }

    if (errores.comprobante) {
      setErrores(prev => { const e = { ...prev }; delete e.comprobante; return e; });
    }
  };

  const metodosPago = [
    { valor: "efectivo", etiqueta: "Efectivo" },
    { valor: "transferencia", etiqueta: "Transferencia Bancaria" },
    { valor: "tarjeta", etiqueta: "Tarjeta de Crédito/Débito" },
    { valor: "deposito", etiqueta: "Depósito Bancario" },
    { valor: "cheque", etiqueta: "Cheque" },
  ];

  const saldoPendiente = pagoSeleccionado?.planPago?.saldoPendiente || 0;
  const abonoMinimo = pagoSeleccionado?.planPago?.abonoMinimo || 0;
  const abonosSugerido = Math.min(abonoMinimo, saldoPendiente);

  useEffect(() => {
    if (abierto && pagoSeleccionado) {
      setFormulario((prev) => ({
        ...prev,
        montoAbono: abonosSugerido > 0 ? abonosSugerido.toString() : "",
      }));
    }
  }, [abierto, pagoSeleccionado, abonosSugerido]);

  const manejarCambio = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    if (errores[campo]) {
      setErrores((prev) => ({
        ...prev,
        [campo]: null,
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.montoAbono || parseFloat(formulario.montoAbono) <= 0) {
      nuevosErrores.montoAbono = "El monto del abono debe ser mayor a 0";
    } else if (parseFloat(formulario.montoAbono) > saldoPendiente) {
      nuevosErrores.montoAbono = `El monto no puede exceder el saldo pendiente ($${saldoPendiente.toLocaleString()})`;
    }

    if (!formulario.fechaAbono) {
      nuevosErrores.fechaAbono = "La fecha del abono es obligatoria";
    }

    if (!formulario.metodoPago) {
      nuevosErrores.metodoPago = "Selecciona un método de pago";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnviar = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setEnviando(true);

    try {
      const token = localStorage.getItem("token");

      const formDataEnvio = new FormData();
      formDataEnvio.append("pago_id", pagoSeleccionado.id);
      formDataEnvio.append("numero_abono", pagoSeleccionado.planPago.abonosRealizados + 1);
      formDataEnvio.append("monto", parseFloat(formulario.montoAbono));
      formDataEnvio.append("fecha_abono", formulario.fechaAbono);
      formDataEnvio.append("metodo_pago", formulario.metodoPago);
      if (formulario.referencia) formDataEnvio.append("referencia", formulario.referencia);
      if (formulario.observaciones) formDataEnvio.append("observaciones", formulario.observaciones);
      if (formulario.comprobante) formDataEnvio.append("comprobante", formulario.comprobante);

      await axios.post(`${API_CONFIG.BASE_URL}/abonos`, formDataEnvio, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await Swal.fire({
        title: "¡Abono Registrado!",
        html: `
          <div style="text-align: left; padding: 1rem;">
            <p><strong>Monto:</strong> $${parseFloat(
          formulario.montoAbono
        ).toLocaleString()}</p>
            <p><strong>Fecha:</strong> ${formulario.fechaAbono}</p>
            <p><strong>Método:</strong> ${metodosPago.find((m) => m.valor === formulario.metodoPago)
            ?.etiqueta
          }</p>
            ${seCompletara
            ? '<p style="color: #10b981; font-weight: 600; margin-top: 1rem;">🎉 ¡Pago completado!</p>'
            : ""
          }
          </div>
        `,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

      if (onGuardar) {
        await onGuardar();
      }

      limpiarFormulario();
      onCerrar();
    } catch (error) {
      console.error("❌ Error al registrar abono:", error);

      const mensajeError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "No se pudo registrar el abono";

      await Swal.fire({
        title: "Error",
        text: mensajeError,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setEnviando(false);
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      montoAbono: "",
      fechaAbono: new Date().toISOString().split("T")[0],
      metodoPago: "efectivo",
      referencia: "",
      observaciones: "",
    });
    setErrores({});
  };

  const manejarCancelar = () => {
    limpiarFormulario();
    onCerrar();
  };

  const establecerMontoCompleto = () => {
    setFormulario((prev) => ({
      ...prev,
      montoAbono: saldoPendiente.toString(),
    }));
  };

  if (!abierto || !pagoSeleccionado) return null;

  const montoPagado = parseFloat(pagoSeleccionado?.planPago?.montoPagado) || 0;
  const montoTotal = parseFloat(pagoSeleccionado?.planPago?.montoTotal) || 0;
  const montoIngresado = parseFloat(formulario.montoAbono) || 0;
  const nuevoTotalPagado = montoPagado + montoIngresado;
  const nuevoSaldo = saldoPendiente - montoIngresado;
  const seCompletara = nuevoSaldo === 0;
  const nuevoPorcentaje = montoTotal > 0
    ? ((nuevoTotalPagado / montoTotal) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="modal-abono-overlay">
      <div className="modal-abono-contenedor">
        <div className="modal-abono-header">
          <div>
            <h2 className="modal-abono-titulo">Agregar Nuevo Abono</h2>
            <p className="modal-abono-subtitulo">
              {pagoSeleccionado.cliente.nombre} -{" "}
              {pagoSeleccionado.numeroContrato}
            </p>
          </div>
          <button
            className="modal-abono-boton-cerrar"
            onClick={manejarCancelar}
            disabled={enviando}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={manejarEnviar} className="modal-abono-body">
          <div className="modal-abono-seccion">
            <div className="modal-abono-seccion-header">
              <DollarSign size={20} className="modal-abono-icono-seccion" />
              <h3 className="modal-abono-seccion-titulo">
                Información del Abono
              </h3>
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
                      onChange={(e) =>
                        manejarCambio("montoAbono", e.target.value)
                      }
                      min="0"
                      step="0.01"
                      max={saldoPendiente}
                      className={`modal-abono-input con-simbolo ${errores.montoAbono ? "error" : ""
                        }`}
                      placeholder="0.00"
                      disabled={enviando}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={establecerMontoCompleto}
                    className="modal-abono-boton-liquidar"
                    title="Liquidar saldo completo"
                    disabled={enviando}
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
                  Saldo pendiente: ${saldoPendiente.toLocaleString()} | Abono
                  mínimo sugerido: ${abonoMinimo.toLocaleString()}
                </p>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">Fecha del Abono *</label>
                <input
                  type="date"
                  value={formulario.fechaAbono}
                  onChange={(e) => manejarCambio("fechaAbono", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className={`modal-abono-input ${errores.fechaAbono ? "error" : ""
                    }`}
                  disabled={enviando}
                />
                {errores.fechaAbono && (
                  <p className="modal-abono-error">
                    <AlertCircle size={12} /> {errores.fechaAbono}
                  </p>
                )}
              </div>
            </div>
          </div>

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
                  onChange={(e) => manejarCambio("metodoPago", e.target.value)}
                  className={`modal-abono-select ${errores.metodoPago ? "error" : ""
                    }`}
                  disabled={enviando}
                >
                  {metodosPago.map((metodo) => (
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
                  onChange={(e) => manejarCambio("referencia", e.target.value)}
                  className="modal-abono-input"
                  placeholder="Ej: REF-123456 o No. de cheque"
                  disabled={enviando}
                />
              </div>
            </div>

            <div className="modal-abono-campo">
              <label className="modal-abono-label">Observaciones</label>
              <textarea
                value={formulario.observaciones}
                onChange={(e) => manejarCambio("observaciones", e.target.value)}
                rows={3}
                className="modal-abono-textarea"
                placeholder="Notas adicionales sobre este abono..."
                disabled={enviando}
              />
            </div>
            <div className="modal-abono-campo">
              <label className="modal-abono-label">
                Comprobante de Pago{" "}
                <span style={{ color: "#6b7280", fontWeight: 400 }}>(Opcional)</span>
              </label>

              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "0.5rem", padding: "1rem",
                border: `2px dashed ${formulario.comprobante ? "#10b981" : "#d1d5db"}`,
                borderRadius: "10px", cursor: enviando ? "not-allowed" : "pointer",
                background: formulario.comprobante ? "#f0fdf4" : "#f9fafb",
                transition: "all 0.2s",
              }}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={manejarComprobante}
                  style={{ display: "none" }}
                  disabled={enviando}
                />

                {/* Sin archivo seleccionado */}
                {!previewComprobante && (
                  <>
                    <span style={{ fontSize: "2rem" }}>📎</span>
                    <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      Haz clic para subir imagen (JPG, PNG) o PDF
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      Máximo 5MB
                    </span>
                  </>
                )}

                {/* PDF seleccionado */}
                {previewComprobante === "pdf" && (
                  <>
                    <span style={{ fontSize: "2rem" }}>📄</span>
                    <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 600 }}>
                      {formulario.comprobante?.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormulario(p => ({ ...p, comprobante: null }));
                        setPreviewComprobante(null);
                      }}
                      style={{
                        fontSize: "0.75rem", color: "#ef4444",
                        background: "none", border: "none", cursor: "pointer",
                      }}
                    >
                      ✕ Quitar
                    </button>
                  </>
                )}

                {/* Imagen seleccionada — preview */}
                {previewComprobante && previewComprobante !== "pdf" && (
                  <div style={{ position: "relative" }}>
                    <img
                      src={previewComprobante}
                      alt="Vista previa del comprobante"
                      style={{
                        maxHeight: "120px", maxWidth: "100%",
                        borderRadius: "8px", objectFit: "contain",
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormulario(p => ({ ...p, comprobante: null }));
                        setPreviewComprobante(null);
                      }}
                      style={{
                        position: "absolute", top: "-8px", right: "-8px",
                        background: "#ef4444", color: "white", border: "none",
                        borderRadius: "50%", width: "20px", height: "20px",
                        cursor: "pointer", fontSize: "12px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </label>

              {errores.comprobante && (
                <p className="modal-abono-error">
                  <AlertCircle size={12} /> {errores.comprobante}
                </p>
              )}
            </div>
          </div>

          {montoIngresado > 0 && (
            <div
              className={`modal-abono-resumen ${seCompletara ? "completo" : ""
                }`}
            >
              <div className="modal-abono-resumen-header">
                <Info size={16} />
                <strong>
                  {seCompletara ? "¡Pago Completado!" : "Resumen del Abono"}
                </strong>
              </div>
              <div className="modal-abono-resumen-contenido">
                <p>
                  • Monto del abono:{" "}
                  <strong>${montoIngresado.toLocaleString()}</strong>
                </p>
                <p>
                  • Nuevo total pagado:{" "}
                  <strong>
                    ${nuevoTotalPagado.toLocaleString()}
                  </strong>
                </p>
                <p>
                  • Nuevo saldo pendiente:{" "}
                  <strong>${nuevoSaldo.toLocaleString()}</strong>
                </p>
                <p>
                  • Nuevo progreso: <strong>{nuevoPorcentaje}%</strong>
                </p>
                {seCompletara && (
                  <p className="modal-abono-mensaje-completo">
                    🎉 Este abono completará el pago total. El estado cambiará a
                    "Pagado".
                  </p>
                )}
              </div>
            </div>
          )}
        </form>

        <div className="modal-abono-footer">
          <button
            type="button"
            onClick={manejarCancelar}
            className="modal-abono-boton-cancelar"
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={manejarEnviar}
            className="modal-abono-boton-guardar"
            disabled={enviando}
          >
            {enviando ? (
              <>
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Registrar Abono</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ModalAgregarAbono;
