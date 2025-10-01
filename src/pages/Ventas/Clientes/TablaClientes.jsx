import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Users, BarChart3, RotateCcw } from 'lucide-react';
import ModalVerCliente from './Modales/ModalVerCliente';
import ModalEditarCliente from './Modales/ModalEditarCliente';
import ModalEliminarCliente from './Modales/ModalEliminarCliente';
import ModalRestaurarCliente from './Modales/ModalRestaurarCliente';
import ModalEliminarDefinitivo from './Modales/ModalEliminarDefinitivo';
import './TablaClientes.css';

const TablaClientes = () => {
  // CAMBIAR ESTO SEGÚN EL ROL DEL USUARIO LOGUEADO
  // true = Administrador, false = Cliente
  const [esAdministrador, setEsAdministrador] = useState(false);
  
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  // Estados para los modales
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clienteARestaurar, setClienteARestaurar] = useState(null);
  const [clienteAEliminarDefinitivo, setClienteAEliminarDefinitivo] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  
  // Estado para los datos de clientes - AHORA CON CAMPO "activo"
  const [datosClientes, setDatosClientes] = useState([
    {
      id: 1,
      nombre: 'Angel Rafael Hernández',
      email: 'angel.rafael@email.com',
      telefono: '951 363 56 90',
      numero_lead: 'LEAD-001',
      canal_contacto: 'WhatsApp',
      rfc: 'ANRA850102XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '02/09/2025',
      activo: true
    },
    {
      id: 2,
      nombre: 'Marco Antonio Silva',
      email: 'marco.antonio@email.com',
      telefono: '951 343 77 78',
      numero_lead: 'LEAD-002',
      canal_contacto: 'Facebook',
      rfc: 'MAAN900315XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '02/09/2025',
      activo: true
    },
    {
      id: 3,
      nombre: 'Carlos Eduardo López',
      email: 'carlos.eduardo@email.com',
      telefono: '951 569 23 01',
      numero_lead: 'LEAD-003',
      canal_contacto: 'Instagram',
      rfc: 'CAED920520XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '02/09/2025',
      activo: false
    },
    {
      id: 4,
      nombre: 'Elías Abisaí González',
      email: 'elias.abisai@email.com',
      telefono: '951 638 13 80',
      numero_lead: 'LEAD-004',
      canal_contacto: 'Sitio Web',
      rfc: 'ELAB880710XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '02/09/2025',
      activo: true
    },
    {
      id: 5,
      nombre: 'María González Ruiz',
      email: 'maria.gonzalez@email.com',
      telefono: '951 789 45 23',
      numero_lead: 'LEAD-005',
      canal_contacto: 'WhatsApp',
      rfc: 'MAGO850220XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '03/09/2025',
      activo: false
    },
    {
      id: 6,
      nombre: 'José Luis Martínez',
      email: 'jose.martinez@email.com',
      telefono: '951 456 78 90',
      numero_lead: 'LEAD-006',
      canal_contacto: 'Facebook',
      rfc: 'JOMA901105XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '03/09/2025',
      activo: true
    },
    {
      id: 7,
      nombre: 'Ana Patricia López',
      email: 'ana.lopez@email.com',
      telefono: '951 321 65 47',
      numero_lead: 'LEAD-007',
      canal_contacto: 'Instagram',
      rfc: 'ANLO930415XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '04/09/2025',
      activo: true
    },
    {
      id: 8,
      nombre: 'Roberto Sánchez Morales',
      email: 'roberto.sanchez@email.com',
      telefono: '951 987 12 34',
      numero_lead: 'LEAD-008',
      canal_contacto: 'Sitio Web',
      rfc: 'ROSA870825XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '04/09/2025',
      activo: true
    },
    {
      id: 9,
      nombre: 'Diana Torres Vega',
      email: 'diana.torres@email.com',
      telefono: '951 654 32 10',
      numero_lead: 'LEAD-009',
      canal_contacto: 'WhatsApp',
      rfc: 'DITV910618XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '05/09/2025',
      activo: true
    },
    {
      id: 10,
      nombre: 'Fernando Ramírez Cruz',
      email: 'fernando.ramirez@email.com',
      telefono: '951 147 85 29',
      numero_lead: 'LEAD-010',
      canal_contacto: 'Facebook',
      rfc: 'FERC890930XXX',
      direccion: 'Oaxaca, Oaxaca',
      fecha_registro: '05/09/2025',
      activo: true
    }
  ]);

  // Filtrar clientes según rol y búsqueda
  const clientesFiltrados = datosClientes.filter(cliente => {
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
      cliente.telefono.includes(busqueda) ||
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

  const manejarGuardarCliente = async (datosActualizados) => {
    try {
      // Actualizar el cliente en el estado
      setDatosClientes(datosClientes.map(cliente => 
        cliente.id === datosActualizados.id ? datosActualizados : cliente
      ));
      
      console.log('Cliente actualizado:', datosActualizados);
      return Promise.resolve();
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  };

  const manejarEliminarCliente = async (cliente) => {
    if (!cliente) {
      // Cancelar eliminación
      setClienteAEliminar(null);
      return;
    }

    try {
      // SOFT DELETE: Marcar como inactivo
      setDatosClientes(datosClientes.map(c => 
        c.id === cliente.id ? { ...c, activo: false } : c
      ));
      
      setClienteAEliminar(null);
      console.log('Cliente DESACTIVADO:', cliente);
      return Promise.resolve();
    } catch (error) {
      console.error('Error al desactivar cliente:', error);
      setClienteAEliminar(null);
      throw error;
    }
  };

  const manejarRestaurar = async (cliente) => {
    try {
      // Restaurar cliente (marcarlo como activo)
      setDatosClientes(datosClientes.map(c => 
        c.id === cliente.id ? { ...c, activo: true } : c
      ));
      
      setClienteARestaurar(null);
      console.log('Cliente RESTAURADO:', cliente);
    } catch (error) {
      console.error('Error al restaurar cliente:', error);
    }
  };

  const manejarEliminarDefinitivo = async (cliente) => {
    try {
      // Eliminar definitivamente del sistema
      setDatosClientes(datosClientes.filter(c => c.id !== cliente.id));
      
      setClienteAEliminarDefinitivo(null);
      console.log('Cliente eliminado DEFINITIVAMENTE:', cliente);
    } catch (error) {
      console.error('Error al eliminar definitivamente cliente:', error);
    }
  };

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
            {esAdministrador ? 'ADMINISTRADOR' : 'CLIENTE'}
          </span>
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
            Cambiar a {esAdministrador ? 'Cliente' : 'Admin'}
          </button>
          
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
              <th>EMAIL</th>
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
                <td data-label="Email" className="clientes-columna-email">
                  <a href={`mailto:${cliente.email}`} className="clientes-enlace-email">
                    {cliente.email}
                  </a>
                </td>
                <td data-label="Teléfono" className="clientes-columna-telefono">
                  <span className="clientes-telefono">{cliente.telefono}</span>
                </td>
                <td data-label="Número Lead" className="clientes-columna-lead">
                  <span className="clientes-badge-lead">{cliente.numero_lead}</span>
                </td>
                <td data-label="Canal Contacto" className="clientes-columna-canal">
                  <span className={`clientes-badge-canal clientes-canal-${cliente.canal_contacto.toLowerCase().replace(' ', '-')}`}>
                    {cliente.canal_contacto}
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
            <span style={{color: '#6c757d', marginLeft: '0.5rem'}}>
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
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
              <button
                key={numero}
                className={`clientes-numero-pagina ${paginaActual === numero ? 'clientes-activo' : ''}`}
                onClick={() => cambiarPagina(numero)}
              >
                {numero}
              </button>
            ))}
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