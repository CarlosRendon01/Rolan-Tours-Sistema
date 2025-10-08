import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera un PDF de una factura timbrada usando html2canvas + jsPDF
 * @param {Object} factura - Datos de la factura timbrada
 * @returns {Promise<boolean>}
 */
export const generarPDFFacturaTimbrada = async (factura) => {
  try {
    const contenedorTemp = document.createElement('div');
    contenedorTemp.style.position = 'absolute';
    contenedorTemp.style.left = '-9999px';
    contenedorTemp.style.top = '0';
    contenedorTemp.style.width = '210mm';
    contenedorTemp.style.background = 'white';
    contenedorTemp.style.padding = '20mm';
    document.body.appendChild(contenedorTemp);

    contenedorTemp.innerHTML = generarHTMLFacturaTimbrada(factura);

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

    const nombreArchivo = `${factura.numeroFactura}_${factura.cliente.replace(/\s+/g, '_')}.pdf`;
    pdf.save(nombreArchivo);

    return true;
  } catch (error) {
    console.error('Error al generar PDF de factura:', error);
    throw new Error('No se pudo generar el PDF de la factura');
  }
};

/**
 * Imprime una factura timbrada directamente
 * @param {Object} factura - Datos de la factura timbrada
 */
export const imprimirFacturaTimbrada = (factura) => {
  try {
    const ventanaImpresion = window.open('', '_blank', 'width=900,height=700');
    
    if (!ventanaImpresion) {
      alert('Por favor, permite las ventanas emergentes para imprimir');
      return;
    }

    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura ${factura.numeroFactura}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            padding: 15mm;
            background: white;
          }
          
          @media print {
            body {
              padding: 10mm;
            }
            
            @page {
              margin: 10mm;
            }
          }
        </style>
      </head>
      <body>
        ${generarHTMLFacturaTimbrada(factura)}
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
        </script>
      </body>
      </html>
    `);
    
    ventanaImpresion.document.close();
  } catch (error) {
    console.error('Error al imprimir factura:', error);
    throw new Error('No se pudo imprimir la factura');
  }
};

/**
 * Genera el HTML de la factura timbrada con estilos inline
 * @param {Object} factura - Datos de la factura
 * @returns {string} HTML de la factura
 */
const generarHTMLFacturaTimbrada = (factura) => {
  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad || 0);
  };

  const formatearFecha = (fecha) => {
    const [dia, mes, año] = fecha.split('/');
    const fechaObj = new Date(año, mes - 1, dia);
    return fechaObj.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Datos de empresa
  const empresa = {
    nombre: 'Oaxaca Tours S.A. de C.V.',
    rfc: 'OAX123456ABC',
    regimen: '601 - General de Ley Personas Morales',
    direccion: 'Calle Hidalgo #123, Centro Histórico',
    codigoPostal: '68000',
    ciudad: 'Oaxaca de Juárez, Oaxaca',
    telefono: '(951) 123-4567',
    certificadoSAT: '00001000000123456789',
    certificadoEmisor: '00001000000987654321'
  };

  // Cálculos fiscales
  const subtotal = factura.monto / 1.16;
  const iva = factura.monto - subtotal;
  const total = factura.monto;

  const esCancelada = factura.estado === 'Cancelada' || factura.estado === 'CANCELADA';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1f2937; line-height: 1.5; max-width: 900px; margin: 0 auto; ${esCancelada ? 'opacity: 0.7;' : ''}">
      
      ${esCancelada ? `
      <div style="background: #fee2e2; border: 2px solid #dc2626; border-radius: 8px; padding: 15px; margin-bottom: 20px; text-align: center;">
        <p style="margin: 0; font-size: 18px; font-weight: 700; color: #991b1b;">⚠️ FACTURA CANCELADA</p>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #991b1b;">${factura.motivoCancelacion || 'Factura cancelada ante el SAT'}</p>
        ${factura.fechaCancelacion ? `<p style="margin: 3px 0 0 0; font-size: 12px; color: #991b1b;">Fecha de cancelación: ${factura.fechaCancelacion}</p>` : ''}
      </div>
      ` : ''}

      <!-- ENCABEZADO -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 3px solid #4338ca;">
        <div style="flex: 1;">
          <h1 style="font-size: 28px; font-weight: 700; color: #4338ca; margin: 0 0 15px 0; line-height: 1.2;">
            ${empresa.nombre}
          </h1>
          <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
            <p style="margin: 2px 0;"><strong>RFC:</strong> ${empresa.rfc}</p>
            <p style="margin: 2px 0;"><strong>Régimen Fiscal:</strong> ${empresa.regimen}</p>
            <p style="margin: 2px 0;">${empresa.direccion}</p>
            <p style="margin: 2px 0;">C.P. ${empresa.codigoPostal}, ${empresa.ciudad}</p>
            <p style="margin: 2px 0;">Tel: ${empresa.telefono}</p>
          </div>
        </div>
        <div style="text-align: right; min-width: 250px;">
          <div style="margin-bottom: 12px;">
            <span style="display: inline-block; background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); color: white; padding: 8px 16px; border-radius: 8px; font-size: 18px; font-weight: 700;">FACTURA</span>
          </div>
          <div style="background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; display: inline-block;">
            CFDI 4.0
          </div>
          <div style="margin-bottom: 12px;">
            <p style="margin: 0; font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600;">FOLIO:</p>
            <p style="margin: 3px 0 0 0; font-size: 20px; font-weight: 700; color: #4338ca;">${factura.numeroFactura}</p>
            <p style="margin: 3px 0 0 0; font-size: 11px; color: #6b7280;">Serie ${factura.serie} - Folio ${factura.folio}</p>
          </div>
          <div style="font-size: 11px; color: #6b7280;">
            <p style="margin: 2px 0;"><strong>Fecha Emisión:</strong> ${factura.fechaEmision}</p>
            <p style="margin: 2px 0;"><strong>Fecha Vencimiento:</strong> ${factura.fechaVencimiento}</p>
          </div>
          ${esCancelada ? `
          <div style="margin-top: 10px; padding: 6px 12px; background: #fee2e2; border: 1px solid #dc2626; border-radius: 6px;">
            <span style="color: #991b1b; font-weight: 600; font-size: 11px;">CANCELADA</span>
          </div>
          ` : `
          <div style="margin-top: 10px; padding: 6px 12px; background: #d1fae5; border: 1px solid #10b981; border-radius: 6px;">
            <span style="color: #065f46; font-weight: 600; font-size: 11px;">✓ TIMBRADA</span>
          </div>
          `}
        </div>
      </div>

      <!-- INFORMACIÓN FISCAL -->
      <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
          <p style="margin: 0 0 5px 0; font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Folio Fiscal (UUID):</p>
          <p style="margin: 0; font-size: 13px; color: #1f2937; font-weight: 600; font-family: 'Courier New', monospace; word-break: break-all;">
            ${factura.uuid}
          </p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div>
            <p style="margin: 0 0 3px 0; font-size: 10px; color: #6b7280; font-weight: 600;">No. Certificado SAT:</p>
            <p style="margin: 0; font-size: 12px; color: #1f2937; font-family: 'Courier New', monospace;">${empresa.certificadoSAT}</p>
          </div>
          <div>
            <p style="margin: 0 0 3px 0; font-size: 10px; color: #6b7280; font-weight: 600;">No. Certificado Emisor:</p>
            <p style="margin: 0; font-size: 12px; color: #1f2937; font-family: 'Courier New', monospace;">${empresa.certificadoEmisor}</p>
          </div>
        </div>
      </div>

      <!-- RECEPTOR -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
          👤 RECEPTOR
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div>
            <p style="margin: 0 0 3px 0; font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Nombre / Razón Social:</p>
            <p style="margin: 0; font-size: 13px; color: #1f2937; font-weight: 500;">${factura.cliente}</p>
          </div>
          <div>
            <p style="margin: 0 0 3px 0; font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase;">RFC:</p>
            <p style="margin: 0; font-size: 13px; color: #1f2937; font-weight: 500;">${factura.rfc}</p>
          </div>
          <div>
            <p style="margin: 0 0 3px 0; font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Uso CFDI:</p>
            <p style="margin: 0; font-size: 13px; color: #1f2937; font-weight: 500;">${factura.usoCfdi}</p>
          </div>
          <div>
            <p style="margin: 0 0 3px 0; font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Método de Pago:</p>
            <p style="margin: 0; font-size: 13px; color: #1f2937; font-weight: 500;">${factura.metodoPago}</p>
          </div>
          <div>
            <p style="margin: 0 0 3px 0; font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Forma de Pago:</p>
            <p style="margin: 0; font-size: 13px; color: #1f2937; font-weight: 500;">${factura.formaPago}</p>
          </div>
        </div>
      </div>

      <!-- CONCEPTOS -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; font-weight: 600; color: #374151; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
          📦 CONCEPTOS
        </h3>
        <div style="overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 10px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 10px; text-transform: uppercase;">Clave</th>
                <th style="padding: 10px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 10px; text-transform: uppercase;">Cantidad</th>
                <th style="padding: 10px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 10px; text-transform: uppercase;">Unidad</th>
                <th style="padding: 10px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 10px; text-transform: uppercase;">Descripción</th>
                <th style="padding: 10px; text-align: right; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 10px; text-transform: uppercase;">Precio Unit.</th>
                <th style="padding: 10px; text-align: right; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 10px; text-transform: uppercase;">Importe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">90111501</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">1</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">E48 - Servicio</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
                  <div>
                    <strong style="display: block; margin-bottom: 4px;">Servicio Turístico</strong>
                    <span style="display: block; color: #6b7280; font-size: 11px;">Factura ${factura.numeroFactura}</span>
                  </div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; white-space: nowrap; color: #1f2937;">${formatearMoneda(subtotal)}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; white-space: nowrap; color: #1f2937;">${formatearMoneda(subtotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TOTALES -->
      <div style="display: grid; grid-template-columns: 1fr auto; gap: 20px; margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
        <div>
          <div style="margin-bottom: 12px;">
            <h4 style="font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin: 0 0 4px 0;">Método de Pago</h4>
            <p style="font-size: 12px; color: #1f2937; margin: 0; font-weight: 500;">${factura.metodoPago}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <h4 style="font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin: 0 0 4px 0;">Forma de Pago</h4>
            <p style="font-size: 12px; color: #1f2937; margin: 0; font-weight: 500;">${factura.formaPago}</p>
          </div>
          <div>
            <h4 style="font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin: 0 0 4px 0;">Moneda</h4>
            <p style="font-size: 12px; color: #1f2937; margin: 0; font-weight: 500;">MXN - Peso Mexicano</p>
          </div>
        </div>

        <div style="min-width: 280px; background: #f9fafb; padding: 15px; border-radius: 8px; border: 2px solid #e5e7eb;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 13px; color: #4b5563; border-bottom: 1px solid #e5e7eb;">
            <span>Subtotal:</span>
            <span style="font-weight: 600; color: #1f2937;">${formatearMoneda(subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 13px; color: #4b5563; border-bottom: 1px solid #e5e7eb;">
            <span>IVA (16%):</span>
            <span style="font-weight: 600; color: #1f2937;">${formatearMoneda(iva)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; margin-top: 8px; border-top: 2px solid #4338ca; font-size: 16px; font-weight: 700; color: #4338ca;">
            <span>Total:</span>
            <span>${formatearMoneda(total)}</span>
          </div>
        </div>
      </div>

      ${factura.emailEnviado ? `
      <div style="margin-top: 20px; padding: 12px; background: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px;">
        <p style="margin: 0; font-size: 12px; color: #065f46;">
          <strong>✓ Factura enviada por correo electrónico</strong>
          ${factura.fechaEnvio ? ` el ${factura.fechaEnvio}` : ''}
        </p>
      </div>
      ` : ''}

      <!-- SELLOS DIGITALES -->
      <div style="margin-top: 20px;">
        <div style="margin-bottom: 15px; padding: 12px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h4 style="font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Sello Digital del CFDI</h4>
          <p style="font-size: 9px; color: #1f2937; font-family: 'Courier New', monospace; word-break: break-all; line-height: 1.5; margin: 0; background: white; padding: 8px; border-radius: 4px;">
            hA3kL9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH==
          </p>
        </div>
        <div style="margin-bottom: 15px; padding: 12px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h4 style="font-size: 10px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Sello Digital del SAT</h4>
          <p style="font-size: 9px; color: #1f2937; font-family: 'Courier New', monospace; word-break: break-all; line-height: 1.5; margin: 0; background: white; padding: 8px; border-radius: 4px;">
            xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH3sK9mP2xR5tY8vN1qW4jF7cZ0bD6gH==
          </p>
        </div>
      </div>

      <!-- CADENA ORIGINAL -->
      <div style="margin-top: 15px; padding: 12px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <h4 style="font-size: 10px; color: #92400e; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Cadena Original del Complemento de Certificación Digital del SAT</h4>
        <p style="font-size: 9px; color: #78350f; font-family: 'Courier New', monospace; word-break: break-all; line-height: 1.5; margin: 0;">
          ||1.1|${factura.uuid}|${factura.fechaEmision}|${empresa.rfc}|${factura.cliente}|${total}|${empresa.certificadoSAT}||
        </p>
      </div>

      <!-- CÓDIGO QR Y VERIFICACIÓN -->
      <div style="display: flex; align-items: center; gap: 20px; margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; border: 2px solid #e5e7eb;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 120px; height: 120px; background: white; border: 2px dashed #cbd5e1; border-radius: 8px; color: #9ca3af; flex-shrink: 0;">
          <span style="font-size: 40px;">📱</span>
          <p style="margin: 8px 0 0 0; font-weight: 600; font-size: 11px;">Código QR</p>
          <span style="font-size: 9px;">Escanea aquí</span>
        </div>
        <div style="flex: 1;">
          <p style="font-size: 12px; color: #1f2937; margin: 0 0 8px 0; font-weight: 600;">Este documento es una representación impresa de un CFDI</p>
          <p style="font-size: 11px; color: #4b5563; margin: 0 0 6px 0; line-height: 1.5;">Puede verificar la autenticidad de este documento en:</p>
          <p style="color: #4338ca; font-family: 'Courier New', monospace; font-size: 10px; margin: 0;">https://verificacfdi.facturaelectronica.sat.gob.mx/</p>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
        <p style="font-size: 10px; color: #9ca3af; margin: 3px 0;">Este documento fue generado electrónicamente y es válido sin firma autógrafa</p>
        <p style="font-size: 10px; color: #9ca3af; margin: 3px 0;">Fecha de emisión: ${formatearFecha(factura.fechaEmision)}</p>
        <p style="font-size: 10px; color: #9ca3af; margin: 3px 0;">${empresa.nombre} - RFC: ${empresa.rfc}</p>
      </div>

    </div>
  `;
};

export default { generarPDFFacturaTimbrada, imprimirFacturaTimbrada };