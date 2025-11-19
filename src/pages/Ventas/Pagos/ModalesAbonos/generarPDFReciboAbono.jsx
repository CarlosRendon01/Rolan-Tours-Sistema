import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera un PDF del recibo de abono usando html2canvas + jsPDF
 * @param {Object} recibo - Datos del recibo de abono a generar
 * @returns {Promise<void>}
 */
export const generarPDFReciboAbono = async (recibo) => {
  try {
    // Crear un contenedor temporal para el recibo
    const contenedorTemp = document.createElement('div');
    contenedorTemp.style.position = 'absolute';
    contenedorTemp.style.left = '-9999px';
    contenedorTemp.style.top = '0';
    contenedorTemp.style.width = '210mm';
    contenedorTemp.style.background = 'white';
    contenedorTemp.style.padding = '20mm';
    document.body.appendChild(contenedorTemp);

    contenedorTemp.innerHTML = generarHTMLReciboAbono(recibo);

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(contenedorTemp, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    document.body.removeChild(contenedorTemp);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const nombreArchivo = `Recibo_Abono_${recibo.numeroRecibo}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(nombreArchivo);

    return true;
  } catch (error) {
    console.error('Error al generar PDF de abono:', error);
    throw new Error('No se pudo generar el PDF del recibo de abono');
  }
};

/**
 * Genera el HTML del recibo de abono con estilos inline
 * @param {Object} recibo - Datos del recibo de abono
 * @returns {string} HTML del recibo
 */
const generarHTMLReciboAbono = (recibo) => {
  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const porcentajePagado = ((recibo.montoPagado / recibo.montoTotal) * 100).toFixed(1);
  const esPagoFinalizado = recibo.estado === 'FINALIZADO';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1f2937; line-height: 1.5;">
      
      <!-- ENCABEZADO -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #1e3a8a;">
        <div style="flex: 1;">
          <h1 style="font-size: 32px; font-weight: 700; color: #1e3a8a; margin: 0 0 10px 0; line-height: 1.2;">
            Rolan Tours
          </h1>
          <p style="margin: 3px 0; font-size: 13px; color: #6b7280;">RFC: OAX123456ABC</p>
          <p style="margin: 3px 0; font-size: 13px; color: #6b7280;">Calle Hidalgo #123, Centro Histórico</p>
          <p style="margin: 3px 0; font-size: 13px; color: #6b7280;">Oaxaca de Juárez, Oaxaca, México</p>
          <p style="margin: 3px 0; font-size: 13px; color: #6b7280;">Tel: (951) 123-4567</p>
          <p style="margin: 3px 0; font-size: 13px; color: #6b7280;">info@oaxacatours.com</p>
        </div>
        <div style="text-align: right;">
          <div style="margin-bottom: 15px;">
            <p style="margin: 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">RECIBO DE ABONO No.</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: 700; color: #1e3a8a;">${recibo.numeroRecibo}</p>
          </div>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">📅 ${fechaActual}</p>
        </div>
      </div>

      <!-- DATOS DEL CLIENTE -->
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1e2022; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
          👤 Datos del Cliente
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div>
            <p style="margin: 0; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Nombre:</p>
            <p style="margin: 3px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 500;">${recibo.cliente.nombre}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email:</p>
            <p style="margin: 3px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 500;">${recibo.cliente.email}</p>
          </div>
          ${recibo.cliente.telefono ? `
          <div>
            <p style="margin: 0; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Teléfono:</p>
            <p style="margin: 3px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 500;">${recibo.cliente.telefono}</p>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- DETALLES DEL SERVICIO -->
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1e2022; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
          📋 Detalles del Servicio
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div>
            <p style="margin: 0; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tipo de Tour:</p>
            <p style="margin: 3px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 500;">${recibo.servicio.tipo}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Descripción:</p>
            <p style="margin: 3px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 500;">${recibo.servicio.descripcion}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Fecha del Tour:</p>
            <p style="margin: 3px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 500;">${formatearFecha(recibo.servicio.fechaTour)}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Contrato:</p>
            <p style="margin: 3px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 500;">${recibo.numeroContrato}</p>
          </div>
        </div>
      </div>

      <!-- DETALLE DEL ABONO -->
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1e2022; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
          💳 Detalle del Abono
        </h3>
        
        <!-- ABONO DESTACADO -->
        <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%); border: 2px solid #1e3a8a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(102, 126, 234, 0.25);">
            <span style="font-size: 14px; color: #1e2022; font-weight: 600;">Abono No. ${recibo.numeroAbono}</span>
            <span style="font-size: 32px; font-weight: 700; color: #1e3a8a;">${formatearMoneda(recibo.montoAbono)}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span style="color: #6b7280; font-weight: 500;">Fecha:</span>
              <span style="color: #1f2937; font-weight: 600;">${formatearFecha(recibo.fechaAbono)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span style="color: #6b7280; font-weight: 500;">Método de Pago:</span>
              <span style="color: #1f2937; font-weight: 600;">${recibo.metodoPago}</span>
            </div>
            ${recibo.referencia ? `
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span style="color: #6b7280; font-weight: 500;">Referencia:</span>
              <span style="color: #1f2937; font-weight: 600;">${recibo.referencia}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- RESUMEN DE PAGOS -->
        <div style="background: #f9fafb; border-radius: 8px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; font-size: 15px; color: #1e2022; border-bottom: 1px solid #e5e7eb;">
            <span>Monto Total del Servicio:</span>
            <span style="font-weight: 600; color: #1f2937;">${formatearMoneda(recibo.montoTotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; font-size: 15px; color: #1e2022; border-bottom: 1px solid #e5e7eb;">
            <span>Total Pagado:</span>
            <span style="font-weight: 600; color: #10b981;">${formatearMoneda(recibo.montoPagado)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; font-size: 17px; color: #1e3a8a; border-top: 2px solid #1e3a8a; margin-top: 8px; font-weight: 700;">
            <span>Saldo Pendiente:</span>
            <span style="color: #1e3a8a;">${formatearMoneda(recibo.saldoPendiente)}</span>
          </div>
          <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Abonos Realizados: <strong>${recibo.abonosRealizados} de ${recibo.abonosPlaneados}</strong>
            </p>
            <div style="margin-top: 10px; background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #10b981, #059669); height: 100%; width: ${porcentajePagado}%; transition: width 0.3s ease;"></div>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #6b7280;">
              <strong>${porcentajePagado}%</strong> completado
            </p>
          </div>
        </div>
      </div>

      ${esPagoFinalizado ? `
      <!-- PAGO COMPLETADO -->
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%); border: 2px solid #10b981; border-radius: 8px; color: #065f46; font-weight: 600; font-size: 18px; margin-bottom: 25px;">
        ✓ ¡Pago Completado!
      </div>
      ` : ''}

      <!-- NOTAS -->
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 30px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #92400e; line-height: 1.6;">
          <strong>Nota:</strong> Este recibo es un comprobante de pago parcial. La factura fiscal se generará una vez completado el pago total del servicio.
        </p>
        ${recibo.observaciones ? `
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #92400e; line-height: 1.6;">
          <strong>Observaciones:</strong> ${recibo.observaciones}
        </p>
        ` : ''}
      </div>

      <!-- FOOTER -->
      <div style="margin-top: 40px; padding-top: 25px; border-top: 2px solid #e5e7eb; display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="text-align: center;">
          <div style="width: 200px; height: 1px; background: #9ca3af; margin-bottom: 8px;"></div>
          <p style="margin: 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Firma y Sello</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 3px 0; font-size: 11px; color: #9ca3af;">Documento generado electrónicamente</p>
          <p style="margin: 3px 0; font-size: 11px; color: #9ca3af;">Fecha de emisión: ${fechaActual}</p>
          <p style="margin: 3px 0; font-size: 11px; color: #9ca3af;">Recibo No. ${recibo.numeroRecibo}</p>
        </div>
      </div>

    </div>
  `;
};

export default generarPDFReciboAbono;