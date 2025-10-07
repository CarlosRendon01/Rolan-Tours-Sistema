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
import ModalNuevoPago from '../ModalesAbonos/ModalNuevoPago';
import ModalAgregarAbono from '../ModalesAbonos/ModalAgregarAbono';
import ModalVerAbono from '../ModalesAbonos/ModalVerAbono';
import ModalEditarAbono from '../ModalesAbonos/ModalEditarAbono';
import ModalReciboAbono from '../ModalesAbonos/ModalReciboAbono';
import ModalFacturaAbono from '../ModalesAbonos/ModalFacturaAbono';
import { modalEliminarPago } from '../ModalesAbonos/ModalEliminarAbono';

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
 
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  // Estado para los datos de abonos - ACTUALIZADO CON CAMPOS DE FACTURACIÓN
  const [datosAbonos, setDatosAbonos] = useState([
    {
      id: 1,
      cliente: {
        id: 123,
        nombre: 'Roberto Sánchez Morales',
        email: 'roberto@example.com',
        rfc: 'SAMR850615ABC',
        telefono: '951-123-4567',
        regimen: '605 - Sueldos y Salarios',
        codigoPostal: '68000'
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
        { 
          numeroAbono: 1, 
          monto: 6000, 
          fecha: '2025-09-15', 
          metodoPago: 'Transferencia',
          referencia: 'REF-001',
          // ⭐ NUEVOS CAMPOS PARA FACTURACIÓN
          facturaGenerada: true,
          numeroFactura: 'FAC-0001-1',
          uuid: 'A1B2C3D4-E5F6-1234-5678-ABCDEF123456',
          fechaFacturacion: '2025-09-15'
        },
        { 
          numeroAbono: 2, 
          monto: 6000, 
          fecha: '2025-09-22', 
          metodoPago: 'Efectivo',
          referencia: 'REF-002',
          // ⭐ SIN FACTURA
          facturaGenerada: false
        },
        { 
          numeroAbono: 3, 
          monto: 6000, 
          fecha: '2025-09-29', 
          metodoPago: 'Tarjeta',
          referencia: 'REF-003',
          // ⭐ SIN FACTURA
          facturaGenerada: false
        }
      ],
      estado: 'EN_PROCESO',
      proximoVencimiento: '2025-10-25',
      numeroContrato: 'CONT-001',
      facturaGenerada: false,
      fechaCreacion: '2025-09-15',
      usoCFDI: 'G03',
      metodoPago: 'Mixto'
    },
    {
      id: 2,
      cliente: {
        id: 124,
        nombre: 'Diana Torres Vega',
        email: 'diana@example.com',
        rfc: 'TOVD900320XYZ',
        telefono: '951-234-5678',
        regimen: '612 - Personas Físicas con Actividades Empresariales',
        codigoPostal: '68050'
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
        { 
          numeroAbono: 1, 
          monto: 4500, 
          fecha: '2025-09-10', 
          metodoPago: 'Tarjeta',
          referencia: 'REF-004',
          facturaGenerada: false
        },
        { 
          numeroAbono: 2, 
          monto: 4500, 
          fecha: '2025-09-18', 
          metodoPago: 'Transferencia',
          referencia: 'REF-005',
          facturaGenerada: false
        }
      ],
      estado: 'EN_PROCESO',
      proximoVencimiento: '2025-10-18',
      numeroContrato: 'CONT-002',
      facturaGenerada: false,
      fechaCreacion: '2025-09-10',
      usoCFDI: 'G03',
      metodoPago: 'Mixto'
    },
    {
      id: 3,
      cliente: {
        id: 125,
        nombre: 'Fernando Ramírez Cruz',
        email: 'fernando@example.com',
        rfc: 'RACF880525DEF',
        telefono: '951-345-6789',
        regimen: '605 - Sueldos y Salarios',
        codigoPostal: '68020'
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
        { 
          numeroAbono: 1, 
          monto: 9000, 
          fecha: '2025-09-12', 
          metodoPago: 'Efectivo',
          referencia: 'REF-006',
          facturaGenerada: true,
          numeroFactura: 'FAC-0003-1',
          uuid: 'X9Y8Z7W6-V5U4-3210-ABCD-EFGH12345678',
          fechaFacturacion: '2025-09-13'
        },
        { 
          numeroAbono: 2, 
          monto: 9000, 
          fecha: '2025-09-22', 
          metodoPago: 'Transferencia',
          referencia: 'REF-007',
          facturaGenerada: true,
          numeroFactura: 'FAC-0003-2',
          uuid: 'M1N2O3P4-Q5R6-7890-STUV-WXYZ98765432',
          fechaFacturacion: '2025-09-23'
        },
        { 
          numeroAbono: 3, 
          monto: 9000, 
          fecha: '2025-09-29', 
          metodoPago: 'Tarjeta',
          referencia: 'REF-008',
          facturaGenerada: false
        }
      ],
      estado: 'EN_PROCESO',
      proximoVencimiento: '2025-11-22',
      numeroContrato: 'CONT-003',
      facturaGenerada: false,
      fechaCreacion: '2025-09-12',
      usoCFDI: 'G03',
      metodoPago: 'Mixto'
    },
    {
      id: 4,
      cliente: {
        id: 126,
        nombre: 'Andrea Jiménez López',
        email: 'andrea@example.com',
        rfc: 'JILA920815GHI',
        telefono: '951-456-7890',
        regimen: '605 - Sueldos y Salarios',
        codigoPostal: '68030'
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
        { 
          numeroAbono: 1, 
          monto: 5000, 
          fecha: '2025-09-05', 
          metodoPago: 'Transferencia',
          referencia: 'REF-009',
          facturaGenerada: true,
          numeroFactura: 'FAC-0004-1',
          uuid: 'AAAA1111-BBBB-2222-CCCC-DDDD33334444',
          fechaFacturacion: '2025-09-05'
        },
        { 
          numeroAbono: 2, 
          monto: 5000, 
          fecha: '2025-09-15', 
          metodoPago: 'Efectivo',
          referencia: 'REF-010',
          facturaGenerada: true,
          numeroFactura: 'FAC-0004-2',
          uuid: 'EEEE5555-FFFF-6666-GGGG-HHHH77778888',
          fechaFacturacion: '2025-09-15'
        },
        { 
          numeroAbono: 3, 
          monto: 5000, 
          fecha: '2025-09-20', 
          metodoPago: 'Tarjeta',
          referencia: 'REF-011',
          facturaGenerada: true,
          numeroFactura: 'FAC-0004-3',
          uuid: 'IIII9999-JJJJ-0000-KKKK-LLLL11112222',
          fechaFacturacion: '2025-09-20'
        },
        { 
          numeroAbono: 4, 
          monto: 5000, 
          fecha: '2025-09-25', 
          metodoPago: 'Transferencia',
          referencia: 'REF-012',
          facturaGenerada: true,
          numeroFactura: 'FAC-0004-4',
          uuid: 'MMMM3333-NNNN-4444-OOOO-PPPP55556666',
          fechaFacturacion: '2025-09-25'
        }
      ],
      estado: 'FINALIZADO',
      proximoVencimiento: 'Finalizado',
      numeroContrato: 'CONT-004',
      facturaGenerada: false,
      fechaCreacion: '2025-09-05',
      fechaFinalizacion: '2025-09-25',
      usoCFDI: 'G03',
      metodoPago: 'Mixto'
    }
  ]);

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
  }, [datosAbonos]);

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
  }, [terminoBusqueda, datosAbonos]);

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

  // ⭐ NUEVA FUNCIÓN PARA FACTURAR UN ABONO INDIVIDUAL
  const facturarAbono = (pagoId, numeroAbono, datosFactura) => {
    setDatosAbonos(prevDatos => {
      return prevDatos.map(pago => {
        if (pago.id === pagoId) {
          return {
            ...pago,
            historialAbonos: pago.historialAbonos.map(abono => {
              if (abono.numeroAbono === numeroAbono) {
                return {
                  ...abono,
                  facturaGenerada: true,
                  numeroFactura: datosFactura.numeroFactura,
                  uuid: datosFactura.uuid,
                  fechaFacturacion: datosFactura.fechaFacturacion
                };
              }
              return abono;
            })
          };
        }
        return pago;
      });
    });
    console.log('✅ Factura generada para abono #' + numeroAbono);
  };

  // Función para guardar nuevo pago
  const guardarNuevoPago = (datosPago) => {
    const nuevoId = datosAbonos.length > 0
      ? Math.max(...datosAbonos.map(p => p.id)) + 1
      : 1;

    const nuevoPago = {
      id: nuevoId,
      cliente: {
        id: Date.now(),
        nombre: datosPago.nombreCliente,
        email: datosPago.emailCliente,
        telefono: datosPago.telefonoCliente,
        rfc: datosPago.rfcCliente || 'XAXX010101000',
        regimen: datosPago.regimenCliente || '605 - Sueldos y Salarios',
        codigoPostal: datosPago.codigoPostal || '68000'
      },
      servicio: {
        tipo: datosPago.tipoServicio,
        descripcion: datosPago.descripcionServicio,
        fechaTour: datosPago.fechaTour
      },
      planPago: {
        montoTotal: parseFloat(datosPago.montoTotal),
        abonosPlaneados: parseInt(datosPago.numeroAbonos),
        abonoMinimo: parseFloat(datosPago.abonoMinimo),
        montoPagado: 0,
        saldoPendiente: parseFloat(datosPago.montoTotal),
        abonosRealizados: 0
      },
      historialAbonos: [],
      estado: 'EN_PROCESO',
      proximoVencimiento: datosPago.fechaPrimerAbono,
      numeroContrato: datosPago.numeroContrato || `CONT-${String(nuevoId).padStart(3, '0')}`,
      facturaGenerada: false,
      fechaCreacion: new Date().toISOString().split('T')[0],
      frecuenciaPago: datosPago.frecuenciaPago,
      observaciones: datosPago.observaciones,
      usoCFDI: datosPago.usoCFDI || 'G03',
      metodoPago: datosPago.metodoPago || 'Mixto'
    };

    setDatosAbonos(prevDatos => [...prevDatos, nuevoPago]);
    console.log('✅ Nuevo pago agregado exitosamente:', nuevoPago);
  };

  // Función para agregar un abono a un pago existente
  const guardarAbono = (datosAbono) => {
    setDatosAbonos(prevDatos => {
      return prevDatos.map(pago => {
        if (pago.id === datosAbono.pagoId) {
          const nuevoMontoPagado = pago.planPago.montoPagado + datosAbono.montoAbono;
          const nuevoSaldoPendiente = pago.planPago.montoTotal - nuevoMontoPagado;
          const nuevosAbonosRealizados = pago.planPago.abonosRealizados + 1;
          const pagoCompletado = nuevoSaldoPendiente === 0;

          const nuevoAbono = {
            numeroAbono: datosAbono.numeroAbono,
            monto: datosAbono.montoAbono,
            fecha: datosAbono.fechaAbono,
            metodoPago: datosAbono.metodoPago,
            referencia: datosAbono.referencia,
            observaciones: datosAbono.observaciones,
            // ⭐ INICIALIZAR CAMPOS DE FACTURACIÓN
            facturaGenerada: false
          };

          let proximoVencimiento = pago.proximoVencimiento;
          if (!pagoCompletado && pago.frecuenciaPago) {
            const fechaActual = new Date(datosAbono.fechaAbono);
            const diasASumar = pago.frecuenciaPago === 'semanal' ? 7 :
              pago.frecuenciaPago === 'quincenal' ? 15 : 30;
            fechaActual.setDate(fechaActual.getDate() + diasASumar);
            proximoVencimiento = fechaActual.toISOString().split('T')[0];
          }

          return {
            ...pago,
            planPago: {
              ...pago.planPago,
              montoPagado: nuevoMontoPagado,
              saldoPendiente: nuevoSaldoPendiente,
              abonosRealizados: nuevosAbonosRealizados
            },
            historialAbonos: [...pago.historialAbonos, nuevoAbono],
            estado: pagoCompletado ? 'FINALIZADO' : 'EN_PROCESO',
            proximoVencimiento: pagoCompletado ? 'Finalizado' : proximoVencimiento,
            ...(pagoCompletado && { fechaFinalizacion: datosAbono.fechaAbono })
          };
        }
        return pago;
      });
    });

    console.log('✅ Abono agregado exitosamente');
  };

  const guardarEdicionPago = (datosActualizados) => {
    setDatosAbonos(prevDatos => {
      return prevDatos.map(pago => {
        if (pago.id === datosActualizados.id) {
          const nuevoMontoTotal = parseFloat(datosActualizados.montoTotal);
          const montoPagado = pago.planPago.montoPagado;
          const nuevoSaldoPendiente = nuevoMontoTotal - montoPagado;

          return {
            ...pago,
            cliente: {
              ...pago.cliente,
              nombre: datosActualizados.nombreCliente,
              email: datosActualizados.emailCliente,
              telefono: datosActualizados.telefonoCliente
            },
            servicio: {
              ...pago.servicio,
              tipo: datosActualizados.tipoServicio,
              descripcion: datosActualizados.descripcionServicio,
              fechaTour: datosActualizados.fechaTour
            },
            planPago: {
              ...pago.planPago,
              montoTotal: nuevoMontoTotal,
              abonosPlaneados: parseInt(datosActualizados.numeroAbonos),
              abonoMinimo: parseFloat(datosActualizados.abonoMinimo),
              saldoPendiente: nuevoSaldoPendiente
            },
            proximoVencimiento: datosActualizados.fechaPrimerAbono || pago.proximoVencimiento,
            numeroContrato: datosActualizados.numeroContrato,
            frecuenciaPago: datosActualizados.frecuenciaPago,
            observaciones: datosActualizados.observaciones
          };
        }
        return pago;
      });
    });

    console.log('✅ Pago editado exitosamente');
  };

  const eliminarPago = (pagoId) => {
    setDatosAbonos(prevDatos =>
      prevDatos.filter(pago => pago.id !== pagoId)
    );
    console.log('✅ Pago eliminado exitosamente');
  };

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
        await modalEliminarPago(pago, eliminarPago);
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
                  <tr key={pago.id} className="abonos-fila-pago" style={{ animationDelay: `${indice * 0.05}s` }}>
                    <td data-label="ID" className="abonos-columna-id">#{pago.id.toString().padStart(3, '0')}</td>
                    <td data-label="Cliente" className="abonos-columna-cliente">{pago.cliente.nombre}</td>
                    <td data-label="Servicio">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{pago.servicio.tipo}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{pago.servicio.descripcion}</span>
                      </div>
                    </td>
                    <td data-label="Progreso">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                          <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{progreso}%</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          ${pago.planPago.montoPagado.toLocaleString()} / ${pago.planPago.montoTotal.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {pago.planPago.abonosRealizados} de {pago.planPago.abonosPlaneados} abonos
                        </div>
                      </div>
                    </td>
                    <td data-label="Último Abono">
                      {ultimoAbono ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span className="abonos-columna-monto">${ultimoAbono.monto.toLocaleString()}</span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{ultimoAbono.fecha}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sin abonos</span>
                      )}
                    </td>
                    <td data-label="Próximo Venc.">
                      {pago.proximoVencimiento === 'Finalizado' ? (
                        <span style={{ color: '#10b981', fontWeight: '600' }}>Finalizado</span>
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
                        >
                          <Receipt size={14} />
                        </button>

                        <button
                          className="abonos-boton-accion abonos-factura"
                          onClick={() => manejarAccion('generarFactura', pago)}
                          title="Gestionar facturas por abono"
                          disabled={cargando}
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
              <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>
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
                  <span key={`ellipsis-${indice}`} style={{ padding: '0.5rem', color: '#9ca3af' }}>
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

      {/* MODALES */}
      <ModalNuevoPago
        abierto={modalNuevoPagoAbierto}
        onCerrar={() => setModalNuevoPagoAbierto(false)}
        onGuardar={guardarNuevoPago}
      />

      <ModalAgregarAbono
        abierto={modalAgregarAbonoAbierto}
        onCerrar={() => setModalAgregarAbonoAbierto(false)}
        onGuardar={guardarAbono}
        pagoSeleccionado={pagoSeleccionado}
      />

      <ModalVerAbono
        abierto={modalVerPagoAbierto}
        onCerrar={() => setModalVerPagoAbierto(false)}
        pagoSeleccionado={pagoSeleccionado}
      />

      <ModalEditarAbono
        abierto={modalEditarPagoAbierto}
        onCerrar={() => setModalEditarPagoAbierto(false)}
        onGuardar={guardarEdicionPago}
        pagoSeleccionado={pagoSeleccionado}
      />

      <ModalReciboAbono
        abierto={modalReciboAbierto}
        onCerrar={() => setModalReciboAbierto(false)}
        pagoSeleccionado={pagoSeleccionado}
      />

      {/* ⭐ MODAL DE FACTURACIÓN ACTUALIZADO CON SOPORTE PARA ABONOS INDIVIDUALES */}
      <ModalFacturaAbono
        abierto={modalFacturaAbierto}
        onCerrar={() => setModalFacturaAbierto(false)}
        pagoSeleccionado={pagoSeleccionado}
        onFacturar={facturarAbono}
      />
    </div>
  );
};

export default TablaAbonos;