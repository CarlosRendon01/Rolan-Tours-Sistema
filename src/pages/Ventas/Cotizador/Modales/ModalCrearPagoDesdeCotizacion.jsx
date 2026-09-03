import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  X,
  Save,
  DollarSign,
  AlertCircle,
  CreditCard,
  Info,
  FileText,
} from "lucide-react";
import "../../Pagos/ModalesAbonos/ModalAgregarAbono.css";
import { API_CONFIG } from "../../../../config/api";

const calcularAbonoMinimo = (total, numeroAbonos) => {
  if (!total || !numeroAbonos) return "";
  return Math.ceil(parseFloat(total) / parseInt(numeroAbonos)).toString();
};

const formatearMoneda = (valor) => {
  return parseFloat(valor).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
  });
};

const ModalCrearPagoDesdeCotizacion = ({
  estaAbierto,
  cotizacion,
  alCerrar,
  alGuardar,
}) => {
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});

  const [formulario, setFormulario] = useState({
    numeroAbonos: "3",
    abonoMinimo: "",
    frecuenciaPago: "semanal",
    fechaPrimerAbono: "",
    numeroContrato: "",
    observaciones: "",
  });

  const frecuenciasPago = [
    { valor: "semanal", etiqueta: "Semanal" },
    { valor: "quincenal", etiqueta: "Quincenal" },
    { valor: "mensual", etiqueta: "Mensual" },
  ];

  const [vehiculos, setVehiculos] = useState([]);
  const [montoEditado, setMontoEditado] = useState(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  const totalActual = montoEditado !== null
    ? montoEditado
    : (vehiculoSeleccionado?.costos?.total_con_iva ?? cotizacion?.total ?? 0);

  const abonoCalculado = useMemo(
    () => calcularAbonoMinimo(totalActual, formulario.numeroAbonos),
    [totalActual, formulario.numeroAbonos]
  );

  useEffect(() => {
    if (abonoCalculado) {
      setFormulario((prev) => ({
        ...prev,
        abonoMinimo: abonoCalculado,
      }));
    }
  }, [abonoCalculado]);

  useEffect(() => {
    if (estaAbierto && cotizacion) {
      setMontoEditado(null);
      let listaVehiculos = [];
      try {
        const listaRaw = cotizacion.lista;
        const parsed = typeof listaRaw === "string" ? JSON.parse(listaRaw) : listaRaw;
        listaVehiculos = parsed?.cotizaciones_todos_vehiculos ?? [];
      } catch {
        listaVehiculos = [];
      }
      setVehiculos(listaVehiculos);

      const recomendado =
        listaVehiculos.find((v) => v.vehiculo_id === cotizacion.vehiculo_id) ??
        listaVehiculos[0] ??
        null;
      setVehiculoSeleccionado(recomendado);

      const totalInicial = recomendado?.costos?.total_con_iva ?? cotizacion.total;
      const abonoInicial = calcularAbonoMinimo(totalInicial, "3");

      setFormulario({
        numeroAbonos: "3",
        abonoMinimo: abonoInicial,
        frecuenciaPago: "semanal",
        fechaPrimerAbono: "",
        numeroContrato: `CONT-${Date.now()}`,
        observaciones: "",
      });
      setErrores({});
    }
  }, [estaAbierto, cotizacion]);

  const manejarCambio = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: null }));
    }
  };

  const handleVehiculoChange = (e) => {
    const id = parseInt(e.target.value);
    const veh = vehiculos.find((v) => v.vehiculo_id === id) ?? null;
    setVehiculoSeleccionado(veh);
    const nuevoTotal = veh?.costos?.total_con_iva ?? cotizacion.total;
    const nuevoAbono = calcularAbonoMinimo(nuevoTotal, formulario.numeroAbonos);
    setFormulario((prev) => ({ ...prev, abonoMinimo: nuevoAbono }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const numAbonos = parseInt(formulario.numeroAbonos);

    if (!numAbonos || numAbonos < 2) {
      nuevosErrores.numeroAbonos = "Debe haber al menos 2 abonos";
    } else if (numAbonos > 12) {
      nuevosErrores.numeroAbonos = "El máximo es 12 abonos";
    }

    if (!formulario.fechaPrimerAbono) {
      nuevosErrores.fechaPrimerAbono =
        "La fecha del primer abono es obligatoria";
    }

    if (!formulario.numeroContrato.trim()) {
      nuevosErrores.numeroContrato = "El número de contrato es obligatorio";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnviar = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setGuardando(true);

    try {
      const token = localStorage.getItem("token");

      const datosPago = {
        cliente_id: cotizacion.cliente_id,
        cotizacion_id: cotizacion.id,
        numero_contrato: formulario.numeroContrato,
        monto_total: parseFloat(totalActual),
        vehiculo_id: vehiculoSeleccionado?.vehiculo_id ?? null,
        numero_abonos: parseInt(formulario.numeroAbonos),
        abono_minimo: parseFloat(formulario.abonoMinimo),
        frecuencia_pago: formulario.frecuenciaPago,
        fecha_inicio: formulario.fechaPrimerAbono,
        observaciones: formulario.observaciones || null,
      };

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/pagos`,
        datosPago,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      alCerrar();

      await Swal.fire({
        title: "¡Plan de Pago Creado!",
        html: `
          <div style="text-align: left; padding: 1rem;">
            <p><strong>Cotización:</strong> ${cotizacion.folio}</p>
            <p><strong>Cliente:</strong> ${cotizacion.cliente?.nombre || "Sin cliente"
          }</p>
            <p><strong>Total:</strong> $${formatearMoneda(totalActual)}</p>
            <p><strong>Número de abonos:</strong> ${formulario.numeroAbonos}</p>
            <p><strong>Monto por abono:</strong> $${formatearMoneda(
            formulario.abonoMinimo
          )}</p>
            <p style="color: #10b981; font-weight: 600; margin-top: 1rem;">✅ Plan de pago vinculado correctamente</p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Ver Pagos",
        showConfirmButton: true,
        timer: undefined,
      });

      if (alGuardar) {
        await alGuardar();
      }

      navigate("/pagos", { replace: true });
    } catch (error) {
      console.error("❌ Error al crear pago:", error);

      if (error.response?.status === 401) {
        await Swal.fire({
          icon: "error",
          title: "Sesión expirada",
          text: "Por favor, inicia sesión nuevamente",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rol");
        navigate("/");
        return;
      }

      await Swal.fire({
        title: "Error",
        text:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "No se pudo crear el pago",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setGuardando(false);
    }
  };

  const manejarCancelar = () => {
    if (!guardando) {
      setFormulario({
        numeroAbonos: "3",
        abonoMinimo: "",
        frecuenciaPago: "semanal",
        fechaPrimerAbono: "",
        numeroContrato: "",
        observaciones: "",
      });
      setErrores({});
      alCerrar();
    }
  };

  if (!estaAbierto || !cotizacion) return null;

  return (
    <div className="modal-abono-overlay" onClick={manejarCancelar}>
      <div
        className="modal-abono-contenedor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-abono-header">
          <div>
            <h2 className="modal-abono-titulo">Crear Plan de Pago</h2>
            <p className="modal-abono-subtitulo">
              Cotización: {cotizacion.folio} - Cliente:{" "}
              {cotizacion.cliente?.nombre || "Sin cliente"}
            </p>
          </div>
          <button
            className="modal-abono-boton-cerrar"
            onClick={manejarCancelar}
            disabled={guardando}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={manejarEnviar} className="modal-abono-body">
          <div className="modal-abono-seccion">
            <div className="modal-abono-seccion-header">
              <FileText size={20} className="modal-abono-icono-seccion" />
              <h3 className="modal-abono-seccion-titulo">
                Resumen de Cotización
              </h3>
            </div>

            <div className="modal-abono-resumen-cotizacion">
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <p>
                  <strong>Folio:</strong> {cotizacion.folio}
                </p>
                <p>
                  <strong>Origen:</strong> {cotizacion.origen}
                </p>
                <p>
                  <strong>Destino:</strong> {cotizacion.destino}
                </p>
                <p>
                  <strong>Fecha Salida:</strong> {cotizacion.fecha_salida}
                </p>
                {vehiculos.length > 1 && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <label className="modal-abono-label">Vehículo para el plan de pago</label>
                    <select
                      className="modal-abono-select"
                      value={vehiculoSeleccionado?.vehiculo_id ?? ""}
                      onChange={handleVehiculoChange}
                      disabled={guardando}
                    >
                      {vehiculos.map((v) => (
                        <option key={v.vehiculo_id} value={v.vehiculo_id}>
                          {v.vehiculo_nombre} — {v.capacidad_pasajeros} pax — $
                          {formatearMoneda(v.costos?.total_con_iva ?? 0)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div style={{ marginTop: "0.75rem" }}>
                  <label className="modal-abono-label">Total a Pagar (editable)</label>
                  <div className="modal-abono-input-monto">
                    <span className="modal-abono-simbolo-moneda">$</span>
                    <input
                      type="number"
                      className="modal-abono-input con-simbolo"
                      value={montoEditado !== null ? montoEditado : (vehiculoSeleccionado?.costos?.total_con_iva ?? cotizacion?.total ?? 0)}
                      min="0"
                      step="0.01"
                      disabled={guardando}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setMontoEditado(val);
                        // Recalcular abono automáticamente
                        const nuevoAbono = calcularAbonoMinimo(val, formulario.numeroAbonos);
                        setFormulario((prev) => ({ ...prev, abonoMinimo: nuevoAbono }));
                      }}
                    />
                  </div>
                  {montoEditado !== null && (
                    <button
                      type="button"
                      style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "4px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      onClick={() => {
                        setMontoEditado(null);
                        const original = vehiculoSeleccionado?.costos?.total_con_iva ?? cotizacion?.total ?? 0;
                        const nuevoAbono = calcularAbonoMinimo(original, formulario.numeroAbonos);
                        setFormulario((prev) => ({ ...prev, abonoMinimo: nuevoAbono }));
                      }}
                    >
                      ↩ Restaurar precio original
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-abono-seccion">
            <div className="modal-abono-seccion-header">
              <DollarSign size={20} className="modal-abono-icono-seccion" />
              <h3 className="modal-abono-seccion-titulo">
                Configuración del Plan de Pago
              </h3>
            </div>

            <div className="modal-abono-campo-grupo">
              <div className="modal-abono-campo">
                <label className="modal-abono-label">Número de Abonos *</label>
                <input
                  type="number"
                  value={formulario.numeroAbonos}
                  onChange={(e) =>
                    manejarCambio("numeroAbonos", e.target.value)
                  }
                  min="2"
                  max="12"
                  className={`modal-abono-input ${errores.numeroAbonos ? "error" : ""
                    }`}
                  disabled={guardando}
                />
                {errores.numeroAbonos && (
                  <p className="modal-abono-error">
                    <AlertCircle size={12} /> {errores.numeroAbonos}
                  </p>
                )}
                <p className="modal-abono-ayuda">Mínimo 2 abonos, máximo 12</p>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">Monto por Abono</label>
                <div className="modal-abono-input-monto">
                  <span className="modal-abono-simbolo-moneda">$</span>
                  <input
                    type="text"
                    value={formulario.abonoMinimo}
                    readOnly
                    className="modal-abono-input con-simbolo readonly"
                  />
                </div>
                <p className="modal-abono-ayuda">Calculado automáticamente</p>
              </div>
            </div>

            <div className="modal-abono-campo-grupo">
              <div className="modal-abono-campo">
                <label className="modal-abono-label">
                  Frecuencia de Pago *
                </label>
                <select
                  value={formulario.frecuenciaPago}
                  onChange={(e) =>
                    manejarCambio("frecuenciaPago", e.target.value)
                  }
                  className="modal-abono-select"
                  disabled={guardando}
                >
                  {frecuenciasPago.map((freq) => (
                    <option key={freq.valor} value={freq.valor}>
                      {freq.etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">
                  Fecha Primer Abono *
                </label>
                <input
                  type="date"
                  value={formulario.fechaPrimerAbono}
                  onChange={(e) =>
                    manejarCambio("fechaPrimerAbono", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className={`modal-abono-input ${errores.fechaPrimerAbono ? "error" : ""
                    }`}
                  disabled={guardando}
                />
                {errores.fechaPrimerAbono && (
                  <p className="modal-abono-error">
                    <AlertCircle size={12} /> {errores.fechaPrimerAbono}
                  </p>
                )}
              </div>
            </div>

            {formulario.numeroAbonos && formulario.abonoMinimo && (
              <div className="modal-abono-resumen">
                <div className="modal-abono-resumen-header">
                  <Info size={16} />
                  <strong>Resumen del Plan de Pagos:</strong>
                </div>
                <div className="modal-abono-resumen-contenido">
                  <p>
                    • {formulario.numeroAbonos} pagos de{" "}
                    <strong>${formulario.abonoMinimo}</strong>
                  </p>
                  <p>
                    • Total:{" "}
                    <strong>${parseFloat(totalActual).toFixed(2)}</strong>
                  </p>
                  <p>
                    • Frecuencia:{" "}
                    <strong>
                      {
                        frecuenciasPago.find(
                          (f) => f.valor === formulario.frecuenciaPago
                        )?.etiqueta
                      }
                    </strong>
                  </p>
                  <p>
                    • Primer pago:{" "}
                    <strong>
                      {formulario.fechaPrimerAbono || "Por definir"}
                    </strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="modal-abono-seccion">
            <div className="modal-abono-seccion-header">
              <CreditCard size={20} className="modal-abono-icono-seccion" />
              <h3 className="modal-abono-seccion-titulo">
                Información Adicional
              </h3>
            </div>

            <div className="modal-abono-campo">
              <label className="modal-abono-label">Número de Contrato *</label>
              <input
                type="text"
                value={formulario.numeroContrato}
                onChange={(e) =>
                  manejarCambio("numeroContrato", e.target.value)
                }
                className={`modal-abono-input ${errores.numeroContrato ? "error" : ""
                  }`}
                placeholder="CONT-001"
                disabled={guardando}
              />
              {errores.numeroContrato && (
                <p className="modal-abono-error">
                  <AlertCircle size={12} /> {errores.numeroContrato}
                </p>
              )}
              <p className="modal-abono-ayuda">
                Se generó automáticamente, puedes modificarlo
              </p>
            </div>

            <div className="modal-abono-campo">
              <label className="modal-abono-label">
                Observaciones (Opcional)
              </label>
              <textarea
                value={formulario.observaciones}
                onChange={(e) => manejarCambio("observaciones", e.target.value)}
                rows={3}
                className="modal-abono-textarea"
                placeholder="Notas adicionales sobre el plan de pago..."
                disabled={guardando}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="modal-abono-footer">
          <button
            type="button"
            onClick={manejarCancelar}
            className="modal-abono-boton-cancelar"
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={manejarEnviar}
            className="modal-abono-boton-guardar"
            disabled={guardando}
          >
            {guardando ? (
              <>
                <div className="spinner" />
                <span>Creando Plan...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Crear Plan de Pago</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCrearPagoDesdeCotizacion;
