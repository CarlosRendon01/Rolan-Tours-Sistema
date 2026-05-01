import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../Cotizador/Componentes/NuevaCotizacion.css";
import { API_CONFIG } from "../../../../config/api";
import AutocompleteInput from "../../Cotizador/Componentes/AutocompleteImput";

const STOP_VACIO = {
  destino: "",
  fecha_salida: "",
  hora_salida: "",
  tipo_camino: "pavimento",
};

const ModalCrearCotizacion = ({ estaAbierto, cliente, alCerrar }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [modoViaje, setModoViaje] = useState("simple"); // "simple" | "itinerario"
  const [desglose, setDesglose] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  const [opcionesExtras, setOpcionesExtras] = useState({
    transporte: [],
    restaurante: [],
    tour: [],
    hospedaje: [],
  });

  const generarFolioAutomatico = useCallback(() => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    return `${año}${mes}${dia}${timestamp}`;
  }, []);

  const limpiarErrorCampo = useCallback((campo) => {
    setErroresCampos((prev) => {
      const n = { ...prev };
      delete n[campo];
      return n;
    });
  }, []);

  const formDataInicial = useCallback(() => {
    const usuario = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      folio: generarFolioAutomatico(),
      fecha_salida: "",
      fecha_regreso: "",
      hora_salida: "08:00",
      hora_regreso: "18:00",
      numero_dias: "",
      total_kilometros: "",
      costo_casetas: "",
      tipo_camino: "terraceria",
      id: "",
      lead_id: "",
      nombre_responsable: usuario.nombre || "",
      tipo_servicio: "Transporte",
      num_pasajeros: 1,
      origen: "Oaxaca de Juarez, Oaxaca",
      punto_intermedio: "",
      destino: "",
      fecha: new Date().toISOString().split("T")[0],
      tipo_cliente: "tipo_1",          // ← corregido: valor válido para el backend
      descripcion: "",
      cliente_id: cliente?.id || null,
      transporte: "",
      restaurante: "",
      tour: "",
      hospedaje: "",
      servicios: [],
      total: "",
      totalLetra: "",
      lista: [],
      stops: [{ ...STOP_VACIO }],
    };
  }, [generarFolioAutomatico, cliente]);

  const [formData, setFormData] = useState(formDataInicial);

  // ── Cargar Google Maps ─────────────────────────────────────────────────────
  useEffect(() => {
    if (window.google?.maps) {
      setIsMapsLoaded(true);
      return;
    }
    const apiKey = API_CONFIG.GOOGLE_MAPS_API_KEY;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsMapsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // ── Cargar servicios extras ────────────────────────────────────────────────
  useEffect(() => {
    if (!estaAbierto) return;
    const fetchServicios = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
        const [transporte, restaurante, tour, hospedaje] = await Promise.all([
          axios.get(`${API_CONFIG.BASE_URL}/transportes`, { headers }),
          axios.get(`${API_CONFIG.BASE_URL}/restaurantes`, { headers }),
          axios.get(`${API_CONFIG.BASE_URL}/tours`, { headers }),
          axios.get(`${API_CONFIG.BASE_URL}/hospedajes`, { headers }),
        ]);
        setOpcionesExtras({
          transporte: transporte.data.map((s) => ({ id: s.id, tipo: "transporte", nombre: s.nombre_servicio, precio: s.precio_base, proveedor: s.proveedor?.nombre_razon_social || "Sin proveedor" })),
          restaurante: restaurante.data.map((s) => ({ id: s.id, tipo: "restaurante", nombre: s.nombre_servicio, precio: s.precio_base, proveedor: s.proveedor?.nombre_razon_social || "Sin proveedor" })),
          tour: tour.data.map((s) => ({ id: s.id, tipo: "tour", nombre: s.nombre_tour, precio: s.precio_base, proveedor: s.proveedor?.nombre_razon_social || "Sin proveedor" })),
          hospedaje: hospedaje.data.map((s) => ({ id: s.id, tipo: "hospedaje", nombre: s.nombre_servicio, precio: s.precio_base, proveedor: s.proveedor?.nombre_razon_social || "Sin proveedor" })),
        });
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };
    fetchServicios();
  }, [estaAbierto]);

  // ── Sincronizar cliente ────────────────────────────────────────────────────
  useEffect(() => {
    if (!estaAbierto) return;
    setFormData(formDataInicial());
    setModoViaje("simple");
    setDesglose(null);
    setLeadSeleccionado(null);
    setErroresCampos({});
  }, [estaAbierto, formDataInicial]);

  // ── Handlers de input ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    limpiarErrorCampo(name);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler para AutocompleteInput — recibe (fieldName, value)
  const handlePlaceChange = useCallback(
    (fieldName, value) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
      limpiarErrorCampo(fieldName);
    },
    [limpiarErrorCampo]
  );

  // ── Lead ───────────────────────────────────────────────────────────────────
  const handleLeadChange = (e) => {
    const leadId = e.target.value;
    setFormData((prev) => ({ ...prev, lead_id: leadId }));
    const lead = cliente?.leads?.find((l) => l.id.toString() === leadId);
    if (lead) {
      setLeadSeleccionado(lead);
      // Mapear tipo_cliente del lead al formato válido del backend
      const tipoClienteMap = { "2*": "tipo_2", "3*": "tipo_3", "4*": "tipo_4" };
      setFormData((prev) => ({
        ...prev,
        lead_id: leadId,
        num_pasajeros: lead.pax || 1,
        tipo_servicio: lead.tipo_servicio || "Transporte",
        destino: lead.destino_servicio || "",
        origen: lead.origen_servicio || prev.origen,
        tipo_cliente: tipoClienteMap[lead.tipo_cliente] || "tipo_1",
      }));
    } else {
      setLeadSeleccionado(null);
    }
  };

  // ── Stops (itinerario) ─────────────────────────────────────────────────────
  const agregarStop = () =>
    setFormData((prev) => ({ ...prev, stops: [...prev.stops, { ...STOP_VACIO }] }));

  const eliminarStop = (index) =>
    setFormData((prev) => ({ ...prev, stops: prev.stops.filter((_, i) => i !== index) }));

  const handleStopChange = (index, field, value) => {
    setFormData((prev) => {
      const nuevos = [...prev.stops];
      nuevos[index] = { ...nuevos[index], [field]: value };
      return { ...prev, stops: nuevos };
    });
    limpiarErrorCampo(`stop_${field}_${index}`);
  };

  const handleStopPlaceChange = useCallback((name, value) => {
    const partes = name.split("_");
    const index = parseInt(partes[partes.length - 1]);
    handleStopChange(index, "destino", value);
  }, []);

  // ── Servicios extras ───────────────────────────────────────────────────────
  const handleServicioChange = (e) => {
    const { name, value } = e.target;
    if (!value) return;
    const selected = opcionesExtras[name].find((s) => s.id === parseInt(value));
    if (!selected) return;
    setFormData((prev) => {
      if (prev.servicios.find((s) => s.id === selected.id)) return prev;
      const nuevos = [...prev.servicios, selected];
      return { ...prev, servicios: nuevos, total: nuevos.reduce((a, s) => a + parseFloat(s.precio), 0).toFixed(2), [name]: "" };
    });
    e.target.value = "";
  };

  const handleEliminarServicio = (id) => {
    setFormData((prev) => {
      const nuevos = prev.servicios.filter((s) => s.id !== id);
      return { ...prev, servicios: nuevos, total: nuevos.reduce((a, s) => a + parseFloat(s.precio), 0).toFixed(2) };
    });
  };

  // ── Ajuste desglose (igual que NuevaCotizacion) ────────────────────────────
  const handleAjusteDesglose = (field, value) => {
    if (!desglose) return;
    const numVal = value === "" ? 0 : parseFloat(value);
    const costoCasetas = field === "costo_casetas" ? numVal : (desglose.ajustes?.costo_casetas ?? 0);
    const costoExtra = field === "costo_extra" ? numVal : (desglose.ajustes?.costo_extra ?? 0);
    const subtotal = desglose.costoRenta + desglose.costoCombustible + desglose.costoDesgaste + desglose.costoChofer + costoCasetas + costoExtra;
    const iva = subtotal * 0.16;
    const totalConIva = subtotal + iva;
    setDesglose((prev) => ({
      ...prev,
      ajustes: { ...prev.ajustes, [field]: numVal, subtotal: parseFloat(subtotal.toFixed(2)), iva: parseFloat(iva.toFixed(2)), total: parseFloat(totalConIva.toFixed(2)) },
    }));
    setFormData((prev) => ({ ...prev, total: totalConIva.toFixed(2) }));
  };

  // ── Validación ─────────────────────────────────────────────────────────────
  const validar = () => {
    const errores = {};
    if (!formData.num_pasajeros || formData.num_pasajeros < 1)
      errores.num_pasajeros = "N° pasajeros es obligatorio";

    if (modoViaje === "simple") {
      if (!formData.destino?.trim()) errores.destino = "Destino es obligatorio";
    } else {
      formData.stops.forEach((stop, i) => {
        if (!stop.destino?.trim()) errores[`stop_destino_${i}`] = `Destino ${i + 1} es obligatorio`;
        if (!stop.fecha_salida) errores[`stop_fecha_${i}`] = `Fecha ${i + 1} es obligatoria`;
      });
    }

    if (!formData.fecha_salida) errores.fecha_salida = "Fecha de salida es obligatoria";
    if (!formData.hora_salida) errores.hora_salida = "Hora de salida es obligatoria";

    if (modoViaje === "simple" && formData.fecha_regreso && formData.fecha_salida) {
      const fs = new Date(formData.fecha_salida + "T00:00:00");
      const fr = new Date(formData.fecha_regreso + "T00:00:00");
      if (fr < fs) errores.fecha_regreso = "La fecha de regreso no puede ser anterior a la salida";
    }

    setErroresCampos(errores);
    return Object.keys(errores).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({ icon: "error", title: "Sesión expirada", text: "Por favor inicia sesión nuevamente" });
        navigate("/");
        return;
      }

      const payload = {
        ...formData,
        modo: modoViaje,
        servicios: formData.servicios.map((s) => s.id),
        stops: modoViaje === "itinerario" ? formData.stops : null,  // ← null en lugar de undefined
      };

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/cotizaciones`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      // Mostrar desglose si el backend lo devuelve
      if (response.data?.desglose) {
        const d = response.data.desglose;
        const veh = d.vehiculo_recomendado?.costos ?? {};
        setDesglose({
          vehiculoNombre: d.vehiculo_recomendado?.nombre ?? "",
          kilometros: d.kilometros?.total ?? 0,
          dias: d.dias ?? 1,
          costoRenta: veh.renta_ajustada ?? 0,
          costoCombustible: veh.combustible ?? 0,
          costoDesgaste: veh.desgaste ?? 0,
          costoChofer: veh.chofer ?? 0,
          ajustes: {
            costo_casetas: veh.casetas ?? 0,
            costo_extra: 0,
            subtotal: veh.subtotal ?? 0,
            iva: veh.iva ?? 0,
            total: veh.total_con_iva ?? 0,
          },
        });
        setFormData((prev) => ({
          ...prev,
          total: veh.total_con_iva?.toFixed(2) ?? prev.total,
          total_kilometros: d.kilometros?.total ?? prev.total_kilometros,
          costo_casetas: veh.casetas ?? prev.costo_casetas,
        }));
        setLoading(false);
        return; // Se queda abierto mostrando el desglose
      }

      await Swal.fire({ icon: "success", title: "¡Éxito!", text: "Cotización creada exitosamente", confirmButtonColor: "#10b981", confirmButtonText: "Aceptar" });
      alCerrar();
      navigate("/cotizaciones", { replace: true });
    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire({ icon: "error", title: "Sesión expirada", text: "Por favor inicia sesión nuevamente" });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rol");
        navigate("/");
        return;
      }
      Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.message || "Error al crear cotización", confirmButtonColor: "#ef4444" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async () => {
    await Swal.fire({ icon: "success", title: "¡Éxito!", text: "Cotización creada exitosamente", confirmButtonColor: "#10b981", confirmButtonText: "Aceptar" });
    alCerrar();
    navigate("/cotizaciones", { replace: true });
  };

  // ── Componente error inline ────────────────────────────────────────────────
  const MensajeError = ({ campo }) => {
    const msg = erroresCampos[campo];
    if (!msg) return null;
    return <div className="mensaje-error"><span className="icono-error">!</span>{msg}</div>;
  };

  if (!estaAbierto) return null;

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="header-formulario">
          <h2>Crear Cotización — {cliente?.nombre}</h2>
        </div>

        <form className="formulario-cotizacion" onSubmit={handleSubmit}>
          <div className="paso-contenido">

            {/* ── Lead asociado ── */}
            {cliente?.leads?.length > 0 && (
              <label>Lead asociado (opcional)
                <select name="lead_id" value={formData.lead_id} onChange={handleLeadChange}>
                  <option value="">Sin lead asociado</option>
                  {cliente.leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.nombre} — Pipeline: {lead.pipeline_id} — {lead.estado_lead}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {/* ── Info lead seleccionado ── */}
            {leadSeleccionado && (
              <div style={{ background: "var(--color-background-success, #f0fdf4)", border: "1px solid #86efac", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
                <strong>📋 Lead: {leadSeleccionado.nombre}</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                  Pipeline: {leadSeleccionado.pipeline_id} · Etapa: {leadSeleccionado.etapa_id} · Estado: {leadSeleccionado.estado_lead}
                  {leadSeleccionado.precio ? ` · Precio est.: $${leadSeleccionado.precio.toLocaleString()}` : ""}
                </p>
              </div>
            )}

            {/* ── Responsable ── */}
            <label>Nombre responsable <span className="required">*</span>
              <input type="text" name="nombre_responsable" value={formData.nombre_responsable} onChange={handleChange} readOnly />
            </label>

            {/* ── Pasajeros y tipo servicio ── */}
            <div className="fila">
              <label>N° pasajeros <span className="required">*</span>
                <input type="number" name="num_pasajeros" value={formData.num_pasajeros} min="1" onChange={handleChange} className={erroresCampos.num_pasajeros ? "campo-error" : ""} />
                <MensajeError campo="num_pasajeros" />
              </label>
              <label>Tipo de servicio <span className="required">*</span>
                <input type="text" name="tipo_servicio" value={formData.tipo_servicio} onChange={handleChange} placeholder="Ej: Transporte, Tour, Traslado" />
              </label>
            </div>

            {/* ── Toggle modo viaje ── */}
            <div className="modo-viaje-toggle">
              <button
                type="button"
                className={`btn-modo ${modoViaje === "simple" ? "active" : ""}`}
                onClick={() => { setModoViaje("simple"); setErroresCampos({}); }}
              >
                Viaje Simple
              </button>
              <button
                type="button"
                className={`btn-modo ${modoViaje === "itinerario" ? "active" : ""}`}
                onClick={() => { setModoViaje("itinerario"); setErroresCampos({}); }}
              >
                Itinerario Múltiple
              </button>
            </div>

            {/* ── Rutas ── */}
            <label>Origen
              <AutocompleteInput
                name="origen"
                value={formData.origen}
                onChange={handlePlaceChange}
                placeholder="Busca un lugar..."
                isLoaded={isMapsLoaded}
              />
            </label>

            {modoViaje === "simple" ? (
              <>
                <label>Punto intermedio (opcional)
                  <AutocompleteInput
                    name="punto_intermedio"
                    value={formData.punto_intermedio}
                    onChange={handlePlaceChange}
                    placeholder="Busca un lugar..."
                    isLoaded={isMapsLoaded}
                  />
                </label>
                <label>Destino <span className="required">*</span>
                  <AutocompleteInput
                    name="destino"
                    value={formData.destino}
                    onChange={handlePlaceChange}
                    placeholder="Busca un lugar..."
                    isLoaded={isMapsLoaded}
                    className={erroresCampos.destino ? "campo-error" : ""}
                  />
                  <MensajeError campo="destino" />
                </label>
              </>
            ) : (
              <>
                <div className="stops-container">
                  {formData.stops.map((stop, index) => (
                    <div key={index} className="stop-item">
                      <div className="stop-header">
                        <span className="stop-numero">Parada {index + 1}</span>
                        {formData.stops.length > 1 && (
                          <button type="button" className="btn-eliminar-stop" onClick={() => eliminarStop(index)}>❌</button>
                        )}
                      </div>
                      <label>Destino {index + 1} <span className="required">*</span>
                        <AutocompleteInput
                          name={`stop_destino_${index}`}
                          value={stop.destino}
                          onChange={handleStopPlaceChange}
                          placeholder="Busca un lugar..."
                          isLoaded={isMapsLoaded}
                          className={erroresCampos[`stop_destino_${index}`] ? "campo-error" : ""}
                        />
                        <MensajeError campo={`stop_destino_${index}`} />
                      </label>
                      <div className="fila">
                        <label>Fecha salida <span className="required">*</span>
                          <input
                            type="date"
                            value={stop.fecha_salida}
                            onChange={(e) => handleStopChange(index, "fecha_salida", e.target.value)}
                            className={erroresCampos[`stop_fecha_${index}`] ? "campo-error" : ""}
                          />
                          <MensajeError campo={`stop_fecha_${index}`} />
                        </label>
                        <label>Hora salida
                          <input type="time" value={stop.hora_salida} onChange={(e) => handleStopChange(index, "hora_salida", e.target.value)} />
                        </label>
                      </div>
                      <label>Tipo de camino
                        <select value={stop.tipo_camino} onChange={(e) => handleStopChange(index, "tipo_camino", e.target.value)}>
                          <option value="pavimento">Pavimento (Pista)</option>
                          <option value="revestido">Revestido</option>
                          <option value="ciudad">Ciudad</option>
                          <option value="terraceria">Terracería</option>
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-agregar-stop" onClick={agregarStop}>+ Agregar parada</button>
              </>
            )}

            {/* ── Fechas y horas ── */}
            <div className="fila">
              <label>Fecha salida <span className="required">*</span>
                <input
                  type="date"
                  name="fecha_salida"
                  value={formData.fecha_salida}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={erroresCampos.fecha_salida ? "campo-error" : ""}
                />
                <MensajeError campo="fecha_salida" />
              </label>
              <label>Hora salida <span className="required">*</span>
                <input type="time" name="hora_salida" value={formData.hora_salida} onChange={handleChange} className={erroresCampos.hora_salida ? "campo-error" : ""} />
                <MensajeError campo="hora_salida" />
              </label>
              <label>Días (opcional):
                <input
                  type="number"
                  name="numero_dias"
                  value={formData.numero_dias}
                  onChange={handleChange}
                  min="1"
                  placeholder="Auto"
                />
              </label>
            </div>

            {modoViaje === "simple" && (
              <div className="fila">
                <label>Fecha regreso (opcional)
                  <input
                    type="date"
                    name="fecha_regreso"
                    value={formData.fecha_regreso}
                    onChange={handleChange}
                    min={formData.fecha_salida || new Date().toISOString().split("T")[0]}
                    className={erroresCampos.fecha_regreso ? "campo-error" : ""}
                  />
                  <MensajeError campo="fecha_regreso" />
                </label>
                <label>Hora regreso
                  <input type="time" name="hora_regreso" value={formData.hora_regreso} onChange={handleChange} />
                </label>
              </div>
            )}

            {/* ── Tipo camino y tipo cliente ── */}
            <div className="fila">
              <label>Tipo de camino <span className="required">*</span>
                <select name="tipo_camino" value={formData.tipo_camino} onChange={handleChange}>
                  <option value="pavimento">Pavimento (Pista)</option>
                  <option value="revestido">Revestido</option>
                  <option value="ciudad">Ciudad</option>
                  <option value="terraceria">Terracería</option>
                </select>
              </label>
              <label>Tipo de cliente <span className="required">*</span>
                <select name="tipo_cliente" value={formData.tipo_cliente} onChange={handleChange}>
                  <option value="tipo_1">Tipo 1 — Sin descuento</option>
                  <option value="tipo_2">Tipo 2 — 10% descuento</option>
                  <option value="tipo_3">Tipo 3 — 20% descuento</option>
                  <option value="tipo_4">Tipo 4 — 30% descuento</option>
                </select>
              </label>
            </div>

            {/* ── Descripción ── */}
            <label>Descripción / Notas (opcional)
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" placeholder="Detalles adicionales, requerimientos especiales..." />
            </label>

            {/* ── Desglose (aparece tras el primer submit) ── */}
            {desglose && (
              <div className="desglose-container">
                <h4>Desglose de Costos</h4>
                <p className="desglose-vehiculo">Vehículo recomendado: <strong>{desglose.vehiculoNombre}</strong></p>
                <p className="desglose-info">Kilómetros: {desglose.kilometros} km · Días: {desglose.dias}</p>
                <div className="desglose-items">
                  <div className="desglose-item"><span>Renta de unidad</span><span>${desglose.costoRenta?.toFixed(2)}</span></div>
                  <div className="desglose-item"><span>Combustible</span><span>${desglose.costoCombustible?.toFixed(2)}</span></div>
                  <div className="desglose-item"><span>Desgaste de unidad</span><span>${desglose.costoDesgaste?.toFixed(2)}</span></div>
                  <div className="desglose-item"><span>Viáticos operador</span><span>${desglose.costoChofer?.toFixed(2)}</span></div>
                  <div className="desglose-item"><span>Casetas</span><span>${(desglose.ajustes?.costo_casetas ?? 0).toFixed(2)}</span></div>
                </div>
                <div className="desglose-ajustes">
                  <label>Costo casetas (ajuste manual):
                    <input type="number" min="0" step="0.01" value={desglose.ajustes?.costo_casetas ?? ""} onChange={(e) => handleAjusteDesglose("costo_casetas", e.target.value)} />
                  </label>
                  <label>Costo extra:
                    <input type="number" min="0" step="0.01" value={desglose.ajustes?.costo_extra ?? ""} onChange={(e) => handleAjusteDesglose("costo_extra", e.target.value)} />
                  </label>
                </div>
                <div className="desglose-totales">
                  <div className="desglose-item"><span>Subtotal</span><span>${desglose.ajustes?.subtotal?.toFixed(2)}</span></div>
                  <div className="desglose-item"><span>IVA (16%)</span><span>${desglose.ajustes?.iva?.toFixed(2)}</span></div>
                  <div className="desglose-item total"><span>Total</span><span>${desglose.ajustes?.total?.toFixed(2)}</span></div>
                </div>
              </div>
            )}

            {/* ── Extras ── */}
            <div className="extras-grid">
              {["transporte", "restaurante", "tour", "hospedaje"].map((tipo) => (
                <label key={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}:
                  <select name={tipo} value={formData[tipo]} onChange={handleServicioChange}>
                    <option value="">Seleccionar...</option>
                    {opcionesExtras[tipo].map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre} - ${s.precio} - ({s.proveedor})</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            {formData.servicios.length > 0 && (
              <div className="extras-seleccionados">
                <h4>Extras:</h4>
                <div className="extras-lista">
                  {formData.servicios.map((s) => (
                    <div key={s.id} className="extra-item">
                      <span className="extra-tipo">{s.tipo}:</span>
                      <span className="extra-valor">{s.nombre}</span>
                      <span className="extra-proveedor">({s.proveedor})</span>
                      <span className="extra-costo">${s.precio}</span>
                      <button type="button" className="btn-eliminar-extra" onClick={() => handleEliminarServicio(s.id)}>❌</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Total ── */}
            <div className="total-container">
              <label>Total:
                <input type="number" name="total" value={formData.total} onChange={handleChange} step="0.01" min="0" placeholder="0.00" />
              </label>
              <label>Total en letra: (opcional)
                <textarea name="totalLetra" value={formData.totalLetra} onChange={handleChange} />
              </label>
            </div>

          </div>

          {/* ── Botones ── */}
          <div className="botones-navegacion">
            <button type="button" onClick={alCerrar} className="btn-cancelar" disabled={loading}>Cancelar</button>
            <div className="botones-derecha">
              {desglose ? (
                <button type="button" className="btn-guardar" onClick={handleConfirmar}>Confirmar cotización</button>
              ) : (
                <button type="submit" className="btn-guardar" disabled={loading}>
                  {loading ? "Calculando..." : "Calcular y Crear"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearCotizacion;