import { useState, useCallback } from "react";
import {
  X,
  Save,
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
} from "lucide-react";
import "./ModalAgregarRol.css";

const ModalAgregarRol = ({ onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    nombre_rol: "",
    descripcion: "",
    nivel_acceso: "",
    icono_rol: null,
    permisos: {
      dashboard: { activo: false, ver: false, editar: false, eliminar: false },
      ventas: {
        activo: false,
        modulos: {
          clientes: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
          cotizaciones: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
          pagos: { activo: false, ver: false, editar: false, eliminar: false },
        },
      },
      documentos: {
        activo: false,
        modulos: {
          contratos: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
          ordenes: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
          reservas: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
        },
      },
      operaciones: {
        activo: false,
        modulos: {
          operadores: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
          vehiculos: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
          guias: { activo: false, ver: false, editar: false, eliminar: false },
        },
      },
      servicios: {
        activo: false,
        modulos: {
          transporte: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
          restaurantes: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
          tours: { activo: false, ver: false, editar: false, eliminar: false },
          hospedaje: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
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
          usuarios: {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          },
        },
      },
    },
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState("general");
  const [guardando, setGuardando] = useState(false);

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

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErrores((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[nombreCampo];
      return nuevosErrores;
    });
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errores[name]) {
        limpiarErrorCampo(name);
      }
    },
    [errores, limpiarErrorCampo]
  );

  const handleFileChange = useCallback(
    (e) => {
      const { name, files } = e.target;
      if (files && files[0]) {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
        if (errores[name]) {
          limpiarErrorCampo(name);
        }
      }
    },
    [errores, limpiarErrorCampo]
  );

  const toggleModuloPrincipal = (moduloId) => {
    setFormData((prev) => {
      const nuevosPermisos = JSON.parse(JSON.stringify(prev.permisos));

      if (nuevosPermisos[moduloId].modulos) {
        const tieneSubmodulosActivos = Object.values(
          nuevosPermisos[moduloId].modulos
        ).some((sub) => sub.ver || sub.editar || sub.eliminar);

        if (tieneSubmodulosActivos) {
          nuevosPermisos[moduloId].activo = false;
          Object.keys(nuevosPermisos[moduloId].modulos).forEach((submodulo) => {
            nuevosPermisos[moduloId].modulos[submodulo] = {
              activo: false,
              ver: false,
              editar: false,
              eliminar: false,
            };
          });
        } else {
          nuevosPermisos[moduloId].activo = true;
        }
      } else {
        const nuevoEstado = !nuevosPermisos[moduloId].activo;
        nuevosPermisos[moduloId] = {
          activo: nuevoEstado,
          ver: nuevoEstado,
          editar: nuevoEstado,
          eliminar: nuevoEstado,
        };
      }

      return { ...prev, permisos: nuevosPermisos };
    });
  };

  const toggleSubmodulo = (moduloId, submoduloId) => {
    setFormData((prev) => {
      const nuevosPermisos = JSON.parse(JSON.stringify(prev.permisos));

      if (!nuevosPermisos[moduloId].modulos) {
        nuevosPermisos[moduloId].modulos = {};
      }

      if (!nuevosPermisos[moduloId].modulos[submoduloId]) {
        nuevosPermisos[moduloId].modulos[submoduloId] = {
          activo: false,
          ver: false,
          editar: false,
          eliminar: false,
        };
      }

      const estadoActual = nuevosPermisos[moduloId].modulos[submoduloId].activo;
      const nuevoEstado = !estadoActual;

      nuevosPermisos[moduloId].modulos[submoduloId] = {
        activo: nuevoEstado,
        ver: nuevoEstado,
        editar: nuevoEstado,
        eliminar: nuevoEstado,
      };

      const algunoActivo = Object.values(nuevosPermisos[moduloId].modulos).some(
        (sub) => sub.ver || sub.editar || sub.eliminar
      );

      nuevosPermisos[moduloId].activo = algunoActivo;

      return { ...prev, permisos: nuevosPermisos };
    });
  };

  const togglePermiso = (moduloId, submoduloId, tipoPermiso) => {
    setFormData((prev) => {
      const nuevosPermisos = JSON.parse(JSON.stringify(prev.permisos));

      if (submoduloId) {
        if (!nuevosPermisos[moduloId].modulos) {
          nuevosPermisos[moduloId].modulos = {};
        }

        if (!nuevosPermisos[moduloId].modulos[submoduloId]) {
          nuevosPermisos[moduloId].modulos[submoduloId] = {
            activo: false,
            ver: false,
            editar: false,
            eliminar: false,
          };
        }

        nuevosPermisos[moduloId].modulos[submoduloId][tipoPermiso] =
          !nuevosPermisos[moduloId].modulos[submoduloId][tipoPermiso];

        const tienePermisos = ["ver", "editar", "eliminar"].some(
          (p) => nuevosPermisos[moduloId].modulos[submoduloId][p]
        );
        nuevosPermisos[moduloId].modulos[submoduloId].activo = tienePermisos;

        const algunoActivo = Object.values(
          nuevosPermisos[moduloId].modulos
        ).some((sub) => sub.activo);
        nuevosPermisos[moduloId].activo = algunoActivo;
      } else {
        nuevosPermisos[moduloId][tipoPermiso] =
          !nuevosPermisos[moduloId][tipoPermiso];

        const tienePermisos = ["ver", "editar", "eliminar"].some(
          (p) => nuevosPermisos[moduloId][p]
        );
        nuevosPermisos[moduloId].activo = tienePermisos;
      }

      return { ...prev, permisos: nuevosPermisos };
    });
  };

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};
    if (!formData.nombre_rol.trim()) {
      nuevosErrores.nombre_rol = "El nombre del rol es requerido";
    }

    return nuevosErrores;
  }, [formData]);

  const mostrarNotificacionExito = () => {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({
        title: "¡Rol Creado!",
        text: `El rol "${formData.nombre_rol}" ha sido creado correctamente`,
        icon: "success",
        iconHtml: "✓",
        iconColor: "#28a745",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#28a745",
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
        customClass: {
          popup: "swal-popup-custom-editar",
          title: "swal-title-custom-editar",
          content: "swal-content-custom-editar",
          confirmButton: "swal-button-custom-editar",
          icon: "swal-icon-success-custom",
        },
        background: "#ffffff",
        backdrop: `
          rgba(44, 62, 80, 0.8)
          left top
          no-repeat
        `,
      });
    } else {
      alert(`✅ Rol "${formData.nombre_rol}" creado correctamente`);
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const nuevosErrores = validarFormulario();

      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        setSeccionActiva("general");
        return;
      }

      setGuardando(true);

      try {
        const nuevoRol = {
          id_rol: Date.now(),
          nombre_rol: formData.nombre_rol,
          descripcion: formData.descripcion,
          nivel_acceso: formData.nivel_acceso,
          icono_rol: formData.icono_rol,
          permisos: formData.permisos,
          usuarios_asignados: 0,
          estado: "activo",
        };

        await onGuardar(nuevoRol);

        setGuardando(false);

        // Mostrar notificación de éxito
        mostrarNotificacionExito();

        // Cerrar modal después de un breve delay
        setTimeout(() => {
          onCerrar();
        }, 500);
      } catch (error) {
        console.error("Error al crear el rol:", error);
        setGuardando(false);

        if (typeof window !== "undefined" && window.Swal) {
          window.Swal.fire({
            title: "Error",
            text: "Hubo un problema al crear el rol. Por favor, intenta nuevamente.",
            icon: "error",
            confirmButtonText: "Reintentar",
            confirmButtonColor: "#dc3545",
            customClass: {
              popup: "swal-popup-custom-editar",
              title: "swal-title-custom-editar",
              content: "swal-content-custom-editar",
              confirmButton: "swal-button-error-editar",
            },
          });
        } else {
          alert("❌ Error al crear el rol");
        }
      }
    },
    [formData, validarFormulario, onGuardar, onCerrar]
  );

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="mar-error-mensaje">{error}</span>;
  };

  const renderSeccionGeneral = () => (
    <div className="mar-form">
      <div className="mar-form-grid">
        <div className="mar-form-group">
          <label>
            Nombre del Rol <span className="mar-required">*</span>
          </label>
          <input
            type="text"
            name="nombre_rol"
            value={formData.nombre_rol}
            onChange={handleChange}
            placeholder="Ej: Administrador General"
            className={errores.nombre_rol ? "input-error" : ""}
          />
          <MensajeError nombreCampo="nombre_rol" />
        </div>

        <div className="mar-form-group form-group-full">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe las responsabilidades del rol..."
            rows="3"
          />
        </div>
      </div>
    </div>
  );

  const renderSeccionPermisos = () => (
    <div className="mar-form">
      <div className="permisos-header">
        <Shield size={24} />
        <div>
          <h3>Configuración de Permisos</h3>
          <p>Selecciona los módulos y permisos específicos para este rol</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {modulosPrincipales.map((modulo) => {
          const permisoModulo = formData.permisos[modulo.id] || {};
          const esActivo = permisoModulo.activo || false;

          return (
            <div
              key={modulo.id}
              className="permiso-card"
              style={{ borderColor: esActivo ? modulo.color : "#e5e7eb" }}
            >
              <div
                className="permiso-card-header"
                style={{ background: `${modulo.color}15` }}
              >
                <div className="permiso-card-info">
                  <div
                    className="permiso-icono"
                    style={{ background: modulo.color }}
                  >
                    {modulo.icono}
                  </div>
                  <div>
                    <h4>{modulo.nombre}</h4>
                    <p>{modulo.descripcion}</p>
                  </div>
                </div>
                <label className="permiso-switch">
                  <input
                    type="checkbox"
                    checked={esActivo}
                    onChange={() => toggleModuloPrincipal(modulo.id)}
                  />
                  <span
                    className="permiso-slider"
                    style={{ background: esActivo ? modulo.color : "#cbd5e1" }}
                  ></span>
                </label>
              </div>

              {esActivo && !modulo.submodulos && (
                <div className="permiso-acciones">
                  <label className="permiso-accion">
                    <input
                      type="checkbox"
                      checked={permisoModulo.ver || false}
                      onChange={() => togglePermiso(modulo.id, null, "ver")}
                    />
                    <Eye size={16} />
                    <span>Ver</span>
                  </label>
                  <label className="permiso-accion">
                    <input
                      type="checkbox"
                      checked={permisoModulo.editar || false}
                      onChange={() => togglePermiso(modulo.id, null, "editar")}
                    />
                    <Edit size={16} />
                    <span>Editar</span>
                  </label>
                  <label className="permiso-accion">
                    <input
                      type="checkbox"
                      checked={permisoModulo.eliminar || false}
                      onChange={() =>
                        togglePermiso(modulo.id, null, "eliminar")
                      }
                    />
                    <Trash2 size={16} />
                    <span>Eliminar</span>
                  </label>
                </div>
              )}

              {esActivo && modulo.submodulos && (
                <div className="permisos-submodulos">
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
                      <div key={submoduloId} className="permiso-submodulo">
                        <div className="permiso-submodulo-header">
                          <label className="permiso-checkbox">
                            <input
                              type="checkbox"
                              checked={submoduloActivo}
                              onChange={() =>
                                toggleSubmodulo(modulo.id, submoduloId)
                              }
                            />
                            <span className="permiso-submodulo-nombre">
                              {submoduloId.charAt(0).toUpperCase() +
                                submoduloId.slice(1)}
                            </span>
                          </label>
                        </div>

                        {submoduloActivo && (
                          <div className="permiso-acciones-sub">
                            <label className="permiso-accion-small">
                              <input
                                type="checkbox"
                                checked={permisoSubmodulo.ver || false}
                                onChange={() =>
                                  togglePermiso(modulo.id, submoduloId, "ver")
                                }
                              />
                              <Eye size={14} />
                              <span>Ver</span>
                            </label>
                            <label className="permiso-accion-small">
                              <input
                                type="checkbox"
                                checked={permisoSubmodulo.editar || false}
                                onChange={() =>
                                  togglePermiso(
                                    modulo.id,
                                    submoduloId,
                                    "editar"
                                  )
                                }
                              />
                              <Edit size={14} />
                              <span>Editar</span>
                            </label>
                            <label className="permiso-accion-small">
                              <input
                                type="checkbox"
                                checked={permisoSubmodulo.eliminar || false}
                                onChange={() =>
                                  togglePermiso(
                                    modulo.id,
                                    submoduloId,
                                    "eliminar"
                                  )
                                }
                              />
                              <Trash2 size={14} />
                              <span>Eliminar</span>
                            </label>
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
    <div className="mar-overlay" onClick={onCerrar}>
      <div className="mar-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="mar-header">
          <h2>Agregar Nuevo Rol</h2>
          <button onClick={onCerrar} type="button" className="mar-btn-cerrar">
            <X size={24} />
          </button>
        </div>

        <div className="mar-tabs">
          <button
            type="button"
            onClick={() => setSeccionActiva("general")}
            className={`mar-tab-button ${
              seccionActiva === "general" ? "active" : ""
            }`}
          >
            <Building2 size={18} />
            Información General
          </button>
          <button
            type="button"
            onClick={() => setSeccionActiva("permisos")}
            className={`mar-tab-button ${
              seccionActiva === "permisos" ? "active" : ""
            }`}
          >
            <Shield size={18} />
            Permisos
          </button>
        </div>

        {seccionActiva === "general" && renderSeccionGeneral()}
        {seccionActiva === "permisos" && renderSeccionPermisos()}

        <div className="mar-footer">
          <button type="button" onClick={onCerrar} className="mar-btn-cancelar">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={guardando}
            className="mar-btn-guardar"
          >
            <Save size={20} />
            {guardando ? "Guardando..." : "Guardar Rol"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarRol;
