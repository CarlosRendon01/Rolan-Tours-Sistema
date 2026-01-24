import React, { useState } from "react";
import axios from "axios";
import { X, XCircle, Trash2 } from "lucide-react";
import "./ModalEliminarDefinitivo.css";
import { API_CONFIG } from "../../../../config/api";

const ModalEliminarDefinitivo = ({
  estaAbierto,
  alCerrar,
  pago,
  alEliminar,
}) => {
  const [cargando, setCargando] = useState(false);

  if (!estaAbierto || !pago) return null;

  const manejarCancelar = () => {
    if (!cargando) {
      alCerrar();
    }
  };

  const manejarEliminarDefinitivo = async () => {
    setCargando(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const token = localStorage.getItem("token");
      await axios.delete(`${API_CONFIG.BASE_URL}/pagos/${pago.id}/force`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (alEliminar) {
        await alEliminar(pago);
      }

      setTimeout(() => {
        setCargando(false);
        alCerrar();
      }, 500);
    } catch (error) {
      console.error("Error al eliminar pago:", error);
      setCargando(false);
      alert(
        "Ocurrió un error al eliminar el pago. Por favor, intente nuevamente."
      );
    }
  };

  return (
    <div className="modal-overlay-eliminar" onClick={manejarCancelar}>
      <div
        className="modal-contenido-eliminar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-eliminar paso1">
          <div className="modal-header-icono-eliminar">
            <Trash2 size={24} />
          </div>
          <h2 className="modal-titulo-eliminar">Eliminar Definitivamente</h2>
          <button
            className="modal-boton-cerrar-eliminar"
            onClick={manejarCancelar}
            disabled={cargando}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-cuerpo-eliminar">
          <div className="eliminar-alerta-principal">
            <XCircle size={20} />
            <div className="eliminar-alerta-texto">
              <p className="eliminar-alerta-titulo">¡Advertencia Crítica!</p>
              <p className="eliminar-alerta-descripcion">
                Esta acción eliminará el pago de forma{" "}
                <strong>permanente</strong> de la base de datos. No podrá
                recuperarse después de confirmar esta operación.
              </p>
            </div>
          </div>

          <div className="eliminar-info-pago">
            <div className="eliminar-info-fila">
              <span className="eliminar-info-label">ID:</span>
              <span className="eliminar-info-valor">
                #{pago.id.toString().padStart(3, "0")}
              </span>
            </div>
            <div className="eliminar-info-fila">
              <span className="eliminar-info-label">Cliente:</span>
              <span className="eliminar-info-valor">
                {pago.cliente?.nombre || "Sin nombre"}
              </span>
            </div>
            <div className="eliminar-info-fila">
              <span className="eliminar-info-label">Monto:</span>
              <span className="eliminar-info-valor eliminar-monto">
                {pago.planPago.montoTotal}
              </span>
            </div>
            <div className="eliminar-info-fila">
              <span className="eliminar-info-label">Estado:</span>
              <span className={`eliminar-badge ${pago.estado.toLowerCase()}`}>
                {pago.estado}
              </span>
            </div>
            <div className="eliminar-info-fila">
              <span className="eliminar-info-label">Visible:</span>
              <span className="eliminar-info-valor">
                {pago.activo ? "Sí" : "No (Eliminado)"}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer-eliminar">
          <button
            className="boton-cancelar-eliminar"
            onClick={manejarCancelar}
            disabled={cargando}
          >
            <X size={18} />
            Cancelar
          </button>
          <button
            className="boton-eliminar-definitivo"
            onClick={manejarEliminarDefinitivo}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <div className="spinner-eliminar"></div>
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Eliminar Permanentemente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarDefinitivo;
