import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Users, BarChart3, RotateCcw, Filter, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import ModalVerCliente from './Modales/ModalVerCliente';
import ModalEditarCliente from './Modales/ModalEditarCliente';
import ModalEliminarCliente from './Modales/ModalEliminarCliente';
import ModalRestaurarCliente from './Modales/ModalRestaurarCliente';
import ModalEliminarDefinitivo from './Modales/ModalEliminarDefinitivo';
import ModalCrearCotizacion from './Modales/ModalCrearCotizacion';
import './TablaClientes.css';

const TablaClientes = () => {
  const [permisos, setPermisos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [datosClientes, setDatosClientes] = useState([]);
  const [pipelines, setPipelines] = useState([]);

  // Filtros
  const [filtroActivo, setFiltroActivo] = useState({
    pipeline_id: null,
    etapa_id: null,
    estado_lead: null
  });
  const [mostrarTodos, setMostrarTodos] = useState(true);

  // Paginación y búsqueda
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  // Estados para los modales
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalCotizarAbierto, setModalCotizarAbierto] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clienteARestaurar, setClienteARestaurar] = useState(null);
  const [clienteAEliminarDefinitivo, setClienteAEliminarDefinitivo] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // ✅ Cargar permisos y configuración al montar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token, redirigir al login');
      setCargando(false);
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setPermisos(userData.permisos || []);
      setRoles(userData.roles || []);

      // Cargar configuración de pipelines primero
      cargarConfiguracionPipelines();
    } catch (error) {
      console.error('Error al parsear usuario de localStorage:', error);
      setCargando(false);
    }
  }, []);

  // ✅ Cargar clientes cuando cambia el filtro O cuando se cargan los pipelines
  useEffect(() => {
    if (pipelines.length > 0) {
      cargarClientes();
    }
  }, [filtroActivo, mostrarTodos, pipelines]);

  const tienePermiso = (permiso) => permisos.includes(permiso);
  const esAdministrador = roles.includes('admin');

  // ✅ Cargar configuración de pipelines
  const cargarConfiguracionPipelines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/leads/pipelines-config', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      setPipelines(response.data.pipelines);
    } catch (error) {
      console.error('Error al cargar pipelines:', error);
    }
  };

  // ✅ Cargar clientes (con o sin filtro)
  const cargarClientes = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No hay token disponible');
        setCargando(false);
        return;
      }

      let url = 'http://127.0.0.1:8000/api/clientes';
      const params = new URLSearchParams();

      // Si NO es "mostrar todos", aplicar filtros específicos
      if (!mostrarTodos && filtroActivo.pipeline_id) {
        url = 'http://127.0.0.1:8000/api/clientes/clientes-por-filtro';
        params.append('pipeline_id', filtroActivo.pipeline_id);
        params.append('etapa_id', filtroActivo.etapa_id);
        if (filtroActivo.estado_lead) {
          params.append('estado_lead', filtroActivo.estado_lead);
        }
      }

      const urlConParams = params.toString() ? `${url}?${params}` : url;

      const response = await axios.get(urlConParams, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      // Si viene con estructura {clientes: [], total: X}, extraer clientes
      const clientes = response.data.clientes || response.data;
      setDatosClientes(clientes);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert('Error al cargar clientes: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setCargando(false);
    }
  };

  // ✅ Seleccionar pipeline específico
  const seleccionarPipeline = (pipeline) => {
    setFiltroActivo({
      pipeline_id: pipeline.pipeline_id,
      etapa_id: pipeline.etapa_id,
      estado_lead: pipeline.estado
    });
    setMostrarTodos(false);
    setPaginaActual(1);
  };

  // ✅ Mostrar todos los clientes (de los 3 pipelines)
  const mostrarTodosLosPipelines = () => {
    setMostrarTodos(true);
    setFiltroActivo({
      pipeline_id: null,
      etapa_id: null,
      estado_lead: null
    });
    setPaginaActual(1);
  };

  // ✅ Cambiar estado de un lead
  const cambiarEstadoLead = async (leadId, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://127.0.0.1:8000/api/leads/${leadId}/estado`,
        { estado_lead: nuevoEstado },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      await cargarClientes();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar estado del lead');
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
      await cargarClientes();
      cerrarModalEditar();
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      alert(error.response?.data?.error || 'Error al actualizar cliente');
      throw error;
    }
  };

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

  // ✅ Filtrar clientes por búsqueda
  const clientesFiltrados = datosClientes.filter(cliente => {
    if (!cliente || !cliente.nombre) return false;

    // Filtro por rol
    if (!esAdministrador && !cliente.activo) {
      return false;
    }

    // Filtro de búsqueda
    if (!terminoBusqueda) return true;

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

  // Paginación
  const totalRegistros = clientesFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const clientesPaginados = clientesFiltrados.slice(indiceInicio, indiceFin);

  // Estadísticas
  const clientesActivos = datosClientes.filter(c => c.activo).length;
  const clientesInactivos = datosClientes.filter(c => !c.activo).length;
  const totalLeads = datosClientes.reduce((sum, c) => sum + (c.leads?.length || 0), 0);

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
      case 'cotizar':
        setClienteSeleccionado(cliente);
        setModalCotizarAbierto(true);
        break;
      case 'eliminar':
        if (esAdministrador && !cliente.activo) {
          setClienteAEliminarDefinitivo(cliente);
        } else {
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

  const cerrarModalCotizar = () => {
    setModalCotizarAbierto(false);
    setClienteSeleccionado(null);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'contactado': return '#3b82f6';
      case 'ganado': return '#10b981';
      case 'perdido': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'contactado': return <Clock size={14} />;
      case 'ganado': return <CheckCircle size={14} />;
      case 'perdido': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

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
          <h1 className="clientes-titulo">Gestión de Clientes y Leads</h1>
        </div>

        {/* Estadísticas */}
        <div className="clientes-contenedor-estadisticas">
          <div className="clientes-estadistica">
            <div className="clientes-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="clientes-info-estadistica">
              <span className="clientes-label-estadistica">CLIENTES: {clientesActivos}</span>
            </div>
          </div>
          <div className="clientes-estadistica">
            <div className="clientes-icono-estadistica-cuadrado">
              <BarChart3 size={20} />
            </div>
            <div className="clientes-info-estadistica">
              <span className="clientes-label-estadistica">LEADS: {totalLeads}</span>
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

      {/* ✅ Filtros de Pipeline */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        {/* Botón Mostrar Todos */}
        <button
          onClick={mostrarTodosLosPipelines}
          className={mostrarTodos ? 'clientes-filtro-activo' : 'clientes-filtro-inactivo'}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: mostrarTodos ? '2px solid #667eea' : '2px solid #e5e7eb',
            background: mostrarTodos ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
            color: mostrarTodos ? 'white' : '#374151',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Filter size={16} />
          Todos los Pipelines
        </button>

        {/* Botones por Pipeline */}
        {pipelines.map((pipeline) => {
          const esActivo = !mostrarTodos && filtroActivo.pipeline_id === pipeline.pipeline_id;
          return (
            <button
              key={pipeline.pipeline_id}
              onClick={() => seleccionarPipeline(pipeline)}
              className={esActivo ? 'clientes-filtro-activo' : 'clientes-filtro-inactivo'}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: esActivo ? '2px solid #667eea' : '2px solid #e5e7eb',
                background: esActivo ?
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                  'white',
                color: esActivo ? 'white' : '#374151',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{pipeline.nombre}</span>
                <span style={{
                  fontSize: '0.75rem',
                  opacity: esActivo ? 1 : 0.7,
                  marginTop: '0.25rem'
                }}>
                  Estado: {pipeline.estado}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controles */}
      <div className="clientes-controles">
        <div className="clientes-control-registros">
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
              <th>TELÉFONO</th>
              <th>CANAL CONTACTO</th>
              <th>LEADS</th>
              <th>ESTADO LEAD</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {clientesPaginados.map((cliente, index) => {
              const leads = cliente.leads || [];
              const numLeads = leads.length;

              return leads.length > 0 ? (
                leads.map((lead, leadIndex) => (
                  <tr
                    key={`${cliente.id}-${lead.id}`}
                    className="clientes-fila-cliente"
                    style={{
                      animationDelay: `${(index + leadIndex) * 0.05}s`,
                      background: cliente.activo ? 'white' : '#f8d7da'
                    }}
                  >
                    {/* Cliente - Solo en primera fila */}
                    {leadIndex === 0 && (
                      <>
                        <td data-label="ID" className="clientes-columna-id" rowSpan={numLeads}>
                          <span className="clientes-badge-id">#{cliente.id.toString().padStart(3, '0')}</span>
                        </td>
                        <td data-label="Nombre" className="clientes-columna-nombre" rowSpan={numLeads}>
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
                        <td data-label="Teléfono" className="clientes-columna-telefono" rowSpan={numLeads}>
                          <span className="clientes-telefono">{cliente.telefono}</span>
                        </td>
                        <td data-label="Canal Contacto" className="clientes-columna-canal" rowSpan={numLeads}>
                          <span className={`clientes-badge-canal ${cliente.canal_contacto ? `clientes-canal-${cliente.canal_contacto.toLowerCase().replace(' ', '-')}` : 'clientes-canal-sin-datos'}`}>
                            {cliente.canal_contacto || 'Sin canal'}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Lead Info */}
                    <td data-label="Lead" className="clientes-columna-lead">
                      <div style={{ fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{lead.nombre}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          Pipeline: {lead.pipeline_id} | Etapa: {lead.etapa_id}
                        </div>
                        {lead.precio && (
                          <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>
                            ${lead.precio.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Estado Lead */}
                    <td data-label="Estado Lead" className="clientes-columna-estado">
                      <select
                        value={lead.estado_lead || 'contactado'}
                        onChange={(e) => cambiarEstadoLead(lead.id, e.target.value)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: `2px solid ${getEstadoColor(lead.estado_lead)}`,
                          backgroundColor: `${getEstadoColor(lead.estado_lead)}15`,
                          color: getEstadoColor(lead.estado_lead),
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="contactado">Contactado</option>
                        <option value="ganado">Ganado</option>
                        <option value="perdido">Perdido</option>
                      </select>
                    </td>

                    {/* Acciones - Solo en primera fila */}
                    {leadIndex === 0 && (
                      <td data-label="Acciones" className="clientes-columna-acciones" rowSpan={numLeads}>
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

                           <button
                          className="clientes-boton-accion clientes-cotizar"
                          onClick={() => manejarAccion('cotizar', cliente)}
                          title="Crear cotización"
                          style={{
                            background: 'linear-gradient(45deg, #10b981, #059669)',
                            color: 'white'
                          }}
                        >
                          <FileText size={16} />
                        </button>
                        </div>                       
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                // Fallback si no tiene leads (no debería pasar)
                <tr key={cliente.id} className="clientes-fila-cliente" style={{ background: '#fff3cd' }}>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                    Cliente sin leads en los pipelines configurados
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
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
                  {inicio > 1 && (
                    <button
                      className="clientes-numero-pagina"
                      onClick={() => cambiarPagina(inicio - 1)}
                    >
                      ...
                    </button>
                  )}
                  {paginasVisibles.map((numero) => (
                    <button
                      key={numero}
                      className={`clientes-numero-pagina ${paginaActual === numero ? 'clientes-activo' : ''}`}
                      onClick={() => cambiarPagina(numero)}
                    >
                      {numero}
                    </button>
                  ))}
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

      {/* Modales */}
      <ModalVerCliente
        estaAbierto={modalVerAbierto}
        cliente={clienteSeleccionado}
        alCerrar={cerrarModalVer}
      />

      <ModalEditarCliente
        estaAbierto={modalEditarAbierto}
        cliente={clienteSeleccionado}
        alCerrar={cerrarModalEditar}
        alGuardar={manejarGuardarCliente}
      />

      {clienteAEliminar && (
        <ModalEliminarCliente
          cliente={clienteAEliminar}
          alConfirmar={manejarEliminarCliente}
          esAdministrador={esAdministrador}
        />
      )}

      {clienteARestaurar && (
        <ModalRestaurarCliente
          cliente={clienteARestaurar}
          alConfirmar={manejarRestaurar}
          alCancelar={() => setClienteARestaurar(null)}
        />
      )}

      {clienteAEliminarDefinitivo && (
        <ModalEliminarDefinitivo
          cliente={clienteAEliminarDefinitivo}
          alConfirmar={manejarEliminarDefinitivo}
          alCancelar={() => setClienteAEliminarDefinitivo(null)}
        />
      )}

      {modalCotizarAbierto && clienteSeleccionado && (
        <ModalCrearCotizacion
          estaAbierto={modalCotizarAbierto}
          cliente={clienteSeleccionado}
          alCerrar={cerrarModalCotizar}
        />
      )}
    </div>
  );
};

export default TablaClientes;