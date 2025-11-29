import { useState, useCallback, useEffect } from "react";
import { X, Save, User, Mail, Phone, Shield, Camera } from "lucide-react";
import "./ModalEditarUsuario.css";

const ModalEditarUsuario = ({ usuario, onGuardar, onCerrar, roles = [] }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    rol_id: "",
    telefono: "",
    email: "",
    foto: null,
    genero: "",
    estado: "activo",
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [vistaPrevia, setVistaPrevia] = useState(null);

  const generos = ["Masculino", "Femenino", "Otro", "Prefiero no decir"];

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        apellido_paterno: usuario.apellido_paterno || "",
        apellido_materno: usuario.apellido_materno || "",
        rol_id: usuario.rol_id || "",
        telefono: usuario.telefono || "",
        email: usuario.email || "",
        foto: usuario.foto || null,
        genero: usuario.genero || "",
        estado: usuario.estado || "activo",
      });

      // Si hay foto existente, mostrarla
      if (usuario.foto) {
        setVistaPrevia(usuario.foto);
      }
    }
  }, [usuario]);

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

    // Validaciones obligatorias
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    }

    if (!formData.apellido_paterno.trim()) {
      nuevosErrores.apellido_paterno = "El apellido paterno es requerido";
    }

    if (!formData.rol_id) {
      nuevosErrores.rol_id = "Debe seleccionar un rol";
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = "El correo electrónico es requerido";
    } else {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        nuevosErrores.email = "El formato del correo electrónico no es válido";
      }
    }

    if (formData.telefono && formData.telefono.trim()) {
      // Validar formato de teléfono (10 dígitos)
      const telefonoRegex = /^\d{10}$/;
      if (!telefonoRegex.test(formData.telefono.replace(/\s+/g, ""))) {
        nuevosErrores.telefono = "El teléfono debe tener 10 dígitos";
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

        {/* Formulario */}
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
                className={
                  errores.nombre ? "modal-editar-usuario-input-error" : ""
                }
                placeholder="Juan"
              />
              <MensajeError nombreCampo="nombre" />
            </div>

            {/* Apellido Paterno */}
            <div className="modal-editar-usuario-form-group">
              <label htmlFor="apellido_paterno">
                Apellido Paterno{" "}
                <span className="modal-editar-usuario-required">*</span>
              </label>
              <input
                type="text"
                id="apellido_paterno"
                name="apellido_paterno"
                value={formData.apellido_paterno}
                onChange={handleChange}
                className={
                  errores.apellido_paterno
                    ? "modal-editar-usuario-input-error"
                    : ""
                }
                placeholder="Pérez"
              />
              <MensajeError nombreCampo="apellido_paterno" />
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

            {/* Rol */}
            <div className="modal-editar-usuario-form-group">
              <label htmlFor="rol_id">
                Rol <span className="modal-editar-usuario-required">*</span>
              </label>
              <select
                id="rol_id"
                name="rol_id"
                value={formData.rol_id}
                onChange={handleChange}
                className={
                  errores.rol_id ? "modal-editar-usuario-input-error" : ""
                }
              >
                <option value="">Seleccionar rol...</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre_rol}
                  </option>
                ))}
              </select>
              <MensajeError nombreCampo="rol_id" />
            </div>

            {/* Correo Electrónico */}
            <div className="modal-editar-usuario-form-group">
              <label htmlFor="email">
                Correo Electrónico{" "}
                <span className="modal-editar-usuario-required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={
                  errores.email ? "modal-editar-usuario-input-error" : ""
                }
                placeholder="correo@ejemplo.com"
              />
              <MensajeError nombreCampo="email" />
            </div>

            {/* Teléfono */}
            <div className="modal-editar-usuario-form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={
                  errores.telefono ? "modal-editar-usuario-input-error" : ""
                }
                placeholder="5551234567"
                maxLength="10"
              />
              <MensajeError nombreCampo="telefono" />
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
              className={`modal-editar-usuario-btn-guardar ${
                guardando ? "loading" : ""
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
