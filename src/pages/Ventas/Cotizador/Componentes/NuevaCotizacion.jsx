import React, { useState, useEffect, useCallback, useRef } from "react";
import "./NuevaCotizacion.css";
import axios from "axios";
import { API_CONFIG } from "../../../../config/api";
import AutocompleteInput from "./AutocompleteImput";

const STOP_VACIO = {
  destino: "",
  fecha_salida: "",
  hora_salida: "",
  tipo_camino: "pavimento",
};

const NuevaCotizacion = ({
  onGuardarCotizacion,
  cotizacionEditar,
  onCancelarEdicion,
  mostrarBoton = true,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [erroresCampos, setErroresCampos] = useState({});
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [modoViaje, setModoViaje] = useState("simple"); // "simple" | "itinerario"
  const [desglose, setDesglose] = useState(null); // respuesta del backend

  const [formData, setFormData] = useState({
    folio: "",
    fecha_salida: "",
    fecha_regreso: "",
    hora_salida: "",
    hora_regreso: "",
    numero_dias: "",
    total_kilometros: "",
    costo_casetas: "",
    tipo_camino: "terraceria",
    id: "",
    lead_id: "",
    nombre_responsable: "",
    tipo_servicio: "",
    num_pasajeros: "",
    origen: "Oaxaca de Juarez, Oaxaca",
    punto_intermedio: "",
    destino: "",
    fecha: new Date().toISOString().split("T")[0],
    tipo_cliente: "tipo_1",
    descripcion: "",
    transporte: "",
    restaurante: "",
    tour: "",
    hospedaje: "",
    servicios: [],
    total: "",
    totalLetra: "",
    lista: [],
    stops: [{ ...STOP_VACIO }], // para modo itinerario
  });

  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  const [opcionesExtras, setOpcionesExtras] = useState({
    transporte: [],
    restaurante: [],
    tour: [],
    hospedaje: [],
  });

  // ── Cargar Google Maps API ──────────────────────────────────────
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

  // ── Scroll lock ─────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mostrarModal ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [mostrarModal]);

  // ── Cargar servicios extras ─────────────────────────────────────
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const token = localStorage.getItem("token");
        const [transporte, restaurante, tour, hospedaje] = await Promise.all([
          axios.get(`${API_CONFIG.BASE_URL}/transportes`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_CONFIG.BASE_URL}/restaurantes`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_CONFIG.BASE_URL}/tours`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_CONFIG.BASE_URL}/hospedajes`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setOpcionesExtras({
          transporte: transporte.data.map((s) => ({
            id: s.id, tipo: "transporte",
            nombre: s.nombre_servicio, precio: s.precio_base,
            proveedor: s.proveedor?.nombre_razon_social || "Sin proveedor",
          })),
          restaurante: restaurante.data.map((s) => ({
            id: s.id, tipo: "restaurante",
            nombre: s.nombre_servicio, precio: s.precio_base,
            proveedor: s.proveedor?.nombre_razon_social || "Sin proveedor",
          })),
          tour: tour.data.map((s) => ({
            id: s.id, tipo: "tour",
            nombre: s.nombre_tour, precio: s.precio_base,
            proveedor: s.proveedor?.nombre_razon_social || "Sin proveedor",
          })),
          hospedaje: hospedaje.data.map((s) => ({
            id: s.id, tipo: "hospedaje",
            nombre: s.nombre_servicio, precio: s.precio_base,
            proveedor: s.proveedor?.nombre_razon_social || "Sin proveedor",
          })),
        });
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };
    fetchServicios();
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────
  const generarFolioAutomatico = useCallback(() => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    return `${año}${mes}${dia}${timestamp}`;
  }, []);

  const generarIdCliente = useCallback(() => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    return `CLI-${año}${mes}${dia}-${timestamp}`;
  }, []);

  const formatearTelefono = useCallback((valor) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 10);
    let f = numeros.slice(0, 3);
    if (numeros.length >= 4) f += "-" + numeros.slice(3, 6);
    if (numeros.length >= 7) f += "-" + numeros.slice(6, 8);
    if (numeros.length >= 9) f += "-" + numeros.slice(8, 10);
    return f;
  }, []);

  const validarTelefono = (telefono) => telefono.replace(/\D/g, "").length === 10;

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErroresCampos((prev) => {
      const nuevos = { ...prev };
      delete nuevos[nombreCampo];
      return nuevos;
    });
  }, []);

  const limpiarTodosErrores = useCallback(() => setErroresCampos({}), []);

  // ── Validación por paso ─────────────────────────────────────────
  const validarPaso = useCallback(
    (paso) => {
      const errores = {};

      if (paso === 1) {
        if (!formData.nombre_responsable?.trim())
          errores.nombre_responsable = "Nombre Responsable es obligatorio";
      }

      if (paso === 2) {
        if (!datosCliente.nombre?.trim())
          errores.nombre = "Nombre es obligatorio";
        if (!datosCliente.email?.trim()) {
          errores.email = "Email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosCliente.email)) {
          errores.email = "Email inválido";
        }
        if (!datosCliente.telefono?.trim()) {
          errores.telefono = "Teléfono es obligatorio";
        } else if (!validarTelefono(datosCliente.telefono)) {
          errores.telefono = "El teléfono debe tener 10 dígitos";
        }
      }

      if (paso === 3) {
        if (!formData.num_pasajeros) errores.num_pasajeros = "N° pasajeros es obligatorio";

        if (modoViaje === "simple") {
          if (!formData.destino?.trim()) errores.destino = "Destino Servicio es obligatorio";
        } else {
          // itinerario: validar cada stop
          formData.stops.forEach((stop, i) => {
            if (!stop.destino?.trim())
              errores[`stop_destino_${i}`] = `Destino ${i + 1} es obligatorio`;
            if (!stop.fecha_salida)
              errores[`stop_fecha_${i}`] = `Fecha de salida ${i + 1} es obligatoria`;
          });
        }
      }

      if (paso === 4) {
        if (!formData.fecha_salida) {
          errores.fecha_salida = "Fecha Salida es obligatoria";
        } else {
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          const fechaSel = new Date(formData.fecha_salida + "T00:00:00");
          if (fechaSel < hoy) errores.fecha_salida = "La fecha de salida debe ser mayor o igual a hoy";
        }
        if (!formData.hora_salida) errores.hora_salida = "Hora Salida es obligatoria";

        if (modoViaje === "simple") {
          if (!formData.fecha_regreso) {
            errores.fecha_regreso = "Fecha Regreso es obligatoria";
          } else {
            const fs = new Date(formData.fecha_salida + "T00:00:00");
            const fr = new Date(formData.fecha_regreso + "T00:00:00");
            if (fr < fs)
              errores.fecha_regreso = "La fecha de regreso no puede ser anterior a la salida";
          }
          if (!formData.hora_regreso) errores.hora_regreso = "Hora Regreso es obligatoria";
        }
      }

      return errores;
    },
    [formData, datosCliente, modoViaje]
  );

  const validarTodosLosPasos = () => {
    for (let paso = 1; paso <= 5; paso++) {
      const errores = validarPaso(paso);
      if (Object.keys(errores).length > 0) {
        setErroresCampos(errores);
        setPasoActual(paso);
        setTimeout(() => {
          const primer = Object.keys(errores)[0];
          const el = document.querySelector(`[name="${primer}"]`);
          if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
        }, 100);
        return { valido: false, paso, errores };
      }
    }
    return { valido: true };
  };

  // ── Navegación ──────────────────────────────────────────────────
  const siguientePaso = useCallback(() => {
    const errores = validarPaso(pasoActual);
    if (Object.keys(errores).length > 0) {
      setErroresCampos(errores);
      return;
    }
    if (pasoActual < 5) setPasoActual(pasoActual + 1);
  }, [pasoActual, validarPaso]);

  const pasoAnterior = useCallback(() => {
    limpiarTodosErrores();
    if (pasoActual > 1) setPasoActual(pasoActual - 1);
  }, [pasoActual, limpiarTodosErrores]);

  // ── Handlers de input ───────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (erroresCampos[name] && value.trim() !== "") limpiarErrorCampo(name);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClienteInputChange = (e) => {
    const { name, value } = e.target;
    const valorFinal = name === "telefono" ? formatearTelefono(value) : value;
    if (erroresCampos[name] && valorFinal.trim() !== "") limpiarErrorCampo(name);
    setDatosCliente((prev) => ({ ...prev, [name]: valorFinal }));
  };

  // Handler para AutocompleteInput — recibe (fieldName, value)
  const handlePlaceChange = useCallback(
    (fieldName, value) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
      limpiarErrorCampo(fieldName);
    },
    [limpiarErrorCampo]
  );

  // ── Stops (itinerario) ──────────────────────────────────────────
  const agregarStop = () => {
    setFormData((prev) => ({
      ...prev,
      stops: [...prev.stops, { ...STOP_VACIO }],
    }));
  };

  const eliminarStop = (index) => {
    setFormData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  const handleStopChange = (index, field, value) => {
    setFormData((prev) => {
      const nuevosStops = [...prev.stops];
      nuevosStops[index] = { ...nuevosStops[index], [field]: value };
      return { ...prev, stops: nuevosStops };
    });
    limpiarErrorCampo(`stop_${field}_${index}`);
  };

  // Handler especial para AutocompleteInput dentro de stops
  const handleStopPlaceChange = useCallback((name, value) => {
    // name viene como "stop_destino_0"
    const partes = name.split("_");
    const index = parseInt(partes[partes.length - 1]);
    handleStopChange(index, "destino", value);
  }, []);

  // ── Servicios extras ────────────────────────────────────────────
  const handleServicioChange = (e) => {
    const { name, value } = e.target;
    if (!value) return;
    const selected = opcionesExtras[name].find((s) => s.id === parseInt(value));
    if (!selected) return;

    setFormData((prev) => {
      const yaExiste = prev.servicios.find((s) => s.id === selected.id);
      if (yaExiste) return prev;
      const nuevos = [...prev.servicios, selected];
      const total = nuevos.reduce((acc, s) => acc + parseFloat(s.precio), 0);
      return { ...prev, servicios: nuevos, total: total.toFixed(2), [name]: "" };
    });
    e.target.value = "";
  };

  const handleEliminarServicio = (servicioId) => {
    setFormData((prev) => {
      const nuevos = prev.servicios.filter((s) => s.id !== servicioId);
      const total = nuevos.reduce((acc, s) => acc + parseFloat(s.precio), 0);
      return { ...prev, servicios: nuevos, total: total.toFixed(2) };
    });
  };

  // ── Ajustes del desglose (paso 5) ───────────────────────────────
  const handleAjusteDesglose = (field, value) => {
    if (!desglose) return;
    const numVal = value === "" ? 0 : parseFloat(value);

    const costoChofer = desglose.costoChofer;
    const costoRenta = desglose.costoRenta;
    const costoCombustible = desglose.costoCombustible;
    const costoDesgaste = desglose.costoDesgaste;
    const costoCasetas = field === "costo_casetas" ? numVal : (desglose.ajustes?.costo_casetas ?? 0);
    const costoExtra = field === "costo_extra" ? numVal : (desglose.ajustes?.costo_extra ?? 0);

    const subtotal = costoRenta + costoCombustible + costoDesgaste + costoChofer + costoCasetas + costoExtra;
    const iva = subtotal * 0.16;
    const totalConIva = subtotal + iva;
    const total = totalConIva / 0.95;

    setDesglose((prev) => ({
      ...prev,
      ajustes: {
        ...prev.ajustes,
        [field]: numVal,
        subtotal: parseFloat(subtotal.toFixed(2)),
        iva: parseFloat(iva.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      },
    }));

    setFormData((prev) => ({
      ...prev,
      total: total.toFixed(2),
    }));
  };

  // ── Abrir / Cerrar modal ────────────────────────────────────────
  const formDataInicial = useCallback(() => ({
    folio: generarFolioAutomatico(),
    fecha_salida: "", fecha_regreso: "",
    hora_salida: "", hora_regreso: "",
    numero_dias: "", total_kilometros: "", costo_casetas: "",
    tipo_camino: "terraceria", id: "", lead_id: "",
    nombre_responsable: "", tipo_servicio: "", num_pasajeros: "",
    origen: "Oaxaca de Juarez, Oaxaca", punto_intermedio: "", destino: "",
    fecha: new Date().toISOString().split("T")[0],
    tipo_cliente: "tipo_1", descripcion: "",
    transporte: "", restaurante: "", tour: "", hospedaje: "",
    servicios: [], total: "", totalLetra: "", lista: [],
    stops: [{ ...STOP_VACIO }],
  }), [generarFolioAutomatico]);

  const abrirModal = useCallback(() => {
    setMostrarModal(true);
    setPasoActual(1);
    setModoEdicion(false);
    setModoViaje("simple");
    setDesglose(null);
    limpiarTodosErrores();
    setFormData(formDataInicial());
    setDatosCliente({ nombre: "", email: "", telefono: "" });
  }, [formDataInicial, limpiarTodosErrores]);

  const cerrarModal = useCallback(() => {
    setMostrarModal(false);
    setPasoActual(1);
    setModoEdicion(false);
    setModoViaje("simple");
    setDesglose(null);
    limpiarTodosErrores();
    document.body.style.overflow = "";
    if (onCancelarEdicion) onCancelarEdicion();
    setFormData(formDataInicial());
    setDatosCliente({ nombre: "", email: "", telefono: "" });
  }, [onCancelarEdicion, formDataInicial, limpiarTodosErrores]);

  // ── Cargar cotización a editar ──────────────────────────────────
  useEffect(() => {
    if (!cotizacionEditar) return;
    document.body.style.overflow = "hidden";
    setModoEdicion(true);
    setModoViaje(cotizacionEditar.modo ?? "simple");

    setFormData({
      folio: cotizacionEditar.folio || "",
      fecha_salida: cotizacionEditar.fecha_salida || "",
      fecha_regreso: cotizacionEditar.fecha_regreso || "",
      hora_salida: cotizacionEditar.hora_salida || "",
      hora_regreso: cotizacionEditar.hora_regreso || "",
      numero_dias: cotizacionEditar.numero_dias || "",
      total_kilometros: cotizacionEditar.total_kilometros || "",
      costo_casetas: cotizacionEditar.costo_casetas || "",
      tipo_camino: cotizacionEditar.tipo_camino || "terraceria",
      id: cotizacionEditar.id || "",
      lead_id: cotizacionEditar.lead_id || "",
      nombre_responsable: cotizacionEditar.nombre_responsable || "",
      tipo_servicio: cotizacionEditar.tipo_servicio || "",
      num_pasajeros: cotizacionEditar.num_pasajeros || "",
      origen: cotizacionEditar.origen || "Oaxaca de Juarez, Oaxaca",
      punto_intermedio: cotizacionEditar.punto_intermedio || "",
      destino: cotizacionEditar.destino || "",
      fecha: cotizacionEditar.fecha || new Date().toISOString().split("T")[0],
      tipo_cliente: cotizacionEditar.tipo_cliente || "tipo_1",
      descripcion: cotizacionEditar.descripcion || "",
      transporte: "", restaurante: "", tour: "", hospedaje: "",
      servicios: cotizacionEditar.servicios || [],
      total: cotizacionEditar.total || "",
      totalLetra: cotizacionEditar.totalLetra || "",
      lista: cotizacionEditar.lista || [],
      stops: (() => {
        const s = cotizacionEditar.stops;
        if (!s) return [{ ...STOP_VACIO }];
        if (Array.isArray(s)) return s;
        try { return JSON.parse(s); } catch { return [{ ...STOP_VACIO }]; }
      })(),
    });

    if (cotizacionEditar.cliente) {
      setDatosCliente({
        nombre: cotizacionEditar.cliente.nombre || "",
        email: cotizacionEditar.cliente.email || "",
        telefono: cotizacionEditar.cliente.telefono || "",
      });
    }

    setMostrarModal(true);
    setPasoActual(1);
    limpiarTodosErrores();
  }, [cotizacionEditar, limpiarTodosErrores]);

  // ── Resolver servicios IDs al editar ───────────────────────────
  useEffect(() => {
    if (
      modoEdicion &&
      formData.servicios.length > 0 &&
      typeof formData.servicios[0] === "number"
    ) {
      const tieneOpciones = Object.values(opcionesExtras).some((arr) => arr.length > 0);
      if (!tieneOpciones) return;

      const serviciosCompletos = formData.servicios
        .map((id) => {
          for (const cat in opcionesExtras) {
            const s = opcionesExtras[cat].find((s) => s.id === id);
            if (s) return s;
          }
          return null;
        })
        .filter(Boolean);

      if (serviciosCompletos.length > 0) {
        setFormData((prev) => ({ ...prev, servicios: serviciosCompletos }));
      }
    }
  }, [opcionesExtras, modoEdicion, formData.servicios]);

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validacion = validarTodosLosPasos();
    if (!validacion.valido) return;

    try {
      const cotizacionCompleta = {
        ...formData,
        ...datosCliente,
        modo: modoViaje,
        servicios: formData.servicios.map((s) => s.id),
        stops: modoViaje === "itinerario" ? formData.stops : null,
        id: modoEdicion ? formData.id : generarIdCliente(),
      };

      const respuesta = await onGuardarCotizacion(cotizacionCompleta, modoEdicion);

      // Si el backend devuelve desglose, lo mostramos en paso 5
      if (respuesta?.desglose) {
        const d = respuesta.desglose;
        const veh = d.vehiculo_recomendado?.costos ?? {};

        setDesglose({
          vehiculoNombre: d.vehiculo_recomendado?.nombre ?? "",
          kilometros: d.kilometros?.total ?? 0,
          kilometrosReales: d.kilometros?.base ?? 0,
          dias: d.dias ?? 1,
          costoRenta: veh.renta_ajustada ?? 0,
          costoCombustible: veh.combustible ?? 0,
          costoDesgaste: veh.desgaste ?? 0,
          costoChofer: veh.chofer ?? 0,
          subtotal: veh.subtotal ?? 0,
          iva: veh.iva ?? 0,
          total: veh.total_con_iva ?? 0,
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

        setPasoActual(5);
        return;
      }
      modoEdicion ? mostrarNotificacionExito() : mostrarNotificacionAgregar();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleConfirmarCotizacion = () => {
    modoEdicion ? mostrarNotificacionExito() : mostrarNotificacionAgregar();
    cerrarModal();
  };

  // ── Notificaciones ──────────────────────────────────────────────
  const mostrarNotificacionAgregar = () => {
    Swal.fire({
      icon: "success",
      title: "Cotización Agregada!",
      html: `<div style="font-size:1.1rem;margin-top:15px;">
        <strong style="color:#2563eb;font-size:1.3rem;">"${formData.origen} a ${formData.destino || formData.stops?.[0]?.destino || ""}"</strong>
        <p style="margin-top:10px;color:#64748b;">ha sido registrado correctamente</p>
      </div>`,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#2563eb",
      timer: 3000, timerProgressBar: true,
    });
  };

  const mostrarNotificacionExito = () => {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({
        title: "¡Excelente!",
        text: "La información de la orden se ha actualizado correctamente",
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor: "#2563eb",
        timer: 3000, timerProgressBar: true,
      });
    }
  };

  // ── Componente de error ─────────────────────────────────────────
  const MensajeError = React.memo(({ nombreCampo }) => {
    const error = erroresCampos[nombreCampo];
    if (!error) return null;
    return (
      <div className="mensaje-error">
        <span className="icono-error">!</span>
        {error}
      </div>
    );
  });

  // ── Render ──────────────────────────────────────────────────────
  return (
    <>
      {mostrarBoton && (
        <button className="cotizacion-boton-agregar" onClick={abrirModal} title="Nueva Cotización">
          <span>Nueva Cotización</span>
        </button>
      )}

      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="header-formulario">
              <h2>{modoEdicion ? "Editar Cotización" : "Nueva Cotización"}</h2>
            </div>

            {/* Tabs */}
            <div className="cotizacion-tabs">
              {["Información General", "Datos del Cliente", "Datos del Servicio", "Detalles del Viaje", "Extras y Total"].map(
                (label, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`cotizacion-tab-button ${pasoActual === i + 1 ? "active" : ""}`}
                    onClick={() => setPasoActual(i + 1)}
                  >
                    {label}
                  </button>
                )
              )}
            </div>

            <form className="formulario-cotizacion" onSubmit={handleSubmit}>

              {/* ── PASO 1 ── */}
              {pasoActual === 1 && (
                <div className="paso-contenido">
                  <div className="fila">
                    <label>ID: <input type="number" name="id" value={formData.id} onChange={handleInputChange} readOnly /></label>
                    <label>Folio: <span className="required">*</span>
                      <input type="text" name="folio" value={formData.folio} onChange={handleInputChange} readOnly placeholder="Auto-generado" />
                    </label>
                  </div>
                  <div className="fila">
                    <label>N° de Lead: <input type="text" name="lead_id" value={formData.lead_id} onChange={handleInputChange} readOnly /></label>
                    <label>Nombre Responsable: <span className="required">*</span>
                      <input type="text" name="nombre_responsable" value={formData.nombre_responsable} onChange={handleInputChange} className={erroresCampos.nombre_responsable ? "campo-error" : ""} />
                      <MensajeError nombreCampo="nombre_responsable" />
                    </label>
                  </div>
                  <div className="fila">
                    <label>Fecha Creación: <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} readOnly /></label>
                  </div>
                  <div className="botones-navegacion">
                    <button type="button" onClick={cerrarModal} className="btn-cancelar">Cancelar</button>
                    <button type="button" onClick={siguientePaso} className="btn-siguiente">Siguiente</button>
                  </div>
                </div>
              )}

              {/* ── PASO 2 ── */}
              {pasoActual === 2 && (
                <div className="paso-contenido">
                  <label>Nombre: <span className="required">*</span>
                    <input type="text" name="nombre" autoComplete="name" value={datosCliente.nombre} onChange={handleClienteInputChange} className={erroresCampos.nombre ? "campo-error" : ""} />
                    <MensajeError nombreCampo="nombre" />
                  </label>
                  <label>Email: <span className="required">*</span>
                    <input type="email" name="email" autoComplete="email" value={datosCliente.email} onChange={handleClienteInputChange} className={erroresCampos.email ? "campo-error" : ""} />
                    <MensajeError nombreCampo="email" />
                  </label>
                  <div className="fila">
                    <label>Teléfono: <span className="required">*</span>
                      <input type="text" name="telefono" autoComplete="tel" value={datosCliente.telefono} onChange={handleClienteInputChange} className={erroresCampos.telefono ? "campo-error" : ""} placeholder="951-574-11-11" maxLength="13" />
                      <MensajeError nombreCampo="telefono" />
                    </label>
                  </div>
                  <div className="botones-navegacion">
                    <button type="button" onClick={pasoAnterior} className="btn-anterior">Anterior</button>
                    <div className="botones-derecha">
                      <button type="button" onClick={cerrarModal} className="btn-cancelar">Cancelar</button>
                      <button type="button" onClick={siguientePaso} className="btn-siguiente">Siguiente</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASO 3 ── */}
              {pasoActual === 3 && (
                <div className="paso-contenido">
                  <div className="fila">
                    <label>N° pasajeros: <span className="required">*</span>
                      <input type="number" name="num_pasajeros" value={formData.num_pasajeros} onChange={handleInputChange} className={erroresCampos.num_pasajeros ? "campo-error" : ""} min="1" />
                      <MensajeError nombreCampo="num_pasajeros" />
                    </label>
                    <label>Tipo Servicio: (Opcional)
                      <input type="text" name="tipo_servicio" value={formData.tipo_servicio} onChange={handleInputChange} />
                    </label>
                  </div>

                  {/* Toggle modo viaje */}
                  <div className="modo-viaje-toggle">
                    <button
                      type="button"
                      className={`btn-modo ${modoViaje === "simple" ? "active" : ""}`}
                      onClick={() => { setModoViaje("simple"); limpiarTodosErrores(); }}
                    >
                      Viaje Simple
                    </button>
                    <button
                      type="button"
                      className={`btn-modo ${modoViaje === "itinerario" ? "active" : ""}`}
                      onClick={() => { setModoViaje("itinerario"); limpiarTodosErrores(); }}
                    >
                      Itinerario Múltiple
                    </button>
                  </div>

                  {modoViaje === "simple" ? (
                    <>
                      <label>Origen Servicio:
                        <AutocompleteInput
                          name="origen"
                          value={formData.origen}
                          onChange={handlePlaceChange}
                          placeholder="Busca un lugar..."
                          isLoaded={isMapsLoaded}
                          className={erroresCampos.origen ? "campo-error" : ""}
                        />
                      </label>
                      <label>Punto Intermedio: (Opcional)
                        <AutocompleteInput
                          name="punto_intermedio"
                          value={formData.punto_intermedio}
                          onChange={handlePlaceChange}
                          placeholder="Busca un lugar..."
                          isLoaded={isMapsLoaded}
                          className={erroresCampos.punto_intermedio ? "campo-error" : ""}
                        />
                      </label>
                      <label>Destino Servicio: <span className="required">*</span>
                        <AutocompleteInput
                          name="destino"
                          value={formData.destino}
                          onChange={handlePlaceChange}
                          placeholder="Busca un lugar..."
                          isLoaded={isMapsLoaded}
                          className={erroresCampos.destino ? "campo-error" : ""}
                        />
                        <MensajeError nombreCampo="destino" />
                      </label>
                    </>
                  ) : (
                    <>
                      <label>Origen:
                        <AutocompleteInput
                          name="origen"
                          value={formData.origen}
                          onChange={handlePlaceChange}
                          placeholder="Busca un lugar..."
                          isLoaded={isMapsLoaded}
                        />
                      </label>

                      <div className="stops-container">
                        {formData.stops.map((stop, index) => (
                          <div key={index} className="stop-item">
                            <div className="stop-header">
                              <span className="stop-numero">Parada {index + 1}</span>
                              {formData.stops.length > 1 && (
                                <button type="button" className="btn-eliminar-stop" onClick={() => eliminarStop(index)}>❌</button>
                              )}
                            </div>

                            <label>Destino {index + 1}: <span className="required">*</span>
                              <AutocompleteInput
                                name={`stop_destino_${index}`}
                                value={stop.destino}
                                onChange={handleStopPlaceChange}
                                placeholder="Busca un lugar..."
                                isLoaded={isMapsLoaded}
                                className={erroresCampos[`stop_destino_${index}`] ? "campo-error" : ""}
                              />
                              <MensajeError nombreCampo={`stop_destino_${index}`} />
                            </label>

                            <div className="fila">
                              <label>Fecha salida: <span className="required">*</span>
                                <input
                                  type="date"
                                  value={stop.fecha_salida}
                                  onChange={(e) => handleStopChange(index, "fecha_salida", e.target.value)}
                                  className={erroresCampos[`stop_fecha_${index}`] ? "campo-error" : ""}
                                />
                                <MensajeError nombreCampo={`stop_fecha_${index}`} />
                              </label>
                              <label>Hora salida:
                                <input
                                  type="time"
                                  value={stop.hora_salida}
                                  onChange={(e) => handleStopChange(index, "hora_salida", e.target.value)}
                                />
                              </label>
                            </div>

                            <label>Tipo de Camino:
                              <select
                                value={stop.tipo_camino}
                                onChange={(e) => handleStopChange(index, "tipo_camino", e.target.value)}
                              >
                                <option value="pavimento">Pavimento (Pista)</option>
                                <option value="revestido">Revestido</option>
                                <option value="ciudad">Ciudad</option>
                                <option value="terraceria">Terracería</option>
                              </select>
                            </label>
                          </div>
                        ))}
                      </div>

                      <button type="button" className="btn-agregar-stop" onClick={agregarStop}>
                        + Agregar Parada
                      </button>
                    </>
                  )}

                  <div className="botones-navegacion">
                    <button type="button" onClick={pasoAnterior} className="btn-anterior">Anterior</button>
                    <div className="botones-derecha">
                      <button type="button" onClick={cerrarModal} className="btn-cancelar">Cancelar</button>
                      <button type="button" onClick={siguientePaso} className="btn-siguiente">Siguiente</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASO 4 ── */}
              {pasoActual === 4 && (
                <div className="paso-contenido">
                  <div className="fila">
                    <label>Fecha Salida: <span className="required">*</span>
                      <input type="date" name="fecha_salida" value={formData.fecha_salida} onChange={handleInputChange} className={erroresCampos.fecha_salida ? "campo-error" : ""} />
                      <MensajeError nombreCampo="fecha_salida" />
                    </label>

                    {modoViaje === "simple" && (
                      <label>Fecha Regreso: <span className="required">*</span>
                        <input type="date" name="fecha_regreso" value={formData.fecha_regreso} onChange={handleInputChange} className={erroresCampos.fecha_regreso ? "campo-error" : ""} />
                        <MensajeError nombreCampo="fecha_regreso" />
                      </label>
                    )}
                  </div>

                  <div className="fila">
                    <label>Hora salida: <span className="required">*</span>
                      <input type="time" name="hora_salida" value={formData.hora_salida} onChange={handleInputChange} className={erroresCampos.hora_salida ? "campo-error" : ""} />
                      <MensajeError nombreCampo="hora_salida" />
                    </label>

                    {modoViaje === "simple" && (
                      <label>Hora regreso: <span className="required">*</span>
                        <input type="time" name="hora_regreso" value={formData.hora_regreso} onChange={handleInputChange} className={erroresCampos.hora_regreso ? "campo-error" : ""} />
                        <MensajeError nombreCampo="hora_regreso" />
                      </label>
                    )}
                  </div>

                  <div className="fila">
                    <label>Días:
                      <input
                        type="number"
                        name="numero_dias"
                        value={formData.numero_dias}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Auto"
                      />
                    </label>
                  </div>

                  <div className="fila">
                    <label>Total Kilómetros: <input type="number" name="total_kilometros" value={formData.total_kilometros} onChange={handleInputChange} step="0.1" min="0" readOnly /></label>
                    <label>Costo Casetas: <input type="number" name="costo_casetas" value={formData.costo_casetas} onChange={handleInputChange} step="0.01" min="0" readOnly /></label>
                  </div>

                  <div className="fila">
                    <label>Tipo de Camino:
                      <select name="tipo_camino" value={formData.tipo_camino} onChange={handleInputChange}>
                        <option value="pavimento">Pavimento (Pista)</option>
                        <option value="revestido">Revestido</option>
                        <option value="ciudad">Ciudad</option>
                        <option value="terraceria">Terracería</option>
                      </select>
                    </label>
                    <label>Tipo Cliente:
                      <select name="tipo_cliente" value={formData.tipo_cliente} onChange={handleInputChange}>
                        <option value="tipo_1">Tipo 1 — Sin descuento</option>
                        <option value="tipo_2">Tipo 2 — 10% descuento</option>
                        <option value="tipo_3">Tipo 3 — 20% descuento</option>
                        <option value="tipo_4">Tipo 4 — 30% descuento</option>
                      </select>
                    </label>
                  </div>

                  <label>Descripción: (Opcional)
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows="3" placeholder="Descripción del servicio..." />
                  </label>

                  <div className="botones-navegacion">
                    <button type="button" onClick={pasoAnterior} className="btn-anterior">Anterior</button>
                    <div className="botones-derecha">
                      <button type="button" onClick={cerrarModal} className="btn-cancelar">Cancelar</button>
                      <button type="button" onClick={siguientePaso} className="btn-siguiente">Siguiente</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASO 5 ── */}
              {pasoActual === 5 && (
                <div className="paso-contenido">

                  {/* Desglose calculado — aparece después del submit */}
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
                        <label>Costo Casetas (ajuste manual):
                          <input
                            type="number" min="0" step="0.01"
                            value={desglose.ajustes?.costo_casetas ?? ""}
                            onChange={(e) => handleAjusteDesglose("costo_casetas", e.target.value)}
                          />
                        </label>
                        <label>Costo Extra:
                          <input
                            type="number" min="0" step="0.01"
                            value={desglose.ajustes?.costo_extra ?? ""}
                            onChange={(e) => handleAjusteDesglose("costo_extra", e.target.value)}
                          />
                        </label>
                      </div>

                      <div className="desglose-totales">
                        <div className="desglose-item"><span>Subtotal</span><span>${desglose.ajustes?.subtotal?.toFixed(2)}</span></div>
                        <div className="desglose-item"><span>IVA (16%)</span><span>${desglose.ajustes?.iva?.toFixed(2)}</span></div>
                        <div className="desglose-item total"><span>Total</span><span>${desglose.ajustes?.total?.toFixed(2)}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Servicios extras */}
                  <div className="extras-grid">
                    {["transporte", "restaurante", "tour", "hospedaje"].map((tipo) => (
                      <label key={tipo}>
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}:
                        <select name={tipo} value={formData[tipo]} onChange={handleServicioChange}>
                          <option value="">Seleccionar...</option>
                          {opcionesExtras[tipo].map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.nombre} - ${s.precio} - ({s.proveedor})
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>

                  <div className="extras-seleccionados">
                    <h4>Extras:</h4>
                    <div className="extras-lista">
                      {formData.servicios.length > 0 ? (
                        formData.servicios.map((s) => (
                          <div key={s.id} className="extra-item">
                            <span className="extra-tipo">{s.tipo}:</span>
                            <span className="extra-valor">{s.nombre}</span>
                            <span className="extra-proveedor">({s.proveedor})</span>
                            <span className="extra-costo">${s.precio}</span>
                            <button type="button" className="btn-eliminar-extra" onClick={() => handleEliminarServicio(s.id)}>❌</button>
                          </div>
                        ))
                      ) : (
                        <p className="extras-vacio">No hay extras seleccionados</p>
                      )}
                    </div>
                  </div>

                  <div className="total-container">
                    <label>Total: <span className="required">*</span>
                      <input type="number" name="total" value={formData.total} onChange={(e) => setFormData((p) => ({ ...p, total: e.target.value }))} step="0.01" min="0" placeholder="0.00" />
                    </label>
                    <label>Total en letra: (Opcional)
                      <textarea name="totalLetra" value={formData.totalLetra} onChange={handleInputChange} placeholder="" />
                    </label>
                  </div>

                  <div className="botones-navegacion">
                    <button type="button" onClick={pasoAnterior} className="btn-anterior">Anterior</button>
                    <div className="botones-derecha">
                      <button type="button" onClick={cerrarModal} className="btn-cancelar">Cancelar</button>

                      {desglose ? (
                        // Ya calculado — solo confirmar
                        <button type="button" className="btn-guardar" onClick={handleConfirmarCotizacion}>
                          Confirmar
                        </button>
                      ) : (
                        // Aún no calculado — submit al backend
                        <button type="submit" className="btn-guardar">
                          {modoEdicion ? "Actualizar" : "Calcular y Guardar"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NuevaCotizacion;