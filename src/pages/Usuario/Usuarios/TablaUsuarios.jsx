import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Users,
  Plus,
  UserCheck,
  Shield,
} from "lucide-react";
import "./TablaUsuarios.css";

const TablaUsuarios = ({
  usuarios = [],
  setUsuarios,
  onVer,
  onEditar,
  onEliminar,
  onAgregar,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      usuario.nombre?.toLowerCase().includes(busqueda) ||
      usuario.correo?.toLowerCase().includes(busqueda) ||
      usuario.id?.toString().includes(busqueda)
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
  const usuariosActivos = usuarios.filter((u) => u.estado === "activo").length;

  const obtenerIniciales = (nombre) => {
    if (!nombre) return "?";
    const palabras = nombre.trim().split(" ");
    if (palabras.length >= 2) {
      return `${palabras[0].charAt(0)}${palabras[1].charAt(0)}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
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
    <div className="usuarios-contenedor-principal">
      <div className="usuarios-encabezado">
        <div className="usuarios-seccion-logo">
          <div className="usuarios-lineas-decorativas">
            <div className="usuarios-linea usuarios-morado"></div>
            <div className="usuarios-linea usuarios-azul"></div>
            <div className="usuarios-linea usuarios-verde"></div>
            <div className="usuarios-linea usuarios-naranja"></div>
          </div>
          <h1 className="usuarios-titulo">Gestión de Usuarios</h1>
        </div>

        <div className="usuarios-contenedor-estadisticas">
          <div className="usuarios-estadistica">
            <div className="usuarios-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="usuarios-info-estadistica">
              <span className="usuarios-label-estadistica">
                TOTAL: {totalUsuarios}
              </span>
            </div>
          </div>

          <div className="usuarios-estadistica">
            <div className="usuarios-icono-estadistica-cuadrado">
              <UserCheck size={20} />
            </div>
            <div className="usuarios-info-estadistica">
              <span className="usuarios-label-estadistica">
                ACTIVOS: {usuariosActivos}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="usuarios-controles">
        <div className="usuarios-controles-izquierda">
          <div className="usuarios-control-registros">
            <label htmlFor="usuarios-registros">Mostrar</label>
            <select
              id="usuarios-registros"
              value={registrosPorPagina}
              onChange={(e) => {
                setRegistrosPorPagina(parseInt(e.target.value));
                setPaginaActual(1);
              }}
              className="usuarios-selector-registros"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>registros</span>
          </div>
        </div>

        <div className="usuarios-controles-derecha">
          <button className="usuarios-boton-agregar" onClick={onAgregar}>
            <Plus size={18} />
            Agregar Usuario
          </button>

          <div className="usuarios-control-busqueda">
            <label htmlFor="usuarios-buscar">Buscar:</label>
            <div className="usuarios-entrada-busqueda">
              <input
                type="text"
                id="usuarios-buscar"
                placeholder="Buscar usuario..."
                value={terminoBusqueda}
                onChange={(e) => {
                  setTerminoBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                className="usuarios-entrada-buscar"
              />
              <Search className="usuarios-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {usuariosPaginados.length === 0 ? (
        <div className="usuarios-estado-vacio">
          <div className="usuarios-icono-vacio">
            <Users size={80} strokeWidth={1.5} />
          </div>
          <p className="usuarios-mensaje-vacio">No se encontraron usuarios</p>
          <p className="usuarios-submensaje-vacio">
            {terminoBusqueda
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando un usuario"}
          </p>
        </div>
      ) : (
        <>
          <div className="usuarios-contenedor-tabla">
            <table className="usuarios-tabla">
              <thead>
                <tr className="usuarios-fila-encabezado">
                  <th>ID</th>
                  <th>USUARIO</th>
                  <th>CORREO</th>
                  <th>ROLES</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPaginados.map((usuario) => {
                  return (
                    <tr key={usuario.id} className="usuarios-fila-usuario">
                      <td data-label="ID" className="usuarios-columna-id">
                        <span className="usuarios-badge-id">
                          #{usuario.id?.toString().padStart(3, "0")}
                        </span>
                      </td>

                      <td
                        data-label="Usuario"
                        className="usuarios-columna-nombre"
                      >
                        <div className="usuarios-info-usuario">
                          <div className="usuarios-avatar">
                            <span>{obtenerIniciales(usuario.nombre)}</span>
                          </div>
                          <div className="usuarios-datos-usuario">
                            <span className="usuarios-nombre-principal">
                              {usuario.nombre || "Sin nombre"}
                            </span>
                            <span className="usuarios-subtexto">
                              {usuario.roles?.length || 0} rol(es)
                            </span>
                          </div>
                        </div>
                      </td>

                      <td data-label="Correo" className="usuarios-columna-correo">
                        <span className="usuarios-texto-correo">
                          {usuario.correo || "Sin correo"}
                        </span>
                      </td>

                      <td data-label="Roles" className="usuarios-columna-roles">
                        {usuario.roles && usuario.roles.length > 0 ? (
                          <div className="usuarios-contenedor-roles">
                            {usuario.roles.slice(0, 2).map((rol, idx) => (
                              <span key={idx} className="usuarios-badge-rol">
                                <Shield size={14} />
                                {rol.nombre}
                              </span>
                            ))}
                            {usuario.roles.length > 2 && (
                              <span className="usuarios-mas-roles">
                                +{usuario.roles.length - 2} más
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="usuarios-sin-roles">
                            <Shield size={16} />
                            <span>Sin roles</span>
                          </div>
                        )}
                      </td>

                      <td data-label="Estado" className="usuarios-columna-estado">
                        <span
                          className={`usuarios-badge-estado ${
                            usuario.estado === "activo"
                              ? "activo"
                              : "inactivo"
                          }`}
                        >
                          {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td
                        data-label="Acciones"
                        className="usuarios-columna-acciones"
                      >
                        <div className="usuarios-botones-accion">
                          <button
                            className="usuarios-boton-accion usuarios-ver"
                            onClick={() => manejarAccion("ver", usuario)}
                            title="Ver usuario"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="usuarios-boton-accion usuarios-editar"
                            onClick={() => manejarAccion("editar", usuario)}
                            title="Editar usuario"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="usuarios-boton-accion usuarios-eliminar"
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

          <div className="usuarios-pie-tabla">
            <div className="usuarios-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al{" "}
              {Math.min(indiceFin, totalRegistros)} de un total de{" "}
              {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{ color: "#6c757d", marginLeft: "0.5rem" }}>
                  (filtrado de {usuarios.length} registros totales)
                </span>
              )}
            </div>

            <div className="usuarios-controles-paginacion">
              <button
                className="usuarios-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>

              <div className="usuarios-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (numero) => (
                    <button
                      key={numero}
                      className={`usuarios-numero-pagina ${
                        paginaActual === numero ? "usuarios-activo" : ""
                      }`}
                      onClick={() => cambiarPagina(numero)}
                    >
                      {numero}
                    </button>
                  )
                )}
              </div>

              <button
                className="usuarios-boton-paginacion"
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