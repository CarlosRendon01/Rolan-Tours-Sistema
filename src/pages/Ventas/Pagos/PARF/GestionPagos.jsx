import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Edit, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  CreditCard, 
  Plus,
  FileText,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter
} from 'lucide-react';
import '../TablaPagos.css';

const GestionPagos = ({ vistaActual, onCambiarVista }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [cargando, setCargando] = useState(false);

  // Datos de ejemplo para pagos
  const datosPagos = [
    {
      id: 1,
      cliente: 'Angel Rafael Hernández',
      monto: '$15,000.00',
      fechaPago: '15/09/2025',
      metodoPago: 'Transferencia Bancaria',
      numeroFactura: 'FAC-001',
      estado: 'Pagado',
      concepto: 'Servicios profesionales de consultoría',
      fechaVencimiento: '15/09/2025'
    },
    {
      id: 2,
      cliente: 'Marco Antonio Silva',
      monto: '$8,500.00',
      fechaPago: '14/09/2025',
      metodoPago: 'Efectivo',
      numeroFactura: 'FAC-002',
      estado: 'Pagado',
      concepto: 'Consultoría empresarial',
      fechaVencimiento: '14/09/2025'
    },
    {
      id: 3,
      cliente: 'Carlos Eduardo López',
      monto: '$12,300.00',
      fechaPago: '13/09/2025',
      metodoPago: 'Tarjeta de Crédito',
      numeroFactura: 'FAC-003',
      estado: 'Pagado',
      concepto: 'Desarrollo web completo',
      fechaVencimiento: '13/09/2025'
    },
    {
      id: 4,
      cliente: 'Elías Abisaí González',
      monto: '$25,000.00',
      fechaPago: '',
      metodoPago: '',
      numeroFactura: 'FAC-004',
      estado: 'Pendiente',
      concepto: 'Sistema integral de gestión',
      fechaVencimiento: '20/09/2025'
    },
    {
      id: 5,
      cliente: 'María González Ruiz',
      monto: '$5,800.00',
      fechaPago: '12/09/2025',
      metodoPago: 'Transferencia Bancaria',
      numeroFactura: 'FAC-005',
      estado: 'Pagado',
      concepto: 'Capacitación empresarial',
      fechaVencimiento: '12/09/2025'
    },
    {
      id: 6,
      cliente: 'José Luis Martínez',
      monto: '$18,750.00',
      fechaPago: '',
      metodoPago: '',
      numeroFactura: 'FAC-006',
      estado: 'Vencido',
      concepto: 'Auditoría financiera',
      fechaVencimiento: '10/09/2025'
    }
  ];

  // Cálculo de estadísticas
  const estadisticas = useMemo(() => {
    const total = datosPagos.length;
    const pagados = datosPagos.filter(pago => pago.estado === 'Pagado').length;
    const pendientes = datosPagos.filter(pago => pago.estado === 'Pendiente').length;
    const vencidos = datosPagos.filter(pago => pago.estado === 'Vencido').length;
    return { total, pagados, pendientes, vencidos };
  }, []);

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    return datosPagos.filter(pago => {
      const cumpleBusqueda = 
        pago.cliente.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        pago.id.toString().includes(terminoBusqueda) ||
        pago.numeroFactura.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        pago.concepto.toLowerCase().includes(terminoBusqueda.toLowerCase());

      const cumpleFiltroEstado = filtroEstado === 'todos' || 
        pago.estado.toLowerCase() === filtroEstado.toLowerCase();

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

  const manejarFiltroEstado = (evento) => {
    setFiltroEstado(evento.target.value);
    setPaginaActual(1);
  };

  const manejarAccion = async (accion, pago) => {
    setCargando(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      switch (accion) {
        case 'ver':
          alert(`Visualizando pago de: ${pago.cliente}\nMonto: ${pago.monto}`);
          break;
        case 'editar':
          alert(`Editando pago de: ${pago.cliente}`);
          break;
        case 'eliminar':
          if (window.confirm(`¿Eliminar pago de ${pago.cliente}?`)) {
            alert('Pago eliminado');
          }
          break;
        case 'generarFactura':
          alert(`Generando factura para: ${pago.cliente}`);
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalAgregar = () => {
    alert('Se abrirá el modal para agregar un nuevo pago.');
  };

  const obtenerClaseEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pagado':
        return 'pagos-estado-pagado';
      case 'pendiente':
        return 'pagos-estado-pendiente';
      case 'vencido':
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
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="pagos-titulo">Gestión de Pagos</h1>
            <p className="pagos-subtitulo">Control de pagos completados y vencidos</p>
          </div>
        </div>

        <div className="pagos-estadisticas-header">
          <div className="pagos-tarjeta-estadistica total">
            <BarChart3 className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.total}</span>
            <span className="pagos-etiqueta-estadistica">Total</span>
          </div>
          <div className="pagos-tarjeta-estadistica pagados">
            <CheckCircle className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.pagados}</span>
            <span className="pagos-etiqueta-estadistica">Pagados</span>
          </div>
          <div className="pagos-tarjeta-estadistica pendientes">
            <Clock className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.pendientes}</span>
            <span className="pagos-etiqueta-estadistica">Pendientes</span>
          </div>
          <div className="pagos-tarjeta-estadistica vencidos">
            <AlertCircle className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.vencidos}</span>
            <span className="pagos-etiqueta-estadistica">Vencidos</span>
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

          <div className="pagos-filtro-estado">
            <label htmlFor="filtro-estado">Estado:</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={manejarFiltroEstado}
              className="pagos-selector-filtro"
            >
              <option value="todos">Todos</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>
        </div>

        <div className="pagos-seccion-derecha">
          <button
            className="pagos-boton-agregar"
            onClick={abrirModalAgregar}
            disabled={cargando}
          >
            <Plus size={18} />
            <span>Nuevo Pago</span>
          </button>

          <div className="pagos-control-busqueda">
            <input
              type="text"
              placeholder="Buscar cliente, factura..."
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
            <h3 className="pagos-mensaje-vacio">No se encontraron pagos</h3>
            <p className="pagos-submensaje-vacio">
              {terminoBusqueda || filtroEstado !== 'todos'
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'No hay pagos registrados en el sistema'}
            </p>
          </div>
        ) : (
          <table className="pagos-tabla">
            <thead>
              <tr className="pagos-fila-encabezado">
                <th>ID</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Fecha Pago</th>
                <th>Método Pago</th>
                <th>Factura</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((pago, indice) => (
                <tr key={pago.id} className="pagos-fila-pago" style={{animationDelay: `${indice * 0.05}s`}}>
                  <td data-label="ID" className="pagos-columna-id">#{pago.id.toString().padStart(3, '0')}</td>
                  <td data-label="Cliente" className="pagos-columna-cliente">{pago.cliente}</td>
                  <td data-label="Monto" className="pagos-columna-monto">{pago.monto}</td>
                  <td data-label="Fecha Pago">
                    {pago.fechaPago ? (
                      <span>{pago.fechaPago}</span>
                    ) : (
                      <span style={{color: '#9ca3af', fontStyle: 'italic'}}>Sin fecha</span>
                    )}
                  </td>
                  <td data-label="Método">
                    {pago.metodoPago ? (
                      <span>{pago.metodoPago}</span>
                    ) : (
                      <span style={{color: '#9ca3af', fontStyle: 'italic'}}>Sin método</span>
                    )}
                  </td>
                  <td data-label="Factura" className="pagos-columna-factura">{pago.numeroFactura}</td>
                  <td data-label="Estado">
                    <span className={`pagos-badge-estado ${obtenerClaseEstado(pago.estado)}`}>
                      <span className="pagos-indicador-estado"></span>
                      {pago.estado}
                    </span>
                  </td>
                  <td data-label="Acciones" className="pagos-columna-acciones">
                    <div className="pagos-botones-accion">
                      <button 
                        className="pagos-boton-accion pagos-ver" 
                        onClick={() => manejarAccion('ver', pago)} 
                        title="Ver detalles"
                        disabled={cargando}
                      >
                        <Eye size={14} />
                      </button>
                      {pago.estado === 'Pagado' && (
                        <button 
                          className="pagos-boton-accion pagos-editar" 
                          onClick={() => manejarAccion('generarFactura', pago)} 
                          title="Generar factura"
                          disabled={cargando}
                        >
                          <FileText size={14} />
                        </button>
                      )}
                      {(pago.estado === 'Pendiente' || pago.estado === 'Vencido') && (
                        <button 
                          className="pagos-boton-accion pagos-editar" 
                          onClick={() => manejarAccion('editar', pago)} 
                          title="Editar"
                          disabled={cargando}
                        >
                          <Edit size={14} />
                        </button>
                      )}
                      <button 
                        className="pagos-boton-accion pagos-eliminar" 
                        onClick={() => manejarAccion('eliminar', pago)} 
                        title="Eliminar"
                        disabled={cargando}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {datosPaginados.length > 0 && (
        <div className="pagos-pie-tabla">
          <div className="pagos-informacion-registros">
            Mostrando <strong>{indiceInicio + 1}</strong> a <strong>{Math.min(indiceFinal, totalRegistros)}</strong> de <strong>{totalRegistros}</strong> registros
            {(terminoBusqueda || filtroEstado !== 'todos') && (
              <span style={{color: '#6b7280', marginLeft: '0.5rem'}}>
                (filtrado de {datosPagos.length} registros totales)
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

export default GestionPagos;