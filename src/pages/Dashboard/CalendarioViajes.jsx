import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
  Calendar, ChevronLeft, ChevronRight, MapPin, Users, Clock, Eye, Edit
} from "lucide-react";
import "./CalendarioViajes.css";

const CalendarioViajes = ({ onActualizarEstadisticas }) => {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

  // ✅ Cargar eventos desde la API
  useEffect(() => {
    cargarEventosDelMes();
  }, [fechaActual]);

  const cargarEventosDelMes = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No hay token de autenticación');
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      const ultimoDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

      const fechaInicio = primerDia.toISOString().split('T')[0];
      const fechaFin = ultimoDia.toISOString().split('T')[0];

      console.log('📅 Cargando eventos del:', fechaInicio, 'al', fechaFin);

      const response = await axios.get(
        `http://127.0.0.1:8000/api/ordenes-servicio/filtrar/rango-fechas`,
        {
          params: {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin
          }
        }
      );

      console.log('✅ Órdenes recibidas:', response.data);

      // ✅ FUNCIÓN HELPER PARA CONVERTIR FECHA ISO A FORMATO YYYY-MM-DD
      const formatearFechaISO = (fechaISO) => {
        if (!fechaISO) return null;
        // Extraer solo la parte de la fecha (YYYY-MM-DD)
        return fechaISO.split('T')[0];
      };

      // Transformar órdenes a formato de eventos
      const eventosTransformados = response.data.map(orden => {
        // ✅ Convertir fecha ISO a formato simple
        const fechaEvento = formatearFechaISO(orden.fecha_inicio_servicio);

        return {
          id: orden.id,
          titulo: `${orden.destino || 'Sin destino'} - ${orden.nombre_cliente || 'Sin cliente'}`,
          fecha: fechaEvento, // ✅ Ahora está en formato YYYY-MM-DD
          hora_inicio: orden.horario_inicio_servicio || "08:00",
          hora_fin: orden.horario_final_servicio || "18:00",
          tipo: determinarTipoServicio(orden),
          clientes: orden.numero_pasajeros || 0,
          estado: orden.activo ? "confirmado" : "cancelado",
          guia: obtenerNombreCompleto(orden),
          vehiculo: obtenerInfoVehiculo(orden),
          descripcion: orden.itinerario_detallado || `Servicio de ${orden.ciudad_origen || 'Origen'} a ${orden.destino || 'Destino'}`
        };
      });

      console.log('🎯 Eventos transformados:', eventosTransformados);

      // ✅ Filtrar eventos que tienen fecha válida
      const eventosValidos = eventosTransformados.filter(evento => evento.fecha !== null);

      console.log('📋 Eventos válidos para mostrar:', eventosValidos);
      setEventos(eventosValidos);

      if (onActualizarEstadisticas) {
        onActualizarEstadisticas();
      }

    } catch (error) {
      console.error('❌ Error al cargar eventos:', error);
      console.error('Detalles:', error.response?.data);
      setEventos([]);
    } finally {
      setCargando(false);
    }
  };

  const determinarTipoServicio = (orden) => {
    const destino = (orden.destino || '').toLowerCase();
    const servicio = (orden.servicio || '').toLowerCase();

    // Palabras clave para tours
    const palabrasTour = ['tour', 'monte albán', 'hierve', 'mitla', 'teotitlán',
      'tule', 'mezcal', 'artesanías', 'excursión', 'paseo'];

    // Palabras clave para traslados
    const palabrasTraslado = ['traslado', 'aeropuerto', 'hotel', 'terminal',
      'transporte', 'pickup', 'transfer'];

    // Revisar en destino y servicio
    const textoCompleto = `${destino} ${servicio}`;

    if (palabrasTour.some(palabra => textoCompleto.includes(palabra))) {
      return 'tour';
    }

    if (palabrasTraslado.some(palabra => textoCompleto.includes(palabra))) {
      return 'traslado';
    }

    // Por defecto, si tiene más de 5 pasajeros, es tour
    return (orden.numero_pasajeros || orden.num_pasajeros || 0) > 5 ? 'tour' : 'traslado';
  };

  const obtenerNombreCompleto = (orden) => {
    const partes = [
      orden.nombre_conductor,
      orden.apellido_paterno_conductor,
      orden.apellido_materno_conductor
    ].filter(Boolean);

    return partes.length > 0 ? partes.join(' ') : 'Sin asignar';
  };

  const obtenerInfoVehiculo = (orden) => {
    const marca = orden.marca || '';
    const modelo = orden.modelo || '';
    const placa = orden.placa || 'Sin placa';

    if (marca || modelo) {
      return `${marca} ${modelo} - ${placa}`.trim();
    }

    return placa;
  };

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const obtenerPrimerDiaDelMes = (fecha) => {
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1).getDay();
  };

  const obtenerDiasEnMes = (fecha) => {
    return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
  };

  const navegarMes = (direccion) => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(fechaActual.getMonth() + direccion);
    setFechaActual(nuevaFecha);
  };

  const obtenerEventosPorFecha = (fecha) => {
    return eventos.filter(evento => evento.fecha === fecha);
  };

  const formatearFecha = (fecha) => {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  const abrirModal = (evento) => {
    setEventoSeleccionado(evento);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEventoSeleccionado(null);
  };

  const obtenerColorTipo = (tipo) => {
    switch (tipo) {
      case 'tour': return 'calendario-evento-tour';
      case 'traslado': return 'calendario-evento-traslado';
      default: return 'calendario-evento-default';
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'confirmado': return 'calendario-estado-confirmado';
      case 'cancelado': return 'calendario-estado-cancelado';
      default: return 'calendario-estado-default';
    }
  };

  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'confirmado': return 'Confirmado';
      case 'cancelado': return 'Cancelado';
      default: return 'Sin estado';
    }
  };

  const manejarVerMas = () => {
    console.log('Ver más detalles:', eventoSeleccionado);
    // Aquí podrías navegar a una página de detalles o abrir un modal más completo
  };

  const manejarEditar = () => {
    console.log('Editar evento:', eventoSeleccionado);
    // Aquí podrías navegar a la página de edición
  };

  const renderizarDias = () => {
    const primerDia = obtenerPrimerDiaDelMes(fechaActual);
    const diasEnMes = obtenerDiasEnMes(fechaActual);
    const dias = [];

    // Espacios vacíos al inicio
    for (let i = 0; i < primerDia; i++) {
      dias.push(<div key={`vacio-${i}`} className="calendario-dia-vacio"></div>);
    }

    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fechaCompleta = formatearFecha(new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia));
      const eventosDelDia = obtenerEventosPorFecha(fechaCompleta);
      const esHoy = fechaCompleta === formatearFecha(new Date());
      const esDiaSeleccionado = fechaSeleccionada === fechaCompleta;

      dias.push(
        <div
          key={dia}
          onClick={() => setFechaSeleccionada(fechaCompleta)}
          className={`calendario-dia ${esHoy ? 'calendario-dia-hoy' : ''} ${esDiaSeleccionado ? 'calendario-dia-seleccionado' : ''} ${eventosDelDia.length > 0 ? 'calendario-con-eventos' : ''}`}
          role="button"
          tabIndex={0}
        >
          <div className={`calendario-numero-dia ${esHoy ? 'calendario-numero-hoy' : ''}`}>
            {dia}
          </div>
          <div className="calendario-contenedor-eventos">
            {eventosDelDia.slice(0, 3).map((evento) => (
              <div
                key={evento.id}
                onClick={(e) => {
                  e.stopPropagation();
                  abrirModal(evento);
                }}
                className={`calendario-elemento-evento ${obtenerColorTipo(evento.tipo)}`}
                role="button"
                tabIndex={0}
              >
                <div className="calendario-titulo-evento">{evento.titulo}</div>
                <div className="calendario-hora-evento">{evento.hora_inicio}</div>
              </div>
            ))}
            {eventosDelDia.length > 3 && (
              <div className="calendario-eventos-mas">
                +{eventosDelDia.length - 3} más
              </div>
            )}
          </div>
        </div>
      );
    }

    return dias;
  };

  const renderModal = () => {
    if (!mostrarModal || !eventoSeleccionado) return null;

    return createPortal(
      <div
        className="calendario-superposicion-modal"
        onClick={cerrarModal}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div
          className="calendario-contenido-modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            zIndex: 1001
          }}
        >
          <div className={`calendario-encabezado-modal ${obtenerColorTipo(eventoSeleccionado.tipo)}`}>
            <div className="calendario-seccion-titulo-modal">
              <h3 className="calendario-titulo-modal">{eventoSeleccionado.titulo}</h3>
              <button
                onClick={cerrarModal}
                className="calendario-btn-cerrar-modal"
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>
            <p className="calendario-subtitulo-modal">Detalles del viaje</p>
          </div>

          <div className="calendario-cuerpo-modal">
            <div className="calendario-elemento-detalle">
              <span className="calendario-etiqueta-detalle">Estado:</span>
              <span className={`calendario-insignia-estado ${obtenerColorEstado(eventoSeleccionado.estado)}`}>
                {obtenerTextoEstado(eventoSeleccionado.estado)}
              </span>
            </div>

            <div className="calendario-elemento-detalle">
              <Clock size={14} className="calendario-icono-detalle" />
              <span className="calendario-etiqueta-detalle">Horario:</span>
              <span className="calendario-valor-detalle">{eventoSeleccionado.hora_inicio} - {eventoSeleccionado.hora_fin}</span>
            </div>

            <div className="calendario-elemento-detalle">
              <Users size={14} className="calendario-icono-detalle" />
              <span className="calendario-etiqueta-detalle">Clientes:</span>
              <span className="calendario-valor-detalle">{eventoSeleccionado.clientes} personas</span>
            </div>

            <div className="calendario-elemento-detalle">
              <MapPin size={14} className="calendario-icono-detalle" />
              <span className="calendario-etiqueta-detalle">Guía:</span>
              <span className="calendario-valor-detalle">{eventoSeleccionado.guia}</span>
            </div>

            {eventoSeleccionado.descripcion && (
              <div className="calendario-elemento-detalle">
                <span className="calendario-etiqueta-detalle">Descripción:</span>
                <span className="calendario-valor-detalle">{eventoSeleccionado.descripcion}</span>
              </div>
            )}

            <div className="calendario-info-vehiculo">
              <div className="calendario-etiqueta-vehiculo">Vehículo asignado:</div>
              <div className="calendario-detalle-vehiculo">{eventoSeleccionado.vehiculo}</div>
            </div>

            <div className="calendario-acciones-modal">
              <button className="calendario-btn-ver-mas" onClick={manejarVerMas}>
                <Eye size={14} />
                Ver Más
              </button>
              <button className="calendario-btn-editar" onClick={manejarEditar}>
                <Edit size={14} />
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div className={`calendario-contenedor-principal ${cargando ? 'calendario-cargando' : ''}`}>
        <div className="calendario-encabezado">
          <div className="calendario-contenido-encabezado">
            <div className="calendario-seccion-titulo">
              <div className="calendario-icono-principal">
                <Calendar size={20} />
              </div>
              <div className="calendario-info-titulo">
                <h2 className="calendario-titulo-principal">Calendario de Viajes</h2>
                <p className="calendario-subtitulo">Roland Tours - Gestión de itinerarios</p>
              </div>
            </div>

            <div className="calendario-navegacion-mes">
              <button
                onClick={() => navegarMes(-1)}
                className="calendario-btn-navegacion"
                aria-label="Mes anterior"
                disabled={cargando}
              >
                <ChevronLeft size={18} />
              </button>

              <h3 className="calendario-mes-actual">
                {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
              </h3>

              <button
                onClick={() => navegarMes(1)}
                className="calendario-btn-navegacion"
                aria-label="Mes siguiente"
                disabled={cargando}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="calendario-leyenda-tipos">
          <div className="calendario-elementos-leyenda">
            <span className="calendario-etiqueta-leyenda">Tipos de servicio:</span>
            <div className="calendario-elemento-tipo">
              <div className="calendario-color-tipo calendario-tipo-tour"></div>
              <span>Tours</span>
            </div>
            <div className="calendario-elemento-tipo">
              <div className="calendario-color-tipo calendario-tipo-traslado"></div>
              <span>Traslados</span>
            </div>
          </div>

          <div className="calendario-total-viajes">
            Total de viajes del mes: <span className="calendario-numero-total">{eventos.length}</span>
          </div>
        </div>

        <div className="calendario-dias-semana">
          {diasSemana.map((dia) => (
            <div key={dia} className="calendario-elemento-dia-semana">
              {dia}
            </div>
          ))}
        </div>

        <div className="calendario-cuadricula">
          {renderizarDias()}
        </div>

        <div className="calendario-estadisticas-rapidas">
          <div className="calendario-tarjeta-estadistica calendario-estadistica-tours">
            <div className="calendario-etiqueta-estadistica">Tours Confirmados</div>
            <div className="calendario-valor-estadistica">
              {eventos.filter(e => e.tipo === 'tour' && e.estado === 'confirmado').length}
            </div>
          </div>

          <div className="calendario-tarjeta-estadistica calendario-estadistica-traslados">
            <div className="calendario-etiqueta-estadistica">Traslados</div>
            <div className="calendario-valor-estadistica">
              {eventos.filter(e => e.tipo === 'traslado').length}
            </div>
          </div>

          <div className="calendario-tarjeta-estadistica calendario-estadistica-clientes">
            <div className="calendario-etiqueta-estadistica">Total Clientes</div>
            <div className="calendario-valor-estadistica">
              {eventos.reduce((total, evento) => total + evento.clientes, 0)}
            </div>
          </div>
        </div>

        {cargando && (
          <div className="calendario-overlay-carga">
            <div className="calendario-spinner"></div>
            <p>Cargando eventos...</p>
          </div>
        )}
      </div>

      {renderModal()}
    </>
  );
};

export default CalendarioViajes;