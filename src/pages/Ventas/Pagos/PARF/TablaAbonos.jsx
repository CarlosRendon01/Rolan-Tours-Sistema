import React, { useState, useMemo, useReducer, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Coins,
  Plus,
  Receipt,
  BarChart3,
  Clock,
  AlertCircle,
  FileText,
  Filter,
} from "lucide-react";
import "./TablaAbonos.css";
import ModalNuevoPago from "../ModalesAbonos/ModalNuevoPago";
import ModalAgregarAbono from "../ModalesAbonos/ModalAgregarAbono";
import ModalVerAbono from "../ModalesAbonos/ModalVerAbono";
import ModalEditarAbono from "../ModalesAbonos/ModalEditarAbono";
import ModalReciboAbono from "../ModalesAbonos/ModalReciboAbono";
import ModalFacturaAbono from "../ModalesAbonos/ModalFacturaAbono";
import { API_CONFIG } from "../../../../config/api";

const estadoInicial = {
  paginaActual: 1,
  registrosPorPagina: 10,
  terminoBusqueda: "",
  filtroVisibilidad: "activos",
  cargando: true, // Cambiado a true
};

const reductor = (estado, accion) => {
  switch (accion.tipo) {
    case "ESTABLECER_PAGINA":
      return { ...estado, paginaActual: accion.valor };
    case "ESTABLECER_REGISTROS_POR_PAGINA":
      return { ...estado, registrosPorPagina: accion.valor, paginaActual: 1 };
    case "ESTABLECER_BUSQUEDA":
      return { ...estado, terminoBusqueda: accion.valor, paginaActual: 1 };
    case "ESTABLECER_FILTRO_VISIBILIDAD":
      return { ...estado, filtroVisibilidad: accion.valor, paginaActual: 1 };
    case "ESTABLECER_CARGANDO":
      return { ...estado, cargando: accion.valor };
    default:
      return estado;
  }
};

const TablaAbonos = ({ vistaActual, onCambiarVista }) => {
  const API_URL = `${API_CONFIG.BASE_URL}/pagos`;
  const [estado, despachar] = useReducer(reductor, estadoInicial);
  const {
    paginaActual,
    registrosPorPagina,
    terminoBusqueda,
    filtroVisibilidad,
    cargando,
  } = estado;

  const [rolUsuario] = useState(localStorage.getItem("rol") || "vendedor");
  const [permisos] = useState(localStorage.getItem("permisos") || "");
  const [modalNuevoPagoAbierto, setModalNuevoPagoAbierto] = useState(false);
  const [modalAgregarAbonoAbierto, setModalAgregarAbonoAbierto] =
    useState(false);
  const [modalVerPagoAbierto, setModalVerPagoAbierto] = useState(false);
  const [modalEditarPagoAbierto, setModalEditarPagoAbierto] = useState(false);
  const [modalReciboAbierto, setModalReciboAbierto] = useState(false);
  const [modalFacturaAbierto, setModalFacturaAbierto] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [datosAbonos, setDatosAbonos] = useState([]);

  useEffect(() => {
    cargarAbonos();
  }, []);

  const cargarAbonos = async () => {
    try {
      despachar({ tipo: "ESTABLECER_CARGANDO", valor: true });
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const abonos = res.data.data || [];
      setDatosAbonos(abonos);
      if (pagoSeleccionado && modalVerPagoAbierto) {
        const pagoActualizado = abonos.find(
          (p) => p.id === pagoSeleccionado.id
        );
        if (pagoActualizado) {
          setPagoSeleccionado(pagoActualizado);
        }
      }
    } catch (error) {
      console.error("Error al cargar abonos:", error);
    } finally {
      despachar({ tipo: "ESTABLECER_CARGANDO", valor: false });
    }
  };

  const estadisticas = useMemo(() => {
    const abonosVisibles =
      permisos.includes("ventas.pagos.ver")
        ? datosAbonos.filter((a) => a.activo)
        : datosAbonos.filter((a) => {
          if (filtroVisibilidad === "activos") return a.activo;
          if (filtroVisibilidad === "eliminados") return !a.activo;
          return true;
        });

    const totalClientes = abonosVisibles.length;
    const finalizados = abonosVisibles.filter(
      (abono) => abono.estado === "PAGADO"
    ).length;

    const diasAlVencimiento = (abono) => {
      if (!abono.proximoVencimiento || abono.proximoVencimiento === "—") return null;
      const fechaVencimiento = new Date(abono.proximoVencimiento);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    };

    const proximosVencer = abonosVisibles.filter((abono) => {
      if (abono.estado === "PAGADO") return false;
      const dias = diasAlVencimiento(abono);
      return dias !== null && dias >= 0 && dias <= 7;
    }).length;

    const enProceso = abonosVisibles.filter((abono) => {
      if (abono.estado !== "EN_PROCESO") return false;
      const dias = diasAlVencimiento(abono);
      if (dias === null) return true; // sin fecha = en proceso normal
      return dias > 7; // más de 7 días = en proceso normal
    }).length;

    return { totalClientes, proximosVencer, enProceso, finalizados };
  }, [datosAbonos, permisos, filtroVisibilidad]);

  const datosFiltrados = useMemo(() => {
    return datosAbonos.filter((abono) => {
      if (permisos.includes("ventas.pagos.ver") && !abono.activo) return false;
      if (rolUsuario === "admin") {
        if (filtroVisibilidad === "activos" && !abono.activo) return false;
        if (filtroVisibilidad === "eliminados" && abono.activo) return false;
      }

      const cumpleBusqueda =
        abono.cliente.nombre
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase()) ||
        abono.id.toString().includes(terminoBusqueda) ||
        abono.numeroContrato
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase()) ||
        abono.servicio.tipo
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase());

      return cumpleBusqueda;
    });
  }, [terminoBusqueda, datosAbonos, rolUsuario, filtroVisibilidad, permisos]);

  const totalRegistros = datosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicio + registrosPorPagina;
  const datosPaginados = datosFiltrados.slice(indiceInicio, indiceFinal);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      despachar({ tipo: "ESTABLECER_PAGINA", valor: nuevaPagina });
    }
  };

  const manejarCambioRegistros = (evento) => {
    despachar({
      tipo: "ESTABLECER_REGISTROS_POR_PAGINA",
      valor: parseInt(evento.target.value),
    });
  };

  const manejarBusqueda = (evento) => {
    despachar({ tipo: "ESTABLECER_BUSQUEDA", valor: evento.target.value });
  };

  const manejarFiltroVisibilidad = (evento) => {
    despachar({
      tipo: "ESTABLECER_FILTRO_VISIBILIDAD",
      valor: evento.target.value,
    });
  };

  const manejarAccion = (accion, pago) => {
    try {
      switch (accion) {
        case "ver":
          setPagoSeleccionado(pago);
          setModalVerPagoAbierto(true);
          break;
        case "agregarAbono":
          setPagoSeleccionado(pago);
          setModalAgregarAbonoAbierto(true);
          break;
        case "editar":
          setPagoSeleccionado(pago);
          setModalEditarPagoAbierto(true);
          break;
        case "generarRecibo":
          setPagoSeleccionado(pago);
          setModalReciboAbierto(true);
          break;
        case "generarFactura":
          setPagoSeleccionado(pago);
          setModalFacturaAbierto(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error al procesar la acción:", error);
    }
  };

  const calcularProgreso = (montoPagado, montoTotal) => {
    return Math.round((montoPagado / montoTotal) * 100);
  };

  const obtenerEstadoContrato = (pago) => {
    if (pago.estado === "PAGADO") {
      return { texto: "Finalizado", clase: "abonos-estado-pagado" };
    }
    const fechaVencimiento = new Date(pago.proximoVencimiento);
    const hoy = new Date();
    const diferenciaEnDias = Math.ceil(
      (fechaVencimiento - hoy) / (1000 * 60 * 60 * 24)
    );
    if (diferenciaEnDias < 0) {
      return { texto: "Vencido", clase: "abonos-estado-vencido" };
    } else if (diferenciaEnDias <= 7) {
      return { texto: "Próximo Vencer", clase: "abonos-estado-pendiente" };
    } else {
      return { texto: "En Proceso", clase: "abonos-estado-pendiente" };
    }
  };

  const generarNumerosPaginacion = () => {
    const numeros = [];
    const maximoVisibles = 5;
    if (totalPaginas <= maximoVisibles) {
      for (let i = 1; i <= totalPaginas; i++) {
        numeros.push(i);
      }
    } else {
      if (paginaActual <= 3) {
        for (let i = 1; i <= 4; i++) numeros.push(i);
        numeros.push("...");
        numeros.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        numeros.push(1);
        numeros.push("...");
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) numeros.push(i);
      } else {
        numeros.push(1);
        numeros.push("...");
        numeros.push(paginaActual - 1);
        numeros.push(paginaActual);
        numeros.push(paginaActual + 1);
        numeros.push("...");
        numeros.push(totalPaginas);
      }
    }
    return numeros;
  };

  return (
    <>
      <div className="abonos-contenedor-principal">
        <div className="abonos-encabezado">
          <div className="abonos-seccion-logo">
            <div className="abonos-icono-principal">
              <Coins size={24} />
            </div>
            <div>
              <h1 className="abonos-titulo">Pagos por Abonos</h1>
              <p className="abonos-subtitulo">
                Gestión de pagos parciales para servicios de tours
              </p>
            </div>
          </div>

          <div className="abonos-estadisticas-header">
            <div className="abonos-tarjeta-estadistica total">
              <BarChart3 className="abonos-icono-estadistica" size={20} />
              <span className="abonos-valor-estadistica">
                {estadisticas.totalClientes}
              </span>
              <span className="abonos-etiqueta-estadistica">Clientes</span>
            </div>
            <div className="abonos-tarjeta-estadistica pendientes">
              <Clock className="abonos-icono-estadistica" size={20} />
              <span className="abonos-valor-estadistica">
                {estadisticas.enProceso}
              </span>
              <span className="abonos-etiqueta-estadistica">En Proceso</span>
            </div>
            <div className="abonos-tarjeta-estadistica vencidos">
              <AlertCircle className="abonos-icono-estadistica" size={20} />
              <span className="abonos-valor-estadistica">
                {estadisticas.proximosVencer}
              </span>
              <span className="abonos-etiqueta-estadistica">
                Próximos Vencer
              </span>
            </div>
            <div className="abonos-tarjeta-estadistica pagados">
              <Coins className="abonos-icono-estadistica" size={20} />
              <span className="abonos-valor-estadistica">
                {estadisticas.finalizados}
              </span>
              <span className="abonos-etiqueta-estadistica">Finalizados</span>
            </div>
          </div>
        </div>

        <div className="abonos-controles">
          <div className="abonos-seccion-izquierda">
            <div className="abonos-control-registros">
              <label htmlFor="registros">Mostrar</label>
              <select
                id="registros"
                value={registrosPorPagina}
                onChange={manejarCambioRegistros}
                className="abonos-selector-registros"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>registros</span>
            </div>

            <div className="abonos-filtro-estado">
              <Filter size={16} />
              <label htmlFor="filtro-vista">Vista:</label>
              <select
                id="filtro-vista"
                value={vistaActual}
                onChange={onCambiarVista}
                className="abonos-selector-filtro"
              >
                <option value="pagos">Gestión de Pagos</option>
                <option value="abonos">Pagos por Abonos</option>
                <option value="recibos">Gestión de Recibos</option>
                <option value="facturas">Gestión de Facturas</option>
              </select>
            </div>

            {rolUsuario === "admin" && (
              <div className="abonos-filtro-estado">
                <Eye size={16} />
                <label htmlFor="filtro-visibilidad">Estado:</label>
                <select
                  id="filtro-visibilidad"
                  value={filtroVisibilidad}
                  onChange={manejarFiltroVisibilidad}
                  className="abonos-selector-filtro"
                >
                  <option value="activos">Activos</option>
                  <option value="eliminados">Eliminados</option>
                  <option value="todos">Todos</option>
                </select>
              </div>
            )}
          </div>

          <div className="abonos-seccion-derecha">
            {(permisos.includes("ventas.pagos.editar") || rolUsuario === "admin") && (
              <button
                className="abonos-boton-agregar"
                onClick={() => setModalNuevoPagoAbierto(true)}
                title="Registrar nuevo pago por abonos"
                disabled={cargando}
              >
                <Plus size={18} />
                <span>Nuevo Pago</span>
              </button>
            )}

            <div className="abonos-control-busqueda">
              <input
                type="text"
                placeholder="Buscar cliente, contrato, servicio..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="abonos-entrada-buscar"
              />
              <Search className="abonos-icono-buscar" size={18} />
            </div>
          </div>
        </div>

        <div className="abonos-contenedor-tabla">
          {cargando ? (
            <div className="abonos-estado-cargando">
              <p>
                Cargando abonos{" "}
                <svg
                  width="30"
                  height="30"
                  fill="hsla(227, 11%, 84%, 1.00)"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="12" r="3">
                    <animate
                      id="spinner_qFRN"
                      begin="0;spinner_OcgL.end+0.25s"
                      attributeName="cy"
                      calcMode="spline"
                      dur="0.6s"
                      values="12;6;12"
                      keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    />
                  </circle>
                  <circle cx="12" cy="12" r="3">
                    <animate
                      begin="spinner_qFRN.begin+0.1s"
                      attributeName="cy"
                      calcMode="spline"
                      dur="0.6s"
                      values="12;6;12"
                      keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    />
                  </circle>
                  <circle cx="20" cy="12" r="3">
                    <animate
                      id="spinner_OcgL"
                      begin="spinner_qFRN.begin+0.2s"
                      attributeName="cy"
                      calcMode="spline"
                      dur="0.6s"
                      values="12;6;12"
                      keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    />
                  </circle>
                </svg>
              </p>
            </div>
          ) : datosPaginados.length === 0 ? (
            <div className="abonos-estado-vacio">
              <div className="abonos-icono-vacio">
                <FileText size={64} />
              </div>
              <h3 className="abonos-mensaje-vacio">No se encontraron pagos</h3>
              <p className="abonos-submensaje-vacio">
                {terminoBusqueda
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay pagos por abonos registrados en el sistema"}
              </p>
            </div>
          ) : (
            <table className="abonos-tabla">
              <thead>
                <tr className="abonos-fila-encabezado">
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Progreso</th>
                  <th>Último Abono</th>
                  <th>Próximo Venc.</th>
                  <th>Contrato</th>
                  <th>Estado</th>
                  {rolUsuario === "admin" && <th>Visible</th>}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datosPaginados.map((pago, indice) => {
                  const progreso = calcularProgreso(
                    pago.planPago.montoPagado,
                    pago.planPago.montoTotal
                  );
                  const estadoContrato = obtenerEstadoContrato(pago);
                  const ultimoAbono =
                    pago.historialAbonos?.[pago.historialAbonos.length - 1] ||
                    null;

                  return (
                    <tr
                      key={pago.id}
                      className={`abonos-fila-pago ${!pago.activo ? "eliminado" : ""
                        }`}
                      style={{ animationDelay: `${indice * 0.05}s` }}
                    >
                      <td data-label="ID" className="abonos-columna-id">
                        #{pago.id.toString().padStart(3, "0")}
                      </td>
                      <td
                        data-label="Cliente"
                        className="abonos-columna-cliente"
                      >
                        {pago.cliente.nombre}
                      </td>
                      <td data-label="Servicio">
                        <div className="abonos-info-servicio">
                          <span className="abonos-tipo-servicio">
                            {pago.servicio.tipo}
                          </span>
                          <span className="abonos-descripcion-servicio">
                            {pago.servicio.descripcion}
                          </span>
                        </div>
                      </td>
                      <td data-label="Progreso">
                        <div className="abonos-contenedor-progreso">
                          <div className="abonos-barra-progreso-wrapper">
                            <div className="abonos-barra-progreso">
                              <div
                                className={`abonos-barra-progreso-fill ${progreso === 100 ? "completo" : "proceso"
                                  }`}
                                style={{ width: `${progreso}%` }}
                              ></div>
                            </div>
                            <span className="abonos-porcentaje-progreso">
                              {progreso}%
                            </span>
                          </div>
                          <div className="abonos-monto-progreso">
                            ${pago.planPago.montoPagado.toLocaleString()} / $
                            {pago.planPago.montoTotal.toLocaleString()}
                          </div>
                          <div className="abonos-conteo-abonos">
                            {pago.planPago.abonosRealizados} de{" "}
                            {pago.planPago.abonosPlaneados} abonos
                          </div>
                        </div>
                      </td>
                      <td data-label="Último Abono">
                        {ultimoAbono ? (
                          <div className="abonos-info-ultimo-abono">
                            <span className="abonos-columna-monto">
                              ${ultimoAbono.monto.toLocaleString()}
                            </span>
                            <span className="abonos-fecha-abono">
                              {ultimoAbono.fecha}
                            </span>
                          </div>
                        ) : (
                          <span className="abonos-sin-abonos">Sin abonos</span>
                        )}
                      </td>
                      <td data-label="Próximo Venc.">
                        {pago.proximoVencimiento === "Finalizado" ? (
                          <span className="abonos-texto-finalizado">
                            Finalizado
                          </span>
                        ) : (
                          <span>{pago.proximoVencimiento}</span>
                        )}
                      </td>
                      <td
                        data-label="Contrato"
                        className="abonos-columna-factura"
                      >
                        {pago.numeroContrato}
                      </td>
                      <td data-label="Estado">
                        <span
                          className={`abonos-badge-estado ${estadoContrato.clase}`}
                        >
                          <span className="abonos-indicador-estado"></span>
                          {estadoContrato.texto}
                        </span>
                      </td>
                      {rolUsuario === "admin" && (
                        <td data-label="Visible">
                          <span
                            className={`abonos-badge-visibilidad ${pago.activo ? "visible" : "oculto"
                              }`}
                          >
                            {pago.activo ? "✓ Sí" : "✗ No"}
                          </span>
                        </td>
                      )}
                      <td
                        data-label="Acciones"
                        className="abonos-columna-acciones"
                      >
                        <div className="abonos-botones-accion">
                          <button
                            className="abonos-boton-accion abonos-ver"
                            onClick={() => manejarAccion("ver", pago)}
                            title="Ver historial de abonos"
                            disabled={cargando}
                          >
                            <Eye size={14} />
                          </button>
                          {pago.estado !== "PAGADO" && pago.activo && (
                            <button
                              className="abonos-boton-accion abonos-agregar"
                              onClick={() =>
                                manejarAccion("agregarAbono", pago)
                              }
                              title="Agregar nuevo abono"
                              disabled={cargando}
                            >
                              <Plus size={14} />
                            </button>
                          )}

                          {pago.activo && (
                            <>
                              {(permisos.includes("ventas.pagos.editar") || rolUsuario === "admin") && (
                                <button
                                  className="abonos-boton-accion abonos-editar"
                                  onClick={() => manejarAccion("editar", pago)}
                                  title={
                                    pago.estado === "PAGADO"
                                      ? "No se puede editar (finalizado)"
                                      : "Editar pago"
                                  }
                                  disabled={
                                    cargando || pago.estado === "PAGADO"
                                  }
                                >
                                  <Edit size={14} />
                                </button>
                              )}
                              <button
                                className="abonos-boton-accion abonos-recibo"
                                onClick={() =>
                                  manejarAccion("generarRecibo", pago)
                                }
                                title="Generar recibo de pago"
                                disabled={cargando}
                              >
                                <Receipt size={14} />
                              </button>

                              <button
                                className="abonos-boton-accion abonos-factura"
                                onClick={() =>
                                  manejarAccion("generarFactura", pago)
                                }
                                title="Gestionar facturas por abono"
                                disabled={cargando}
                              >
                                <FileText size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {datosPaginados.length > 0 && !cargando && (
          <div className="abonos-pie-tabla">
            <div className="abonos-informacion-registros">
              Mostrando <strong>{indiceInicio + 1}</strong> a{" "}
              <strong>{Math.min(indiceFinal, totalRegistros)}</strong> de{" "}
              <strong>{totalRegistros}</strong> registros
              {terminoBusqueda && (
                <span className="abonos-filtrado-info">
                  (filtrado de {datosAbonos.length} registros totales)
                </span>
              )}
            </div>

            <div className="abonos-controles-paginacion">
              <button
                className="abonos-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1 || cargando}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <div className="abonos-numeros-paginacion">
                {generarNumerosPaginacion().map((numero, indice) =>
                  numero === "..." ? (
                    <span
                      key={`ellipsis-${indice}`}
                      className="abonos-ellipsis"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={numero}
                      className={`abonos-numero-pagina ${paginaActual === numero ? "abonos-activo" : ""
                        }`}
                      onClick={() => cambiarPagina(numero)}
                      disabled={cargando}
                    >
                      {numero}
                    </button>
                  )
                )}
              </div>

              <button
                className="abonos-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas || cargando}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ModalNuevoPago
        abierto={modalNuevoPagoAbierto}
        onCerrar={() => setModalNuevoPagoAbierto(false)}
        onGuardar={cargarAbonos}
      />

      <ModalAgregarAbono
        abierto={modalAgregarAbonoAbierto}
        onCerrar={() => setModalAgregarAbonoAbierto(false)}
        onGuardar={cargarAbonos}
        pagoSeleccionado={pagoSeleccionado}
      />

      <ModalVerAbono
        abierto={modalVerPagoAbierto}
        onCerrar={() => setModalVerPagoAbierto(false)}
        pagoSeleccionado={pagoSeleccionado}
        onActualizar={cargarAbonos}
      />

      <ModalEditarAbono
        abierto={modalEditarPagoAbierto}
        onCerrar={() => setModalEditarPagoAbierto(false)}
        onGuardar={cargarAbonos}
        pagoSeleccionado={pagoSeleccionado}
      />

      <ModalReciboAbono
        abierto={modalReciboAbierto}
        onCerrar={() => setModalReciboAbierto(false)}
        pagoSeleccionado={pagoSeleccionado}
      />

      <ModalFacturaAbono
        abierto={modalFacturaAbierto}
        onCerrar={() => setModalFacturaAbierto(false)}
        pagoSeleccionado={pagoSeleccionado}
        onFacturar={cargarAbonos}
      />
    </>
  );
};

export default TablaAbonos;
