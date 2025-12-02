import { useState } from "react";
import {
  X,
  User,
  Phone,
  Calendar,
  CreditCard,
  FileText,
  Hash,
  DollarSign,
  Eye,
  Download,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react";
import "./ModalVerReserva.css";

const ModalVerReserva = ({ reserva, onCerrar, estaAbierto }) => {
  const [seccionActiva, setSeccionActiva] = useState("basicos");

  // VALIDACIÓN TEMPRANA - Debe ir al inicio
  if (!estaAbierto || !reserva) {
    return null;
  }

  const obtenerUrlArchivo = (archivo) => {
    if (!archivo) return null;
    if (typeof archivo === "string") return archivo;
    if (archivo instanceof File) return URL.createObjectURL(archivo);
    return null;
  };

  const fotoTransferenciaUrl = obtenerUrlArchivo(reserva.fotoTransferencia);

  const formatearTelefono = (telefono) => {
    if (!telefono) return "N/A";
    const limpio = telefono.replace(/\D/g, "");
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(
        3,
        6
      )}-${limpio.substring(6)}`;
    }
    return telefono;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearMoneda = (cantidad) => {
    if (!cantidad) return "N/A";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad);
  };

  const handleVerDocumento = (archivo) => {
    if (!archivo) {
      alert("No hay documento disponible para visualizar");
      return;
    }

    if (archivo instanceof File) {
      const url = URL.createObjectURL(archivo);
      window.open(url, "_blank");
      return;
    }

    if (typeof archivo === "string" && archivo !== "null" && archivo !== null) {
      window.open(archivo, "_blank");
      return;
    }

    alert("No hay documento disponible para visualizar");
  };

  const handleDescargar = (archivo, nombreDocumento) => {
    if (!archivo) {
      alert("No hay documento disponible para descargar");
      return;
    }

    if (archivo instanceof File) {
      const url = URL.createObjectURL(archivo);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        archivo.name || `Reserva_${reserva.folio}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    if (typeof archivo === "string") {
      const link = document.createElement("a");
      link.href = archivo;
      link.download = `Reserva_${reserva.folio}_${nombreDocumento}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    alert("No hay documento disponible para descargar");
  };

  const renderSeccionBasicos = () => (
    <>
      <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="meg-form-group">
          <label>
            <Hash size={18} style={{ display: "inline", marginRight: "8px" }} />
            Folio
          </label>
          <div className="mvg-campo-valor">#{reserva.folio}</div>
        </div>
      </div>

      <div className="meg-form-grid">
        <div className="meg-form-group">
          <label>
            <Calendar
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Fecha de Reserva
          </label>
          <div className="mvg-campo-valor">
            {formatearFecha(reserva.fechaReserva)}
          </div>
        </div>

        <div className="meg-form-group">
          <label>
            <MapPin
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            N° Habitantes
          </label>
          <div className="mvg-campo-valor">
            {reserva.numHabitantes || "N/A"}
          </div>
        </div>
      </div>

      <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="meg-form-group">
          <label>
            <User size={18} style={{ display: "inline", marginRight: "8px" }} />
            Nombre Cliente
          </label>
          <div className="mvg-campo-valor">
            {reserva.nombreCliente || "N/A"}
          </div>
        </div>
      </div>

      <div
        className="meg-form-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <div className="meg-form-group">
          <label>
            <Users
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            N° Pasajeros
          </label>
          <div className="mvg-campo-valor">{reserva.numPasajeros || "N/A"}</div>
        </div>

        <div className="meg-form-group">
          <label>
            <Phone
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Teléfono
          </label>
          <div className="mvg-campo-valor">
            {formatearTelefono(reserva.telefono)}
          </div>
        </div>

        <div className="meg-form-group">
          <label>
            <DollarSign
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Importe
          </label>
          <div className="mvg-campo-valor mvg-campo-destacado">
            {formatearMoneda(reserva.importe)}
          </div>
        </div>
      </div>

      <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="meg-form-group">
          <label>
            <FileText
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Servicio
          </label>
          <div className="mvg-campo-valor mvg-campo-texto">
            {reserva.servicio || "Sin descripción"}
          </div>
        </div>
      </div>

      <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="meg-form-group">
          <label>
            <CheckCircle
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Incluye
          </label>
          <div className="mvg-campo-valor mvg-campo-texto">
            {reserva.incluye || "No especificado"}
          </div>
        </div>
      </div>

      <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="meg-form-group">
          <label>
            <XCircle
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            No Incluye
          </label>
          <div className="mvg-campo-valor mvg-campo-texto">
            {reserva.noIncluye || "No especificado"}
          </div>
        </div>
      </div>

      <div className="meg-form-grid">
        <div className="meg-form-group">
          <label>
            <CreditCard
              size={18}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Forma de Pago
          </label>
          <div className="mvg-campo-valor">
            {reserva.formaPago === "transferencia"
              ? "Transferencia"
              : "Efectivo"}
          </div>
        </div>

        <div className="meg-form-group">
          <label>
            {reserva.pagado === "pagado" ? (
              <CheckCircle
                size={18}
                style={{
                  display: "inline",
                  marginRight: "8px",
                  color: "#10b981",
                }}
              />
            ) : (
              <XCircle
                size={18}
                style={{
                  display: "inline",
                  marginRight: "8px",
                  color: "#ef4444",
                }}
              />
            )}
            Estado de Pago
          </label>
          <div
            className={`mvg-campo-valor ${reserva.pagado === "pagado"
                ? "mvg-estado-pagado"
                : "mvg-estado-no-pagado"
              }`}
          >
            {reserva.pagado === "pagado" ? "✓ Pagado" : "✗ No Pagado"}
          </div>
        </div>
      </div>
    </>
  );

  const renderSeccionDocumentos = () => (
    <>
      {reserva.formaPago === "transferencia" ? (
        <div className="meg-form-grid-documentos">
          {fotoTransferenciaUrl ? (
            <div className="meg-form-group-file">
              <label>
                <Upload size={20} />
                Comprobante de Transferencia
              </label>
              <div className="mvg-documento-preview">
                <div className="mvg-documento-info">
                  <CreditCard size={32} />
                  <span className="mvg-documento-nombre">
                    {typeof reserva.fotoTransferencia === "string"
                      ? "Comprobante de transferencia"
                      : reserva.fotoTransferencia?.name ||
                      "Comprobante de transferencia"}
                  </span>
                </div>
                <div className="mvg-documento-acciones">
                  <button
                    className="mvg-btn-accion mvg-btn-ver"
                    onClick={() =>
                      handleVerDocumento(reserva.fotoTransferencia)
                    }
                  >
                    <Eye size={16} />
                    Ver
                  </button>
                  <button
                    className="mvg-btn-accion mvg-btn-descargar"
                    onClick={() =>
                      handleDescargar(
                        reserva.fotoTransferencia,
                        "comprobante_transferencia"
                      )
                    }
                  >
                    <Download size={16} />
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="meg-form-group-file">
              <label>
                <Upload size={20} />
                Comprobante de Transferencia
              </label>
              <div className="mvg-sin-documento">
                <FileText size={32} />
                <span>No hay comprobante adjunto</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="mvg-sin-documento"
          style={{ textAlign: "center", padding: "3rem" }}
        >
          <CreditCard
            size={48}
            style={{ margin: "0 auto 1rem", opacity: 0.3 }}
          />
          <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
            El pago fue realizado en <strong>efectivo</strong>
          </p>
          <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>
            No se requiere comprobante
          </p>
        </div>
      )}
    </>
  );

  return (
    <div className="meg-overlay" onClick={onCerrar}>
      <div
        className="meg-contenido modal-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="meg-header">
          <h2>Ver Reserva #{reserva.folio}</h2>
          <button className="meg-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        <div className="meg-tabs">
          <button
            className={`meg-tab-button ${seccionActiva === "basicos" ? "active" : ""
              }`}
            onClick={() => setSeccionActiva("basicos")}
            type="button"
          >
            <FileText size={18} />
            Información de Reserva
          </button>
          <button
            className={`meg-tab-button ${seccionActiva === "documentos" ? "active" : ""
              }`}
            onClick={() => setSeccionActiva("documentos")}
            type="button"
          >
            <Upload size={18} />
            Comprobante de Pago
          </button>
        </div>

        <div className="meg-form">
          {seccionActiva === "basicos" && renderSeccionBasicos()}
          {seccionActiva === "documentos" && renderSeccionDocumentos()}
        </div>

        <div className="meg-footer">
          <div className="meg-botones-izquierda"></div>
          <div className="meg-botones-derecha">
            <button
              type="button"
              className="meg-btn-cancelar"
              onClick={onCerrar}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerReserva;
