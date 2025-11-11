import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, UserCheck, Users, Plus, Phone, MapPin } from 'lucide-react';
import './TablaCoordinadores.css';

const TablaCoordinadores = ({ 
  coordinadores,
  setCoordinadores,
  onVer, 
  onEditar, 
  onEliminar,
  onAgregar 
}) => {
  // Estados locales para UI
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Filtrar coordinadores por búsqueda
  const coordinadoresFiltrados = coordinadores.filter(coordinador => {
    const busqueda = terminoBusqueda.toLowerCase();
    const nombreCompleto = `${coordinador.nombre} ${coordinador.apellido_paterno} ${coordinador.apellido_materno}`.toLowerCase();
    return (
      nombreCompleto.includes(busqueda) ||
      coordinador.id.toString().includes(busqueda) ||
      coordinador.email?.toLowerCase().includes(busqueda) ||
      coordinador.ciudad?.toLowerCase().includes(busqueda)
    );
  });

  // Calcular paginación
  const totalRegistros = coordinadoresFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const coordinadoresPaginados = coordinadoresFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const totalCoordinadores = coordinadores.length;
  const coordinadoresActivos = coordinadores.filter(coord => 
    coord.certificacion_oficial === true || coord.certificacion_oficial === 'Sí'
  ).length;

  // Función para formatear teléfono
  const formatearTelefono = (telefono) => {
    const limpio = telefono?.replace(/\D/g, '') || '';
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(3, 6)}-${limpio.substring(6)}`;
    }
    return telefono || 'N/A';
  };

  // Función para obtener iniciales
  const obtenerIniciales = (nombre, apellidoP) => {
    return `${nombre?.charAt(0) || ''}${apellidoP?.charAt(0) || ''}`.toUpperCase();
  };

  // Función para calcular edad desde fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Función para obtener badge de experiencia
  const obtenerBadgeExperiencia = (anos) => {
    if (!anos || anos < 1) return { clase: 'junior', texto: 'Junior' };
    if (anos < 3) return { clase: 'intermedio', texto: 'Intermedio' };
    if (anos < 5) return { clase: 'senior', texto: 'Senior' };
    return { clase: 'experto', texto: 'Experto' };
  };

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

  const manejarAccion = (accion, coordinador) => {
    switch (accion) {
      case 'ver':
        onVer(coordinador);
        break;
      case 'editar':
        onEditar(coordinador);
        break;
      case 'eliminar':
        onEliminar(coordinador);
        break;
      default:
        break;
    }
  };

  return (
    <div className="coord-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="coord-encabezado">
        <div className="coord-seccion-logo">
          <div className="coord-lineas-decorativas">
            <div className="coord-linea coord-azul"></div>
            <div className="coord-linea coord-verde"></div>
            <div className="coord-linea coord-amarilla"></div>
            <div className="coord-linea coord-roja"></div>
          </div>
          <h1 className="coord-titulo">Gestión de Coordinadores</h1>
        </div>
        
        {/* Estadísticas */}
        <div className="coord-contenedor-estadisticas">
          <div className="coord-estadistica">
            <div className="coord-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="coord-info-estadistica">
              <span className="coord-label-estadistica">TOTAL: {totalCoordinadores}</span>
            </div>
          </div>
          
          <div className="coord-estadistica">
            <div className="coord-icono-estadistica-cuadrado">
              <UserCheck size={20} />
            </div>
            <div className="coord-info-estadistica">
              <span className="coord-label-estadistica">CERTIFICADOS: {coordinadoresActivos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="coord-controles">
        <div className="coord-control-registros">
          <label htmlFor="coord-registros">Mostrar</label>
          <select 
            id="coord-registros"
            value={registrosPorPagina} 
            onChange={manejarCambioRegistros}
            className="coord-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="coord-controles-derecha">
          <button 
            className="coord-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo coordinador"
          >
            <Plus size={18} />
            Agregar Coordinador
          </button>

          <div className="coord-control-busqueda">
            <label htmlFor="coord-buscar">Buscar:</label>
            <div className="coord-entrada-busqueda">
              <input
                type="text"
                id="coord-buscar"
                placeholder="Buscar coordinador..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="coord-entrada-buscar"
              />
              <Search className="coord-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {coordinadoresPaginados.length === 0 ? (
        <div className="coord-estado-vacio">
          <div className="coord-icono-vacio">
            <Users size={80} strokeWidth={1.5} />
          </div>
          <p className="coord-mensaje-vacio">No se encontraron coordinadores</p>
          <p className="coord-submensaje-vacio">
            {terminoBusqueda 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza agregando un coordinador a tu equipo'}
          </p>
        </div>
      ) : (
        <>
          <div className="coord-contenedor-tabla">
            <table className="coord-tabla">
              <thead>
                <tr className="coord-fila-encabezado">
                  <th>ID</th>
                  <th>NOMBRE COMPLETO</th>
                  <th>EDAD</th>
                  <th>TELÉFONO</th>
                  <th>UBICACIÓN</th>
                  <th>EXPERIENCIA</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {coordinadoresPaginados.map((coordinador, index) => {
                  const badgeExperiencia = obtenerBadgeExperiencia(coordinador.experiencia_anos);
                  const edad = calcularEdad(coordinador.fecha_nacimiento);
                  
                  return (
                    <tr 
                      key={coordinador.id} 
                      className="coord-fila-coordinador"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td data-label="ID" className="coord-columna-id">
                        <span className="coord-badge-id">
                          #{coordinador.id.toString().padStart(3, '0')}
                        </span>
                      </td>
                      
                      <td data-label="Nombre Completo" className="coord-columna-nombre">
                        <div className="coord-info-coordinador">
                          <div className="coord-avatar">
                            {obtenerIniciales(coordinador.nombre, coordinador.apellido_paterno)}
                          </div>
                          <div className="coord-datos-coordinador">
                            <span className="coord-nombre-principal">
                              {coordinador.nombre} {coordinador.apellido_paterno} {coordinador.apellido_materno}
                            </span>
                            <span className="coord-subtexto">{coordinador.email || 'Sin email'}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td data-label="Edad" className="coord-columna-edad">
                        <span className="coord-badge-edad">
                          {edad} años
                        </span>
                      </td>
                      
                      <td data-label="Teléfono" className="coord-columna-telefono">
                        <span className="coord-valor-telefono">
                          <Phone size={14} />
                          {formatearTelefono(coordinador.telefono)}
                        </span>
                      </td>
                      
                      <td data-label="Ubicación" className="coord-columna-ubicacion">
                        <span className="coord-valor-ubicacion">
                          <MapPin size={14} />
                          {coordinador.ciudad || 'N/A'}, {coordinador.estado || 'N/A'}
                        </span>
                      </td>
                      
                      <td data-label="Experiencia" className="coord-columna-experiencia">
                        <span className={`coord-badge-experiencia ${badgeExperiencia.clase}`}>
                          {badgeExperiencia.texto}
                        </span>
                        <div className="coord-subtexto" style={{ marginTop: '0.25rem' }}>
                          {coordinador.experiencia_anos || 0} años
                        </div>
                      </td>
                      
                      <td data-label="Acciones" className="coord-columna-acciones">
                        <div className="coord-botones-accion">
                          <button 
                            className="coord-boton-accion coord-ver"
                            onClick={() => manejarAccion('ver', coordinador)}
                            title="Ver coordinador"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="coord-boton-accion coord-editar"
                            onClick={() => manejarAccion('editar', coordinador)}
                            title="Editar coordinador"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="coord-boton-accion coord-eliminar"
                            onClick={() => manejarAccion('eliminar', coordinador)}
                            title="Eliminar coordinador"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Información de paginación y controles */}
          <div className="coord-pie-tabla">
            <div className="coord-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{color: '#6c757d', marginLeft: '0.5rem'}}>
                  (filtrado de {coordinadores.length} registros totales)
                </span>
              )}
            </div>
            
            <div className="coord-controles-paginacion">
              <button 
                className="coord-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              
              <div className="coord-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`coord-numero-pagina ${paginaActual === numero ? 'coord-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>
              
              <button 
                className="coord-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TablaCoordinadores;