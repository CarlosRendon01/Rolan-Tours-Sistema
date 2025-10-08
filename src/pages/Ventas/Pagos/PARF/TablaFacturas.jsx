import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Send,
  BarChart3,
  CheckCircle,
  DollarSign,
  Filter,
  XCircle,
  Trash2,
  RefreshCw,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import './TablaFacturas.css';
import { generarPDFFacturaTimbrada, imprimirFacturaTimbrada } from '../ModalesFactura/generarPDFFacturaTimbrada';
import { modalEliminarFactura } from '../ModalesFactura/ModalEliminarFactura';
import ModalRegenerarFactura from '../ModalesFactura/ModalRegenerarFactura';
import ModalEliminarDefinitivoFactura from '../ModalesFactura/ModalEliminarDefinitivoFactura';

// Constantes para estados de factura
const ESTADOS_FACTURA = {
  TIMBRADA: 'Timbrada',
  CANCELADA: 'Cancelada'
};

const TablaFacturas = ({ 
  vistaActual, 
  onCambiarVista,
  datosIniciales = [],
  rolUsuario = 'vendedor', // 'vendedor' o 'administrador'
  onEliminar = null,
  onRegenerar = null,
  onEliminarDefinitivo = null
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [cargando, setCargando] = useState(false);
  const [mostrarEliminados, setMostrarEliminados] = useState(false);
  
  // Estados para modales
  const [modalRegenerarAbierto, setModalRegenerarAbierto] = useState(false);
  const [modalEliminarDefinitivoAbierto, setModalEliminarDefinitivoAbierto] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  // Datos de ejemplo para facturas
  const datosFacturasEjemplo = [
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
      fechaEnvio: '15/09/2025',
      eliminadoVisualmente: false
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
      fechaEnvio: '14/09/2025',
      eliminadoVisualmente: false
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
      fechaEnvio: null,
      eliminadoVisualmente: true,
      fechaEliminacion: '14/09/2025',
      eliminadoPor: 'Juan Pérez'
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
      fechaEnvio: '12/09/2025',
      eliminadoVisualmente: false
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
      fechaEnvio: '11/09/2025',
      eliminadoVisualmente: false
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
      motivoCancelacion: 'Error en datos del cliente',
      eliminadoVisualmente: false
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
      fechaEnvio: '08/09/2025',
      eliminadoVisualmente: true,
      fechaEliminacion: '09/09/2025',
      eliminadoPor: 'María López'
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
      motivoCancelacion: 'Cancelación a petición del cliente',
      eliminadoVisualmente: false
    }
  ];

  const datosFacturas = datosIniciales.length > 0 ? datosIniciales : datosFacturasEjemplo;

  // Filtrar datos según rol y vista
  const datosSegunRol = useMemo(() => {
    if (rolUsuario === 'administrador') {
      if (mostrarEliminados) {
        return datosFacturas.filter(f => f.eliminadoVisualmente === true);
      }
      return datosFacturas;
    } else {
      return datosFacturas.filter(f => !f.eliminadoVisualmente);
    }
  }, [datosFacturas, rolUsuario, mostrarEliminados]);

  // Cálculo de estadísticas
  const estadisticas = useMemo(() => {
    const datos = rolUsuario === 'administrador' ? datosFacturas : datosSegunRol;
    const totalFacturas = datos.length;
    const timbradas = datos.filter(f => f.estado === ESTADOS_FACTURA.TIMBRADA && !f.eliminadoVisualmente).length;
    const canceladas = datos.filter(f => f.estado === ESTADOS_FACTURA.CANCELADA && !f.eliminadoVisualmente).length;
    const eliminadas = datos.filter(f => f.eliminadoVisualmente === true).length;

    const montoTotal = datos
      .filter(f => f.estado === ESTADOS_FACTURA.TIMBRADA && !f.eliminadoVisualmente)
      .reduce((total, factura) => total + factura.monto, 0);

    return { totalFacturas, timbradas, canceladas, eliminadas, montoTotal };
  }, [datosFacturas, datosSegunRol, rolUsuario]);

  // Filtrar datos según búsqueda y estado
  const datosFiltrados = useMemo(() => {
    let datos = [...datosSegunRol];

    if (terminoBusqueda) {
      datos = datos.filter(factura => {
        const searchTerm = terminoBusqueda.toLowerCase();
        return (
          factura.cliente.toLowerCase().includes(searchTerm) ||
          factura.id.toString().includes(searchTerm) ||
          factura.numeroFactura.toLowerCase().includes(searchTerm) ||
          factura.rfc.toLowerCase().includes(searchTerm) ||
          factura.uuid.toLowerCase().includes(searchTerm)
        );
      });
    }

    if (filtroEstado !== 'todos') {
      datos = datos.filter(factura => 
        factura.estado.toLowerCase() === filtroEstado.toLowerCase()
      );
    }

    return datos;
  }, [datosSegunRol, terminoBusqueda, filtroEstado]);

  // Calcular paginación
  const totalRegistros = datosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / registrosPorPagina));
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = Math.min(indiceInicio + registrosPorPagina, totalRegistros);
  const datosPaginados = datosFiltrados.slice(indiceInicio, indiceFinal);

  const cambiarPagina = useCallback((nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  }, [totalPaginas]);

  const manejarCambioRegistros = useCallback((evento) => {
    setRegistrosPorPagina(parseInt(evento.target.value));
    setPaginaActual(1);
  }, []);

  const manejarBusqueda = useCallback((evento) => {
    setTerminoBusqueda(evento.target.value);
    setPaginaActual(1);
  }, []);

  const manejarCambioFiltro = useCallback((evento) => {
    setFiltroEstado(evento.target.value);
    setPaginaActual(1);
  }, []);

  // Manejadores de modales
  const abrirModalRegenerar = (factura) => {
    setFacturaSeleccionada(factura);
    setModalRegenerarAbierto(true);
  };

  const abrirModalEliminarDefinitivo = (factura) => {
    setFacturaSeleccionada(factura);
    setModalEliminarDefinitivoAbierto(true);
  };

  const manejarRegenerar = async (factura, motivo) => {
    if (onRegenerar) {
      await onRegenerar(factura, motivo);
    } else {
      console.log('Factura regenerada:', factura.id, 'Motivo:', motivo);
    }
  };

  const manejarEliminarDefinitivo = async (factura, motivo) => {
    if (onEliminarDefinitivo) {
      await onEliminarDefinitivo(factura, motivo);
    } else {
      console.log('Factura eliminada definitivamente:', factura.id, 'Motivo:', motivo);
    }
  };

  const manejarAccion = useCallback(async (accion, factura) => {
    setCargando(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      switch (accion) {
        case 'descargar':
          await generarPDFFacturaTimbrada(factura);
          break;

        case 'enviar':
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
          setCargando(false);
          const confirmado = await modalEliminarFactura(factura, onEliminar);
          if (confirmado && !onEliminar) {
            console.log('Factura eliminada:', factura.id);
          }
          return;

        case 'imprimir':
          imprimirFacturaTimbrada(factura);
          break;

        default:
          break;
      }
    } catch (err) {
      console.error(`Error al ${accion}:`, err);
      alert(`Error al ${accion}: ${err.message}`);
    } finally {
      setCargando(false);
    }
  }, [onEliminar]);

  const obtenerClaseEstado = useCallback((estado, eliminado) => {
    if (eliminado) {
      return 'facturas-estado-eliminado';
    }
    switch (estado) {
      case ESTADOS_FACTURA.TIMBRADA:
        return 'facturas-estado-pagado';
      case ESTADOS_FACTURA.CANCELADA:
        return 'facturas-estado-vencido';
      default:
        return 'facturas-estado-pagado';
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
  }, [paginaActual, totalPaginas]);

  return (
    <div className={`facturas-contenedor-principal ${cargando ? 'facturas-cargando' : ''}`}>
      {/* Header */}
      <div className="facturas-encabezado">
        <div className="facturas-seccion-logo">
          <div className="facturas-icono-principal">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="facturas-titulo">
              Registro de Facturas
              {rolUsuario === 'administrador' && (
                <span className="facturas-badge-rol-admin">
                  <Shield size={16} />
                  Admin
                </span>
              )}
            </h1>
            <p className="facturas-subtitulo">
              {mostrarEliminados 
                ? 'Facturas eliminadas - Solo visible para administradores' 
                : 'Consulta de facturas emitidas y timbradas'}
            </p>
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
          {rolUsuario === 'administrador' && (
            <div className="facturas-tarjeta-estadistica eliminados">
              <Trash2 className="facturas-icono-estadistica" size={20} />
              <span className="facturas-valor-estadistica">{estadisticas.eliminadas}</span>
              <span className="facturas-etiqueta-estadistica">Eliminadas</span>
            </div>
          )}
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

          {rolUsuario === 'administrador' && (
            <button
              className={`facturas-boton-toggle-eliminados ${mostrarEliminados ? 'activo' : ''}`}
              onClick={() => setMostrarEliminados(!mostrarEliminados)}
              title={mostrarEliminados ? 'Ocultar eliminadas' : 'Ver eliminadas'}
            >
              {mostrarEliminados ? <Eye size={16} /> : <EyeOff size={16} />}
              {mostrarEliminados ? 'Ver Activas' : 'Ver Eliminadas'}
            </button>
          )}
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
                : mostrarEliminados
                ? 'No hay facturas eliminadas en el sistema'
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
                <tr 
                  key={factura.id} 
                  className={`facturas-fila-pago ${factura.eliminadoVisualmente ? 'facturas-fila-eliminada' : ''}`}
                  style={{ animationDelay: `${indice * 0.05}s` }}
                >
                  <td data-label="Factura" className="facturas-columna-factura">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontWeight: '600', color: factura.eliminadoVisualmente ? '#94a3b8' : '#111827' }}>
                        {factura.numeroFactura}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Serie {factura.serie} - Folio {factura.folio}
                      </span>
                      {factura.eliminadoVisualmente && (
                        <span className="facturas-badge-eliminado-mini">
                          <Trash2 size={10} />
                          Eliminada
                        </span>
                      )}
                    </div>
                  </td>
                  <td data-label="Cliente" className="facturas-columna-cliente" style={{ color: factura.eliminadoVisualmente ? '#94a3b8' : '#111827' }}>
                    {factura.cliente}
                  </td>
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
                      {factura.eliminadoVisualmente && factura.fechaEliminacion && (
                        <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                          Eliminada: {factura.fechaEliminacion}
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
                    <span className={`facturas-badge-estado ${obtenerClaseEstado(factura.estado, factura.eliminadoVisualmente)}`}>
                      <span className="facturas-indicador-estado"></span>
                      {factura.eliminadoVisualmente ? 'Eliminada' : factura.estado}
                    </span>
                  </td>
                  <td data-label="Acciones" className="facturas-columna-acciones">
                    <div className="facturas-botones-accion">
                      {!factura.eliminadoVisualmente ? (
                        <>
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
                        </>
                      ) : rolUsuario === 'administrador' ? (
                        <>
                          <button
                            className="facturas-boton-accion facturas-regenerar"
                            onClick={() => abrirModalRegenerar(factura)}
                            title="Regenerar factura"
                            disabled={cargando}
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            className="facturas-boton-accion facturas-eliminar-definitivo"
                            onClick={() => abrirModalEliminarDefinitivo(factura)}
                            title="Eliminar definitivamente"
                            disabled={cargando}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : null}
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
            Mostrando <strong>{indiceInicio + 1}</strong> a <strong>{indiceFinal}</strong> de <strong>{totalRegistros}</strong> registros
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

      {/* Modales */}
      {modalRegenerarAbierto && facturaSeleccionada && (
        <ModalRegenerarFactura
          factura={facturaSeleccionada}
          onConfirmar={manejarRegenerar}
          onCerrar={() => {
            setModalRegenerarAbierto(false);
            setFacturaSeleccionada(null);
          }}
          isOpen={modalRegenerarAbierto}
        />
      )}

      {modalEliminarDefinitivoAbierto && facturaSeleccionada && (
        <ModalEliminarDefinitivoFactura
          factura={facturaSeleccionada}
          onConfirmar={manejarEliminarDefinitivo}
          onCerrar={() => {
            setModalEliminarDefinitivoAbierto(false);
            setFacturaSeleccionada(null);
          }}
          isOpen={modalEliminarDefinitivoAbierto}
        />
      )}
    </div>
  );
};

export default TablaFacturas;