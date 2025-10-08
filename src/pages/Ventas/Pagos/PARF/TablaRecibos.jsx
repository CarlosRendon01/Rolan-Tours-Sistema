import React, { useState, useMemo, useCallback } from 'react';
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
  FileText,
  AlertCircle,
  X,
  FileSpreadsheet,
  RefreshCw,
  Shield
} from 'lucide-react';
import './TablaRecibos.css';
import { generarPDFRecibo, imprimirRecibo } from '../ModalesRecibos/generarPDFRecibo';
import { modalEliminarRecibo } from '../ModalesRecibos/ModalEliminarRecibo';
import ModalRegenerarRecibo from '../ModalesRecibos/ModalRegenerarRecibo';
import ModalEliminarDefinitivo from '../ModalesRecibos/ModalEliminarDefinitivo';

const TablaRecibos = ({
  datosIniciales = [],
  vistaActual = 'recibos',
  onCambiarVista = () => { },
  onEliminar = null,
  onDescargar = null,
  onImprimir = null,
  rolUsuario = 'vendedor', // 'vendedor' o 'administrador'
  onRegenerar = null,
  onEliminarDefinitivo = null
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarEliminados, setMostrarEliminados] = useState(false);
  
  // Estados para modales
  const [modalRegenerarAbierto, setModalRegenerarAbierto] = useState(false);
  const [modalEliminarDefinitivoAbierto, setModalEliminarDefinitivoAbierto] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);

  // Datos de ejemplo mejorados
  const datosRecibosEjemplo = [
    {
      id: 1,
      numeroRecibo: 'REC-2025-001',
      cliente: 'Roberto Sánchez Morales',
      monto: 8000.00,
      fechaEmision: '2025-09-20',
      concepto: 'Abono 3/5 - Marketing Digital',
      metodoPago: 'Transferencia',
      estado: 'Emitido',
      eliminadoVisualmente: false
    },
    {
      id: 2,
      numeroRecibo: 'REC-2025-002',
      cliente: 'Diana Torres Vega',
      monto: 4500.00,
      fechaEmision: '2025-09-18',
      concepto: 'Abono 2/4 - Análisis de Mercado',
      metodoPago: 'Efectivo',
      estado: 'Emitido',
      eliminadoVisualmente: false
    },
    {
      id: 3,
      numeroRecibo: 'REC-2025-003',
      cliente: 'Fernando Ramírez Cruz',
      monto: 9000.00,
      fechaEmision: '2025-09-22',
      concepto: 'Abono 3/5 - Sistema ERP',
      metodoPago: 'Cheque',
      estado: 'Emitido',
      eliminadoVisualmente: true, // Eliminado por vendedor
      fechaEliminacion: '2025-09-25',
      eliminadoPor: 'Juan Pérez'
    },
    {
      id: 4,
      numeroRecibo: 'REC-2025-004',
      cliente: 'María González López',
      monto: 5500.00,
      fechaEmision: '2025-09-15',
      concepto: 'Abono 1/3 - Consultoría Fiscal',
      metodoPago: 'Transferencia',
      estado: 'Emitido',
      eliminadoVisualmente: false
    },
    {
      id: 5,
      numeroRecibo: 'REC-2025-005',
      cliente: 'Carlos Mendoza Ruiz',
      monto: 12000.00,
      fechaEmision: '2025-09-10',
      concepto: 'Pago completo - Desarrollo Web',
      metodoPago: 'Transferencia',
      estado: 'Cancelado',
      eliminadoVisualmente: false
    },
    {
      id: 6,
      numeroRecibo: 'REC-2025-006',
      cliente: 'Ana Patricia Flores',
      monto: 3200.00,
      fechaEmision: '2025-09-25',
      concepto: 'Abono 2/2 - Capacitación Personal',
      metodoPago: 'Efectivo',
      estado: 'Emitido',
      eliminadoVisualmente: true,
      fechaEliminacion: '2025-09-28',
      eliminadoPor: 'María Rodríguez'
    },
    {
      id: 7,
      numeroRecibo: 'REC-2025-007',
      cliente: 'Jorge Luis Martínez',
      monto: 7800.00,
      fechaEmision: '2025-09-28',
      concepto: 'Abono 4/6 - Auditoría Contable',
      metodoPago: 'Cheque',
      estado: 'Emitido',
      eliminadoVisualmente: false
    },
    {
      id: 8,
      numeroRecibo: 'REC-2025-008',
      cliente: 'Patricia Hernández Díaz',
      monto: 6500.00,
      fechaEmision: '2025-09-30',
      concepto: 'Abono 1/4 - Diseño Gráfico',
      metodoPago: 'Transferencia',
      estado: 'Emitido',
      eliminadoVisualmente: false
    },
    {
      id: 9,
      numeroRecibo: 'REC-2025-009',
      cliente: 'Luis Alberto Castro',
      monto: 15000.00,
      fechaEmision: '2025-08-12',
      concepto: 'Pago único - Asesoría Legal',
      metodoPago: 'Transferencia',
      estado: 'Cancelado',
      eliminadoVisualmente: false
    }
  ];

  const datosRecibos = datosIniciales.length > 0 ? datosIniciales : datosRecibosEjemplo;

  // Formatear moneda
  const formatearMoneda = useCallback((monto) => {
    if (typeof monto === 'string') {
      monto = parseFloat(monto.replace(/[$,]/g, ''));
    }
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto || 0);
  }, []);

  // Formatear fecha
  const formatearFecha = useCallback((fecha) => {
    try {
      const date = new Date(fecha);
      return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } catch {
      return fecha;
    }
  }, []);

  // Filtrar datos según rol y vista
  const datosSegunRol = useMemo(() => {
    if (rolUsuario === 'administrador') {
      // Administrador ve todos los recibos, pero puede filtrar eliminados
      if (mostrarEliminados) {
        return datosRecibos.filter(r => r.eliminadoVisualmente === true);
      }
      return datosRecibos;
    } else {
      // Vendedor solo ve recibos no eliminados
      return datosRecibos.filter(r => !r.eliminadoVisualmente);
    }
  }, [datosRecibos, rolUsuario, mostrarEliminados]);

  // Cálculo de estadísticas
  const estadisticas = useMemo(() => {
    const datos = rolUsuario === 'administrador' ? datosRecibos : datosSegunRol;
    const totalRecibos = datos.length;
    const emitidos = datos.filter(r => r.estado === 'Emitido' && !r.eliminadoVisualmente).length;
    const cancelados = datos.filter(r => r.estado === 'Cancelado' && !r.eliminadoVisualmente).length;
    const eliminados = datos.filter(r => r.eliminadoVisualmente === true).length;
    
    const montoTotal = datos.reduce((total, recibo) => {
      const monto = typeof recibo.monto === 'number' ? recibo.monto : parseFloat(recibo.monto?.replace(/[$,]/g, '') || 0);
      return total + monto;
    }, 0);

    const montoEmitidos = datos
      .filter(r => r.estado === 'Emitido' && !r.eliminadoVisualmente)
      .reduce((total, recibo) => {
        const monto = typeof recibo.monto === 'number' ? recibo.monto : parseFloat(recibo.monto?.replace(/[$,]/g, '') || 0);
        return total + monto;
      }, 0);

    return { totalRecibos, emitidos, cancelados, eliminados, montoTotal, montoEmitidos };
  }, [datosRecibos, datosSegunRol, rolUsuario]);

  // Filtrar datos según búsqueda
  const datosFiltrados = useMemo(() => {
    let datos = [...datosSegunRol];

    if (terminoBusqueda) {
      datos = datos.filter(recibo => {
        const searchTerm = terminoBusqueda.toLowerCase();
        return (
          recibo.cliente?.toLowerCase().includes(searchTerm) ||
          recibo.id?.toString().includes(searchTerm) ||
          recibo.numeroRecibo?.toLowerCase().includes(searchTerm) ||
          recibo.concepto?.toLowerCase().includes(searchTerm) ||
          recibo.metodoPago?.toLowerCase().includes(searchTerm)
        );
      });
    }

    return datos;
  }, [datosSegunRol, terminoBusqueda]);

  // Calcular paginación
  const totalRegistros = datosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / (registrosPorPagina || 1)));
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = Math.min(indiceInicio + registrosPorPagina, totalRegistros);
  const datosPaginados = datosFiltrados.slice(indiceInicio, indiceFinal);

  const cambiarPagina = useCallback((nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  }, [totalPaginas]);

  const manejarCambioRegistros = useCallback((evento) => {
    const valor = parseInt(evento.target.value) || 10;
    setRegistrosPorPagina(valor);
    setPaginaActual(1);
  }, []);

  const manejarBusqueda = useCallback((evento) => {
    setTerminoBusqueda(evento.target.value);
    setPaginaActual(1);
  }, []);

  const limpiarBusqueda = useCallback(() => {
    setTerminoBusqueda('');
    setPaginaActual(1);
  }, []);

  // Exportar a CSV
  const exportarCSV = useCallback(() => {
    try {
      const headers = ['Recibo', 'Cliente', 'Monto', 'Fecha', 'Concepto', 'Método Pago', 'Estado'];
      if (rolUsuario === 'administrador' && mostrarEliminados) {
        headers.push('Eliminado Por', 'Fecha Eliminación');
      }
      
      const csv = [
        headers.join(','),
        ...datosFiltrados.map(recibo => {
          const row = [
            recibo.numeroRecibo,
            `"${recibo.cliente}"`,
            typeof recibo.monto === 'number' ? recibo.monto : recibo.monto?.replace(/[$,]/g, ''),
            recibo.fechaEmision,
            `"${recibo.concepto}"`,
            recibo.metodoPago,
            recibo.estado
          ];
          
          if (rolUsuario === 'administrador' && mostrarEliminados) {
            row.push(recibo.eliminadoPor || '', recibo.fechaEliminacion || '');
          }
          
          return row.join(',');
        })
      ].join('\n');

      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `recibos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Error al exportar CSV');
      setTimeout(() => setError(null), 3000);
    }
  }, [datosFiltrados, rolUsuario, mostrarEliminados]);

  // Manejadores de modales
  const abrirModalRegenerar = (recibo) => {
    setReciboSeleccionado(recibo);
    setModalRegenerarAbierto(true);
  };

  const abrirModalEliminarDefinitivo = (recibo) => {
    setReciboSeleccionado(recibo);
    setModalEliminarDefinitivoAbierto(true);
  };

  const manejarRegenerar = async (recibo, motivo) => {
    if (onRegenerar) {
      await onRegenerar(recibo, motivo);
    } else {
      console.log('Recibo regenerado:', recibo.id, 'Motivo:', motivo);
    }
  };

  const manejarEliminarDefinitivo = async (recibo) => {
    if (onEliminarDefinitivo) {
      await onEliminarDefinitivo(recibo);
    } else {
      console.log('Recibo eliminado definitivamente:', recibo.id);
    }
  };

  const manejarAccion = useCallback(async (accion, recibo) => {
    setCargando(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      switch (accion) {
        case 'eliminar':
          // Eliminación visual para vendedores
          const confirmado = await modalEliminarRecibo(recibo, onEliminar);
          if (confirmado && !onEliminar) {
            console.log('Recibo eliminado visualmente:', recibo.id);
          }
          break;
        case 'descargar':
          if (onDescargar) {
            await onDescargar(recibo);
          } else {
            await generarPDFRecibo(recibo);
          }
          break;
        case 'imprimir':
          if (onImprimir) {
            await onImprimir(recibo);
          } else {
            imprimirRecibo(recibo);
          }
          break;
        default:
          break;
      }
    } catch (err) {
      setError(`Error al ${accion}: ${err.message}`);
      setTimeout(() => setError(null), 3000);
    } finally {
      setCargando(false);
    }
  }, [onEliminar, onDescargar, onImprimir]);

  const obtenerClaseEstado = useCallback((estado, eliminado) => {
    if (eliminado) {
      return 'recibos-estado-eliminado';
    }
    switch (estado?.toLowerCase()) {
      case 'emitido':
        return 'recibos-estado-emitido';
      case 'cancelado':
        return 'recibos-estado-cancelado';
      default:
        return 'recibos-estado-emitido';
    }
  }, []);

  const generarNumerosPaginacion = useCallback(() => {
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
  }, [totalPaginas, paginaActual]);

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
            <p className="recibos-subtitulo">
              Comprobantes de pago generados
              {rolUsuario === 'administrador' && (
                <span className="recibos-badge-admin">
                  <Shield size={14} />
                  Administrador
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="recibos-estadisticas-header">
          <div className="recibos-tarjeta-estadistica total">
            <BarChart3 className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">{estadisticas.totalRecibos}</span>
            <span className="recibos-etiqueta-estadistica">Total Recibos</span>
          </div>
          <div className="recibos-tarjeta-estadistica pagados">
            <CheckCircle className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">{estadisticas.emitidos}</span>
            <span className="recibos-etiqueta-estadistica">Emitidos</span>
          </div>
          <div className="recibos-tarjeta-estadistica cancelados">
            <Clock className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">{estadisticas.cancelados}</span>
            <span className="recibos-etiqueta-estadistica">Cancelados</span>
          </div>
          {rolUsuario === 'administrador' && (
            <div className="recibos-tarjeta-estadistica eliminados">
              <Trash2 className="recibos-icono-estadistica" size={20} />
              <span className="recibos-valor-estadistica">{estadisticas.eliminados}</span>
              <span className="recibos-etiqueta-estadistica">Eliminados</span>
            </div>
          )}
          <div className="recibos-tarjeta-estadistica monto-emitido">
            <Receipt className="recibos-icono-estadistica" size={20} />
            <span className="recibos-valor-estadistica">{formatearMoneda(estadisticas.montoEmitidos)}</span>
            <span className="recibos-etiqueta-estadistica">Monto Emitido</span>
          </div>
        </div>
      </div>

      {/* Alerta de Error */}
      {error && (
        <div className="recibos-alerta-error" role="alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

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
              aria-label="Registros por página"
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
              aria-label="Cambiar vista"
            >
              <option value="pagos">Gestión de Pagos</option>
              <option value="abonos">Pagos por Abonos</option>
              <option value="recibos">Gestión de Recibos</option>
              <option value="facturas">Gestión de Facturas</option>
            </select>
          </div>

          {/* Filtro para administrador */}
          {rolUsuario === 'administrador' && (
            <div className="recibos-filtro-eliminados">
              <label className="recibos-switch">
                <input
                  type="checkbox"
                  checked={mostrarEliminados}
                  onChange={(e) => {
                    setMostrarEliminados(e.target.checked);
                    setPaginaActual(1);
                  }}
                />
                <span className="recibos-slider"></span>
                <span className="recibos-label-text">Ver solo eliminados</span>
              </label>
            </div>
          )}
        </div>

        <div className="recibos-seccion-derecha">
          <div className="recibos-control-busqueda">
            <input
              type="text"
              placeholder="Buscar cliente, recibo, concepto..."
              value={terminoBusqueda}
              onChange={manejarBusqueda}
              className="recibos-entrada-buscar"
              aria-label="Buscar recibos"
            />
            <Search className="recibos-icono-buscar" size={18} />
            {terminoBusqueda && (
              <button
                className="recibos-boton-limpiar"
                onClick={limpiarBusqueda}
                aria-label="Limpiar búsqueda"
                title="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            className="recibos-boton-exportar"
            onClick={exportarCSV}
            aria-label="Exportar a CSV"
            title="Exportar datos a CSV"
          >
            <FileSpreadsheet size={18} />
            Exportar CSV
          </button>
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
                : mostrarEliminados
                ? 'No hay recibos eliminados en el sistema'
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
                {rolUsuario === 'administrador' && mostrarEliminados && (
                  <>
                    <th>Eliminado Por</th>
                    <th>Fecha Eliminación</th>
                  </>
                )}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosPaginados.map((recibo, indice) => (
                <tr 
                  key={recibo.id} 
                  className={`recibos-fila-pago ${recibo.eliminadoVisualmente ? 'recibos-fila-eliminada' : ''}`}
                  style={{ animationDelay: `${indice * 0.05}s` }}
                >
                  <td data-label="Recibo" className="recibos-columna-factura">{recibo.numeroRecibo}</td>
                  <td data-label="Cliente" className="recibos-columna-cliente">{recibo.cliente}</td>
                  <td data-label="Monto" className="recibos-columna-monto">{formatearMoneda(recibo.monto)}</td>
                  <td data-label="Fecha">{formatearFecha(recibo.fechaEmision)}</td>
                  <td data-label="Concepto">
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={recibo.concepto}>
                      {recibo.concepto}
                    </div>
                  </td>
                  <td data-label="Método Pago">{recibo.metodoPago}</td>
                  <td data-label="Estado">
                    <span className={`recibos-badge-estado ${obtenerClaseEstado(recibo.estado, recibo.eliminadoVisualmente)}`}>
                      <span className="recibos-indicador-estado"></span>
                      {recibo.eliminadoVisualmente ? 'Eliminado' : recibo.estado}
                    </span>
                  </td>
                  {rolUsuario === 'administrador' && mostrarEliminados && (
                    <>
                      <td data-label="Eliminado Por">{recibo.eliminadoPor || '-'}</td>
                      <td data-label="Fecha Eliminación">{recibo.fechaEliminacion ? formatearFecha(recibo.fechaEliminacion) : '-'}</td>
                    </>
                  )}
                  <td data-label="Acciones" className="recibos-columna-acciones">
                    <div className="recibos-botones-accion">
                      {recibo.eliminadoVisualmente && rolUsuario === 'administrador' ? (
                        // Botones para recibos eliminados (solo administrador)
                        <>
                          <button
                            className="recibos-boton-accion recibos-regenerar"
                            onClick={() => abrirModalRegenerar(recibo)}
                            title="Regenerar recibo"
                            aria-label={`Regenerar recibo ${recibo.numeroRecibo}`}
                            disabled={cargando}
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            className="recibos-boton-accion recibos-eliminar-definitivo"
                            onClick={() => abrirModalEliminarDefinitivo(recibo)}
                            title="Eliminar definitivamente"
                            aria-label={`Eliminar definitivamente ${recibo.numeroRecibo}`}
                            disabled={cargando}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        // Botones normales para recibos activos
                        <>
                          <button
                            className="recibos-boton-accion recibos-descargar"
                            onClick={() => manejarAccion('descargar', recibo)}
                            title="Descargar PDF"
                            aria-label={`Descargar recibo ${recibo.numeroRecibo}`}
                            disabled={cargando}
                          >
                            <Download size={14} />
                          </button>
                          <button
                            className="recibos-boton-accion recibos-imprimir"
                            onClick={() => manejarAccion('imprimir', recibo)}
                            title="Imprimir recibo"
                            aria-label={`Imprimir recibo ${recibo.numeroRecibo}`}
                            disabled={cargando}
                          >
                            <Printer size={14} />
                          </button>
                          <button
                            className="recibos-boton-accion recibos-eliminar"
                            onClick={() => manejarAccion('eliminar', recibo)}
                            title={rolUsuario === 'administrador' ? 'Eliminar definitivamente' : 'Eliminar recibo'}
                            aria-label={`Eliminar recibo ${recibo.numeroRecibo}`}
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

      {/* Paginación */}
      {datosPaginados.length > 0 && (
        <div className="recibos-pie-tabla">
          <div className="recibos-informacion-registros">
            Mostrando <strong>{indiceInicio + 1}</strong> a <strong>{indiceFinal}</strong> de <strong>{totalRegistros}</strong> registros
            {terminoBusqueda && (
              <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>
                (filtrado de {datosRecibos.length} registros totales)
              </span>
            )}
          </div>

          <div className="recibos-controles-paginacion">
            <button
              className="recibos-boton-paginacion"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1 || cargando}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="recibos-numeros-paginacion">
              {generarNumerosPaginacion().map((numero, indice) => (
                numero === '...' ? (
                  <span key={`ellipsis-${indice}`} style={{ padding: '0.5rem', color: '#9ca3af' }} aria-hidden="true">
                    ...
                  </span>
                ) : (
                  <button
                    key={numero}
                    className={`recibos-numero-pagina ${paginaActual === numero ? 'recibos-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                    disabled={cargando}
                    aria-label={`Página ${numero}`}
                    aria-current={paginaActual === numero ? 'page' : undefined}
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
              aria-label="Página siguiente"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modales */}
      <ModalRegenerarRecibo
        recibo={reciboSeleccionado}
        onConfirmar={manejarRegenerar}
        onCerrar={() => {
          setModalRegenerarAbierto(false);
          setReciboSeleccionado(null);
        }}
        isOpen={modalRegenerarAbierto}
      />

      <ModalEliminarDefinitivo
        recibo={reciboSeleccionado}
        onConfirmar={manejarEliminarDefinitivo}
        onCerrar={() => {
          setModalEliminarDefinitivoAbierto(false);
          setReciboSeleccionado(null);
        }}
        isOpen={modalEliminarDefinitivoAbierto}
      />
    </div>
  );
};

export default TablaRecibos;