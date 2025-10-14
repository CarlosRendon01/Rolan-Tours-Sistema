import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, UserCheck, Users, Plus, Phone } from 'lucide-react';
import './TablaGuias.css';

const TablaGuias = ({ 
  guias = [],
  setGuias,
  onVer, 
  onEditar, 
  onEliminar,
  onAgregar 
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const guiasFiltradas = guias.filter(guia => {
    const busqueda = terminoBusqueda.toLowerCase();
    const nombreCompleto = `${guia.nombre} ${guia.apellidoPaterno} ${guia.apellidoMaterno}`.toLowerCase();
    return (
      nombreCompleto.includes(busqueda) ||
      guia.id.toString().includes(busqueda) ||
      guia.correoElectronico.toLowerCase().includes(busqueda)
    );
  });

  const totalRegistros = guiasFiltradas.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const guiasPaginadas = guiasFiltradas.slice(indiceInicio, indiceFin);

  const totalGuias = guias.length;
  const guiasActivas = guias.filter(g => g.activo !== false).length;

  const formatearTelefono = (telefono) => {
    const limpio = telefono.replace(/\D/g, '');
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(3, 6)}-${limpio.substring(6)}`;
    }
    return telefono;
  };

  const obtenerIniciales = (nombre, apellidoP) => {
    return `${nombre.charAt(0)}${apellidoP.charAt(0)}`;
  };

  const obtenerClaseGenero = (genero) => {
    const generoLower = genero.toLowerCase();
    if (generoLower === 'masculino' || generoLower === 'm') return 'masculino';
    if (generoLower === 'femenino' || generoLower === 'f') return 'femenino';
    return 'otro';
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

  const manejarAccion = (accion, guia) => {
    switch (accion) {
      case 'ver':
        onVer(guia);
        break;
      case 'editar':
        onEditar(guia);
        break;
      case 'eliminar':
        onEliminar(guia);
        break;
      default:
        break;
    }
  };

  return (
    <div className="guias-contenedor-principal">
      <div className="guias-encabezado">
        <div className="guias-seccion-logo">
          <div className="guias-lineas-decorativas">
            <div className="guias-linea guias-azul"></div>
            <div className="guias-linea guias-verde"></div>
            <div className="guias-linea guias-amarilla"></div>
            <div className="guias-linea guias-morada"></div>
          </div>
          <h1 className="guias-titulo">Gestión de Guías Turísticos</h1>
        </div>
        
        <div className="guias-contenedor-estadisticas">
          <div className="guias-estadistica">
            <div className="guias-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="guias-info-estadistica">
              <span className="guias-label-estadistica">TOTAL: {totalGuias}</span>
            </div>
          </div>
          
          <div className="guias-estadistica">
            <div className="guias-icono-estadistica-cuadrado">
              <UserCheck size={20} />
            </div>
            <div className="guias-info-estadistica">
              <span className="guias-label-estadistica">ACTIVOS: {guiasActivas}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="guias-controles">
        <div className="guias-control-registros">
          <label htmlFor="registros">Mostrar</label>
          <select 
            id="registros"
            value={registrosPorPagina} 
            onChange={manejarCambioRegistros}
            className="guias-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="guias-controles-derecha">
          <button 
            className="guias-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo guía"
          >
            <Plus size={18} />
            Agregar Guía
          </button>

          <div className="guias-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="guias-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar guía..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="guias-entrada-buscar"
              />
              <Search className="guias-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {guiasPaginadas.length === 0 ? (
        <div className="guias-estado-vacio">
          <div className="guias-icono-vacio">
            <Users size={80} strokeWidth={1.5} />
          </div>
          <p className="guias-mensaje-vacio">No se encontraron guías turísticos</p>
          <p className="guias-submensaje-vacio">
            {terminoBusqueda 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza agregando un guía turístico a tu equipo'}
          </p>
        </div>
      ) : (
        <>
          <div className="guias-contenedor-tabla">
            <table className="guias-tabla">
              <thead>
                <tr className="guias-fila-encabezado">
                  <th>ID</th>
                  <th>NOMBRE COMPLETO</th>
                  <th>EDAD</th>
                  <th>GÉNERO</th>
                  <th>TELÉFONO</th>
                  <th>IDIOMAS</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {guiasPaginadas.map((guia, index) => (
                  <tr 
                    key={guia.id} 
                    className="guias-fila-guia"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td data-label="ID" className="guias-columna-id">
                      <span className="guias-badge-id">
                        #{guia.id.toString().padStart(3, '0')}
                      </span>
                    </td>
                    
                    <td data-label="Nombre Completo" className="guias-columna-nombre">
                      <div className="guias-info-guia">
                        <div className="guias-avatar">
                          {obtenerIniciales(guia.nombre, guia.apellidoPaterno)}
                        </div>
                        <div className="guias-datos-guia">
                          <span className="guias-nombre-principal">
                            {guia.nombre} {guia.apellidoPaterno} {guia.apellidoMaterno}
                          </span>
                          <span className="guias-subtexto">{guia.correoElectronico}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td data-label="Edad" className="guias-columna-edad">
                      <span className="guias-badge-edad">
                        {guia.edad} años
                      </span>
                    </td>
                    
                    <td data-label="Género" className="guias-columna-genero">
                      <span className={`guias-badge-genero ${obtenerClaseGenero(guia.genero)}`}>
                        {guia.genero}
                      </span>
                    </td>
                    
                    <td data-label="Teléfono" className="guias-columna-telefono">
                      <span className="guias-valor-telefono">
                        <Phone size={14} />
                        {formatearTelefono(guia.telefonoPersonal)}
                      </span>
                    </td>
                    
                    <td data-label="Idiomas" className="guias-columna-idiomas">
                      <div className="guias-badge-idiomas">
                        {guia.idiomas && guia.idiomas.map((idioma, idx) => (
                          <span key={idx} className="guias-idioma-tag">
                            {idioma}
                          </span>
                        ))}
                      </div>
                    </td>
                    
                    <td data-label="Acciones" className="guias-columna-acciones">
                      <div className="guias-botones-accion">
                        <button 
                          className="guias-boton-accion guias-ver"
                          onClick={() => manejarAccion('ver', guia)}
                          title="Ver guía"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="guias-boton-accion guias-editar"
                          onClick={() => manejarAccion('editar', guia)}
                          title="Editar guía"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="guias-boton-accion guias-eliminar"
                          onClick={() => manejarAccion('eliminar', guia)}
                          title="Eliminar guía"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="guias-pie-tabla">
            <div className="guias-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{color: '#6c757d', marginLeft: '0.5rem'}}>
                  (filtrado de {guias.length} registros totales)
                </span>
              )}
            </div>
            
            <div className="guias-controles-paginacion">
              <button 
                className="guias-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              
              <div className="guias-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`guias-numero-pagina ${paginaActual === numero ? 'guias-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>
              
              <button 
                className="guias-boton-paginacion"
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

export default TablaGuias;