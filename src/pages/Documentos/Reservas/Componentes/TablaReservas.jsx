import { dateForInput, singleLinePdfText, wrapPdfText } from '../../../../utils/documentFormatting';
import React, { useState } from "react";
import axios from "axios";
import {
  Search,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import "./TablaReservas.css";
import ModalEliminarReserva from "../ModalesReservas/ModalEliminarReserva";
import ModalEditarReserva from "../ModalesReservas/ModalEditarReserva";
import ModalVerReserva from "../ModalesReservas/ModalVerReserva";
import ModalVisualizarPDF from "../ModalesReservas/ModalVisualizarPDF";
import "../ModalesReservas/ModalVisualizarPDF.css";
import { API_CONFIG } from "../../../../config/api";

const TablaReservas = ({
  reservasDatos,
  cargando,
  onRecargar,
}) => {
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [reservaSeleccionado, setReservaSeleccionado] = useState(null);
  const [modalPDFAbierto, setModalPDFAbierto] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [reservaPDFActual, setReservaPDFActual] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [rolUsuario] = useState(localStorage.getItem("rol") || "");
  const [permisos] = useState(localStorage.getItem("permisos") || "");

  const reservasFiltradas = reservasDatos.filter((reserva) => {
    if (!reserva.activo) return false;
    const busqueda = terminoBusqueda.toLowerCase();
    const nombreCliente = String(reserva.nombreCliente ?? "").toLowerCase();

    return (
      nombreCliente.includes(busqueda) ||
      String(reserva.folio ?? "").includes(busqueda) ||
      (reserva.telefono || "").includes(busqueda) ||
      String(reserva.servicio ?? "").toLowerCase().includes(busqueda)
    );
  });

  const totalRegistros = reservasFiltradas.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const reservasPaginadas = reservasFiltradas.slice(indiceInicio, indiceFin);
  const totalReservas = reservasDatos.filter((r) => r.activo).length;
  const reservasPagadas = reservasDatos.filter(
    (r) => r.pagado === "pagado" && r.activo
  ).length;

  const formatearTelefono = (telefono) => {
    if (!telefono) return "N/A";

    const limpio = String(telefono).replace(/\D/g, "");
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(
        3,
        6
      )}-${limpio.substring(6)}`;
    }
    return telefono;
  };

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const obtenerInicialesCliente = (value) => {
    const nombreCompleto = String(value ?? "");
    const palabras = nombreCompleto.split(" ");
    if (palabras.length >= 2) {
      return `${palabras[0].charAt(0)}${palabras[1].charAt(0)}`;
    }
    return nombreCompleto.charAt(0);
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const manejarCambioRegistros = (evento) => {
    setRegistrosPorPagina(parseInt(evento.target.value));
    setPaginaActual(1);
  };

  const manejarBusqueda = (evento) => {
    setTerminoBusqueda(evento.target.value);
    setPaginaActual(1);
  };

  const manejarAccion = (accion, reserva) => {
    switch (accion) {
      case "ver":
        setReservaSeleccionado(reserva);
        setModalVerAbierto(true);
        break;
      case "editar":
        setReservaSeleccionado(reserva);
        setModalEditarAbierto(true);
        break;
      case "pdf":
        visualizarPDF(reserva);
        break;
      case "eliminar":
        setReservaAEliminar(reserva);
        break;
      default:
        break;
    }
  };

  const cerrarModalVer = () => {
    setModalVerAbierto(false);
    setReservaSeleccionado(null);
  };
  const manejarEliminarReserva = async (reserva) => {
    if (!reserva) {
      setReservaAEliminar(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_CONFIG.BASE_URL}/reservas/${reserva.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      await onRecargar();
      setReservaAEliminar(null);
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error al eliminar reserva:", error);
      setReservaAEliminar(null);
      throw error;
    }
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setReservaSeleccionado(null);
  };

  const cerrarModalPDF = () => {
    setModalPDFAbierto(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setReservaPDFActual(null);
  };

  const manejarGuardarReserva = async (datosActualizados) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("_method", "PUT");
      const mapeo = {
        folio: "folio",
        fechaReserva: "fecha_reserva",
        numHabitantes: "num_habitantes",
        nombreCliente: "nombre_cliente",
        numPasajeros: "num_pasajeros",
        telefono: "telefono",
        importe: "importe",
        servicio: "servicio",
        incluye: "incluye",
        noIncluye: "no_incluye",
        formaPago: "forma_pago",
        pagado: "pagado",
        fotoTransferencia: "foto_transferencia",
      };

      Object.keys(datosActualizados).forEach((key) => {
        const backendKey = mapeo[key] || key;
        if (
          datosActualizados[key] !== null &&
          datosActualizados[key] !== undefined &&
          key !== "activo"
        ) {
          formData.append(backendKey, datosActualizados[key]);
        }
      });

      await axios.post(
        `${API_CONFIG.BASE_URL}/reservas/${datosActualizados.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await onRecargar();
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error al actualizar reserva:", error);
      throw error;
    }
  };

  const generarPDF = async (reserva) => {
    try {
      const plantillaUrl = "/HOJARESERVA_ROLAN.pdf";
      const plantillaBytes = await fetch(plantillaUrl).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(plantillaBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const dibujar = (value, x, y, size) => {
        const text = singleLinePdfText(value);
        if (text) firstPage.drawText(text, { x, y, size, font, color: rgb(0,0,0) });
      };
      const date = dateForInput(reserva.fechaReserva);
      const fechaReserva = date ? new Date(`${date}T12:00:00`).toLocaleDateString('es-MX', {year:'numeric',month:'long',day:'numeric'}) : '';
      const importe = reserva.importe == null || reserva.importe === '' ? '' : `$ ${reserva.importe}`;
      [
        { value:reserva.folio, x:495, y:325, size:12 },
        { value:fechaReserva, x:190, y:272, size:11 },
        { value:reserva.numHabitantes, x:486, y:273, size:11 },
        { value:reserva.numPasajeros, x:110, y:208, size:11 },
        { value:reserva.telefono, x:230, y:208, size:11 },
        { value:importe, x:450, y:208, size:11 },
        { value:reserva.nombreCliente, x:108, y:240, size:11 },
      ].forEach(({value,x,y,size}) => dibujar(value,x,y,size));

      const annex = [];
      for (const field of [
        { title:'Servicios', value:reserva.servicio, x:120, y:174 },
        { title:'Incluye', value:reserva.incluye, x:128, y:142 },
        { title:'No incluye', value:reserva.noIncluye, x:130, y:108 },
      ]) {
        const lines = wrapPdfText(field.value,font,9,440);
        lines.slice(0,2).forEach((line,index) => dibujar(line,field.x,field.y-index*12,9));
        if (lines.length>2) annex.push(field.title,...lines,'');
      }
      if (annex.length) {
        dibujar('Ver detalle completo en anexo.',330,35,8);
        const {width,height} = firstPage.getSize();
        const capacity = Math.max(1,Math.floor((height-130)/12));
        for (let start=0;start<annex.length;start+=capacity) {
          const page = pdfDoc.addPage([width,height]);
          page.drawText(`Reserva ${singleLinePdfText(reserva.folio)} - Detalle de servicios`,{x:60,y:height-55,size:12,font:fontBold});
          annex.slice(start,start+capacity).forEach((line,index) => page.drawText(line,{x:60,y:height-85-index*12,size:9,font}));
        }
      }
      const capitalize = (value) => value.charAt(0).toUpperCase()+value.slice(1);
      if (['transferencia','efectivo'].includes(reserva.formaPago)) dibujar(capitalize(reserva.formaPago),158,76,11);
      if (['pagado','no pagado'].includes(reserva.pagado)) dibujar(capitalize(reserva.pagado),358,75,11);

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    }
  };

  const visualizarPDF = async (reserva) => {
    try {
      setReservaPDFActual(reserva);
      setModalPDFAbierto(true);
      setPdfUrl(null);

      const pdfBytes = await generarPDF(reserva);
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
      if (!reservaPDFActual) return;

      const pdfBytes = await generarPDF(reservaPDFActual);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Reserva_${reservaPDFActual.nombreCliente}_${reservaPDFActual.folio}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Error al descargar el PDF. Por favor, intente nuevamente.");
    }
  };
  return (
    <div className="reservas-contenedor-principal tabla-gestion">
      <div className="reservas-encabezado">
        <div className="reservas-seccion-logo">
          <div className="reservas-lineas-decorativas">
            <div className="reservas-linea reservas-azul"></div>
            <div className="reservas-linea reservas-verde"></div>
            <div className="reservas-linea reservas-amarilla"></div>
            <div className="reservas-linea reservas-morada"></div>
          </div>
          <h1 className="reservas-titulo">Gestión de Reservas</h1>
        </div>

        <div className="reservas-contenedor-estadisticas">
          <div className="reservas-estadistica">
            <div className="reservas-icono-estadistica-circular">
              <FileText size={20} />
            </div>
            <div className="reservas-info-estadistica">
              <span className="reservas-label-estadistica">
                TOTAL: {totalReservas}
              </span>
            </div>
          </div>

          <div className="reservas-estadistica">
            <div className="reservas-icono-estadistica-cuadrado">
              <CheckCircle size={20} />
            </div>
            <div className="reservas-info-estadistica">
              <span className="reservas-label-estadistica">
                PAGADAS: {reservasPagadas}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="reservas-controles">
        <div className="reservas-control-registros">
          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="reservas-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="reservas-controles-derecha">
          <div className="reservas-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="reservas-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar reserva..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="reservas-entrada-buscar"
              />
              <Search className="reservas-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="reservas-contenedor-tabla">
        {cargando ? (
          <div className="reservas-estado-cargando">
            <p>
              Cargando reservas{" "}
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
        ) : reservasPaginadas.length === 0 ? (
          <div className="reservas-estado-vacio">
            <div className="reservas-icono-vacio">
              <FileText size={80} strokeWidth={1.5} />
            </div>
            <p className="reservas-mensaje-vacio">No se encontraron reservas</p>
            <p className="reservas-submensaje-vacio">
              {terminoBusqueda
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando una nueva reserva"}
            </p>
          </div>
        ) : (
          <table className="reservas-tabla">
            <thead>
              <tr className="reservas-fila-encabezado">
                <th>FOLIO</th>
                <th>CLIENTE</th>
                <th>FECHA</th>
                <th>PASAJEROS</th>
                <th>IMPORTE</th>
                <th>ESTADO PAGO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {reservasPaginadas.map((reserva, index) => (
                <tr
                  key={reserva.id}
                  className="reservas-fila-reserva"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td data-label="Folio" className="reservas-columna-id">
                    <span className="reservas-badge-id">#{reserva.folio}</span>
                  </td>

                  <td data-label="Cliente" className="reservas-columna-nombre">
                    <div className="reservas-info-reserva">
                      <div className="reservas-avatar">
                        {obtenerInicialesCliente(reserva.nombreCliente)}
                      </div>
                      <div className="reservas-datos-reserva">
                        <span className="reservas-nombre-principal">
                          {reserva.nombreCliente}
                        </span>
                        <span className="reservas-subtexto">
                          {formatearTelefono(reserva.telefono)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td data-label="Fecha" className="reservas-columna-edad">
                    <span className="reservas-badge-edad">
                      <Calendar size={14} style={{ marginRight: "4px" }} />
                      {formatearFecha(reserva.fechaReserva)}
                    </span>
                  </td>

                  <td
                    data-label="Pasajeros"
                    className="reservas-columna-genero"
                  >
                    <span className="reservas-badge-genero masculino">
                      <User size={14} style={{ marginRight: "4px" }} />
                      {reserva.numPasajeros} pax
                    </span>
                  </td>

                  <td
                    data-label="Importe"
                    className="reservas-columna-telefono"
                  >
                    <span className="reservas-valor-telefono">
                      {formatearMoneda(reserva.importe)}
                    </span>
                  </td>

                  <td
                    data-label="Estado Pago"
                    className="reservas-columna-idiomas"
                  >
                    <div className="reservas-badge-idiomas">
                      <span
                        className={`reservas-idioma-tag ${reserva.pagado === "pagado"
                          ? "reservas-pagado"
                          : "reservas-no-pagado"
                          }`}
                      >
                        {reserva.pagado === "pagado" ? (
                          <>
                            <CheckCircle
                              size={14}
                              style={{ marginRight: "4px" }}
                            />
                            PAGADO
                          </>
                        ) : (
                          <>
                            <XCircle size={14} style={{ marginRight: "4px" }} />
                            NO PAGADO
                          </>
                        )}
                      </span>
                    </div>
                  </td>

                  <td
                    data-label="Acciones"
                    className="reservas-columna-acciones"
                  >
                    <div className="reservas-botones-accion">
                      <button
                        className="reservas-boton-accion reservas-ver"
                        onClick={() => manejarAccion("ver", reserva)}
                        title="Ver reserva"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="Ordenes-boton-accion Reservas-descargar"
                        onClick={() => manejarAccion("pdf", reserva)}
                        title="Descargar reserva"
                      >
                        <FileText size={16} />
                      </button>
                      {(permisos.includes("documentos.reservas.editar") || rolUsuario === "admin") && (
                        <button
                          className="reservas-boton-accion reservas-editar"
                          onClick={() => manejarAccion("editar", reserva)}
                          title="Editar reserva"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {(permisos.includes("documentos.reservas.eliminar") || rolUsuario === "admin") && (
                        <button
                          className="reservas-boton-accion reservas-eliminar"
                          onClick={() => manejarAccion("eliminar", reserva)}
                          title="Eliminar reserva"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!cargando && reservasPaginadas.length > 0 && (
        <div className="reservas-pie-tabla">
          <div className="reservas-informacion-registros">
            Mostrando registros del {indiceInicio + 1} al{" "}
            {Math.min(indiceFin, totalRegistros)} de un total de{" "}
            {totalRegistros} registros
            {terminoBusqueda && (
              <span style={{ color: "#6c757d", marginLeft: "0.5rem" }}>
                (filtrado de {reservasDatos.filter((r) => r.activo).length}{" "}
                registros totales)
              </span>
            )}
          </div>

          <div className="reservas-controles-paginacion">
            <button
              className="reservas-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <ChevronLeft size={18} />
              Anterior
            </button>

            <div className="reservas-numeros-paginacion">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (numero) => (
                  <button
                    key={numero}
                    className={`reservas-numero-pagina ${paginaActual === numero ? "reservas-activo" : ""
                      }`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                )
              )}
            </div>

            <button
              className="reservas-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {modalVerAbierto && reservaSeleccionado && (
        <ModalVerReserva
          estaAbierto={modalVerAbierto}
          reserva={reservaSeleccionado}
          onCerrar={cerrarModalVer}
        />
      )}

      <ModalVisualizarPDF
        estaAbierto={modalPDFAbierto}
        pdfUrl={pdfUrl}
        reserva={reservaPDFActual}
        alCerrar={cerrarModalPDF}
        alDescargar={descargarPDF}
      />

      {modalEditarAbierto && reservaSeleccionado && (
        <ModalEditarReserva
          estaAbierto={modalEditarAbierto}
          reserva={reservaSeleccionado}
          onCerrar={cerrarModalEditar}
          onGuardar={manejarGuardarReserva}
        />
      )}

      {reservaAEliminar && (
        <ModalEliminarReserva
          reserva={reservaAEliminar}
          alConfirmar={manejarEliminarReserva}
        />
      )}
    </div>
  );
};

export default TablaReservas;
