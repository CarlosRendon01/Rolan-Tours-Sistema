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
  Plus,
  DollarSign,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import "./TablaReservas.css";

const TablaReservas = ({
  reservas = [],
  setReservas,
  onVer,
  onEditar,
  onEliminar,
  onAgregar,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const reservasFiltradas = reservas.filter((reserva) => {
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

  const totalReservas = reservas.length;
  const reservasPagadas = reservas.filter((r) => r.pagado === "pagado").length;

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
        onVer(reserva);
        break;
      case "editar":
        onEditar(reserva);
        break;
      case "eliminar":
        onEliminar(reserva);
        break;
      default:
        break;
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
                      <span
                        className="reservas-valor-telefono"
                        style={{ fontWeight: "700", color: "#2563eb" }}
                      >
                        <DollarSign size={14} />
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
                              Pagado
                            </>
                          ) : (
                            <>
                              <XCircle
                                size={14}
                                style={{ marginRight: "4px" }}
                              />
                              No Pagado
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
                  (filtrado de {reservas.length} registros totales)
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
    </div>
  );
};

export default TablaReservas;
