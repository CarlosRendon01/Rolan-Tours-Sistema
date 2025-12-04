import { useState, useCallback, useEffect } from "react";
import { X, Save, User, Mail, Phone, Shield, Camera, CheckSquare, Square } from "lucide-react";
import "./ModalEditarUsuario.css";

const ModalEditarUsuario = ({ usuario, onGuardar, onCerrar, roles = [] }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "", // Cambio: era email
    contrasena: "",
    confirmarContrasena: "",
    apellido_paterno: "",
    apellido_materno: "",
    foto: null,
    genero: "",
    estado: "activo",
    rolesSeleccionados: [],
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("general");
  const [vistaPrevia, setVistaPrevia] = useState(null);

  const generos = ["Masculino", "Femenino", "Otro", "Prefiero no decir"];
  const estados = ["activo", "inactivo"];

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        correo: usuario.correo || "", // Cambio: era email
        contrasena: "",
        confirmarContrasena: "",
        apellido_paterno: usuario.apellido_paterno || "",
        apellido_materno: usuario.apellido_materno || "",
        genero: usuario.genero || "",
        estado: usuario.estado || "activo",
        rolesSeleccionados: usuario.roles?.map((r) => r.id) || [], // ⭐ AGREGAR ESTO
      });
    }
    // Si hay foto existente, mostrarla
    if (usuario.foto) {
      setVistaPrevia(usuario.foto);
    }
  }, [usuario]);

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

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

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
        const file = files[0];
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));

        // Crear vista previa
        const reader = new FileReader();
        reader.onloadend = () => {
          setVistaPrevia(reader.result);
        };
        reader.readAsDataURL(file);

        if (errores[name]) {
          limpiarErrorCampo(name);
        }
      }
    },
    [errores, limpiarErrorCampo]
  );

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

    if (formData.contrasena && formData.contrasena.trim() !== "") {
      if (formData.contrasena.length < 6) {
        nuevosErrores.contrasena = "La contraseña debe tener al menos 6 caracteres";
      }
      if (formData.contrasena !== formData.confirmarContrasena) {
        nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
      }
    }
    return nuevosErrores;
  }, [formData]);

  const mostrarNotificacionExito = (nombreCompleto) => {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({
        title: "¡Usuario Actualizado!",
        text: `El usuario "${nombreCompleto}" ha sido actualizado correctamente`,
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
      alert(`¡Usuario ${nombreCompleto} actualizado exitosamente!`);
    }
  };

  const handleSubmit = useCallback(async () => {
    console.log("🔍 Iniciando validación...");

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      console.log("❌ Errores de validación:", nuevosErrores);

      setTimeout(() => {
        const primerCampoConError = Object.keys(nuevosErrores)[0];
        const elemento = document.querySelector(
          `[name="${primerCampoConError}"]`
        );
        if (elemento) {
          elemento.focus();
          elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      return;
    }

    console.log("✅ Validación exitosa, actualizando usuario...");
    setGuardando(true);

    try {
      const usuarioActualizado = {
        ...usuario,
        ...formData,
        fecha_modificacion: new Date().toISOString(),
      };

      console.log("📦 Datos a actualizar:", usuarioActualizado);

      const nombreCompleto = `${formData.nombre} ${formData.apellido_paterno}`;

      await onGuardar(usuarioActualizado);

      console.log("✅ Usuario actualizado, mostrando notificación...");

      setGuardando(false);

      // Mostrar notificación de éxito
      mostrarNotificacionExito(nombreCompleto);

      // Cerrar modal después de un breve delay
      setTimeout(() => {
        onCerrar();
      }, 500);
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      setGuardando(false);

      if (typeof window !== "undefined" && window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Hubo un problema al actualizar el usuario. Por favor, intenta nuevamente.",
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
        alert(
          "Hubo un problema al actualizar el usuario. Por favor, inténtalo de nuevo."
        );
      }
    }
  }, [usuario, formData, validarFormulario, onGuardar, onCerrar]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;

    return <span className="modal-editar-usuario-error-mensaje">{error}</span>;
  };

  const renderSeccionGeneral = () => (
    <div className="modal-editar-usuario-form">
      <div className="modal-editar-usuario-form-grid">
        {/* Nombre */}
        <div className="modal-editar-usuario-form-group">
          <label htmlFor="nombre">
            Nombre <span className="modal-editar-usuario-required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errores.nombre ? "modal-editar-usuario-input-error" : ""}
            placeholder="Juan"
          />
          <MensajeError nombreCampo="nombre" />
        </div>

        {/* Apellido Paterno */}
        <div className="modal-editar-usuario-form-group">
          <label htmlFor="apellido_paterno">Apellido Paterno</label>
          <input
            type="text"
            id="apellido_paterno"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            placeholder="Pérez"
          />
        </div>

        {/* Apellido Materno */}
        <div className="modal-editar-usuario-form-group">
          <label htmlFor="apellido_materno">Apellido Materno</label>
          <input
            type="text"
            id="apellido_materno"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            placeholder="García"
          />
        </div>

        {/* Correo Electrónico */}
        <div className="modal-editar-usuario-form-group">
          <label htmlFor="correo">
            Correo Electrónico{" "}
            <span className="modal-editar-usuario-required">*</span>
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className={errores.correo ? "modal-editar-usuario-input-error" : ""}
            placeholder="correo@ejemplo.com"
          />
          <MensajeError nombreCampo="correo" />
        </div>

        {/* Nueva Contraseña */}
        <div className="modal-editar-usuario-form-group">
          <label htmlFor="contrasena">Nueva Contraseña</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            className={errores.contrasena ? "modal-editar-usuario-input-error" : ""}
            placeholder="Dejar vacío para no cambiar"
          />
          <MensajeError nombreCampo="contrasena" />
          <span className="modal-editar-usuario-hint">
            Solo completa este campo si deseas cambiar la contraseña
          </span>
        </div>

        {/* Confirmar Nueva Contraseña */}
        <div className="modal-editar-usuario-form-group">
          <label htmlFor="confirmarContrasena">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmarContrasena"
            name="confirmarContrasena"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            className={
              errores.confirmarContrasena ? "modal-editar-usuario-input-error" : ""
            }
            placeholder="Repite la nueva contraseña"
          />
          <MensajeError nombreCampo="confirmarContrasena" />
        </div>

        {/* Género */}
        <div className="modal-editar-usuario-form-group">
          <label htmlFor="genero">Género</label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
          >
            <option value="">Seleccionar...</option>
            {generos.map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="modal-editar-usuario-form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="">Seleccionar...</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* Foto de Perfil */}
        <div className="modal-editar-usuario-form-group modal-editar-usuario-form-group-full">
          <label htmlFor="foto">
            <Camera size={20} />
            Foto de Perfil
          </label>
          <div className="modal-editar-usuario-foto-container">
            {vistaPrevia && (
              <div className="modal-editar-usuario-vista-previa">
                <img src={vistaPrevia} alt="Vista previa" />
              </div>
            )}
            <input
              type="file"
              id="foto"
              name="foto"
              onChange={handleFileChange}
              accept="image/*"
              className="modal-editar-usuario-input-file"
            />
            {formData.foto && typeof formData.foto === "object" && (
              <span className="modal-editar-usuario-file-name">
                {formData.foto.name}
              </span>
            )}
          </div>
          <span className="modal-editar-usuario-hint">
            Formatos: JPG, PNG (máx. 5MB)
          </span>
        </div>
      </div>
    </div>
  );

  const renderSeccionRoles = () => (
    <div className="modal-editar-usuario-form">
      <div className="modal-editar-usuario-roles-header">
        <Shield size={24} />
        <div>
          <h3>Asignar Roles</h3>
          <p>Selecciona los roles que tendrá este usuario</p>
        </div>
      </div>

      {roles.length === 0 ? (
        <div className="modal-editar-usuario-sin-roles">
          <Shield size={48} />
          <p>No hay roles disponibles</p>
        </div>
      ) : (
        <div className="modal-editar-usuario-roles-grid">
          {roles.map((rol) => {
            const seleccionado = formData.rolesSeleccionados.includes(rol.id);

            return (
              <div
                key={rol.id}
                className={`modal-editar-usuario-rol-card ${seleccionado ? "seleccionado" : ""
                  }`}
                onClick={() => toggleRol(rol.id)}
              >
                <div className="modal-editar-usuario-rol-checkbox">
                  {seleccionado ? (
                    <CheckSquare size={20} />
                  ) : (
                    <Square size={20} />
                  )}
                </div>
                <div className="modal-editar-usuario-rol-info">
                  <h4>{rol.nombre}</h4>
                  <p>{rol.descripcion || "Sin descripción"}</p>
                  <span className="modal-editar-usuario-rol-permisos">
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
    <div className="modal-editar-usuario-overlay" onClick={onCerrar}>
      <div
        className="modal-editar-usuario-contenido"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-editar-usuario-header">
          <h2>Editar Usuario</h2>
          <button
            className="modal-editar-usuario-btn-cerrar"
            onClick={onCerrar}
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-editar-usuario-tabs">
          <button
            type="button"
            onClick={() => setSeccionActiva("general")}
            className={`modal-editar-usuario-tab-button ${seccionActiva === "general" ? "active" : ""
              }`}
          >
            <User size={18} />
            Información General
          </button>
          <button
            type="button"
            onClick={() => setSeccionActiva("roles")}
            className={`modal-editar-usuario-tab-button ${seccionActiva === "roles" ? "active" : ""
              }`}
          >
            <Shield size={18} />
            Roles
          </button>
        </div>

        {/* Contenido */}
        {seccionActiva === "general" && renderSeccionGeneral()}
        {seccionActiva === "roles" && renderSeccionRoles()}

        {/* Footer */}
        <div className="modal-editar-usuario-footer">
          <div className="modal-editar-usuario-botones-izquierda">
            <button
              type="button"
              className="modal-editar-usuario-btn-cancelar"
              onClick={onCerrar}
            >
              Cancelar
            </button>
          </div>
          <div className="modal-editar-usuario-botones-derecha">
            <button
              type="button"
              className={`modal-editar-usuario-btn-guardar ${guardando ? "loading" : ""
                }`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? "Guardando..." : "Guardar Cambios"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarUsuario;