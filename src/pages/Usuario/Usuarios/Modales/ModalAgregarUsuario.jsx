import { useState, useCallback } from "react";
import {
  X,
  Save,
  User,
  Mail,
  Lock,
  Shield,
  CheckSquare,
  Square,
} from "lucide-react";
import "./ModalAgregarUsuario.css";

const ModalAgregarUsuario = ({ onGuardar, onCerrar, roles = [] }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    foto: null,
    genero: "",
    estado: "activo",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    rolesSeleccionados: [],
  });

  const [errores, setErrores] = useState({});
  const [seccionActiva, setSeccionActiva] = useState("general");
  const [guardando, setGuardando] = useState(false);

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

  const toggleRol = (rolId) => {
    setFormData((prev) => {
      const rolesActuales = [...prev.rolesSeleccionados];
      const index = rolesActuales.indexOf(rolId);

      if (index > -1) {
        rolesActuales.splice(index, 1);
      } else {
        rolesActuales.push(rolId);
      }

      return { ...prev, rolesSeleccionados: rolesActuales };
    });
  };

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    }

    if (!formData.correo.trim()) {
      nuevosErrores.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      nuevosErrores.correo = "El correo no es válido";
    }

    if (!formData.contrasena.trim()) {
      nuevosErrores.contrasena = "La contraseña es requerida";
    } else if (formData.contrasena.length < 6) {
      nuevosErrores.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    }

    return nuevosErrores;
  }, [formData]);

  const mostrarNotificacionExito = () => {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({
        title: "¡Usuario Creado!",
        text: `El usuario "${formData.nombre}" ha sido creado correctamente`,
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#28a745",
        timer: 3000,
      });
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      const nuevosErrores = validarFormulario();

      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        setSeccionActiva("general");
        return;
      }

      setGuardando(true);

      try {
        await onGuardar(formData);
        setGuardando(false);
        mostrarNotificacionExito();
        setTimeout(() => onCerrar(), 500);
      } catch (error) {
        console.error("Error al crear:", error);
        setGuardando(false);
      }
    },
    [formData, validarFormulario, onGuardar, onCerrar]
  );

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="modal-agregar-usuario-error-mensaje">{error}</span>;
  };

  const renderSeccionGeneral = () => (
    <div className="modal-agregar-usuario-form">
      <div className="modal-agregar-usuario-form-grid">
        {/* Nombre */}
        <div className="modal-agregar-usuario-form-group">
          <label>
            Nombre <span className="modal-agregar-usuario-required">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan"
            className={errores.nombre ? "modal-agregar-usuario-input-error" : ""}
          />
          <MensajeError nombreCampo="nombre" />
        </div>

        {/* Apellido Paterno */}
        <div className="modal-agregar-usuario-form-group">
          <label>Apellido Paterno</label>
          <input
            type="text"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            placeholder="Pérez"
          />
        </div>

        {/* Apellido Materno */}
        <div className="modal-agregar-usuario-form-group">
          <label>Apellido Materno</label>
          <input
            type="text"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            placeholder="García"
          />
        </div>

        {/* Género */}
        <div className="modal-agregar-usuario-form-group modal-agregar-usuario-form-group-full">
          <label>Género</label>
          <select name="genero" value={formData.genero} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
          </select>
        </div>

        {/* Correo Electrónico */}
        <div className="modal-agregar-usuario-form-group modal-agregar-usuario-form-group-full">
          <label>
            Correo Electrónico <span className="modal-agregar-usuario-required">*</span>
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            className={errores.correo ? "modal-agregar-usuario-input-error" : ""}
          />
          <MensajeError nombreCampo="correo" />
        </div>

        {/* Contraseña */}
        <div className="modal-agregar-usuario-form-group">
          <label>
            Contraseña <span className="modal-agregar-usuario-required">*</span>
          </label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            className={errores.contrasena ? "modal-agregar-usuario-input-error" : ""}
          />
          <MensajeError nombreCampo="contrasena" />
        </div>

        {/* Confirmar Contraseña */}
        <div className="modal-agregar-usuario-form-group">
          <label>
            Confirmar Contraseña <span className="modal-agregar-usuario-required">*</span>
          </label>
          <input
            type="password"
            name="confirmarContrasena"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            placeholder="Repite la contraseña"
            className={
              errores.confirmarContrasena ? "modal-agregar-usuario-input-error" : ""
            }
          />
          <MensajeError nombreCampo="confirmarContrasena" />
        </div>
      </div>
    </div>
  );

  const renderSeccionRoles = () => (
    <div className="modal-agregar-usuario-form">
      <div className="modal-agregar-usuario-roles-header">
        <Shield size={24} />
        <div>
          <h3>Asignar Roles</h3>
          <p>Selecciona los roles que tendrá este usuario</p>
        </div>
      </div>

      {roles.length === 0 ? (
        <div className="modal-agregar-usuario-sin-roles">
          <Shield size={48} />
          <p>No hay roles disponibles</p>
        </div>
      ) : (
        <div className="modal-agregar-usuario-roles-grid">
          {roles.map((rol) => {
            const seleccionado = formData.rolesSeleccionados.includes(rol.id);

            return (
              <div
                key={rol.id}
                className={`modal-agregar-usuario-rol-card ${seleccionado ? "seleccionado" : ""
                  }`}
                onClick={() => toggleRol(rol.id)}
              >
                <div className="modal-agregar-usuario-rol-checkbox">
                  {seleccionado ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>
                <div className="modal-agregar-usuario-rol-info">
                  <h4>{rol.nombre}</h4>
                  <p>{rol.descripcion || "Sin descripción"}</p>
                  <span className="modal-agregar-usuario-rol-permisos">
                    {rol.permissions?.length || 0} permisos
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="modal-agregar-usuario-overlay" onClick={onCerrar}>
      <div
        className="modal-agregar-usuario-contenido"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-agregar-usuario-header">
          <h2>Agregar Usuario</h2>
          <button onClick={onCerrar} type="button" className="modal-agregar-usuario-btn-cerrar">
            <X size={24} />
          </button>
        </div>

        <div className="modal-agregar-usuario-tabs">
          <button
            type="button"
            onClick={() => setSeccionActiva("general")}
            className={`modal-agregar-usuario-tab-button ${seccionActiva === "general" ? "active" : ""
              }`}
          >
            <User size={18} />
            Información General
          </button>
          <button
            type="button"
            onClick={() => setSeccionActiva("roles")}
            className={`modal-agregar-usuario-tab-button ${seccionActiva === "roles" ? "active" : ""
              }`}
          >
            <Shield size={18} />
            Roles
          </button>
        </div>

        {seccionActiva === "general" && renderSeccionGeneral()}
        {seccionActiva === "roles" && renderSeccionRoles()}

        <div className="modal-agregar-usuario-footer">
          <div className="modal-agregar-usuario-botones-izquierda">
            <button
              type="button"
              onClick={onCerrar}
              className="modal-agregar-usuario-btn-cancelar"
            >
              Cancelar
            </button>
          </div>
          <div className="modal-agregar-usuario-botones-derecha">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={guardando}
              className={`modal-agregar-usuario-btn-guardar ${guardando ? "loading" : ""}`}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? "Guardando..." : "Guardar Usuario"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarUsuario;