import React, { useState, useEffect } from "react";
import axios from "axios";
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
import ModalVisualizarPDF from "./Modales/ModalVisualizarPDF";
import "./TablaOrdenes.css";

const TablaOrdenes = () => {
  const [rolUsuario, setRolUsuario] = useState(
    localStorage.getItem("rol") || "vendedor"
  );
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [conductoresDisponibles, setConductoresDisponibles] = useState([]);
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

  // Estados para el modal de visualización PDF
  const [modalPDFAbierto, setModalPDFAbierto] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [ordenPDFActual, setOrdenPDFActual] = useState(null);

  const [datosOrdenes, setDatosOrdenes] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem("token");

      // Cargar órdenes, vehículos y conductores en paralelo
      const [ordenesRes, vehiculosRes, conductoresRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/ordenes-servicio", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
        axios.get(
          "http://127.0.0.1:8000/api/ordenes-servicio/vehiculos/disponibles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        ),
        axios.get(
          "http://127.0.0.1:8000/api/ordenes-servicio/conductores/disponibles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        ),
      ]);

      setDatosOrdenes(ordenesRes.data);
      setVehiculosDisponibles(vehiculosRes.data);
      setConductoresDisponibles(conductoresRes.data);

      console.log("✅ Datos cargados:", {
        ordenes: ordenesRes.data.length,
        vehiculos: vehiculosRes.data.length,
        conductores: conductoresRes.data.length,
      });
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  };

  const ordenesFiltrados = datosOrdenes.filter((orden) => {
    if (rolUsuario === "admin" && !orden.activo) {
      return true;
    }

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
        visualizarPDF(orden);
        break;
      case "eliminar":
        if (rolUsuario === "admin" && !orden.activo) {
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

  const cerrarModalPDF = () => {
    setModalPDFAbierto(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setOrdenPDFActual(null);
  };

  const fixHora = (h) => {
    if (!h || typeof h !== "string") return null;
    if (h.includes("AM") || h.includes("PM")) {
      // Convertir AM/PM a 24h
      const [time, modifier] = h.split(" ");
      let [hours, minutes] = time.split(":");

      if (modifier === "PM" && hours !== "12") {
        hours = String(parseInt(hours, 10) + 12);
      }
      if (modifier === "AM" && hours === "12") {
        hours = "00";
      }

      return `${hours}:${minutes}`;
    }
    return h.length >= 4 ? h : null;
  };

  const manejarGuardarOrden = async (datosActualizados) => {
    try {
      const token = localStorage.getItem("token");

      // Crear objeto con los datos mapeados
      const datosOrden = {
        folio: datosActualizados.folio,
        fecha_orden_servicio: datosActualizados.fecha_orden_servicio,
        nombre_prestador:
          datosActualizados.nombre_prestador || "Antonio Alonso Meza",

        // Conductor
        conductor_id: datosActualizados.conductor_id,
        nombre_conductor: datosActualizados.nombre_conductor,
        apellido_paterno_conductor:
          datosActualizados.apellido_paterno_conductor,
        apellido_materno_conductor:
          datosActualizados.apellido_materno_conductor,
        telefono_conductor: datosActualizados.telefono_conductor,
        licencia_conductor: datosActualizados.licencia_conductor,

        // Servicio
        nombre_cliente: datosActualizados.nombre_cliente,
        telefono_cliente: datosActualizados.telefono_cliente,
        ciudad_origen: datosActualizados.ciudad_origen,
        punto_intermedio: datosActualizados.punto_intermedio,
        destino: datosActualizados.destino,
        numero_pasajeros: datosActualizados.numero_pasajeros,
        fecha_inicio_servicio: datosActualizados.fecha_inicio_servicio,
        horario_inicio_servicio: fixHora(
          datosActualizados.horario_inicio_servicio
        ),
        fecha_final_servicio: datosActualizados.fecha_final_servicio,
        horario_final_servicio: fixHora(
          datosActualizados.horario_final_servicio
        ),
        horario_final_real: fixHora(datosActualizados.horario_final_real),
        itinerario_detallado: datosActualizados.itinerario_detallado,
        direccion_retorno: datosActualizados.direccion_retorno,

        // Vehículo
        vehiculo_id: datosActualizados.vehiculo_id,
        marca: datosActualizados.marca,
        modelo: datosActualizados.modelo,
        placa: datosActualizados.placa,
        km_inicial: datosActualizados.km_inicial,
        km_final: datosActualizados.km_final,
        litros_consumidos: datosActualizados.litros_consumidos,
        rendimiento: datosActualizados.rendimiento,

        coordinador_id: datosActualizados.coordinador_id,
        guia_id: datosActualizados.guia_id,
      };

      // ⭐ AGREGAR: Actualizar en backend
      await axios.put(
        `http://127.0.0.1:8000/api/ordenes-servicio/${datosActualizados.id}`,
        datosOrden,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // ⭐ AGREGAR: Recargar datos
      await cargarDatos();

      console.log("✅ Orden actualizada en backend");
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error al actualizar orden:", error);
      throw error;
    }
  };

  const manejarEliminarOrden = async (orden) => {
    if (!orden) {
      setOrdenAEliminar(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // ⭐ AGREGAR: Eliminar en backend
      await axios.delete(
        `http://127.0.0.1:8000/api/ordenes-servicio/${orden.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // ⭐ AGREGAR: Recargar datos
      await cargarDatos();

      setOrdenAEliminar(null);
      console.log("✅ Orden eliminada del backend");
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error al eliminar orden:", error);
      setOrdenAEliminar(null);
      throw error;
    }
  };

  const manejarRestaurar = async (orden) => {
    try {
      const token = localStorage.getItem("token");

      // ⭐ AGREGAR: Restaurar en backend
      await axios.post(
        `http://127.0.0.1:8000/api/ordenes-servicio/${orden.id}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // ⭐ AGREGAR: Recargar datos
      await cargarDatos();

      setOrdenARestaurar(null);
      console.log("✅ Orden restaurada en backend");
    } catch (error) {
      console.error("❌ Error al restaurar orden:", error);
    }
  };

  const manejarEliminarDefinitivo = async (orden) => {
    try {
      const token = localStorage.getItem("token");

      // ⭐ AGREGAR: Forzar eliminación permanente
      await axios.delete(
        `http://127.0.0.1:8000/api/ordenes-servicio/${orden.id}/force`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // ⭐ AGREGAR: Recargar datos
      await cargarDatos();

      setOrdenAEliminarDefinitivo(null);
      console.log("✅ Orden eliminada DEFINITIVAMENTE del backend");
    } catch (error) {
      console.error("❌ Error al eliminar definitivamente orden:", error);
    }
  };

  // 🔧 FUNCIÓN CORREGIDA - generarPDF con manejo de valores null

  const generarPDF = async (orden) => {
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

      // ✅ FUNCIÓN AUXILIAR - Convierte null/undefined a string vacío
      const toStr = (value) => {
        if (value === null || value === undefined) return "";
        return String(value);
      };

      // ✅ FUNCIÓN AUXILIAR - Convierte números a string, maneja null
      const toNum = (value) => {
        if (value === null || value === undefined || value === "") return "0";
        const num = Number(value);
        return isNaN(num) ? "0" : String(Math.trunc(num));
      };

      const dividirTexto = (texto, ancho) => {
        if (!texto) return [""]; // ✅ Manejar texto vacío

        const palabras = texto.split(" ");
        const lineas = [];
        let actual = "";

        palabras.forEach((palabra) => {
          const prueba = actual ? `${actual} ${palabra}` : palabra;
          if (font.widthOfTextAtSize(prueba, 9) > ancho && actual) {
            lineas.push(actual);
            actual = palabra;
          } else {
            actual = prueba;
          }
        });
        if (actual) lineas.push(actual);
        return lineas.length > 0 ? lineas : [""];
      };

      // ✅ FECHA ORDEN (con validación)
      const fechaOrden = orden.fecha_inicio_servicio
        ? new Date(orden.fecha_inicio_servicio).toLocaleDateString("es-MX")
        : "";

      firstPage.drawText(fechaOrden, {
        x: 70,
        y: 737,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ FOLIO (convertir a string)
      firstPage.drawText(toStr(orden.folio), {
        x: 530,
        y: 718.5,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ TELÉFONO CONDUCTOR (manejar null)
      firstPage.drawText(toStr(orden.telefono_conductor), {
        x: 110,
        y: 668,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ LICENCIA CONDUCTOR (manejar null)
      firstPage.drawText(toStr(orden.licencia_conductor), {
        x: 330,
        y: 671,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ NOMBRE CLIENTE (manejar null)
      firstPage.drawText(toStr(orden.nombre_cliente), {
        x: 120,
        y: 641,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ TELÉFONO CLIENTE (manejar null)
      firstPage.drawText(toStr(orden.telefono_cliente), {
        x: 435,
        y: 639,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ CIUDAD ORIGEN (manejar null)
      firstPage.drawText(toStr(orden.ciudad_origen), {
        x: 88,
        y: 606,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ DESTINO (manejar null)
      firstPage.drawText(toStr(orden.destino), {
        x: 285,
        y: 606,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ NÚMERO PASAJEROS (manejar null)
      firstPage.drawText(toNum(orden.numero_pasajeros), {
        x: 478,
        y: 606,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ FECHA INICIO SERVICIO (con validación)
      const fechaInicio = orden.fecha_inicio_servicio
        ? new Date(orden.fecha_inicio_servicio).toLocaleDateString("es-MX")
        : "";

      firstPage.drawText(fechaInicio, {
        x: 160,
        y: 587,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ HORARIO INICIO SERVICIO (manejar null)
      firstPage.drawText(toStr(orden.horario_inicio_servicio), {
        x: 330,
        y: 586,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ FECHA FINAL SERVICIO (con validación)
      const fechaFinal = orden.fecha_final_servicio
        ? new Date(orden.fecha_final_servicio).toLocaleDateString("es-MX")
        : "";

      firstPage.drawText(fechaFinal, {
        x: 160,
        y: 570,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ PUNTO INTERMEDIO (manejar null)
      firstPage.drawText(toStr(orden.punto_intermedio), {
        x: 150,
        y: 548,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ ITINERARIO con saltos de línea (manejar null)
      const itinerario = toStr(orden.itinerario_detallado);
      const lineas = dividirTexto(itinerario, 450);
      lineas.forEach((linea, i) => {
        firstPage.drawText(linea, {
          x: 100,
          y: 528 - i * 12,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        });
      });

      // ✅ DIRECCIÓN RETORNO (manejar null)
      firstPage.drawText(toStr(orden.direccion_retorno), {
        x: 150,
        y: 433,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ NOMBRE COMPLETO CONDUCTOR (manejar null en cada parte)
      const nombreCompletoConduct = `${toStr(orden.nombre_conductor)} ${toStr(
        orden.apellido_paterno_conductor
      )} ${toStr(orden.apellido_materno_conductor)}`.trim();

      firstPage.drawText(nombreCompletoConduct, {
        x: 130,
        y: 683,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ MARCA VEHÍCULO (manejar null)
      firstPage.drawText(toStr(orden.marca), {
        x: 140,
        y: 392,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ PLACA VEHÍCULO (manejar null)
      firstPage.drawText(toStr(orden.placa), {
        x: 213,
        y: 392,
        size: 7,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ KM INICIAL (manejar null)
      firstPage.drawText(`${toNum(orden.km_inicial)} Km`, {
        x: 130,
        y: 379,
        size: 8,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ KM FINAL (manejar null)
      firstPage.drawText(`${toNum(orden.km_final)} Km`, {
        x: 205,
        y: 379,
        size: 8,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ KM RECORRIDOS (manejar null)
      const kmRecorridos = (orden.km_final && orden.km_inicial)
        ? Math.trunc(orden.km_final - orden.km_inicial)
        : 0;

      firstPage.drawText(`${kmRecorridos} Km`, {
        x: 130,
        y: 365,
        size: 8,
        font: font,
        color: rgb(0, 0, 0),
      });

      // ✅ LITROS CONSUMIDOS (manejar null)
      firstPage.drawText(`${toNum(orden.litros_consumidos)} Litros`, {
        x: 130,
        y: 350,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    }
  };

  const visualizarPDF = async (orden) => {
    try {
      setOrdenPDFActual(orden);
      setModalPDFAbierto(true);
      setPdfUrl(null); // Mostrar loading

      const pdfBytes = await generarPDF(orden);
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
      if (!ordenPDFActual) return;

      const pdfBytes = await generarPDF(ordenPDFActual);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Orden_${ordenPDFActual.folio}_${ordenPDFActual.fecha_inicio_servicio}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      console.log("PDF descargado correctamente");
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Error al descargar el PDF. Por favor, intente nuevamente.");
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

          {rolUsuario === "admin" && (
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
                className={`Ordenes-fila-orden ${!orden.activo ? "Ordenes-fila-inactiva" : ""
                  }`}
              >
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
                  <span className="Ordenes-ubicaciones">
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
                      title="Previsualizar y descargar orden"
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

                    {rolUsuario === "admin" && !orden.activo && (
                      <button
                        className="Ordenes-boton-accion Ordenes-restaurar"
                        onClick={() => manejarAccion("restaurar", orden)}
                        title="Restaurar orden"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}

                    <button
                      className="Ordenes-boton-accion Ordenes-eliminar"
                      onClick={() => manejarAccion("eliminar", orden)}
                      title={
                        rolUsuario === "admin" && !orden.activo
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
            <span className="Ordenes-texto-filtrado">
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
                  className={`Ordenes-numero-pagina ${paginaActual === numero ? "Ordenes-activo" : ""
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
        conductoresDisponibles={conductoresDisponibles}
      />

      <ModalVisualizarPDF
        estaAbierto={modalPDFAbierto}
        pdfUrl={pdfUrl}
        orden={ordenPDFActual}
        alCerrar={cerrarModalPDF}
        alDescargar={descargarPDF}
      />

      {ordenAEliminar && (
        <ModalEliminarOrden
          orden={ordenAEliminar}
          alConfirmar={manejarEliminarOrden}
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
