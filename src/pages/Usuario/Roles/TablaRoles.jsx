import React, { useState } from "react";
import {
  Search,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Building2,
  Store,
  Plus,
  Shield,
  Users,
  Phone,
} from "lucide-react";
import "./TablaRoles.css";

const TablaRoles = ({
  roles = [],
  usuarios = [],
  setRoles,
  setUsuarios,
  onVer,
  onEditar,
  onEliminar,
  onAgregar,
  onVerUsuario,
  onEditarUsuario,
  onEliminarUsuario,
  onAgregarUsuario,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [vistaActual, setVistaActual] = useState("roles"); // "roles" o "usuarios"

  // Función para obtener el nombre del rol
  const obtenerNombreRol = (rol_id) => {
    const rol = roles.find((r) => r.id_rol === rol_id);
    return rol ? rol.nombre_rol : "Sin rol asignado";
  };

  // Filtrar roles
  const rolesFiltrados = roles.filter((rol) => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      rol.nombre_rol?.toLowerCase().includes(busqueda) ||
      rol.id_rol?.toString().includes(busqueda) ||
      rol.descripcion?.toLowerCase().includes(busqueda)
    );
  });

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const busqueda = terminoBusqueda.toLowerCase();
    const nombreRol = obtenerNombreRol(usuario.rol_id).toLowerCase();
    return (
      usuario.nombre?.toLowerCase().includes(busqueda) ||
      usuario.apellido_paterno?.toLowerCase().includes(busqueda) ||
      usuario.apellido_materno?.toLowerCase().includes(busqueda) ||
      usuario.id_usuario?.toString().includes(busqueda) ||
      nombreRol.includes(busqueda) ||
      usuario.telefono?.toLowerCase().includes(busqueda)
    );
  });

  // Paginación
  const datosFiltrados =
    vistaActual === "roles" ? rolesFiltrados : usuariosFiltrados;
  const totalRegistros = datosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const rolesPaginados = rolesFiltrados.slice(indiceInicio, indiceFin);
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceFin);

  // Estadísticas
  const totalRoles = roles.length;
  const rolesActivos = roles.filter(
    (p) => p.estado === "activo" || !p.estado
  ).length;
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(
    (u) => u.estado === "activo" || !u.estado
  ).length;

  const obtenerIniciales = (nombre, apellidoPaterno) => {
    if (!nombre) return "?";
    const inicial1 = nombre.charAt(0).toUpperCase();
    if (apellidoPaterno) {
      const inicial2 = apellidoPaterno.charAt(0).toUpperCase();
      return `${inicial1}${inicial2}`;
    }
    // Para roles, usar dos letras del nombre
    const palabras = nombre.trim().split(" ");
    if (palabras.length >= 2) {
      return `${palabras[0].charAt(0)}${palabras[1].charAt(0)}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const obtenerNombreCompleto = (usuario) => {
    const nombre = usuario.nombre || "";
    const paterno = usuario.apellido_paterno || "";
    const materno = usuario.apellido_materno || "";
    return `${nombre} ${paterno} ${materno}`.trim() || "Sin nombre";
  };

  const obtenerIconoGenero = (genero) => {
    switch (genero?.toLowerCase()) {
      case "masculino":
      case "m":
        return "👨";
      case "femenino":
      case "f":
        return "👩";
      default:
        return "👤";
    }
  };

  const obtenerPermisosDetallados = (permisos) => {
    if (!permisos || typeof permisos !== "object") return [];

    const permisosDetallados = [];
    const modulosConfig = {
      dashboard: { nombre: "Dashboard", color: "#3b82f6" },
      ventas: { nombre: "Ventas", color: "#10b981" },
      documentos: { nombre: "Documentos", color: "#f59e0b" },
      operaciones: { nombre: "Operaciones", color: "#8b5cf6" },
      servicios: { nombre: "Servicios", color: "#ec4899" },
      mantenimiento: { nombre: "Mantenimiento", color: "#ef4444" },
      administracion: { nombre: "Administración", color: "#6366f1" },
    };

    Object.entries(permisos).forEach(([moduloId, permisoModulo]) => {
      if (!permisoModulo || !modulosConfig[moduloId]) return;

      if (permisoModulo.modulos) {
        Object.entries(permisoModulo.modulos).forEach(
          ([submoduloId, permisoSub]) => {
            if (
              permisoSub &&
              (permisoSub.ver || permisoSub.editar || permisoSub.eliminar)
            ) {
              const accesosSub = [];
              if (permisoSub.ver) accesosSub.push("Ver");
              if (permisoSub.editar) accesosSub.push("Editar");
              if (permisoSub.eliminar) accesosSub.push("Eliminar");

              permisosDetallados.push({
                modulo: `${modulosConfig[moduloId].nombre} - ${
                  submoduloId.charAt(0).toUpperCase() + submoduloId.slice(1)
                }`,
                accesos: accesosSub,
                color: modulosConfig[moduloId].color,
              });
            }
          }
        );
      } else {
        if (
          permisoModulo.ver ||
          permisoModulo.editar ||
          permisoModulo.eliminar
        ) {
          const accesos = [];
          if (permisoModulo.ver) accesos.push("Ver");
          if (permisoModulo.editar) accesos.push("Editar");
          if (permisoModulo.eliminar) accesos.push("Eliminar");

          permisosDetallados.push({
            modulo: modulosConfig[moduloId].nombre,
            accesos: accesos,
            color: modulosConfig[moduloId].color,
          });
        }
      }
    });

    return permisosDetallados;
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const manejarAccion = (accion, item) => {
    if (vistaActual === "roles") {
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
    } else {
      switch (accion) {
        case "ver":
          onVerUsuario ? onVerUsuario(item) : onVer(item);
          break;
        case "editar":
          onEditarUsuario ? onEditarUsuario(item) : onEditar(item);
          break;
        case "eliminar":
          onEliminarUsuario ? onEliminarUsuario(item) : onEliminar(item);
          break;
        default:
          break;
      }
    }
  };

  const manejarCambioVista = (vista) => {
    setVistaActual(vista);
    setPaginaActual(1);
    setTerminoBusqueda("");
  };

  const manejarAgregar = () => {
    if (vistaActual === "roles") {
      onAgregar();
    } else {
      onAgregarUsuario ? onAgregarUsuario() : onAgregar();
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
          <h1 className="roles-titulo">
            {vistaActual === "roles"
              ? "Gestión de Roles"
              : "Gestión de Usuarios"}
          </h1>
        </div>

        <div className="roles-contenedor-estadisticas">
          <div className="roles-estadistica">
            <div className="roles-icono-estadistica-circular">
              {vistaActual === "roles" ? (
                <Store size={20} />
              ) : (
                <Users size={20} />
              )}
            </div>
            <div className="roles-info-estadistica">
              <span className="roles-label-estadistica">
                TOTAL: {vistaActual === "roles" ? totalRoles : totalUsuarios}
              </span>
            </div>
          </div>

          <div className="roles-estadistica">
            <div className="roles-icono-estadistica-cuadrado">
              <Building2 size={20} />
            </div>
            <div className="roles-info-estadistica">
              <span className="roles-label-estadistica">
                ACTIVOS:{" "}
                {vistaActual === "roles" ? rolesActivos : usuariosActivos}
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

          <div className="roles-control-vista">
            <label htmlFor="roles-vista">Vista:</label>
            <select
              id="roles-vista"
              value={vistaActual}
              onChange={(e) => manejarCambioVista(e.target.value)}
              className="roles-selector-vista"
            >
              <option value="roles">Roles</option>
              <option value="usuarios">Usuarios</option>
            </select>
          </div>
        </div>

        <div className="roles-controles-derecha">
          <button className="roles-boton-agregar" onClick={manejarAgregar}>
            <Plus size={18} />
            {vistaActual === "roles" ? "Agregar Rol" : "Agregar Usuario"}
          </button>

          <div className="roles-control-busqueda">
            <label htmlFor="roles-buscar">Buscar:</label>
            <div className="roles-entrada-busqueda">
              <input
                type="text"
                id="roles-buscar"
                placeholder={
                  vistaActual === "roles"
                    ? "Buscar rol..."
                    : "Buscar usuario..."
                }
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

      {vistaActual === "usuarios" ? (
        // VISTA DE USUARIOS
        <>
          {usuariosPaginados.length === 0 ? (
            <div className="roles-estado-vacio">
              <div className="roles-icono-vacio">
                <Users size={80} strokeWidth={1.5} />
              </div>
              <p className="roles-mensaje-vacio">No se encontraron usuarios</p>
              <p className="roles-submensaje-vacio">
                {terminoBusqueda
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza agregando un usuario"}
              </p>
            </div>
          ) : (
            <>
              <div className="roles-contenedor-tabla">
                <table className="roles-tabla">
                  <thead>
                    <tr className="roles-fila-encabezado">
                      <th>ID</th>
                      <th>NOMBRE COMPLETO</th>
                      <th>GÉNERO</th>
                      <th>ROL</th>
                      <th>TELÉFONO</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosPaginados.map((usuario) => {
                      return (
                        <tr key={usuario.id_usuario} className="roles-fila-rol">
                          <td data-label="ID" className="roles-columna-id">
                            <span className="roles-badge-id">
                              #{usuario.id_usuario?.toString().padStart(3, "0")}
                            </span>
                          </td>

                          <td
                            data-label="Nombre Completo"
                            className="roles-columna-nombre"
                          >
                            <div className="roles-info-rol">
                              <div className="roles-logo">
                                {usuario.foto ? (
                                  <img
                                    src={usuario.foto}
                                    alt={obtenerNombreCompleto(usuario)}
                                    className="roles-imagen-logo"
                                  />
                                ) : (
                                  <span>
                                    {obtenerIniciales(
                                      usuario.nombre,
                                      usuario.apellido_paterno
                                    )}
                                  </span>
                                )}
                              </div>
                              <div className="roles-datos-rol">
                                <span className="roles-nombre-principal">
                                  {obtenerNombreCompleto(usuario)}
                                </span>
                                <span className="roles-subtexto">
                                  {usuario.email || "Sin email"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td
                            data-label="Género"
                            className="roles-columna-genero"
                          >
                            <div className="roles-genero-contenedor">
                              <span className="roles-genero-icono">
                                {obtenerIconoGenero(usuario.genero)}
                              </span>
                              <span className="roles-genero-texto">
                                {usuario.genero || "No especificado"}
                              </span>
                            </div>
                          </td>

                          <td data-label="Rol" className="roles-columna-puesto">
                            <div className="roles-puesto-badge">
                              <Shield size={14} />
                              <span>{obtenerNombreRol(usuario.rol_id)}</span>
                            </div>
                          </td>

                          <td
                            data-label="Teléfono"
                            className="roles-columna-telefono"
                          >
                            <div className="roles-telefono-contenedor">
                              <Phone size={14} />
                              <span>{usuario.telefono || "Sin teléfono"}</span>
                            </div>
                          </td>

                          <td
                            data-label="Acciones"
                            className="roles-columna-acciones"
                          >
                            <div className="roles-botones-accion">
                              <button
                                className="roles-boton-accion roles-ver"
                                onClick={() => manejarAccion("ver", usuario)}
                                title="Ver usuario"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="roles-boton-accion roles-editar"
                                onClick={() => manejarAccion("editar", usuario)}
                                title="Editar usuario"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="roles-boton-accion roles-eliminar"
                                onClick={() =>
                                  manejarAccion("eliminar", usuario)
                                }
                                title="Eliminar usuario"
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
                      (filtrado de {usuarios.length} registros totales)
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
                          className={`roles-numero-pagina ${
                            paginaActual === numero ? "roles-activo" : ""
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
        </>
      ) : (
        // VISTA DE ROLES
        <>
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
                      <th>PERMISOS Y ACCESOS</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesPaginados.map((rol) => {
                      const permisosDetallados = obtenerPermisosDetallados(
                        rol.permisos
                      );

                      return (
                        <tr key={rol.id_rol} className="roles-fila-rol">
                          <td data-label="ID" className="roles-columna-id">
                            <span className="roles-badge-id">
                              #{rol.id_rol?.toString().padStart(3, "0")}
                            </span>
                          </td>

                          <td
                            data-label="Nombre de Rol"
                            className="roles-columna-nombre"
                          >
                            <div className="roles-info-rol">
                              <div className="roles-logo">
                                {rol.icono_rol ? (
                                  <img
                                    src={rol.icono_rol}
                                    alt={rol.nombre_rol}
                                    className="roles-imagen-logo"
                                  />
                                ) : (
                                  <span>
                                    {obtenerIniciales(rol.nombre_rol)}
                                  </span>
                                )}
                              </div>
                              <div className="roles-datos-rol">
                                <span className="roles-nombre-principal">
                                  {rol.nombre_rol || "Sin nombre"}
                                </span>
                                <span className="roles-subtexto">
                                  {rol.usuarios_asignados
                                    ? `${rol.usuarios_asignados} usuarios`
                                    : "Sin usuarios"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td
                            data-label="Descripción"
                            className="roles-columna-descripcion"
                          >
                            <span className="roles-texto-descripcion">
                              {rol.descripcion || "Sin descripción"}
                            </span>
                          </td>

                          <td
                            data-label="Permisos y Accesos"
                            className="roles-columna-permisos-detallados"
                          >
                            {permisosDetallados.length === 0 ? (
                              <div className="roles-sin-permisos">
                                <Shield size={16} />
                                <span>Sin permisos asignados</span>
                              </div>
                            ) : (
                              <div className="roles-contenedor-permisos-detallados">
                                {permisosDetallados.map((permiso, idx) => (
                                  <div
                                    key={idx}
                                    className="roles-item-permiso-detallado"
                                    style={{
                                      borderLeft: `3px solid ${permiso.color}`,
                                    }}
                                  >
                                    <div className="roles-nombre-modulo">
                                      {permiso.modulo}
                                    </div>
                                    <div className="roles-accesos">
                                      {permiso.accesos.map((acceso, accIdx) => (
                                        <span
                                          key={accIdx}
                                          className={`roles-badge-acceso roles-acceso-${acceso.toLowerCase()}`}
                                        >
                                          {acceso}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                          <td
                            data-label="Acciones"
                            className="roles-columna-acciones"
                          >
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
                          className={`roles-numero-pagina ${
                            paginaActual === numero ? "roles-activo" : ""
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
        </>
      )}
    </div>
  );
};

export default TablaRoles;
