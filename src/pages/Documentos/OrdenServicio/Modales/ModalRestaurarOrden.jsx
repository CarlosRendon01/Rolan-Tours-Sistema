import React, { useState } from "react";
import { RotateCcw, X, Info } from "lucide-react";
import "./ModalRestaurarOrden.css";

const ModalRestaurarOrden = ({ orden, alConfirmar, alCancelar }) => {
  const [restaurando, setRestaurando] = useState(false);

  const mostrarNotificacionExito = () => {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({
        title: "¡Orden Restaurado!",
        text: "El orden ha sido restaurado correctamente y está activo nuevamente",
        icon: "success",
        iconHtml: "✓",
        iconColor: "#28a745",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#28a745",
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
        customClass: {
          popup: "swal-popup-custom-editar",
          title: "swal-title-custom-editar",
          content: "swal-content-custom-editar",
          confirmButton: "swal-button-custom-editar",
          icon: "swal-icon-success-custom",
        },
        background: "#ffffff",
        backdrop: `
          rgba(44, 62, 80, 0.8)
          left top
          no-repeat
        `,
      });
    } else {
      alert("El orden ha sido restaurado correctamente");
    }
  };

  const manejarConfirmar = async () => {
    try {
      setRestaurando(true);

      await alConfirmar(orden);

      setRestaurando(false);
      alCancelar();

      mostrarNotificacionExito();
    } catch (error) {
      console.error("Error al restaurar orden:", error);
      setRestaurando(false);

      if (typeof window !== "undefined" && window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Hubo un problema al restaurar el orden. Por favor, intenta nuevamente.",
          icon: "error",
          confirmButtonText: "Reintentar",
          confirmButtonColor: "#dc3545",
          customClass: {
            popup: "swal-popup-custom-editar",
            title: "swal-title-custom-editar",
            content: "swal-content-custom-editar",
            confirmButton: "swal-button-error-editar",
          },
        });
      } else {
        alert("Error al restaurar el orden. Intenta nuevamente.");
      }
    }
  };

  const manejarCancelar = () => {
    if (!restaurando) {
      alCancelar();
    }
  };

  if (!orden) return null;

  return (
    <div className="modal-restaurar-overlay" onClick={manejarCancelar}>
      <div
        className="modal-restaurar-contenedor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-restaurar-header">
          <div className="modal-restaurar-icono-header">
            <RotateCcw size={24} />
          </div>
          <div className="modal-restaurar-titulo-seccion">
            <h2 className="modal-restaurar-titulo">Restaurar Orden</h2>
            <p className="modal-restaurar-subtitulo">Reactivar orden eliminada</p>
          </div>
          <button
            className="modal-restaurar-boton-cerrar"
            onClick={manejarCancelar}
            disabled={restaurando}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-restaurar-contenido">
          <div className="modal-restaurar-alerta">
            <Info size={20} />
            <div>
              <p className="modal-restaurar-alerta-titulo">Acción de administrador</p>
              <p className="modal-restaurar-alerta-texto">
                Esta orden fue eliminada visualmente. Al restaurarla,
                volverá a estar visible y activa para todos los usuarios.
              </p>
            </div>
          </div>

          <div className="modal-restaurar-orden-info">
            <div className="modal-restaurar-info-item">
              <span className="modal-restaurar-info-label">ID de Orden:</span>
              <span className="modal-restaurar-info-value modal-restaurar-destacado">
                #{orden.id}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-restaurar-footer">
          <button
            className="modal-restaurar-boton-secundario"
            onClick={manejarCancelar}
            disabled={restaurando}
          >
            Cancelar
          </button>
          <button
            className="modal-restaurar-boton-principal"
            onClick={manejarConfirmar}
            disabled={restaurando}
          >
            {restaurando ? (
              <>
                <RotateCcw size={16} className="modal-restaurar-icono-girando" />
                Restaurando...
              </>
            ) : (
              <>
                <RotateCcw size={16} />
                Restaurar Orden
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRestaurarOrden;