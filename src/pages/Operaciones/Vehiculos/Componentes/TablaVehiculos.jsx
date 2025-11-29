import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Truck, BarChart3, Plus } from 'lucide-react';
import './TablaVehiculos.css';

const TablaVehiculos = ({
  vehiculos,        // ✅ Recibe vehiculos desde el padre
  setVehiculos,     // ✅ Por si necesitas actualizar (opcional)
  onVer,
  onEditar,
  onEliminar,
  onAgregar
}) => {
  // Solo estados locales para UI (paginación, búsqueda)
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Filtrar vehículos por búsqueda
  const vehiculosFiltrados = vehiculos.filter(vehiculo => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      vehiculo.nombre.toLowerCase().includes(busqueda) ||
      vehiculo.id.toString().includes(busqueda)
    );
  });

  // Calcular paginación
  const totalRegistros = vehiculosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const vehiculosPaginados = vehiculosFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const totalVehiculos = vehiculos.length;
  const promedioRendimiento = vehiculos.length > 0
    ? (vehiculos.reduce((sum, v) => {
      const rendimiento = parseFloat(v.rendimiento) || 0;
      return sum + rendimiento;
    }, 0) / vehiculos.length).toFixed(2)
    : '0.00';

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(valor);
  };

  const formatearDecimal = (valor) => {
    const numero = parseFloat(valor);
    return isNaN(numero) ? '0.00' : numero.toFixed(2);
  };

  const obtenerClaseRendimiento = (rendimiento) => {
    if (rendimiento >= 12) return 'alto';
    if (rendimiento >= 9) return 'medio';
    return 'bajo';
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

  const manejarAccion = (accion, vehiculo) => {
    switch (accion) {
      case 'ver':
        onVer(vehiculo);
        break;
      case 'editar':
        onEditar(vehiculo);
        break;
      case 'eliminar':
        onEliminar(vehiculo);
        break;
      default:
        break;
    }
  };

  return (
    <div className="vehiculos-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="vehiculos-encabezado">
        <div className="vehiculos-seccion-logo">
          <div className="vehiculos-lineas-decorativas">
            <div className="vehiculos-linea vehiculos-azul"></div>
            <div className="vehiculos-linea vehiculos-verde"></div>
            <div className="vehiculos-linea vehiculos-amarilla"></div>
            <div className="vehiculos-linea vehiculos-roja"></div>
          </div>
          <h1 className="vehiculos-titulo">Gestión de Vehículos</h1>
        </div>

        {/* Estadísticas */}
        <div className="vehiculos-contenedor-estadisticas">
          <div className="vehiculos-estadistica">
            <div className="vehiculos-icono-estadistica-circular">
              <Truck size={20} />
            </div>
            <div className="vehiculos-info-estadistica">
              <span className="vehiculos-label-estadistica">TOTAL: {totalVehiculos}</span>
            </div>
          </div>

          <div className="vehiculos-estadistica">
            <div className="vehiculos-icono-estadistica-cuadrado">
              <BarChart3 size={20} />
            </div>
            <div className="vehiculos-info-estadistica">
              <span className="vehiculos-label-estadistica">PROMEDIO: {promedioRendimiento} km/L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="vehiculos-controles">
        <div className="vehiculos-control-registros">
          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="vehiculos-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="vehiculos-controles-derecha">
          <button
            className="vehiculos-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo vehículo"
          >
            <Plus size={18} />
            Agregar Vehículo
          </button>

          <div className="vehiculos-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="vehiculos-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar vehículo..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="vehiculos-entrada-buscar"
              />
              <Search className="vehiculos-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {vehiculosPaginados.length === 0 ? (
        <div className="vehiculos-estado-vacio">
          <div className="vehiculos-icono-vacio">
            <Truck size={80} strokeWidth={1.5} />
          </div>
          <p className="vehiculos-mensaje-vacio">No se encontraron vehículos</p>
          <p className="vehiculos-submensaje-vacio">
            {terminoBusqueda
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando un vehículo a tu flota'}
          </p>
        </div>
      ) : (
        <>
          <div className="vehiculos-contenedor-tabla">
            <table className="vehiculos-tabla">
              <thead>
                <tr className="vehiculos-fila-encabezado">
                  <th>ID</th>
                  <th>VEHÍCULO</th>
                  <th>RENDIMIENTO</th>
                  <th>PRECIO COMBUSTIBLE</th>
                  <th>DESGASTE</th>
                  <th>COSTO RENTA</th>
                  <th>COSTO CHOFER/DÍA</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {vehiculosPaginados.map((vehiculo, index) => (
                  <tr
                    key={vehiculo.id}
                    className="vehiculos-fila-vehiculo"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td data-label="ID" className="vehiculos-columna-id">
                      <span className="vehiculos-badge-id">
                        #{vehiculo.id.toString().padStart(3, '0')}
                      </span>
                    </td>

                    <td data-label="Vehículo" className="vehiculos-columna-nombre">
                      <div className="vehiculos-info-vehiculo">
                        <div className="vehiculos-avatar">
                          <Truck size={18} />
                        </div>
                        <div className="vehiculos-datos-vehiculo">
                          <span className="vehiculos-nombre-principal">{vehiculo.nombre}</span>
                          <span className="vehiculos-subtexto">Vehículo de transporte</span>
                        </div>
                      </div>
                    </td>

                    <td data-label="Rendimiento" className="vehiculos-columna-rendimiento">
                      <span className={`vehiculos-badge-rendimiento ${obtenerClaseRendimiento(vehiculo.rendimiento)}`}>
                        {formatearDecimal(vehiculo.rendimiento)} km/L
                      </span>
                    </td>

                    <td data-label="Precio Combustible" className="vehiculos-columna-combustible">
                      <span className="vehiculos-valor-moneda">
                        {formatearMoneda(vehiculo.precio_combustible)}
                      </span>
                    </td>

                    <td data-label="Desgaste" className="vehiculos-columna-desgaste">
                      <span className="vehiculos-valor-desgaste">
                        {formatearDecimal(vehiculo.desgaste)}
                      </span>
                    </td>

                    <td data-label="Costo Renta" className="vehiculos-columna-renta">
                      <span className="vehiculos-valor-moneda">
                        {formatearMoneda(vehiculo.costo_renta)}
                      </span>
                    </td>

                    <td data-label="Costo Chofer/Día" className="vehiculos-columna-chofer">
                      <span className="vehiculos-valor-moneda">
                        {formatearMoneda(vehiculo.costo_chofer_dia)}
                      </span>
                    </td>

                    <td data-label="Acciones" className="vehiculos-columna-acciones">
                      <div className="vehiculos-botones-accion">
                        <button
                          className="vehiculos-boton-accion vehiculos-ver"
                          onClick={() => manejarAccion('ver', vehiculo)}
                          title="Ver vehículo"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="vehiculos-boton-accion vehiculos-editar"
                          onClick={() => manejarAccion('editar', vehiculo)}
                          title="Editar vehículo"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="vehiculos-boton-accion vehiculos-eliminar"
                          onClick={() => manejarAccion('eliminar', vehiculo)}
                          title="Eliminar vehículo"
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
          <div className="vehiculos-pie-tabla">
            <div className="vehiculos-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{ color: '#6c757d', marginLeft: '0.5rem' }}>
                  (filtrado de {vehiculos.length} registros totales)
                </span>
              )}
            </div>

            <div className="vehiculos-controles-paginacion">
              <button
                className="vehiculos-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>

              <div className="vehiculos-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`vehiculos-numero-pagina ${paginaActual === numero ? 'vehiculos-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>

              <button
                className="vehiculos-boton-paginacion"
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

export default TablaVehiculos;