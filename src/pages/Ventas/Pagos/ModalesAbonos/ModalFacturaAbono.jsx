import React, { useState, useRef } from "react";
import axios from "axios";
import {
  X,
  Printer,
  Download,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  Coins,
} from "lucide-react";
import "./ModalFacturaAbono.css";
import Swal from "sweetalert2";
import {
  generarPDFFactura,
  imprimirFactura,
} from "../ModalesFactura/generarPDFFactura";
import { API_CONFIG } from "../../../../config/api";

const ModalFacturaAbono = ({
  abierto,
  onCerrar,
  pagoSeleccionado,
  datosEmpresa = {},
  onFacturar,
}) => {
  const [abonoSeleccionado, setAbonoSeleccionado] = useState(null);
  const [imprimiendo, setImprimiendo] = useState(false);
  const [generandoFactura, setGenerandoFactura] = useState(false);
  const [error, setError] = useState(null);
  const facturaRef = useRef(null);

  if (!abierto || !pagoSeleccionado) return null;

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad || 0);
  };

  const abonosSinFacturar =
    pagoSeleccionado.historialAbonos?.filter(
      (abono) => !abono.facturaGenerada
    ) || [];

  const abonosFacturados =
    pagoSeleccionado.historialAbonos?.filter(
      (abono) => abono.facturaGenerada
    ) || [];

  const calcularImpuestos = (monto) => {
    const subtotal = monto;
    const tasaIVA = 0.16;
    const iva = subtotal * tasaIVA;
    const total = subtotal + iva;
    return { subtotal, iva, tasaIVA, total };
  };

  const impuestosAbono = abonoSeleccionado
    ? calcularImpuestos(abonoSeleccionado.monto)
    : null;

  const empresa = {
    nombre: datosEmpresa.nombre || "Oaxaca Tours S.A. de C.V.",
    rfc: datosEmpresa.rfc || "OAX123456ABC",
    regimen: datosEmpresa.regimen || "601 - General de Ley Personas Morales",
    direccion: datosEmpresa.direccion || "Calle Hidalgo #123, Centro Histórico",
    codigoPostal: datosEmpresa.codigoPostal || "68000",
    ciudad: datosEmpresa.ciudad || "Oaxaca de Juárez, Oaxaca",
    telefono: datosEmpresa.telefono || "(951) 123-4567",
    certificadoSAT: datosEmpresa.certificadoSAT || "00001000000123456789",
    certificadoEmisor: datosEmpresa.certificadoEmisor || "00001000000987654321",
  };

  const manejarGenerarFactura = async () => {
    if (!abonoSeleccionado) {
      setError("Por favor selecciona un abono para facturar");
      return;
    }

    setError(null);
    setGenerandoFactura(true);

    try {
      const token = localStorage.getItem("token");
      const impuestosTemp = calcularImpuestos(abonoSeleccionado.monto);

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/facturas`,
        {
          abono_id: abonoSeleccionado.id,
          numero_factura: `FAC-${String(pagoSeleccionado.id).padStart(
            4,
            "0"
          )}-${abonoSeleccionado.numeroAbono}`,
          monto: impuestosTemp.total,
          fecha_emision: new Date().toISOString().split("T")[0],
          fecha_timbrado: new Date().toISOString().split("T")[0],
          uso_cfdi: pagoSeleccionado.usoCFDI || "G03",
          metodo_pago: abonoSeleccionado.metodoPago,
          forma_pago: "PPD",
          email_envio: pagoSeleccionado.cliente.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      await Swal.fire({
        title: "¡Factura Generada!",
        html: `
    <div class="eliminar-exito-contenido">
      <p class="eliminar-exito-texto">La factura ha sido generada y timbrada exitosamente ante el SAT</p>
      <div style="margin-top: 1rem; text-align: left; background: #f3f4f6; padding: 1rem; border-radius: 8px;">
        <p style="margin: 0.25rem 0; color: #374151; font-size: 0.875rem;">
          <strong>Folio:</strong> ${response.data.data.numero_factura}
        </p>
        <p style="margin: 0.25rem 0; color: #374151; font-size: 0.875rem;">
          <strong>UUID:</strong> ${response.data.data.uuid}
        </p>
        <p style="margin: 0.25rem 0; color: #374151; font-size: 0.875rem;">
          <strong>Abono:</strong> #${abonoSeleccionado.numeroAbono}
        </p>
      </div>
    </div>
  `,
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "eliminar-popup",
          title: "eliminar-titulo-exito",
          htmlContainer: "eliminar-html",
          confirmButton: "eliminar-boton-exito",
          icon: "eliminar-icono-exito",
        },
        buttonsStyling: false,
        timer: 4000,
        timerProgressBar: true,
      });

      if (onFacturar) {
        await onFacturar();
      }

      setAbonoSeleccionado(null);
      setTimeout(() => onCerrar(), 1500);
    } catch (error) {
      console.error("Error al generar factura:", error);
      const mensajeError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al generar la factura. Intente nuevamente.";
      setError(mensajeError);
    } finally {
      setGenerandoFactura(false);
    }
  };

  const manejarDescargarFactura = async (abono) => {
    setError(null);
    setImprimiendo(true);

    try {
      const impuestosDescarga = calcularImpuestos(abono.monto);

      const datosFactura = {
        id: pagoSeleccionado.id,
        numeroFactura: abono.numeroFactura,
        uuidFactura: abono.uuid,
        uuid: abono.uuid,
        cliente: pagoSeleccionado.cliente,
        servicio: {
          ...pagoSeleccionado.servicio,
          tipo: `Abono #${abono.numeroAbono} - ${pagoSeleccionado.servicio.tipo}`,
          descripcion: `${pagoSeleccionado.servicio.descripcion
            } | Fecha de abono: ${formatearFecha(abono.fecha)}`,
        },
        usoCFDI: pagoSeleccionado.usoCFDI,
        metodoPago: abono.metodoPago,
        numeroContrato: pagoSeleccionado.numeroContrato,
        historialAbonos: [abono],
        subtotal: impuestosDescarga.subtotal,
        tasaIVA: impuestosDescarga.tasaIVA,
        planPago: {
          montoTotal: impuestosDescarga.subtotal,
        },
        selloCFDI: pagoSeleccionado.selloCFDI,
        selloSAT: pagoSeleccionado.selloSAT,
        cadenaOriginal: pagoSeleccionado.cadenaOriginal,
      };

      await generarPDFFactura(datosFactura, empresa);
    } catch (error) {
      console.error("Error al descargar:", error);
      setError(
        error.message || "Error al descargar la factura. Intente nuevamente."
      );
    } finally {
      setImprimiendo(false);
    }
  };

  const manejarImprimirFactura = (abono) => {
    setImprimiendo(true);
    setError(null);

    try {
      const impuestosImpresion = calcularImpuestos(abono.monto);

      const datosFactura = {
        id: pagoSeleccionado.id,
        numeroFactura: abono.numeroFactura,
        uuidFactura: abono.uuid,
        uuid: abono.uuid,
        cliente: pagoSeleccionado.cliente,
        servicio: {
          ...pagoSeleccionado.servicio,
          tipo: `Abono #${abono.numeroAbono} - ${pagoSeleccionado.servicio.tipo}`,
        },
        usoCFDI: pagoSeleccionado.usoCFDI,
        metodoPago: abono.metodoPago,
        numeroContrato: pagoSeleccionado.numeroContrato,
        historialAbonos: [abono],
        subtotal: impuestosImpresion.subtotal,
        tasaIVA: impuestosImpresion.tasaIVA,
        planPago: {
          montoTotal: impuestosImpresion.subtotal,
        },
      };

      imprimirFactura(datosFactura, empresa);
    } catch (error) {
      console.error("Error al imprimir:", error);
      setError(
        error.message || "Error al imprimir la factura. Intente nuevamente."
      );
    } finally {
      setTimeout(() => setImprimiendo(false), 500);
    }
  };

  const manejarCerrar = () => {
    if (!generandoFactura) {
      setError(null);
      setAbonoSeleccionado(null);
      onCerrar();
    }
  };

  return (
    <div className="modal-factura-overlay" onClick={manejarCerrar}>
      <div
        className="modal-factura-contenedor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-factura-header no-print">
          <div className="modal-factura-titulo-seccion">
            <div className="modal-factura-icono-titulo">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="modal-factura-titulo">
                Facturación por Abono Individual
              </h2>
              <p className="modal-factura-subtitulo">
                Generar factura CFDI para cada abono realizado
              </p>
            </div>
          </div>
          <button
            className="modal-factura-boton-cerrar"
            onClick={manejarCerrar}
            title="Cerrar"
            disabled={generandoFactura}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="modal-factura-alerta error">
            <AlertCircle size={20} />
            <div>
              <p className="modal-factura-alerta-titulo">Error</p>
              <p className="modal-factura-alerta-texto">{error}</p>
            </div>
          </div>
        )}

        <div className="modal-factura-contenido" ref={facturaRef}>
          <div className="factura-documento">
            <div className="factura-seccion">
              <h3 className="factura-seccion-titulo">
                <User size={18} />
                Información del Cliente
              </h3>
              <div className="factura-grid">
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Cliente:</span>
                  <span className="factura-campo-valor">
                    {pagoSeleccionado.cliente?.nombre || "N/A"}
                  </span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">RFC:</span>
                  <span className="factura-campo-valor">
                    {pagoSeleccionado.cliente?.rfc || "XAXX010101000"}
                  </span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Servicio:</span>
                  <span className="factura-campo-valor">
                    {pagoSeleccionado.servicio?.tipo || "N/A"}
                  </span>
                </div>
                <div className="factura-campo">
                  <span className="factura-campo-etiqueta">Contrato:</span>
                  <span className="factura-campo-valor">
                    {pagoSeleccionado.numeroContrato}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="factura-documento">
            <div className="factura-seccion">
              <h3 className="factura-seccion-titulo">
                <Coins size={18} />
                Abonos Disponibles para Facturar ({abonosSinFacturar.length})
              </h3>

              {abonosSinFacturar.length === 0 ? (
                <div className="factura-sin-datos">
                  <AlertCircle size={48} className="factura-sin-datos-icono" />
                  <p className="factura-sin-datos-titulo">
                    No hay abonos pendientes de facturar
                  </p>
                  <p className="factura-sin-datos-texto">
                    Todos los abonos ya tienen factura generada
                  </p>
                </div>
              ) : (
                <div className="factura-historial">
                  {abonosSinFacturar.map((abono) => {
                    const esSeleccionado =
                      abonoSeleccionado?.numeroAbono === abono.numeroAbono;
                    const impuestosTemp = calcularImpuestos(abono.monto);

                    return (
                      <div
                        key={abono.numeroAbono}
                        onClick={() => setAbonoSeleccionado(abono)}
                        className="factura-historial-item seleccionable"
                      >
                        {esSeleccionado && (
                          <div className="factura-check-icono">
                            <CheckCircle size={16} />
                          </div>
                        )}
                        <div
                          className={`factura-historial-item-contenido ${esSeleccionado ? "seleccionado" : ""
                            }`}
                        >
                          <div
                            className={`factura-historial-numero ${esSeleccionado ? "seleccionado" : ""
                              }`}
                          >
                            <Coins size={16} />
                            <span>Abono #{abono.numeroAbono}</span>
                          </div>
                          <div className="factura-historial-detalles">
                            <span>{formatearFecha(abono.fecha)}</span>
                            <span>{abono.metodoPago || "Efectivo"}</span>
                            <span className="factura-historial-monto">
                              {formatearMoneda(abono.monto)}
                            </span>
                          </div>
                          <div className="factura-historial-info-extra">
                            <strong>Total con IVA:</strong>{" "}
                            {formatearMoneda(impuestosTemp.total)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {abonoSeleccionado && impuestosAbono && (
            <div className="factura-documento preview">
              <div className="factura-seccion">
                <h3 className="factura-seccion-titulo preview">
                  <FileText size={18} />
                  Preview de Factura - Abono #{abonoSeleccionado.numeroAbono}
                </h3>

                <div className="factura-info-fiscal">
                  <div className="factura-campo">
                    <span className="factura-campo-etiqueta">
                      Número de Factura:
                    </span>
                    <span className="factura-campo-valor destacado">
                      FAC-{String(pagoSeleccionado.id).padStart(4, "0")}-
                      {abonoSeleccionado.numeroAbono}
                    </span>
                  </div>

                  <div className="factura-divisor compact"></div>

                  <div className="factura-totales">
                    <div className="factura-total-linea">
                      <span>Subtotal:</span>
                      <span>{formatearMoneda(impuestosAbono.subtotal)}</span>
                    </div>
                    <div className="factura-total-linea">
                      <span>
                        IVA ({(impuestosAbono.tasaIVA * 100).toFixed(0)}%):
                      </span>
                      <span>{formatearMoneda(impuestosAbono.iva)}</span>
                    </div>
                    <div className="factura-total-linea total">
                      <span>Total:</span>
                      <span>{formatearMoneda(impuestosAbono.total)}</span>
                    </div>
                  </div>

                  <div className="factura-cadena nota">
                    <h4>Nota Importante</h4>
                    <p className="factura-cadena-texto inherit-font">
                      Esta factura corresponde únicamente al{" "}
                      <strong>Abono #{abonoSeleccionado.numeroAbono}</strong>{" "}
                      realizado el {formatearFecha(abonoSeleccionado.fecha)}{" "}
                      mediante {abonoSeleccionado.metodoPago}.
                      {abonoSeleccionado.referencia &&
                        ` Referencia: ${abonoSeleccionado.referencia}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {abonosFacturados.length > 0 && (
            <div className="factura-documento">
              <div className="factura-seccion">
                <h3 className="factura-seccion-titulo">
                  <CheckCircle size={18} />
                  Facturas Generadas ({abonosFacturados.length})
                </h3>
                <div className="factura-historial">
                  {abonosFacturados.map((abono) => (
                    <div
                      key={abono.numeroAbono}
                      className="factura-historial-item facturado"
                    >
                      <div>
                        <div className="factura-historial-header">
                          <span className="factura-historial-numero-factura">
                            {abono.numeroFactura}
                          </span>
                          <span className="factura-historial-badge">
                            FACTURADO
                          </span>
                        </div>
                        <div className="factura-historial-detalles">
                          <span>Abono #{abono.numeroAbono}</span>
                          <span>{formatearFecha(abono.fechaFacturacion)}</span>
                          <span className="factura-historial-monto">
                            {formatearMoneda(abono.monto)}
                          </span>
                        </div>
                        {abono.uuid && (
                          <div className="factura-historial-uuid">
                            UUID: {abono.uuid}
                          </div>
                        )}
                      </div>
                      <div className="factura-historial-acciones">
                        <button
                          onClick={() => manejarImprimirFactura(abono)}
                          disabled={imprimiendo}
                          className="modal-factura-boton secundario small"
                        >
                          <Printer size={14} />
                          Imprimir
                        </button>
                        <button
                          onClick={() => manejarDescargarFactura(abono)}
                          disabled={imprimiendo}
                          className="modal-factura-boton primario small"
                        >
                          <Download size={14} />
                          PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-factura-acciones no-print">
          <button
            className="modal-factura-boton secundario"
            onClick={manejarCerrar}
            disabled={generandoFactura}
          >
            Cerrar
          </button>

          {abonoSeleccionado && (
            <button
              className="modal-factura-boton generar"
              onClick={manejarGenerarFactura}
              disabled={generandoFactura}
            >
              <CheckCircle size={18} />
              {generandoFactura
                ? "Generando..."
                : `Generar Factura - Abono #${abonoSeleccionado.numeroAbono}`}
            </button>
          )}
        </div>

        {(generandoFactura || imprimiendo) && (
          <div className="modal-factura-cargando">
            <div className="modal-factura-spinner"></div>
            <p className="modal-factura-cargando-texto">
              {generandoFactura
                ? "Generando y timbrando factura ante el SAT..."
                : "Procesando..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalFacturaAbono;
