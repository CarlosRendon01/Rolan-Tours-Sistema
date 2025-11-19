import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Bell,
  X,
  MessageCircle,
  AlertTriangle,
  Activity,
  Check,
  Trash2,
  MoreVertical,
  Clock,
  User,
  Calendar
} from "lucide-react";
import "./ModalNotificaciones.css";

const ModalNotificaciones = ({
  isOpen,
  onClose,
  notificaciones = [],
  onMarcarComoLeida,
  onEliminarNotificacion,
  onMarcarTodasComoLeidas,
  onEliminarTodas,
  responsive
}) => {
  const [filtroActivo, setFiltroActivo] = useState('todas');
  const [menuAbierto, setMenuAbierto] = useState(null);
  const modalRef = useRef(null);
  const menuRef = useRef(null);

  // Tipos de notificaciones con sus configuraciones
  const tiposNotificacion = useMemo(() => ({
    mensaje: {
      icono: MessageCircle,
      color: '#3182ce',
      bgColor: 'rgba(49, 130, 206, 0.1)',
      borderColor: '#3182ce',
      nombre: 'Mensaje'
    },
    alerta: {
      icono: AlertTriangle,
      color: '#e53e3e',
      bgColor: 'rgba(229, 62, 62, 0.1)',
      borderColor: '#e53e3e',
      nombre: 'Alerta'
    },
    usuario: {
      icono: User,
      color: '#805ad5',
      bgColor: 'rgba(128, 90, 213, 0.1)',
      borderColor: '#805ad5',
      nombre: 'Usuario'
    },
    evento: {
      icono: Calendar,
      color: '#f56565',
      bgColor: 'rgba(245, 101, 101, 0.1)',
      borderColor: '#f56565',
      nombre: 'Evento'
    }
  }), []);


  // Filtros disponibles
  const filtros = useMemo(() => [
    { id: 'todas', nombre: 'Todas', icono: Bell },
    { id: 'mensaje', nombre: 'Mensajes', icono: MessageCircle },
    { id: 'alerta', nombre: 'Alertas', icono: AlertTriangle }
  ], []);


  // Filtrar notificaciones según el filtro activo
  const notificacionesFiltradas = useMemo(() => {
    const sinSistema = notificaciones.filter(n => n.tipo !== 'sistema');

    if (filtroActivo === 'todas') return sinSistema;

    return sinSistema.filter(n => n.tipo === filtroActivo);
  }, [notificaciones, filtroActivo]);


  // Contar notificaciones no leídas
  const noLeidas = useMemo(() => {
    return notificaciones.filter(notif => !notif.leida).length;
  }, [notificaciones]);

  // Formatear tiempo relativo
  const formatearTiempo = useCallback((fecha) => {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diferencia = ahora - fechaNotif;

    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias < 7) return `Hace ${dias}d`;

    return fechaNotif.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }, []);

  // Manejar clic en notificación
  const handleClickNotificacion = useCallback((notificacion) => {
    if (!notificacion.leida && onMarcarComoLeida) {
      onMarcarComoLeida(notificacion.id);
    }
    // Aquí podrías agregar lógica para navegar o mostrar detalles
  }, [onMarcarComoLeida]);

  // Manejar menú de opciones
  const toggleMenu = useCallback((notifId, e) => {
    e.stopPropagation();
    setMenuAbierto(menuAbierto === notifId ? null : notifId);
  }, [menuAbierto]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      // Enfocar modal para accesibilidad
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(null);
      }
    };

    if (menuAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuAbierto]);

  // No renderizar si no está abierto
  if (!isOpen) return null;

  return (
    <div
      className="modal-notificaciones-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-notificaciones-titulo"
    >
      <div
        ref={modalRef}
        className="modal-notificaciones-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="modal-notificaciones-header">
          <div className="header-info">
            <Bell size={20} className="header-icon" />
            <div>
              <h2 id="modal-notificaciones-titulo">Notificaciones</h2>
              {noLeidas > 0 && (
                <span className="contador-no-leidas">
                  {noLeidas} sin leer
                </span>
              )}
            </div>
          </div>

          <div className="header-acciones">
            {noLeidas > 0 && (
              <button
                onClick={onMarcarTodasComoLeidas}
                className="btn-marcar-todas"
                title="Marcar todas como leídas"
              >
                <Check size={16} />
                {!responsive?.esMovil && <span>Marcar todas</span>}
              </button>
            )}

            <button
              onClick={onClose}
              className="btn-cerrar-modal"
              aria-label="Cerrar modal de notificaciones"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="modal-notificaciones-filtros">
          {filtros.map(filtro => {
            const IconoFiltro = filtro.icono;
            const count = filtro.id === 'todas'
              ? notificaciones.length
              : notificaciones.filter(n => n.tipo === filtro.id).length;

            return (
              <button
                key={filtro.id}
                onClick={() => setFiltroActivo(filtro.id)}
                className={`filtro-btn ${filtroActivo === filtro.id ? 'activo' : ''}`}
                aria-pressed={filtroActivo === filtro.id}
              >
                <IconoFiltro size={16} />
                <span>{filtro.nombre}</span>
                {count > 0 && <span className="filtro-contador">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Lista de notificaciones */}
        <div className="modal-notificaciones-lista">
          {notificacionesFiltradas.length === 0 ? (
            <div className="lista-vacia">
              <Bell size={48} className="icono-vacio" />
              <h3>No hay notificaciones</h3>
              <p>
                {filtroActivo === 'todas'
                  ? 'No tienes notificaciones en este momento'
                  : `No hay notificaciones de tipo "${filtros.find(f => f.id === filtroActivo)?.nombre}"`
                }
              </p>
            </div>
          ) : (
            notificacionesFiltradas.map(notificacion => {
              const config = tiposNotificacion[notificacion.tipo] || tiposNotificacion.alerta;
              const IconoTipo = config.icono;

              return (
                <div
                  key={notificacion.id}
                  className={`notificacion-item ${!notificacion.leida ? 'no-leida' : ''}`}
                  onClick={() => handleClickNotificacion(notificacion)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClickNotificacion(notificacion);
                    }
                  }}
                >
                  <div className="notificacion-contenido">
                    <div
                      className="notificacion-icono"
                      style={{
                        backgroundColor: config.bgColor,
                        borderColor: config.borderColor
                      }}
                    >
                      <IconoTipo
                        size={18}
                        style={{ color: config.color }}
                      />
                    </div>

                    <div className="notificacion-info">
                      <div className="notificacion-header-info">
                        <h4 className="notificacion-titulo">
                          {notificacion.titulo}
                        </h4>
                        <div className="notificacion-meta">
                          <span className="notificacion-tipo">
                            {config.nombre}
                          </span>
                          <Clock size={12} />
                          <span className="notificacion-tiempo">
                            {formatearTiempo(notificacion.fecha)}
                          </span>
                        </div>
                      </div>

                      <p className="notificacion-mensaje">
                        {notificacion.mensaje}
                      </p>

                      {notificacion.datos && (
                        <div className="notificacion-datos">
                          {Object.entries(notificacion.datos).map(([key, value]) => (
                            <span key={key} className="dato-adicional">
                              <strong>{key}:</strong> {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="notificacion-acciones" ref={menuAbierto === notificacion.id ? menuRef : null}>
                      <button
                        onClick={(e) => toggleMenu(notificacion.id, e)}
                        className="btn-menu-notificacion"
                        aria-label="Opciones de notificación"
                        aria-expanded={menuAbierto === notificacion.id}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {menuAbierto === notificacion.id && (
                        <div className="menu-notificacion">
                          {!notificacion.leida && onMarcarComoLeida && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarcarComoLeida(notificacion.id);
                                setMenuAbierto(null);
                              }}
                              className="menu-item"
                            >
                              <Check size={14} />
                              Marcar como leída
                            </button>
                          )}

                          {onEliminarNotificacion && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEliminarNotificacion(notificacion.id);
                                setMenuAbierto(null);
                              }}
                              className="menu-item eliminar"
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!notificacion.leida && (
                    <div className="indicador-no-leida" aria-hidden="true" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer con acciones */}
        {notificaciones.length > 0 && (
          <div className="modal-notificaciones-footer">
            <button
              onClick={onEliminarTodas}
              className="btn-eliminar-todas"
              disabled={notificaciones.length === 0}
            >
              <Trash2 size={16} />
              Eliminar todas
            </button>

            <span className="total-notificaciones">
              Total: {notificaciones.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalNotificaciones;