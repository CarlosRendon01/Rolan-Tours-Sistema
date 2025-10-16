import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Users, BarChart3, RotateCcw } from 'lucide-react';
import ModalVerOrden from './Modales/ModalVerOrden';
import ModalEditarOrden from './Modales/ModalEditarOrden';
import ModalEliminarOrden from './Modales/ModalEliminarOrden';
import ModalRestaurarOrden from './Modales/ModalRestaurarOrden';
import ModalEliminarDefinitivo from './Modales/ModalEliminarDefinitivo';
import './TablaOrdenes.css';

const TablaOrdenes = () => {
  // CAMBIAR ESTO SEGÚN EL ROL DEL USUARIO LOGUEADO
  // true = Administrador, false = Usuario normal
  const [esAdministrador, setEsAdministrador] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Estados para los modales
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);
  const [ordenARestaurar, setOrdenARestaurar] = useState(null);
  const [ordenAEliminarDefinitivo, setOrdenAEliminarDefinitivo] = useState(null);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState(null);

  // Estado para los datos de Ordenes - AHORA CON CAMPO "activo"
  const [datosOrdenes, setDatosOrdenes] = useState([
    {
      id: 1,
      fechaSalida: '2025-10-20',
      fechaRegreso: '2025-10-22',
      horaSalida: '08:00',
      horaRegreso: '18:00',
      pasajeros: '15',
      origenServicio: 'Oaxaca Centro',
      puntoIntermedio: 'Tlacolula',
      destinoServicio: 'Puerto Escondido',
      fecha_registro: '02/09/2025',
      activo: true
    },
    {
      id: 2,
      fechaSalida: '2025-10-25',
      fechaRegreso: '2025-10-27',
      horaSalida: '09:00',
      horaRegreso: '19:00',
      pasajeros: '20',
      origenServicio: 'Oaxaca Aeropuerto',
      puntoIntermedio: 'Ocotlán',
      destinoServicio: 'Huatulco',
      fecha_registro: '02/09/2025',
      activo: true
    },
    {
      id: 3,
      fechaSalida: '2025-10-28',
      fechaRegreso: '2025-10-30',
      horaSalida: '07:30',
      horaRegreso: '17:30',
      pasajeros: '12',
      origenServicio: 'Oaxaca Centro',
      puntoIntermedio: '',
      destinoServicio: 'Hierve el Agua',
      fecha_registro: '02/09/2025',
      activo: false
    },
    {
      id: 4,
      fechaSalida: '2025-11-01',
      fechaRegreso: '2025-11-03',
      horaSalida: '10:00',
      horaRegreso: '20:00',
      pasajeros: '18',
      origenServicio: 'Hotel Casa Oaxaca',
      puntoIntermedio: 'Teotitlán del Valle',
      destinoServicio: 'Monte Albán',
      fecha_registro: '02/09/2025',
      activo: true
    },
    {
      id: 5,
      fechaSalida: '2025-11-05',
      fechaRegreso: '2025-11-07',
      horaSalida: '08:30',
      horaRegreso: '18:30',
      pasajeros: '25',
      origenServicio: 'Oaxaca Terminal ADO',
      puntoIntermedio: 'Mitla',
      destinoServicio: 'Zipolite',
      fecha_registro: '03/09/2025',
      activo: false
    },
    {
      id: 6,
      fechaSalida: '2025-11-10',
      fechaRegreso: '2025-11-12',
      horaSalida: '06:00',
      horaRegreso: '16:00',
      pasajeros: '10',
      origenServicio: 'Oaxaca Centro',
      puntoIntermedio: '',
      destinoServicio: 'San José del Pacífico',
      fecha_registro: '03/09/2025',
      activo: true
    },
    {
      id: 7,
      fechaSalida: '2025-11-15',
      fechaRegreso: '2025-11-17',
      horaSalida: '09:30',
      horaRegreso: '19:30',
      pasajeros: '22',
      origenServicio: 'Oaxaca Aeropuerto',
      puntoIntermedio: 'Zaachila',
      destinoServicio: 'Mazunte',
      fecha_registro: '04/09/2025',
      activo: true
    },
    {
      id: 8,
      fechaSalida: '2025-11-20',
      fechaRegreso: '2025-11-22',
      horaSalida: '07:00',
      horaRegreso: '17:00',
      pasajeros: '14',
      origenServicio: 'Hotel Quinta Real',
      puntoIntermedio: 'Santa María del Tule',
      destinoServicio: 'Benito Juárez',
      fecha_registro: '04/09/2025',
      activo: true
    },
    {
      id: 9,
      fechaSalida: '2025-11-25',
      fechaRegreso: '2025-11-27',
      horaSalida: '08:00',
      horaRegreso: '18:00',
      pasajeros: '16',
      origenServicio: 'Oaxaca Centro',
      puntoIntermedio: '',
      destinoServicio: 'Chacahua',
      fecha_registro: '05/09/2025',
      activo: true
    },
    {
      id: 10,
      fechaSalida: '2025-12-01',
      fechaRegreso: '2025-12-03',
      horaSalida: '10:30',
      horaRegreso: '20:30',
      pasajeros: '30',
      origenServicio: 'Oaxaca Terminal',
      puntoIntermedio: 'Zimatlán',
      destinoServicio: 'Puerto Ángel',
      fecha_registro: '05/09/2025',
      activo: true
    }
  ]);

  // Filtrar Ordenes según rol y búsqueda
  const ordenesFiltrados = datosOrdenes.filter(orden => {
    // FILTRO POR ROL
    if (!esAdministrador && !orden.activo) {
      // Los usuarios normales NO ven los inactivos
      return false;
    }
    // Si es admin, ve TODOS (activos e inactivos juntos)

    // FILTRO DE BÚSQUEDA
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      orden.id.toString().includes(busqueda) ||
      (orden.origenServicio && orden.origenServicio.toLowerCase().includes(busqueda)) ||
      (orden.destinoServicio && orden.destinoServicio.toLowerCase().includes(busqueda)) ||
      (orden.puntoIntermedio && orden.puntoIntermedio.toLowerCase().includes(busqueda)) ||
      (orden.pasajeros && orden.pasajeros.toString().includes(busqueda)) ||
      (orden.fechaSalida && orden.fechaSalida.includes(busqueda))
    );
  });

  // Calcular paginación
  const totalRegistros = ordenesFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const ordenesPaginados = ordenesFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const ordenesActivos = datosOrdenes.filter(c => c.activo).length;
  const ordenesInactivos = datosOrdenes.filter(c => !c.activo).length;

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

  const manejarAccion = (accion, orden) => {
    switch (accion) {
      case 'ver':
        setOrdenSeleccionado(orden);
        setModalVerAbierto(true);
        break;
      case 'editar':
        setOrdenSeleccionado(orden);
        setModalEditarAbierto(true);
        break;
      case 'eliminar':
        // Si es admin y el orden está inactivo, mostrar modal de eliminar definitivo
        if (esAdministrador && !orden.activo) {
          setOrdenAEliminarDefinitivo(orden);
        } else {
          // Si no, mostrar modal de desactivar (ModalEliminarOrden)
          setOrdenAEliminar(orden);
        }
        break;
      case 'restaurar':
        setOrdenARestaurar(orden);
        break;
      default:
        break;
    }
  };

  const cerrarModalVer = () => {
    setModalVerAbierto(false);
    setOrdenSeleccionado(null);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setOrdenSeleccionado(null);
  };

  const manejarGuardarOrden = async (datosActualizados) => {
    try {
      // Actualizar el orden en el estado
      setDatosOrdenes(datosOrdenes.map(orden =>
        orden.id === datosActualizados.id ? datosActualizados : orden
      ));

      console.log('Orden actualizada:', datosActualizados);
      return Promise.resolve();
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      throw error;
    }
  };

  const manejarEliminarOrden = async (orden) => {
    if (!orden) {
      // Cancelar eliminación
      setOrdenAEliminar(null);
      return;
    }

    try {
      // SOFT DELETE: Marcar como inactivo
      setDatosOrdenes(datosOrdenes.map(c =>
        c.id === orden.id ? { ...c, activo: false } : c
      ));

      setOrdenAEliminar(null);
      console.log('Orden DESACTIVADA:', orden);
      return Promise.resolve();
    } catch (error) {
      console.error('Error al desactivar orden:', error);
      setOrdenAEliminar(null);
      throw error;
    }
  };

  const manejarRestaurar = async (orden) => {
    try {
      // Restaurar orden (marcarlo como activo)
      setDatosOrdenes(datosOrdenes.map(c =>
        c.id === orden.id ? { ...c, activo: true } : c
      ));

      setOrdenARestaurar(null);
      console.log('Orden RESTAURADA:', orden);
    } catch (error) {
      console.error('Error al restaurar orden:', error);
    }
  };

  const manejarEliminarDefinitivo = async (orden) => {
    try {
      // Eliminar definitivamente del sistema
      setDatosOrdenes(datosOrdenes.filter(c => c.id !== orden.id));

      setOrdenAEliminarDefinitivo(null);
      console.log('Orden eliminada DEFINITIVAMENTE:', orden);
    } catch (error) {
      console.error('Error al eliminar definitivamente orden:', error);
    }
  };

  return (
    <div className="Ordenes-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="Ordenes-encabezado">
        <div className="Ordenes-seccion-logo">
          <div className="Ordenes-lineas-decorativas">
            <div className="Ordenes-linea Ordenes-roja"></div>
            <div className="Ordenes-linea Ordenes-azul"></div>
            <div className="Ordenes-linea Ordenes-verde"></div>
            <div className="Ordenes-linea Ordenes-amarilla"></div>
          </div>
          <h1 className="Ordenes-titulo">Gestión de Órdenes</h1>
          {/* Badge de rol */}
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '600',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            marginLeft: '1rem'
          }}>
            {esAdministrador ? 'ADMINISTRADOR' : 'USUARIO'}
          </span>
        </div>

        {/* Estadísticas */}
        <div className="Ordenes-contenedor-estadisticas">
          <div className="Ordenes-estadistica">
            <div className="Ordenes-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="Ordenes-info-estadistica">
              <span className="Ordenes-label-estadistica">ACTIVAS: {ordenesActivos}</span>
            </div>
          </div>

          {esAdministrador && (
            <div className="Ordenes-estadistica">
              <div className="Ordenes-icono-estadistica-cuadrado">
                <BarChart3 size={20} />
              </div>
              <div className="Ordenes-info-estadistica">
                <span className="Ordenes-label-estadistica">INACTIVAS: {ordenesInactivos}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="Ordenes-controles">
        <div className="Ordenes-control-registros">
          {/* BOTÓN PARA CAMBIAR DE ROL (SOLO PARA PRUEBAS - ELIMINAR EN PRODUCCIÓN) */}
          <button
            onClick={() => setEsAdministrador(!esAdministrador)}
            style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #17a2b8, #138496)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              marginRight: '1rem'
            }}
          >
            Cambiar a {esAdministrador ? 'Usuario' : 'Admin'}
          </button>

          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="Ordenes-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="Ordenes-controles-derecha">
          <div className="Ordenes-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="Ordenes-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar orden..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="Ordenes-entrada-buscar"
              />
              <Search className="Ordenes-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="Ordenes-contenedor-tabla">
        <table className="Ordenes-tabla">
          <thead>
            <tr className="Ordenes-fila-encabezado">
              <th>ID</th>
              <th>FECHA SALIDA</th>
              <th>FECHA REGRESO</th>
              <th>HORA SALIDA</th>
              <th>HORA REGRESO</th>
              <th>ORIGEN</th>
              <th>DESTINO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {ordenesPaginados.map((orden, index) => (
              <tr
                key={orden.id}
                className="Ordenes-fila-orden"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: orden.activo ? 'white' : '#f8d7da'
                }}
              >
                <td data-label="ID" className="Ordenes-columna-id">
                  <span className="Ordenes-badge-id">#{orden.id.toString().padStart(3, '0')}</span>
                </td>
                <td data-label="Fecha Salida" className="Ordenes-columna-fecha">
                  <span className="Ordenes-fecha">{new Date(orden.fechaSalida).toLocaleDateString('es-MX')}</span>
                </td>
                <td data-label="Fecha Regreso" className="Ordenes-columna-fecha">
                  <span className="Ordenes-fecha">{new Date(orden.fechaRegreso).toLocaleDateString('es-MX')}</span>
                </td>
                <td data-label="Hora Salida" className="Ordenes-columna-hora">
                  <span className="Ordenes-badge-hora">{orden.horaSalida}</span>
                </td>
                <td data-label="Hora Regreso" className="Ordenes-columna-hora">
                  <span className="Ordenes-badge-hora">{orden.horaRegreso}</span>
                </td>
                <td data-label="Origen" className="Ordenes-columna-origen">
                  <span className="Ordenes-ubicacion">{orden.origenServicio}</span>
                </td>
                <td data-label="Destino" className="Ordenes-columna-destino">
                  <span className="Ordenes-ubicacion">{orden.destinoServicio}</span>
                </td>
                <td data-label="Acciones" className="Ordenes-columna-acciones">
                  <div className="Ordenes-botones-accion">
                    <button
                      className="Ordenes-boton-accion Ordenes-ver"
                      onClick={() => manejarAccion('ver', orden)}
                      title="Ver orden"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="Ordenes-boton-accion Ordenes-editar"
                      onClick={() => manejarAccion('editar', orden)}
                      title="Editar orden"
                    >
                      <Edit size={16} />
                    </button>

                    {/* Botón RESTAURAR solo para admin con órdenes inactivas */}
                    {esAdministrador && !orden.activo && (
                      <button
                        className="Ordenes-boton-accion Ordenes-restaurar"
                        onClick={() => manejarAccion('restaurar', orden)}
                        title="Restaurar orden"
                        style={{
                          background: 'linear-gradient(45deg, #28a745, #218838)',
                          color: 'white'
                        }}
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}

                    <button
                      className="Ordenes-boton-accion Ordenes-eliminar"
                      onClick={() => manejarAccion('eliminar', orden)}
                      title={esAdministrador && !orden.activo ? 'Eliminar definitivamente' : 'Desactivar orden'}
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

      {/* Información de paginación y controles */}
      <div className="Ordenes-pie-tabla">
        <div className="Ordenes-informacion-registros">
          Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
          {terminoBusqueda && (
            <span style={{ color: '#6c757d', marginLeft: '0.5rem' }}>
              (filtrado de {datosOrdenes.length} registros totales)
            </span>
          )}
        </div>

        <div className="Ordenes-controles-paginacion">
          <button
            className="Ordenes-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          <div className="Ordenes-numeros-paginacion">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
              <button
                key={numero}
                className={`Ordenes-numero-pagina ${paginaActual === numero ? 'Ordenes-activo' : ''}`}
                onClick={() => cambiarPagina(numero)}
              >
                {numero}
              </button>
            ))}
          </div>

          <button
            className="Ordenes-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Modal Ver orden */}
      <ModalVerOrden
        estaAbierto={modalVerAbierto}
        orden={ordenSeleccionado}
        alCerrar={cerrarModalVer}
      />

      {/* Modal Editar orden */}
      <ModalEditarOrden
        estaAbierto={modalEditarAbierto}
        orden={ordenSeleccionado}
        alCerrar={cerrarModalEditar}
        alGuardar={manejarGuardarOrden}
      />

      {/* Modal Eliminar orden (Desactivar) */}
      {ordenAEliminar && (
        <ModalEliminarOrden
          orden={ordenAEliminar}
          alConfirmar={manejarEliminarOrden}
          esAdministrador={esAdministrador}
        />
      )}

      {/* Modal Restaurar orden */}
      {ordenARestaurar && (
        <ModalRestaurarOrden
          orden={ordenARestaurar}
          alConfirmar={manejarRestaurar}
          alCancelar={() => setOrdenARestaurar(null)}
        />
      )}

      {/* Modal Eliminar Definitivamente */}
      {ordenAEliminarDefinitivo && (
        <ModalEliminarDefinitivo
          orden={ordenAEliminarDefinitivo}
          alConfirmar={manejarEliminarDefinitivo}
          alCancelar={() => setOrdenAEliminarDefinitivo(null)}
        />
      )}
    </div>
  );
};

export default TablaOrdenes;