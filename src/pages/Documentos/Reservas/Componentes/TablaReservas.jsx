import React, { useState } from "react";
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

const TablaReservas = () => {
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [reservaSeleccionado, setReservaSeleccionado] = useState(null);
  const [reservasDatos, setReservasDatos] = useState([
    {
      id: 1,
      folio: 1001,
      fechaReserva: "2024-01-15",
      numHabitantes: 2,
      nombreCliente: "María González Ramírez",
      numPasajeros: 4,
      telefono: "5551234567",
      importe: 3500.0,
      servicio:
        "Tour por Monte Albán y artesanías de Oaxaca. Incluye visita guiada por la zona arqueológica con explicación detallada de la historia zapoteca.",
      incluye:
        "Transporte, guía certificado, entradas a zonas arqueológicas, botella de agua",
      noIncluye: "Alimentos, propinas, souvenirs",
      formaPago: "transferencia",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 2,
      folio: 1002,
      fechaReserva: "2024-01-20",
      numHabitantes: 1,
      nombreCliente: "Carlos Hernández López",
      numPasajeros: 2,
      telefono: "5552345678",
      importe: 2800.0,
      servicio:
        "Experiencia gastronómica en Oaxaca. Recorrido por mercados locales y clase de cocina tradicional oaxaqueña.",
      incluye:
        "Transporte, guía especializado, ingredientes para clase de cocina, degustación de mezcal",
      noIncluye: "Comidas adicionales, bebidas alcohólicas extras",
      formaPago: "efectivo",
      pagado: "no pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 3,
      folio: 1003,
      fechaReserva: "2024-02-05",
      numHabitantes: 3,
      nombreCliente: "Ana Martínez Pérez",
      numPasajeros: 6,
      telefono: "5553456789",
      importe: 5200.0,
      servicio:
        "Tour completo Hierve el Agua y fábrica de mezcal. Día completo de aventura natural y cultural.",
      incluye:
        "Transporte en van climatizada, guía bilingüe, entradas, comida típica, degustación de mezcal",
      noIncluye: "Propinas, actividades opcionales extras",
      formaPago: "transferencia",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 4,
      folio: 1004,
      fechaReserva: "2024-02-10",
      numHabitantes: 2,
      nombreCliente: "Roberto Sánchez García",
      numPasajeros: 3,
      telefono: "5554567890",
      importe: 4100.0,
      servicio:
        "Ruta del mezcal artesanal. Visita a tres palenques tradicionales con explicación del proceso de elaboración.",
      incluye:
        "Transporte privado, guía experto, degustación en palenques, botana oaxaqueña",
      noIncluye: "Compra de botellas de mezcal, comidas completas",
      formaPago: "efectivo",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 5,
      folio: 1005,
      fechaReserva: "2024-02-18",
      numHabitantes: 1,
      nombreCliente: "Laura Torres Ramírez",
      numPasajeros: 1,
      telefono: "5555678901",
      importe: 1800.0,
      servicio:
        "City tour por el centro histórico de Oaxaca. Recorrido a pie por los principales monumentos y edificios coloniales.",
      incluye: "Guía certificado, entradas a iglesias y museos, mapa turístico",
      noIncluye: "Transporte, alimentos, bebidas",
      formaPago: "transferencia",
      pagado: "no pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 6,
      folio: 1006,
      fechaReserva: "2024-03-01",
      numHabitantes: 4,
      nombreCliente: "José Luis Fernández Díaz",
      numPasajeros: 8,
      telefono: "5556789012",
      importe: 6500.0,
      servicio:
        "Tour de día completo a las cascadas de Reforma. Incluye caminata, natación y comida campestre.",
      incluye:
        "Transporte, guía de aventura, equipo de seguridad, comida campestre, seguro",
      noIncluye: "Ropa de baño, toallas, cambio de ropa",
      formaPago: "transferencia",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 7,
      folio: 1007,
      fechaReserva: "2024-03-10",
      numHabitantes: 2,
      nombreCliente: "Patricia Morales Castillo",
      numPasajeros: 5,
      telefono: "5557890123",
      importe: 4800.0,
      servicio:
        "Experiencia textil en Teotitlán del Valle. Visita a talleres de tejido de lana y demostración de teñido natural.",
      incluye:
        "Transporte, guía cultural, demostración de tejido, taller de teñido, refrigerio",
      noIncluye: "Compra de textiles, comida completa",
      formaPago: "efectivo",
      pagado: "no pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 8,
      folio: 1008,
      fechaReserva: "2024-03-15",
      numHabitantes: 1,
      nombreCliente: "Miguel Ángel Ruiz Medina",
      numPasajeros: 2,
      telefono: "5558901234",
      importe: 3200.0,
      servicio:
        "Tour fotográfico por Oaxaca. Recorrido especial para fotografía en los mejores spots de la ciudad.",
      incluye:
        "Guía fotógrafo profesional, transporte a locaciones, tips de fotografía",
      noIncluye: "Equipo fotográfico, alimentos, edición de fotos",
      formaPago: "transferencia",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
  ]);

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
        generarYDescargarPDF(reserva);
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
      setReservasDatos(
        reservasDatos.map((c) =>
          c.id === reserva.id ? { ...c, activo: false } : c
        )
      );

      setReservaAEliminar(null);
      console.log("Reserva DESACTIVADA:", reserva);
      return Promise.resolve();
    } catch (error) {
      console.error("Error al desactivar reserva:", error);
      setReservaAEliminar(null);
      throw error;
    }
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setReservaSeleccionado(null);
  };

  const manejarGuardarReserva = async (datosActualizados) => {
    try {
      setReservasDatos(
        reservasDatos.map((reserva) =>
          reserva.id === datosActualizados.id ? datosActualizados : reserva
        )
      );
      console.log(`Reserva actualizada:`, datosActualizados);
      return Promise.resolve();
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      throw error;
    }
  };

  const generarYDescargarPDF = async (reserva) => {
    try {
      const plantillaUrl = "/HOJARESERVA_ROLAN.pdf";
      const plantillaBytes = await fetch(plantillaUrl).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(plantillaBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      firstPage.drawText(reserva.folio.toString(), {
        x: 140,
        y: 350,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Reserva_${reserva.folio}_${reserva.nombreCliente}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      console.log("PDF generado y descargado correctamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF. Por favor, intente nuevamente.");
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
                          className={`reservas-idioma-tag ${
                            reserva.pagado === "pagado"
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
                      className={`reservas-numero-pagina ${
                        paginaActual === numero ? "reservas-activo" : ""
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
