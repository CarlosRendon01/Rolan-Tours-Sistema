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
import './TablaAbonos.css';


const TablaAbonos = ({ vistaActual, onCambiarVista }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // Estados para modales
  const [modalNuevoPagoAbierto, setModalNuevoPagoAbierto] = useState(false);
  const [modalAgregarAbonoAbierto, setModalAgregarAbonoAbierto] = useState(false);
  const [modalVerPagoAbierto, setModalVerPagoAbierto] = useState(false);
  const [modalEditarPagoAbierto, setModalEditarPagoAbierto] = useState(false);
  const [modalReciboAbierto, setModalReciboAbierto] = useState(false);
  const [modalFacturaAbierto, setModalFacturaAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  // Datos actualizados con nueva estructura
  const datosAbonos = [
    {
      id: 1,
      cliente: {
        id: 123,
        nombre: 'Roberto Sánchez Morales',
        email: 'roberto@example.com'
      },
      servicio: {
        tipo: 'Tour Arqueológico',
        descripcion: 'Monte Albán + Hierve el Agua',
        fechaTour: '2025-11-15'
      },
      planPago: {
        montoTotal: 30000,
        abonosPlaneados: 5,
        abonoMinimo: 6000,
        montoPagado: 18000,
        saldoPendiente: 12000,
        abonosRealizados: 3
      },
      historialAbonos: [
        { numeroAbono: 1, monto: 6000, fecha: '2025-09-15', metodoPago: 'Transferencia' },
        { numeroAbono: 2, monto: 6000, fecha: '2025-09-22', metodoPago: 'Efectivo' },
        { numeroAbono: 3, monto: 6000, fecha: '2025-09-29', metodoPago: 'Tarjeta' }
      ],
      estado: 'EN_PROCESO',
      proximoVencimiento: '2025-10-25',
      numeroContrato: 'CONT-001',
      facturaGenerada: false,
      fechaCreacion: '2025-09-15'
    },
    {
      id: 2,
      cliente: {
        id: 124,
        nombre: 'Diana Torres Vega',
        email: 'diana@example.com'
      },
      servicio: {
        tipo: 'Tour Gastronómico',
        descripcion: 'Ruta del Mezcal',
        fechaTour: '2025-10-20'
      },
      planPago: {
        montoTotal: 15000,
        abonosPlaneados: 4,
        abonoMinimo: 3750,
        montoPagado: 9000,
        saldoPendiente: 6000,
        abonosRealizados: 2
      },
      historialAbonos: [
        { numeroAbono: 1, monto: 4500, fecha: '2025-09-10', metodoPago: 'Tarjeta' },
        { numeroAbono: 2, monto: 4500, fecha: '2025-09-18', metodoPago: 'Transferencia' }
      ],
      estado: 'EN_PROCESO',
      proximoVencimiento: '2025-10-18',
      numeroContrato: 'CONT-002',
      facturaGenerada: false,
      fechaCreacion: '2025-09-10'
    },
    {
      id: 3,
      cliente: {
        id: 125,
        nombre: 'Fernando Ramírez Cruz',
        email: 'fernando@example.com'
      },
      servicio: {
        tipo: 'Tour Ecoturístico',
        descripcion: 'Pueblos Mancomunados',
        fechaTour: '2025-11-30'
      },
      planPago: {
        montoTotal: 45000,
        abonosPlaneados: 5,
        abonoMinimo: 9000,
        montoPagado: 27000,
        saldoPendiente: 18000,
        abonosRealizados: 3
      },
      historialAbonos: [
        { numeroAbono: 1, monto: 9000, fecha: '2025-09-12', metodoPago: 'Efectivo' },
        { numeroAbono: 2, monto: 9000, fecha: '2025-09-22', metodoPago: 'Transferencia' },
        { numeroAbono: 3, monto: 9000, fecha: '2025-09-29', metodoPago: 'Tarjeta' }
      ],
      estado: 'EN_PROCESO',
      proximoVencimiento: '2025-11-22',
      numeroContrato: 'CONT-003',
      facturaGenerada: false,
      fechaCreacion: '2025-09-12'
    },
    {
      id: 4,
      cliente: {
        id: 126,
        nombre: 'Andrea Jiménez López',
        email: 'andrea@example.com'
      },
      servicio: {
        tipo: 'Tour Cultural',
        descripcion: 'Artesanías de Oaxaca',
        fechaTour: '2025-10-15'
      },
      planPago: {
        montoTotal: 20000,
        abonosPlaneados: 4,
        abonoMinimo: 5000,
        montoPagado: 20000,
        saldoPendiente: 0,
        abonosRealizados: 4
      },
      historialAbonos: [
        { numeroAbono: 1, monto: 5000, fecha: '2025-09-05', metodoPago: 'Transferencia' },
        { numeroAbono: 2, monto: 5000, fecha: '2025-09-15', metodoPago: 'Efectivo' },
        { numeroAbono: 3, monto: 5000, fecha: '2025-09-20', metodoPago: 'Tarjeta' },
        { numeroAbono: 4, monto: 5000, fecha: '2025-09-25', metodoPago: 'Transferencia' }
      ],
      estado: 'FINALIZADO',
      proximoVencimiento: 'Finalizado',
      numeroContrato: 'CONT-004',
      facturaGenerada: true,
      fechaCreacion: '2025-09-05',
      fechaFinalizacion: '2025-09-25'
    }
  ];

  // Estadísticas
  const estadisticas = useMemo(() => {
    const totalClientes = datosAbonos.length;
    const proximosVencer = datosAbonos.filter(abono => {
      if (abono.estado === 'FINALIZADO') return false;
      const fechaVencimiento = new Date(abono.proximoVencimiento);
      const hoy = new Date();
      const diferenciaEnDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
      return diferenciaEnDias <= 7 && diferenciaEnDias >= 0;
    }).length;
    const enProceso = datosAbonos.filter(abono => abono.estado === 'EN_PROCESO').length;
    const finalizados = datosAbonos.filter(abono => abono.estado === 'FINALIZADO').length;
    
    return { totalClientes, proximosVencer, enProceso, finalizados };
  }, []);

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    return datosAbonos.filter(abono => {
      const cumpleBusqueda = 
        abono.cliente.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        abono.id.toString().includes(terminoBusqueda) ||
        abono.numeroContrato.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        abono.servicio.tipo.toLowerCase().includes(terminoBusqueda.toLowerCase());

      return cumpleBusqueda;
    });
  }, [terminoBusqueda]);

  // Paginación
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

  // Funciones para abrir modales
  const abrirModalNuevoPago = () => {
    setModalNuevoPagoAbierto(true);
  };

  const abrirModalAgregarAbono = (pago) => {
    setPagoSeleccionado(pago);
    setModalAgregarAbonoAbierto(true);
  };

  const abrirModalVerPago = (pago) => {
    setPagoSeleccionado(pago);
    setModalVerPagoAbierto(true);
  };

  const abrirModalEditarPago = (pago) => {
    setPagoSeleccionado(pago);
    setModalEditarPagoAbierto(true);
  };

  const abrirModalRecibo = (pago) => {
    setPagoSeleccionado(pago);
    setModalReciboAbierto(true);
  };

  const abrirModalFactura = (pago) => {
    setPagoSeleccionado(pago);
    setModalFacturaAbierto(true);
  };

  const abrirModalEliminar = (pago) => {
    setPagoSeleccionado(pago);
    setModalEliminarAbierto(true);
  };

  // Manejador de acciones
  const manejarAccion = async (accion, pago) => {
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    switch (accion) {
      case 'ver':
        abrirModalVerPago(pago);
        break;
      case 'agregarAbono':
        abrirModalAgregarAbono(pago);
        break;
      case 'editar':
        abrirModalEditarPago(pago);
        break;
      case 'generarRecibo':
        abrirModalRecibo(pago);
        break;
      case 'generarFactura':
        abrirModalFactura(pago);
        break;
      case 'eliminar':
        abrirModalEliminar(pago);
        break;
      default:
        break;
    }
    
    setCargando(false);
  };

  const calcularProgreso = (montoPagado, montoTotal) => {
    return Math.round((montoPagado / montoTotal) * 100);
  };

  const obtenerEstadoContrato = (pago) => {
    if (pago.estado === 'FINALIZADO') {
      return { texto: 'Finalizado', clase: 'abonos-estado-pagado' };
    }
    
    const fechaVencimiento = new Date(pago.proximoVencimiento);
    const hoy = new Date();
    const diferenciaEnDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    
    if (diferenciaEnDias < 0) {
      return { texto: 'Vencido', clase: 'abonos-estado-vencido' };
    } else if (diferenciaEnDias <= 7) {
      return { texto: 'Próximo Vencer', clase: 'abonos-estado-pendiente' };
    } else {
      return { texto: 'En Proceso', clase: 'abonos-estado-pendiente' };
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
    <div className={`abonos-contenedor-principal ${cargando ? 'abonos-cargando' : ''}`}>
      {/* Header */}
      <div className="abonos-encabezado">
        <div className="abonos-seccion-logo">
          <div className="abonos-icono-principal">
            <Coins size={24} />
          </div>
          <div>
            <h1 className="abonos-titulo">Pagos por Abonos</h1>
            <p className="abonos-subtitulo">Gestión de pagos parciales para servicios de tours</p>
          </div>
        </div>

        <div className="abonos-estadisticas-header">
          <div className="abonos-tarjeta-estadistica total">
            <BarChart3 className="abonos-icono-estadistica" size={20} />
            <span className="abonos-valor-estadistica">{estadisticas.totalClientes}</span>
            <span className="abonos-etiqueta-estadistica">Clientes</span>
          </div>
          <div className="abonos-tarjeta-estadistica pendientes">
            <Clock className="abonos-icono-estadistica" size={20} />
            <span className="abonos-valor-estadistica">{estadisticas.enProceso}</span>
            <span className="abonos-etiqueta-estadistica">En Proceso</span>
          </div>
          <div className="abonos-tarjeta-estadistica vencidos">
            <AlertCircle className="abonos-icono-estadistica" size={20} />
            <span className="abonos-valor-estadistica">{estadisticas.proximosVencer}</span>
            <span className="abonos-etiqueta-estadistica">Próximos Vencer</span>
          </div>
          <div className="abonos-tarjeta-estadistica pagados">
            <Coins className="abonos-icono-estadistica" size={20} />
            <span className="abonos-valor-estadistica">{estadisticas.finalizados}</span>
            <span className="abonos-etiqueta-estadistica">Finalizados</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="abonos-controles">
        <div className="abonos-seccion-izquierda">
          <div className="abonos-control-registros">
            <label htmlFor="registros">Mostrar</label>
            <select
              id="registros"
              value={registrosPorPagina}
              onChange={manejarCambioRegistros}
              className="abonos-selector-registros"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>registros</span>
          </div>

          <div className="abonos-filtro-estado">
            <Filter size={16} />
            <label htmlFor="filtro-vista">Vista:</label>
            <select
              id="filtro-vista"
              value={vistaActual}
              onChange={onCambiarVista}
              className="abonos-selector-filtro"
            >
              <option value="pagos">Gestión de Pagos</option>
              <option value="abonos">Pagos por Abonos</option>
              <option value="recibos">Gestión de Recibos</option>
              <option value="facturas">Gestión de Facturas</option>
            </select>
          </div>
        </div>

        <div className="abonos-seccion-derecha">
          <button
            className="abonos-boton-agregar"
            onClick={abrirModalNuevoPago}
            title="Registrar nuevo pago por abonos"
            disabled={cargando}
          >
            <Plus size={18} />
            <span>Nuevo Pago</span>
          </button>

          <div className="abonos-control-busqueda">
            <input
              type="text"
              id="buscar"
              placeholder="Buscar cliente, contrato, servicio..."
              value={terminoBusqueda}
              onChange={manejarBusqueda}
              className="abonos-entrada-buscar"
            />
            <Search className="abonos-icono-buscar" size={18} />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="abonos-contenedor-tabla">
        {datosPaginados.length === 0 ? (
          <div className="abonos-estado-vacio">
            <div className="abonos-icono-vacio">
              <FileText size={64} />
            </div>
            <h3 className="abonos-mensaje-vacio">No se encontraron pagos</h3>
            <p className="abonos-submensaje-vacio">
              {terminoBusqueda
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'No hay pagos por abonos registrados en el sistema'}
            </p>
          </div>
        ) : (
          <table className="abonos-tabla">
            <thead>
              <tr className="abonos-fila-encabezado">
                <th>ID</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Progreso</th>
                <th>Último Abono</th>
                <th>Próximo Venc.</th>
                <th>Contrato</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((pago, indice) => {
                const progreso = calcularProgreso(pago.planPago.montoPagado, pago.planPago.montoTotal);
                const estadoContrato = obtenerEstadoContrato(pago);
                const ultimoAbono = pago.historialAbonos[pago.historialAbonos.length - 1];
                
                return (
                  <tr key={pago.id} className="abonos-fila-pago" style={{animationDelay: `${indice * 0.05}s`}}>
                    <td data-label="ID" className="abonos-columna-id">#{pago.id.toString().padStart(3, '0')}</td>
                    <td data-label="Cliente" className="abonos-columna-cliente">{pago.cliente.nombre}</td>
                    <td data-label="Servicio">
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        <span style={{fontWeight: '600', fontSize: '0.875rem'}}>{pago.servicio.tipo}</span>
                        <span style={{fontSize: '0.75rem', color: '#6b7280'}}>{pago.servicio.descripcion}</span>
                      </div>
                    </td>
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
                          ${pago.planPago.montoPagado.toLocaleString()} / ${pago.planPago.montoTotal.toLocaleString()}
                        </div>
                        <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                          {pago.planPago.abonosRealizados} de {pago.planPago.abonosPlaneados} abonos
                        </div>
                      </div>
                    </td>
                    <td data-label="Último Abono">
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        <span className="abonos-columna-monto">${ultimoAbono.monto.toLocaleString()}</span>
                        <span style={{fontSize: '0.75rem', color: '#6b7280'}}>{ultimoAbono.fecha}</span>
                      </div>
                    </td>
                    <td data-label="Próximo Venc.">
                      {pago.proximoVencimiento === 'Finalizado' ? (
                        <span style={{color: '#10b981', fontWeight: '600'}}>Finalizado</span>
                      ) : (
                        <span>{pago.proximoVencimiento}</span>
                      )}
                    </td>
                    <td data-label="Contrato" className="abonos-columna-factura">{pago.numeroContrato}</td>
                    <td data-label="Estado">
                      <span className={`abonos-badge-estado ${estadoContrato.clase}`}>
                        <span className="abonos-indicador-estado"></span>
                        {estadoContrato.texto}
                      </span>
                    </td>
                    <td data-label="Acciones" className="abonos-columna-acciones">
                      <div className="abonos-botones-accion">
                        <button 
                          className="abonos-boton-accion abonos-ver" 
                          onClick={() => manejarAccion('ver', pago)} 
                          title="Ver historial de abonos"
                          disabled={cargando}
                        >
                          <Eye size={14} />
                        </button>
                        {pago.estado !== 'FINALIZADO' && (
                          <button 
                            className="abonos-boton-accion abonos-agregar" 
                            onClick={() => manejarAccion('agregarAbono', pago)} 
                            title="Agregar nuevo abono"
                            disabled={cargando}
                            style={{background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0'}}
                          >
                            <Plus size={14} />
                          </button>
                        )}
                        <button 
                          className="abonos-boton-accion abonos-editar" 
                          onClick={() => manejarAccion('editar', pago)} 
                          title={pago.estado === 'FINALIZADO' ? 'No se puede editar (finalizado)' : 'Editar pago'}
                          disabled={cargando || pago.estado === 'FINALIZADO'}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="abonos-boton-accion abonos-recibo" 
                          onClick={() => manejarAccion('generarRecibo', pago)} 
                          title="Generar recibo de pago"
                          disabled={cargando}
                          style={{background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe'}}
                        >
                          <Receipt size={14} />
                        </button>
                        <button 
                          className="abonos-boton-accion abonos-factura" 
                          onClick={() => manejarAccion('generarFactura', pago)} 
                          title="Generar factura"
                          disabled={cargando}
                          style={{background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe'}}
                        >
                          <FileText size={14} />
                        </button>
                        <button 
                          className="abonos-boton-accion abonos-eliminar" 
                          onClick={() => manejarAccion('eliminar', pago)} 
                          title="Eliminar pago"
                          disabled={cargando}
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
        <div className="abonos-pie-tabla">
          <div className="abonos-informacion-registros">
            Mostrando <strong>{indiceInicio + 1}</strong> a <strong>{Math.min(indiceFinal, totalRegistros)}</strong> de <strong>{totalRegistros}</strong> registros
            {terminoBusqueda && (
              <span style={{color: '#6b7280', marginLeft: '0.5rem'}}>
                (filtrado de {datosAbonos.length} registros totales)
              </span>
            )}
          </div>

          <div className="abonos-controles-paginacion">
            <button
              className="abonos-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1 || cargando}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="abonos-numeros-paginacion">
              {generarNumerosPaginacion().map((numero, indice) => (
                numero === '...' ? (
                  <span key={`ellipsis-${indice}`} style={{padding: '0.5rem', color: '#9ca3af'}}>
                    ...
                  </span>
                ) : (
                  <button
                    key={numero}
                    className={`abonos-numero-pagina ${paginaActual === numero ? 'abonos-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                    disabled={cargando}
                  >
                    {numero}
                  </button>
                )
              ))}
            </div>

            <button
              className="abonos-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas || cargando}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Indicadores de modales (para desarrollo futuro) */}
      {modalNuevoPagoAbierto && (
        <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000}}>
          Modal Nuevo Pago (en desarrollo)
          <button onClick={() => setModalNuevoPagoAbierto(false)} style={{marginLeft: '1rem', background: 'white', color: '#3b82f6', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer'}}>
            Cerrar
          </button>
        </div>
      )}
      
      {modalAgregarAbonoAbierto && pagoSeleccionado && (
        <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000}}>
          Modal Agregar Abono - {pagoSeleccionado.cliente.nombre}
          <button onClick={() => setModalAgregarAbonoAbierto(false)} style={{marginLeft: '1rem', background: 'white', color: '#10b981', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer'}}>
            Cerrar
          </button>
        </div>
      )}
      
      {modalVerPagoAbierto && pagoSeleccionado && (
        <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#0369a1', color: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000}}>
          Modal Ver Pago - {pagoSeleccionado.cliente.nombre}
          <button onClick={() => setModalVerPagoAbierto(false)} style={{marginLeft: '1rem', background: 'white', color: '#0369a1', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer'}}>
            Cerrar
          </button>
        </div>
      )}
      
      {modalEditarPagoAbierto && pagoSeleccionado && (
        <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#f59e0b', color: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000}}>
          Modal Editar Pago - {pagoSeleccionado.cliente.nombre}
          <button onClick={() => setModalEditarPagoAbierto(false)} style={{marginLeft: '1rem', background: 'white', color: '#f59e0b', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer'}}>
            Cerrar
          </button>
        </div>
      )}
      
      {modalReciboAbierto && pagoSeleccionado && (
        <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#1e40af', color: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000}}>
          Modal Generar Recibo - {pagoSeleccionado.cliente.nombre}
          <button onClick={() => setModalReciboAbierto(false)} style={{marginLeft: '1rem', background: 'white', color: '#1e40af', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer'}}>
            Cerrar
          </button>
        </div>
      )}
      
      {modalFacturaAbierto && pagoSeleccionado && (
        <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#4338ca', color: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000}}>
          Modal Generar Factura - {pagoSeleccionado.cliente.nombre}
          <button onClick={() => setModalFacturaAbierto(false)} style={{marginLeft: '1rem', background: 'white', color: '#4338ca', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer'}}>
            Cerrar
          </button>
        </div>
      )}
      
      {modalEliminarAbierto && pagoSeleccionado && (
        <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#dc2626', color: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000}}>
          Modal Eliminar Pago - {pagoSeleccionado.cliente.nombre}
          <button onClick={() => setModalEliminarAbierto(false)} style={{marginLeft: '1rem', background: 'white', color: '#dc2626', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer'}}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default TablaAbonos;