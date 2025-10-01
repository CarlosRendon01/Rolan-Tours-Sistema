import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Edit, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  FileText, 
  Plus,
  Download,
  Send,
  X,
  BarChart3,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Filter
} from 'lucide-react';
import '../TablaPagos.css';

const TablaFacturas = ({ vistaActual, onCambiarVista }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // Datos de ejemplo para facturas
  const datosFacturas = [
    {
      id: 1,
      numeroFactura: 'FACT-2025-001',
      cliente: 'Angel Rafael Hernández',
      monto: '$15,000.00',
      fechaEmision: '15/09/2025',
      fechaVencimiento: '15/10/2025',
      rfc: 'HERA850615ABC',
      uuid: 'A1B2C3D4-E5F6-7890-ABCD-123456789012',
      estado: 'Timbrada',
      serie: 'A',
      folio: '0001',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '01 - Efectivo',
      formaPago: '01 - Contado'
    },
    {
      id: 2,
      numeroFactura: 'FACT-2025-002',
      cliente: 'Marco Antonio Silva',
      monto: '$8,500.00',
      fechaEmision: '14/09/2025',
      fechaVencimiento: '14/10/2025',
      rfc: 'SIMA901020DEF',
      uuid: 'E5F6G7H8-I9J0-1234-EFGH-567890123456',
      estado: 'Timbrada',
      serie: 'A',
      folio: '0002',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '04 - Tarjeta de crédito',
      formaPago: '01 - Contado'
    },
    {
      id: 3,
      numeroFactura: 'FACT-2025-003',
      cliente: 'Carlos Eduardo López',
      monto: '$12,300.00',
      fechaEmision: '13/09/2025',
      fechaVencimiento: '13/10/2025',
      rfc: 'LOPC751203GHI',
      uuid: 'I9J0K1L2-M3N4-5678-IJKL-901234567890',
      estado: 'Timbrada',
      serie: 'A',
      folio: '0003',
      usoCfdi: 'P01 - Por definir',
      metodoPago: '03 - Transferencia electrónica',
      formaPago: '01 - Contado'
    },
    {
      id: 4,
      numeroFactura: 'FACT-2025-004',
      cliente: 'Elías Abisaí González',
      monto: '$25,000.00',
      fechaEmision: '12/09/2025',
      fechaVencimiento: '12/10/2025',
      rfc: 'GOAE880425JKL',
      uuid: 'M3N4O5P6-Q7R8-9012-MNOP-345678901234',
      estado: 'Pendiente',
      serie: 'A',
      folio: '0004',
      usoCfdi: 'G02 - Gastos médicos por incapacidad',
      metodoPago: '03 - Transferencia electrónica',
      formaPago: '99 - Por definir'
    },
    {
      id: 5,
      numeroFactura: 'FACT-2025-005',
      cliente: 'María González Ruiz',
      monto: '$5,800.00',
      fechaEmision: '11/09/2025',
      fechaVencimiento: '11/10/2025',
      rfc: 'GORM920815MNO',
      uuid: 'Q7R8S9T0-U1V2-3456-QRST-789012345678',
      estado: 'Timbrada',
      serie: 'A',
      folio: '0005',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '03 - Transferencia electrónica',
      formaPago: '01 - Contado'
    },
    {
      id: 6,
      numeroFactura: 'FACT-2025-006',
      cliente: 'José Luis Martínez',
      monto: '$18,750.00',
      fechaEmision: '10/09/2025',
      fechaVencimiento: '10/10/2025',
      rfc: 'MALJ751128PQR',
      uuid: 'U1V2W3X4-Y5Z6-7890-UVWX-123456789012',
      estado: 'Cancelada',
      serie: 'A',
      folio: '0006',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '01 - Efectivo',
      formaPago: '01 - Contado'
    },
    {
      id: 7,
      numeroFactura: 'FACT-2025-007',
      cliente: 'Luisa Fernanda Martín',
      monto: '$9,200.00',
      fechaEmision: '09/09/2025',
      fechaVencimiento: '09/10/2025',
      rfc: 'MAFL880312STU',
      uuid: '',
      estado: 'Borrador',
      serie: 'A',
      folio: '0007',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '01 - Efectivo',
      formaPago: '01 - Contado'
    },
    {
      id: 8,
      numeroFactura: 'FACT-2025-008',
      cliente: 'Roberto Sánchez Morales',
      monto: '$16,500.00',
      fechaEmision: '08/09/2025',
      fechaVencimiento: '08/10/2025',
      rfc: 'SAMR850720VWX',
      uuid: 'Y5Z6A7B8-C9D0-1234-YZAB-567890123456',
      estado: 'Enviada',
      serie: 'A',
      folio: '0008',
      usoCfdi: 'G03 - Gastos en general',
      metodoPago: '03 - Transferencia electrónica',
      formaPago: '01 - Contado'
    }
  ];

  // Cálculo de estadísticas
  const estadisticas = useMemo(() => {
    const totalFacturas = datosFacturas.length;
    const timbradas = datosFacturas.filter(factura => factura.estado === 'Timbrada').length;
    const pendientes = datosFacturas.filter(factura => factura.estado === 'Pendiente').length;
    const canceladas = datosFacturas.filter(factura => factura.estado === 'Cancelada').length;
    const borradores = datosFacturas.filter(factura => factura.estado === 'Borrador').length;
    const enviadas = datosFacturas.filter(factura => factura.estado === 'Enviada').length;
    
    // Calcular monto total facturado (solo timbradas y enviadas)
    const montoTotal = datosFacturas
      .filter(factura => factura.estado === 'Timbrada' || factura.estado === 'Enviada')
      .reduce((total, factura) => {
        const monto = parseFloat(factura.monto.replace(/[$,]/g, ''));
        return total + monto;
      }, 0);

    return { totalFacturas, timbradas, pendientes, canceladas, borradores, enviadas, montoTotal };
  }, []);

  // Filtrar datos según búsqueda
  const datosFiltrados = useMemo(() => {
    return datosFacturas.filter(factura => {
      const cumpleBusqueda = 
        factura.cliente.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        factura.id.toString().includes(terminoBusqueda) ||
        factura.numeroFactura.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        factura.rfc.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        factura.uuid.toLowerCase().includes(terminoBusqueda.toLowerCase());

      return cumpleBusqueda;
    });
  }, [terminoBusqueda]);

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

  const manejarAccion = async (accion, factura) => {
    setCargando(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (accion) {
      case 'ver':
        console.log('Ver factura:', factura);
        alert(`Visualizando factura: ${factura.numeroFactura}\nCliente: ${factura.cliente}\nMonto: ${factura.monto}\nEstado: ${factura.estado}`);
        break;
      case 'editar':
        console.log('Editar factura:', factura);
        alert(`Editando factura: ${factura.numeroFactura}\nEsta funcionalidad abrirá el modal de edición`);
        break;
      case 'eliminar':
        console.log('Eliminar factura:', factura);
        if (window.confirm(`¿Estás seguro de eliminar esta factura?\n\nFactura: ${factura.numeroFactura}\nCliente: ${factura.cliente}\nMonto: ${factura.monto}\n\nEsta acción no se puede deshacer.`)) {
          alert('Factura eliminada correctamente (funcionalidad de demo)');
        }
        break;
      case 'descargar':
        console.log('Descargar factura:', factura);
        alert(`Descargando XML/PDF de la factura: ${factura.numeroFactura}`);
        break;
      case 'enviar':
        console.log('Enviar factura:', factura);
        alert(`Enviando por correo la factura: ${factura.numeroFactura}`);
        break;
      case 'cancelar':
        console.log('Cancelar factura:', factura);
        if (window.confirm(`¿Estás seguro de cancelar esta factura?\n\nFactura: ${factura.numeroFactura}\nEsta acción la marcará como cancelada ante el SAT.`)) {
          alert('Factura cancelada correctamente (funcionalidad de demo)');
        }
        break;
      case 'timbrar':
        console.log('Timbrar factura:', factura);
        alert(`Timbrando factura: ${factura.numeroFactura}\nEsta acción la registrará ante el SAT.`);
        break;
      default:
        break;
    }
    
    setCargando(false);
  };

  const abrirModalAgregarFactura = () => {
    console.log('Agregar nueva factura');
    alert('Se abrirá el modal para agregar una nueva factura.');
  };

  const obtenerClaseEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case 'timbrada':
      case 'enviada':
        return 'pagos-estado-pagado';
      case 'pendiente':
      case 'borrador':
        return 'pagos-estado-pendiente';
      case 'cancelada':
        return 'pagos-estado-vencido';
      default:
        return 'pagos-estado-pendiente';
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
    <div className={`pagos-contenedor-principal ${cargando ? 'pagos-cargando' : ''}`}>
      {/* Header */}
      <div className="pagos-encabezado">
        <div className="pagos-seccion-logo">
          <div className="pagos-icono-principal">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="pagos-titulo">Gestión de Facturas</h1>
            <p className="pagos-subtitulo">Facturación fiscal y tributaria</p>
          </div>
        </div>

        <div className="pagos-estadisticas-header">
          <div className="pagos-tarjeta-estadistica total">
            <BarChart3 className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.totalFacturas}</span>
            <span className="pagos-etiqueta-estadistica">Total</span>
          </div>
          <div className="pagos-tarjeta-estadistica pagados">
            <CheckCircle className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.timbradas}</span>
            <span className="pagos-etiqueta-estadistica">Timbradas</span>
          </div>
          <div className="pagos-tarjeta-estadistica pendientes">
            <AlertCircle className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.pendientes + estadisticas.borradores}</span>
            <span className="pagos-etiqueta-estadistica">Pendientes</span>
          </div>
          <div className="pagos-tarjeta-estadistica vencidos">
            <DollarSign className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">${estadisticas.montoTotal.toLocaleString()}</span>
            <span className="pagos-etiqueta-estadistica">Facturado</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="pagos-controles">
        <div className="pagos-seccion-izquierda">
          <div className="pagos-control-registros">
            <label htmlFor="registros">Mostrar</label>
            <select
              id="registros"
              value={registrosPorPagina}
              onChange={manejarCambioRegistros}
              className="pagos-selector-registros"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>registros</span>
          </div>

          <div className="pagos-filtro-estado">
            <Filter size={16} />
            <label htmlFor="filtro-vista">Vista:</label>
            <select
              id="filtro-vista"
              value={vistaActual}
              onChange={onCambiarVista}
              className="pagos-selector-filtro"
            >
              <option value="pagos">Gestión de Pagos</option>
              <option value="abonos">Pagos por Abonos</option>
              <option value="recibos">Gestión de Recibos</option>
              <option value="facturas">Gestión de Facturas</option>
            </select>
          </div>
        </div>

        <div className="pagos-seccion-derecha">
          <button
            className="pagos-boton-agregar"
            onClick={abrirModalAgregarFactura}
            title="Agregar nueva factura"
            disabled={cargando}
          >
            <Plus size={18} />
            <span>Nueva Factura</span>
          </button>

          <div className="pagos-control-busqueda">
            <input
              type="text"
              id="buscar"
              placeholder="Buscar cliente, factura, RFC..."
              value={terminoBusqueda}
              onChange={manejarBusqueda}
              className="pagos-entrada-buscar"
            />
            <Search className="pagos-icono-buscar" size={18} />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="pagos-contenedor-tabla">
        {datosPaginados.length === 0 ? (
          <div className="pagos-estado-vacio">
            <div className="pagos-icono-vacio">
              <FileText size={64} />
            </div>
            <h3 className="pagos-mensaje-vacio">No se encontraron facturas</h3>
            <p className="pagos-submensaje-vacio">
              {terminoBusqueda
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'No hay facturas registradas en el sistema'}
            </p>
          </div>
        ) : (
          <table className="pagos-tabla">
            <thead>
              <tr className="pagos-fila-encabezado">
                <th>Factura</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>RFC</th>
                <th>UUID</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((factura, indice) => (
                <tr key={factura.id} className="pagos-fila-pago" style={{animationDelay: `${indice * 0.05}s`}}>
                  <td data-label="Factura" className="pagos-columna-factura">
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                      <span style={{fontWeight: '600'}}>{factura.numeroFactura}</span>
                      <span style={{fontSize: '0.75rem', color: '#6b7280'}}>
                        Serie {factura.serie} - Folio {factura.folio}
                      </span>
                    </div>
                  </td>
                  <td data-label="Cliente" className="pagos-columna-cliente">{factura.cliente}</td>
                  <td data-label="Monto" className="pagos-columna-monto">{factura.monto}</td>
                  <td data-label="Fecha">
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                      <span>{factura.fechaEmision}</span>
                      <span style={{fontSize: '0.75rem', color: '#6b7280'}}>
                        Vence: {factura.fechaVencimiento}
                      </span>
                    </div>
                  </td>
                  <td data-label="RFC" className="pagos-columna-factura">{factura.rfc}</td>
                  <td data-label="UUID">
                    {factura.uuid ? (
                      <div style={{
                        maxWidth: '120px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        color: '#6b7280'
                      }} title={factura.uuid}>
                        {factura.uuid}
                      </div>
                    ) : (
                      <span style={{color: '#9ca3af', fontStyle: 'italic', fontSize: '0.75rem'}}>Sin UUID</span>
                    )}
                  </td>
                  <td data-label="Estado">
                    <span className={`pagos-badge-estado ${obtenerClaseEstado(factura.estado)}`}>
                      <span className="pagos-indicador-estado"></span>
                      {factura.estado}
                    </span>
                  </td>
                  <td data-label="Acciones" className="pagos-columna-acciones">
                    <div className="pagos-botones-accion">
                      <button 
                        className="pagos-boton-accion pagos-ver" 
                        onClick={() => manejarAccion('ver', factura)} 
                        title="Ver factura"
                      >
                        <Eye size={14} />
                      </button>
                      
                      {/* Acciones específicas por estado */}
                      {factura.estado === 'Borrador' && (
                        <>
                          <button 
                            className="pagos-boton-accion pagos-editar" 
                            onClick={() => manejarAccion('editar', factura)} 
                            title="Editar factura"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="pagos-boton-accion pagos-editar" 
                            onClick={() => manejarAccion('timbrar', factura)} 
                            title="Timbrar factura"
                          >
                            <CheckCircle size={14} />
                          </button>
                        </>
                      )}
                      
                      {factura.estado === 'Pendiente' && (
                        <>
                          <button 
                            className="pagos-boton-accion pagos-editar" 
                            onClick={() => manejarAccion('timbrar', factura)} 
                            title="Timbrar factura"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button 
                            className="pagos-boton-accion pagos-editar" 
                            onClick={() => manejarAccion('editar', factura)} 
                            title="Editar factura"
                          >
                            <Edit size={14} />
                          </button>
                        </>
                      )}
                      
                      {(factura.estado === 'Timbrada' || factura.estado === 'Enviada') && (
                        <>
                          <button 
                            className="pagos-boton-accion pagos-editar" 
                            onClick={() => manejarAccion('descargar', factura)} 
                            title="Descargar XML/PDF"
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            className="pagos-boton-accion pagos-editar" 
                            onClick={() => manejarAccion('enviar', factura)} 
                            title="Enviar por correo"
                          >
                            <Send size={14} />
                          </button>
                          <button 
                            className="pagos-boton-accion pagos-eliminar" 
                            onClick={() => manejarAccion('cancelar', factura)} 
                            title="Cancelar factura"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                      
                      {factura.estado === 'Cancelada' && (
                        <button 
                          className="pagos-boton-accion pagos-editar" 
                          onClick={() => manejarAccion('descargar', factura)} 
                          title="Descargar cancelación"
                        >
                          <Download size={14} />
                        </button>
                      )}
                      
                      {/* Eliminar disponible para borradores */}
                      {factura.estado === 'Borrador' && (
                        <button 
                          className="pagos-boton-accion pagos-eliminar" 
                          onClick={() => manejarAccion('eliminar', factura)} 
                          title="Eliminar borrador"
                        >
                          <Trash2 size={14} />
                        </button>
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
        <div className="pagos-pie-tabla">
          <div className="pagos-informacion-registros">
            Mostrando <strong>{indiceInicio + 1}</strong> a <strong>{Math.min(indiceFinal, totalRegistros)}</strong> de <strong>{totalRegistros}</strong> registros
            {terminoBusqueda && (
              <span style={{color: '#6b7280', marginLeft: '0.5rem'}}>
                (filtrado de {datosFacturas.length} registros totales)
              </span>
            )}
          </div>

          <div className="pagos-controles-paginacion">
            <button
              className="pagos-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1 || cargando}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="pagos-numeros-paginacion">
              {generarNumerosPaginacion().map((numero, indice) => (
                numero === '...' ? (
                  <span key={`ellipsis-${indice}`} style={{padding: '0.5rem', color: '#9ca3af'}}>
                    ...
                  </span>
                ) : (
                  <button
                    key={numero}
                    className={`pagos-numero-pagina ${paginaActual === numero ? 'pagos-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                    disabled={cargando}
                  >
                    {numero}
                  </button>
                )
              ))}
            </div>

            <button
              className="pagos-boton-paginacion"
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