import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  X,
  Save,
  FileText,
  AlertCircle,
  Calendar,
  User,
  Car,
  Users,
} from "lucide-react";
import "../../Pagos/ModalesAbonos/ModalAgregarAbono.css";
import { API_CONFIG } from "../../../../config/api";

const ModalCrearTodosDesdePago = ({ estaAbierto, pago, alCerrar }) => {
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState("orden");
  const [cargandoFolios, setCargandoFolios] = useState(false);
  const [conductoresDisponibles, setConductoresDisponibles] = useState([]);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [coordinadoresDisponibles, setCoordinadoresDisponibles] = useState([]);
  const [guiasDisponibles, setGuiasDisponibles] = useState([]);
  const [conductoresFiltrados, setConductoresFiltrados] = useState([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
  const [ordenesExistentes, setOrdenesExistentes] = useState([]);

  const [formulario, setFormulario] = useState({
    folio_orden: "",
    fecha_orden_servicio: new Date().toISOString().split("T")[0],
    conductor_id: "",
    vehiculo_id: "",
    tipo_pasaje: "Turismo Estatal",
    n_unidades_contratadas: "1",

    folio_reserva: "",
    fecha_reserva: new Date().toISOString().split("T")[0],
    num_habitantes: "1",
    servicio: "",
    forma_pago: "efectivo",
    pagado: "no pagado",

    coordinador_id: "",
    guia_id: "",
  });

  const obtenerSiguienteFolio = async () => {
    setCargandoFolios(true);
    try {
      const token = localStorage.getItem("token");

      const resOrden = await axios.get(
        `${API_CONFIG.BASE_URL}/ordenes-servicio/siguiente-folio`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const resReserva = await axios.get(
        `${API_CONFIG.BASE_URL}/reservas/siguiente-folio`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setFormulario((prev) => ({
        ...prev,
        folio_orden: resOrden.data.siguiente_folio || "1",
        folio_reserva: resReserva.data.siguiente_folio || "1",
      }));
    } catch (error) {
      console.error("Error al obtener folios:", error);
      setFormulario((prev) => ({
        ...prev,
        folio_orden: "1",
        folio_reserva: "1",
      }));
    } finally {
      setCargandoFolios(false);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      if (!estaAbierto || !pago) return;

      try {
        const token = localStorage.getItem("token");

        const [conductores, vehiculos, coordinadores, guias, ordenes] =
          await Promise.all([
            axios.get(
              `${API_CONFIG.BASE_URL}/ordenes-servicio/conductores/disponibles`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            ),
            axios.get(
              `${API_CONFIG.BASE_URL}/ordenes-servicio/vehiculos/disponibles`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            ),
            axios.get(`${API_CONFIG.BASE_URL}/coordinadores`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }),
            axios.get(`${API_CONFIG.BASE_URL}/guias`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }),
            axios.get(`${API_CONFIG.BASE_URL}/ordenes-servicio`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }),
          ]);

        setConductoresDisponibles(conductores.data || []);
        setVehiculosDisponibles(vehiculos.data || []);
        setCoordinadoresDisponibles(coordinadores.data || []);
        setGuiasDisponibles(guias.data || []);
        setOrdenesExistentes(ordenes.data || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }

      const cotizacion = pago.cotizacion;
      const stopsData = cotizacion?.stops
        ? (typeof cotizacion.stops === "string"
          ? JSON.parse(cotizacion.stops)
          : cotizacion.stops)
        : [];

      const destinoCotizacion =
        cotizacion?.destino ||
        (stopsData.length > 0 ? stopsData[stopsData.length - 1]?.destino : "") ||
        "";

      setFormulario({
        folio_orden: "",
        fecha_orden_servicio: new Date().toISOString().split("T")[0],
        conductor_id: "",
        vehiculo_id: "",
        coordinador_id: "",
        guia_id: "",
        // Contrato
        domicilio: "",
        tipo_pasaje: "Turismo Estatal",
        n_unidades_contratadas: "1",
        // Reserva
        folio_reserva: "",
        fecha_reserva: new Date().toISOString().split("T")[0],
        num_habitantes: String(cotizacion?.num_pasajeros || "1"),
        servicio: cotizacion?.descripcion || "",
        forma_pago: "efectivo",
        pagado: "no pagado",
        // Clave: la cotizacion une todo
        cotizacion_id: pago.cotizacion?.id || pago.cotizacion_id || "",
      });
      setErrores({});

      obtenerSiguienteFolio();
    };

    cargarDatos();
  }, [estaAbierto, pago]);

  const manejarCambio = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: null }));
    }
  };

  useEffect(() => {
    if (!pago?.cotizacion || ordenesExistentes.length === 0) {
      setConductoresFiltrados(conductoresDisponibles);
      setVehiculosFiltrados(vehiculosDisponibles);
      return;
    }

    const cot = pago.cotizacion;
    const inicioNuevo = new Date(`${cot.fecha_salida}T${cot.hora_salida || "00:00"}:00`);
    const finNuevo = new Date(`${cot.fecha_regreso || cot.fecha_salida}T${cot.hora_regreso || "23:59"}:00`);
    const margen = 2 * 60 * 60 * 1000; // 2 horas en ms

    const conductoresConConflicto = new Set();
    const vehiculosConConflicto = new Set();

    ordenesExistentes.forEach((o) => {
      if (!o.fecha_inicio_servicio) return;

      const inicioExistente = new Date(`${o.fecha_inicio_servicio}T${o.horario_inicio_servicio || "00:00"}:00`);
      const finExistente = new Date(`${o.fecha_final_servicio || o.fecha_inicio_servicio}T${o.horario_final_servicio || "23:59"}:00`);

      const hayConflicto =
        inicioNuevo < finExistente.getTime() + margen &&
        finNuevo > inicioExistente.getTime() - margen;

      if (hayConflicto) {
        if (o.operador_id) conductoresConConflicto.add(parseInt(o.operador_id));
        if (o.vehiculo_id) vehiculosConConflicto.add(parseInt(o.vehiculo_id));
      }
    });

    setConductoresFiltrados(
      conductoresDisponibles.filter((c) => !conductoresConConflicto.has(c.id))
    );
    setVehiculosFiltrados(
      vehiculosDisponibles.filter((v) => !vehiculosConConflicto.has(v.id))
    );
  }, [conductoresDisponibles, vehiculosDisponibles, ordenesExistentes, pago]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.folio_orden)
      nuevosErrores.folio_orden = "El folio de orden es obligatorio";
    if (!formulario.fecha_orden_servicio)
      nuevosErrores.fecha_orden_servicio = "La fecha es obligatoria";
    if (!formulario.tipo_pasaje)
      nuevosErrores.tipo_pasaje = "El tipo de pasaje es obligatorio";
    if (!formulario.n_unidades_contratadas)
      nuevosErrores.n_unidades_contratadas = "Las unidades son obligatorias";
    if (!formulario.folio_reserva)
      nuevosErrores.folio_reserva = "El folio de reserva es obligatorio";
    if (!formulario.fecha_reserva)
      nuevosErrores.fecha_reserva = "La fecha de reserva es obligatoria";
    if (!formulario.num_habitantes)
      nuevosErrores.num_habitantes = "El número de habitantes es obligatorio";
    if (!formulario.servicio.trim())
      nuevosErrores.servicio = "La descripción del servicio es obligatoria";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnviar = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      if (errores.folio_orden || errores.fecha_orden_servicio)
        setSeccionActiva("orden");
      else if (errores.domicilio || errores.tipo_pasaje)
        setSeccionActiva("contrato");
      else if (errores.folio_reserva || errores.servicio)
        setSeccionActiva("reserva");
      return;
    }

    setGuardando(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await Swal.fire({ icon: "error", title: "Sesión expirada" });
        navigate("/");
        return;
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/pagos/${pago.id}/crear-todos`,
        formulario,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      alCerrar();

      await Swal.fire({
        title: "¡Todo Creado Exitosamente!",
        html: `
                    <div class="resumen-creacion">
                        <p><strong>✅ Orden de Servicio:</strong> #${formulario.folio_orden
          }</p>
                        <p><strong>✅ Contrato:</strong> Creado</p>
                        <p><strong>✅ Reserva:</strong> #${formulario.folio_reserva
          }</p>
                        <hr>
                        <p><strong>Cliente:</strong> ${pago.cotizacion?.cliente?.nombre || "N/A"
          }</p>
                        <p><strong>Total:</strong> $${parseFloat(
            pago.planPago?.montoTotal || 0
          ).toLocaleString("es-MX", {
            minimumFractionDigits: 2,
          })}</p>
                    </div>
                `,
        icon: "success",
        confirmButtonText: "Ver Órdenes",
      });

      navigate("/orden-servicio", { replace: true });
    } catch (error) {
      console.error("❌ Error:", error);

      if (error.response?.status === 401) {
        await Swal.fire({ icon: "error", title: "Sesión expirada" });
        localStorage.clear();
        navigate("/login");
        return;
      }

      const mensaje =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se pudo crear";

      await Swal.fire({
        title: "Error",
        text: mensaje,
        icon: "error",
      });
    } finally {
      setGuardando(false);
    }
  };

  if (!estaAbierto || !pago) return null;

  return (
    <div className="modal-abono-overlay" onClick={alCerrar}>
      <div
        className="modal-abono-contenedor modal-contenedor-todos"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-abono-header">
          <div>
            <h2 className="modal-abono-titulo">
              Crear Orden + Contrato + Reserva
            </h2>
            <p className="modal-abono-subtitulo">
              Pago: {pago.numeroContrato} - Cliente:{" "}
              {pago.cliente?.nombre || "Sin cliente"}
            </p>
            {cargandoFolios && (
              <p className="cargando-folios-texto">
                Cargando folios automáticos...
              </p>
            )}
          </div>
          <button
            className="modal-abono-boton-cerrar"
            onClick={alCerrar}
            disabled={guardando}
          >
            <X size={20} />
          </button>
        </div>

        <div className="tabs-container">
          {["orden", "contrato", "reserva"].map((seccion) => (
            <button
              key={seccion}
              onClick={() => setSeccionActiva(seccion)}
              className={`tab-button ${seccionActiva === seccion ? "tab-button-active" : ""
                }`}
            >
              {seccion === "orden" && (
                <FileText size={16} className="tab-icon" />
              )}
              {seccion === "contrato" && (
                <FileText size={16} className="tab-icon" />
              )}
              {seccion === "reserva" && (
                <Calendar size={16} className="tab-icon" />
              )}
              {seccion.charAt(0).toUpperCase() + seccion.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={manejarEnviar} className="modal-abono-body">
          {seccionActiva === "orden" && (
            <div className="modal-abono-seccion">
              <div className="modal-abono-campo-grupo">
                <div className="modal-abono-campo">
                  <label className="modal-abono-label">
                    Folio Orden (Auto) *
                  </label>
                  <input
                    type="text"
                    value={formulario.folio_orden}
                    className={`modal-abono-input input-disabled ${errores.folio_orden ? "error" : ""
                      }`}
                    disabled={true}
                  />
                  {errores.folio_orden && (
                    <p className="modal-abono-error">
                      <AlertCircle size={12} /> {errores.folio_orden}
                    </p>
                  )}
                </div>

                <div className="modal-abono-campo">
                  <label className="modal-abono-label">Fecha Orden *</label>
                  <input
                    type="date"
                    value={formulario.fecha_orden_servicio}
                    onChange={(e) =>
                      manejarCambio("fecha_orden_servicio", e.target.value)
                    }
                    className={`modal-abono-input ${errores.fecha_orden_servicio ? "error" : ""
                      }`}
                    disabled={guardando}
                  />
                  {errores.fecha_orden_servicio && (
                    <p className="modal-abono-error">
                      <AlertCircle size={12} /> {errores.fecha_orden_servicio}
                    </p>
                  )}
                </div>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">
                  <User size={16} className="label-icon" />
                  Conductor (Opcional)
                </label>
                <select
                  value={formulario.conductor_id}
                  onChange={(e) =>
                    manejarCambio("conductor_id", e.target.value)
                  }
                  className="modal-abono-select"
                  disabled={guardando}
                >
                  <option value="">-- Sin conductor --</option>
                  {conductoresFiltrados.map((conductor) => (
                    <option key={conductor.id} value={conductor.id}>
                      {conductor.nombre_conductor}{" "}
                      {conductor.apellido_paterno_conductor}{" "}
                      {conductor.apellido_materno_conductor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">
                  <Car size={16} className="label-icon" />
                  Vehículo (Opcional)
                </label>
                <select
                  value={formulario.vehiculo_id}
                  onChange={(e) => manejarCambio("vehiculo_id", e.target.value)}
                  className="modal-abono-select"
                  disabled={guardando}
                >
                  <option value="">-- Sin vehículo --</option>
                  {vehiculosFiltrados.map((vehiculo) => (
                    <option key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.nombre} - {vehiculo.numero_placa} (
                      {vehiculo.marca} {vehiculo.modelo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">
                  <Users size={16} className="label-icon" />
                  Coordinador (Opcional)
                </label>
                <select
                  value={formulario.coordinador_id}
                  onChange={(e) =>
                    manejarCambio("coordinador_id", e.target.value)
                  }
                  className="modal-abono-select"
                  disabled={guardando}
                >
                  <option value="">-- Sin coordinador --</option>
                  {coordinadoresDisponibles.map((coord) => (
                    <option key={coord.id} value={coord.id}>
                      {coord.nombre} {coord.apellido_paterno}{" "}
                      {coord.apellido_materno}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">
                  <User size={16} className="label-icon" />
                  Guía Turístico (Opcional)
                </label>
                <select
                  value={formulario.guia_id}
                  onChange={(e) => manejarCambio("guia_id", e.target.value)}
                  className="modal-abono-select"
                  disabled={guardando}
                >
                  <option value="">-- Sin guía --</option>
                  {guiasDisponibles.map((guia) => (
                    <option key={guia.id} value={guia.id}>
                      {guia.nombre} {guia.apellido_paterno}{" "}
                      {guia.apellido_materno}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {seccionActiva === "contrato" && (
            <div className="modal-abono-seccion">
              <div className="modal-abono-campo-grupo">
                <div className="modal-abono-campo">
                  <label className="modal-abono-label">Tipo de Pasaje *</label>
                  <select
                    value={formulario.tipo_pasaje}
                    onChange={(e) =>
                      manejarCambio("tipo_pasaje", e.target.value)
                    }
                    className="modal-abono-select"
                    disabled={guardando}
                  >
                    <option value="Turismo Estatal">Turismo Estatal</option>
                    <option value="Turismo Internacional">
                      Turismo Internacional
                    </option>
                    <option value="Nacional">Nacional</option>
                    <option value="Escolar">Escolar</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">
                  N° Unidades Contratadas *
                </label>
                <input
                  type="number"
                  value={formulario.n_unidades_contratadas}
                  onChange={(e) =>
                    manejarCambio("n_unidades_contratadas", e.target.value)
                  }
                  className={`modal-abono-input ${errores.n_unidades_contratadas ? "error" : ""
                    }`}
                  disabled={guardando}
                  min="1"
                />
                {errores.n_unidades_contratadas && (
                  <p className="modal-abono-error">
                    <AlertCircle size={12} /> {errores.n_unidades_contratadas}
                  </p>
                )}
              </div>
            </div>
          )}

          {seccionActiva === "reserva" && (
            <div className="modal-abono-seccion">
              <div className="modal-abono-campo-grupo">
                <div className="modal-abono-campo">
                  <label className="modal-abono-label">
                    Folio Reserva (Auto) *
                  </label>
                  <input
                    type="text"
                    value={formulario.folio_reserva}
                    className={`modal-abono-input input-disabled ${errores.folio_reserva ? "error" : ""
                      }`}
                    disabled={true}
                  />
                  {errores.folio_reserva && (
                    <p className="modal-abono-error">
                      <AlertCircle size={12} /> {errores.folio_reserva}
                    </p>
                  )}
                </div>

                <div className="modal-abono-campo">
                  <label className="modal-abono-label">Fecha Reserva *</label>
                  <input
                    type="date"
                    value={formulario.fecha_reserva}
                    onChange={(e) =>
                      manejarCambio("fecha_reserva", e.target.value)
                    }
                    className={`modal-abono-input ${errores.fecha_reserva ? "error" : ""
                      }`}
                    disabled={guardando}
                  />
                  {errores.fecha_reserva && (
                    <p className="modal-abono-error">
                      <AlertCircle size={12} /> {errores.fecha_reserva}
                    </p>
                  )}
                </div>
              </div>

              <div className="modal-abono-campo-grupo">
                <div className="modal-abono-campo">
                  <label className="modal-abono-label">N° Habitantes *</label>
                  <input
                    type="number"
                    value={formulario.num_habitantes}
                    onChange={(e) =>
                      manejarCambio("num_habitantes", e.target.value)
                    }
                    className={`modal-abono-input ${errores.num_habitantes ? "error" : ""
                      }`}
                    disabled={guardando}
                    min="1"
                  />
                  {errores.num_habitantes && (
                    <p className="modal-abono-error">
                      <AlertCircle size={12} /> {errores.num_habitantes}
                    </p>
                  )}
                </div>

                <div className="modal-abono-campo">
                  <label className="modal-abono-label">Forma de Pago *</label>
                  <select
                    value={formulario.forma_pago}
                    onChange={(e) =>
                      manejarCambio("forma_pago", e.target.value)
                    }
                    className="modal-abono-select"
                    disabled={guardando}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">
                  Descripción del Servicio *
                </label>
                <textarea
                  value={formulario.servicio}
                  onChange={(e) => manejarCambio("servicio", e.target.value)}
                  rows={3}
                  className={`modal-abono-textarea ${errores.servicio ? "error" : ""
                    }`}
                  disabled={guardando}
                  placeholder="Describe el servicio..."
                />
                {errores.servicio && (
                  <p className="modal-abono-error">
                    <AlertCircle size={12} /> {errores.servicio}
                  </p>
                )}
              </div>

              <div className="modal-abono-campo">
                <label className="modal-abono-label">Estado de Pago *</label>
                <select
                  value={formulario.pagado}
                  onChange={(e) => manejarCambio("pagado", e.target.value)}
                  className="modal-abono-select"
                  disabled={guardando}
                >
                  <option value="no pagado">No Pagado</option>
                  <option value="pagado">Pagado</option>
                </select>
              </div>
            </div>
          )}
        </form>

        <div className="modal-abono-footer">
          <button
            type="button"
            onClick={alCerrar}
            className="modal-abono-boton-cancelar"
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={manejarEnviar}
            className="modal-abono-boton-guardar"
            disabled={guardando || cargandoFolios}
          >
            {guardando ? (
              <>
                <div className="spinner-crear-todos" />
                <span>Creando...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Crear Todo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCrearTodosDesdePago;
