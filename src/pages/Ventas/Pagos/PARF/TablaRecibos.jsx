import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Receipt, 
  Download,
  Printer,
  BarChart3,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
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
        case 'eliminar':
          if (window.confirm(`¿Eliminar recibo ${recibo.numeroRecibo}?\n\nCliente: ${recibo.cliente}\nMonto: ${recibo.monto}`)) {
            alert('Recibo eliminado exitosamente');
          }
          break;
        case 'descargar':
          alert(`Descargando PDF del recibo: ${recibo.numeroRecibo}`);
          break;
        case 'imprimir':
          alert(`Enviando a imprimir recibo: ${recibo.numeroRecibo}`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const obtenerClaseEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case 'emitido':
        return 'recibos-estado-emitido';
      case 'pendiente':
        return 'recibos-estado-pendiente';
      case 'cancelado':
        return 'recibos-estado-cancelado';
      default:
        return 'recibos-estado-pendiente';
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
    <div className={`recibos-contenedor-principal ${cargando ? 'recibos-cargando' : ''}`}>
      {/* Header */}
      <div className="recibos-encabezado">
        <div className="recibos-seccion-logo">
          <div className="recibos-icono-principal">
            <Receipt size={24} />
          </div>
          <div>
            <h1 className="recibos-titulo">Gestión de Recibos</h1>
            <p className="recibos-subtitulo">Comprobantes de pago generados</p>
          </div>
        </div>

        <div className="recibos-estadisticas-header">
          <div className="recibos-tarjeta-estadistica total">
            <BarChart3 className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">{estadisticas.totalRecibos}</span>
            <span className="recibos-etiqueta-estadistica">Total</span>
          </div>
          <div className="recibos-tarjeta-estadistica pagados">
            <CheckCircle className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">{estadisticas.emitidos}</span>
            <span className="recibos-etiqueta-estadistica">Emitidos</span>
          </div>
          <div className="recibos-tarjeta-estadistica pendientes">
            <Clock className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">{estadisticas.pendientes}</span>
            <span className="recibos-etiqueta-estadistica">Pendientes</span>
          </div>
          <div className="recibos-tarjeta-estadistica vencidos">
            <Receipt className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">${estadisticas.montoTotal.toLocaleString()}</span>
            <span className="recibos-etiqueta-estadistica">Total</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="recibos-controles">
        <div className="recibos-seccion-izquierda">
          <div className="recibos-control-registros">
            <label htmlFor="registros">Mostrar</label>
            <select
              id="registros"
              value={registrosPorPagina}
              onChange={manejarCambioRegistros}
              className="recibos-selector-registros"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>registros</span>
          </div>

          <div className="recibos-filtro-estado">
            <label htmlFor="filtro-vista">Vista:</label>
            <select
              id="filtro-vista"
              value={vistaActual}
              onChange={onCambiarVista}
              className="recibos-selector-filtro"
            >
              <option value="pagos">Gestión de Pagos</option>
              <option value="abonos">Pagos por Abonos</option>
              <option value="recibos">Gestión de Recibos</option>
              <option value="facturas">Gestión de Facturas</option>
            </select>
          </div>
        </div>

        <div className="recibos-seccion-derecha">
          <div className="recibos-control-busqueda">
            <input
              type="text"
              placeholder="Buscar cliente, recibo..."
              value={terminoBusqueda}
              onChange={manejarBusqueda}
              className="recibos-entrada-buscar"
            />
            <Search className="recibos-icono-buscar" size={18} />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="recibos-contenedor-tabla">
        {datosPaginados.length === 0 ? (
          <div className="recibos-estado-vacio">
            <div className="recibos-icono-vacio">
              <FileText size={64} />
            </div>
            <h3 className="recibos-mensaje-vacio">No se encontraron recibos</h3>
            <p className="recibos-submensaje-vacio">
              {terminoBusqueda
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'No hay recibos registrados en el sistema'}
            </p>
          </div>
        ) : (
          <table className="recibos-tabla">
            <thead>
              <tr className="recibos-fila-encabezado">
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
                <tr key={recibo.id} className="recibos-fila-pago" style={{animationDelay: `${indice * 0.05}s`}}>
                  <td data-label="Recibo" className="recibos-columna-factura">{recibo.numeroRecibo}</td>
                  <td data-label="Cliente" className="recibos-columna-cliente">{recibo.cliente}</td>
                  <td data-label="Monto" className="recibos-columna-monto">{recibo.monto}</td>
                  <td data-label="Fecha">{recibo.fechaEmision}</td>
                  <td data-label="Concepto">
                    <div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={recibo.concepto}>
                      {recibo.concepto}
                    </div>
                  </td>
                  <td data-label="Método Pago">{recibo.metodoPago}</td>
                  <td data-label="Estado">
                    <span className={`recibos-badge-estado ${obtenerClaseEstado(recibo.estado)}`}>
                      <span className="recibos-indicador-estado"></span>
                      {recibo.estado}
                    </span>
                  </td>
                  <td data-label="Acciones" className="recibos-columna-acciones">
                    <div className="recibos-botones-accion">
                      <button 
                        className="recibos-boton-accion recibos-descargar" 
                        onClick={() => manejarAccion('descargar', recibo)} 
                        title="Descargar PDF"
                        disabled={cargando}
                      >
                        <Download size={14} />
                      </button>
                      <button 
                        className="recibos-boton-accion recibos-imprimir" 
                        onClick={() => manejarAccion('imprimir', recibo)} 
                        title="Imprimir recibo"
                        disabled={cargando}
                      >
                        <Printer size={14} />
                      </button>
                      <button 
                        className="recibos-boton-accion recibos-eliminar" 
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
        <div className="recibos-pie-tabla">
          <div className="recibos-informacion-registros">
            Mostrando <strong>{indiceInicio + 1}</strong> a <strong>{Math.min(indiceFinal, totalRegistros)}</strong> de <strong>{totalRegistros}</strong> registros
            {terminoBusqueda && (
              <span style={{color: '#6b7280', marginLeft: '0.5rem'}}>
                (filtrado de {datosRecibos.length} registros totales)
              </span>
            )}
          </div>

          <div className="recibos-controles-paginacion">
            <button
              className="recibos-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1 || cargando}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="recibos-numeros-paginacion">
              {generarNumerosPaginacion().map((numero, indice) => (
                numero === '...' ? (
                  <span key={`ellipsis-${indice}`} style={{padding: '0.5rem', color: '#9ca3af'}}>
                    ...
                  </span>
                ) : (
                  <button
                    key={numero}
                    className={`recibos-numero-pagina ${paginaActual === numero ? 'recibos-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                    disabled={cargando}
                  >
                    {numero}
                  </button>
                )
              ))}
            </div>

            <button
              className="recibos-boton-paginacion"
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