import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Users,
  BarChart3,
  RotateCcw,
  FileText,
} from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import ModalVerOrden from "./Modales/ModalVerOrden";
import ModalEditarOrden from "./Modales/ModalEditarOrden";
import ModalEliminarOrden from "./Modales/ModalEliminarOrden";
import ModalRestaurarOrden from "./Modales/ModalRestaurarOrden";
import ModalEliminarDefinitivo from "./Modales/ModalEliminarDefinitivo";
import "./TablaOrdenes.css";

const TablaOrdenes = () => {
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);
  const [ordenARestaurar, setOrdenARestaurar] = useState(null);
  const [ordenAEliminarDefinitivo, setOrdenAEliminarDefinitivo] =
    useState(null);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState(null);

  const [datosOrdenes, setDatosOrdenes] = useState([
    {
      id: 1,

      folio: 101,
      fecha_orden_servicio: "2025-10-15",
      nombre_prestador: "Antonio Alonso Meza",

      // Datos Conductor
      nombre_conductor: "Juan",
      apellido_paterno_conductor: "Pérez",
      apellido_materno_conductor: "García",
      telefono_conductor: "9511234567",
      licencia_conductor: "LIC123456",

      // Datos Servicio
      nombre_cliente: "Hotel Posada Real",
      telefono_cliente: "9517654321",
      ciudad_origen: "Oaxaca Centro",
      punto_intermedio: "Tlacolula",
      destino: "Puerto Escondido",
      numero_pasajeros: 15,
      fecha_inicio_servicio: "2025-10-20",
      horario_inicio_servicio: "08:00",
      fecha_final_servicio: "2025-10-22",
      horario_final_servicio: "18:00",
      horario_final_real: "18:30",
      itinerario_detallado:
        "Salida desde centro, parada en Tlacolula por 30 min, continuar a Puerto Escondido",
      direccion_retorno: "Av. Juárez 123, Centro, Oaxaca",

      // Vehículo
      marca: "Toyota",
      modelo: "Hiace",
      placa: "ABC-123-D",
      km_inicial: 10000,
      km_final: 10850,
      litros_consumidos: 85,
      rendimiento: "10 km/L",
      activo: true,
    },
    {
      id: 2,
      folio: 102,
      fecha_orden_servicio: "2025-10-18",
      nombre_prestador: "Antonio Alonso Meza",

      nombre_conductor: "María",
      apellido_paterno_conductor: "López",
      apellido_materno_conductor: "Martínez",
      telefono_conductor: "9512345678",
      licencia_conductor: "LIC234567",

      nombre_cliente: "Grupo Turístico Norte",
      telefono_cliente: "9518765432",
      ciudad_origen: "Oaxaca Aeropuerto",
      punto_intermedio: "Ocotlán",
      destino: "Huatulco",
      numero_pasajeros: 20,
      fecha_inicio_servicio: "2025-10-25",
      horario_inicio_servicio: "09:00",
      fecha_final_servicio: "2025-10-27",
      horario_final_servicio: "19:00",
      horario_final_real: "19:15",
      itinerario_detallado:
        "Recoger en aeropuerto, tour por Ocotlán, destino final Huatulco",
      direccion_retorno: "Carretera Oaxaca-Xoxocotlán km 5.5",

      marca: "Mercedes",
      modelo: "Sprinter",
      placa: "XYZ-456-E",
      km_inicial: 25000,
      km_final: 25950,
      litros_consumidos: 95,
      rendimiento: "10 km/L",

      activo: true,
    },
    {
      id: 3,
      folio: 103,
      fecha_orden_servicio: "2025-10-20",
      nombre_prestador: "Antonio Alonso Meza",

      nombre_conductor: "Carlos",
      apellido_paterno_conductor: "Hernández",
      apellido_materno_conductor: "Ruiz",
      telefono_conductor: "9513456789",
      licencia_conductor: "LIC345678",

      nombre_cliente: "Familia Ramírez",
      telefono_cliente: "9519876543",
      ciudad_origen: "Oaxaca Centro",
      punto_intermedio: "",
      destino: "Hierve el Agua",
      numero_pasajeros: 12,
      fecha_inicio_servicio: "2025-10-28",
      horario_inicio_servicio: "07:30",
      fecha_final_servicio: "2025-10-30",
      horario_final_servicio: "17:30",
      horario_final_real: "17:45",
      itinerario_detallado:
        "Tour directo a Hierve el Agua, recorrido completo y regreso",
      direccion_retorno: "Calle Alcalá 501, Centro",

      marca: "Ford",
      modelo: "Transit",
      placa: "DEF-789-F",
      km_inicial: 15000,
      km_final: 15400,
      litros_consumidos: 40,
      rendimiento: "10 km/L",

      activo: false,
    },
    {
      id: 4,
      folio: 104,
      fecha_orden_servicio: "2025-10-22",
      nombre_prestador: "Antonio Alonso Meza",

      nombre_conductor: "Ana",
      apellido_paterno_conductor: "Sánchez",
      apellido_materno_conductor: "Torres",
      telefono_conductor: "9514567890",
      licencia_conductor: "LIC456789",

      nombre_cliente: "Hotel Casa Oaxaca",
      telefono_cliente: "9510987654",
      ciudad_origen: "Hotel Casa Oaxaca",
      punto_intermedio: "Teotitlán del Valle",
      destino: "Monte Albán",
      numero_pasajeros: 18,
      fecha_inicio_servicio: "2025-11-01",
      horario_inicio_servicio: "10:00",
      fecha_final_servicio: "2025-11-03",
      horario_final_servicio: "20:00",
      horario_final_real: "20:10",
      itinerario_detallado:
        "Visita a talleres de Teotitlán, luego Monte Albán, regreso al hotel",
      direccion_retorno: "García Vigil 407, Centro",

      marca: "Chevrolet",
      modelo: "Express",
      placa: "GHI-012-G",
      km_inicial: 30000,
      km_final: 30600,
      litros_consumidos: 60,
      rendimiento: "10 km/L",

      activo: true,
    },
    {
      id: 5,
      folio: 105,
      fecha_orden_servicio: "2025-10-25",
      nombre_prestador: "Antonio Alonso Meza",

      nombre_conductor: "Roberto",
      apellido_paterno_conductor: "Mendoza",
      apellido_materno_conductor: "Cruz",
      telefono_conductor: "9515678901",
      licencia_conductor: "LIC567890",

      nombre_cliente: "Agencia Viajes Express",
      telefono_cliente: "9511098765",
      ciudad_origen: "Oaxaca Terminal ADO",
      punto_intermedio: "Mitla",
      destino: "Zipolite",
      numero_pasajeros: 25,
      fecha_inicio_servicio: "2025-11-05",
      horario_inicio_servicio: "08:30",
      fecha_final_servicio: "2025-11-07",
      horario_final_servicio: "18:30",
      horario_final_real: "18:40",
      itinerario_detallado:
        "Salida terminal, parada Mitla, destino playa Zipolite",
      direccion_retorno: "Calzada Héroes de Chapultepec 1036",

      marca: "Toyota",
      modelo: "Coaster",
      placa: "JKL-345-H",
      km_inicial: 20000,
      km_final: 21200,
      litros_consumidos: 120,
      rendimiento: "10 km/L",

      activo: false,
    },
  ]);

  useEffect(() => {
    const vehiculosEjemplo = [
      {
        id: 1,
        nombre: "Sprinter Mercedes-Benz",
        rendimiento: 12.5,
        marca: "Mercedes-Benz",
        modelo: "Sprinter 2024",
        numero_placa: "ABC-123",
      },
      {
        id: 2,
        nombre: "Hiace Toyota",
        rendimiento: 10.8,
        marca: "Toyota",
        modelo: "Hiace 2023",
        numero_placa: "XYZ-456",
      },
      {
        id: 3,
        nombre: "Urvan Nissan",
        rendimiento: 9.5,
        marca: "Nissan",
        modelo: "Urvan 2023",
        numero_placa: "DEF-789",
      },
    ];
    setVehiculosDisponibles(vehiculosEjemplo);
  }, []);

  const ordenesFiltrados = datosOrdenes.filter((orden) => {
    if (!esAdministrador && !orden.activo) {
      return false;
    }

    // FILTRO DE BÚSQUEDA
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      orden.id.toString().includes(busqueda) ||
      orden.folio.toString().includes(busqueda) ||
      (orden.nombre_cliente &&
        orden.nombre_cliente.toLowerCase().includes(busqueda)) ||
      (orden.ciudad_origen &&
        orden.ciudad_origen.toLowerCase().includes(busqueda)) ||
      (orden.destino && orden.destino.toLowerCase().includes(busqueda)) ||
      (orden.nombre_conductor &&
        orden.nombre_conductor.toLowerCase().includes(busqueda)) ||
      (orden.fecha_inicio_servicio &&
        orden.fecha_inicio_servicio.includes(busqueda))
    );
  });

  const totalRegistros = ordenesFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const ordenesPaginados = ordenesFiltrados.slice(indiceInicio, indiceFin);

  const ordenesActivos = datosOrdenes.filter((c) => c.activo).length;
  const ordenesInactivos = datosOrdenes.filter((c) => !c.activo).length;

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

  const manejarAccion = (accion, orden) => {
    switch (accion) {
      case "ver":
        setOrdenSeleccionado(orden);
        setModalVerAbierto(true);
        break;
      case "editar":
        setOrdenSeleccionado(orden);
        setModalEditarAbierto(true);
        break;
      case "pdf":
        generarYDescargarPDF(orden);
        break;
      case "eliminar":
        if (esAdministrador && !orden.activo) {
          setOrdenAEliminarDefinitivo(orden);
        } else {
          setOrdenAEliminar(orden);
        }
        break;
      case "restaurar":
        setOrdenARestaurar(orden);
        break;
      default:
        break;
    }
  };

  const cerrarModalVer = () => {
    setModalVerAbierto(false);
    setOrdenSeleccionado(null);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setOrdenSeleccionado(null);
  };

  const manejarGuardarOrden = async (datosActualizados) => {
    try {
      setDatosOrdenes(
        datosOrdenes.map((orden) =>
          orden.id === datosActualizados.id ? datosActualizados : orden
        )
      );

      console.log("Orden actualizada:", datosActualizados);
      return Promise.resolve();
    } catch (error) {
      console.error("Error al actualizar orden:", error);
      throw error;
    }
  };

  const manejarEliminarOrden = async (orden) => {
    if (!orden) {
      setOrdenAEliminar(null);
      return;
    }

    try {
      setDatosOrdenes(
        datosOrdenes.map((c) =>
          c.id === orden.id ? { ...c, activo: false } : c
        )
      );

      setOrdenAEliminar(null);
      console.log("Orden DESACTIVADA:", orden);
      return Promise.resolve();
    } catch (error) {
      console.error("Error al desactivar orden:", error);
      setOrdenAEliminar(null);
      throw error;
    }
  };

  const manejarRestaurar = async (orden) => {
    try {
      setDatosOrdenes(
        datosOrdenes.map((c) =>
          c.id === orden.id ? { ...c, activo: true } : c
        )
      );

      setOrdenARestaurar(null);
      console.log("Orden RESTAURADA:", orden);
    } catch (error) {
      console.error("Error al restaurar orden:", error);
    }
  };

  const manejarEliminarDefinitivo = async (orden) => {
    try {
      setDatosOrdenes(datosOrdenes.filter((c) => c.id !== orden.id));

      setOrdenAEliminarDefinitivo(null);
      console.log("Orden eliminada DEFINITIVAMENTE:", orden);
    } catch (error) {
      console.error("Error al eliminar definitivamente orden:", error);
    }
  };

  const generarYDescargarPDF = async (orden) => {
    try {
      const plantillaUrl = "/ORDENSERVICIO.pdf";
      const plantillaBytes = await fetch(plantillaUrl).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(plantillaBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      firstPage.drawText(
        new Date(orden.fecha_inicio_servicio).toLocaleDateString("es-MX"),
        {
          x: 70,
          y: 737,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        }
      );

      firstPage.drawText(orden.nombre_prestador || "", {
        x: 220,
        y: 250,
        size: 9,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      //folio
      firstPage.drawText(orden.folio.toString(), {
        x: 530,
        y: 718.5,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(orden.telefono_conductor.toString(), {
        x: 110,
        y: 668,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(orden.licencia_conductor.toString(), {
        x: 330,
        y: 671,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(orden.nombre_cliente, {
        x: 120,
        y: 641,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(orden.telefono_cliente.toString(), {
        x: 435,
        y: 639,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(orden.ciudad_origen, {
        x: 88,
        y: 606,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(orden.destino, {
        x: 285,
        y: 606,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(orden.numero_pasajeros.toString(), {
        x: 478,
        y: 606,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(
        new Date(orden.fecha_inicio_servicio).toLocaleDateString("es-MX"),
        {
          x: 160,
          y: 587,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        }
      );

      firstPage.drawText(orden.horario_inicio_servicio, {
        x: 330,
        y: 586,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(
        new Date(orden.fecha_final_servicio).toLocaleDateString("es-MX"),
        {
          x: 160,
          y: 570,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        }
      );

      firstPage.drawText(orden.punto_intermedio, {
        x: 150,
        y: 548,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(orden.itinerario_detallado, {
        x: 100,
        y: 528,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(orden.direccion_retorno, {
        x: 150,
        y: 433,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      const nombreCompletoConduct = `${orden.nombre_conductor || ""} ${
        orden.apellido_paterno_conductor || ""
      } ${orden.apellido_materno_conductor || ""}`.trim();

      firstPage.drawText(nombreCompletoConduct, {
        x: 130,
        y: 683,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });

      //VEHICULO

      firstPage.drawText(orden.marca, {
        x: 140,
        y: 392,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(orden.modelo, {
        x: 170,
        y: 392,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(orden.placa, {
        x: 213,
        y: 392,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(orden.km_inicial.toString(), {
        x: 140,
        y: 377,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(orden.km_final.toString(), {
        x: 213,
        y: 377,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(orden.litros_consumidos.toString(), {
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
      link.download = `Orden_${orden.folio}_${orden.fecha_inicio_servicio}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      console.log("PDF generado y descargado correctamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF. Por favor, intente nuevamente.");
    }
  };

  return (
    <div className="Ordenes-contenedor-principal">
      <div className="Ordenes-encabezado">
        <div className="Ordenes-seccion-logo">
          <div className="Ordenes-lineas-decorativas">
            <div className="Ordenes-linea Ordenes-roja"></div>
            <div className="Ordenes-linea Ordenes-azul"></div>
            <div className="Ordenes-linea Ordenes-verde"></div>
            <div className="Ordenes-linea Ordenes-amarilla"></div>
          </div>
          <h1 className="Ordenes-titulo">Gestión de Órdenes</h1>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: "600",
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              marginLeft: "1rem",
            }}
          >
            {esAdministrador ? "ADMINISTRADOR" : "USUARIO"}
          </span>
        </div>

        <div className="Ordenes-contenedor-estadisticas">
          <div className="Ordenes-estadistica">
            <div className="Ordenes-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="Ordenes-info-estadistica">
              <span className="Ordenes-label-estadistica">
                ACTIVAS: {ordenesActivos}
              </span>
            </div>
          </div>

          {esAdministrador && (
            <div className="Ordenes-estadistica">
              <div className="Ordenes-icono-estadistica-cuadrado">
                <BarChart3 size={20} />
              </div>
              <div className="Ordenes-info-estadistica">
                <span className="Ordenes-label-estadistica">
                  INACTIVAS: {ordenesInactivos}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="Ordenes-controles">
        <div className="Ordenes-control-registros">
          <button
            onClick={() => setEsAdministrador(!esAdministrador)}
            style={{
              padding: "0.5rem 1rem",
              background: "linear-gradient(135deg, #17a2b8, #138496)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              marginRight: "1rem",
            }}
          >
            Cambiar a {esAdministrador ? "Usuario" : "Admin"}
          </button>

          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="Ordenes-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="Ordenes-controles-derecha">
          <div className="Ordenes-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="Ordenes-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar orden..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="Ordenes-entrada-buscar"
              />
              <Search className="Ordenes-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="Ordenes-contenedor-tabla">
        <table className="Ordenes-tabla">
          <thead>
            <tr className="Ordenes-fila-encabezado">
              <th>ID</th>
              <th>FOLIO</th>
              <th>FECHA ORDEN</th>
              <th>CLIENTE</th>
              <th>ORIGEN</th>
              <th>DESTINO</th>
              <th>FECHA INICIO</th>
              <th>CONDUCTOR</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {ordenesPaginados.map((orden, index) => (
              <tr
                key={orden.id}
                className="Ordenes-fila-orden"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: orden.activo ? "white" : "#f8d7da",
                }}
              >
                <td data-label="ID" className="Ordenes-columna-id">
                  <span className="Ordenes-badge-id">
                    #{orden.id.toString().padStart(3, "0")}
                  </span>
                </td>
                <td data-label="Folio" className="Ordenes-columna-fecha">
                  <span className="Ordenes-badge-lead">{orden.folio}</span>
                </td>
                <td data-label="Fecha Orden" className="Ordenes-columna-fecha">
                  <span className="Ordenes-fecha">
                    {new Date(orden.fecha_orden_servicio).toLocaleDateString(
                      "es-MX"
                    )}
                  </span>
                </td>
                <td data-label="Cliente" className="Ordenes-columna-origen">
                  <span className="Ordenes-ubicacion">
                    {orden.nombre_cliente}
                  </span>
                </td>
                <td data-label="Origen" className="Ordenes-columna-origen">
                  <span className="Ordenes-ubicacion">
                    {orden.ciudad_origen}
                  </span>
                </td>
                <td data-label="Destino" className="Ordenes-columna-destino">
                  <span className="Ordenes-ubicacion">{orden.destino}</span>
                </td>
                <td data-label="Fecha Inicio" className="Ordenes-columna-fecha">
                  <span className="Ordenes-fecha">
                    {new Date(orden.fecha_inicio_servicio).toLocaleDateString(
                      "es-MX"
                    )}
                  </span>
                </td>
                <td data-label="Conductor" className="Ordenes-columna-origen">
                  <span className="Ordenes-nombre-principal">
                    {orden.nombre_conductor} {orden.apellido_paterno_conductor}
                  </span>
                </td>
                <td data-label="Acciones" className="Ordenes-columna-acciones">
                  <div className="Ordenes-botones-accion">
                    <button
                      className="Ordenes-boton-accion Ordenes-ver"
                      onClick={() => manejarAccion("ver", orden)}
                      title="Ver orden"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="Ordenes-boton-accion Ordenes-descargar"
                      onClick={() => manejarAccion("pdf", orden)}
                      title="Descargar orden"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      className="Ordenes-boton-accion Ordenes-editar"
                      onClick={() => manejarAccion("editar", orden)}
                      title="Editar orden"
                    >
                      <Edit size={16} />
                    </button>

                    {esAdministrador && !orden.activo && (
                      <button
                        className="Ordenes-boton-accion Ordenes-restaurar"
                        onClick={() => manejarAccion("restaurar", orden)}
                        title="Restaurar orden"
                        style={{
                          background:
                            "linear-gradient(45deg, #28a745, #218838)",
                          color: "white",
                        }}
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}

                    <button
                      className="Ordenes-boton-accion Ordenes-eliminar"
                      onClick={() => manejarAccion("eliminar", orden)}
                      title={
                        esAdministrador && !orden.activo
                          ? "Eliminar definitivamente"
                          : "Desactivar orden"
                      }
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

      <div className="Ordenes-pie-tabla">
        <div className="Ordenes-informacion-registros">
          Mostrando registros del {indiceInicio + 1} al{" "}
          {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros}{" "}
          registros
          {terminoBusqueda && (
            <span style={{ color: "#6c757d", marginLeft: "0.5rem" }}>
              (filtrado de {datosOrdenes.length} registros totales)
            </span>
          )}
        </div>

        <div className="Ordenes-controles-paginacion">
          <button
            className="Ordenes-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          <div className="Ordenes-numeros-paginacion">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
              (numero) => (
                <button
                  key={numero}
                  className={`Ordenes-numero-pagina ${
                    paginaActual === numero ? "Ordenes-activo" : ""
                  }`}
                  onClick={() => cambiarPagina(numero)}
                >
                  {numero}
                </button>
              )
            )}
          </div>

          <button
            className="Ordenes-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <ModalVerOrden
        estaAbierto={modalVerAbierto}
        orden={ordenSeleccionado}
        alCerrar={cerrarModalVer}
      />

      <ModalEditarOrden
        estaAbierto={modalEditarAbierto}
        orden={ordenSeleccionado}
        alCerrar={cerrarModalEditar}
        alGuardar={manejarGuardarOrden}
        vehiculosDisponibles={vehiculosDisponibles}
      />

      {ordenAEliminar && (
        <ModalEliminarOrden
          orden={ordenAEliminar}
          alConfirmar={manejarEliminarOrden}
          esAdministrador={esAdministrador}
        />
      )}

      {ordenARestaurar && (
        <ModalRestaurarOrden
          orden={ordenARestaurar}
          alConfirmar={manejarRestaurar}
          alCancelar={() => setOrdenARestaurar(null)}
        />
      )}

      {ordenAEliminarDefinitivo && (
        <ModalEliminarDefinitivo
          orden={ordenAEliminarDefinitivo}
          alConfirmar={manejarEliminarDefinitivo}
          alCancelar={() => setOrdenAEliminarDefinitivo(null)}
        />
      )}
    </div>
  );
};

export default TablaOrdenes;
