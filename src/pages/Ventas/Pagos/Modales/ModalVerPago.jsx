import React from "react";
import {
  X,
  User,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Hash,
} from "lucide-react";
import "./ModalVerPago.css";

const ModalVerPago = ({ estaAbierto, alCerrar, pago }) => {
  const obtenerColorEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case "pagado":
        return "#10b981";
      case "vencido":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  React.useEffect(() => {
    if (!estaAbierto) return;

    document.body.style.overflow = "hidden";

    const manejarTeclaEscape = (evento) => {
      if (evento.key === "Escape") {
        alCerrar();
      }
    };

    document.addEventListener("keydown", manejarTeclaEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", manejarTeclaEscape);
    };
  }, [estaAbierto, alCerrar]);

  if (!estaAbierto || !pago) {
    return null;
  }

  return (
    <div className="superposicion-modal-pago" onClick={alCerrar}>
      <div
        className="contenido-modal-pago"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="encabezado-modal-pago">
          <button
            className="boton-cerrar-modal-pago"
            onClick={alCerrar}
            aria-label="Cerrar modal"
            type="button"
          >
            <X size={20} />
          </button>
          <h2 className="titulo-modal-pago">
            <FileText size={24} />
            Detalles del Pago
          </h2>
        </div>

        <div className="cuerpo-modal-pago">
          <div className="contenedor-insignia-estado-pago">
            <div
              className="insignia-estado-pago"
              style={{
                backgroundColor: `${obtenerColorEstado(pago.estado)}15`,
                borderColor: obtenerColorEstado(pago.estado),
                color: obtenerColorEstado(pago.estado),
              }}
            >
              <span
                className="punto-estado-pago"
                style={{ backgroundColor: obtenerColorEstado(pago.estado) }}
              ></span>
              {pago.estado}
            </div>
          </div>

          <div className="lista-informacion-pago">
            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <Hash size={16} />
                ID del Pago
              </div>
              <div className="valor-informacion-pago">
                #{pago.id?.toString().padStart(3, "0")}
              </div>
            </div>

            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <User size={16} />
                Cliente
              </div>
              <div className="valor-informacion-pago">
                {pago.cliente?.nombre || pago.cliente || "Sin cliente"}
              </div>
            </div>

            <div className="elemento-informacion-pago elemento-destacado-pago">
              <div className="etiqueta-informacion-pago">
                <DollarSign size={16} />
                Monto
              </div>
              <div className="valor-informacion-pago valor-monto-pago">
                {pago.planPago?.montoTotal}
              </div>
            </div>

            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <Calendar size={16} />
                Fecha de Pago
              </div>
              <div className="valor-informacion-pago">
                {pago.fechaInicio || (
                  <span className="texto-vacio-pago">No registrada</span>
                )}
              </div>
            </div>

            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <Clock size={16} />
                Fecha de Vencimiento
              </div>
              <div className="valor-informacion-pago">
                {pago.proximoVencimiento || (
                  <span className="texto-vacio-pago">No especificada</span>
                )}
              </div>
            </div>

            <div className="elemento-informacion-pago">
              <div className="etiqueta-informacion-pago">
                <CreditCard size={16} />
                Método de Pago
              </div>
              <div className="valor-informacion-pago">
                {pago.metodoPago || (
                  <span className="texto-vacio-pago">No especificado</span>
                )}
              </div>
            </div>

            {pago.observaciones && (
              <div className="elemento-informacion-pago">
                <div className="etiqueta-informacion-pago">
                  <FileText size={16} />
                  Observaciones
                </div>
                <div className="valor-informacion-pago">
                  {pago.observaciones}
                </div>
              </div>
            )}
          </div>

          <div className="contenedor-boton-inferior-pago">
            <button
              className="boton-cerrar-inferior-pago"
              onClick={alCerrar}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerPago;
