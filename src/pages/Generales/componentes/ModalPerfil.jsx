import React, { useRef, useEffect, useCallback, useState } from "react";
import { User, Mail, Shield, X, Edit2, Save } from "lucide-react";
import "./ModalPerfil.css";

const ModalPerfil = React.memo(({
  isOpen,
  onClose,
  onEditProfile,
  userInfo,
  cargandoPerfil = false,
  setCargandoPerfil
}) => {
  const refModal = useRef(null);
  const refCloseButton = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosEditados, setDatosEditados] = useState({});
  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');

  const originalOverflow = useRef(null);

  // ✅ FUNCIÓN HELPER PARA OBTENER EL PRIMER ROL
  const obtenerPrimerRol = (roles) => {
    if (!roles) return "Usuario";

    // Si es un array de strings
    if (Array.isArray(roles) && typeof roles[0] === 'string') {
      return roles[0];
    }

    // Si es un array de objetos
    if (Array.isArray(roles) && roles[0]?.nombre) {
      return roles[0].nombre;
    }

    // Si es un string directo
    if (typeof roles === 'string') {
      return roles;
    }

    return "Usuario";
  };

  // Información del usuario con fallbacks
  const usuario = {
    id: userInfo?.id || null,
    nombre: userInfo?.nombre || "Usuario",
    apellido_paterno: userInfo?.apellido_paterno || "",
    apellido_materno: userInfo?.apellido_materno || "",
    rol: obtenerPrimerRol(userInfo?.roles),
    email: userInfo?.correo || "usuario@rolantours.com",
    iniciales: userInfo?.nombre ? userInfo.nombre.substring(0, 2).toUpperCase() : "US",
    genero: userInfo?.genero || "Prefiero no decir"
  };

  // Generar iniciales automáticamente
  const generarIniciales = useCallback((nombre) => {
    if (userInfo?.iniciales) return userInfo.iniciales;

    const palabras = nombre.split(' ').filter(palabra => palabra.length > 0);
    if (palabras.length >= 2) {
      return `${palabras[0][0]}${palabras[1][0]}`.toUpperCase();
    }
    return palabras[0] ? palabras[0].substring(0, 2).toUpperCase() : 'US';
  }, [userInfo?.iniciales]);

  const iniciales = generarIniciales(usuario.nombre);

  // Inicializar datos editados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setDatosEditados({
        nombre: usuario.nombre,
        apellido_paterno: usuario.apellido_paterno,
        apellido_materno: usuario.apellido_materno,
        correo: usuario.email,
        genero: usuario.genero
      });
      setModoEdicion(false);
      setErrores({});
      setMensajeExito('');
    }
  }, [isOpen, usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno, usuario.email, usuario.genero]);

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosEditados.nombre?.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!datosEditados.correo?.trim()) {
      nuevosErrores.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(datosEditados.correo)) {
      nuevosErrores.correo = 'El correo no es válido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar cambios en los inputs
  const manejarCambio = (campo, valor) => {
    setDatosEditados(prev => ({
      ...prev,
      [campo]: valor
    }));

    if (errores[campo]) {
      setErrores(prev => ({
        ...prev,
        [campo]: undefined
      }));
    }

    if (mensajeExito) {
      setMensajeExito('');
    }
  };

  // Guardar cambios
  const manejarGuardarCambios = async () => {
    if (!validarFormulario()) return;

    if (setCargandoPerfil) setCargandoPerfil(true);

    try {
      const resultado = await onEditProfile(datosEditados);

      if (resultado?.success) {
        setModoEdicion(false);
        setMensajeExito('✓ Perfil actualizado correctamente');

        setTimeout(() => {
          setMensajeExito('');
        }, 3000);
      } else {
        setErrores({ general: resultado?.error || 'Error al actualizar perfil' });
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setErrores({ general: 'Error al actualizar perfil' });
    } finally {
      if (setCargandoPerfil) setCargandoPerfil(false);
    }
  };

  const restaurarBodyStyles = useCallback(() => {
    if (originalOverflow.current !== null) {
      document.body.style.overflow = originalOverflow.current;
    } else {
      document.body.style.overflow = '';
    }
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';
    document.body.offsetHeight;
  }, []);

  const manejarCierre = useCallback(() => {
    if (cargandoPerfil) return;

    setIsClosing(true);
    restaurarBodyStyles();

    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setModoEdicion(false);
      setErrores({});
      setMensajeExito('');
    }, 100);
  }, [onClose, cargandoPerfil, restaurarBodyStyles]);

  useEffect(() => {
    if (isOpen) {
      originalOverflow.current = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';

      return () => {
        restaurarBodyStyles();
      };
    }
  }, [isOpen, restaurarBodyStyles]);

  useEffect(() => {
    const manejarTeclaEscape = (evento) => {
      if (evento.key === 'Escape' && isOpen && !cargandoPerfil) {
        manejarCierre();
      }
    };

    const manejarTeclaTab = (evento) => {
      if (!isOpen) return;

      const elementosFocusables = refModal.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );

      if (!elementosFocusables?.length) return;

      const primerElemento = elementosFocusables[0];
      const ultimoElemento = elementosFocusables[elementosFocusables.length - 1];

      if (evento.key === 'Tab') {
        if (evento.shiftKey) {
          if (document.activeElement === primerElemento) {
            evento.preventDefault();
            ultimoElemento.focus();
          }
        } else {
          if (document.activeElement === ultimoElemento) {
            evento.preventDefault();
            primerElemento.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', manejarTeclaEscape);
      document.addEventListener('keydown', manejarTeclaTab);

      const timeoutFocus = setTimeout(() => {
        if (refCloseButton.current) {
          refCloseButton.current.focus();
        }
      }, 100);

      return () => {
        clearTimeout(timeoutFocus);
        document.removeEventListener('keydown', manejarTeclaEscape);
        document.removeEventListener('keydown', manejarTeclaTab);
      };
    }
  }, [isOpen, manejarCierre, cargandoPerfil]);

  useEffect(() => {
    return () => {
      restaurarBodyStyles();
    };
  }, [restaurarBodyStyles]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-perfil-overlay"
      onClick={manejarCierre}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo-perfil"
      aria-describedby="modal-descripcion-perfil"
    >
      <div
        ref={refModal}
        className="modal-perfil-content"
        onClick={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        <button
          ref={refCloseButton}
          onClick={manejarCierre}
          className="modal-perfil-close-btn"
          aria-label="Cerrar modal"
          disabled={cargandoPerfil}
          type="button"
        >
          <X size={18} />
        </button>

        <div className="modal-perfil-header">
          <div className="modal-perfil-user-info">
            <div className="modal-perfil-avatar">
              {iniciales}
            </div>
            <div className="modal-perfil-user-details">
              <h2 id="modal-titulo-perfil">{usuario.nombre}</h2>
              <span className="modal-perfil-user-role">{usuario.rol}</span>
            </div>
          </div>
        </div>

        {mensajeExito && (
          <div className="modal-perfil-mensaje-exito">
            {mensajeExito}
          </div>
        )}

        {errores.general && (
          <div className="modal-perfil-mensaje-error">
            {errores.general}
          </div>
        )}

        <div className="modal-perfil-body">
          <p id="modal-descripcion-perfil" className="modal-perfil-sr-only">
            Información detallada del perfil de usuario
          </p>

          <div className="modal-perfil-section">
            <h3 className="modal-perfil-section-title">Información Personal</h3>

            <div className="modal-perfil-info-grid">
              {/* Nombre */}
              <div className="modal-perfil-info-item">
                <div className="modal-perfil-icon-wrapper user">
                  <User size={16} />
                </div>
                <div className="modal-perfil-info-content">
                  <p className="modal-perfil-label">Nombre</p>
                  {modoEdicion ? (
                    <div>
                      <input
                        type="text"
                        value={datosEditados.nombre}
                        onChange={(e) => manejarCambio('nombre', e.target.value)}
                        className={`modal-perfil-input ${errores.nombre ? 'error' : ''}`}
                        placeholder="Nombre"
                        disabled={cargandoPerfil}
                      />
                      {errores.nombre && (
                        <span className="modal-perfil-error">{errores.nombre}</span>
                      )}
                    </div>
                  ) : (
                    <p className="modal-perfil-value">{usuario.nombre}</p>
                  )}
                </div>
              </div>

              {/* Apellido Paterno */}
              <div className="modal-perfil-info-item">
                <div className="modal-perfil-icon-wrapper user">
                  <User size={16} />
                </div>
                <div className="modal-perfil-info-content">
                  <p className="modal-perfil-label">Apellido Paterno</p>
                  {modoEdicion ? (
                    <input
                      type="text"
                      value={datosEditados.apellido_paterno}
                      onChange={(e) => manejarCambio('apellido_paterno', e.target.value)}
                      className="modal-perfil-input"
                      placeholder="Apellido Paterno (opcional)"
                      disabled={cargandoPerfil}
                    />
                  ) : (
                    <p className="modal-perfil-value">{usuario.apellido_paterno || 'N/A'}</p>
                  )}
                </div>
              </div>

              {/* Apellido Materno */}
              <div className="modal-perfil-info-item">
                <div className="modal-perfil-icon-wrapper user">
                  <User size={16} />
                </div>
                <div className="modal-perfil-info-content">
                  <p className="modal-perfil-label">Apellido Materno</p>
                  {modoEdicion ? (
                    <input
                      type="text"
                      value={datosEditados.apellido_materno}
                      onChange={(e) => manejarCambio('apellido_materno', e.target.value)}
                      className="modal-perfil-input"
                      placeholder="Apellido Materno (opcional)"
                      disabled={cargandoPerfil}
                    />
                  ) : (
                    <p className="modal-perfil-value">{usuario.apellido_materno || 'N/A'}</p>
                  )}
                </div>
              </div>

              {/* Correo */}
              <div className="modal-perfil-info-item">
                <div className="modal-perfil-icon-wrapper email">
                  <Mail size={16} />
                </div>
                <div className="modal-perfil-info-content">
                  <p className="modal-perfil-label">Correo Electrónico</p>
                  {modoEdicion ? (
                    <div>
                      <input
                        type="email"
                        value={datosEditados.correo}
                        onChange={(e) => manejarCambio('correo', e.target.value)}
                        className={`modal-perfil-input ${errores.correo ? 'error' : ''}`}
                        placeholder="correo@ejemplo.com"
                        disabled={cargandoPerfil}
                      />
                      {errores.correo && (
                        <span className="modal-perfil-error">{errores.correo}</span>
                      )}
                    </div>
                  ) : (
                    <p className="modal-perfil-value">{usuario.email}</p>
                  )}
                </div>
              </div>

              {/* Rol - No editable */}
              <div className="modal-perfil-info-item">
                <div className="modal-perfil-icon-wrapper role">
                  <Shield size={16} />
                </div>
                <div className="modal-perfil-info-content">
                  <p className="modal-perfil-label">Rol</p>
                  <p className="modal-perfil-value">{usuario.rol}</p>
                </div>
              </div>

              {/* Género */}
              <div className="modal-perfil-info-item">
                <div className="modal-perfil-icon-wrapper user">
                  <User size={16} />
                </div>
                <div className="modal-perfil-info-content">
                  <p className="modal-perfil-label">Género</p>
                  {modoEdicion ? (
                    <select
                      value={datosEditados.genero}
                      onChange={(e) => manejarCambio('genero', e.target.value)}
                      className="modal-perfil-input"
                      disabled={cargandoPerfil}
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                  ) : (
                    <p className="modal-perfil-value">{usuario.genero}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-perfil-actions">
          {modoEdicion ? (
            <>
              <button
                onClick={() => {
                  setModoEdicion(false);
                  setErrores({});
                  setMensajeExito('');
                  setDatosEditados({
                    nombre: usuario.nombre,
                    apellido_paterno: usuario.apellido_paterno,
                    apellido_materno: usuario.apellido_materno,
                    correo: usuario.email,
                    genero: usuario.genero
                  });
                }}
                className="modal-perfil-btn modal-perfil-btn-secondary"
                disabled={cargandoPerfil}
                type="button"
              >
                Cancelar
              </button>

              <button
                onClick={manejarGuardarCambios}
                className="modal-perfil-btn modal-perfil-btn-primary"
                disabled={cargandoPerfil}
                type="button"
              >
                {cargandoPerfil ? (
                  <>
                    <span className="modal-perfil-spinner"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={manejarCierre}
                className="modal-perfil-btn modal-perfil-btn-secondary"
                type="button"
              >
                Cerrar
              </button>

              <button
                onClick={() => setModoEdicion(true)}
                className="modal-perfil-btn modal-perfil-btn-primary"
                type="button"
              >
                <Edit2 size={16} />
                Editar Perfil
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ModalPerfil.displayName = 'ModalPerfil';

export default ModalPerfil;