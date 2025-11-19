import React from "react";
import { X, Download } from "lucide-react";
import "./ModalVisualizarPDF.css";

const ModalVisualizarPDF = ({
  estaAbierto,
  pdfUrl,
  contrato,
  alCerrar,
  alDescargar,
}) => {
  if (!estaAbierto) return null;

  return (
    <div className="modal-visualizar-pdf-overlay" onClick={alCerrar}>
      <div
        className="modal-visualizar-pdf-contenedor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-visualizar-pdf-encabezado">
          <div>
            <h2 className="modal-visualizar-pdf-titulo">
              Previsualización de contrato
            </h2>
            <p className="modal-visualizar-pdf-subtitulo">
              Nombre: {contrato?.nombre_cliente}
            </p>
          </div>
          <div className="modal-visualizar-pdf-botones-header">
            <button
              onClick={alDescargar}
              className="modal-visualizar-pdf-boton-descargar"
              title="Descargar PDF"
            >
              <Download size={18} />
              Descargar
            </button>
            <button
              onClick={alCerrar}
              className="modal-visualizar-pdf-boton-cerrar"
              title="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-visualizar-pdf-contenido">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="modal-visualizar-pdf-iframe"
              title="Previsualización PDF"
            />
          ) : (
            <div className="modal-visualizar-pdf-cargando">
              <div className="spinner"></div>
              <p>Generando previsualización...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalVisualizarPDF;
