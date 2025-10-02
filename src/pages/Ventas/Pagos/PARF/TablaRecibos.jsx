import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Edit, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Receipt, 
  Plus,
  Download,
  Printer,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Filter
} from 'lucide-react';
// TablaRecibos.jsx
import './TablaRecibos.css';

const TablaRecibos = ({ vistaActual, onCambiarVista }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // Datos de ejemplo para recibos
  const datosRecibos = [
    {
      id: 1,
      numeroRecibo: 'REC-001',
      cliente: 'Roberto Sánchez Morales',
      monto: '$8,000.00',
      fechaEmision: '20/09/2025',
      concepto: 'Abono 3/5 - Marketing Digital',
      metodoPago: 'Transferencia',
      estado: 'Emitido'
    },
    {
      id: 2,
      numeroRecibo: 'REC-002',
      cliente: 'Diana Torres Vega',
      monto: '$4,500.00',
      fechaEmision: '18/09/2025',
      concepto: 'Abono 2/4 - Análisis de Mercado',
      metodoPago: 'Efectivo',
      estado: 'Emitido'
    },
    {
      id: 3,
      numeroRecibo: 'REC-003',
      cliente: 'Fernando Ramírez Cruz',
      monto: '$9,000.00',
      fechaEmision: '22/09/2025',
      concepto: 'Abono 3/5 - Sistema ERP',
      metodoPago: 'Cheque',
      estado: 'Emitido'
    }
  ];

  // Cálculo de estadísticas
  const estadisticas = useMemo(() => {
    const totalRecibos = datosRecibos.length;
    const emitidos = datosRecibos.filter(r => r.estado === 'Emitido').length;
    const pendientes = datosRecibos.filter(r => r.estado === 'Pendiente').length;
    const montoTotal = datosRecibos.reduce((total, recibo) => {
      const monto = parseFloat(recibo.monto.replace(/[$,]/g, ''));
      return total + monto;
    }, 0);

    return { totalRecibos, emitidos, pendientes, montoTotal };
  }, []);

  // Filtrar datos según búsqueda
  const datosFiltrados = useMemo(() => {
    return datosRecibos.filter(recibo => {
      const cumpleBusqueda = 
        recibo.cliente.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        recibo.id.toString().includes(terminoBusqueda) ||
        recibo.numeroRecibo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        recibo.concepto.toLowerCase().includes(terminoBusqueda.toLowerCase());

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

  const manejarAccion = async (accion, recibo) => {
    setCargando(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      switch (accion) {
        case 'ver':
          alert(`Visualizando recibo: ${recibo.numeroRecibo}\nCliente: ${recibo.cliente}`);
          break;
        case 'editar':
          alert(`Editando recibo: ${recibo.numeroRecibo}`);
          break;
        case 'eliminar':
          if (window.confirm(`¿Eliminar recibo ${recibo.numeroRecibo}?`)) {
            alert('Recibo eliminado');
          }
          break;
        case 'descargar':
          alert(`Descargando PDF del recibo: ${recibo.numeroRecibo}`);
          break;
        case 'imprimir':
          alert(`Enviando a imprimir recibo: ${recibo.numeroRecibo}`);
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalAgregar = () => {
    alert('Se abrirá el modal para agregar un nuevo recibo.');
  };

  const obtenerClaseEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case 'emitido':
        return 'pagos-estado-pagado';
      case 'pendiente':
        return 'pagos-estado-pendiente';
      case 'cancelado':
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
            <Receipt size={24} />
          </div>
          <div>
            <h1 className="pagos-titulo">Gestión de Recibos</h1>
            <p className="pagos-subtitulo">Documentos de comprobante de pago</p>
          </div>
        </div>

        <div className="pagos-estadisticas-header">
          <div className="pagos-tarjeta-estadistica total">
            <BarChart3 className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.totalRecibos}</span>
            <span className="pagos-etiqueta-estadistica">Total</span>
          </div>
          <div className="pagos-tarjeta-estadistica pagados">
            <CheckCircle className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.emitidos}</span>
            <span className="pagos-etiqueta-estadistica">Emitidos</span>
          </div>
          <div className="pagos-tarjeta-estadistica pendientes">
            <Clock className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.pendientes}</span>
            <span className="pagos-etiqueta-estadistica">Pendientes</span>
          </div>
          <div className="pagos-tarjeta-estadistica vencidos">
            <Receipt className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">${estadisticas.montoTotal.toLocaleString()}</span>
            <span className="pagos-etiqueta-estadistica">Total Facturado</span>
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
            onClick={abrirModalAgregar}
            disabled={cargando}
          >
            <Plus size={18} />
            <span>Nuevo Recibo</span>
          </button>

          <div className="pagos-control-busqueda">
            <input
              type="text"
              placeholder="Buscar cliente, recibo..."
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
            <h3 className="pagos-mensaje-vacio">No se encontraron recibos</h3>
            <p className="pagos-submensaje-vacio">
              {terminoBusqueda
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'No hay recibos registrados en el sistema'}
            </p>
          </div>
        ) : (
          <table className="pagos-tabla">
            <thead>
              <tr className="pagos-fila-encabezado">
                <th>Recibo</th>
                <th>Cliente</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Método Pago</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((recibo, indice) => (
                <tr key={recibo.id} className="pagos-fila-pago" style={{animationDelay: `${indice * 0.05}s`}}>
                  <td data-label="Recibo" className="pagos-columna-factura">{recibo.numeroRecibo}</td>
                  <td data-label="Cliente" className="pagos-columna-cliente">{recibo.cliente}</td>
                  <td data-label="Monto" className="pagos-columna-monto">{recibo.monto}</td>
                  <td data-label="Fecha">{recibo.fechaEmision}</td>
                  <td data-label="Concepto">
                    <div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={recibo.concepto}>
                      {recibo.concepto}
                    </div>
                  </td>
                  <td data-label="Método Pago">{recibo.metodoPago}</td>
                  <td data-label="Estado">
                    <span className={`pagos-badge-estado ${obtenerClaseEstado(recibo.estado)}`}>
                      <span className="pagos-indicador-estado"></span>
                      {recibo.estado}
                    </span>
                  </td>
                  <td data-label="Acciones" className="pagos-columna-acciones">
                    <div className="pagos-botones-accion">
                      <button 
                        className="pagos-boton-accion pagos-ver" 
                        onClick={() => manejarAccion('ver', recibo)} 
                        title="Ver recibo"
                        disabled={cargando}
                      >
                        <Eye size={14} />
                      </button>
                      {recibo.estado === 'Emitido' && (
                        <>
                          <button 
                            className="pagos-boton-accion pagos-editar" 
                            onClick={() => manejarAccion('descargar', recibo)} 
                            title="Descargar PDF"
                            disabled={cargando}
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            className="pagos-boton-accion pagos-editar" 
                            onClick={() => manejarAccion('imprimir', recibo)} 
                            title="Imprimir recibo"
                            disabled={cargando}
                          >
                            <Printer size={14} />
                          </button>
                        </>
                      )}
                      {recibo.estado === 'Pendiente' && (
                        <button 
                          className="pagos-boton-accion pagos-editar" 
                          onClick={() => manejarAccion('editar', recibo)} 
                          title="Editar recibo"
                          disabled={cargando}
                        >
                          <Edit size={14} />
                        </button>
                      )}
                      <button 
                        className="pagos-boton-accion pagos-eliminar" 
                        onClick={() => manejarAccion('eliminar', recibo)} 
                        title="Eliminar recibo"
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
            {terminoBusqueda && (
              <span style={{color: '#6b7280', marginLeft: '0.5rem'}}>
                (filtrado de {datosRecibos.length} registros totales)
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

export default TablaRecibos;