import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "./ModalVerUsuarios.css";

const ModalVerUsuario = ({ usuario, onCerrar, roles = [] }) => {
  if (!usuario) return null;

  const obtenerNombreCompleto = () => {
    const nombre = usuario.nombre || "";
    const paterno = usuario.apellido_paterno || "";
    const materno = usuario.apellido_materno || "";
    return `${nombre} ${paterno} ${materno}`.trim() || "Sin nombre";
  };

  const obtenerNombreRol = () => {
    if (!usuario.rol_id) return "Sin rol asignado";
    const rol = roles.find((r) => r.id_rol === usuario.rol_id);
    return rol ? rol.nombre_rol : "Rol no encontrado";
  };

  const obtenerIniciales = () => {
    const nombre = usuario.nombre || "";
    const paterno = usuario.apellido_paterno || "";

    if (!nombre) return "?";

    const inicial1 = nombre.charAt(0).toUpperCase();
    const inicial2 = paterno
      ? paterno.charAt(0).toUpperCase()
      : nombre.charAt(1).toUpperCase();

    return `${inicial1}${inicial2}`;
  };

  const obtenerIconoGenero = () => {
    switch (usuario.genero?.toLowerCase()) {
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

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible";
    try {
      return new Date(fecha).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  return (
    <div className="modal-ver-usuario-overlay" onClick={onCerrar}>
      <div
        className="modal-ver-usuario-contenido"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-ver-usuario-header">
          <h2>Información del Usuario</h2>
          <button
            className="modal-ver-usuario-btn-cerrar"
            onClick={onCerrar}
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-ver-usuario-body">
          {/* Foto de perfil */}
          <div className="modal-ver-usuario-foto-section">
            <div className="modal-ver-usuario-foto-container">
              {usuario.foto ? (
                <img src={usuario.foto} alt={obtenerNombreCompleto()} />
              ) : (
                <div className="modal-ver-usuario-sin-foto">
                  {obtenerIniciales()}
                </div>
              )}
            </div>
          </div>

          {/* Grid de información */}
          <div className="modal-ver-usuario-info-grid">
            {/* Nombre completo */}
            <div className="modal-ver-usuario-info-item modal-ver-usuario-info-item-full">
              <span className="modal-ver-usuario-label">
                <User size={16} />
                Nombre Completo
              </span>
              <span className="modal-ver-usuario-value">
                {obtenerNombreCompleto()}
              </span>
            </div>

            {/* Correo electrónico */}
            <div className="modal-ver-usuario-info-item">
              <span className="modal-ver-usuario-label">
                <Mail size={16} />
                Correo Electrónico
              </span>
              <span className="modal-ver-usuario-value">
                {usuario.email || (
                  <span className="modal-ver-usuario-value-empty">
                    No especificado
                  </span>
                )}
              </span>
            </div>

            {/* Teléfono */}
            <div className="modal-ver-usuario-info-item">
              <span className="modal-ver-usuario-label">
                <Phone size={16} />
                Teléfono
              </span>
              <span className="modal-ver-usuario-value">
                {usuario.telefono || (
                  <span className="modal-ver-usuario-value-empty">
                    No especificado
                  </span>
                )}
              </span>
            </div>

            {/* Género */}
            <div className="modal-ver-usuario-info-item">
              <span className="modal-ver-usuario-label">
                <User size={16} />
                Género
              </span>
              {usuario.genero ? (
                <div className="modal-ver-usuario-genero-badge">
                  <span className="modal-ver-usuario-genero-icono">
                    {obtenerIconoGenero()}
                  </span>
                  <span>{usuario.genero}</span>
                </div>
              ) : (
                <span className="modal-ver-usuario-value modal-ver-usuario-value-empty">
                  No especificado
                </span>
              )}
            </div>

            {/* Rol */}
            <div className="modal-ver-usuario-info-item modal-ver-usuario-info-item-full">
              <span className="modal-ver-usuario-label">
                <Shield size={16} />
                Rol Asignado
              </span>
              <span className="modal-ver-usuario-value">
                {obtenerNombreRol()}
              </span>
            </div>

            {/* Estado */}
            <div className="modal-ver-usuario-info-item">
              <span className="modal-ver-usuario-label">
                {usuario.estado === "activo" ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                Estado
              </span>
              <div
                className={`modal-ver-usuario-estado-badge ${
                  usuario.estado === "activo"
                    ? "modal-ver-usuario-estado-activo"
                    : "modal-ver-usuario-estado-inactivo"
                }`}
              >
                {usuario.estado === "activo" ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                <span>
                  {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            {/* ID de Usuario */}
            <div className="modal-ver-usuario-info-item">
              <span className="modal-ver-usuario-label">
                <User size={16} />
                ID de Usuario
              </span>
              <span className="modal-ver-usuario-value">
                #{usuario.id_usuario?.toString().padStart(3, "0")}
              </span>
            </div>

            {/* Fecha de registro */}
            {usuario.fecha_registro && (
              <div className="modal-ver-usuario-info-item modal-ver-usuario-info-item-full">
                <span className="modal-ver-usuario-label">
                  <Calendar size={16} />
                  Fecha de Registro
                </span>
                <span className="modal-ver-usuario-value">
                  {formatearFecha(usuario.fecha_registro)}
                </span>
              </div>
            )}

            {/* Fecha de modificación */}
            {usuario.fecha_modificacion && (
              <div className="modal-ver-usuario-info-item modal-ver-usuario-info-item-full">
                <span className="modal-ver-usuario-label">
                  <Calendar size={16} />
                  Última Modificación
                </span>
                <span className="modal-ver-usuario-value">
                  {formatearFecha(usuario.fecha_modificacion)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-ver-usuario-footer">
          <button
            type="button"
            className="modal-ver-usuario-btn-cerrar-footer"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerUsuario;
