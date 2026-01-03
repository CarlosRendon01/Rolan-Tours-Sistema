import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  BarChart3,
  CheckCircle,
  DollarSign,
  Filter,
  XCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import "./TablaFacturas.css";
import {
  generarPDFFacturaTimbrada,
  imprimirFacturaTimbrada,
} from "../ModalesFactura/generarPDFFacturaTimbrada";
import { modalEliminarFactura } from "../ModalesFactura/ModalEliminarFactura";
import ModalRegenerarFactura from "../ModalesFactura/ModalRegenerarFactura";
import ModalEliminarDefinitivoFactura from "../ModalesFactura/ModalEliminarDefinitivoFactura";

const ESTADOS_FACTURA = {
  TIMBRADA: "TIMBRADA",
  CANCELADA: "CANCELADA",
};

const TablaFacturas = ({
  vistaActual,
  onCambiarVista,
  onEliminar = null,
  onRegenerar = null,
  onEliminarDefinitivo = null,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [cargando, setCargando] = useState(false);
  const [mostrarEliminados, setMostrarEliminados] = useState(false);
  const [rolUsuario] = useState(localStorage.getItem("rol") || "vendedor");
  const [modalRegenerarAbierto, setModalRegenerarAbierto] = useState(false);
  const [modalEliminarDefinitivoAbierto, setModalEliminarDefinitivoAbierto] =
    useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [datosFacturas, setdatosFacturas] = useState([]);

  const API_URL = "http://127.0.0.1:8000/api/facturas";

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const facturas = res.data.data || [];
      setdatosFacturas(facturas);
    } catch (error) {
      console.error("Error al cargar facturas:", error);
    }
  };

  const datosSegunRol = useMemo(() => {
    if (rolUsuario === "admin") {
      if (mostrarEliminados === true) {
        return datosFacturas.filter((f) => f.activo === false);
      }
      if (mostrarEliminados === false) {
        return datosFacturas.filter((f) => f.activo === true);
      }
      return datosFacturas;
    } else {
      return datosFacturas.filter((f) => f.activo === true);
    }
  }, [datosFacturas, rolUsuario, mostrarEliminados]);

  const estadisticas = useMemo(() => {
    const datos = rolUsuario === "admin" ? datosFacturas : datosSegunRol;
    const totalFacturas = datos.length;
    const timbradas = datos.filter(
      (f) => f.estado === ESTADOS_FACTURA.TIMBRADA && f.activo === true
    ).length;
    const canceladas = datos.filter(
      (f) => f.estado === ESTADOS_FACTURA.CANCELADA && f.activo === true
    ).length;
    const eliminadas = datos.filter((f) => f.activo === false).length;

    const montoTotal = datos
      .filter((f) => f.estado === ESTADOS_FACTURA.TIMBRADA && f.activo === true)
      .reduce((total, factura) => total + factura.monto, 0);

    return { totalFacturas, timbradas, canceladas, eliminadas, montoTotal };
  }, [datosFacturas, datosSegunRol, rolUsuario]);

  const datosFiltrados = useMemo(() => {
    let datos = [...datosSegunRol];

    if (terminoBusqueda) {
      datos = datos.filter((factura) => {
        const searchTerm = terminoBusqueda.toLowerCase();
        return (
          factura.cliente.toLowerCase().includes(searchTerm) ||
          factura.id.toString().includes(searchTerm) ||
          factura.numeroFactura.toLowerCase().includes(searchTerm) ||
          factura.rfc.toLowerCase().includes(searchTerm) ||
          factura.uuid.toLowerCase().includes(searchTerm)
        );
      });
    }

    if (filtroEstado !== "todos") {
      datos = datos.filter(
        (factura) => factura.estado.toLowerCase() === filtroEstado.toLowerCase()
      );
    }

    return datos;
  }, [datosSegunRol, terminoBusqueda, filtroEstado]);

  const totalRegistros = datosFiltrados.length;
  const totalPaginas = Math.max(
    1,
    Math.ceil(totalRegistros / registrosPorPagina)
  );
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = Math.min(
    indiceInicio + registrosPorPagina,
    totalRegistros
  );
  const datosPaginados = datosFiltrados.slice(indiceInicio, indiceFinal);

  const cambiarPagina = useCallback(
    (nuevaPagina) => {
      if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        setPaginaActual(nuevaPagina);
      }
    },
    [totalPaginas]
  );

  const manejarCambioRegistros = useCallback((evento) => {
    setRegistrosPorPagina(parseInt(evento.target.value));
    setPaginaActual(1);
  }, []);

  const manejarBusqueda = useCallback((evento) => {
    setTerminoBusqueda(evento.target.value);
    setPaginaActual(1);
  }, []);

  const manejarCambioFiltro = useCallback((evento) => {
    setFiltroEstado(evento.target.value);
    setPaginaActual(1);
  }, []);

  const abrirModalRegenerar = (factura) => {
    setFacturaSeleccionada(factura);
    setModalRegenerarAbierto(true);
  };

  const abrirModalEliminarDefinitivo = (factura) => {
    setFacturaSeleccionada(factura);
    setModalEliminarDefinitivoAbierto(true);
  };

  const manejarRegenerar = async (factura, motivo) => {
    try {
      await cargarFacturas();
      if (onRegenerar) {
        await onRegenerar(factura, motivo);
      }
    } catch (error) {
      console.error("Error al regenerar:", error);
    }
  };

  const manejarEliminarDefinitivo = async (factura, motivo) => {
    try {
      await cargarFacturas();
      if (onEliminarDefinitivo) {
        await onEliminarDefinitivo(factura, motivo);
      }
    } catch (error) {
      console.error("Error al eliminar definitivamente:", error);
    }
  };

  const manejarAccion = useCallback(
    async (accion, factura) => {
      setCargando(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        switch (accion) {
          case "descargar":
            await generarPDFFacturaTimbrada(factura);
            break;

          case "descargarExcel":
            try {
              const token = localStorage.getItem("token");
              const response = await axios.get(
                `http://127.0.0.1:8000/api/facturas/${factura.id}/descargar-excel`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  responseType: "blob",
                }
              );

              const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });

              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              const fileName = `Factura_${factura.numeroFactura}.xlsx`;
              link.setAttribute("download", fileName);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);

              alert(`✅ Excel descargado exitosamente:\n${fileName}`);
            } catch (error) {
              console.error("❌ Error al descargar Excel:", error);
              if (error.response?.data instanceof Blob) {
                const text = await error.response.data.text();
                console.error("❌ Error del servidor:", text);
                try {
                  const errorJson = JSON.parse(text);
                  alert(
                    `Error: ${errorJson.message || errorJson.error || text}`
                  );
                } catch {
                  alert(`Error al descargar: ${text}`);
                }
              } else {
                alert(
                  "Error al descargar el archivo Excel: " +
                    (error.response?.data?.message || error.message)
                );
              }
            }
            break;

          case "eliminar":
            setCargando(false);
            const confirmado = await modalEliminarFactura(factura, async () => {
              await cargarFacturas();
            });
            if (confirmado) {
              await cargarFacturas();
            }
            return;

          case "imprimir":
            imprimirFacturaTimbrada(factura);
            break;

          default:
            break;
        }
      } catch (err) {
        console.error(`Error al ${accion}:`, err);
        alert(`Error al ${accion}: ${err.message}`);
      } finally {
        setCargando(false);
      }
    },
    [onEliminar]
  );

  const obtenerClaseEstado = useCallback((estado, activo) => {
    if (activo === false) {
      return "facturas-estado-eliminado";
    }
    switch (estado) {
      case ESTADOS_FACTURA.TIMBRADA:
        return "facturas-estado-pagado";
      case ESTADOS_FACTURA.CANCELADA:
        return "facturas-estado-vencido";
      default:
        return "facturas-estado-pagado";
    }
  }, []);

  const generarNumerosPaginacion = useCallback(() => {
    const numeros = [];
    const maximoVisibles = 5;

    if (totalPaginas <= maximoVisibles) {
      for (let i = 1; i <= totalPaginas; i++) {
        numeros.push(i);
      }
    } else {
      if (paginaActual <= 3) {
        for (let i = 1; i <= 4; i++) {
          numeros.push(i);
        }
        numeros.push("...");
        numeros.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        numeros.push(1);
        numeros.push("...");
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
          numeros.push(i);
        }
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
  }, [paginaActual, totalPaginas]);

  return (
    <div
      className={`facturas-contenedor-principal ${
        cargando ? "facturas-cargando" : ""
      }`}
    >
      <div className="facturas-encabezado">
        <div className="facturas-seccion-logo">
          <div className="facturas-icono-principal">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="facturas-titulo">Registro de Facturas</h1>
            <p className="facturas-subtitulo">
              {mostrarEliminados
                ? "Facturas eliminadas"
                : "Consulta de facturas emitidas y timbradas"}
            </p>
          </div>
        </div>

        <div className="facturas-estadisticas-header">
          <div className="facturas-tarjeta-estadistica total">
            <BarChart3 className="facturas-icono-estadistica" size={20} />
            <span className="facturas-valor-estadistica">
              {estadisticas.totalFacturas}
            </span>
            <span className="facturas-etiqueta-estadistica">Total</span>
          </div>
          <div className="facturas-tarjeta-estadistica pagados">
            <CheckCircle className="facturas-icono-estadistica" size={20} />
            <span className="facturas-valor-estadistica">
              {estadisticas.timbradas}
            </span>
            <span className="facturas-etiqueta-estadistica">Activas</span>
          </div>
          <div className="facturas-tarjeta-estadistica vencidos">
            <XCircle className="facturas-icono-estadistica" size={20} />
            <span className="facturas-valor-estadistica">
              {estadisticas.canceladas}
            </span>
            <span className="facturas-etiqueta-estadistica">Canceladas</span>
          </div>
          {rolUsuario === "admin" && (
            <div className="facturas-tarjeta-estadistica eliminados">
              <Trash2 className="facturas-icono-estadistica" size={20} />
              <span className="facturas-valor-estadistica">
                {estadisticas.eliminadas}
              </span>
              <span className="facturas-etiqueta-estadistica">Eliminadas</span>
            </div>
          )}
          <div className="facturas-tarjeta-estadistica pendientes">
            <DollarSign className="facturas-icono-estadistica" size={20} />
            <span className="facturas-valor-estadistica">
              $
              {(estadisticas?.montoTotal ?? 0).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="facturas-etiqueta-estadistica">Facturado</span>
          </div>
        </div>
      </div>

      <div className="facturas-controles">
        <div className="facturas-seccion-izquierda">
          <div className="facturas-control-registros">
            <label htmlFor="registros">Mostrar</label>
            <select
              id="registros"
              value={registrosPorPagina}
              onChange={manejarCambioRegistros}
              className="facturas-selector-registros"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>registros</span>
          </div>

          <div className="facturas-filtro-estado">
            <Filter size={16} />
            <label htmlFor="filtro-estado">Estado:</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={manejarCambioFiltro}
              className="facturas-selector-filtro"
            >
              <option value="todos">Todas</option>
              <option value="timbrada">Activas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          <div className="facturas-filtro-estado">
            <Filter size={16} />
            <label htmlFor="filtro-vista">Vista:</label>
            <select
              id="filtro-vista"
              value={vistaActual}
              onChange={onCambiarVista}
              className="facturas-selector-filtro"
            >
              <option value="pagos">Gestión de Pagos</option>
              <option value="abonos">Pagos por Abonos</option>
              <option value="recibos">Gestión de Recibos</option>
              <option value="facturas">Registro de Facturas</option>
            </select>
          </div>
          {rolUsuario === "admin" && (
            <div className="facturas-filtro-estado">
              <Filter size={16} />
              <label htmlFor="filtro-activo">Mostrar:</label>
              <select
                id="filtro-activo"
                value={mostrarEliminados ? "eliminados" : "activos"}
                onChange={(e) => {
                  const valor = e.target.value;
                  setMostrarEliminados(valor === "eliminados");
                }}
                className="facturas-selector-filtro"
              >
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="eliminados">Eliminados</option>
              </select>
            </div>
          )}
        </div>

        <div className="facturas-seccion-derecha">
          <div className="facturas-control-busqueda">
            <input
              type="text"
              id="buscar"
              placeholder="Buscar cliente, factura, RFC, UUID..."
              value={terminoBusqueda}
              onChange={manejarBusqueda}
              className="facturas-entrada-buscar"
            />
            <Search className="facturas-icono-buscar" size={18} />
          </div>
        </div>
      </div>

      <div className="facturas-contenedor-tabla">
        {datosPaginados.length === 0 ? (
          <div className="facturas-estado-vacio">
            <div className="facturas-icono-vacio">
              <FileText size={64} />
            </div>
            <h3 className="facturas-mensaje-vacio">
              No se encontraron facturas
            </h3>
            <p className="facturas-submensaje-vacio">
              {terminoBusqueda || filtroEstado !== "todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : mostrarEliminados
                ? "No hay facturas eliminadas en el sistema"
                : "No hay facturas registradas en el sistema"}
            </p>
          </div>
        ) : (
          <table className="facturas-tabla">
            <thead>
              <tr className="facturas-fila-encabezado">
                <th>Factura</th>
                <th>Cliente</th>
                <th>RFC</th>
                <th>Monto</th>
                <th>Fecha Emisión</th>
                <th>UUID</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((factura, indice) => (
                <tr
                  key={factura.id}
                  className={`facturas-fila-pago ${
                    !factura.activo ? "facturas-fila-eliminada" : ""
                  }`}
                  style={{ animationDelay: `${indice * 0.05}s` }}
                >
                  <td data-label="Factura" className="facturas-columna-factura">
                    <div className="facturas-info-factura">
                      <span className="facturas-numero-factura">
                        {factura.numeroFactura}
                      </span>
                      <span className="facturas-serie-folio">
                        Serie {factura.serie} - Folio {factura.folio}
                      </span>
                      {!factura.activo && (
                        <span className="facturas-badge-eliminado-mini">
                          <Trash2 size={10} />
                          Eliminada
                        </span>
                      )}
                    </div>
                  </td>
                  <td data-label="Cliente" className="facturas-columna-cliente">
                    {factura.cliente}
                  </td>
                  <td data-label="RFC" className="facturas-columna-factura">
                    {factura.rfc}
                  </td>
                  <td data-label="Monto" className="facturas-columna-monto">
                    $
                    {(factura.monto ?? 0).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td data-label="Fecha Emisión">
                    <div className="facturas-info-fechas">
                      <span>{factura.fechaEmision}</span>
                      {factura.estado === ESTADOS_FACTURA.CANCELADA &&
                        factura.fechaCancelacion && (
                          <span className="facturas-fecha-cancelacion">
                            Cancelada: {factura.fechaCancelacion}
                          </span>
                        )}
                      {!factura.activo && factura.fechaEliminacion && (
                        <span className="facturas-fecha-eliminacion">
                          Eliminada: {factura.fechaEliminacion}
                        </span>
                      )}
                    </div>
                  </td>
                  <td data-label="UUID">
                    <div
                      className="facturas-uuid-contenedor"
                      title={factura.uuid}
                    >
                      {factura.uuid}
                    </div>
                  </td>
                  <td data-label="Estado">
                    <span
                      className={`facturas-badge-estado ${obtenerClaseEstado(
                        factura.estado,
                        factura.activo
                      )}`}
                    >
                      <span className="facturas-indicador-estado"></span>
                      {factura.activo === false ? "Eliminada" : factura.estado}
                    </span>
                  </td>
                  <td
                    data-label="Acciones"
                    className="facturas-columna-acciones"
                  >
                    <div className="facturas-botones-accion">
                      {factura.activo === true ? (
                        <>
                          <button
                            className="facturas-boton-accion facturas-ver"
                            onClick={() => manejarAccion("descargar", factura)}
                            title="Descargar PDF"
                            disabled={cargando}
                          >
                            <Download size={14} />
                          </button>

                          <button
                            className="recibos-boton-accion recibos-excel"
                            onClick={() =>
                              manejarAccion("descargarExcel", factura)
                            }
                            title="Descargar Excel"
                            disabled={cargando}
                          >
                            <FileText size={16} />
                          </button>

                          <button
                            className="facturas-boton-accion facturas-eliminar"
                            onClick={() => manejarAccion("eliminar", factura)}
                            title="Eliminar factura"
                            disabled={cargando}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : factura.activo === false && rolUsuario === "admin" ? (
                        <>
                          <button
                            className="facturas-boton-accion facturas-regenerar"
                            onClick={() => abrirModalRegenerar(factura)}
                            title="Regenerar factura"
                            disabled={cargando}
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            className="facturas-boton-accion facturas-eliminar-definitivo"
                            onClick={() =>
                              abrirModalEliminarDefinitivo(factura)
                            }
                            title="Eliminar definitivamente"
                            disabled={cargando}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {datosPaginados.length > 0 && (
        <div className="facturas-pie-tabla">
          <div className="facturas-informacion-registros">
            Mostrando <strong>{indiceInicio + 1}</strong> a{" "}
            <strong>{indiceFinal}</strong> de <strong>{totalRegistros}</strong>{" "}
            registros
            {(terminoBusqueda || filtroEstado !== "todos") && (
              <span className="facturas-filtrado-info">
                (filtrado de {datosFacturas.length} registros totales)
              </span>
            )}
          </div>

          <div className="facturas-controles-paginacion">
            <button
              className="facturas-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1 || cargando}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="facturas-numeros-paginacion">
              {generarNumerosPaginacion().map((numero, indice) =>
                numero === "..." ? (
                  <span
                    key={`ellipsis-${indice}`}
                    className="facturas-ellipsis"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={numero}
                    className={`facturas-numero-pagina ${
                      paginaActual === numero ? "facturas-activo" : ""
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
              className="facturas-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas || cargando}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {modalRegenerarAbierto && facturaSeleccionada && (
        <ModalRegenerarFactura
          factura={facturaSeleccionada}
          onConfirmar={manejarRegenerar}
          onCerrar={() => {
            setModalRegenerarAbierto(false);
            setFacturaSeleccionada(null);
          }}
          isOpen={modalRegenerarAbierto}
        />
      )}

      {modalEliminarDefinitivoAbierto && facturaSeleccionada && (
        <ModalEliminarDefinitivoFactura
          factura={facturaSeleccionada}
          onConfirmar={manejarEliminarDefinitivo}
          onCerrar={() => {
            setModalEliminarDefinitivoAbierto(false);
            setFacturaSeleccionada(null);
          }}
          isOpen={modalEliminarDefinitivoAbierto}
        />
      )}
    </div>
  );
};

export default TablaFacturas;
