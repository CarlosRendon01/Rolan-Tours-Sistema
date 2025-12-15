import React, { useState, useRef } from "react";
import {
  X,
  Download,
  Receipt,
  Calendar,
  User,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./ModalReciboAbono.css";
import writtenNumber from "written-number";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import ModalVisualizarPDF from "../Modales/ModalVisualizarPDF";

// ============================================
// UTILIDADES
// ============================================

const formatearFecha = (fecha) => {
  const opciones = { year: "numeric", month: "long", day: "numeric" };
  return new Date(fecha).toLocaleDateString("es-MX", opciones);
};

const formatearMoneda = (cantidad) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(cantidad);
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ModalReciboAbono = ({ abierto, onCerrar, pagoSeleccionado }) => {
  const [imprimiendo, setImprimiendo] = useState(false);
  const [abonoSeleccionado, setAbonoSeleccionado] = useState(null);
  const [modalPDFAbierto, setModalPDFAbierto] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [reciboPDFActual, setReciboPDFActual] = useState(null);
  const reciboRef = useRef(null);

  if (!abierto || !pagoSeleccionado) return null;

  // Filtrar solo abonos activos
  const abonosDisponibles =
    pagoSeleccionado.historialAbonos?.filter(
      (abono) => abono.activo !== false
    ) || [];

  const fechaActual = new Date().toLocaleDateString("es-MX");

  // Generar número de recibo basado en el abono seleccionado
  const numeroRecibo = abonoSeleccionado
    ? `REC-${pagoSeleccionado.id.toString().padStart(4, "0")}-${
        abonoSeleccionado.numeroAbono
      }`
    : `REC-${pagoSeleccionado.id.toString().padStart(4, "0")}`;

  // Función para generar PDF con la plantilla (igual que TablaRecibos)
  const generarPDF = async (datosRecibo) => {
    try {
      const plantillaUrl = "/ReciboPago.pdf";
      const plantillaBytes = await fetch(plantillaUrl).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(plantillaBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

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
        weekday: "long",
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

      // Extraer el monto numérico
      const montoNumerico =
        typeof datosRecibo?.monto === "number"
          ? datosRecibo.monto
          : parseFloat(String(datosRecibo?.monto).replace(/[$,]/g, ""));

      const campos = [
        { valor: datosRecibo?.cliente, x: 110, y: 247, z: 10 },
        { valor: datosRecibo?.numeroRecibo, x: 500, y: 299, z: 10 },
        { valor: datosRecibo?.id, x: 230, y: 299, z: 10 },
        {
          valor: `Abono número ${datosRecibo?.numeroAbono}`,
          x: 180,
          y: 155,
          z: 9,
        },
        { valor: `$ ${montoNumerico}`, x: 470, y: 153, z: 9 },
        { valor: `$ ${montoNumerico}`, x: 470, y: 88, z: 9 },
        { valor: `1`, x: 70, y: 153, z: 9 },
        { valor: datosRecibo?.cliente?.telefono || "", x: 100, y: 197, z: 9 },
        {
          valor: `${capitalize(numeroAMonedaTexto(montoNumerico))}`,
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
      ];

      campos.forEach(({ valor, x, y, z }) => dibujar(valor, x, y, z));

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    }
  };

  // Visualizar PDF en modal
  const visualizarPDF = async () => {
    if (!abonoSeleccionado) {
      alert("Por favor selecciona un abono");
      return;
    }

    try {
      setImprimiendo(true);

      // Obtener el ID del recibo asociado al abono
      const reciboId = abonoSeleccionado.recibo_id || abonoSeleccionado.id;

      // Hacer petición al backend para obtener los datos completos del recibo
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/abonos/${reciboId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los datos del recibo");
      }

      const data = await response.json();
      const reciboCompleto = data.data || data;

      console.log("=== DEBUG RECIBO ===");
      console.log("Recibo completo:", reciboCompleto);
      console.log(
        "Todas las propiedades del recibo:",
        Object.keys(reciboCompleto)
      );
      console.log("ID:", reciboCompleto.id);
      console.log("numeroRecibo:", reciboCompleto.numeroRecibo);
      console.log("cliente:", reciboCompleto.cliente);
      console.log("concepto:", reciboCompleto.concepto);
      console.log("descripcion:", reciboCompleto.descripcion);
      console.log("detalle:", reciboCompleto.detalle);
      console.log("monto:", reciboCompleto.monto);
      console.log("==================");

      setReciboPDFActual(reciboCompleto);
      setModalPDFAbierto(true);
      setPdfUrl(null);
      setImprimiendo(false);

      const pdfBytes = await generarPDF(reciboCompleto);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error al visualizar PDF:", error);
      alert(
        "Error al obtener los datos del recibo. Por favor, intente nuevamente."
      );
      setImprimiendo(false);
      cerrarModalPDF();
    }
  };

  // Descargar PDF
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

      console.log(
        `PDF descargado correctamente - Recibo ID: ${reciboPDFActual.id}`
      );
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Error al descargar el PDF. Por favor, intente nuevamente.");
    }
  };

  // Cerrar modal PDF
  const cerrarModalPDF = () => {
    setModalPDFAbierto(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setReciboPDFActual(null);
  };

  const manejarClickOverlay = (e) => {
    if (e.target === e.currentTarget) {
      onCerrar();
    }
  };

  return (
    <>
      <div className="modal-recibo-overlay" onClick={manejarClickOverlay}>
        <div
          className="modal-recibo-contenedor"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="modal-recibo-header no-print">
            <div className="modal-recibo-titulo-seccion">
              <Receipt size={28} className="modal-recibo-icono-titulo" />
              <div>
                <h2 className="modal-recibo-titulo">
                  Recibo de Pago por Abono
                </h2>
                <p className="modal-recibo-subtitulo">
                  Selecciona el abono para generar el recibo
                </p>
              </div>
            </div>
            <button
              className="modal-recibo-boton-cerrar"
              onClick={onCerrar}
              title="Cerrar (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* SELECTOR DE ABONOS */}
          <div className="modal-recibo-contenido" ref={reciboRef}>
            {abonosDisponibles.length === 0 ? (
              <div className="recibo-sin-abonos">
                <AlertCircle size={48} className="recibo-sin-abonos-icono" />
                <p className="recibo-sin-abonos-texto">
                  No hay abonos disponibles
                </p>
              </div>
            ) : (
              <div className="recibo-selector-abonos">
                <h3 className="recibo-selector-titulo">
                  Selecciona el abono para generar el recibo:
                </h3>
                {abonosDisponibles.map((abono) => {
                  const esSeleccionado = abonoSeleccionado?.id === abono.id;

                  return (
                    <div
                      key={abono.id}
                      onClick={() => setAbonoSeleccionado(abono)}
                      className={`recibo-abono-card ${
                        esSeleccionado ? "seleccionado" : ""
                      }`}
                    >
                      {esSeleccionado && (
                        <div className="recibo-abono-check">
                          <CheckCircle size={16} />
                        </div>
                      )}
                      <div className="recibo-abono-contenido">
                        <div className="recibo-abono-info">
                          <p className="recibo-abono-numero">
                            Abono #{abono.numeroAbono}
                          </p>
                          <p className="recibo-abono-detalles">
                            {new Date(abono.fecha).toLocaleDateString("es-MX")}{" "}
                            • {abono.metodoPago}
                          </p>
                          {abono.recibo_id && (
                            <p className="recibo-abono-recibo-id">
                              Recibo ID: {abono.recibo_id}
                            </p>
                          )}
                        </div>
                        <p className="recibo-abono-monto">
                          {formatearMoneda(abono.monto)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="modal-recibo-acciones no-print">
            <button
              className="modal-recibo-boton modal-recibo-boton-secundario"
              onClick={onCerrar}
              disabled={imprimiendo}
            >
              <X size={18} />
              Cerrar
            </button>
            <button
              className="modal-recibo-boton modal-recibo-boton-primario"
              onClick={visualizarPDF}
              disabled={imprimiendo || !abonoSeleccionado}
            >
              <FileText size={18} />
              Ver Recibo PDF
            </button>
          </div>
        </div>
      </div>

      {/* Modal de visualización de PDF */}
      <ModalVisualizarPDF
        estaAbierto={modalPDFAbierto}
        pdfUrl={pdfUrl}
        recibo={reciboPDFActual}
        alCerrar={cerrarModalPDF}
        alDescargar={descargarPDF}
      />
    </>
  );
};

export default ModalReciboAbono;
