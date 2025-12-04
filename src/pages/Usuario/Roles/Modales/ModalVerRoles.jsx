import { useState } from "react";
import {
  X,
  Building2,
  Shield,
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Settings,
  Wrench,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import "./ModalVerRoles.css";

const ModalVerRoles = ({ rol, onCerrar }) => {
  const [seccionActiva, setSeccionActiva] = useState("general");

  const modulosPrincipales = [
    {
      id: "dashboard",
      nombre: "Dashboard",
      icono: <LayoutDashboard size={20} />,
      descripcion: "Panel principal con métricas y reportes",
      color: "#3b82f6",
    },
    {
      id: "ventas",
      nombre: "Ventas",
      icono: <ShoppingCart size={20} />,
      descripcion: "Gestión de clientes, cotizaciones y pagos",
      color: "#10b981",
      submodulos: ["clientes", "cotizaciones", "pagos"],
    },
    {
      id: "documentos",
      nombre: "Documentos",
      icono: <FileText size={20} />,
      descripcion: "Contratos, órdenes y reservas",
      color: "#f59e0b",
      submodulos: ["contratos", "ordenes", "reservas"],
    },
    {
      id: "operaciones",
      nombre: "Operaciones",
      icono: <Settings size={20} />,
      descripcion: "Operadores, vehículos y guías",
      color: "#8b5cf6",
      submodulos: ["operadores", "vehiculos", "guias"],
    },
    {
      id: "servicios",
      nombre: "Servicios",
      icono: <Building2 size={20} />,
      descripcion: "Transporte, restaurantes, tours y hospedaje",
      color: "#ec4899",
      submodulos: ["transporte", "restaurantes", "tours", "hospedaje"],
    },
    {
      id: "mantenimiento",
      nombre: "Mantenimiento",
      icono: <Wrench size={20} />,
      descripcion: "Mantenimiento preventivo y correctivo",
      color: "#ef4444",
    },
    {
      id: "administracion",
      nombre: "Administración",
      icono: <Users size={20} />,
      descripcion: "Gestión de roles y usuarios del sistema",
      color: "#6366f1",
      submodulos: ["roles", "usuarios"],
    },
  ];

  // ⭐ AGREGAR ESTA FUNCIÓN COMPLETA
  const transformarIdsAPermisos = (permissionsArray) => {
    const estructura = {
      dashboard: { activo: false, ver: false, editar: false, eliminar: false },
      ventas: {
        activo: false,
        modulos: {
          clientes: { activo: false, ver: false, editar: false, eliminar: false },
          cotizaciones: { activo: false, ver: false, editar: false, eliminar: false },
          pagos: { activo: false, ver: false, editar: false, eliminar: false },
        },
      },
      documentos: {
        activo: false,
        modulos: {
          contratos: { activo: false, ver: false, editar: false, eliminar: false },
          ordenes: { activo: false, ver: false, editar: false, eliminar: false },
          reservas: { activo: false, ver: false, editar: false, eliminar: false },
        },
      },
      operaciones: {
        activo: false,
        modulos: {
          operadores: { activo: false, ver: false, editar: false, eliminar: false },
          vehiculos: { activo: false, ver: false, editar: false, eliminar: false },
          guias: { activo: false, ver: false, editar: false, eliminar: false },
        },
      },
      servicios: {
        activo: false,
        modulos: {
          transporte: { activo: false, ver: false, editar: false, eliminar: false },
          restaurantes: { activo: false, ver: false, editar: false, eliminar: false },
          tours: { activo: false, ver: false, editar: false, eliminar: false },
          hospedaje: { activo: false, ver: false, editar: false, eliminar: false },
        },
      },
      mantenimiento: {
        activo: false,
        ver: false,
        editar: false,
        eliminar: false,
      },
      administracion: {
        activo: false,
        modulos: {
          roles: { activo: false, ver: false, editar: false, eliminar: false },
          usuarios: { activo: false, ver: false, editar: false, eliminar: false },
        },
      },
    };

    if (!permissionsArray || !Array.isArray(permissionsArray)) {
      return estructura;
    }

    permissionsArray.forEach((permiso) => {
      const partes = permiso.nombre.split(".");

      if (partes.length === 2) {
        // Módulo sin submódulos (ej: dashboard.ver)
        const [modulo, accion] = partes;
        if (estructura[modulo] && !estructura[modulo].modulos) {
          estructura[modulo][accion] = true;
          estructura[modulo].activo = true;
        }
      } else if (partes.length === 3) {
        // Módulo con submódulos (ej: ventas.clientes.ver)
        const [modulo, submodulo, accion] = partes;
        if (estructura[modulo]?.modulos?.[submodulo]) {
          estructura[modulo].modulos[submodulo][accion] = true;
          estructura[modulo].modulos[submodulo].activo = true;
          estructura[modulo].activo = true;
        }
      }
    });

    return estructura;
  };

  const renderSeccionGeneral = () => (
    <div className="mvr-seccion-general">
      <div className="mvr-form-group">
        <label>Nombre del Rol</label>
        <div className="mvr-campo-readonly">{rol.nombre}</div>
      </div>

      <div className="mvr-form-group">
        <label>Descripción</label>
        <div className="mvr-campo-readonly textarea">
          {rol.descripcion || "Sin descripción"}
        </div>
      </div>
    </div>
  );

  const renderSeccionPermisos = () => (
    <div className="mvr-seccion-permisos">
      <div className="mvr-permisos-header">
        <Shield size={24} color="#0284c7" />
        <div>
          <h3>Permisos Asignados</h3>
          <p>Visualización de todos los módulos y permisos configurados</p>
        </div>
      </div>

      <div className="mvr-modulos-grid">
        {modulosPrincipales.map((modulo) => {
          const permisosTransformados = transformarIdsAPermisos(rol.permissions || []);
          const permisoModulo = permisosTransformados[modulo.id] || {};
          const esActivo = permisoModulo.activo || false;

          return (
            <div
              key={modulo.id}
              className={`mvr-modulo-card ${esActivo ? "activo" : "inactivo"}`}
              style={{
                borderColor: esActivo ? modulo.color : "#e5e7eb",
              }}
            >
              <div
                className={`mvr-modulo-header ${esActivo ? "activo" : ""}`}
                style={{
                  "--modulo-color": modulo.color,
                  "--modulo-color-light": `${modulo.color}15`,
                }}
              >
                <div className="mvr-modulo-info">
                  <div
                    className={`mvr-modulo-icono ${esActivo ? "activo" : "inactivo"
                      }`}
                    style={{
                      "--modulo-color": modulo.color,
                    }}
                  >
                    {modulo.icono}
                  </div>
                  <div className="mvr-modulo-nombre">
                    <h4>{modulo.nombre}</h4>
                    <p>{modulo.descripcion}</p>
                  </div>
                </div>
                <div
                  className={`mvr-modulo-badge ${esActivo ? "activo" : "inactivo"
                    }`}
                >
                  {esActivo ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {esActivo ? "Activo" : "Inactivo"}
                </div>
              </div>

              {esActivo && !modulo.submodulos && (
                <div className="mvr-modulo-permisos">
                  <PermisoIndicador
                    icono={<Eye size={16} />}
                    texto="Ver"
                    activo={permisoModulo.ver}
                  />
                  <PermisoIndicador
                    icono={<Edit size={16} />}
                    texto="Editar"
                    activo={permisoModulo.editar}
                  />
                  <PermisoIndicador
                    icono={<Trash2 size={16} />}
                    texto="Eliminar"
                    activo={permisoModulo.eliminar}
                  />
                </div>
              )}

              {esActivo && modulo.submodulos && (
                <div className="mvr-submodulos">
                  {modulo.submodulos.map((submoduloId) => {
                    const permisoSubmodulo = permisoModulo.modulos?.[
                      submoduloId
                    ] || {
                      activo: false,
                      ver: false,
                      editar: false,
                      eliminar: false,
                    };
                    const submoduloActivo = permisoSubmodulo.activo || false;

                    return (
                      <div
                        key={submoduloId}
                        className={`mvr-submodulo ${submoduloActivo ? "activo" : "inactivo"
                          }`}
                      >
                        <div
                          className={`mvr-submodulo-header ${!submoduloActivo ? "sin-permisos" : ""
                            }`}
                        >
                          <span className="mvr-submodulo-nombre">
                            {submoduloId.charAt(0).toUpperCase() +
                              submoduloId.slice(1)}
                          </span>
                          <div
                            className={`mvr-submodulo-badge ${submoduloActivo ? "activo" : "inactivo"
                              }`}
                          >
                            {submoduloActivo ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {submoduloActivo ? "Activo" : "Inactivo"}
                          </div>
                        </div>

                        {submoduloActivo && (
                          <div className="mvr-submodulo-permisos">
                            <PermisoIndicador
                              icono={<Eye size={14} />}
                              texto="Ver"
                              activo={permisoSubmodulo.ver}
                              small
                            />
                            <PermisoIndicador
                              icono={<Edit size={14} />}
                              texto="Editar"
                              activo={permisoSubmodulo.editar}
                              small
                            />
                            <PermisoIndicador
                              icono={<Trash2 size={14} />}
                              texto="Eliminar"
                              activo={permisoSubmodulo.eliminar}
                              small
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="mvr-overlay" onClick={onCerrar}>
      <div className="mvr-contenido" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mvr-header">
          <h2>Detalles del Rol</h2>
          <button onClick={onCerrar} className="mvr-btn-cerrar">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mvr-tabs">
          <button
            onClick={() => setSeccionActiva("general")}
            className={`mvr-tab-button ${seccionActiva === "general" ? "active" : ""
              }`}
          >
            <Building2 size={20} />
            Información General
          </button>
          <button
            onClick={() => setSeccionActiva("permisos")}
            className={`mvr-tab-button ${seccionActiva === "permisos" ? "active" : ""
              }`}
          >
            <Shield size={20} />
            Permisos
          </button>
        </div>

        {/* Content */}
        <div className="mvr-content">
          {seccionActiva === "general" && renderSeccionGeneral()}
          {seccionActiva === "permisos" && renderSeccionPermisos()}
        </div>

        {/* Footer */}
        <div className="mvr-footer">
          <button onClick={onCerrar} className="mvr-btn-cerrar-footer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const PermisoIndicador = ({ icono, texto, activo, small }) => (
  <div
    className={`mvr-permiso-indicador ${small ? "small" : ""} ${activo ? "activo" : "inactivo"
      }`}
  >
    {icono}
    <span>{texto}</span>
  </div>
);

export default ModalVerRoles;