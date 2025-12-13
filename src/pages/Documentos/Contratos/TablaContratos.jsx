import React, { useState, useEffect } from "react"; // ⭐ Agregar useEffect
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
import writtenNumber from "written-number";
import ModalVerContrato from "./Modales/ModalVerContrato";
import ModalEditarContrato from "./Modales/ModalEditarContrato";
import ModalEliminarContrato from "./Modales/ModalEliminarContrato";
import ModalRestaurarContrato from "./Modales/ModalRestaurarContrato";
import ModalEliminarDefinitivo from "./Modales/ModalEliminarDefinitivo";
import ModalVisualizarPDF from "../Contratos/Modales/ModalVisualizarPDF";
import "./TablaContratos.css";

const TablaContratos = () => {
  const [rolUsuario, setRolUsuario] = useState(
    localStorage.getItem("rol") || "vendedor"
  );

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

  const [datosContratos, setDatosContratos] = useState([]);

  useEffect(() => {
    cargarContratos();
  }, []);

  // ⭐ AGREGAR: Función para cargar contratos
  const cargarContratos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/contratos", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setDatosContratos(response.data);
      console.log("✅ Contratos cargados:", response.data.length);
    } catch (error) {
      console.error("❌ Error al cargar contratos:", error);
    }
  };

  const contratosFiltrados = datosContratos.filter((contrato) => {
    if (rolUsuario === "admin" && !contrato.activo) {
      return true;
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
        if (rolUsuario === "admin" && !contrato.activo) {
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

      // Función para dibujar texto ajustable en primera página
      const dibujarTextoAjustable = (
        texto,
        x,
        y,
        maxAncho,
        sizeInicial = 9,
        sizeMinimo = 5,
        centrar = false
      ) => {
        if (!texto) return;

        const textoStr = texto.toString();
        let size = sizeInicial;
        let anchoEstimado = textoStr.length * size * 0.5;

        while (anchoEstimado > maxAncho && size > sizeMinimo) {
          size -= 0.5;
          anchoEstimado = textoStr.length * size * 0.5;
        }

        // Calcular posición X si se requiere centrado
        let posX = x;
        if (centrar) {
          const anchoTexto = textoStr.length * size * 0.5;
          posX = x + (maxAncho - anchoTexto) / 2;
        }

        firstPage.drawText(textoStr, {
          x: posX,
          y,
          size,
          font,
          color: rgb(0, 0, 0),
        });
      };

      // Función para dibujar texto ajustable en segunda página
      const dibujarTextoAjustableSegundaPagina = (
        texto,
        x,
        y,
        maxAncho,
        sizeInicial = 9,
        sizeMinimo = 5,
        centrar = false
      ) => {
        if (!texto) return;

        const textoStr = texto.toString();
        let size = sizeInicial;
        let anchoEstimado = textoStr.length * size * 0.5;

        while (anchoEstimado > maxAncho && size > sizeMinimo) {
          size -= 0.5;
          anchoEstimado = textoStr.length * size * 0.5;
        }

        // Calcular posición X si se requiere centrado
        let posX = x;
        if (centrar) {
          const anchoTexto = textoStr.length * size * 0.5;
          posX = x + (maxAncho - anchoTexto) / 2;
        }

        secondPage.drawText(textoStr, {
          x: posX,
          y,
          size,
          font,
          color: rgb(0, 0, 0),
        });
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

      const fechaActual = new Date();
      const formatoActual = {
        weekday: "long",
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

      const formatoNombre = (nombre) => {
        return nombre
          .toLowerCase()
          .split(" ")
          .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(" ");
      };

      const campos = [
        {
          valor: formatoNombre(contrato.representante_empresa),
          x: 330,
          y: 700,
        },
        { valor: formatoNombre(contrato.nombre_cliente), x: 150, y: 680 },
        { valor: contrato.nacionalidad, x: 260, y: 460 },
        { valor: contrato.punto_intermedio, x: 186, y: 289 },
        { valor: contrato.n_unidades_contratadas, x: 220, y: 262 },
        { valor: contrato.numero_pasajeros, x: 170, y: 226 },
      ];

      const campos2 = [{ valor: contrato.capacidad_vehiculo, x: 240, y: 595 }];

      campos.forEach(({ valor, x, y }) => dibujar(valor, x, y));
      campos2.forEach(({ valor, x, y }) => dibujarSegundaPagina(valor, x, y));

      const camposAjustables = [
        {
          valor: contrato.fecha_liquidacion,
          x: 190,
          y: 79,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: contrato.domicilio,
          x: 110,
          y: 408,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: `$ ${contrato.importe_servicio}`,
          x: 200,
          y: 119,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: `${capitalize(numeroAMonedaTexto(contrato.importe_servicio))}`,
          x: 170,
          y: 106,
          maxAncho: 140,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: `$ ${contrato.anticipo}`,
          x: 190,
          y: 92,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: formatearFecha(contrato.fecha_inicio_servicio),
          x: 157,
          y: 212,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: contrato.horario_inicio_servicio,
          x: 275,
          y: 212,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: formatearFecha(contrato.fecha_final_servicio),
          x: 157,
          y: 200,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: contrato.horario_final_servicio,
          x: 275,
          y: 199,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: contrato.rfc,
          x: 100,
          y: 439,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: contrato.nombre_cliente,
          x: 170,
          y: 304,
          maxAncho: 100,
          sizeInicial: 8,
          sizeMinimo: 7,
          centrar: false,
        },
        {
          valor: contrato.telefono_cliente,
          x: 370,
          y: 398,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: contrato.telefono_cliente,
          x: 186,
          y: 276,
          maxAncho: 450,
          sizeInicial: 8,
          sizeMinimo: 5,
          centrar: false,
        },
        {
          valor: contrato.itinerario_detallado,
          x: 160,
          y: 187,
          maxAncho: 400,
          sizeInicial: 9,
          sizeMinimo: 5,
          centrar: false,
        },
      ];

      // Campos ajustables de la segunda página
      const camposAjustablesSegundaPagina = [
        {
          valor: fechaCompleta,
          x: 313,
          y: 120,
          maxAncho: 150,
          sizeInicial: 8,
          sizeMinimo: 7,
          centrar: false,
        },
        {
          valor: formatoNombre(contrato.nombre_cliente),
          x: 160,
          y: 70,
          maxAncho: 150,
          sizeInicial: 8,
          sizeMinimo: 7,
          centrar: true,
        },
        {
          valor: formatoNombre(contrato.representante_empresa),
          x: 320,
          y: 70,
          maxAncho: 120,
          sizeInicial: 8,
          sizeMinimo: 7,
          centrar: true,
        },
        {
          valor: contrato.marca_vehiculo,
          x: 122,
          y: 576,
          maxAncho: 50,
          sizeInicial: 8,
          sizeMinimo: 6,
          centrar: true,
        },
        {
          valor: contrato.modelo_vehiculo,
          x: 122,
          y: 595,
          maxAncho: 50,
          sizeInicial: 8,
          sizeMinimo: 6,
          centrar: true,
        },
        {
          valor: contrato.placa_vehiculo,
          x: 122,
          y: 585,
          maxAncho: 50,
          sizeInicial: 8,
          sizeMinimo: 6,
          centrar: true,
        },
      ];

      camposAjustables.forEach(
        ({ valor, x, y, maxAncho, sizeInicial, sizeMinimo, centrar }) => {
          dibujarTextoAjustable(
            valor,
            x,
            y,
            maxAncho,
            sizeInicial,
            sizeMinimo,
            centrar
          );
        }
      );

      camposAjustablesSegundaPagina.forEach(
        ({ valor, x, y, maxAncho, sizeInicial, sizeMinimo, centrar }) => {
          dibujarTextoAjustableSegundaPagina(
            valor,
            x,
            y,
            maxAncho,
            sizeInicial,
            sizeMinimo,
            centrar
          );
        }
      );

      const coordenadasTipoPasaje = {
        "Turismo Estatal": { x: 148, y: 235 },
        "Turismo Internacional": { x: 232, y: 235 },
        Nacional: { x: 273, y: 235 },
        Escolar: { x: 311, y: 235 },
      };

      if (contrato.tipo_pasaje === "Otro") {
        dibujar(contrato.otro_tipo_pasaje_especificacion, 381, 236, 7);
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

      if (contrato.aire_acondicionado === true) {
        dibujarSegundaPagina("X", 264, 585);
      }
      if (contrato.asientos_reclinables === true) {
        dibujarSegundaPagina("X", 264, 575);
      }

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

  const fixArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(",").map((v) => v.trim());
  };

  const manejarGuardarContrato = async (datosActualizados) => {
    try {
      const token = localStorage.getItem("token");

      // Crear objeto con los datos para el backend
      const datosContrato = {
        representante_empresa: datosActualizados.representante_empresa,
        domicilio: datosActualizados.domicilio,

        // Datos del cliente
        nombre_cliente: datosActualizados.nombre_cliente,
        nacionalidad: datosActualizados.nacionalidad,
        rfc: datosActualizados.rfc,
        telefono_cliente: datosActualizados.telefono_cliente,

        // Servicio
        ciudad_origen: datosActualizados.ciudad_origen,
        punto_intermedio: datosActualizados.punto_intermedio,
        destino: datosActualizados.destino,
        tipo_pasaje: datosActualizados.tipo_pasaje,
        otro_tipo_pasaje_especificacion:
          datosActualizados.otro_tipo_pasaje_especificacion,
        n_unidades_contratadas: datosActualizados.n_unidades_contratadas,
        numero_pasajeros: datosActualizados.numero_pasajeros,
        fecha_inicio_servicio: datosActualizados.fecha_inicio_servicio,
        horario_inicio_servicio: fixHora(
          datosActualizados.horario_inicio_servicio
        ),
        fecha_final_servicio: datosActualizados.fecha_final_servicio,
        horario_final_servicio: fixHora(
          datosActualizados.horario_final_servicio
        ),
        itinerario_detallado: datosActualizados.itinerario_detallado,

        // Costos
        importe_servicio: datosActualizados.importe_servicio,
        anticipo: datosActualizados.anticipo,
        fecha_liquidacion: datosActualizados.fecha_liquidacion,
        costos_cubiertos: fixArray(datosActualizados.costos_cubiertos),

        otro_costo_especificacion: datosActualizados.otro_costo_especificacion,

        // Vehículo
        marca_vehiculo: datosActualizados.marca_vehiculo,
        modelo_vehiculo: datosActualizados.modelo_vehiculo,
        placa_vehiculo: datosActualizados.placa_vehiculo,
        capacidad_vehiculo: datosActualizados.capacidad_vehiculo,
        aire_acondicionado: datosActualizados.aire_acondicionado,
        asientos_reclinables: datosActualizados.asientos_reclinables,
      };

      // ⭐ AGREGAR: Actualizar en backend
      await axios.put(
        `http://127.0.0.1:8000/api/contratos/${datosActualizados.id}`,
        datosContrato,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // ⭐ AGREGAR: Recargar datos
      await cargarContratos();

      console.log("✅ Contrato actualizado en backend");
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error al actualizar contrato:", error);
      throw error;
    }
  };

  const manejarEliminarContrato = async (contrato) => {
    if (!contrato) {
      setContratoAEliminar(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // ⭐ AGREGAR: Eliminar en backend
      await axios.delete(`http://127.0.0.1:8000/api/contratos/${contrato.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // ⭐ AGREGAR: Recargar datos
      await cargarContratos();

      setContratoAEliminar(null);
      console.log("✅ Contrato eliminado del backend");
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error al eliminar contrato:", error);
      setContratoAEliminar(null);
      throw error;
    }
  };

  const manejarRestaurar = async (contrato) => {
    try {
      const token = localStorage.getItem("token");

      // ⭐ AGREGAR: Restaurar en backend
      await axios.post(
        `http://127.0.0.1:8000/api/contratos/${contrato.id}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // ⭐ AGREGAR: Recargar datos
      await cargarContratos();

      setContratoARestaurar(null);
      console.log("✅ Contrato restaurado en backend");
    } catch (error) {
      console.error("❌ Error al restaurar contrato:", error);
    }
  };

  const manejarEliminarDefinitivo = async (contrato) => {
    try {
      const token = localStorage.getItem("token");

      // ⭐ AGREGAR: Forzar eliminación permanente
      await axios.delete(
        `http://127.0.0.1:8000/api/contratos/${contrato.id}/force`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // ⭐ AGREGAR: Recargar datos
      await cargarContratos();

      setContratoAEliminarDefinitivo(null);
      console.log("✅ Contrato eliminado DEFINITIVAMENTE del backend");
    } catch (error) {
      console.error("❌ Error al eliminar definitivamente contrato:", error);
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

          {rolUsuario === "admin" && (
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

                    {rolUsuario === "admin" && !contrato.activo && (
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
                        rolUsuario === "admin" && !contrato.activo
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
