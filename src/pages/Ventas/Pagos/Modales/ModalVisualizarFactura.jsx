import React, { useEffect, useState } from "react";
import { X, Download, FileSpreadsheet, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import "./ModalVisualizarFactura.css";

const ModalVisualizarFactura = ({
  estaAbierto,
  factura,
  alCerrar,
  alDescargar,
}) => {
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [usandoPlantilla, setUsandoPlantilla] = useState(false);

  useEffect(() => {
    if (estaAbierto && factura) {
      cargarPlantillaDesdePublic();
    }
  }, [estaAbierto, factura]);

  const cargarPlantillaDesdePublic = async () => {
    setCargando(true);
    try {
      // Cargar la plantilla desde public
      const response = await fetch("/Factura.xlsm");

      if (!response.ok) {
        throw new Error("No se pudo cargar la plantilla");
      }

      const arrayBuffer = await response.arrayBuffer();
      await procesarPlantilla(arrayBuffer);
      setUsandoPlantilla(true);
    } catch (error) {
      console.error("Error al cargar plantilla:", error);
      alert(
        "⚠️ No se encontró la plantilla en public/Factura.xlsm. Generando Excel básico..."
      );
      generarVistaPrevia();
      setUsandoPlantilla(false);
    } finally {
      setCargando(false);
    }
  };

  const manejarSubidaPlantilla = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setCargando(true);

    try {
      const arrayBuffer = await archivo.arrayBuffer();
      await procesarPlantilla(arrayBuffer);
      setUsandoPlantilla(true);
      alert("✅ Plantilla personalizada cargada correctamente");
    } catch (error) {
      console.error("Error al procesar plantilla:", error);
      alert("❌ Error al cargar la plantilla personalizada");
    } finally {
      setCargando(false);
    }
  };

  const procesarPlantilla = async (arrayBuffer) => {
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Llenar datos en celdas específicas (ajusta según tu plantilla)
    // Estas son las celdas de ejemplo, cámbialas según tu plantilla real
    worksheet["B5"] = { v: factura.numeroFactura, t: "s" };
    worksheet["B6"] = { v: factura.serie, t: "s" };
    worksheet["B7"] = { v: factura.folio, t: "s" };
    worksheet["B8"] = { v: factura.cliente, t: "s" };
    worksheet["B9"] = { v: factura.rfc, t: "s" };
    worksheet["B10"] = { v: factura.monto, t: "n" };
    worksheet["B11"] = { v: factura.fechaEmision, t: "s" };
    worksheet["B12"] = { v: factura.uuid, t: "s" };
    worksheet["B13"] = { v: factura.estado, t: "s" };

    // Si hay fecha de cancelación
    if (factura.fechaCancelacion) {
      worksheet["B14"] = { v: factura.fechaCancelacion, t: "s" };
    }

    // Generar HTML para previsualización
    const html = XLSX.utils.sheet_to_html(worksheet, {
      editable: false,
      header: "",
      footer: "",
    });

    setVistaPrevia({ workbook, html });
  };

  const generarVistaPrevia = () => {
    setCargando(true);

    // Crear nuevo libro Excel
    const workbook = XLSX.utils.book_new();

    // Crear datos estructurados
    const datos = [
      ["FACTURA ELECTRÓNICA", "", "", "", "", ""],
      [],
      [
        "Número de Factura:",
        factura.numeroFactura,
        "",
        "Serie:",
        factura.serie,
      ],
      ["Folio:", factura.folio, "", "Estado:", factura.estado],
      [],
      ["DATOS DEL CLIENTE"],
      ["Cliente:", factura.cliente],
      ["RFC:", factura.rfc],
      [],
      ["DETALLES DE FACTURACIÓN"],
      [
        "Monto:",
        `$${factura.monto.toLocaleString("es-MX", {
          minimumFractionDigits: 2,
        })}`,
      ],
      ["Fecha de Emisión:", factura.fechaEmision],
      [],
      ["UUID:", factura.uuid],
      [],
      ["INFORMACIÓN ADICIONAL"],
      factura.estado === "CANCELADA" && factura.fechaCancelacion
        ? ["Fecha de Cancelación:", factura.fechaCancelacion]
        : ["Estado:", "Activa"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(datos);

    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 30 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 40 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Factura");

    // Generar HTML para vista previa
    const html = XLSX.utils.sheet_to_html(worksheet, {
      editable: false,
      header: "",
      footer: "",
    });

    setVistaPrevia({ workbook, html });
    setCargando(false);
  };

  const descargarExcel = () => {
    if (!vistaPrevia?.workbook) return;

    const nombreArchivo = `factura_${factura.numeroFactura}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    XLSX.writeFile(vistaPrevia.workbook, nombreArchivo);

    if (alDescargar) {
      alDescargar(nombreArchivo);
    }
  };

  if (!estaAbierto) return null;

  return (
    <div className="modal-visualizar-excel-overlay" onClick={alCerrar}>
      <div
        className="modal-visualizar-excel-contenedor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-visualizar-excel-encabezado">
          <div>
            <h2 className="modal-visualizar-excel-titulo">
              <FileSpreadsheet size={24} />
              {usandoPlantilla
                ? "Previsualización - Plantilla Cargada"
                : "Previsualización Excel - Factura"}
            </h2>
            <p className="modal-visualizar-excel-subtitulo">
              N° Factura: {factura?.numeroFactura} | Cliente: {factura?.cliente}
            </p>
          </div>
          <div className="modal-visualizar-excel-botones-header">
            <label className="modal-visualizar-excel-boton-plantilla">
              <Upload size={18} />
              Otra Plantilla
              <input
                type="file"
                accept=".xlsx,.xls,.xlsm"
                onChange={manejarSubidaPlantilla}
                style={{ display: "none" }}
              />
            </label>
            <button
              onClick={descargarExcel}
              className="modal-visualizar-excel-boton-descargar"
              title="Descargar Excel"
              disabled={!vistaPrevia}
            >
              <Download size={18} />
              Descargar
            </button>
            <button
              onClick={alCerrar}
              className="modal-visualizar-excel-boton-cerrar"
              title="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-visualizar-excel-contenido">
          {cargando ? (
            <div className="modal-visualizar-excel-cargando">
              <div className="spinner"></div>
              <p>Cargando plantilla y generando previsualización...</p>
            </div>
          ) : vistaPrevia ? (
            <div className="modal-visualizar-excel-tabla-contenedor">
              <div
                className="modal-visualizar-excel-tabla"
                dangerouslySetInnerHTML={{ __html: vistaPrevia.html }}
              />
            </div>
          ) : (
            <div className="modal-visualizar-excel-vacio">
              <FileSpreadsheet size={64} color="#6b7280" />
              <p>No se pudo generar la previsualización</p>
            </div>
          )}
        </div>

        <div className="modal-visualizar-excel-footer">
          <p className="modal-visualizar-excel-nota">
            {usandoPlantilla ? (
              <>
                ✅ <strong>Usando plantilla:</strong> Factura.xlsm | Los datos
                se llenan automáticamente en las celdas B5-B13
              </>
            ) : (
              <>
                💡 <strong>Nota:</strong> Coloca tu plantilla Factura.xlsm en la
                carpeta public/ para usarla automáticamente
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModalVisualizarFactura;
