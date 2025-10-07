import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Send,
  X,
  BarChart3,
  CheckCircle,
  DollarSign,
  Filter,
  XCircle,
  Plus,
  Trash2
} from 'lucide-react';
import './TablaFacturas.css';
import { generarPDFFacturaTimbrada, imprimirFacturaTimbrada } from '../ModalesFactura/generarPDFFacturaTimbrada';
import { modalEliminarFactura } from '../ModalesFactura/ModalEliminarFactura';
// Constantes para estados de factura
const ESTADOS_FACTURA = {
  TIMBRADA: 'Timbrada',
  CANCELADA: 'Cancelada'
};

const TablaFacturas = ({ vistaActual, onCambiarVista }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [cargando, setCargando] = useState(false);

  // Datos de ejemplo para facturas (solo timbradas y canceladas)
  const datosFacturas = [
    {
      id: 1,
      numeroFactura: 'FACT-2025-001',
      cliente: 'Angel Rafael Hernández',
      monto: 15000.00,
      fechaEmision: '15/09/2025',
      fechaVencimiento: '15/10/2025',
      rfc: 'HERA850615ABC',
      uuid: 'A1B2C3D4-E5F6-7890-ABCD-123456789012',
      estado: ESTADOS_FACTURA.TIMBRADA,
      serie: 'A',
      folio: '0001',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '01 - Efectivo',
      formaPago: '01 - Contado',
      emailEnviado: true,
      fechaEnvio: '15/09/2025'
    },
    {
      id: 2,
      numeroFactura: 'FACT-2025-002',
      cliente: 'Marco Antonio Silva',
      monto: 8500.00,
      fechaEmision: '14/09/2025',
      fechaVencimiento: '14/10/2025',
      rfc: 'SIMA901020DEF',
      uuid: 'E5F6G7H8-I9J0-1234-EFGH-567890123456',
      estado: ESTADOS_FACTURA.TIMBRADA,
      serie: 'A',
      folio: '0002',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '04 - Tarjeta de crédito',
      formaPago: '01 - Contado',
      emailEnviado: true,
      fechaEnvio: '14/09/2025'
    },
    {
      id: 3,
      numeroFactura: 'FACT-2025-003',
      cliente: 'Carlos Eduardo López',
      monto: 12300.00,
      fechaEmision: '13/09/2025',
      fechaVencimiento: '13/10/2025',
      rfc: 'LOPC751203GHI',
      uuid: 'I9J0K1L2-M3N4-5678-IJKL-901234567890',
      estado: ESTADOS_FACTURA.TIMBRADA,
      serie: 'A',
      folio: '0003',
      usoCfdi: 'P01 - Por definir',
      metodoPago: '03 - Transferencia electrónica',
      formaPago: '01 - Contado',
      emailEnviado: false,
      fechaEnvio: null
    },
    {
      id: 4,
      numeroFactura: 'FACT-2025-004',
      cliente: 'Elías Abisaí González',
      monto: 25000.00,
      fechaEmision: '12/09/2025',
      fechaVencimiento: '12/10/2025',
      rfc: 'GOAE880425JKL',
      uuid: 'M3N4O5P6-Q7R8-9012-MNOP-345678901234',
      estado: ESTADOS_FACTURA.TIMBRADA,
      serie: 'A',
      folio: '0004',
      usoCfdi: 'G02 - Gastos médicos por incapacidad',
      metodoPago: '03 - Transferencia electrónica',
      formaPago: '99 - Por definir',
      emailEnviado: true,
      fechaEnvio: '12/09/2025'
    },
    {
      id: 5,
      numeroFactura: 'FACT-2025-005',
      cliente: 'María González Ruiz',
      monto: 5800.00,
      fechaEmision: '11/09/2025',
      fechaVencimiento: '11/10/2025',
      rfc: 'GORM920815MNO',
      uuid: 'Q7R8S9T0-U1V2-3456-QRST-789012345678',
      estado: ESTADOS_FACTURA.TIMBRADA,
      serie: 'A',
      folio: '0005',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '03 - Transferencia electrónica',
      formaPago: '01 - Contado',
      emailEnviado: true,
      fechaEnvio: '11/09/2025'
    },
    {
      id: 6,
      numeroFactura: 'FACT-2025-006',
      cliente: 'José Luis Martínez',
      monto: 18750.00,
      fechaEmision: '10/09/2025',
      fechaVencimiento: '10/10/2025',
      rfc: 'MALJ751128PQR',
      uuid: 'U1V2W3X4-Y5Z6-7890-UVWX-123456789012',
      estado: ESTADOS_FACTURA.CANCELADA,
      serie: 'A',
      folio: '0006',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '01 - Efectivo',
      formaPago: '01 - Contado',
      emailEnviado: true,
      fechaEnvio: '10/09/2025',
      fechaCancelacion: '11/09/2025',
      motivoCancelacion: 'Error en datos del cliente'
    },
    {
      id: 7,
      numeroFactura: 'FACT-2025-007',
      cliente: 'Roberto Sánchez Morales',
      monto: 16500.00,
      fechaEmision: '08/09/2025',
      fechaVencimiento: '08/10/2025',
      rfc: 'SAMR850720VWX',
      uuid: 'Y5Z6A7B8-C9D0-1234-YZAB-567890123456',
      estado: ESTADOS_FACTURA.TIMBRADA,
      serie: 'A',
      folio: '0007',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '03 - Transferencia electrónica',
      formaPago: '01 - Contado',
      emailEnviado: true,
      fechaEnvio: '08/09/2025'
    },
    {
      id: 8,
      numeroFactura: 'FACT-2025-008',
      cliente: 'Ana Patricia Delgado',
      monto: 22100.00,
      fechaEmision: '07/09/2025',
      fechaVencimiento: '07/10/2025',
      rfc: 'DELA880520YZA',
      uuid: 'Z7A8B9C0-D1E2-3456-ZABC-901234567890',
      estado: ESTADOS_FACTURA.CANCELADA,
      serie: 'A',
      folio: '0008',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '04 - Tarjeta de crédito',
      formaPago: '01 - Contado',
      emailEnviado: true,
      fechaEnvio: '07/09/2025',
      fechaCancelacion: '09/09/2025',
      motivoCancelacion: 'Cancelación a petición del cliente'
    }
  ];

  // Cálculo de estadísticas
  const estadisticas = useMemo(() => {
    const totalFacturas = datosFacturas.length;
    const timbradas = datosFacturas.filter(f => f.estado === ESTADOS_FACTURA.TIMBRADA).length;
    const canceladas = datosFacturas.filter(f => f.estado === ESTADOS_FACTURA.CANCELADA).length;

    // Calcular monto total facturado (solo timbradas activas)
    const montoTotal = datosFacturas
      .filter(f => f.estado === ESTADOS_FACTURA.TIMBRADA)
      .reduce((total, factura) => total + factura.monto, 0);

    return { totalFacturas, timbradas, canceladas, montoTotal };
  }, []);

  // Filtrar datos según búsqueda y estado
  const datosFiltrados = useMemo(() => {
    return datosFacturas.filter(factura => {
      const cumpleBusqueda =
        factura.cliente.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        factura.id.toString().includes(terminoBusqueda) ||
        factura.numeroFactura.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        factura.rfc.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        factura.uuid.toLowerCase().includes(terminoBusqueda.toLowerCase());

      const cumpleFiltroEstado =
        filtroEstado === 'todos' ||
        factura.estado.toLowerCase() === filtroEstado.toLowerCase();

      return cumpleBusqueda && cumpleFiltroEstado;
    });
  }, [terminoBusqueda, filtroEstado]);

  // Calcular paginación
  const totalRegistros = datosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicio + registrosPorPagina;
  const datosPaginados = datosFiltrados.slice(indiceInicio, indiceFinal);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const manejarCambioRegistros = (evento) => {
    setRegistrosPorPagina(parseInt(evento.target.value));
    setPaginaActual(1);
  };

  const manejarBusqueda = (evento) => {
    setTerminoBusqueda(evento.target.value);
    setPaginaActual(1);
  };

  const manejarCambioFiltro = (evento) => {
    setFiltroEstado(evento.target.value);
    setPaginaActual(1);
  };

  const manejarAccion = async (accion, factura) => {
    setCargando(true);

    switch (accion) {
      case 'descargar':
        try {
          console.log('Descargando factura PDF:', factura);

          // Generar y descargar el PDF
          await generarPDFFacturaTimbrada(factura);

        } catch (error) {
          console.error('Error al descargar PDF:', error);
          alert(`❌ Error al generar el PDF\n\n` +
            `${error.message || 'No se pudo generar el archivo PDF.'}\n\n` +
            `Por favor, intenta nuevamente.`);
        }
        break;

      case 'enviar':
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('Enviar factura:', factura);
        const emailCliente = prompt(`Enviar factura ${factura.numeroFactura} por correo\n\nIngresa el correo del cliente:`);
        if (emailCliente && emailCliente.includes('@')) {
          alert(`✉️ Factura enviada correctamente a:\n${emailCliente}\n\n` +
            `Factura: ${factura.numeroFactura}\n` +
            `Cliente: ${factura.cliente}`);
        } else if (emailCliente) {
          alert('❌ Correo inválido. Por favor ingresa un correo válido.');
        }
        break;

      case 'eliminar':
        setCargando(false); // Desactivar el estado de carga antes del modal

        // Usar el modal de eliminación personalizado
        const confirmado = await modalEliminarFactura(factura, async (facturaId) => {
          // Aquí iría la llamada al API para eliminar la factura
          console.log('Eliminando factura con ID:', facturaId);

          // Simular llamada API
          await new Promise(resolve => setTimeout(resolve, 500));

          // Aquí actualizarías el estado para remover la factura de la lista
          // Por ejemplo: eliminarFacturaDeLista(facturaId);
        });

        if (confirmado) {
          console.log('Factura eliminada exitosamente:', factura.numeroFactura);
          // Aquí puedes agregar lógica adicional después de eliminar
          // Por ejemplo: recargar datos, actualizar estadísticas, etc.
        }

        return; // Salir sin ejecutar setCargando(false) al final
      case 'imprimir':
        try {
          console.log('Imprimiendo factura:', factura);

          // Imprimir la factura
          imprimirFacturaTimbrada(factura);

        } catch (error) {
          console.error('Error al imprimir:', error);
          alert(`❌ Error al imprimir\n\n` +
            `${error.message || 'No se pudo abrir la ventana de impresión.'}\n\n` +
            `Verifica que permites ventanas emergentes.`);
        }
        break;

      default:
        break;
    }

    setCargando(false);
  };

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case ESTADOS_FACTURA.TIMBRADA:
        return 'facturas-estado-pagado';
      case ESTADOS_FACTURA.CANCELADA:
        return 'facturas-estado-vencido';
      default:
        return 'facturas-estado-pagado';
    }
  };

  const generarNumerosPaginacion = () => {
    const numeros = [];
    const maximoVisibles = 5;

    if (totalPaginas <= maximoVisibles) {
      for (let i = 1; i <= totalPaginas; i++) {
        numeros.push(i);
      }
    } else {
      if (paginaActual <= 3) {
        for (let i = 1; i <= 4; i++) {
          numeros.push(i);
        }
        numeros.push('...');
        numeros.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        numeros.push(1);
        numeros.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
          numeros.push(i);
        }
      } else {
        numeros.push(1);
        numeros.push('...');
        numeros.push(paginaActual - 1);
        numeros.push(paginaActual);
        numeros.push(paginaActual + 1);
        numeros.push('...');
        numeros.push(totalPaginas);
      }
    }

    return numeros;
  };

  return (
    <div className={`facturas-contenedor-principal ${cargando ? 'facturas-cargando' : ''}`}>
      {/* Header */}
      <div className="facturas-encabezado">
        <div className="facturas-seccion-logo">
          <div className="facturas-icono-principal">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="facturas-titulo">Registro de Facturas</h1>
            <p className="facturas-subtitulo">Consulta de facturas emitidas y timbradas</p>
          </div>
        </div>

        <div className="facturas-estadisticas-header">
          <div className="facturas-tarjeta-estadistica total">
            <BarChart3 className="facturas-icono-estadistica" size={20} />
            <span className="facturas-valor-estadistica">{estadisticas.totalFacturas}</span>
            <span className="facturas-etiqueta-estadistica">Total</span>
          </div>
          <div className="facturas-tarjeta-estadistica pagados">
            <CheckCircle className="facturas-icono-estadistica" size={20} />
            <span className="facturas-valor-estadistica">{estadisticas.timbradas}</span>
            <span className="facturas-etiqueta-estadistica">Activas</span>
          </div>
          <div className="facturas-tarjeta-estadistica vencidos">
            <XCircle className="facturas-icono-estadistica" size={20} />
            <span className="facturas-valor-estadistica">{estadisticas.canceladas}</span>
            <span className="facturas-etiqueta-estadistica">Canceladas</span>
          </div>
          <div className="facturas-tarjeta-estadistica pendientes">
            <DollarSign className="facturas-icono-estadistica" size={20} />
            <span className="facturas-valor-estadistica">${estadisticas.montoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            <span className="facturas-etiqueta-estadistica">Facturado</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="facturas-controles">
        <div className="facturas-seccion-izquierda">
          <div className="facturas-control-registros">
            <label htmlFor="registros">Mostrar</label>
            <select
              id="registros"
              value={registrosPorPagina}
              onChange={manejarCambioRegistros}
              className="facturas-selector-registros"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>registros</span>
          </div>

          <div className="facturas-filtro-estado">
            <Filter size={16} />
            <label htmlFor="filtro-estado">Estado:</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={manejarCambioFiltro}
              className="facturas-selector-filtro"
            >
              <option value="todos">Todas</option>
              <option value="timbrada">Activas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          <div className="facturas-filtro-estado">
            <Filter size={16} />
            <label htmlFor="filtro-vista">Vista:</label>
            <select
              id="filtro-vista"
              value={vistaActual}
              onChange={onCambiarVista}
              className="facturas-selector-filtro"
            >
              <option value="pagos">Gestión de Pagos</option>
              <option value="abonos">Pagos por Abonos</option>
              <option value="recibos">Gestión de Recibos</option>
              <option value="facturas">Registro de Facturas</option>
            </select>
          </div>
        </div>

        <div className="facturas-seccion-derecha">
          <div className="facturas-control-busqueda">
            <input
              type="text"
              id="buscar"
              placeholder="Buscar cliente, factura, RFC, UUID..."
              value={terminoBusqueda}
              onChange={manejarBusqueda}
              className="facturas-entrada-buscar"
            />
            <Search className="facturas-icono-buscar" size={18} />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="facturas-contenedor-tabla">
        {datosPaginados.length === 0 ? (
          <div className="facturas-estado-vacio">
            <div className="facturas-icono-vacio">
              <FileText size={64} />
            </div>
            <h3 className="facturas-mensaje-vacio">No se encontraron facturas</h3>
            <p className="facturas-submensaje-vacio">
              {terminoBusqueda || filtroEstado !== 'todos'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay facturas registradas en el sistema'}
            </p>
          </div>
        ) : (
          <table className="facturas-tabla">
            <thead>
              <tr className="facturas-fila-encabezado">
                <th>Factura</th>
                <th>Cliente</th>
                <th>RFC</th>
                <th>Monto</th>
                <th>Fecha Emisión</th>
                <th>UUID</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((factura, indice) => (
                <tr key={factura.id} className="facturas-fila-pago" style={{ animationDelay: `${indice * 0.05}s` }}>
                  <td data-label="Factura" className="facturas-columna-factura">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{factura.numeroFactura}</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Serie {factura.serie} - Folio {factura.folio}
                      </span>
                    </div>
                  </td>
                  <td data-label="Cliente" className="facturas-columna-cliente">{factura.cliente}</td>
                  <td data-label="RFC" className="facturas-columna-factura">{factura.rfc}</td>
                  <td data-label="Monto" className="facturas-columna-monto">
                    ${factura.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                  <td data-label="Fecha Emisión">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span>{factura.fechaEmision}</span>
                      {factura.estado === ESTADOS_FACTURA.CANCELADA && factura.fechaCancelacion && (
                        <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>
                          Cancelada: {factura.fechaCancelacion}
                        </span>
                      )}
                    </div>
                  </td>
                  <td data-label="UUID">
                    <div style={{
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#6b7280'
                    }} title={factura.uuid}>
                      {factura.uuid}
                    </div>
                  </td>
                  <td data-label="Estado">
                    <span className={`facturas-badge-estado ${obtenerClaseEstado(factura.estado)}`}>
                      <span className="facturas-indicador-estado"></span>
                      {factura.estado}
                    </span>
                  </td>
                  <td data-label="Acciones" className="facturas-columna-acciones">
                    <div className="facturas-botones-accion">
                      <button
                        className="facturas-boton-accion facturas-ver"
                        onClick={() => manejarAccion('descargar', factura)}
                        title="Descargar PDF"
                        disabled={cargando}
                      >
                        <Download size={14} />
                      </button>

                      {factura.estado === ESTADOS_FACTURA.TIMBRADA && (
                        <>
                          <button
                            className="facturas-boton-accion facturas-editar"
                            onClick={() => manejarAccion('enviar', factura)}
                            title="Enviar por correo"
                            disabled={cargando}
                          >
                            <Send size={14} />
                          </button>
                          <button
                            className="facturas-boton-accion facturas-eliminar"
                            onClick={() => manejarAccion('eliminar', factura)}
                            title="Eliminar factura"
                            disabled={cargando}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}

                      {factura.estado === ESTADOS_FACTURA.CANCELADA && (
                        <>
                          <button
                            className="facturas-boton-accion facturas-editar"
                            onClick={() => manejarAccion('enviar', factura)}
                            title="Reenviar documentos"
                            disabled={cargando}
                          >
                            <Send size={14} />
                          </button>
                          <button
                            className="facturas-boton-accion facturas-eliminar"
                            onClick={() => manejarAccion('eliminar', factura)}
                            title="Eliminar registro"
                            disabled={cargando}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pie de tabla */}
      {datosPaginados.length > 0 && (
        <div className="facturas-pie-tabla">
          <div className="facturas-informacion-registros">
            Mostrando <strong>{indiceInicio + 1}</strong> a <strong>{Math.min(indiceFinal, totalRegistros)}</strong> de <strong>{totalRegistros}</strong> registros
            {(terminoBusqueda || filtroEstado !== 'todos') && (
              <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>
                (filtrado de {datosFacturas.length} registros totales)
              </span>
            )}
          </div>

          <div className="facturas-controles-paginacion">
            <button
              className="facturas-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1 || cargando}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="facturas-numeros-paginacion">
              {generarNumerosPaginacion().map((numero, indice) => (
                numero === '...' ? (
                  <span key={`ellipsis-${indice}`} style={{ padding: '0.5rem', color: '#9ca3af' }}>
                    ...
                  </span>
                ) : (
                  <button
                    key={numero}
                    className={`facturas-numero-pagina ${paginaActual === numero ? 'facturas-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                    disabled={cargando}
                  >
                    {numero}
                  </button>
                )
              ))}
            </div>

            <button
              className="facturas-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas || cargando}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaFacturas;