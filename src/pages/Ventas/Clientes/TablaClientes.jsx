import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Users, BarChart3, RotateCcw } from 'lucide-react';
import ModalVerCliente from './Modales/ModalVerCliente';
import ModalEditarCliente from './Modales/ModalEditarCliente';
import ModalEliminarCliente from './Modales/ModalEliminarCliente';
import ModalRestaurarCliente from './Modales/ModalRestaurarCliente';
import ModalEliminarDefinitivo from './Modales/ModalEliminarDefinitivo';
import './TablaClientes.css';

const TablaClientes = () => {
  const [permisos, setPermisos] = useState([]);
  const [roles, setRoles] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  // Estados para los modales
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clienteARestaurar, setClienteARestaurar] = useState(null);
  const [clienteAEliminarDefinitivo, setClienteAEliminarDefinitivo] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Estado para los datos de clientes - AHORA CON CAMPO "activo"
  const [datosClientes, setDatosClientes] = useState([]);

  // ✅ Cargar permisos y roles del usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token, redirigir al login');
      setCargando(false);
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Datos del usuario:', userData); // ✅ Para debugging
      setPermisos(userData.permisos || []);
      setRoles(userData.roles || []);
      cargarClientes();
    } catch (error) {
      console.error('Error al parsear usuario de localStorage:', error);
      setCargando(false);
    }
  }, []);

  // ✅ Función para verificar si el usuario tiene un permiso
  const tienePermiso = (permiso) => {
    return permisos.includes(permiso);
  };

  // ✅ Verificar si el usuario es administrador
  const esAdministrador = roles.includes('admin');

  // ✅ Cargar clientes desde el backend
  const cargarClientes = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No hay token disponible');
        setCargando(false);
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/clientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('Clientes cargados:', response.data);
      setDatosClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      if (error.response?.status === 401) {
        // Token inválido o expirado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirigir al login
      } else {
        alert('Error al cargar clientes: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setCargando(false);
    }
  };

  const manejarGuardarCliente = async (datosActualizados) => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://127.0.0.1:8000/api/clientes/${datosActualizados.id}`,
        datosActualizados,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Recargar clientes después de actualizar
      await cargarClientes();
      cerrarModalEditar();
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      alert(error.response?.data?.error || 'Error al actualizar cliente');
      throw error;
    }
  };

  // ✅ Desactivar cliente (Soft Delete)
  const manejarEliminarCliente = async (cliente) => {
    if (!cliente) {
      setClienteAEliminar(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `http://127.0.0.1:8000/api/clientes/${cliente.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setClienteAEliminar(null);
      await cargarClientes();
    } catch (error) {
      console.error('Error al desactivar cliente:', error);
      alert(error.response?.data?.error || 'Error al desactivar cliente');
      setClienteAEliminar(null);
      throw error;
    }
  };

  // ✅ Restaurar cliente
  const manejarRestaurar = async (cliente) => {
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        `http://127.0.0.1:8000/api/clientes/${cliente.id}/restore`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setClienteARestaurar(null);
      await cargarClientes();
    } catch (error) {
      console.error('Error al restaurar cliente:', error);
      alert(error.response?.data?.error || 'Error al restaurar cliente');
    }
  };

  // ✅ Eliminar definitivamente
  const manejarEliminarDefinitivo = async (cliente) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `http://127.0.0.1:8000/api/clientes/${cliente.id}/force`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setClienteAEliminarDefinitivo(null);
      await cargarClientes();
    } catch (error) {
      console.error('Error al eliminar definitivamente cliente:', error);
      alert(error.response?.data?.error || 'Error al eliminar definitivamente cliente');
    }
  };

  // Filtrar clientes según rol y búsqueda
  const clientesFiltrados = datosClientes.filter(cliente => {
    if (!cliente || !cliente.nombre) return false;
    // FILTRO POR ROL
    if (!esAdministrador && !cliente.activo) {
      // Los clientes normales NO ven los inactivos
      return false;
    }
    // Si es admin, ve TODOS (activos e inactivos juntos)

    // FILTRO DE BÚSQUEDA
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      cliente.nombre.toLowerCase().includes(busqueda) ||
      cliente.id.toString().includes(busqueda) ||
      (cliente.telefono && cliente.telefono.toLowerCase().includes(busqueda)) ||
      (cliente.email && cliente.email.toLowerCase().includes(busqueda)) ||
      (cliente.numero_lead && cliente.numero_lead.toLowerCase().includes(busqueda)) ||
      (cliente.canal_contacto && cliente.canal_contacto.toLowerCase().includes(busqueda))
    );
  });

  // Calcular paginación
  const totalRegistros = clientesFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const clientesPaginados = clientesFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const clientesActivos = datosClientes.filter(c => c.activo).length;
  const clientesInactivos = datosClientes.filter(c => !c.activo).length;

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

  const manejarAccion = (accion, cliente) => {
    switch (accion) {
      case 'ver':
        setClienteSeleccionado(cliente);
        setModalVerAbierto(true);
        break;
      case 'editar':
        setClienteSeleccionado(cliente);
        setModalEditarAbierto(true);
        break;
      case 'eliminar':
        // Si es admin y el cliente está inactivo, mostrar modal de eliminar definitivo
        if (esAdministrador && !cliente.activo) {
          setClienteAEliminarDefinitivo(cliente);
        } else {
          // Si no, mostrar modal de desactivar (ModalEliminarCliente)
          setClienteAEliminar(cliente);
        }
        break;
      case 'restaurar':
        setClienteARestaurar(cliente);
        break;
      default:
        break;
    }
  };

  const cerrarModalVer = () => {
    setModalVerAbierto(false);
    setClienteSeleccionado(null);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setClienteSeleccionado(null);
  };


  // ✅ Si no hay token, mostrar mensaje
  if (!localStorage.getItem('token')) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>
          <h2>Por favor, inicia sesión</h2>
          <p>Debes iniciar sesión para acceder a esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="clientes-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="clientes-encabezado">
        <div className="clientes-seccion-logo">
          <div className="clientes-lineas-decorativas">
            <div className="clientes-linea clientes-roja"></div>
            <div className="clientes-linea clientes-azul"></div>
            <div className="clientes-linea clientes-verde"></div>
            <div className="clientes-linea clientes-amarilla"></div>
          </div>
          <h1 className="clientes-titulo">Gestión de Clientes</h1>
        </div>

        {/* Estadísticas */}
        <div className="clientes-contenedor-estadisticas">
          <div className="clientes-estadistica">
            <div className="clientes-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="clientes-info-estadistica">
              <span className="clientes-label-estadistica">ACTIVOS: {clientesActivos}</span>
            </div>
          </div>
          {esAdministrador && (
            <div className="clientes-estadistica">
              <div className="clientes-icono-estadistica-cuadrado">
                <BarChart3 size={20} />
              </div>
              <div className="clientes-info-estadistica">
                <span className="clientes-label-estadistica">INACTIVOS: {clientesInactivos}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="clientes-controles">
        <div className="clientes-control-registros">
          {/* BOTÓN PARA CAMBIAR DE ROL (SOLO PARA PRUEBAS - ELIMINAR EN PRODUCCIÓN) */}
          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="clientes-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="clientes-controles-derecha">
          <div className="clientes-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="clientes-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar cliente..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="clientes-entrada-buscar"
              />
              <Search className="clientes-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="clientes-contenedor-tabla">
        <table className="clientes-tabla">
          <thead>
            <tr className="clientes-fila-encabezado">
              <th>ID</th>
              <th>NOMBRE</th>
              {/* <th>EMAIL</th> */}
              <th>TELÉFONO</th>
              <th>NÚMERO LEAD</th>
              <th>CANAL CONTACTO</th>
              <th>FECHA REGISTRO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {clientesPaginados.map((cliente, index) => (
              <tr
                key={cliente.id}
                className="clientes-fila-cliente"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: cliente.activo ? 'white' : '#f8d7da'
                }}
              >
                <td data-label="ID" className="clientes-columna-id">
                  <span className="clientes-badge-id">#{cliente.id.toString().padStart(3, '0')}</span>
                </td>
                <td data-label="Nombre" className="clientes-columna-nombre">
                  <div className="clientes-info-usuario">
                    <div className="clientes-avatar">
                      <Users size={16} />
                    </div>
                    <div className="clientes-datos-usuario">
                      <span className="clientes-nombre-principal">{cliente.nombre}</span>
                      <span className="clientes-subtexto">
                        {cliente.activo ? 'Cliente activo' : 'Cliente inactivo'}
                      </span>
                    </div>
                  </div>
                </td>
                {/* <td data-label="Email" className="clientes-columna-email">
                  <a href={`mailto:${cliente.email}`} className="clientes-enlace-email">
                    {cliente.email}
                  </a>
                </td> */}
                <td data-label="Teléfono" className="clientes-columna-telefono">
                  <span className="clientes-telefono">{cliente.telefono}</span>
                </td>
                <td data-label="Número Lead" className="clientes-columna-lead">
                  <span className="clientes-badge-lead">{cliente.numero_lead}</span>
                </td>
                <td data-label="Canal Contacto" className="clientes-columna-canal">
                  <span className={`clientes-badge-canal ${cliente.canal_contacto ? `clientes-canal-${cliente.canal_contacto.toLowerCase().replace(' ', '-')}` : 'clientes-canal-sin-datos'}`}>
                    {cliente.canal_contacto || 'Sin canal'}
                  </span>
                </td>
                <td data-label="Fecha Registro" className="clientes-columna-fecha">
                  <span className="clientes-fecha">{cliente.fecha_registro}</span>
                </td>
                <td data-label="Acciones" className="clientes-columna-acciones">
                  <div className="clientes-botones-accion">
                    <button
                      className="clientes-boton-accion clientes-ver"
                      onClick={() => manejarAccion('ver', cliente)}
                      title="Ver cliente"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="clientes-boton-accion clientes-editar"
                      onClick={() => manejarAccion('editar', cliente)}
                      title="Editar cliente"
                    >
                      <Edit size={16} />
                    </button>

                    {/* Botón RESTAURAR solo para admin con clientes inactivos */}
                    {esAdministrador && !cliente.activo && (
                      <button
                        className="clientes-boton-accion clientes-restaurar"
                        onClick={() => manejarAccion('restaurar', cliente)}
                        title="Restaurar cliente"
                        style={{
                          background: 'linear-gradient(45deg, #28a745, #218838)',
                          color: 'white'
                        }}
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}

                    <button
                      className="clientes-boton-accion clientes-eliminar"
                      onClick={() => manejarAccion('eliminar', cliente)}
                      title={esAdministrador && !cliente.activo ? 'Eliminar definitivamente' : 'Desactivar cliente'}
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
      <div className="clientes-pie-tabla">
        <div className="clientes-informacion-registros">
          Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
          {terminoBusqueda && (
            <span style={{ color: '#6c757d', marginLeft: '0.5rem' }}>
              (filtrado de {datosClientes.length} registros totales)
            </span>
          )}
        </div>

        <div className="clientes-controles-paginacion">
          <button
            className="clientes-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          <div className="clientes-numeros-paginacion">
            {(() => {
              const botonesPorBloque = 5;
              const bloqueActual = Math.floor((paginaActual - 1) / botonesPorBloque);
              const inicio = bloqueActual * botonesPorBloque + 1;
              const fin = Math.min(inicio + botonesPorBloque - 1, totalPaginas);

              const paginasVisibles = Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);

              return (
                <>
                  {/* Botón para retroceder bloques */}
                  {inicio > 1 && (
                    <button
                      className="clientes-numero-pagina"
                      onClick={() => cambiarPagina(inicio - 1)}
                    >
                      ...
                    </button>
                  )}

                  {/* Botones de las páginas visibles */}
                  {paginasVisibles.map((numero) => (
                    <button
                      key={numero}
                      className={`clientes-numero-pagina ${paginaActual === numero ? 'clientes-activo' : ''}`}
                      onClick={() => cambiarPagina(numero)}
                    >
                      {numero}
                    </button>
                  ))}

                  {/* Botón para avanzar bloques */}
                  {fin < totalPaginas && (
                    <button
                      className="clientes-numero-pagina"
                      onClick={() => cambiarPagina(fin + 1)}
                    >
                      ...
                    </button>
                  )}
                </>
              );
            })()}
          </div>

          <button
            className="clientes-boton-paginacion"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Modal Ver Cliente */}
      <ModalVerCliente
        estaAbierto={modalVerAbierto}
        cliente={clienteSeleccionado}
        alCerrar={cerrarModalVer}
      />

      {/* Modal Editar Cliente */}
      <ModalEditarCliente
        estaAbierto={modalEditarAbierto}
        cliente={clienteSeleccionado}
        alCerrar={cerrarModalEditar}
        alGuardar={manejarGuardarCliente}
      />

      {/* Modal Eliminar Cliente (Desactivar) */}
      {clienteAEliminar && (
        <ModalEliminarCliente
          cliente={clienteAEliminar}
          alConfirmar={manejarEliminarCliente}
          esAdministrador={esAdministrador}
        />
      )}

      {/* Modal Restaurar Cliente */}
      {clienteARestaurar && (
        <ModalRestaurarCliente
          cliente={clienteARestaurar}
          alConfirmar={manejarRestaurar}
          alCancelar={() => setClienteARestaurar(null)}
        />
      )}

      {/* Modal Eliminar Definitivamente */}
      {clienteAEliminarDefinitivo && (
        <ModalEliminarDefinitivo
          cliente={clienteAEliminarDefinitivo}
          alConfirmar={manejarEliminarDefinitivo}
          alCancelar={() => setClienteAEliminarDefinitivo(null)}
        />
      )}
    </div>
  );
};

export default TablaClientes;