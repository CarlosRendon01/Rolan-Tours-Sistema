import React, { useState } from "react";
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
import ModalVerContrato from "./Modales/ModalVerContrato";
import ModalEditarContrato from "./Modales/ModalEditarContrato";
import ModalEliminarContrato from "./Modales/ModalEliminarContrato";
import ModalRestaurarContrato from "./Modales/ModalRestaurarContrato";
import ModalEliminarDefinitivo from "./Modales/ModalEliminarDefinitivo";
import ModalVisualizarPDF from "../Contratos/Modales/ModalVisualizarPDF";
import "./TablaContratos.css";

const TablaContratos = () => {
  const [esAdministrador, setEsAdministrador] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [contratoAEliminar, setContratoAEliminar] = useState(null);
  const [contratoARestaurar, setContratoARestaurar] = useState(null);
  const [contratoAEliminarDefinitivo, setContratoAEliminarDefinitivo] =
    useState(null);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);
  const [modalPDFAbierto, setModalPDFAbierto] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [contratoPDFActual, setContratoPDFActual] = useState(null);

  const [datosContratos, setDatosContratos] = useState([
    {
      id: 1,
      // Datos de Contrato
      representante_empresa: "PEDRO HERNÁNDEZ RUÍZ",
      domicilio: "Calle Independencia 123, Centro, Oaxaca",

      // Datos del Servicio
      nombre_cliente: "Juan Pérez García",
      nacionalidad: "Mexicana",
      rfc: "GOLJ880915H80",
      telefono_cliente: "9511234567",
      ciudad_origen: "Oaxaca Centro",
      punto_intermedio: "Tlacolula",
      destino: "Puerto Escondido",
      tipo_pasaje: "Otro",
      otro_tipo_pasaje_especificacion: "Transporte para evento corporativo",
      n_unidades_contratadas: 1,
      numero_pasajeros: 15,
      fecha_inicio_servicio: "2025-10-20",
      horario_inicio_servicio: "08:00",
      fecha_final_servicio: "2025-10-22",
      horario_final_servicio: "18:00",
      itinerario_detallado:
        "Salida de Oaxaca, parada en Tlacolula para desayuno, llegada a Puerto Escondido.",

      // Costo Extra
      importe_servicio: 8500.0,
      anticipo: 3000.0,
      fecha_liquidacion: "2025-10-15",
      costos_cubiertos: [
        "Actividades no especificadas",
        "Peaje de Casetas necesarias durante todo el trayecto",
        "Viáticos del conductor",
      ],
      otro_costo_especificacion: "",

      // Datos Vehículo
      marca_vehiculo: "Toyota",
      modelo_vehiculo: "Hiace",
      placa_vehiculo: "ABC-123-D",
      capacidad_vehiculo: 15,
      aire_acondicionado: true,
      asientos_reclinables: true,

      fecha_registro: "02/09/2025",
      activo: true,
    },
    {
      id: 2,
      representante_empresa: "PEDRO HERNÁNDEZ RUÍZ",
      domicilio: "Calle Independencia 123, Centro, Oaxaca",

      nombre_cliente: "María López Sánchez",
      nacionalidad: "Estadounidense",
      rfc: "MARA750101QW3",
      telefono_cliente: "9512345678",
      ciudad_origen: "Oaxaca Aeropuerto",
      punto_intermedio: "Ocotlán",
      destino: "Huatulco",
      tipo_pasaje: "Turismo Internacional",
      n_unidades_contratadas: 1,
      numero_pasajeros: 20,
      fecha_inicio_servicio: "2025-10-25",
      horario_inicio_servicio: "09:00",
      fecha_final_servicio: "2025-10-27",
      horario_final_servicio: "19:00",
      itinerario_detallado:
        "Recogida en aeropuerto, tour por Ocotlán, destino final Huatulco.",

      importe_servicio: 12000.0,
      anticipo: 5000.0,
      fecha_liquidacion: "2025-10-20",
      costos_cubiertos: [
        "Servicio a disposición en el destino por máximo 30km a la redonda",
        "Seguro de Viajero en accidente automovilístico siempre y cuando el pasajero esté dentro de la unidad",
        "Piso en Aeropuerto",
      ],
      otro_costo_especificacion: "",

      marca_vehiculo: "Mercedes",
      modelo_vehiculo: "Sprinter",
      placa_vehiculo: "XYZ-456-E",
      capacidad_vehiculo: 20,
      aire_acondicionado: true,
      asientos_reclinables: true,

      fecha_registro: "02/09/2025",
      activo: true,
    },
    {
      id: 3,
      representante_empresa: "PEDRO HERNÁNDEZ RUÍZ",
      domicilio: "Calle Independencia 123, Centro, Oaxaca",

      nombre_cliente: "Carlos Ramírez Torres",
      nacionalidad: "Mexicana",
      rfc: "SOUF921225L94",
      telefono_cliente: "9513456789",
      ciudad_origen: "Oaxaca Centro",
      punto_intermedio: "",
      destino: "Hierve el Agua",
      tipo_pasaje: "Nacional",
      n_unidades_contratadas: 1,
      numero_pasajeros: 12,
      fecha_inicio_servicio: "2025-10-28",
      horario_inicio_servicio: "07:30",
      fecha_final_servicio: "2025-10-30",
      horario_final_servicio: "17:30",
      itinerario_detallado:
        "Viaje directo a Hierve el Agua, visita guiada incluida.",

      importe_servicio: 6500.0,
      anticipo: 2000.0,
      fecha_liquidacion: "2025-10-25",
      costos_cubiertos: [
        "Servicio a disposición en el destino por máximo 10 horas al día",
        "Viáticos del conductor",
      ],
      otro_costo_especificacion: "",

      marca_vehiculo: "Nissan",
      modelo_vehiculo: "Urvan",
      placa_vehiculo: "DEF-789-G",
      capacidad_vehiculo: 12,
      aire_acondicionado: false,
      asientos_reclinables: true,

      fecha_registro: "02/09/2025",
      activo: false,
    },
    {
      id: 4,
      representante_empresa: "PEDRO HERNÁNDEZ RUÍZ",
      domicilio: "Calle Independencia 123, Centro, Oaxaca",

      nombre_cliente: "Ana Martínez Flores",
      nacionalidad: "Mexicana",
      rfc: "REMA800305TR2",
      telefono_cliente: "9514567890",
      ciudad_origen: "Hotel Casa Oaxaca",
      punto_intermedio: "Teotitlán del Valle",
      destino: "Monte Albán",
      tipo_pasaje: "Turismo Estatal",
      n_unidades_contratadas: 1,
      numero_pasajeros: 18,
      fecha_inicio_servicio: "2025-11-01",
      horario_inicio_servicio: "10:00",
      fecha_final_servicio: "2025-11-03",
      horario_final_servicio: "20:00",
      itinerario_detallado:
        "Salida del hotel, visita a Teotitlán del Valle, tour en Monte Albán.",

      importe_servicio: 9500.0,
      anticipo: 4000.0,
      fecha_liquidacion: "2025-10-28",
      costos_cubiertos: [
        "Combustible a consumir durante todo el trayecto",
        "Peaje de Casetas necesarias durante todo el trayecto",
        "Servicio a disposición en el destino por máximo 30km a la redonda",
      ],
      otro_costo_especificacion: "",

      marca_vehiculo: "Ford",
      modelo_vehiculo: "Transit",
      placa_vehiculo: "GHI-012-J",
      capacidad_vehiculo: 18,
      aire_acondicionado: true,
      asientos_reclinables: false,

      fecha_registro: "02/09/2025",
      activo: true,
    },
    {
      id: 5,
      representante_empresa: "PEDRO HERNÁNDEZ RUÍZ",
      domicilio: "Calle Independencia 123, Centro, Oaxaca",

      nombre_cliente: "Roberto Gómez Luna",
      nacionalidad: "Mexicana",
      rfc: "DIPJ660718AZ5",
      telefono_cliente: "9515678901",
      ciudad_origen: "Oaxaca Terminal ADO",
      punto_intermedio: "Mitla",
      destino: "Zipolite",
      tipo_pasaje: "Escolar",
      n_unidades_contratadas: 2,
      numero_pasajeros: 25,
      fecha_inicio_servicio: "2025-11-05",
      horario_inicio_servicio: "08:30",
      fecha_final_servicio: "2025-11-07",
      horario_final_servicio: "18:30",
      itinerario_detallado:
        "Excursión escolar con parada en Mitla para actividades educativas.",

      importe_servicio: 15000.0,
      anticipo: 7000.0,
      fecha_liquidacion: "2025-11-01",
      costos_cubiertos: [
        "Combustible a consumir durante todo el trayecto",
        "Peaje de Casetas necesarias durante todo el trayecto",
        "Viáticos del conductor",
        "Alimentos no especificados",
      ],
      otro_costo_especificacion: "",

      marca_vehiculo: "Chevrolet",
      modelo_vehiculo: "Express",
      placa_vehiculo: "JKL-345-M",
      capacidad_vehiculo: 15,
      aire_acondicionado: true,
      asientos_reclinables: true,

      fecha_registro: "03/09/2025",
      activo: false,
    },
  ]);

  const contratosFiltrados = datosContratos.filter((contrato) => {
    if (!esAdministrador && !contrato.activo) {
      return false;
    }

    const busqueda = terminoBusqueda.toLowerCase();
    return (
      contrato.id.toString().includes(busqueda) ||
      (contrato.nombre_cliente &&
        contrato.nombre_cliente.toLowerCase().includes(busqueda)) ||
      (contrato.ciudad_origen &&
        contrato.ciudad_origen.toLowerCase().includes(busqueda)) ||
      (contrato.destino && contrato.destino.toLowerCase().includes(busqueda)) ||
      (contrato.punto_intermedio &&
        contrato.punto_intermedio.toLowerCase().includes(busqueda)) ||
      (contrato.numero_pasajeros &&
        contrato.numero_pasajeros.toString().includes(busqueda)) ||
      (contrato.fecha_inicio_servicio &&
        contrato.fecha_inicio_servicio.includes(busqueda))
    );
  });

  const totalRegistros = contratosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const contratosPaginados = contratosFiltrados.slice(indiceInicio, indiceFin);

  const contratosActivos = datosContratos.filter((c) => c.activo).length;
  const contratosInactivos = datosContratos.filter((c) => !c.activo).length;

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

  const manejarAccion = (accion, contrato) => {
    switch (accion) {
      case "ver":
        setContratoSeleccionado(contrato);
        setModalVerAbierto(true);
        break;
      case "editar":
        setContratoSeleccionado(contrato);
        setModalEditarAbierto(true);
        break;
      case "pdf":
        visualizarPDF(contrato);
        break;
      case "eliminar":
        if (esAdministrador && !contrato.activo) {
          setContratoAEliminarDefinitivo(contrato);
        } else {
          setContratoAEliminar(contrato);
        }
        break;
      case "restaurar":
        setContratoARestaurar(contrato);
        break;
      default:
        break;
    }
  };

  const cerrarModalVer = () => {
    setModalVerAbierto(false);
    setContratoSeleccionado(null);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setContratoSeleccionado(null);
  };
  const cerrarModalPDF = () => {
    setModalPDFAbierto(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setContratoPDFActual(null);
  };

  const generarPDF = async (contrato) => {
    try {
      const plantillaUrl = "/CONTRATO-SERV-TRANSPORTE.pdf";
      const plantillaBytes = await fetch(plantillaUrl).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(plantillaBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const secondPage = pages[1];

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

      const dibujarSegundaPagina = (texto, x, y, size = 9) => {
        if (texto) {
          secondPage.drawText(texto.toString(), {
            x,
            y,
            size,
            font,
            color: rgb(0, 0, 0),
          });
        }
      };

      const formatearFecha = (fecha) =>
        new Date(fecha).toLocaleDateString("es-MX");

      const campos = [
        { valor: contrato.representante_empresa, x: 330, y: 700 },
        { valor: contrato.nombre_cliente, x: 200, y: 680 },
        { valor: contrato.nacionalidad, x: 260, y: 460 },
        { valor: contrato.rfc, x: 110, y: 440 },
        { valor: contrato.domicilio, x: 110, y: 408 },
        { valor: contrato.telefono_cliente, x: 370, y: 398 },
        { valor: contrato.nombre_cliente, x: 170, y: 304 },
        { valor: contrato.punto_intermedio, x: 186, y: 289 },
        { valor: contrato.telefono_cliente, x: 186, y: 276 },
        { valor: contrato.n_unidades_contratadas, x: 220, y: 262 },
        { valor: contrato.numero_pasajeros, x: 170, y: 226 },
        {
          valor: formatearFecha(contrato.fecha_inicio_servicio),
          x: 157,
          y: 212,
        },
        { valor: contrato.horario_inicio_servicio, x: 275, y: 212 },
        {
          valor: formatearFecha(contrato.fecha_final_servicio),
          x: 157,
          y: 200,
        },
        { valor: contrato.horario_final_servicio, x: 275, y: 200 },
        { valor: contrato.itinerario_detallado, x: 160, y: 187 },
        { valor: contrato.importe_servicio, x: 190, y: 119 },
        { valor: contrato.anticipo, x: 190, y: 92 },
        { valor: contrato.fecha_liquidacion, x: 190, y: 79 },
      ];

      campos.forEach(({ valor, x, y }) => dibujar(valor, x, y));

      const coordenadasTipoPasaje = {
        "Turismo Estatal": { x: 148, y: 235 },
        "Turismo Internacional": { x: 232, y: 235 },
        Nacional: { x: 273, y: 235 },
        Escolar: { x: 311, y: 235 },
      };

      if (contrato.tipo_pasaje === "Otro") {
        dibujar(contrato.otro_tipo_pasaje_especificacion, 381, 236);
      } else if (coordenadasTipoPasaje[contrato.tipo_pasaje]) {
        const { x, y } = coordenadasTipoPasaje[contrato.tipo_pasaje];
        dibujar("X", x, y);
      }

      const coordenadasCostosCubiertos = {
        "Combustible a consumir durante todo el trayecto": { x: 89, y: 710 },
        "Peaje de Casetas necesarias durante todo el trayecto": {
          x: 89,
          y: 700,
        },
        "Viáticos del conductor": { x: 89, y: 690 },
        "Servicio a disposición en el destino por máximo 30km a la redonda": {
          x: 89,
          y: 680,
        },
        "Servicio a disposición en el destino por máximo 10 horas al día": {
          x: 89,
          y: 670,
        },
        "Seguro de Viajero en accidente automovilístico siempre y cuando el pasajero esté dentro de la unidad":
          { x: 89, y: 659 },
        "Piso en Aeropuerto": { x: 89, y: 645 },
        "Alimentos no especificados": { x: 89, y: 635 },
        "Actividades no especificadas": { x: 89, y: 626 },
        "Otro, especifique": { x: 89, y: 616 },
      };

      if (
        contrato.costos_cubiertos &&
        Array.isArray(contrato.costos_cubiertos)
      ) {
        contrato.costos_cubiertos.forEach((costo) => {
          if (coordenadasCostosCubiertos[costo]) {
            const { x, y } = coordenadasCostosCubiertos[costo];
            dibujarSegundaPagina("X", x, y);
          }
        });

        if (
          contrato.costos_cubiertos.includes("Otro, especifique") &&
          contrato.otro_costo_especificacion
        ) {
          dibujarSegundaPagina(contrato.otro_costo_especificacion, 180, 618);
        }
      }

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    }
  };

  const manejarGuardarContrato = async (datosActualizados) => {
    try {
      setDatosContratos(
        datosContratos.map((contrato) =>
          contrato.id === datosActualizados.id ? datosActualizados : contrato
        )
      );

      console.log("Contrato actualizado:", datosActualizados);
      return Promise.resolve();
    } catch (error) {
      console.error("Error al actualizar contrato:", error);
      throw error;
    }
  };

  const manejarEliminarContrato = async (contrato) => {
    if (!contrato) {
      setContratoAEliminar(null);
      return;
    }

    try {
      setDatosContratos(
        datosContratos.map((c) =>
          c.id === contrato.id ? { ...c, activo: false } : c
        )
      );

      setContratoAEliminar(null);
      console.log("Contrato DESACTIVADO:", contrato);
      return Promise.resolve();
    } catch (error) {
      console.error("Error al desactivar contrato:", error);
      setContratoAEliminar(null);
      throw error;
    }
  };

  const manejarRestaurar = async (contrato) => {
    try {
      setDatosContratos(
        datosContratos.map((c) =>
          c.id === contrato.id ? { ...c, activo: true } : c
        )
      );

      setContratoARestaurar(null);
      console.log("Contrato RESTAURADO:", contrato);
    } catch (error) {
      console.error("Error al restaurar contrato:", error);
    }
  };

  const manejarEliminarDefinitivo = async (contrato) => {
    try {
      setDatosContratos(datosContratos.filter((c) => c.id !== contrato.id));

      setContratoAEliminarDefinitivo(null);
      console.log("Contrato eliminado DEFINITIVAMENTE:", contrato);
    } catch (error) {
      console.error("Error al eliminar definitivamente contrato:", error);
    }
  };

  const visualizarPDF = async (contrato) => {
    try {
      setContratoPDFActual(contrato);
      setModalPDFAbierto(true);
      setPdfUrl(null); // Mostrar loading

      const pdfBytes = await generarPDF(contrato);
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
      if (!contratoPDFActual) return;

      const pdfBytes = await generarPDF(contratoPDFActual);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Contrato_${contratoPDFActual.nombre_cliente}_${contratoPDFActual.fecha_inicio_servicio}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      console.log("PDF descargado correctamente");
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Error al descargar el PDF. Por favor, intente nuevamente.");
    }
  };

  return (
    <div className="Contratos-contenedor-principal">
      <div className="Contratos-encabezado">
        <div className="Contratos-seccion-logo">
          <div className="Contratos-lineas-decorativas">
            <div className="Contratos-linea Contratos-roja"></div>
            <div className="Contratos-linea Contratos-azul"></div>
            <div className="Contratos-linea Contratos-verde"></div>
            <div className="Contratos-linea Contratos-amarilla"></div>
          </div>
          <h1 className="Contratos-titulo">Gestión de Contratos</h1>
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

        <div className="Contratos-contenedor-estadisticas">
          <div className="Contratos-estadistica">
            <div className="Contratos-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="Contratos-info-estadistica">
              <span className="Contratos-label-estadistica">
                ACTIVOS: {contratosActivos}
              </span>
            </div>
          </div>

          {esAdministrador && (
            <div className="Contratos-estadistica">
              <div className="Contratos-icono-estadistica-cuadrado">
                <BarChart3 size={20} />
              </div>
              <div className="Contratos-info-estadistica">
                <span className="Contratos-label-estadistica">
                  INACTIVOS: {contratosInactivos}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="Contratos-controles">
        <div className="Contratos-control-registros">
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
            className="Contratos-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="Contratos-controles-derecha">
          <div className="Contratos-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="Contratos-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar contrato..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="Contratos-entrada-buscar"
              />
              <Search className="Contratos-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="Contratos-contenedor-tabla">
        <table className="Contratos-tabla">
          <thead>
            <tr className="Contratos-fila-encabezado">
              <th>ID</th>
              <th>CLIENTE</th>
              <th>FECHA INICIO</th>
              <th>FECHA FINAL</th>
              <th>PASAJEROS</th>
              <th>ORIGEN</th>
              <th>DESTINO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {contratosPaginados.map((contrato, index) => (
              <tr
                key={contrato.id}
                className="Contratos-fila-contrato"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: contrato.activo ? "white" : "#f8d7da",
                }}
              >
                <td data-label="ID" className="Contratos-columna-id">
                  <span className="Contratos-badge-id">
                    #{contrato.id.toString().padStart(3, "0")}
                  </span>
                </td>
                <td data-label="Cliente">
                  <span style={{ fontWeight: 600 }}>
                    {contrato.nombre_cliente}
                  </span>
                </td>
                <td data-label="Fecha Inicio">
                  <span className="Contratos-fecha">
                    {new Date(
                      contrato.fecha_inicio_servicio
                    ).toLocaleDateString("es-MX")}
                  </span>
                </td>
                <td data-label="Fecha Final">
                  <span className="Contratos-fecha">
                    {new Date(contrato.fecha_final_servicio).toLocaleDateString(
                      "es-MX"
                    )}
                  </span>
                </td>
                <td data-label="Pasajeros">
                  <span className="Contratos-badge-hora">
                    {contrato.numero_pasajeros}
                  </span>
                </td>
                <td data-label="Origen">
                  <span className="Contratos-ubicacion">
                    {contrato.ciudad_origen}
                  </span>
                </td>
                <td data-label="Destino">
                  <span className="Contratos-ubicacion">
                    {contrato.destino}
                  </span>
                </td>
                <td
                  data-label="Acciones"
                  className="Contratos-columna-acciones"
                >
                  <div className="Contratos-botones-accion">
                    <button
                      className="Contratos-boton-accion Contratos-ver"
                      onClick={() => manejarAccion("ver", contrato)}
                      title="Ver contrato"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="Contratos-boton-accion Contratos-descargar"
                      onClick={() => manejarAccion("pdf", contrato)}
                      title="Descargar contrato"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      className="Contratos-boton-accion Contratos-editar"
                      onClick={() => manejarAccion("editar", contrato)}
                      title="Editar contrato"
                    >
                      <Edit size={16} />
                    </button>

                    {esAdministrador && !contrato.activo && (
                      <button
                        className="Contratos-boton-accion Contratos-restaurar"
                        onClick={() => manejarAccion("restaurar", contrato)}
                        title="Restaurar contrato"
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
                      className="Contratos-boton-accion Contratos-eliminar"
                      onClick={() => manejarAccion("eliminar", contrato)}
                      title={
                        esAdministrador && !contrato.activo
                          ? "Eliminar definitivamente"
                          : "Desactivar contrato"
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

      <div className="Contratos-pie-tabla">
        <div className="Contratos-informacion-registros">
          Mostrando registros del {indiceInicio + 1} al{" "}
          {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros}{" "}
          registros
          {terminoBusqueda && (
            <span style={{ color: "#6c757d", marginLeft: "0.5rem" }}>
              (filtrado de {datosContratos.length} registros totales)
            </span>
          )}
        </div>

        <div className="Contratos-controles-paginacion">
          <button
            className="Contratos-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          <div className="Contratos-numeros-paginacion">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
              (numero) => (
                <button
                  key={numero}
                  className={`Contratos-numero-pagina ${
                    paginaActual === numero ? "Contratos-activo" : ""
                  }`}
                  onClick={() => cambiarPagina(numero)}
                >
                  {numero}
                </button>
              )
            )}
          </div>

          <button
            className="Contratos-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <ModalVerContrato
        estaAbierto={modalVerAbierto}
        contrato={contratoSeleccionado}
        alCerrar={cerrarModalVer}
      />

      <ModalEditarContrato
        estaAbierto={modalEditarAbierto}
        contrato={contratoSeleccionado}
        alCerrar={cerrarModalEditar}
        alGuardar={manejarGuardarContrato}
      />

      <ModalVisualizarPDF
        estaAbierto={modalPDFAbierto}
        pdfUrl={pdfUrl}
        contrato={contratoPDFActual}
        alCerrar={cerrarModalPDF}
        alDescargar={descargarPDF}
      />

      {contratoAEliminar && (
        <ModalEliminarContrato
          contrato={contratoAEliminar}
          alConfirmar={manejarEliminarContrato}
          esAdministrador={esAdministrador}
        />
      )}

      {contratoARestaurar && (
        <ModalRestaurarContrato
          contrato={contratoARestaurar}
          alConfirmar={manejarRestaurar}
          alCancelar={() => setContratoARestaurar(null)}
        />
      )}

      {contratoAEliminarDefinitivo && (
        <ModalEliminarDefinitivo
          contrato={contratoAEliminarDefinitivo}
          alConfirmar={manejarEliminarDefinitivo}
          alCancelar={() => setContratoAEliminarDefinitivo(null)}
        />
      )}
    </div>
  );
};

export default TablaContratos;
