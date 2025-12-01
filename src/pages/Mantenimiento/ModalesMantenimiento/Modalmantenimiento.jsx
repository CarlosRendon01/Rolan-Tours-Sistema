import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  Gauge,
  Calendar,
  Wrench,
  Plus,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Edit
} from 'lucide-react';
import './ModalMantenimiento.css';

const ModalMantenimiento = ({
  vehiculo,
  mantenimiento,
  onCerrar,
  onRegistrarMantenimiento,
  onActualizarKilometraje
}) => {
  const [seccionActiva, setSeccionActiva] = useState('info');
  const [editandoKm, setEditandoKm] = useState(false);
  const [nuevoKm, setNuevoKm] = useState(mantenimiento.kilometraje_actual);

  useEffect(() => {
    setNuevoKm(mantenimiento.kilometraje_actual);
  }, [mantenimiento.kilometraje_actual]);

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calcular porcentaje de uso del intervalo
  const calcularPorcentajeUso = () => {
    const kmActual = mantenimiento.kilometraje_actual;
    const kmUltimoMant = mantenimiento.ultimo_mantenimiento?.kilometraje || 0;
    const intervalo = mantenimiento.intervalo_km;
    const kmRecorridos = kmActual - kmUltimoMant;
    return Math.min(100, (kmRecorridos / intervalo) * 100);
  };

  // Manejar actualización de kilometraje
  const handleActualizarKm = () => {
    if (nuevoKm && nuevoKm >= mantenimiento.kilometraje_actual) {
      onActualizarKilometraje(vehiculo.id, parseInt(nuevoKm));
      setEditandoKm(false);
    }
  };

  // Obtener icono de estado
  const getEstadoIcono = () => {
    switch (mantenimiento.estado) {
      case 'verde':
        return <CheckCircle className="modal-mant-estado-icono verde" size={32} />;
      case 'amarillo':
        return <Clock className="modal-mant-estado-icono amarillo" size={32} />;
      case 'rojo':
        return <AlertCircle className="modal-mant-estado-icono rojo" size={32} />;
      default:
        return <CheckCircle className="modal-mant-estado-icono verde" size={32} />;
    }
  };

  const getEstadoTexto = () => {
    switch (mantenimiento.estado) {
      case 'verde':
        return 'En buen estado';
      case 'amarillo':
        return 'Mantenimiento próximo';
      case 'rojo':
        return 'Mantenimiento urgente';
      default:
        return 'Estado desconocido';
    }
  };

  const porcentajeUso = calcularPorcentajeUso();

  return (
    <div className="modal-mant-overlay" onClick={onCerrar}>
      <div className="modal-mant-contenido" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-mant-header">
          <div className="modal-mant-header-info">
            <div className="modal-mant-avatar">
              <Truck size={24} />
            </div>
            <div>
              <h2 className="modal-mant-titulo">{vehiculo.nombre}</h2>
              <p className="modal-mant-subtitulo">
                {vehiculo.marca} {vehiculo.modelo} • {vehiculo.año} • {vehiculo.numero_placa}
              </p>
            </div>
          </div>
          <button className="modal-mant-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        {/* Estado visual */}
        <div className={`modal-mant-estado-banner ${mantenimiento.estado}`}>
          <div className="modal-mant-estado-contenido">
            {getEstadoIcono()}
            <div className="modal-mant-estado-texto">
              <h3>{getEstadoTexto()}</h3>
              <p>
                {mantenimiento.ultimo_mantenimiento
                  ? `Último mantenimiento: ${formatearFecha(mantenimiento.ultimo_mantenimiento.fecha)}`
                  : 'Sin mantenimiento previo registrado'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="modal-mant-tabs">
          <button
            className={`modal-mant-tab ${seccionActiva === 'info' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('info')}
          >
            <Gauge size={18} />
            Información
          </button>
          <button
            className={`modal-mant-tab ${seccionActiva === 'historial' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('historial')}
          >
            <FileText size={18} />
            Historial
          </button>
        </div>

        {/* Contenido */}
        <div className="modal-mant-body">
          {seccionActiva === 'info' && (
            <div className="modal-mant-info">
              {/* Kilometraje actual */}
              <div className="modal-mant-card">
                <div className="modal-mant-card-header">
                  <h4>
                    <Gauge size={20} />
                    Kilometraje Actual
                  </h4>
                  <button
                    className="modal-mant-btn-editar"
                    onClick={() => setEditandoKm(!editandoKm)}
                  >
                    <Edit size={16} />
                  </button>
                </div>
                {editandoKm ? (
                  <div className="modal-mant-editar-km">
                    <input
                      type="number"
                      value={nuevoKm}
                      onChange={(e) => setNuevoKm(e.target.value)}
                      min={mantenimiento.kilometraje_actual}
                      className="modal-mant-input"
                    />
                    <button
                      onClick={handleActualizarKm}
                      className="modal-mant-btn-guardar-km"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => {
                        setEditandoKm(false);
                        setNuevoKm(mantenimiento.kilometraje_actual);
                      }}
                      className="modal-mant-btn-cancelar-km"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="modal-mant-valor-grande">
                    {mantenimiento.kilometraje_actual.toLocaleString('es-MX')} km
                  </div>
                )}
              </div>

              {/* Progreso del mantenimiento */}
              <div className="modal-mant-card">
                <h4>
                  <TrendingUp size={20} />
                  Progreso del Mantenimiento
                </h4>
                <div className="modal-mant-progreso-info">
                  <span>
                    {mantenimiento.ultimo_mantenimiento
                      ? `${(mantenimiento.kilometraje_actual - mantenimiento.ultimo_mantenimiento.kilometraje).toLocaleString('es-MX')} km`
                      : `${mantenimiento.kilometraje_actual.toLocaleString('es-MX')} km`
                    } recorridos
                  </span>
                  <span>{porcentajeUso.toFixed(0)}%</span>
                </div>
                <div className="modal-mant-barra-progreso">
                  <div
                    className={`modal-mant-progreso-fill ${mantenimiento.estado}`}
                    style={{ width: `${porcentajeUso}%` }}
                  ></div>
                </div>
                <p className="modal-mant-progreso-texto">
                  {mantenimiento.intervalo_km.toLocaleString('es-MX')} km entre mantenimientos
                </p>
              </div>

              {/* Próximo mantenimiento */}
              <div className="modal-mant-card">
                <h4>
                  <Calendar size={20} />
                  Próximo Mantenimiento
                </h4>
                {mantenimiento.proximo_mantenimiento ? (
                  <div className="modal-mant-proximo">
                    <p>Fecha estimada: {formatearFecha(mantenimiento.proximo_mantenimiento)}</p>
                  </div>
                ) : (
                  <div className="modal-mant-proximo">
                    <p>
                      En {Math.max(0, mantenimiento.intervalo_km - (mantenimiento.kilometraje_actual - (mantenimiento.ultimo_mantenimiento?.kilometraje || 0))).toLocaleString('es-MX')} km
                    </p>
                  </div>
                )}
              </div>

              {/* Último mantenimiento */}
              {mantenimiento.ultimo_mantenimiento && (
                <div className="modal-mant-card">
                  <h4>
                    <Wrench size={20} />
                    Último Mantenimiento
                  </h4>
                  <div className="modal-mant-ultimo-detalle">
                    <div className="modal-mant-detalle-item">
                      <span className="modal-mant-detalle-label">Tipo:</span>
                      <span className="modal-mant-detalle-valor">
                        {mantenimiento.ultimo_mantenimiento.tipo}
                      </span>
                    </div>
                    <div className="modal-mant-detalle-item">
                      <span className="modal-mant-detalle-label">Fecha:</span>
                      <span className="modal-mant-detalle-valor">
                        {formatearFecha(mantenimiento.ultimo_mantenimiento.fecha)}
                      </span>
                    </div>
                    <div className="modal-mant-detalle-item">
                      <span className="modal-mant-detalle-label">Kilometraje:</span>
                      <span className="modal-mant-detalle-valor">
                        {mantenimiento.ultimo_mantenimiento.kilometraje.toLocaleString('es-MX')} km
                      </span>
                    </div>
                    {mantenimiento.ultimo_mantenimiento.descripcion && (
                      <div className="modal-mant-detalle-item">
                        <span className="modal-mant-detalle-label">Descripción:</span>
                        <span className="modal-mant-detalle-valor">
                          {mantenimiento.ultimo_mantenimiento.descripcion}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comentarios */}
              {mantenimiento.comentarios && (
                <div className="modal-mant-card">
                  <h4>
                    <FileText size={20} />
                    Comentarios
                  </h4>
                  <p className="modal-mant-comentarios">{mantenimiento.comentarios}</p>
                </div>
              )}
            </div>
          )}

          {seccionActiva === 'historial' && (
            <div className="modal-mant-historial">
              {mantenimiento.historial.length === 0 ? (
                <div className="modal-mant-historial-vacio">
                  <Wrench size={48} strokeWidth={1.5} />
                  <p>No hay mantenimientos registrados</p>
                  <p className="modal-mant-historial-vacio-sub">
                    Comienza registrando el primer mantenimiento
                  </p>
                </div>
              ) : (
                <div className="modal-mant-historial-lista">
                  {[...mantenimiento.historial].reverse().map((item, index) => (
                    <div key={item.id} className="modal-mant-historial-item">
                      <div className="modal-mant-historial-icono">
                        <Wrench size={20} />
                      </div>
                      <div className="modal-mant-historial-contenido">
                        <h5>{item.tipo}</h5>
                        <p className="modal-mant-historial-fecha">
                          {formatearFecha(item.fecha)} • {item.kilometraje.toLocaleString('es-MX')} km
                        </p>
                        {item.descripcion && (
                          <p className="modal-mant-historial-desc">{item.descripcion}</p>
                        )}
                        {item.costo && (
                          <p className="modal-mant-historial-costo">
                            Costo: ${item.costo.toLocaleString('es-MX')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-mant-footer">
          <button className="modal-mant-btn-secundario" onClick={onCerrar}>
            Cerrar
          </button>
          <button
            className="modal-mant-btn-primario"
            onClick={() => onRegistrarMantenimiento(vehiculo.id)}
          >
            <Plus size={20} />
            Registrar Mantenimiento
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMantenimiento;