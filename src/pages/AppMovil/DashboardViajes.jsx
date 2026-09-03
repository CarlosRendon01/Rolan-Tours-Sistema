import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Shield, Clock, CheckCircle, Star, Search, Eye, Award,
  ChevronLeft, ChevronRight, RefreshCw, AlertCircle,
  MapPin, User, Calendar, Truck, Users, BarChart3,
  X, Navigation, ArrowRight, Filter,
} from "lucide-react";
import { API_CONFIG } from "../../config/api";
import ModalDetalleViaje from "./Modales/ModalDetalleViaje";
import ModalCalificarOperador from "./Modales/ModalCalificarOperador";
import "./DashboardViajes.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getEstadoConfig = (estado) => ({
  pendiente_revision: { color: "#F59E0B", bg: "#FEF3C7", texto: "Pendiente", Icon: Clock },
  revisado: { color: "#3B82F6", bg: "#DBEAFE", texto: "Revisado", Icon: CheckCircle },
  calificado: { color: "#10B981", bg: "#D1FAE5", texto: "Calificado", Icon: Star },
}[estado] ?? { color: "#6B7280", bg: "#F3F4F6", texto: "—", Icon: AlertCircle });

const getPrioridadConfig = (p) => ({
  alta: { color: "#EF4444", bg: "#FEE2E2", label: "Alta" },
  media: { color: "#F59E0B", bg: "#FEF3C7", label: "Media" },
  baja: { color: "#10B981", bg: "#D1FAE5", label: "Baja" },
}[p] ?? { color: "#6B7280", bg: "#F3F4F6", label: "—" });

const Stars = ({ n = 0, size = 14 }) => (
  <span style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        fill={i <= n ? "#FBBF24" : "none"}
        color={i <= n ? "#FBBF24" : "#D1D5DB"}
      />
    ))}
  </span>
);

// ─── Fila de viaje ────────────────────────────────────────────────────────────

const FilaViaje = ({ viaje, onVer, showPrioridad = false, showCalificacion = false }) => {
  const cfg = getEstadoConfig(viaje.estado);
  const pri = getPrioridadConfig(viaje.prioridad);

  return (
    <tr
      className="dv-fila"
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td className="dv-td">
        <span className="dv-folio">{viaje.folio}</span>
      </td>

      <td className="dv-td">
        <div className="dv-operador">
          <div className="dv-avatar">{viaje.operador?.iniciales}</div>
          <div>
            <div className="dv-operador-nombre">
              {viaje.operador?.nombre} {viaje.operador?.apellidos}
            </div>
            <div className="dv-operador-sub">
              {viaje.unidad?.numero} · {viaje.unidad?.placas}
            </div>
          </div>
        </div>
      </td>

      <td className="dv-td">
        <div className="dv-ruta-origen">
          <Navigation size={10} /> {viaje.ruta?.origen}
        </div>
        <div className="dv-ruta-destino">
          <MapPin size={10} /> {viaje.ruta?.destino}
        </div>
      </td>

      <td className="dv-td dv-cliente">{viaje.cliente}</td>

      <td className="dv-td">
        <div className="dv-fecha">{viaje.fechaFin}</div>
        <div className="dv-hora">{viaje.horaFin}</div>
      </td>

      {showPrioridad && (
        <td className="dv-td">
          <span className="dv-badge" style={{ background: pri.bg, color: pri.color }}>
            {pri.label}
          </span>
          {viaje.tiempoEspera && (
            <div className="dv-espera">⏳ {viaje.tiempoEspera}</div>
          )}
        </td>
      )}

      {showCalificacion && (
        <td className="dv-td">
          {viaje.encuestaCliente ? (
            <Stars n={viaje.encuestaCliente.calificacion} />
          ) : (
            <span className="dv-sin-dato">—</span>
          )}
        </td>
      )}

      <td className="dv-td">
        <span
          className="dv-badge dv-badge-estado"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          <cfg.Icon size={10} /> {cfg.texto}
        </span>
      </td>

      <td className="dv-td">
        <button className="dv-btn-ver" onClick={() => onVer(viaje)}>
          <Eye size={12} /> Ver
        </button>
      </td>
    </tr>
  );
};

// ─── Paginación ───────────────────────────────────────────────────────────────

const Paginacion = ({ pagina, total, porPagina, onChange }) => {
  const totalPags = Math.ceil(total / porPagina);
  if (totalPags <= 1) return null;

  return (
    <div className="dv-paginacion">
      <span className="dv-pag-info">
        Mostrando {Math.min((pagina - 1) * porPagina + 1, total)}–
        {Math.min(pagina * porPagina, total)} de {total}
      </span>
      <div className="dv-pag-botones">
        <button className="dv-pag-btn" onClick={() => onChange(pagina - 1)} disabled={pagina === 1}>
          <ChevronLeft size={13} /> Anterior
        </button>
        {Array.from({ length: totalPags }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`dv-pag-num ${pagina === n ? "dv-pag-activo" : ""}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
        <button className="dv-pag-btn" onClick={() => onChange(pagina + 1)} disabled={pagina >= totalPags}>
          Siguiente <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────

const POR_PAG = 8;

const DashboardViajes = () => {
  const [tab, setTab] = useState("dashboard");

  const [pendientes, setPendientes] = useState([]);
  const [calificados, setCalificados] = useState([]);
  const [cargandoPend, setCargandoPend] = useState(true);
  const [cargandoCalif, setCargandoCalif] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const [busquedaPend, setBusquedaPend] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("todos");
  const [ordenPend, setOrdenPend] = useState("reciente");
  const [pagPend, setPagPend] = useState(1);

  const [busquedaCalif, setBusquedaCalif] = useState("");
  const [filtroCalif, setFiltroCalif] = useState("todas");
  const [ordenCalif, setOrdenCalif] = useState("reciente");
  const [pagCalif, setPagCalif] = useState(1);

  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalCalificarVisible, setModalCalificarVisible] = useState(false);

  // ── Carga de datos ──────────────────────────────────────────────────────────

  const cargarPendientes = useCallback(async () => {
    try {
      setCargandoPend(true);
      // localStorage en lugar de AsyncStorage
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/viajes-pendientes`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setPendientes(data.success && data.viajes ? data.viajes : []);
    } catch {
      setPendientes([]);
    } finally {
      setCargandoPend(false);
    }
  }, []);

  const cargarCalificados = useCallback(async () => {
    try {
      setCargandoCalif(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/viajes-calificados`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setCalificados(data.success && data.viajes ? data.viajes : []);
    } catch {
      setCalificados([]);
    } finally {
      setCargandoCalif(false);
    }
  }, []);

  useEffect(() => {
    cargarPendientes();
    cargarCalificados();
  }, [cargarPendientes, cargarCalificados]);

  const onRefresh = async () => {
    setRefrescando(true);
    await Promise.all([cargarPendientes(), cargarCalificados()]);
    setRefrescando(false);
  };

  // ── Guardar calificación ────────────────────────────────────────────────────

  const guardarCalificacion = async (calificacionData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/calificar-operador`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orden_servicio_id: parseInt(viajeSeleccionado.id),
          vehiculo_limpio: calificacionData.vehiculoLimpio,
          franela: calificacionData.franela,
          puntualidad: calificacionData.puntualidad,
          uniforme: calificacionData.uniforme,
          bitacora: calificacionData.bitacora,
          rendimiento: calificacionData.rendimiento,
          encuesta: calificacionData.encuesta,
          errores: calificacionData.errores,
          objetos_olvidados: calificacionData.objetosOlvidados,
          golpes_rayones: calificacionData.golpesRayones,
          comentarios: calificacionData.comentarios,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al guardar");
      }
      setModalCalificarVisible(false);
      setViajeSeleccionado(null);
      await Promise.all([cargarPendientes(), cargarCalificados()]);
    } catch (e) {
      console.error("❌ Error al guardar calificación:", e);
    }
  };

  // ── Stats ───────────────────────────────────────────────────────────────────

  const todos = [...pendientes, ...calificados];
  const totalPend = pendientes.filter((v) => v.estado === "pendiente_revision").length;
  const totalRev = pendientes.filter((v) => v.estado === "revisado" || v.estado === "calificado").length;
  const promedio = calificados.length
    ? (calificados.reduce((a, v) => a + (v.encuestaCliente?.calificacion || 0), 0) / calificados.length).toFixed(1)
    : "0.0";
  const distCalif = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: calificados.filter((v) => v.encuestaCliente?.calificacion === n).length,
  }));

  // ── Filtrado pendientes ─────────────────────────────────────────────────────

  const pendFiltrados = useMemo(() => {
    const t = busquedaPend.toLowerCase();
    return pendientes
      .filter((v) => {
        const match =
          !t ||
          [v.folio, v.operador?.nombre, v.operador?.apellidos, v.cliente, v.ruta?.origen, v.ruta?.destino]
            .some((s) => s?.toLowerCase().includes(t));
        const prio = filtroPrioridad === "todos" || v.prioridad === filtroPrioridad;
        return match && prio;
      })
      .sort((a, b) => {
        if (ordenPend === "reciente") return String(b.id).localeCompare(String(a.id));
        if (ordenPend === "antiguo") return String(a.id).localeCompare(String(b.id));
        if (ordenPend === "prioridad") {
          const ord = { alta: 3, media: 2, baja: 1 };
          return (ord[b.prioridad] || 0) - (ord[a.prioridad] || 0);
        }
        return (a.operador?.nombre || "").localeCompare(b.operador?.nombre || "");
      });
  }, [pendientes, busquedaPend, filtroPrioridad, ordenPend]);

  // ── Filtrado calificados ────────────────────────────────────────────────────

  const califFiltrados = useMemo(() => {
    const t = busquedaCalif.toLowerCase();
    return calificados
      .filter((v) => {
        const match =
          !t ||
          [v.folio, v.operador?.nombre, v.operador?.apellidos, v.cliente, v.ruta?.origen, v.ruta?.destino]
            .some((s) => s?.toLowerCase().includes(t));
        const cal =
          filtroCalif === "todas" ||
          v.encuestaCliente?.calificacion === parseInt(filtroCalif);
        return match && cal;
      })
      .sort((a, b) => {
        if (ordenCalif === "reciente") return String(b.id).localeCompare(String(a.id));
        if (ordenCalif === "calificacion") return (b.encuestaCliente?.calificacion || 0) - (a.encuestaCliente?.calificacion || 0);
        return (a.operador?.nombre || "").localeCompare(b.operador?.nombre || "");
      });
  }, [calificados, busquedaCalif, filtroCalif, ordenCalif]);

  // ── Paginados ───────────────────────────────────────────────────────────────

  const pendPag = pendFiltrados.slice((pagPend - 1) * POR_PAG, pagPend * POR_PAG);
  const califPag = califFiltrados.slice((pagCalif - 1) * POR_PAG, pagCalif * POR_PAG);

  // ── Handlers modal ──────────────────────────────────────────────────────────

  const abrirDetalle = (viaje) => { setViajeSeleccionado(viaje); setModalDetalleVisible(true); };
  const abrirCalificar = () => { setModalDetalleVisible(false); setModalCalificarVisible(true); };
  const cerrarDetalle = () => { setModalDetalleVisible(false); setViajeSeleccionado(null); };
  const cerrarCalificar = () => { setModalCalificarVisible(false); setViajeSeleccionado(null); };

  // ── Cabeceras tabla ─────────────────────────────────────────────────────────

  const headPend = ["Folio", "Operador", "Ruta", "Cliente", "Fecha", "Prioridad", "Estado", ""];
  const headCalif = ["Folio", "Operador", "Ruta", "Cliente", "Fecha", "Calificación", "Estado", ""];

  const cargandoTodo = cargandoPend && cargandoCalif;

  const tabs = [
    { id: "dashboard", label: "Dashboard", Icon: BarChart3, badge: null },
    { id: "pendientes", label: "Pendientes", Icon: Clock, badge: totalPend },
    { id: "calificados", label: "Calificados", Icon: Star, badge: null },
  ];

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="dv-root">

      {/* ── Top bar ── */}
      <div className="dv-topbar">
        <div className="dv-brand">
          <Shield size={22} className="dv-shield-icon" />
          <span className="dv-brand-name">Rolan Tours</span>
          <span className="dv-brand-sub">Panel Admin</span>
        </div>
        <button className="dv-refresh-btn" onClick={onRefresh} disabled={refrescando}>
          <RefreshCw size={14} style={{ animation: refrescando ? "dv-spin 1s linear infinite" : "none" }} />
          Actualizar
        </button>
      </div>

      {/* ── Nav tabs ── */}
      <nav className="dv-nav">
        {tabs.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            className={`dv-tab ${tab === id ? "dv-tab-activo" : ""}`}
            onClick={() => { setTab(id); setBusquedaPend(""); setBusquedaCalif(""); }}
          >
            <Icon size={14} />
            {label}
            {badge > 0 && <span className="dv-tab-badge">{badge}</span>}
          </button>
        ))}
      </nav>

      <div className="dv-body">

        {/* ════════════════════════ DASHBOARD ════════════════════════ */}
        {tab === "dashboard" && (
          <>
            <div className="dv-banner">
              <div className="dv-banner-icon"><Shield size={28} /></div>
              <div>
                <div className="dv-banner-titulo">¡Bienvenida al Panel de Supervisión!</div>
                <div className="dv-banner-sub">
                  {totalPend > 0
                    ? `Tienes ${totalPend} viaje${totalPend > 1 ? "s" : ""} pendiente${totalPend > 1 ? "s" : ""} de revisión`
                    : "No hay viajes pendientes de revisión"}
                </div>
              </div>
            </div>

            <div className="dv-stats-grid">
              {[
                { Icon: Clock, color: "#F59E0B", bg: "#FEF3C7", val: totalPend, label: "Pendientes", sub: "Por revisar" },
                { Icon: CheckCircle, color: "#10B981", bg: "#D1FAE5", val: totalRev, label: "Revisados", sub: "Completados" },
                { Icon: Star, color: "#8B5CF6", bg: "#EDE9FE", val: calificados.length, label: "Calificados", sub: "Con encuesta" },
                { Icon: Truck, color: "#3B82F6", bg: "#DBEAFE", val: todos.length, label: "Total", sub: "Todos" },
              ].map(({ Icon, color, bg, val, label, sub }) => (
                <div key={label} className="dv-stat-card">
                  <div className="dv-stat-icon" style={{ background: bg }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div className="dv-stat-val">{cargandoTodo ? "…" : val}</div>
                  <div className="dv-stat-label">{label}</div>
                  <div className="dv-stat-sub">{sub}</div>
                </div>
              ))}
            </div>

            <div className="dv-grid-2">
              <div className="dv-card dv-card-centro">
                <div className="dv-card-subtitulo">PROMEDIO GENERAL</div>
                <div className="dv-promedio-num">{promedio}</div>
                <Stars n={Math.round(parseFloat(promedio))} size={20} />
                <div className="dv-promedio-sub">de {calificados.length} viajes</div>
              </div>

              <div className="dv-card">
                <div className="dv-card-subtitulo">DISTRIBUCIÓN DE CALIFICACIONES</div>
                {distCalif.map(({ n, count }) => (
                  <div key={n} className="dv-dist-fila">
                    <span className="dv-dist-num">{n}</span>
                    <Star size={11} fill="#FBBF24" color="#FBBF24" />
                    <div className="dv-dist-barra-bg">
                      <div
                        className="dv-dist-barra"
                        style={{
                          width: calificados.length ? `${(count / calificados.length) * 100}%` : "0%",
                          background: n >= 4 ? "#10B981" : n === 3 ? "#F59E0B" : "#EF4444",
                        }}
                      />
                    </div>
                    <span className="dv-dist-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dv-card dv-card-tabla">
              <div className="dv-tabla-header">
                <span className="dv-tabla-titulo">Viajes Recientes</span>
                <button className="dv-link-btn" onClick={() => setTab("pendientes")}>
                  Ver todos <ArrowRight size={13} />
                </button>
              </div>
              <div className="dv-tabla-scroll">
                <table className="dv-table">
                  <thead>
                    <tr className="dv-thead-tr">
                      {headPend.map((h) => <th key={h} className="dv-th">{h.toUpperCase()}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {cargandoPend
                      ? <tr><td colSpan={8} className="dv-td-vacio">Cargando…</td></tr>
                      : pendientes.slice(0, 5).map((v) => (
                        <FilaViaje key={v.id} viaje={v} onVer={abrirDetalle} showPrioridad />
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════ PENDIENTES ════════════════════════ */}
        {tab === "pendientes" && (
          <>
            <div className="dv-controles">
              <div className="dv-search-wrap">
                <Search size={14} color="#94A3B8" />
                <input
                  className="dv-search-input"
                  value={busquedaPend}
                  onChange={(e) => { setBusquedaPend(e.target.value); setPagPend(1); }}
                  placeholder="Buscar folio, operador, cliente, ruta…"
                />
              </div>
              <select
                className="dv-select"
                value={filtroPrioridad}
                onChange={(e) => { setFiltroPrioridad(e.target.value); setPagPend(1); }}
              >
                {["todos", "alta", "media", "baja"].map((p) => (
                  <option key={p} value={p}>
                    {p === "todos" ? "Todas las prioridades" : `Prioridad ${p}`}
                  </option>
                ))}
              </select>
              <select
                className="dv-select"
                value={ordenPend}
                onChange={(e) => setOrdenPend(e.target.value)}
              >
                <option value="reciente">Más reciente</option>
                <option value="antiguo">Más antiguo</option>
                <option value="prioridad">Por prioridad</option>
                <option value="operador">Por operador</option>
              </select>
            </div>

            <div className="dv-chips">
              {[
                { key: "todos", label: `Todos (${pendientes.length})` },
                { key: "alta", label: `Alta (${pendientes.filter((v) => v.prioridad === "alta").length})` },
                { key: "media", label: `Media (${pendientes.filter((v) => v.prioridad === "media").length})` },
                { key: "baja", label: `Baja (${pendientes.filter((v) => v.prioridad === "baja").length})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`dv-chip ${filtroPrioridad === key ? "dv-chip-activo" : ""}`}
                  onClick={() => { setFiltroPrioridad(key); setPagPend(1); }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="dv-card dv-card-tabla">
              <div className="dv-tabla-header">
                <span className="dv-tabla-titulo">Viajes Pendientes</span>
                <span className="dv-tabla-count">{pendFiltrados.length} resultado{pendFiltrados.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="dv-tabla-scroll">
                <table className="dv-table">
                  <thead>
                    <tr className="dv-thead-tr">
                      {headPend.map((h) => <th key={h} className="dv-th">{h.toUpperCase()}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {cargandoPend
                      ? <tr><td colSpan={8} className="dv-td-vacio">Cargando…</td></tr>
                      : pendPag.length === 0
                        ? <tr><td colSpan={8} className="dv-td-vacio">No se encontraron viajes</td></tr>
                        : pendPag.map((v) => (
                          <FilaViaje key={v.id} viaje={v} onVer={abrirDetalle} showPrioridad />
                        ))
                    }
                  </tbody>
                </table>
              </div>
              <Paginacion pagina={pagPend} total={pendFiltrados.length} porPagina={POR_PAG} onChange={setPagPend} />
            </div>
          </>
        )}

        {/* ════════════════════════ CALIFICADOS ════════════════════════ */}
        {tab === "calificados" && (
          <>
            <div className="dv-chips-estrellas">
              {[5, 4, 3, 2, 1].map((n) => {
                const c = calificados.filter((v) => v.encuestaCliente?.calificacion === n).length;
                const activo = filtroCalif === String(n);
                return (
                  <button
                    key={n}
                    className={`dv-chip-estrella ${activo ? "dv-chip-estrella-activo" : ""}`}
                    onClick={() => { setFiltroCalif(activo ? "todas" : String(n)); setPagCalif(1); }}
                  >
                    <Stars n={n} size={12} />
                    <div className="dv-chip-estrella-val">{c}</div>
                    <div className="dv-chip-estrella-sub">{n} estrella{n > 1 ? "s" : ""}</div>
                  </button>
                );
              })}
            </div>

            <div className="dv-controles">
              <div className="dv-search-wrap">
                <Search size={14} color="#94A3B8" />
                <input
                  className="dv-search-input"
                  value={busquedaCalif}
                  onChange={(e) => { setBusquedaCalif(e.target.value); setPagCalif(1); }}
                  placeholder="Buscar folio, operador, cliente, ruta…"
                />
              </div>
              <select
                className="dv-select"
                value={ordenCalif}
                onChange={(e) => setOrdenCalif(e.target.value)}
              >
                <option value="reciente">Más reciente</option>
                <option value="calificacion">Por calificación</option>
                <option value="operador">Por operador</option>
              </select>
              {filtroCalif !== "todas" && (
                <button className="dv-chip-estrella-clear" onClick={() => setFiltroCalif("todas")}>
                  <X size={12} /> {filtroCalif}★ activo
                </button>
              )}
            </div>

            <div className="dv-card dv-card-tabla">
              <div className="dv-tabla-header">
                <span className="dv-tabla-titulo">Viajes Calificados</span>
                <span className="dv-tabla-count">{califFiltrados.length} resultado{califFiltrados.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="dv-tabla-scroll">
                <table className="dv-table">
                  <thead>
                    <tr className="dv-thead-tr">
                      {headCalif.map((h) => <th key={h} className="dv-th">{h.toUpperCase()}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {cargandoCalif
                      ? <tr><td colSpan={8} className="dv-td-vacio">Cargando…</td></tr>
                      : califPag.length === 0
                        ? <tr><td colSpan={8} className="dv-td-vacio">No se encontraron viajes</td></tr>
                        : califPag.map((v) => (
                          <FilaViaje key={v.id} viaje={v} onVer={abrirDetalle} showCalificacion />
                        ))
                    }
                  </tbody>
                </table>
              </div>
              <Paginacion pagina={pagCalif} total={califFiltrados.length} porPagina={POR_PAG} onChange={setPagCalif} />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="dv-footer">
        <span className="dv-footer-nombre">Rolan Tours</span>
        <span>Panel Administrativo · © 2025 Todos los derechos reservados</span>
      </div>

      {/* ── Modales ── */}
      {viajeSeleccionado && (
        <>
          <ModalDetalleViaje
            visible={modalDetalleVisible}
            viaje={viajeSeleccionado}
            onClose={cerrarDetalle}
            onCalificar={viajeSeleccionado.estado !== "calificado" ? abrirCalificar : undefined}
          />
          <ModalCalificarOperador
            visible={modalCalificarVisible}
            viaje={viajeSeleccionado}
            onClose={cerrarCalificar}
            onGuardar={guardarCalificacion}
          />
        </>
      )}
    </div>
  );
};

export default DashboardViajes;