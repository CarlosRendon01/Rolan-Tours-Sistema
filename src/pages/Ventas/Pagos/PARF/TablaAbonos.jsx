import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Edit, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Coins, 
  Plus,
  Receipt,
  BarChart3,
  Clock,
  AlertCircle,
  FileText,
  Filter
} from 'lucide-react';
import '../TablaPagos.css';

const TablaAbonos = ({ vistaActual, onCambiarVista }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // Datos de ejemplo para abonos
  const datosAbonos = [
    {
      id: 1,
      cliente: 'Roberto Sánchez Morales',
      montoTotal: 30000,
      montoPagado: 18000,
      ultimoAbono: 8000,
      fechaUltimoAbono: '20/09/2025',
      proximoVencimiento: '25/10/2025',
      numeroContrato: 'CONT-001',
      totalAbonos: 5,
      abonosRealizados: 3,
      concepto: 'Sistema de Marketing Digital'
    },
    {
      id: 2,
      cliente: 'Diana Torres Vega',
      montoTotal: 15000,
      montoPagado: 9000,
      ultimoAbono: 4500,
      fechaUltimoAbono: '18/09/2025',
      proximoVencimiento: '18/10/2025',
      numeroContrato: 'CONT-002',
      totalAbonos: 4,
      abonosRealizados: 2,
      concepto: 'Análisis de Mercado Empresarial'
    },
    {
      id: 3,
      cliente: 'Fernando Ramírez Cruz',
      montoTotal: 45000,
      montoPagado: 27000,
      ultimoAbono: 9000,
      fechaUltimoAbono: '22/09/2025',
      proximoVencimiento: '22/11/2025',
      numeroContrato: 'CONT-003',
      totalAbonos: 5,
      abonosRealizados: 3,
      concepto: 'Sistema ERP Personalizado'
    },
    {
      id: 4,
      cliente: 'Andrea Jiménez López',
      montoTotal: 20000,
      montoPagado: 20000,
      ultimoAbono: 5000,
      fechaUltimoAbono: '25/09/2025',
      proximoVencimiento: 'Finalizado',
      numeroContrato: 'CONT-004',
      totalAbonos: 4,
      abonosRealizados: 4,
      concepto: 'Auditoría Completa de Procesos'
    },
    {
      id: 5,
      cliente: 'Miguel Angel Hernández',
      montoTotal: 12000,
      montoPagado: 4000,
      ultimoAbono: 4000,
      fechaUltimoAbono: '10/09/2025',
      proximoVencimiento: '10/10/2025',
      numeroContrato: 'CONT-005',
      totalAbonos: 3,
      abonosRealizados: 1,
      concepto: 'Capacitación en Ventas'
    },
    {
      id: 6,
      cliente: 'Patricia Morales Ruiz',
      montoTotal: 35000,
      montoPagado: 14000,
      ultimoAbono: 7000,
      fechaUltimoAbono: '05/09/2025',
      proximoVencimiento: '05/10/2025',
      numeroContrato: 'CONT-006',
      totalAbonos: 5,
      abonosRealizados: 2,
      concepto: 'Transformación Digital'
    }
  ];

  // Cálculo de estadísticas
  const estadisticas = useMemo(() => {
    const totalClientes = datosAbonos.length;
    const proximosVencer = datosAbonos.filter(abono => {
      const fechaVencimiento = new Date(abono.proximoVencimiento);
      const hoy = new Date();
      const diferenciaEnDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
      return diferenciaEnDias <= 7 && diferenciaEnDias >= 0;
    }).length;
    const enProceso = datosAbonos.filter(abono => abono.montoPagado < abono.montoTotal).length;
    const finalizados = datosAbonos.filter(abono => abono.montoPagado >= abono.montoTotal).length;
    
    return { totalClientes, proximosVencer, enProceso, finalizados };
  }, []);

  // Filtrar datos según búsqueda
  const datosFiltrados = useMemo(() => {
    return datosAbonos.filter(abono => {
      const cumpleBusqueda = 
        abono.cliente.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        abono.id.toString().includes(terminoBusqueda) ||
        abono.numeroContrato.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        abono.concepto.toLowerCase().includes(terminoBusqueda.toLowerCase());

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

  const manejarAccion = async (accion, abono) => {
    setCargando(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (accion) {
      case 'ver':
        console.log('Ver abono:', abono);
        alert(`Visualizando contrato de: ${abono.cliente}\nProgreso: ${Math.round((abono.montoPagado / abono.montoTotal) * 100)}%`);
        break;
      case 'editar':
        console.log('Editar abono:', abono);
        alert(`Editando contrato de: ${abono.cliente}\nEsta funcionalidad abrirá el modal de edición`);
        break;
      case 'eliminar':
        console.log('Eliminar abono:', abono);
        if (window.confirm(`¿Estás seguro de eliminar este contrato de abonos?\n\nCliente: ${abono.cliente}\nMonto total: ${abono.montoTotal.toLocaleString()}\n\nEsta acción no se puede deshacer.`)) {
          alert('Contrato eliminado correctamente (funcionalidad de demo)');
        }
        break;
      case 'generarRecibo':
        console.log('Generar recibo:', abono);
        alert(`Generando recibo de abono para: ${abono.cliente}`);
        break;
      default:
        break;
    }
    
    setCargando(false);
  };

  const abrirModalAgregarAbono = () => {
    console.log('Agregar nuevo contrato de abonos');
    alert('Se abrirá el modal para agregar un nuevo contrato de abonos.');
  };

  const calcularProgreso = (montoPagado, montoTotal) => {
    return Math.round((montoPagado / montoTotal) * 100);
  };

  const obtenerEstadoContrato = (abono) => {
    if (abono.montoPagado >= abono.montoTotal) {
      return { texto: 'Finalizado', clase: 'pagos-estado-pagado' };
    }
    
    const fechaVencimiento = new Date(abono.proximoVencimiento);
    const hoy = new Date();
    const diferenciaEnDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    
    if (diferenciaEnDias < 0) {
      return { texto: 'Vencido', clase: 'pagos-estado-vencido' };
    } else if (diferenciaEnDias <= 7) {
      return { texto: 'Próximo Vencer', clase: 'pagos-estado-pendiente' };
    } else {
      return { texto: 'En Proceso', clase: 'pagos-estado-pendiente' };
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
            <Coins size={24} />
          </div>
          <div>
            <h1 className="pagos-titulo">Pagos por Abonos</h1>
            <p className="pagos-subtitulo">Seguimiento de pagos en exhibiciones</p>
          </div>
        </div>

        <div className="pagos-estadisticas-header">
          <div className="pagos-tarjeta-estadistica total">
            <BarChart3 className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.totalClientes}</span>
            <span className="pagos-etiqueta-estadistica">Clientes</span>
          </div>
          <div className="pagos-tarjeta-estadistica pendientes">
            <Clock className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.enProceso}</span>
            <span className="pagos-etiqueta-estadistica">En Proceso</span>
          </div>
          <div className="pagos-tarjeta-estadistica vencidos">
            <AlertCircle className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.proximosVencer}</span>
            <span className="pagos-etiqueta-estadistica">Próximos Vencer</span>
          </div>
          <div className="pagos-tarjeta-estadistica pagados">
            <Coins className="pagos-icono-estadistica" size={20} />
            <span className="pagos-valor-estadistica">{estadisticas.finalizados}</span>
            <span className="pagos-etiqueta-estadistica">Finalizados</span>
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
            onClick={abrirModalAgregarAbono}
            title="Agregar nuevo contrato de abonos"
            disabled={cargando}
          >
            <Plus size={18} />
            <span>Nuevo Contrato</span>
          </button>

          <div className="pagos-control-busqueda">
            <input
              type="text"
              id="buscar"
              placeholder="Buscar cliente, contrato..."
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
            <h3 className="pagos-mensaje-vacio">No se encontraron contratos</h3>
            <p className="pagos-submensaje-vacio">
              {terminoBusqueda
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'No hay contratos de abonos registrados en el sistema'}
            </p>
          </div>
        ) : (
          <table className="pagos-tabla">
            <thead>
              <tr className="pagos-fila-encabezado">
                <th>ID</th>
                <th>Cliente</th>
                <th>Progreso</th>
                <th>Último Abono</th>
                <th>Próximo Venc.</th>
                <th>Contrato</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((abono, indice) => {
                const progreso = calcularProgreso(abono.montoPagado, abono.montoTotal);
                const estadoContrato = obtenerEstadoContrato(abono);
                
                return (
                  <tr key={abono.id} className="pagos-fila-pago" style={{animationDelay: `${indice * 0.05}s`}}>
                    <td data-label="ID" className="pagos-columna-id">#{abono.id.toString().padStart(3, '0')}</td>
                    <td data-label="Cliente" className="pagos-columna-cliente">{abono.cliente}</td>
                    <td data-label="Progreso">
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                          <div style={{
                            width: '80px', 
                            height: '8px', 
                            background: '#f3f4f6', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${progreso}%`,
                              height: '100%',
                              background: progreso === 100 ? '#10b981' : '#3b82f6',
                              transition: 'width 0.3s'
                            }}></div>
                          </div>
                          <span style={{fontSize: '0.75rem', fontWeight: '600'}}>{progreso}%</span>
                        </div>
                        <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                          ${abono.montoPagado.toLocaleString()} / ${abono.montoTotal.toLocaleString()}
                        </div>
                        <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                          {abono.abonosRealizados} de {abono.totalAbonos} abonos
                        </div>
                      </div>
                    </td>
                    <td data-label="Último Abono">
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        <span className="pagos-columna-monto">${abono.ultimoAbono.toLocaleString()}</span>
                        <span style={{fontSize: '0.75rem', color: '#6b7280'}}>{abono.fechaUltimoAbono}</span>
                      </div>
                    </td>
                    <td data-label="Próximo Venc.">
                      {abono.proximoVencimiento === 'Finalizado' ? (
                        <span style={{color: '#10b981', fontWeight: '600'}}>Finalizado</span>
                      ) : (
                        <span>{abono.proximoVencimiento}</span>
                      )}
                    </td>
                    <td data-label="Contrato" className="pagos-columna-factura">{abono.numeroContrato}</td>
                    <td data-label="Estado">
                      <span className={`pagos-badge-estado ${estadoContrato.clase}`}>
                        <span className="pagos-indicador-estado"></span>
                        {estadoContrato.texto}
                      </span>
                    </td>
                    <td data-label="Acciones" className="pagos-columna-acciones">
                      <div className="pagos-botones-accion">
                        <button 
                          className="pagos-boton-accion pagos-ver" 
                          onClick={() => manejarAccion('ver', abono)} 
                          title="Ver detalles del contrato"
                        >
                          <Eye size={14} />
                        </button>
                        {abono.montoPagado < abono.montoTotal && (
                          <button 
                            className="pagos-boton-accion pagos-editar" 
                            onClick={() => manejarAccion('generarRecibo', abono)} 
                            title="Generar recibo de abono"
                          >
                            <Receipt size={14} />
                          </button>
                        )}
                        <button 
                          className="pagos-boton-accion pagos-editar" 
                          onClick={() => manejarAccion('editar', abono)} 
                          title="Editar contrato"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="pagos-boton-accion pagos-eliminar" 
                          onClick={() => manejarAccion('eliminar', abono)} 
                          title="Eliminar contrato"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                (filtrado de {datosAbonos.length} registros totales)
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

export default TablaAbonos;