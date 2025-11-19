import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar,        // Icono de calendario
  ChevronLeft,     // Flecha izquierda  
  ChevronRight,    // Flecha derecha
  MapPin,          // Pin de ubicación
  Users,           // Usuarios/personas
  Clock,           // Reloj
  Eye,             // Ojo (ver)
  Edit             // Editar
} from "lucide-react";
import "./CalendarioViajes.css";

const CalendarioViajes = () => {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Datos de ejemplo - aquí conectarías con Google Calendar API
  const eventosEjemplo = [
    {
      id: 1,
      titulo: "Tour Hierve el Agua",
      fecha: "2025-09-10",
      hora_inicio: "08:00",
      hora_fin: "18:00",
      tipo: "tour",
      clientes: 12,
      estado: "confirmado",
      guia: "Carlos Mendoza",
      vehiculo: "Autobús Mercedes - Placa ABC-123",
      descripcion: "Tour completo a Hierve el Agua con paradas en pueblos mágicos"
    },
    {
      id: 2,
      titulo: "Traslado Aeropuerto",
      fecha: "2025-09-12",
      hora_inicio: "06:30",
      hora_fin: "08:00",
      tipo: "traslado",
      clientes: 4,
      estado: "confirmado",
      guia: "María González",
      vehiculo: "Van Toyota - Placa XYZ-456",
      descripcion: "Traslado hotel - aeropuerto para huéspedes VIP"
    },
    {
      id: 3,
      titulo: "Tour Monte Albán",
      fecha: "2025-09-15",
      hora_inicio: "09:00",
      hora_fin: "16:00",
      tipo: "tour",
      clientes: 8,
      estado: "confirmado",
      guia: "Roberto Silva",
      vehiculo: "Minibús Nissan - Placa DEF-789",
      descripcion: "Visita arqueológica a Monte Albán con almuerzo incluido"
    },
    {
      id: 4,
      titulo: "Ruta Mezcal",
      fecha: "2025-09-20",
      hora_inicio: "10:00",
      hora_fin: "19:00",
      tipo: "tour",
      clientes: 15,
      estado: "confirmado",
      guia: "Ana Pérez",
      vehiculo: "Autobús Mercedes - Placa GHI-012",
      descripcion: "Tour completo de mezcal con degustaciones y comida tradicional"
    },
    {
      id: 5,
      titulo: "Tour Mitla",
      fecha: "2025-09-22",
      hora_inicio: "09:30",
      hora_fin: "17:00",
      tipo: "tour",
      clientes: 10,
      estado: "confirmado",
      guia: "Luis Ramirez",
      vehiculo: "Van Mercedes - Placa JKL-345",
      descripcion: "Exploración de las ruinas de Mitla y mercados locales"
    },
    {
      id: 6,
      titulo: "Traslado Hotel",
      fecha: "2025-09-25",
      hora_inicio: "14:00",
      hora_fin: "15:30",
      tipo: "traslado",
      clientes: 2,
      estado: "confirmado",
      guia: "Sofia Martinez",
      vehiculo: "Sedan Nissan - Placa MNO-678",
      descripcion: "Traslado privado desde aeropuerto hasta hotel boutique"
    },
    {
      id: 7,
      titulo: "Tour Teotitlán",
      fecha: "2025-09-28",
      hora_inicio: "08:30",
      hora_fin: "17:30",
      tipo: "tour",
      clientes: 6,
      estado: "confirmado",
      guia: "Diego Morales",
      vehiculo: "Van Toyota - Placa PQR-901",
      descripcion: "Tour de textiles tradicionales en Teotitlán del Valle"
    }
  ];

  useEffect(() => {
    // Simular carga de eventos - aquí harías el fetch a Google Calendar
    setCargando(true);
    setTimeout(() => {
      setEventos(eventosEjemplo);
      setCargando(false);
    }, 1000);
  }, []);

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
    setCargando(true);
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(fechaActual.getMonth() + direccion);
    setFechaActual(nuevaFecha);

    // Simular carga de nuevos datos
    setTimeout(() => {
      setCargando(false);
    }, 500);
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
    alert(`Ver detalles completos de: ${eventoSeleccionado?.titulo}`);
  };

  const manejarEditar = () => {
    alert(`Editar evento: ${eventoSeleccionado?.titulo}`);
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setFechaSeleccionada(fechaCompleta);
            }
          }}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    abrirModal(evento);
                  }
                }}
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

  // Modal renderizado con createPortal para evitar problemas de z-index
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
        {/* Encabezado del calendario */}
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

        {/* Leyenda de tipos */}
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

        {/* Días de la semana */}
        <div className="calendario-dias-semana">
          {diasSemana.map((dia) => (
            <div key={dia} className="calendario-elemento-dia-semana">
              {dia}
            </div>
          ))}
        </div>

        {/* Cuadrícula del calendario */}
        <div className="calendario-cuadricula">
          {renderizarDias()}
        </div>

        {/* Estadísticas rápidas */}
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
      </div>


      {/* Modal renderizado con createPortal */}
      {renderModal()}
    </>
  );
};

export default CalendarioViajes;