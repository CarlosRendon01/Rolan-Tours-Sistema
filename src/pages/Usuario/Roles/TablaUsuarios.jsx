import React, { useState } from "react";
import {
  Search,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Building2,
  Users,
  Plus,
  User,
  Phone,
  Shield,
} from "lucide-react";
import "./TablaRoles.css";

const TablaUsuarios = ({
  usuarios = [],
  roles = [],
  setUsuarios,
  onVer,
  onEditar,
  onEliminar,
  onAgregar,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // Función para obtener el nombre del rol
  const obtenerNombreRol = (rol_id) => {
    const rol = roles.find((r) => r.id_rol === rol_id);
    return rol ? rol.nombre_rol : "Sin rol asignado";
  };

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
  const totalRegistros = usuariosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceFin);

  // Estadísticas
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(
    (u) => u.estado === "activo" || !u.estado
  ).length;

  const obtenerIniciales = (nombre, apellidoPaterno) => {
    if (!nombre) return "?";
    const inicial1 = nombre.charAt(0).toUpperCase();
    const inicial2 = apellidoPaterno
      ? apellidoPaterno.charAt(0).toUpperCase()
      : nombre.charAt(1).toUpperCase();
    return `${inicial1}${inicial2}`;
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

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const manejarAccion = (accion, usuario) => {
    switch (accion) {
      case "ver":
        onVer(usuario);
        break;
      case "editar":
        onEditar(usuario);
        break;
      case "eliminar":
        onEliminar(usuario);
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
          <h1 className="roles-titulo">Gestión de Usuarios</h1>
        </div>

        <div className="roles-contenedor-estadisticas">
          <div className="roles-estadistica">
            <div className="roles-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="roles-info-estadistica">
              <span className="roles-label-estadistica">
                TOTAL: {totalUsuarios}
              </span>
            </div>
          </div>

          <div className="roles-estadistica">
            <div className="roles-icono-estadistica-cuadrado">
              <Building2 size={20} />
            </div>
            <div className="roles-info-estadistica">
              <span className="roles-label-estadistica">
                ACTIVOS: {usuariosActivos}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="roles-controles">
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

        <div className="roles-controles-derecha">
          <button className="roles-boton-agregar" onClick={onAgregar}>
            <Plus size={18} />
            Agregar Usuario
          </button>

          <div className="roles-control-busqueda">
            <label htmlFor="roles-buscar">Buscar:</label>
            <div className="roles-entrada-busqueda">
              <input
                type="text"
                id="roles-buscar"
                placeholder="Buscar usuario..."
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

                      <td data-label="Género" className="roles-columna-genero">
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
                            onClick={() => manejarAccion("eliminar", usuario)}
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
    </div>
  );
};

export default TablaUsuarios;
