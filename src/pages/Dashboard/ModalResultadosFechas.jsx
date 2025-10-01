import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  AlertCircle,
  Car,
  Camera,
  DollarSign,
  Star,
  Filter
} from "lucide-react";
import "./ModalResultadosFechas.css";

const ModalResultadosFechas = ({ 
  isOpen, 
  onClose, 
  fechaDesde, 
  fechaHasta, 
  resultados = [] 
}) => {
  
  const [filtroActivo, setFiltroActivo] = useState('todos');

  if (!isOpen) return null;

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [año, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${año}`;
  };

  const formatearFechaCompleta = (fecha) => {
    if (!fecha) return "";
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const obtenerIconoTipo = (tipo) => {
    switch(tipo.toLowerCase()) {
      case 'tour':
        return <Camera size={24} />;
      case 'traslado':
        return <Car size={24} />;
      default:
        return <Calendar size={24} />;
    }
  };

  const obtenerEstadoDisponibilidad = (disponibles, total) => {
    const porcentaje = (disponibles / total) * 100;
    if (porcentaje > 50) return 'disponible';
    if (porcentaje > 0) return 'limitado';
    return 'completo';
  };

  // Datos de ejemplo mejorados para tours y traslados
  const eventosMock = resultados.length > 0 ? resultados : [
    {
      id: 1,
      titulo: "Tour Gastronómico Centro Histórico",
      tipo: "tour",
      fechaInicio: "2025-09-15",
      fechaFin: "2025-09-15",
      destino: "Centro Histórico, Oaxaca",
      descripcion: "Descubre los sabores auténticos de Oaxaca en un recorrido por mercados tradicionales y restaurantes locales.",
      duracion: "4 horas",
      participantes: 15,
      disponibles: 8,
      precio: "$850.00",
      hora: "10:00 AM",
      puntuacion: 4.8,
      incluye: ["Guía especializado", "Degustaciones", "Transporte"]
    },
    {
      id: 2,
      titulo: "Traslado Aeropuerto - Hotel",
      tipo: "traslado",
      fechaInicio: "2025-09-20",
      fechaFin: "2025-09-20",
      destino: "Oaxaca de Juárez",
      descripcion: "Servicio de traslado cómodo y seguro desde el aeropuerto hasta tu hotel en la ciudad.",
      duracion: "45 min",
      participantes: 4,
      disponibles: 2,
      precio: "$280.00",
      hora: "14:30 PM",
      puntuacion: 4.9,
      incluye: ["Vehículo climatizado", "Conductor profesional", "Equipaje incluido"]
    },
    {
      id: 3,
      titulo: "Expedición Monte Albán",
      tipo: "tour",
      fechaInicio: "2025-09-25",
      fechaFin: "2025-09-25",
      destino: "Monte Albán, Oaxaca",
      descripcion: "Explora la antigua capital zapoteca con guías especializados en historia prehispánica.",
      duracion: "6 horas",
      participantes: 12,
      disponibles: 12,
      precio: "$950.00",
      hora: "08:00 AM",
      puntuacion: 4.7,
      incluye: ["Entrada al sitio", "Guía certificado", "Almuerzo", "Transporte"]
    },
    {
      id: 4,
      titulo: "Tour Pueblos Mancomunados",
      tipo: "tour",
      fechaInicio: "2025-10-02",
      fechaFin: "2025-10-04",
      destino: "Sierra Norte, Oaxaca",
      descripcion: "Aventura de 3 días en los pueblos mancomunados con actividades de ecoturismo y cultura local.",
      duracion: "3 días",
      participantes: 8,
      disponibles: 0,
      precio: "$2,500.00",
      hora: "07:00 AM",
      puntuacion: 4.9,
      incluye: ["Hospedaje", "Todas las comidas", "Actividades", "Guía local"]
    },
    {
      id: 5,
      titulo: "Traslado a Hierve el Agua",
      tipo: "traslado",
      fechaInicio: "2025-10-08",
      fechaFin: "2025-10-08",
      destino: "Hierve el Agua, Oaxaca",
      descripcion: "Transporte directo y cómodo hacia las cascadas petrificadas más famosas de Oaxaca.",
      duracion: "2 horas",
      participantes: 6,
      disponibles: 4,
      precio: "$450.00",
      hora: "09:00 AM",
      puntuacion: 4.6,
      incluye: ["Transporte ida y vuelta", "Paradas panorámicas", "Conductor guía"]
    }
  ];

  // Filtrar eventos según el filtro activo
  const eventosFiltrados = eventosMock.filter(evento => {
    // Primero filtrar por fecha si se proporcionan fechas
    if (fechaDesde && fechaHasta) {
      const fechaEvento = new Date(evento.fechaInicio);
      const fechaDesdeObj = new Date(fechaDesde);
      const fechaHastaObj = new Date(fechaHasta);
      
      // Si el evento no está en el rango de fechas, no lo incluir
      if (fechaEvento < fechaDesdeObj || fechaEvento > fechaHastaObj) {
        return false;
      }
    }
    
    // Luego filtrar por tipo según el filtro activo
    switch(filtroActivo) {
      case 'tours':
        return evento.tipo === 'tour';
      case 'traslados':
        return evento.tipo === 'traslado';
      default:
        return true;
    }
  });

  const totalEventos = eventosMock.length;
  const totalTours = eventosMock.filter(e => e.tipo === 'tour').length;
  const totalTraslados = eventosMock.filter(e => e.tipo === 'traslado').length;

  const filtros = [
    { id: 'todos', label: 'Todos', count: totalEventos, icono: <Filter size={16} /> },
    { id: 'tours', label: 'Tours', count: totalTours, icono: <Camera size={16} /> },
    { id: 'traslados', label: 'Traslados', count: totalTraslados, icono: <Car size={16} /> }
  ];

  const modalContent = (
    <div 
      className="modal-overlay-resultados" 
      onClick={onClose}
    >
      <div className="modal-resultados" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Principal */}
        <div className="resultados-header">
          <div className="header-contenido">
            <div className="header-info">
              <div className="icono-principal">
                <Calendar size={24} />
              </div>
              <div className="titulo-principal">
                <h2>Resultados Disponibles</h2>
                <span className="subtitulo-fechas">
                  {formatearFecha(fechaDesde)} - {formatearFecha(fechaHasta)}
                </span>
              </div>
            </div>
            <div className="contador-resultados">
              {totalEventos} {totalEventos === 1 ? 'resultado' : 'resultados'}
            </div>
            <button className="boton-cerrar" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filtros y Stats */}
        <div className="filtros-section">
          <div className="filtros-container">
            <div className="filtros-tabs">
              {filtros.map(filtro => (
                <button 
                  key={filtro.id}
                  className={`filtro-tab ${filtroActivo === filtro.id ? 'activo' : ''}`}
                  onClick={() => setFiltroActivo(filtro.id)}
                >
                  {filtro.icono}
                  <span>{filtro.label}</span>
                  <span className="tab-badge">{filtro.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Resultados */}
        <div className="resultados-contenido">
          {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((evento) => {
              const estadoDisponibilidad = obtenerEstadoDisponibilidad(evento.disponibles, evento.participantes);
              
              return (
                <div key={evento.id} className="tour-item">
                  <div className={`tour-icono ${evento.tipo}`}>
                    {obtenerIconoTipo(evento.tipo)}
                  </div>
                  
                  <div className="tour-contenido">
                    <div className="tour-header">
                      <h3 className="tour-titulo">{evento.titulo}</h3>
                      <div className="tour-meta">
                        <span className={`tipo-badge ${evento.tipo}`}>
                          {evento.tipo}
                        </span>
                        <span className="tour-precio">{evento.precio}</span>
                      </div>
                    </div>
                    
                    <p className="tour-descripcion">{evento.descripcion}</p>
                    
                    <div className="tour-detalles">
                      <div className="detalle-item">
                        <MapPin className="detalle-icono" size={16} />
                        <span>{evento.destino}</span>
                      </div>
                      <div className="detalle-item">
                        <Clock className="detalle-icono" size={16} />
                        <span>{evento.hora} • {evento.duracion}</span>
                      </div>
                      <div className="detalle-item">
                        <Users className="detalle-icono" size={16} />
                        <span>{evento.disponibles} de {evento.participantes} disponibles</span>
                      </div>
                      <div className="detalle-item">
                        <Star className="detalle-icono" size={16} />
                        <span>{evento.puntuacion} ★</span>
                      </div>
                    </div>
                    
                    <div className="tour-acciones">
                      <div className={`estado-indicator ${estadoDisponibilidad}`}>
                        {estadoDisponibilidad === 'disponible' && <Calendar size={16} />}
                        {estadoDisponibilidad === 'limitado' && <AlertCircle size={16} />}
                        {estadoDisponibilidad === 'completo' && <X size={16} />}
                        <span>
                          {estadoDisponibilidad === 'disponible' && 'Disponible'}
                          {estadoDisponibilidad === 'limitado' && 'Últimos lugares'}
                          {estadoDisponibilidad === 'completo' && 'Completo'}
                        </span>
                      </div>
                      
                      <button 
                        className="boton-seleccionar"
                        disabled={estadoDisponibilidad === 'completo'}
                        onClick={() => {
                          // Aquí iría la lógica para seleccionar el tour/traslado
                          console.log('Seleccionado:', evento.titulo);
                        }}
                      >
                        {estadoDisponibilidad === 'completo' ? 'No disponible' : 'Seleccionar'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="sin-resultados">
              <div className="sin-resultados-icono">
                <Calendar size={64} />
              </div>
              <h3>No se encontraron resultados</h3>
              <p>
                No hay {filtroActivo === 'todos' ? 'tours o traslados' : filtroActivo} disponibles 
                para las fechas seleccionadas.
                <br />
                Intenta ajustar tus filtros o seleccionar diferentes fechas.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="resultados-footer">
          <div className="footer-info">
            Mostrando <strong>{eventosFiltrados.length}</strong> de <strong>{totalEventos}</strong> resultados
          </div>
          <div className="footer-acciones">
            <button 
              className="boton-nueva-busqueda"
              onClick={onClose}
            >
              Nueva búsqueda
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalResultadosFechas;