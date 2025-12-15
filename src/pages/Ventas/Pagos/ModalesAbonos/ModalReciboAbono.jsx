import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Receipt, 
  Calendar, 
  User, 
  CreditCard, 
  FileText, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import './ModalReciboAbono.css';
import writtenNumber from 'written-number';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ModalVisualizarPDF from '../Modales/ModalVisualizarPDF';

// ============================================
// UTILIDADES
// ============================================

const formatearFecha = (fecha) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-MX', opciones);
};

const formatearMoneda = (cantidad) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
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
  const abonosDisponibles = pagoSeleccionado.historialAbonos?.filter(abono => abono.activo !== false) || [];

  const fechaActual = new Date().toLocaleDateString('es-MX');
  
  // Generar número de recibo basado en el abono seleccionado
  const numeroRecibo = abonoSeleccionado 
    ? `REC-${pagoSeleccionado.id.toString().padStart(4, '0')}-${abonoSeleccionado.numeroAbono}`
    : `REC-${pagoSeleccionado.id.toString().padStart(4, '0')}`;

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
      const montoNumerico = typeof datosRecibo?.monto === "number"
        ? datosRecibo.monto
        : parseFloat(String(datosRecibo?.monto).replace(/[$,]/g, ""));

      const campos = [
        { valor: datosRecibo?.cliente, x: 110, y: 247, z: 10 },
        { valor: datosRecibo?.numeroRecibo, x: 500, y: 299, z: 10 },
        { valor: datosRecibo?.id, x: 230, y: 299, z: 10 },
        { valor: datosRecibo?.concepto, x: 180, y: 155, z: 9 },
        { valor: `$ ${montoNumerico}`, x: 470, y: 153, z: 9 },
        { valor: `$ ${montoNumerico}`, x: 470, y: 88, z: 9 },
        { valor: `1`, x: 70, y: 153, z: 9 },
        { valor: datosRecibo?.cliente?.telefono || '', x: 100, y: 197, z: 9 },
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
      alert('Por favor selecciona un abono');
      return;
    }

    try {
      setImprimiendo(true);
      
      // Obtener el ID del recibo asociado al abono
      const reciboId = abonoSeleccionado.recibo_id || abonoSeleccionado.id;
      
      // Hacer petición al backend para obtener los datos completos del recibo
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/abonos/${reciboId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del recibo');
      }

      const data = await response.json();
      const reciboCompleto = data.data || data;

      console.log('=== DEBUG RECIBO ===');
      console.log('Recibo completo:', reciboCompleto);
      console.log('Todas las propiedades del recibo:', Object.keys(reciboCompleto));
      console.log('ID:', reciboCompleto.id);
      console.log('numeroRecibo:', reciboCompleto.numeroRecibo);
      console.log('cliente:', reciboCompleto.cliente);
      console.log('concepto:', reciboCompleto.concepto);
      console.log('descripcion:', reciboCompleto.descripcion);
      console.log('detalle:', reciboCompleto.detalle);
      console.log('monto:', reciboCompleto.monto);
      console.log('==================');

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
      alert("Error al obtener los datos del recibo. Por favor, intente nuevamente.");
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

      console.log(`PDF descargado correctamente - Recibo ID: ${reciboPDFActual.id}`);
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
        <div className="modal-recibo-contenedor" onClick={(e) => e.stopPropagation()}>
          
          {/* HEADER */}
          <div className="modal-recibo-header no-print">
            <div className="modal-recibo-titulo-seccion">
              <Receipt size={28} className="modal-recibo-icono-titulo" />
              <div>
                <h2 className="modal-recibo-titulo">Recibo de Pago por Abono</h2>
                <p className="modal-recibo-subtitulo">Selecciona el abono para generar el recibo</p>
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
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#6b7280'
              }}>
                <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>No hay abonos disponibles</p>
              </div>
            ) : (
              <>
                {/* Lista de abonos para seleccionar */}
                <div style={{
                  display: 'grid',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 1rem 0'
                  }}>
                    Selecciona el abono para generar el recibo:
                  </h3>
                  {abonosDisponibles.map((abono) => {
                    const esSeleccionado = abonoSeleccionado?.id === abono.id;
                    
                    return (
                      <div
                        key={abono.id}
                        onClick={() => setAbonoSeleccionado(abono)}
                        style={{
                          padding: '1rem',
                          border: esSeleccionado ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                          background: esSeleccionado ? '#eff6ff' : 'white',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                      >
                        {esSeleccionado && (
                          <div style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            background: '#3b82f6',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <CheckCircle size={16} />
                          </div>
                        )}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <p style={{
                              margin: 0,
                              fontWeight: '600',
                              color: esSeleccionado ? '#3b82f6' : '#374151',
                              fontSize: '1rem'
                            }}>
                              Abono #{abono.numeroAbono}
                            </p>
                            <p style={{
                              margin: '0.25rem 0 0 0',
                              fontSize: '0.875rem',
                              color: '#6b7280'
                            }}>
                              {new Date(abono.fecha).toLocaleDateString('es-MX')} • {abono.metodoPago}
                            </p>
                            {abono.recibo_id && (
                              <p style={{
                                margin: '0.25rem 0 0 0',
                                fontSize: '0.75rem',
                                color: '#9ca3af'
                              }}>
                                Recibo ID: {abono.recibo_id}
                              </p>
                            )}
                          </div>
                          <p style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: esSeleccionado ? '#3b82f6' : '#374151'
                          }}>
                            {formatearMoneda(abono.monto)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Preview del recibo si hay abono seleccionado */}
                {abonoSeleccionado && (
                  <div className="recibo-documento">
                    <div className="recibo-encabezado">
                      <div className="recibo-empresa">
                        <h1 className="recibo-empresa-nombre">Rolan Tours</h1>
                        <p className="recibo-empresa-info">RFC: OAX123456ABC</p>
                        <p className="recibo-empresa-info">Calle Hidalgo #123, Centro Histórico</p>
                        <p className="recibo-empresa-info">Oaxaca de Juárez, Oaxaca, México</p>
                        <p className="recibo-empresa-info">Tel: (951) 123-4567</p>
                      </div>
                      <div className="recibo-info-documento">
                        <div className="recibo-numero">
                          <span className="recibo-etiqueta">RECIBO No.</span>
                          <span className="recibo-valor-destacado">{numeroRecibo}</span>
                        </div>
                        <div className="recibo-fecha">
                          <Calendar size={16} />
                          <span>{fechaActual}</span>
                        </div>
                      </div>
                    </div>

                    <div className="recibo-divisor"></div>

                    <div className="recibo-seccion">
                      <h3 className="recibo-seccion-titulo">
                        <User size={18} />
                        Información del Abono Seleccionado
                      </h3>
                      <div className="recibo-grid">
                        <div className="recibo-campo">
                          <span className="recibo-etiqueta">Número de Abono:</span>
                          <span className="recibo-valor">#{abonoSeleccionado.numeroAbono}</span>
                        </div>
                        <div className="recibo-campo">
                          <span className="recibo-etiqueta">Fecha de Pago:</span>
                          <span className="recibo-valor">{formatearFecha(abonoSeleccionado.fecha)}</span>
                        </div>
                        <div className="recibo-campo">
                          <span className="recibo-etiqueta">Método de Pago:</span>
                          <span className="recibo-valor">{abonoSeleccionado.metodoPago}</span>
                        </div>
                        <div className="recibo-campo">
                          <span className="recibo-etiqueta">Monto:</span>
                          <span className="recibo-valor">{formatearMoneda(abonoSeleccionado.monto)}</span>
                        </div>
                        {abonoSeleccionado.recibo_id && (
                          <div className="recibo-campo">
                            <span className="recibo-etiqueta">ID de Recibo:</span>
                            <span className="recibo-valor">{abonoSeleccionado.recibo_id}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="recibo-total">
                      <div className="recibo-total-fila">
                        <span className="recibo-total-etiqueta">Monto del Abono:</span>
                        <span className="recibo-total-valor">{formatearMoneda(abonoSeleccionado.monto)}</span>
                      </div>
                    </div>

                    <div style={{
                      background: '#eff6ff',
                      border: '1px solid #3b82f6',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginTop: '1rem',
                      fontSize: '0.875rem',
                      color: '#1e40af'
                    }}>
                      <p style={{ margin: 0, fontWeight: '600' }}>
                        ℹ️ Nota: El PDF generado incluirá todos los datos del recibo oficial registrado en el sistema.
                      </p>
                    </div>

                    <div className="recibo-pie">
                      <p>Gracias por su preferencia</p>
                      <p className="recibo-pie-pequeno">Este documento es un comprobante de pago válido</p>
                    </div>
                  </div>
                )}
              </>
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