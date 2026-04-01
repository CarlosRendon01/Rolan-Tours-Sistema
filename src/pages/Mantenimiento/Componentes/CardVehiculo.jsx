import React, {useState} from 'react';
import { Truck, Calendar, Gauge, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import './CardVehiculo.css';

const CardVehiculo = ({ vehiculo, mantenimiento, onClick }) => {
  const diasDesdeMantenimiento = () => {
    if (!mantenimiento.ultimo_mantenimiento) return null;
    const [year, month, day] = mantenimiento.ultimo_mantenimiento.fecha.split('-');
    const fechaUltimo = new Date(year, month - 1, day); // local time, no UTC
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diferencia = Math.floor((hoy - fechaUltimo) / (1000 * 60 * 60 * 24));
    return diferencia;
  };

  const kmHastaProximo = () => {
    const kmActual = mantenimiento.kilometraje_actual || 0;
    const kmUltimoMant = mantenimiento.ultimo_mantenimiento?.kilometraje || 0;
    const intervalo = mantenimiento.intervalo_km || 5000;
    const kmRestantes = intervalo - (kmActual - kmUltimoMant);
    return Math.max(0, kmRestantes);
  };

  const [rolUsuario] = useState(localStorage.getItem("rol") || "");
  const [permisos] = useState(localStorage.getItem("permisos") || "");

  const getEstadoIcono = () => {
    switch (mantenimiento.estado) {
      case 'verde':
        return <CheckCircle className="card-estado-icono verde" size={24} />;
      case 'amarillo':
        return <Clock className="card-estado-icono amarillo" size={24} />;
      case 'rojo':
        return <AlertTriangle className="card-estado-icono rojo" size={24} />;
      default:
        return <CheckCircle className="card-estado-icono verde" size={24} />;
    }
  };

  const getEstadoMensaje = () => {
    const dias = diasDesdeMantenimiento();
    const km = kmHastaProximo();

    switch (mantenimiento.estado) {
      case 'verde':
        if (dias === null) {
          return 'Sin mantenimiento previo';
        }
        return `Próximo en ${km.toLocaleString('es-MX')} km`;
      case 'amarillo':
        return `Mantenimiento próximo en ${km.toLocaleString('es-MX')} km`;
      case 'rojo':
        return 'Mantenimiento urgente requerido';
      default:
        return 'Estado desconocido';
    }
  };

  return (
    <div
      className={`card-vehiculo ${mantenimiento.estado}`}
      onClick={onClick}
    >
      <div className={`card-borde ${mantenimiento.estado}`}></div>

      <div className="card-header">
        <div className="card-foto">
          {vehiculo.documentos?.foto_vehiculo ? (
            <img
              src={vehiculo.documentos.foto_vehiculo}
              alt={vehiculo.nombre}
              className="card-imagen-vehiculo"
            />
          ) : (
            <div className="card-foto-placeholder">
              <Truck size={40} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="card-estado-badge">
          {getEstadoIcono()}
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-nombre">{vehiculo.nombre}</h3>
        <p className="card-detalles">
          {vehiculo.marca} {vehiculo.modelo} • {vehiculo.año}
        </p>
        <p className="card-placa">Placa: {vehiculo.numero_placa}</p>

        <div className="card-metricas">
          <div className="card-metrica">
            <Gauge size={16} />
            <span>{mantenimiento.kilometraje_actual.toLocaleString('es-MX')} km</span>
          </div>
          {mantenimiento.ultimo_mantenimiento && (
            <div className="card-metrica">
              <Calendar size={16} />
              <span>Hace {diasDesdeMantenimiento()} días</span>
            </div>
          )}
        </div>

        <div className={`card-estado-mensaje ${mantenimiento.estado}`}>
          <p>{getEstadoMensaje()}</p>
        </div>

        {mantenimiento.ultimo_mantenimiento && (
          <div className="card-ultimo-mantenimiento">
            <p className="card-ultimo-label">Último mantenimiento:</p>
            <p className="card-ultimo-tipo">{mantenimiento.ultimo_mantenimiento.tipo}</p>
          </div>
        )}
      </div>

      <div className="card-footer">
        {permisos.includes("mantenimiento.editar") || rolUsuario === "admin" && (
          <button className="card-btn-ver">Ver detalles</button>
        )}
      </div>
    </div>
  );
};
export default CardVehiculo;