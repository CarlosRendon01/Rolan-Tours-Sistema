import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Receipt,
  Download,
  Printer,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  X,
  FileSpreadsheet,
  RefreshCw,
  Shield,
} from "lucide-react";
import "./TablaRecibos.css";
import {
  generarPDFRecibo,
  imprimirRecibo,
} from "../ModalesRecibos/generarPDFRecibo";
import writtenNumber from "written-number";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { modalEliminarRecibo } from "../ModalesRecibos/ModalEliminarRecibo";
import ModalRegenerarRecibo from "../ModalesRecibos/ModalRegenerarRecibo";
import ModalEliminarDefinitivo from "../ModalesRecibos/ModalEliminarDefinitivo";
import ModalVisualizarPDF from "../Modales/ModalVisualizarPDF";

const TablaRecibos = ({
  datosIniciales = [],
  vistaActual = "recibos",
  onCambiarVista = () => {},
  onEliminar = null,
  onDescargar = null,
  onImprimir = null,
  onRegenerar = null,
  onEliminarDefinitivo = null,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarEliminados, setMostrarEliminados] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const [rolUsuario] = useState(localStorage.getItem("rol") || "vendedor");
  // Estados para modales
  const [modalRegenerarAbierto, setModalRegenerarAbierto] = useState(false);
  const [modalEliminarDefinitivoAbierto, setModalEliminarDefinitivoAbierto] =
    useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);

  const [modalPDFAbierto, setModalPDFAbierto] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [reciboPDFActual, setReciboPDFActual] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/abonos"; // Ajusta al dominio/backend real

  // Datos de ejemplo mejorados
  const [datosRecibos, setdatosRecibos] = useState([]);

  useEffect(() => {
    cargarRecibos();
  }, []);

  const cargarRecibos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const recibos = res.data.data || [];
      setdatosRecibos(recibos);
      console.log("Recibos cargadas:", recibos);
    } catch (error) {
      console.error("Error al cargar recibos:", error);
    }
  };

  // Formatear moneda
  const formatearMoneda = useCallback((monto) => {
    if (typeof monto === "string") {
      monto = parseFloat(monto.replace(/[$,]/g, ""));
    }
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(monto || 0);
  }, []);

  // Formatear fecha
  const formatearFecha = useCallback((fecha) => {
    try {
      const date = new Date(fecha);
      return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    } catch {
      return fecha;
    }
  }, []);

  // Filtrar datos según rol y vista
  const datosSegunRol = useMemo(() => {
    if (rolUsuario !== "admin") {
      // Vendedor solo ve activos
      return datosRecibos.filter((r) => r.activo === true);
    }

    switch (filtroEstado) {
      case "activos":
        return datosRecibos.filter((r) => r.activo === true);
      case "eliminados":
        return datosRecibos.filter((r) => r.activo === false);
      default:
        return datosRecibos; // todos
    }
  }, [datosRecibos, rolUsuario, filtroEstado]);

  // Cálculo de estadísticas
  const estadisticas = useMemo(() => {
    const datos = rolUsuario === "admin" ? datosRecibos : datosSegunRol;
    const totalRecibos = datos.length;
    const emitidos = datos.filter(
      (r) => r.estado === "Emitido" && r.activo === true
    ).length;
    const cancelados = datos.filter(
      (r) => r.estado === "Cancelado" && r.activo === true
    ).length;
    const eliminados = datos.filter((r) => r.activo === false).length;

    const montoTotal = datos.reduce((total, recibo) => {
      const monto =
        typeof recibo.monto === "number"
          ? recibo.monto
          : parseFloat(recibo.monto?.replace(/[$,]/g, "") || 0);
      return total + monto;
    }, 0);

    const montoEmitidos = datos
      .filter((r) => r.estado === "Emitido" && r.activo === true)
      .reduce((total, recibo) => {
        const monto =
          typeof recibo.monto === "number"
            ? recibo.monto
            : parseFloat(recibo.monto?.replace(/[$,]/g, "") || 0);
        return total + monto;
      }, 0);

    return {
      totalRecibos,
      emitidos,
      cancelados,
      eliminados,
      montoTotal,
      montoEmitidos,
    };
  }, [datosRecibos, datosSegunRol, rolUsuario]);

  // Filtrar datos según búsqueda
  const datosFiltrados = useMemo(() => {
    let datos = [...datosSegunRol];

    if (terminoBusqueda) {
      datos = datos.filter((recibo) => {
        const searchTerm = terminoBusqueda.toLowerCase();
        return (
          recibo.cliente?.toLowerCase().includes(searchTerm) ||
          recibo.id?.toString().includes(searchTerm) ||
          recibo.numeroRecibo?.toLowerCase().includes(searchTerm) ||
          recibo.concepto?.toLowerCase().includes(searchTerm) ||
          recibo.metodoPago?.toLowerCase().includes(searchTerm)
        );
      });
    }

    return datos;
  }, [datosSegunRol, terminoBusqueda]);

  // Calcular paginación
  const totalRegistros = datosFiltrados.length;
  const totalPaginas = Math.max(
    1,
    Math.ceil(totalRegistros / (registrosPorPagina || 1))
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
    const valor = parseInt(evento.target.value) || 10;
    setRegistrosPorPagina(valor);
    setPaginaActual(1);
  }, []);

  const manejarBusqueda = useCallback((evento) => {
    setTerminoBusqueda(evento.target.value);
    setPaginaActual(1);
  }, []);

  const limpiarBusqueda = useCallback(() => {
    setTerminoBusqueda("");
    setPaginaActual(1);
  }, []);

  // Exportar a CSV
  const exportarCSV = useCallback(() => {
    try {
      const headers = [
        "Recibo",
        "Cliente",
        "Monto",
        "Fecha",
        "Concepto",
        "Método Pago",
        "Estado",
      ];
      if (rolUsuario === "admin" && mostrarEliminados) {
        headers.push("Eliminado Por", "Fecha Eliminación");
      }

      const csv = [
        headers.join(","),
        ...datosFiltrados.map((recibo) => {
          const row = [
            recibo.numeroRecibo,
            `"${recibo.cliente}"`,
            typeof recibo.monto === "number"
              ? recibo.monto
              : recibo.monto?.replace(/[$,]/g, ""),
            recibo.fechaEmision,
            `"${recibo.concepto}"`,
            recibo.metodoPago,
            recibo.estado,
          ];

          if (rolUsuario === "admin" && mostrarEliminados) {
            row.push(recibo.eliminadoPor || "", recibo.fechaEliminacion || "");
          }

          return row.join(",");
        }),
      ].join("\n");

      const blob = new Blob(["\ufeff" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `recibos_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Error al exportar CSV");
      setTimeout(() => setError(null), 3000);
    }
  }, [datosFiltrados, rolUsuario, mostrarEliminados]);

  // Manejadores de modales
  const abrirModalRegenerar = (recibo) => {
    setReciboSeleccionado(recibo);
    setModalRegenerarAbierto(true);
  };

  const abrirModalEliminarDefinitivo = (recibo) => {
    setReciboSeleccionado(recibo);
    setModalEliminarDefinitivoAbierto(true);
  };

  const manejarRegenerar = async (recibo, motivo) => {
    try {
      await cargarRecibos();
      console.log("✅ Recibo regenerado:", recibo.id);

      if (onRegenerar) {
        await onRegenerar(recibo, motivo);
      }
    } catch (error) {
      console.error("Error al regenerar:", error);
    }
  };

  const manejarEliminarDefinitivo = async (recibo) => {
    try {
      await cargarRecibos();
      console.log("✅ Recibo eliminado definitivamente:", recibo.id);

      if (onEliminarDefinitivo) {
        await onEliminarDefinitivo(recibo);
      }
    } catch (error) {
      console.error("Error al eliminar definitivamente:", error);
    }
  };

  const manejarAccion = useCallback(
    async (accion, recibo) => {
      setCargando(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        switch (accion) {
          case "eliminar":
            setCargando(false);
            const confirmado = await modalEliminarRecibo(recibo, async () => {
              await cargarRecibos();
            });
            if (confirmado) {
              await cargarRecibos();
            }
            break;
          case "pdf":
            visualizarPDF(recibo);
            break;
          case "descargar":
            if (onDescargar) {
              await onDescargar(recibo);
            } else {
              await generarPDFRecibo(recibo);
            }
            break;
          case "imprimir":
            if (onImprimir) {
              await onImprimir(recibo);
            } else {
              imprimirRecibo(recibo);
            }
            break;
          default:
            break;
        }
      } catch (err) {
        setError(`Error al ${accion}: ${err.message}`);
        setTimeout(() => setError(null), 3000);
      } finally {
        setCargando(false);
      }
    },
    [onEliminar, onDescargar, onImprimir]
  );

  const obtenerClaseEstado = useCallback((estado, activo) => {
    if (activo === false) {
      return "recibos-estado-eliminado";
    }
    switch (estado?.toLowerCase()) {
      case "emitido":
        return "recibos-estado-emitido";
      case "cancelado":
        return "recibos-estado-cancelado";
      default:
        return "recibos-estado-emitido";
    }
  }, []);

  const cerrarModalPDF = () => {
    setModalPDFAbierto(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setReciboPDFActual(null);
  };

  const generarPDF = async (recibo) => {
    try {
      const plantillaUrl = "/ReciboPago.pdf";
      const plantillaBytes = await fetch(plantillaUrl).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(plantillaBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const dibujar = (texto, x, y, size) => {
        if (texto) {
          firstPage.drawText(texto.toString(), {
            x,
            y,
            size,
            font,
            color: rgb(0, 0, 0),
          });
        }
      };

      const fechaActual = new Date();
      const formatoActual = {
        weeyday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      function capitalize(text) {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
      }

      function numeroAMonedaTexto(valor) {
        const entero = Math.floor(valor);
        const centavos = Math.round((valor - entero) * 100)
          .toString()
          .padStart(2, "0");
        const texto = writtenNumber(entero, { lang: "es" });
        return `${texto} pesos ${centavos}/100 M.N.`;
      }

      const fechaCompleta = fechaActual.toLocaleDateString(
        "es-ES",
        formatoActual
      );

      const campos = [
        { valor: recibo?.cliente, x: 110, y: 247, z: 10 },
        { valor: recibo?.numeroRecibo, x: 500, y: 299, z: 10 },
        { valor: recibo?.id, x: 230, y: 299, z: 10 },
        { valor: recibo?.concepto, x: 180, y: 155, z: 9 },
        { valor: `$ ${recibo?.monto}`, x: 470, y: 153, z: 9 },
        { valor: `$ ${recibo?.monto}`, x: 470, y: 88, z: 9 },
        { valor: `1`, x: 70, y: 153, z: 9 },
        { valor: recibo.cliente?.telefono, x: 100, y: 197, z: 9 },
        {
          valor: `${capitalize(numeroAMonedaTexto(recibo?.monto))}`,
          x: 140,
          y: 88,
          z: 9,
        },

        {
          valor: `Oaxaca de Juárez, Oaxaca a ${fechaCompleta}`,
          x: 290,
          y: 272,
          z: 10,
        },

        //Se dejó los valores de dirección para cuando esté normalizada en un futuro
        // { valor: recibo.calle, x: 180, y: 155 },
        // { valor: recibo.colonia, x: 180, y: 155 },
        // { valor: recibo.numero, x: 180, y: 155 },
        // { valor: recibo.ciudad, x: 180, y: 155 },
      ];

      campos.forEach(({ valor, x, y, z }) => dibujar(valor, x, y, z));

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    }
  };

  const visualizarPDF = async (recibo) => {
    try {
      setReciboPDFActual(recibo);
      setModalPDFAbierto(true);
      setPdfUrl(null);

      const pdfBytes = await generarPDF(recibo);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error al visualizar PDF:", error);
      alert("Error al generar la previsualización del PDF.");
      cerrarModalPDF();
    }
  };

  const descargarPDF = async () => {
    try {
      if (!reciboPDFActual) return;

      const pdfBytes = await generarPDF(reciboPDFActual);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Recibo_${reciboPDFActual.fechaEmision}_${reciboPDFActual.numeroRecibo}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      console.log("PDF descargado correctamente");
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Error al descargar el PDF. Por favor, intente nuevamente.");
    }
  };

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
  }, [totalPaginas, paginaActual]);

  return (
    <div
      className={`recibos-contenedor-principal ${
        cargando ? "recibos-cargando" : ""
      }`}
    >
      {/* Header */}
      <div className="recibos-encabezado">
        <div className="recibos-seccion-logo">
          <div className="recibos-icono-principal">
            <Receipt size={24} />
          </div>
          <div>
            <h1 className="recibos-titulo">Gestión de Recibos</h1>
            <p className="recibos-subtitulo">Comprobantes de pago generados</p>
          </div>
        </div>

        <div className="recibos-estadisticas-header">
          <div className="recibos-tarjeta-estadistica total">
            <BarChart3 className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">
              {estadisticas.totalRecibos}
            </span>
            <span className="recibos-etiqueta-estadistica">Total Recibos</span>
          </div>
          <div className="recibos-tarjeta-estadistica pagados">
            <CheckCircle className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">
              {estadisticas.emitidos}
            </span>
            <span className="recibos-etiqueta-estadistica">Emitidos</span>
          </div>
          <div className="recibos-tarjeta-estadistica cancelados">
            <Clock className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">
              {estadisticas.cancelados}
            </span>
            <span className="recibos-etiqueta-estadistica">Cancelados</span>
          </div>
          {rolUsuario === "admin" && (
            <div className="recibos-tarjeta-estadistica eliminados">
              <Trash2 className="recibos-icono-estadistica" size={20} />
              <span className="recibos-valor-estadistica">
                {estadisticas.eliminados}
              </span>
              <span className="recibos-etiqueta-estadistica">Eliminados</span>
            </div>
          )}
          <div className="recibos-tarjeta-estadistica monto-emitido">
            <Receipt className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">
              {formatearMoneda(estadisticas.montoEmitidos)}
            </span>
            <span className="recibos-etiqueta-estadistica">Monto Emitido</span>
          </div>
        </div>
      </div>

      {/* Alerta de Error */}
      {error && (
        <div className="recibos-alerta-error" role="alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Controles */}
      <div className="recibos-controles">
        <div className="recibos-seccion-izquierda">
          <div className="recibos-control-registros">
            <label htmlFor="registros">Mostrar</label>
            <select
              id="registros"
              value={registrosPorPagina}
              onChange={manejarCambioRegistros}
              className="recibos-selector-registros"
              aria-label="Registros por página"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>registros</span>
          </div>

          <div className="recibos-filtro-estado">
            <label htmlFor="filtro-vista">Vista:</label>
            <select
              id="filtro-vista"
              value={vistaActual}
              onChange={onCambiarVista}
              className="recibos-selector-filtro"
              aria-label="Cambiar vista"
            >
              <option value="pagos">Gestión de Pagos</option>
              <option value="abonos">Pagos por Abonos</option>
              <option value="recibos">Gestión de Recibos</option>
              <option value="facturas">Gestión de Facturas</option>
            </select>
          </div>

          {/* Filtro para admin */}
          {rolUsuario === "admin" && (
            <div className="recibos-filtro-estado-eliminados">
              <label style={{ marginRight: "8px" }}>Mostrar:</label>
              <select
                id="filtro-eliminados"
                value={filtroEstado}
                onChange={(e) => {
                  setFiltroEstado(e.target.value);
                  setPaginaActual(1);
                }}
                className="recibos-selector-filtro"
              >
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="eliminados">Eliminados</option>
              </select>
            </div>
          )}
        </div>

        <div className="recibos-seccion-derecha">
          <div className="recibos-control-busqueda">
            <input
              type="text"
              placeholder="Buscar cliente, recibo, concepto..."
              value={terminoBusqueda}
              onChange={manejarBusqueda}
              className="recibos-entrada-buscar"
              aria-label="Buscar recibos"
            />
            <Search className="recibos-icono-buscar" size={18} />
            {terminoBusqueda && (
              <button
                className="recibos-boton-limpiar"
                onClick={limpiarBusqueda}
                aria-label="Limpiar búsqueda"
                title="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            className="recibos-boton-exportar"
            onClick={exportarCSV}
            aria-label="Exportar a CSV"
            title="Exportar datos a CSV"
          >
            <FileSpreadsheet size={18} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="recibos-contenedor-tabla">
        {datosPaginados.length === 0 ? (
          <div className="recibos-estado-vacio">
            <div className="recibos-icono-vacio">
              <FileText size={64} />
            </div>
            <h3 className="recibos-mensaje-vacio">No se encontraron recibos</h3>
            <p className="recibos-submensaje-vacio">
              {terminoBusqueda
                ? "Intenta ajustar los filtros de búsqueda"
                : filtroEstado === "eliminados"
                ? "No hay recibos eliminados en el sistema"
                : filtroEstado === "activos"
                ? "No hay recibos activos registrados"
                : "No hay recibos registrados en el sistema"}
            </p>
          </div>
        ) : (
          <table className="recibos-tabla">
            <thead>
              <tr className="recibos-fila-encabezado">
                <th>Recibo</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Método Pago</th>
                <th>Estado</th>
                {rolUsuario === "admin" && mostrarEliminados && (
                  <>
                    <th>Eliminado Por</th>
                    <th>Fecha Eliminación</th>
                  </>
                )}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((recibo, indice) => (
                <tr
                  key={recibo.id}
                  className={`recibos-fila-pago ${
                    recibo.activo === false ? "recibos-fila-eliminada" : ""
                  }`}
                  style={{ animationDelay: `${indice * 0.05}s` }}
                >
                  <td data-label="Recibo" className="recibos-columna-factura">
                    {recibo.numeroRecibo}
                  </td>
                  <td data-label="Cliente" className="recibos-columna-cliente">
                    {recibo.cliente}
                  </td>
                  <td data-label="Monto" className="recibos-columna-monto">
                    {formatearMoneda(recibo.monto)}
                  </td>
                  <td data-label="Fecha">
                    {formatearFecha(recibo.fechaEmision)}
                  </td>
                  <td data-label="Concepto">
                    <div
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={recibo.concepto}
                    >
                      {recibo.concepto}
                    </div>
                  </td>
                  <td data-label="Método Pago">{recibo.metodoPago}</td>
                  <td data-label="Estado">
                    <span
                      className={`recibos-badge-estado ${obtenerClaseEstado(
                        recibo.estado,
                        recibo.activo
                      )}`}
                    >
                      <span className="recibos-indicador-estado"></span>
                      {recibo.activo === false ? "Eliminado" : recibo.estado}
                    </span>
                  </td>
                  {rolUsuario === "admin" && mostrarEliminados && (
                    <>
                      <td data-label="Eliminado Por">
                        {recibo.eliminadoPor || "-"}
                      </td>
                      <td data-label="Fecha Eliminación">
                        {recibo.fechaEliminacion
                          ? formatearFecha(recibo.fechaEliminacion)
                          : "-"}
                      </td>
                    </>
                  )}
                  <td
                    data-label="Acciones"
                    className="recibos-columna-acciones"
                  >
                    <div className="recibos-botones-accion">
                      {recibo.activo === false && rolUsuario === "admin" ? (
                        // Botones para recibos eliminados (solo admin)
                        <>
                          <button
                            className="recibos-boton-accion recibos-regenerar"
                            onClick={() => abrirModalRegenerar(recibo)}
                            title="Regenerar recibo"
                            aria-label={`Regenerar recibo ${recibo.numeroRecibo}`}
                            disabled={cargando}
                          >
                            <RefreshCw size={14} />
                          </button>

                          <button
                            className="recibos-boton-accion recibos-eliminar-definitivo"
                            onClick={() => abrirModalEliminarDefinitivo(recibo)}
                            title="Eliminar definitivamente"
                            aria-label={`Eliminar definitivamente ${recibo.numeroRecibo}`}
                            disabled={cargando}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        // Botones normales para recibos activos
                        <>
                          <button
                            className="recibos-boton-accion recibos-pdf"
                            onClick={() => manejarAccion("pdf", recibo)}
                            title="Descargar recibo"
                          >
                            <FileText size={16} />
                          </button>

                          <button
                            className="recibos-boton-accion recibos-eliminar"
                            onClick={() => manejarAccion("eliminar", recibo)}
                            title={
                              rolUsuario === "admin"
                                ? "Eliminar de vista"
                                : "Eliminar recibo"
                            }
                            aria-label={`Eliminar recibo ${recibo.numeroRecibo}`}
                            disabled={cargando}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {datosPaginados.length > 0 && (
        <div className="recibos-pie-tabla">
          <div className="recibos-informacion-registros">
            Mostrando <strong>{indiceInicio + 1}</strong> a{" "}
            <strong>{indiceFinal}</strong> de <strong>{totalRegistros}</strong>{" "}
            registros
            {terminoBusqueda && (
              <span style={{ color: "#6b7280", marginLeft: "0.5rem" }}>
                (filtrado de {datosRecibos.length} registros totales)
              </span>
            )}
          </div>

          <div className="recibos-controles-paginacion">
            <button
              className="recibos-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1 || cargando}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="recibos-numeros-paginacion">
              {generarNumerosPaginacion().map((numero, indice) =>
                numero === "..." ? (
                  <span
                    key={`ellipsis-${indice}`}
                    style={{ padding: "0.5rem", color: "#9ca3af" }}
                    aria-hidden="true"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={numero}
                    className={`recibos-numero-pagina ${
                      paginaActual === numero ? "recibos-activo" : ""
                    }`}
                    onClick={() => cambiarPagina(numero)}
                    disabled={cargando}
                    aria-label={`Página ${numero}`}
                    aria-current={paginaActual === numero ? "page" : undefined}
                  >
                    {numero}
                  </button>
                )
              )}
            </div>

            <button
              className="recibos-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas || cargando}
              aria-label="Página siguiente"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modales */}
      <ModalRegenerarRecibo
        recibo={reciboSeleccionado}
        onConfirmar={manejarRegenerar}
        onCerrar={() => {
          setModalRegenerarAbierto(false);
          setReciboSeleccionado(null);
        }}
        isOpen={modalRegenerarAbierto}
      />

      <ModalVisualizarPDF
        estaAbierto={modalPDFAbierto}
        pdfUrl={pdfUrl}
        recibo={reciboPDFActual}
        alCerrar={cerrarModalPDF}
        alDescargar={descargarPDF}
      />

      <ModalEliminarDefinitivo
        recibo={reciboSeleccionado}
        onConfirmar={manejarEliminarDefinitivo}
        onCerrar={() => {
          setModalEliminarDefinitivoAbierto(false);
          setReciboSeleccionado(null);
        }}
        isOpen={modalEliminarDefinitivoAbierto}
      />
    </div>
  );
};

export default TablaRecibos;
