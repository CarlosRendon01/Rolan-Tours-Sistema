import React, { useState } from "react";
import {
  Search,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Store,
  Plus,
  Shield,
} from "lucide-react";
import "./TablaRoles.css";

const TablaRoles = ({
  roles = [],
  setRoles,
  onVer,
  onEditar,
  onEliminar,
  onAgregar,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [vistaActual, setVistaActual] = useState("roles"); // "roles" o "usuarios"

  // Filtrar roles
  const rolesFiltrados = roles.filter((rol) => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      rol.nombre?.toLowerCase().includes(busqueda) ||
      rol.id?.toString().includes(busqueda) ||
      rol.descripcion?.toLowerCase().includes(busqueda)
    );
  });

  // Paginación
  const totalRegistros = rolesFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const rolesPaginados = rolesFiltrados.slice(indiceInicio, indiceFin);

  // Estadísticas
  const totalRoles = roles.length;
  const rolesActivos = roles.filter(
    (p) => p.estado === "activo" || !p.estado
  ).length;

  const obtenerIniciales = (nombre) => {
    if (!nombre) return "?";
    const palabras = nombre.trim().split(" ");
    if (palabras.length >= 2) {
      return `${palabras[0].charAt(0)}${palabras[1].charAt(0)}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const obtenerPermisosDetallados = (permissions) => {
    // ⭐ CAMBIO: Ahora recibe permissions que es un array de objetos
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return [];
    }

    const modulosConfig = {
      dashboard: { nombre: "Dashboard", color: "#3b82f6" },
      ventas: { nombre: "Ventas", color: "#10b981" },
      documentos: { nombre: "Documentos", color: "#f59e0b" },
      operaciones: { nombre: "Operaciones", color: "#8b5cf6" },
      servicios: { nombre: "Servicios", color: "#ec4899" },
      mantenimiento: { nombre: "Mantenimiento", color: "#ef4444" },
      administracion: { nombre: "Administración", color: "#6366f1" },
    };

    const permisosAgrupados = {};

    // Agrupar permisos por módulo
    permissions.forEach((permiso) => {
      const partes = permiso.nombre.split('.');

      if (partes.length === 2) {
        // Módulo sin submódulo (ej: dashboard.ver)
        const [modulo, accion] = partes;
        if (modulosConfig[modulo]) {
          if (!permisosAgrupados[modulo]) {
            permisosAgrupados[modulo] = {
              modulo: modulosConfig[modulo].nombre,
              color: modulosConfig[modulo].color,
              accesos: []
            };
          }
          permisosAgrupados[modulo].accesos.push(
            accion.charAt(0).toUpperCase() + accion.slice(1)
          );
        }
      } else if (partes.length === 3) {
        // Módulo con submódulo (ej: ventas.clientes.ver)
        const [modulo, submodulo, accion] = partes;
        const key = `${modulo}.${submodulo}`;

        if (modulosConfig[modulo]) {
          if (!permisosAgrupados[key]) {
            permisosAgrupados[key] = {
              modulo: `${modulosConfig[modulo].nombre} - ${submodulo.charAt(0).toUpperCase() + submodulo.slice(1)}`,
              color: modulosConfig[modulo].color,
              accesos: []
            };
          }
          permisosAgrupados[key].accesos.push(
            accion.charAt(0).toUpperCase() + accion.slice(1)
          );
        }
      }
    });

    // Convertir objeto a array
    return Object.values(permisosAgrupados);
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const manejarAccion = (accion, item) => {
    switch (accion) {
      case "ver":
        onVer(item);
        break;
      case "editar":
        onEditar(item);
        break;
      case "eliminar":
        onEliminar(item);
        break;
      default:
        break;
    }
  };

  return (
    <div className="roles-contenedor-principal">
      <div className="roles-encabezado">
        <div className="roles-seccion-logo">
          <div className="roles-lineas-decorativas">
            <div className="roles-linea roles-morado"></div>
            <div className="roles-linea roles-azul"></div>
            <div className="roles-linea roles-verde"></div>
            <div className="roles-linea roles-naranja"></div>
          </div>
          <h1 className="roles-titulo">Gestión de Roles</h1>
        </div>

        <div className="roles-contenedor-estadisticas">
          <div className="roles-estadistica">
            <div className="roles-icono-estadistica-circular">
              <Store size={20} />
            </div>
            <div className="roles-info-estadistica">
              <span className="roles-label-estadistica">
                TOTAL: {totalRoles}
              </span>
            </div>
          </div>

          <div className="roles-estadistica">
            <div className="roles-icono-estadistica-cuadrado">
              <Shield size={20} />
            </div>
            <div className="roles-info-estadistica">
              <span className="roles-label-estadistica">
                ACTIVOS: {rolesActivos}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="roles-controles">
        <div className="roles-controles-izquierda">
          <div className="roles-control-registros">
            <label htmlFor="roles-registros">Mostrar</label>
            <select
              id="roles-registros"
              value={registrosPorPagina}
              onChange={(e) => {
                setRegistrosPorPagina(parseInt(e.target.value));
                setPaginaActual(1);
              }}
              className="roles-selector-registros"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>registros</span>
          </div>
        </div>

        <div className="roles-controles-derecha">
          <button className="roles-boton-agregar" onClick={onAgregar}>
            <Plus size={18} />
            Agregar Rol
          </button>

          <div className="roles-control-busqueda">
            <label htmlFor="roles-buscar">Buscar:</label>
            <div className="roles-entrada-busqueda">
              <input
                type="text"
                id="roles-buscar"
                placeholder="Buscar rol..."
                value={terminoBusqueda}
                onChange={(e) => {
                  setTerminoBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                className="roles-entrada-buscar"
              />
              <Search className="roles-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {rolesPaginados.length === 0 ? (
        <div className="roles-estado-vacio">
          <div className="roles-icono-vacio">
            <Store size={80} strokeWidth={1.5} />
          </div>
          <p className="roles-mensaje-vacio">No se encontraron roles</p>
          <p className="roles-submensaje-vacio">
            {terminoBusqueda
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando un rol"}
          </p>
        </div>
      ) : (
        <>
          <div className="roles-contenedor-tabla">
            <table className="roles-tabla">
              <thead>
                <tr className="roles-fila-encabezado">
                  <th>ID</th>
                  <th>NOMBRE DE ROL</th>
                  <th>DESCRIPCIÓN</th>
                  <th>PERMISOS</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {rolesPaginados.map((rol) => {
                  const permisosDetallados = obtenerPermisosDetallados(rol.permissions);

                  return (
                    <tr key={rol.id} className="roles-fila-rol">
                      <td data-label="ID" className="roles-columna-id">
                        <span className="roles-badge-id">
                          #{rol.id?.toString().padStart(3, "0")}
                        </span>
                      </td>

                      <td data-label="Nombre de Rol" className="roles-columna-nombre">
                        <div className="roles-info-rol">
                          <div className="roles-logo">
                            <span>{obtenerIniciales(rol.nombre)}</span>
                          </div>
                          <div className="roles-datos-rol">
                            <span className="roles-nombre-principal">
                              {rol.nombre || "Sin nombre"}
                            </span>
                            <span className="roles-subtexto">
                              {rol.permissions?.length || 0} permisos
                            </span>
                          </div>
                        </div>
                      </td>

                      <td data-label="Descripción" className="roles-columna-descripcion">
                        <span className="roles-texto-descripcion">
                          {rol.descripcion || "Sin descripción"}
                        </span>
                      </td>

                      <td data-label="Permisos" className="roles-columna-permisos-detallados">
                        {permisosDetallados.length === 0 ? (
                          <div className="roles-sin-permisos">
                            <Shield size={16} />
                            <span>Sin permisos asignados</span>
                          </div>
                        ) : (
                          <div className="roles-contenedor-permisos-detallados">
                            {permisosDetallados.slice(0, 3).map((permiso, idx) => (
                              <div
                                key={idx}
                                className="roles-item-permiso-detallado"
                                style={{ borderLeft: `3px solid ${permiso.color}` }}
                              >
                                <div className="roles-nombre-modulo">
                                  {permiso.modulo}
                                </div>
                              </div>
                            ))}
                            {permisosDetallados.length > 3 && (
                              <span className="roles-mas-permisos">
                                +{permisosDetallados.length - 3} más
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td data-label="Acciones" className="roles-columna-acciones">
                        <div className="roles-botones-accion">
                          <button
                            className="roles-boton-accion roles-ver"
                            onClick={() => manejarAccion("ver", rol)}
                            title="Ver rol"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="roles-boton-accion roles-editar"
                            onClick={() => manejarAccion("editar", rol)}
                            title="Editar rol"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="roles-boton-accion roles-eliminar"
                            onClick={() => manejarAccion("eliminar", rol)}
                            title="Eliminar rol"
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

          <div className="roles-pie-tabla">
            <div className="roles-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al{" "}
              {Math.min(indiceFin, totalRegistros)} de un total de{" "}
              {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{ color: "#6c757d", marginLeft: "0.5rem" }}>
                  (filtrado de {roles.length} registros totales)
                </span>
              )}
            </div>

            <div className="roles-controles-paginacion">
              <button
                className="roles-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>

              <div className="roles-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (numero) => (
                    <button
                      key={numero}
                      className={`roles-numero-pagina ${paginaActual === numero ? "roles-activo" : ""
                        }`}
                      onClick={() => cambiarPagina(numero)}
                    >
                      {numero}
                    </button>
                  )
                )}
              </div>

              <button
                className="roles-boton-paginacion"
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

export default TablaRoles;