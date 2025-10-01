import React, { useRef, useEffect, useCallback, useState } from "react";
import { User, Mail, Shield, X, Edit2 } from "lucide-react";
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
  
  // ✅ GUARDAR EL ESTADO ORIGINAL DEL OVERFLOW
  const originalOverflow = useRef(null);

  // Información del usuario con fallbacks
  const usuario = {
    nombre: userInfo?.nombre || "Fabiola Hernández",
    rol: userInfo?.rol || "Administrador", 
    email: userInfo?.email || "fabiola.hernandez@rolantours.com",
    iniciales: userInfo?.iniciales || "FH"
  };

  // Generar iniciales automáticamente si no están disponibles
  const generarIniciales = useCallback((nombre) => {
    if (userInfo?.iniciales) return userInfo.iniciales;
    
    const palabras = nombre.split(' ').filter(palabra => palabra.length > 0);
    if (palabras.length >= 2) {
      return `${palabras[0][0]}${palabras[1][0]}`.toUpperCase();
    }
    return palabras[0] ? palabras[0].substring(0, 2).toUpperCase() : 'US';
  }, [userInfo?.iniciales]);

  const iniciales = generarIniciales(usuario.nombre);

  // ✅ FUNCIÓN MEJORADA PARA RESTAURAR ESTILOS
  const restaurarBodyStyles = useCallback(() => {
    // Restaurar el overflow original o auto si no había valor
    if (originalOverflow.current !== null) {
      document.body.style.overflow = originalOverflow.current;
    } else {
      document.body.style.overflow = '';
    }
    
    // También limpiar otras propiedades que puedan estar afectando
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';
    
    // Forzar repaint del navegador
    document.body.offsetHeight;
  }, []);

  // Manejar cierre del modal
  const manejarCierre = useCallback(() => {
    if (cargandoPerfil) return;
    
    setIsClosing(true);
    
    // ✅ RESTAURAR ESTILOS INMEDIATAMENTE
    restaurarBodyStyles();
    
    // Pequeño delay para que la animación se vea bien
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 100);
  }, [onClose, cargandoPerfil, restaurarBodyStyles]);

  // Manejar edición de perfil
  const manejarEditarPerfil = useCallback(async () => {
    if (cargandoPerfil) return;
    
    try {
      if (setCargandoPerfil) setCargandoPerfil(true);
      
      if (onEditProfile) {
        await onEditProfile();
      } else {
        // Simulación de acción de editar perfil
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Redirigiendo a editar perfil...");
      }
    } catch (error) {
      console.error("Error al editar perfil:", error);
    } finally {
      if (setCargandoPerfil) setCargandoPerfil(false);
      manejarCierre();
    }
  }, [onEditProfile, manejarCierre, setCargandoPerfil, cargandoPerfil]);

  // ✅ EFECTO MEJORADO PARA MANEJAR BODY OVERFLOW
  useEffect(() => {
    if (isOpen) {
      // Guardar el estado original del overflow
      originalOverflow.current = document.body.style.overflow || '';
      
      // Aplicar el overflow hidden
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Cleanup cuando el componente se desmonta o cambia isOpen
        restaurarBodyStyles();
      };
    }
  }, [isOpen, restaurarBodyStyles]);

  // Manejar teclas y foco
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

  // ✅ CLEANUP FINAL AL DESMONTAR EL COMPONENTE
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
        {/* Botón de cerrar */}
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

        {/* Encabezado del modal */}
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

        {/* Cuerpo del modal */}
        <div className="modal-perfil-body">
          <p id="modal-descripcion-perfil" className="modal-perfil-sr-only">
            Información detallada del perfil de usuario
          </p>
          
          <div className="modal-perfil-section">
            <h3 className="modal-perfil-section-title">Información Personal</h3>
            <div className="modal-perfil-info-grid">
              <div className="modal-perfil-info-item">
                <div className="modal-perfil-icon-wrapper user">
                  <User size={16} />
                </div>
                <div className="modal-perfil-info-content">
                  <p className="modal-perfil-label">Nombre Completo</p>
                  <p className="modal-perfil-value">{usuario.nombre}</p>
                </div>
              </div>

              <div className="modal-perfil-info-item">
                <div className="modal-perfil-icon-wrapper role">
                  <Shield size={16} />
                </div>
                <div className="modal-perfil-info-content">
                  <p className="modal-perfil-label">Rol</p>
                  <p className="modal-perfil-value">{usuario.rol}</p>
                </div>
              </div>

              <div className="modal-perfil-info-item">
                <div className="modal-perfil-icon-wrapper email">
                  <Mail size={16} />
                </div>
                <div className="modal-perfil-info-content">
                  <p className="modal-perfil-label">Correo Electrónico</p>
                  <p className="modal-perfil-value">{usuario.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones del modal */}
        <div className="modal-perfil-actions">
          <button
            onClick={manejarCierre}
            className="modal-perfil-btn modal-perfil-btn-secondary"
            disabled={cargandoPerfil}
            type="button"
          >
            Cancelar
          </button>
          
          <button
            onClick={manejarEditarPerfil}
            className="modal-perfil-btn modal-perfil-btn-primary"
            disabled={cargandoPerfil}
            type="button"
          >
            {cargandoPerfil ? (
              <>
                <span className="modal-perfil-spinner"></span>
                Procesando...
              </>
            ) : (
              <>
                <Edit2 size={16} />
                Editar Perfil
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ModalPerfil.displayName = 'ModalPerfil';

export default ModalPerfil;