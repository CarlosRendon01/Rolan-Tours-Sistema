import React, { useState, useEffect } from "react";
import axios from 'axios';
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

const TablaReservas = () => {
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [reservaSeleccionado, setReservaSeleccionado] = useState(null);
  const [modalPDFAbierto, setModalPDFAbierto] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [reservaPDFActual, setReservaPDFActual] = useState(null);
  const [reservasDatos, setReservasDatos] = useState([]);

  useEffect(() => {
    cargarReservas();
  }, []);

  // ⭐ AGREGAR ESTA FUNCIÓN - Carga datos del backend
  const cargarReservas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/reservas", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      setReservasDatos(response.data);
      console.log('✅ Reservas cargadas:', response.data.length);
    } catch (error) {
      console.error('❌ Error al cargar reservas:', error);
    }
  };

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const reservasFiltradas = reservasDatos.filter((reserva) => {
    if (!reserva.activo) return false;

    const busqueda = terminoBusqueda.toLowerCase();
    const nombreCliente = reserva.nombreCliente.toLowerCase();

    return (
      nombreCliente.includes(busqueda) ||
      reserva.folio.toString().includes(busqueda) ||
      reserva.telefono.includes(busqueda) ||
      reserva.servicio.toLowerCase().includes(busqueda)
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
    const limpio = telefono.replace(/\D/g, "");
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

  const obtenerInicialesCliente = (nombreCompleto) => {
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
      // ⭐ AGREGAR: Eliminar en backend
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/reservas/${reserva.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      // ⭐ AGREGAR: Recargar desde backend
      await cargarReservas();

      setReservaAEliminar(null);
      console.log("✅ Reserva eliminada");
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

      // ⭐ AGREGAR: Crear FormData para enviar al backend
      const formData = new FormData();
      formData.append('_method', 'PUT');

      // Mapear campos camelCase → snake_case
      const mapeo = {
        'folio': 'folio',
        'fechaReserva': 'fecha_reserva',
        'numHabitantes': 'num_habitantes',
        'nombreCliente': 'nombre_cliente',
        'numPasajeros': 'num_pasajeros',
        'telefono': 'telefono',
        'importe': 'importe',
        'servicio': 'servicio',
        'incluye': 'incluye',
        'noIncluye': 'no_incluye',
        'formaPago': 'forma_pago',
        'pagado': 'pagado',
        'fotoTransferencia': 'foto_transferencia'
      };

      Object.keys(datosActualizados).forEach(key => {
        const backendKey = mapeo[key] || key;
        if (datosActualizados[key] !== null && datosActualizados[key] !== undefined && key !== 'activo') {
          formData.append(backendKey, datosActualizados[key]);
        }
      });

      // ⭐ AGREGAR: Actualizar en backend
      await axios.post(
        `http://127.0.0.1:8000/api/reservas/${datosActualizados.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      // ⭐ AGREGAR: Recargar desde backend
      await cargarReservas();

      console.log("✅ Reserva actualizada");
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

      const dibujar = (texto, x, y, size = 9) => {
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

      const fechaCompleta = fechaActual.toLocaleDateString(
        "es-ES",
        formatoActual
      );
      const formatearFecha = (fecha) =>
        new Date(fecha).toLocaleDateString("es-MX");
      const formatearFecha2 = (fecha) =>
        new Date(fecha).toLocaleDateString("es-ES", formatoActual);

      const campos = [
        { valor: reserva.folio.toString(), x: 495, y: 325 },
        { valor: formatearFecha2(reserva.fechaReserva), x: 190, y: 273 },
        { valor: reserva.numHabitantes.toString(), x: 490, y: 273 },
        { valor: reserva.numPasajeros.toString(), x: 110, y: 208 },
        { valor: reserva.telefono, x: 240, y: 208 },
        { valor: reserva.importe.toString(), x: 450, y: 208 },
        { valor: reserva.nombreCliente, x: 108, y: 240 },
        { valor: reserva.servicio, x: 110, y: 143 },
        { valor: reserva.incluye, x: 118, y: 175 },
        { valor: reserva.noIncluye, x: 120, y: 107 },
      ];

      campos.forEach(({ valor, x, y }) => dibujar(valor, x, y));

      if (reserva.formaPago === "transferencia") {
        dibujar(reserva.formaPago, 158, 76);
      } else if (reserva.formaPago === "efectivo") {
        dibujar(reserva.formaPago, 158, 76);
      }

      if (reserva.pagado === "pagado") {
        dibujar(reserva.pagado, 258, 76);
      } else if (reserva.pagado === "no pagado") {
        dibujar(reserva.pagado, 358, 76);
      }

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
      setPdfUrl(null); // Mostrar loading

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

      console.log("PDF descargado correctamente");
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Error al descargar el PDF. Por favor, intente nuevamente.");
    }
  };

  return (
    <div className="reservas-contenedor-principal">
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

      {reservasPaginadas.length === 0 ? (
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
        <>
          <div className="reservas-contenedor-tabla">
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
                      <span className="reservas-badge-id">
                        #{reserva.folio}
                      </span>
                    </td>

                    <td
                      data-label="Cliente"
                      className="reservas-columna-nombre"
                    >
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
                              <XCircle
                                size={14}
                                style={{ marginRight: "4px" }}
                              />
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
                        <button
                          className="reservas-boton-accion reservas-editar"
                          onClick={() => manejarAccion("editar", reserva)}
                          title="Editar reserva"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="reservas-boton-accion reservas-eliminar"
                          onClick={() => manejarAccion("eliminar", reserva)}
                          title="Eliminar reserva"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        </>
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

      <ModalEliminarReserva
        reserva={reservaAEliminar}
        alConfirmar={manejarEliminarReserva}
      />
    </div>
  );
};

export default TablaReservas;
