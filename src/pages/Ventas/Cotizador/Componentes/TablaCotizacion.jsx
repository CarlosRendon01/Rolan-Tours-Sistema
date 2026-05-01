import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Eye,
  Search,
  Edit,
  ChevronLeft,
  ChevronRight,
  Trash2,
  FileText,
  BarChart3,
  DollarSign,
} from "lucide-react";
import PropTypes from "prop-types";
import ModalVerCotizacion from "../Modales/ModalVerCotizacion";
import ModalEliminarCotizacion from "../Modales/ModalEliminarCotizacion";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { API_CONFIG } from "../../../../config/api";
import ModalCrearPagoDesdeCotizacion from "../Modales/ModalCrearPagoDesdeCotizacion";

import "./TablaCotizacion.css";

const TablaCotizacion = ({
  cotizaciones = [],
  cargando = false,
  onEditar,
  onEliminar,
  botonNuevaCotizacion,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [cotizacionAEliminar, setCotizacionAEliminar] = useState(null);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [modalDescargaAbierto, setModalDescargaAbierto] = useState(false);
  const [cotizacionDescarga, setCotizacionDescarga] = useState(null);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [cotizacionParaPago, setCotizacionParaPago] = useState(null);
  const permisos = localStorage.getItem("permisos") || "";
  const rolUsuario = localStorage.getItem("rol") || "";

  useEffect(() => {
    setPaginaActual(1);
  }, [cotizaciones]);


  const formatearFecha = useCallback((fecha) => {
    if (!fecha) return "-";
    try {
      const [anio, mes, dia] = fecha.split("T")[0].split("-").map(Number);
      const fechaObj = new Date(anio, mes - 1, dia);
      if (isNaN(fechaObj.getTime())) return "-";
      return fechaObj.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  }, []);

  const manejarAccionEditar = useCallback(
    (cotizacion) => {
      if (typeof onEditar === "function") {
        onEditar(cotizacion);
      }
    },
    [onEditar]
  );

  const manejarAccionCrearPago = useCallback((cotizacion) => {
    setCotizacionParaPago(cotizacion);
    setModalPagoAbierto(true);
  }, []);

  const cotizacionesFiltradas = useMemo(() => {
    if (!terminoBusqueda.trim()) return cotizaciones;

    const termino = terminoBusqueda.toLowerCase().trim();
    return cotizaciones.filter(
      (cotizacion) =>
        cotizacion.folio?.toLowerCase().includes(termino) ||
        cotizacion.destino?.toLowerCase().includes(termino) ||
        cotizacion.origen?.toLowerCase().includes(termino) ||
        formatearFecha(cotizacion.fecha_salida).includes(termino) ||
        formatearFecha(cotizacion.fecha_regreso).includes(termino)
    );
  }, [cotizaciones, terminoBusqueda, formatearFecha]);

  const datosePaginacion = useMemo(() => {
    const totalRegistros = cotizacionesFiltradas.length;
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina) || 1;
    const indiceInicio = (paginaActual - 1) * registrosPorPagina;
    const indiceFin = indiceInicio + registrosPorPagina;
    const cotizacionesPaginadas = cotizacionesFiltradas.slice(
      indiceInicio,
      indiceFin
    );

    return {
      totalRegistros,
      totalPaginas,
      indiceInicio,
      indiceFin,
      cotizacionesPaginadas,
    };
  }, [cotizacionesFiltradas, paginaActual, registrosPorPagina]);

  const cambiarPagina = useCallback(
    (nuevaPagina) => {
      if (nuevaPagina >= 1 && nuevaPagina <= datosePaginacion.totalPaginas) {
        setPaginaActual(nuevaPagina);
      }
    },
    [datosePaginacion.totalPaginas]
  );

  const manejarEliminarCotizacion = useCallback(
    async (cotizacion) => {
      if (!cotizacion) {
        setCotizacionAEliminar(null);
        return;
      }

      try {
        if (typeof onEliminar === "function") {
          await onEliminar(cotizacion.id);
        }
        setCotizacionAEliminar(null);
      } catch (error) {
        console.error("Error al eliminar cotización:", error);
        throw error;
      }
    },
    [onEliminar]
  );

  const manejarCambioRegistros = useCallback((evento) => {
    const valor = parseInt(evento.target.value, 10);
    if (!isNaN(valor) && valor > 0) {
      setRegistrosPorPagina(valor);
      setPaginaActual(1);
    }
  }, []);

  const manejarBusqueda = useCallback((evento) => {
    setTerminoBusqueda(evento.target.value);
    setPaginaActual(1);
  }, []);

  const manejarAccionVer = useCallback((cotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setModalVerAbierto(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalVerAbierto(false);
    setCotizacionSeleccionada(null);
  }, []);

  const manejarAccionEliminar = useCallback((cotizacion) => {
    setCotizacionAEliminar(cotizacion);
  }, []);

  const manejarDescargarWord = useCallback((cotizacion) => {
    setCotizacionDescarga(cotizacion);
    setModalDescargaAbierto(true);
  }, []);

  const descargarWord = useCallback(async (cotizacion, vehiculoId = null) => {
    try {
      const token = localStorage.getItem("token");
      const params = vehiculoId ? `?vehiculo_id=${vehiculoId}` : "";
      const url = `${API_CONFIG.BASE_URL}/cotizaciones/${cotizacion.id}/word${params}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const err = await response.json();
          console.error("Error del servidor:", err);
          alert(`Error: ${err.message || err.error || JSON.stringify(err)}`);
        } else {
          const text = await response.text();
          console.error("Respuesta del servidor:", text);
          alert(`Error ${response.status}: revisa la consola`);
        }
        return;
      }
      
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Cotizacion_${cotizacion.folio}.docx`;
      link.click();
      URL.revokeObjectURL(link.href);
      setModalDescargaAbierto(false);
    } catch (error) {
      console.error("Error al descargar Word:", error);
      alert("Error al descargar el documento. Por favor intente nuevamente.");
    }
  }, []);



  const numerosPaginas = useMemo(
    () =>
      Array.from({ length: datosePaginacion.totalPaginas }, (_, i) => i + 1),
    [datosePaginacion.totalPaginas]
  );

  const cerrarModalPago = useCallback(() => {
    setModalPagoAbierto(false);
    setCotizacionParaPago(null);
  }, []);

  const alGuardarPago = useCallback(() => { }, []);

  return (
    <main className="cotizaciones-contenedor-principal" role="main">
      <header className="cotizaciones-encabezado">
        <div className="cotizaciones-seccion-logo">
          <div className="cotizaciones-lineas-decorativas" aria-hidden="true">
            <div className="cotizaciones-linea cotizaciones-roja"></div>
            <div className="cotizaciones-linea cotizaciones-azul"></div>
            <div className="cotizaciones-linea cotizaciones-verde"></div>
            <div className="cotizaciones-linea cotizaciones-amarilla"></div>
          </div>
          <h1 className="cotizaciones-titulo">Gestión de Cotizaciones</h1>
        </div>

        <section
          className="cotizaciones-contenedor-estadisticas"
          aria-label="Estadísticas de cotizaciones"
        >
          <div className="cotizaciones-estadistica">
            <div
              className="cotizaciones-icono-estadistica-cuadrado"
              aria-hidden="true"
            >
              <BarChart3 size={20} />
            </div>
            <div className="cotizaciones-info-estadistica">
              <span className="cotizaciones-label-estadistica">
                {cotizaciones.length} REGISTROS
              </span>
            </div>
          </div>
        </section>
      </header>

      <nav className="cotizaciones-controles" aria-label="Controles de tabla">
        <div className="cotizaciones-control-registros">
          <label htmlFor="select-registros">Mostrar</label>
          <select
            id="select-registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="cotizaciones-selector-registros"
            aria-describedby="help-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span id="help-registros">registros</span>
        </div>

        <div className="cotizaciones-controles-derecha">
          {botonNuevaCotizacion && (
            <div className="cotizaciones-boton-nueva-wrapper">
              {botonNuevaCotizacion}
            </div>
          )}
          <div className="cotizaciones-control-busqueda" role="search">
            <label htmlFor="input-buscar"></label>
            <div className="cotizaciones-entrada-busqueda">
              <input
                type="search"
                id="input-buscar"
                placeholder="Buscar cotización..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="cotizaciones-entrada-buscar"
                aria-describedby="help-busqueda"
                autoComplete="off"
              />
              <Search
                className="cotizaciones-icono-buscar"
                size={18}
                aria-hidden="true"
              />
            </div>
            <span id="help-busqueda" className="sr-only">
              Buscar por folio, destino o fechas
            </span>
          </div>
        </div>
      </nav>
      {cargando ? (
        <section
          className="cotizaciones-contenedor-tabla"
          aria-label="Cargando datos"
        >
          <div
            className="cotizaciones-tabla-vacia"
            role="status"
            aria-live="polite"
          >
            <div cotizaciones-tabla-vacia>
              <p>
                Cargando cotizaciones{" "}
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
          </div>

          <footer className="cotizaciones-pie-tabla" role="contentinfo">
            <div className="cotizaciones-informacion-registros">
              Cargando datos...
            </div>
            <nav
              className="cotizaciones-controles-paginacion"
              aria-label="Paginación deshabilitada"
            >
              <button
                type="button"
                className="cotizaciones-boton-paginacion"
                disabled
                aria-label="Página anterior no disponible"
              >
                <ChevronLeft size={18} aria-hidden="true" />
                Anterior
              </button>
              <div className="cotizaciones-numeros-paginacion">
                <button
                  type="button"
                  className="cotizaciones-numero-pagina cotizaciones-activo"
                  disabled
                  aria-current="page"
                  aria-label="Página 1 de 1"
                >
                  1
                </button>
              </div>
              <button
                type="button"
                className="cotizaciones-boton-paginacion"
                disabled
                aria-label="Página siguiente no disponible"
              >
                Siguiente
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </nav>
          </footer>
        </section>
      ) : cotizaciones.length > 0 ? (
        <section aria-label="Tabla de cotizaciones">
          <div className="cotizaciones-contenedor-tabla">
            <table
              className="cotizaciones-tabla"
              role="table"
              aria-label={`Tabla de ${datosePaginacion.totalRegistros} cotizaciones`}
            >
              <caption className="sr-only">
                Lista de cotizaciones con opciones de edición y eliminación
              </caption>
              <thead>
                <tr className="cotizaciones-fila-encabezado">
                  <th scope="col" abbr="Folio">
                    FOLIO
                  </th>
                  <th scope="col" abbr="Fecha Salida">
                    FECHA SALIDA
                  </th>
                  <th scope="col" abbr="Fecha Regreso">
                    FECHA REGRESO
                  </th>
                  <th scope="col" abbr="Origen">
                    ORIGEN
                  </th>
                  <th scope="col" abbr="Destino">
                    DESTINO
                  </th>
                  <th scope="col" abbr="Acciones">
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody>
                {datosePaginacion.cotizacionesPaginadas.map(
                  (cotizacion, index) => (
                    <tr
                      key={`cotizacion-${cotizacion.id}`}
                      className="cotizaciones-fila-cotizacion"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td data-label="Folio">
                        <span className="cotizaciones-badge-folio">
                          {cotizacion.folio || "Sin folio"}
                        </span>
                      </td>
                      <td data-label="Fecha Salida">
                        <time
                          className="cotizaciones-fecha"
                          dateTime={cotizacion.fecha_salida}
                        >
                          {formatearFecha(cotizacion.fecha_salida)}
                        </time>
                      </td>
                      <td data-label="Fecha Regreso">
                        <time className="cotizaciones-fecha">
                          {cotizacion.modo === "itinerario"
                            ? (() => {
                              const stops = Array.isArray(cotizacion.stops)
                                ? cotizacion.stops
                                : (() => { try { return JSON.parse(cotizacion.stops || "[]"); } catch { return []; } })();
                              const ultimo = stops[stops.length - 1];
                              return ultimo?.fecha_salida ? formatearFecha(ultimo.fecha_salida) : "-";
                            })()
                            : formatearFecha(cotizacion.fecha_regreso)
                          }
                        </time>
                      </td>
                      <td data-label="Origen">
                        <span className="cotizaciones-destino">
                          {cotizacion.origen || "Sin origen"}
                        </span>
                      </td>
                      <td data-label="Destino">
                        <span className="cotizaciones-destino">
                          {cotizacion.modo === "itinerario"
                            ? (() => {
                              const stops = Array.isArray(cotizacion.stops)
                                ? cotizacion.stops
                                : (() => { try { return JSON.parse(cotizacion.stops || "[]"); } catch { return []; } })();
                              return stops.length > 0
                                ? stops.map(s => s.destino).join(" → ")
                                : cotizacion.destino || "Sin destino";
                            })()
                            : cotizacion.destino || "Sin destino"
                          }
                        </span>
                      </td>
                      <td data-label="Acciones">
                        <div
                          className="cotizaciones-botones-accion"
                          role="group"
                          aria-label="Acciones de cotización"
                        >
                          <button
                            type="button"
                            className="cotizaciones-boton-accion cotizaciones-ver"
                            onClick={() => manejarAccionVer(cotizacion)}
                            aria-label={`Ver cotización ${cotizacion.folio || cotizacion.id
                              }`}
                            title="Ver cotización"
                          >
                            <Eye size={16} aria-hidden="true" />
                            <span className="sr-only">Ver</span>
                          </button>
                          <button
                            type="button"
                            className="cotizaciones-boton-accion cotizaciones-descargar"
                            onClick={() => manejarDescargarWord(cotizacion)}
                            title="Descargar cotización Word"
                          >
                            <FileText size={16} aria-hidden="true" />
                            <span className="sr-only">Word</span>
                          </button>
                          {(permisos.includes('ventas.cotizaciones.editar') || rolUsuario === "admin") && (
                            <button
                              type="button"
                              className="cotizaciones-boton-accion cotizaciones-editar"
                              onClick={() => manejarAccionEditar(cotizacion)}
                              aria-label={`Editar cotización ${cotizacion.folio || cotizacion.id
                                }`}
                              title="Editar cotización"
                            >
                              <Edit size={16} aria-hidden="true" />
                              <span className="sr-only">Editar</span>
                            </button>
                          )}
                          {(permisos.includes('ventas.cotizaciones.eliminar') || rolUsuario === "admin") && (
                            <button
                              type="button"
                              className="cotizaciones-boton-accion cotizaciones-eliminar"
                              onClick={() => manejarAccionEliminar(cotizacion)}
                              aria-label={`Eliminar cotización ${cotizacion.folio || cotizacion.id
                                }`}
                              title="Eliminar cotización"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                              <span className="sr-only">Eliminar</span>
                            </button>
                          )}
                          <button
                            className="cotizaciones-boton-accion cotizaciones-pago"
                            onClick={() => manejarAccionCrearPago(cotizacion)}
                            title="Crear plan de pago"
                            style={{
                              background:
                                "linear-gradient(45deg, #10b981, #059669)",
                              color: "white",
                            }}
                          >
                            <DollarSign size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <footer className="cotizaciones-pie-tabla" role="contentinfo">
            <div
              className="cotizaciones-informacion-registros"
              aria-live="polite"
              aria-atomic="true"
            >
              Mostrando registros del {datosePaginacion.indiceInicio + 1} al{" "}
              {Math.min(
                datosePaginacion.indiceFin,
                datosePaginacion.totalRegistros
              )}{" "}
              de un total de {datosePaginacion.totalRegistros} registros
              {terminoBusqueda && (
                <span style={{ color: "#6c757d", marginLeft: "0.5rem" }}>
                  (filtrado de {cotizaciones.length} registros totales)
                </span>
              )}
            </div>

            <nav
              className="cotizaciones-controles-paginacion"
              aria-label="Paginación de tabla"
            >
              <button
                type="button"
                className="cotizaciones-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                aria-label="Ir a página anterior"
              >
                <ChevronLeft size={18} aria-hidden="true" />
                Anterior
              </button>

              <div
                className="cotizaciones-numeros-paginacion"
                role="group"
                aria-label="Páginas"
              >
                {numerosPaginas.map((numero) => (
                  <button
                    key={`pagina-${numero}`}
                    type="button"
                    className={`cotizaciones-numero-pagina ${paginaActual === numero ? "cotizaciones-activo" : ""
                      }`}
                    onClick={() => cambiarPagina(numero)}
                    aria-label={`Ir a página ${numero}`}
                    aria-current={paginaActual === numero ? "page" : undefined}
                  >
                    {numero}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="cotizaciones-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === datosePaginacion.totalPaginas}
                aria-label="Ir a página siguiente"
              >
                Siguiente
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </nav>
          </footer>
        </section>
      ) : (
        <section
          className="cotizaciones-contenedor-tabla"
          aria-label="Estado sin datos"
        >
          <div
            className="cotizaciones-tabla-vacia"
            role="status"
            aria-live="polite"
          >
            <FileText
              className="cotizaciones-icono-vacio"
              size={48}
              aria-hidden="true"
            />
            <p>No hay cotizaciones registradas</p>
          </div>

          <footer className="cotizaciones-pie-tabla" role="contentinfo">
            <div className="cotizaciones-informacion-registros">
              Sin elementos
            </div>
            <nav
              className="cotizaciones-controles-paginacion"
              aria-label="Paginación deshabilitada"
            >
              <button
                type="button"
                className="cotizaciones-boton-paginacion"
                disabled
                aria-label="Página anterior no disponible"
              >
                <ChevronLeft size={18} aria-hidden="true" />
                Anterior
              </button>
              <div className="cotizaciones-numeros-paginacion">
                <button
                  type="button"
                  className="cotizaciones-numero-pagina cotizaciones-activo"
                  disabled
                  aria-current="page"
                  aria-label="Página 1 de 1"
                >
                  1
                </button>
              </div>
              <button
                type="button"
                className="cotizaciones-boton-paginacion"
                disabled
                aria-label="Página siguiente no disponible"
              >
                Siguiente
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </nav>
          </footer>
        </section>
      )}
      <ModalVerCotizacion
        estaAbierto={modalVerAbierto}
        cotizacion={cotizacionSeleccionada}
        alCerrar={cerrarModal}
      />

      {modalDescargaAbierto && cotizacionDescarga && (
        <div
          className="modal-descarga-word-overlay"
          onClick={() => setModalDescargaAbierto(false)}
        >
          <div
            className="modal-descarga-word-contenedor"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado */}
            <div className="modal-descarga-word-encabezado">
              <div>
                <h3 className="modal-descarga-word-titulo">Descargar Cotización</h3>
                <p className="modal-descarga-word-subtitulo">
                  Folio: {cotizacionDescarga.folio}
                </p>
              </div>
              <button
                className="modal-descarga-word-boton-cerrar-header"
                onClick={() => setModalDescargaAbierto(false)}
              >
                ✕
              </button>
            </div>

            {/* Cuerpo */}
            <div className="modal-descarga-word-cuerpo">
              <p className="modal-descarga-word-descripcion">
                Selecciona qué versión deseas descargar:
              </p>

              <button
                className="btn-descarga-todos"
                onClick={() => descargarWord(cotizacionDescarga)}
              >
                📄 Todos los vehículos
              </button>

              {(() => {
                const lista = (() => {
                  try {
                    const parsed =
                      typeof cotizacionDescarga.lista === "string"
                        ? JSON.parse(cotizacionDescarga.lista)
                        : cotizacionDescarga.lista;
                    return parsed?.cotizaciones_todos_vehiculos ?? [];
                  } catch { return []; }
                })();

                if (lista.length === 0) return null;

                return (
                  <>
                    <div className="modal-descarga-word-separador">o elige un vehículo</div>
                    {lista.map((veh) => (
                      <button
                        key={veh.vehiculo_id}
                        className="btn-descarga-vehiculo"
                        onClick={() => descargarWord(cotizacionDescarga, veh.vehiculo_id)}
                      >
                        <span className="btn-descarga-vehiculo-nombre">
                          {veh.vehiculo_nombre}
                        </span>
                        <span className="btn-descarga-vehiculo-detalle">
                          Capacidad: {veh.capacidad_pasajeros} pasajeros
                        </span>
                        <span className="btn-descarga-vehiculo-precio">
                          ${veh.costos.total_con_iva?.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })} MXN (IVA incluido)
                        </span>
                      </button>
                    ))}
                  </>
                );
              })()}

              <button
                className="btn-descarga-cancelar"
                onClick={() => setModalDescargaAbierto(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {cotizacionAEliminar && (
        <ModalEliminarCotizacion
          cotizacion={cotizacionAEliminar}
          alConfirmar={manejarEliminarCotizacion}
        />
      )}

      <ModalCrearPagoDesdeCotizacion
        estaAbierto={modalPagoAbierto}
        cotizacion={cotizacionParaPago}
        alCerrar={cerrarModalPago}
        alGuardar={alGuardarPago}
      />
    </main>
  );
};

TablaCotizacion.propTypes = {
  cotizaciones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      folio: PropTypes.string,
      fecha_salida: PropTypes.string,
      fecha_regreso: PropTypes.string,
      origen: PropTypes.string,
      destino: PropTypes.string,
    })
  ),
  cargando: PropTypes.bool,
  onEditar: PropTypes.func,
  onEliminar: PropTypes.func,
  botonNuevaCotizacion: PropTypes.node,
};

TablaCotizacion.defaultProps = {
  cotizaciones: [],
  cargando: false,
  onEditar: null,
  onEliminar: null,
  botonNuevaCotizacion: null,
};

export default TablaCotizacion;
