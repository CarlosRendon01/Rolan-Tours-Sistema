import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Download,
  Printer,
  Mail,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  FileX,
} from "lucide-react";
import "./ModalGenerarFactura.css";
import {
  generarPDFFacturaTimbrada,
  imprimirFacturaTimbrada,
} from "../ModalesFactura/generarPDFFacturaTimbrada";

const ModalGenerarFactura = ({
  estaAbierto,
  alCerrar,
  pago,
  onFacturaGenerada,
}) => {
  const [generando, establecerGenerando] = useState(false);
  const [error, establecerError] = useState(null);
  const [mensajeExito, establecerMensajeExito] = useState(null);

  useEffect(() => {
    if (estaAbierto) {
      establecerError(null);
      establecerMensajeExito(null);
    }
  }, [estaAbierto]);

  useEffect(() => {
    const manejarTeclaEscape = (e) => {
      if (e.key === "Escape" && !generando && estaAbierto) {
        alCerrar();
      }
    };

    if (estaAbierto) {
      document.addEventListener("keydown", manejarTeclaEscape);
    }

    return () => {
      document.removeEventListener("keydown", manejarTeclaEscape);
    };
  }, [estaAbierto, generando, alCerrar]);

  if (!estaAbierto || !pago) return null;

  // ✅ Validación de datos fiscales completos
  const validarDatosFiscales = () => {
    const camposFaltantes = [];

    if (!pago.rfcCliente) camposFaltantes.push("RFC del cliente");
    if (!pago.razonSocialCliente) camposFaltantes.push("Razón Social");
    if (!pago.usoCFDI) camposFaltantes.push("Uso de CFDI");
    if (!pago.formaPago) camposFaltantes.push("Forma de Pago");
    if (!pago.lugarExpedicion) camposFaltantes.push("Lugar de Expedición");

    return camposFaltantes;
  };

  // ✅ Verificar si ya tiene factura generada
  const yaEstaFacturado = () => {
    return pago.facturaGenerada === true || !!pago.uuidFactura;
  };

  // ✅ Validar estatus del pago
  const esPagoFacturable = () => {
    const estatusValidos = ["completado", "liquidado", "pagado", "aprobado"];
    return estatusValidos.includes(pago.estatus?.toLowerCase());
  };

  // ✅ Formatear monto con moneda
  const formatearMonto = (monto) => {
    const moneda = pago.moneda || "MXN";
    const simbolos = {
      MXN: "$",
      USD: "USD $",
      EUR: "€",
    };

    const numero =
      typeof monto === "string"
        ? parseFloat(monto.replace(/[^0-9.-]/g, ""))
        : monto;

    return `${simbolos[moneda] || "$"} ${numero.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ✅ Generar factura con validaciones mejoradas
  const manejarGenerarFactura = async (formato) => {
    establecerError(null);
    establecerMensajeExito(null);

    // Validación 1: Verificar si ya está facturado
    if (yaEstaFacturado()) {
      establecerError(
        "Este pago ya tiene una factura generada. No se pueden generar facturas duplicadas."
      );
      return;
    }

    // Validación 2: Verificar datos fiscales completos
    const camposFaltantes = validarDatosFiscales();
    if (camposFaltantes.length > 0) {
      establecerError(
        `Faltan los siguientes datos fiscales requeridos:\n• ${camposFaltantes.join(
          "\n• "
        )}\n\nPor favor, complete la información antes de generar la factura.`
      );
      return;
    }

    // Validación 3: Verificar que el pago esté completado
    if (!esPagoFacturable()) {
      establecerError(
        `No se puede facturar un pago con estatus "${pago.estatus}".\n\nSolo se pueden facturar pagos completados, liquidados o aprobados.`
      );
      return;
    }

    // Validación 4: Verificar que haya un monto válido
    if (!pago.monto || pago.monto <= 0) {
      establecerError("El monto del pago debe ser mayor a cero.");
      return;
    }

    establecerGenerando(true);

    try {
      const datosFacturacion = {
        pagoId: pago.id,
        numeroFactura: pago.numeroFactura,
        formato: formato.toUpperCase(),
        datosCliente: {
          nombre: pago.cliente,
          rfc: pago.rfcCliente,
          razonSocial: pago.razonSocialCliente,
          email: pago.emailCliente,
          direccion: pago.direccionCliente,
        },
        datosFiscales: {
          usoCFDI: pago.usoCFDI,
          formaPago: pago.formaPago,
          metodoPago: pago.metodoPago || "01",
          lugarExpedicion: pago.lugarExpedicion,
          moneda: pago.moneda || "MXN",
          tipoCambio: pago.tipoCambio || "1.00",
        },
        importes: {
          subtotal: pago.subtotal || (pago.monto / 1.16).toFixed(2),
          iva: pago.iva || (pago.monto - pago.monto / 1.16).toFixed(2),
          total: pago.monto,
          descuento: pago.descuento || 0,
        },
        conceptos: [
          {
            descripcion: pago.concepto || "Pago de servicios",
            cantidad: 1,
            unidad: "Servicio",
            precioUnitario: pago.subtotal || (pago.monto / 1.16).toFixed(2),
            importe: pago.monto,
          },
        ],
        fechaPago: pago.fechaPago,
        referencia: pago.referencia || pago.id,
      };

      const response = await fetch("/api/facturacion/generar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(datosFacturacion),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.mensaje || errorData.error || "Error al generar la factura"
        );
      }

      const resultado = await response.json();

      // Descargar el archivo generado
      if (resultado.archivoUrl) {
        window.open(resultado.archivoUrl, "_blank");
      } else if (resultado.archivo) {
        const blob = new Blob(
          [Uint8Array.from(atob(resultado.archivo), (c) => c.charCodeAt(0))],
          { type: formato === "pdf" ? "application/pdf" : "application/xml" }
        );
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Factura-${pago.numeroFactura}.${formato.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      establecerMensajeExito(
        `✅ Factura generada exitosamente en formato ${formato.toUpperCase()}\n\n` +
          `Factura: ${pago.numeroFactura}\n` +
          `Cliente: ${pago.cliente}\n` +
          (resultado.uuid ? `UUID: ${resultado.uuid}` : "")
      );

      if (onFacturaGenerada) {
        onFacturaGenerada({
          ...pago,
          facturaGenerada: true,
          uuidFactura: resultado.uuid,
          fechaFacturacion: new Date().toISOString(),
        });
      }

      setTimeout(() => {
        alCerrar();
      }, 2000);
    } catch (error) {
      console.error("Error al generar factura:", error);
      establecerError(
        error.message ||
          "Ocurrió un error al generar la factura. Por favor, verifique los datos e intente nuevamente.\n\n" +
            "Si el problema persiste, contacte al administrador del sistema."
      );
    } finally {
      establecerGenerando(false);
    }
  };

  // ✅ Descargar factura existente
  const manejarDescargarFactura = async (formato) => {
    establecerError(null);
    establecerGenerando(true);

    try {
      // Si es PDF, generar localmente con el módulo de generación
      if (formato === "pdf") {
        // Preparar datos de la factura para el PDF
        const datosFactura = {
          numeroFactura: pago.numeroFactura,
          serie: pago.serie || "A",
          folio: pago.folio || pago.numeroFactura.split("-")[1] || "001",
          uuid: pago.uuidFactura || "A1B2C3D4-E5F6-G7H8-I9J0-K1L2M3N4O5P6",
          fechaEmision: pago.fechaPago,
          fechaVencimiento: pago.fechaVencimiento || pago.fechaPago,
          fechaFacturacion: pago.fechaFacturacion,
          cliente: pago.cliente,
          rfc: pago.rfcCliente,
          razonSocial: pago.razonSocialCliente || pago.cliente,
          usoCfdi: pago.usoCFDI || "G03 - Gastos en general",
          metodoPago: pago.metodoPago || "PUE - Pago en una sola exhibición",
          formaPago: pago.formaPago || "03 - Transferencia electrónica",
          monto: pago.monto,
          moneda: pago.moneda || "MXN",
          concepto: pago.concepto || "Servicio Turístico",
          estado: pago.estatus,
          emailEnviado: pago.emailEnviado || false,
          fechaEnvio: pago.fechaEnvio || null,
        };

        await generarPDFFacturaTimbrada(datosFactura);
        establecerMensajeExito(
          "✅ Factura descargada exitosamente en formato PDF"
        );
      } else {
        // Para XML, hacer petición al servidor
        const response = await fetch(
          `/api/facturacion/descargar/${pago.id}?formato=${formato}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al descargar la factura XML");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Factura-${pago.numeroFactura}.${formato.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        establecerMensajeExito(
          `✅ Factura descargada exitosamente en formato ${formato.toUpperCase()}`
        );
      }
    } catch (error) {
      console.error("Error al descargar factura:", error);
      establecerError(
        error.message || "Error al descargar la factura. Intente nuevamente."
      );
    } finally {
      establecerGenerando(false);
    }
  };

  // ✅ Enviar por email con validaciones
  const manejarEnviarEmail = async () => {
    establecerError(null);
    establecerMensajeExito(null);

    if (!yaEstaFacturado()) {
      establecerError(
        "Primero debe generar la factura antes de enviarla por email."
      );
      return;
    }

    if (!pago.emailCliente) {
      establecerError(
        "No se encontró el email del cliente.\n\n" +
          "Por favor, agregue un correo electrónico válido en los datos del cliente."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(pago.emailCliente)) {
      establecerError("El email del cliente no tiene un formato válido.");
      return;
    }

    establecerGenerando(true);

    try {
      const response = await fetch("/api/facturacion/enviar-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          pagoId: pago.id,
          numeroFactura: pago.numeroFactura,
          emailDestino: pago.emailCliente,
          nombreCliente: pago.cliente,
          rfc: pago.rfcCliente,
          monto: pago.monto,
          incluirPDF: true,
          incluirXML: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al enviar el email");
      }

      establecerMensajeExito(
        `✅ Factura enviada exitosamente por email a:\n\n` +
          `📧 ${pago.emailCliente}\n\n` +
          `Se enviaron los archivos PDF y XML adjuntos.`
      );

      setTimeout(() => {
        alCerrar();
      }, 3000);
    } catch (error) {
      console.error("Error al enviar email:", error);
      establecerError(
        error.message ||
          "Error al enviar el email. Verifique la dirección de correo e intente nuevamente."
      );
    } finally {
      establecerGenerando(false);
    }
  };

  // ✅ Imprimir con ventana de previsualización
  const manejarImprimir = () => {
    establecerError(null);

    if (!yaEstaFacturado()) {
      establecerError("Debe generar la factura antes de imprimirla.");
      return;
    }

    try {
      // Preparar datos de la factura para imprimir
      const datosFactura = {
        numeroFactura: pago.numeroFactura,
        serie: pago.serie || "A",
        folio: pago.folio || pago.numeroFactura.split("-")[1] || "001",
        uuid: pago.uuidFactura || "A1B2C3D4-E5F6-G7H8-I9J0-K1L2M3N4O5P6",
        fechaEmision: pago.fechaPago,
        fechaVencimiento: pago.fechaVencimiento || pago.fechaPago,
        fechaFacturacion: pago.fechaFacturacion,
        cliente: pago.cliente,
        rfc: pago.rfcCliente,
        razonSocial: pago.razonSocialCliente || pago.cliente,
        usoCfdi: pago.usoCFDI || "G03 - Gastos en general",
        metodoPago: pago.metodoPago || "PUE - Pago en una sola exhibición",
        formaPago: pago.formaPago || "03 - Transferencia electrónica",
        monto: pago.monto,
        moneda: pago.moneda || "MXN",
        concepto: pago.concepto || "Servicio Turístico",
        estado: pago.estatus,
        emailEnviado: pago.emailEnviado || false,
        fechaEnvio: pago.fechaEnvio || null,
      };

      imprimirFacturaTimbrada(datosFactura);
      establecerMensajeExito("✅ Abriendo vista previa de impresión...");
    } catch (error) {
      console.error("Error al abrir ventana de impresión:", error);
      establecerError(
        error.message ||
          "Error al abrir la vista previa. Intente descargar el PDF en su lugar."
      );
    }
  };

  // ✅ Obtener icono según estatus
  const obtenerIconoEstatus = () => {
    const estatus = pago.estatus?.toLowerCase();

    switch (estatus) {
      case "completado":
      case "liquidado":
      case "pagado":
      case "aprobado":
        return <CheckCircle size={16} />;
      case "pendiente":
        return <Clock size={16} />;
      case "rechazado":
      case "cancelado":
        return <FileX size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="modal-factura-overlay" onClick={alCerrar}>
      <div
        className="modal-factura-contenedor"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-factura-header">
          <div className="modal-factura-header-contenido">
            <div className="modal-factura-icono-principal">
              <CreditCard size={26} />
            </div>
            <div>
              <h2 className="modal-factura-titulo">
                Generar Factura Electrónica
              </h2>
              <p className="modal-factura-subtitulo">
                Factura No. {pago.numeroFactura}
                {yaEstaFacturado() && (
                  <span className="modal-factura-badge-facturado">
                    ● Facturado
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            className="modal-factura-boton-cerrar"
            onClick={alCerrar}
            disabled={generando}
            aria-label="Cerrar modal"
            title="Cerrar (Esc)"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-factura-body">
          {/* Mensaje de error */}
          {error && (
            <div className="modal-factura-alerta-error">
              <AlertCircle size={22} className="modal-factura-alerta-icono" />
              <p
                className="modal-factura-alerta-texto"
                style={{ whiteSpace: "pre-line" }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {mensajeExito && (
            <div
              className="modal-factura-alerta-warning"
              style={{
                background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                borderColor: "#6ee7b7",
              }}
            >
              <CheckCircle
                size={22}
                style={{ color: "#059669" }}
                className="modal-factura-alerta-icono"
              />
              <p
                className="modal-factura-alerta-texto"
                style={{
                  color: "#065f46",
                  whiteSpace: "pre-line",
                }}
              >
                {mensajeExito}
              </p>
            </div>
          )}

          {/* Alerta si ya está facturado */}
          {yaEstaFacturado() && !error && !mensajeExito && (
            <div className="modal-factura-alerta-warning">
              <AlertCircle size={22} className="modal-factura-alerta-icono" />
              <div>
                <p className="modal-factura-alerta-texto">
                  <strong>
                    Este pago ya tiene una factura electrónica generada.
                  </strong>
                </p>
                {pago.uuidFactura && (
                  <p className="modal-factura-alerta-texto-small">
                    UUID: {pago.uuidFactura}
                  </p>
                )}
                <p
                  className="modal-factura-alerta-texto"
                  style={{ marginTop: "0.5rem" }}
                >
                  Puede descargar, imprimir o reenviar la factura existente.
                </p>
              </div>
            </div>
          )}

          {/* Información del pago */}
          <div className="modal-factura-info-pago">
            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Cliente</span>
              <span className="modal-factura-valor">{pago.cliente}</span>
            </div>

            {pago.rfcCliente && (
              <div className="modal-factura-info-item">
                <span className="modal-factura-label">RFC</span>
                <span
                  className="modal-factura-valor"
                  style={{ fontFamily: "monospace" }}
                >
                  {pago.rfcCliente}
                </span>
              </div>
            )}

            {pago.razonSocialCliente && (
              <div className="modal-factura-info-item">
                <span className="modal-factura-label">Razón Social</span>
                <span className="modal-factura-valor">
                  {pago.razonSocialCliente}
                </span>
              </div>
            )}

            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Monto Total</span>
              <span className="modal-factura-valor modal-factura-monto">
                {formatearMonto(pago.monto)}
              </span>
            </div>

            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Fecha de Pago</span>
              <span className="modal-factura-valor">{pago.fechaPago}</span>
            </div>

            {pago.metodoPago && (
              <div className="modal-factura-info-item">
                <span className="modal-factura-label">Método de Pago</span>
                <span className="modal-factura-valor">{pago.metodoPago}</span>
              </div>
            )}

            {pago.usoCFDI && (
              <div className="modal-factura-info-item">
                <span className="modal-factura-label">Uso CFDI</span>
                <span className="modal-factura-valor">{pago.usoCFDI}</span>
              </div>
            )}

            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Concepto</span>
              <span className="modal-factura-valor">{pago.concepto}</span>
            </div>

            <div className="modal-factura-info-item">
              <span className="modal-factura-label">Estatus del Pago</span>
              <span
                className={`modal-factura-badge modal-factura-badge-${pago.estatus?.toLowerCase()}`}
              >
                {obtenerIconoEstatus()}
                <span style={{ marginLeft: "0.375rem" }}>{pago.estatus}</span>
              </span>
            </div>
          </div>

          {/* Vista previa de la factura timbrada */}
          {yaEstaFacturado() && (
            <div className="modal-factura-vista-previa">
              <h3 className="modal-factura-opciones-titulo">
                📄 Factura Electrónica Timbrada
              </h3>

              {/* Información principal de la factura */}
              <div className="modal-factura-uuid-container">
                <div className="modal-factura-uuid-grid">
                  <div>
                    <p className="modal-factura-uuid-label">
                      FOLIO FISCAL (UUID)
                    </p>
                    <p className="modal-factura-uuid-valor">
                      {pago.uuidFactura ||
                        "A1B2C3D4-E5F6-G7H8-I9J0-K1L2M3N4O5P6"}
                    </p>
                  </div>
                  <div>
                    <p className="modal-factura-uuid-label">
                      FECHA DE TIMBRADO
                    </p>
                    <p className="modal-factura-fecha-timbrado">
                      {pago.fechaFacturacion
                        ? new Date(pago.fechaFacturacion).toLocaleString(
                            "es-MX",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : pago.fechaPago}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón destacado de descarga */}
              <button
                onClick={() => manejarDescargarFactura("pdf")}
                disabled={generando}
                className="modal-factura-boton-descarga-principal"
              >
                <Download size={24} />
                <span>Descargar Factura en PDF</span>
              </button>

              {/* Opciones adicionales */}
              <div className="modal-factura-opciones-secundarias">
                <button
                  className="modal-factura-boton-opcion-secundario"
                  onClick={() => manejarDescargarFactura("xml")}
                  disabled={generando}
                  title="Descargar factura en formato XML"
                >
                  <FileText size={20} />
                  <span>XML</span>
                </button>

                <button
                  className="modal-factura-boton-opcion-secundario"
                  onClick={manejarImprimir}
                  disabled={generando}
                  title="Imprimir o ver vista previa"
                >
                  <Printer size={20} />
                  <span>Imprimir</span>
                </button>

                <button
                  className="modal-factura-boton-opcion-secundario"
                  onClick={manejarEnviarEmail}
                  disabled={generando}
                  title={`Enviar por email a ${pago.emailCliente || "cliente"}`}
                >
                  <Mail size={20} />
                  <span>Email</span>
                </button>
              </div>
            </div>
          )}

          {/* Opciones de generación (solo si NO está facturado) */}
          {!yaEstaFacturado() && (
            <div className="modal-factura-opciones">
              <h3 className="modal-factura-opciones-titulo">
                Generar factura en formato
              </h3>

              <div className="modal-factura-botones-grid">
                <button
                  className="modal-factura-boton-opcion"
                  onClick={() => manejarGenerarFactura("pdf")}
                  disabled={generando}
                  title="Generar y descargar factura en PDF"
                >
                  <Download size={24} />
                  <span>Generar PDF</span>
                </button>

                <button
                  className="modal-factura-boton-opcion"
                  onClick={() => manejarGenerarFactura("xml")}
                  disabled={generando}
                  title="Generar y descargar factura en XML"
                >
                  <FileText size={24} />
                  <span>Generar XML</span>
                </button>
              </div>
            </div>
          )}

          {/* Nota informativa */}
          <div className="modal-factura-nota">
            <div className="modal-factura-nota-icono">
              <FileText size={18} />
            </div>
            <p className="modal-factura-nota-texto">
              {yaEstaFacturado()
                ? "Esta factura fue generada como CFDI 4.0 y está timbrada ante el SAT. Puede descargarla, imprimirla o reenviarla las veces que necesite."
                : "Al generar la factura, se creará un CFDI 4.0 válido ante el SAT con sello digital, cadena original y código QR para verificación. Los archivos XML y PDF cumplirán con todos los requisitos fiscales vigentes."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-factura-footer">
          <button
            className="modal-factura-boton-cancelar"
            onClick={alCerrar}
            disabled={generando}
          >
            {generando ? "Procesando..." : "Cerrar"}
          </button>
        </div>

        {/* Loading Overlay */}
        {generando && (
          <div className="modal-factura-loading">
            <div className="modal-factura-spinner"></div>
            <p className="modal-factura-loading-texto">
              {yaEstaFacturado()
                ? "Procesando solicitud..."
                : "Generando y timbrando factura electrónica..."}
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                margin: "0.5rem 0 0 0",
                textAlign: "center",
              }}
            >
              Por favor espere, esto puede tomar unos momentos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalGenerarFactura;
