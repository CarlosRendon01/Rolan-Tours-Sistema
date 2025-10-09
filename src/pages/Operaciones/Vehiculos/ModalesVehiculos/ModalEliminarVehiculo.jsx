import { X, AlertTriangle } from 'lucide-react';
import './ModalEliminarVehiculo.css';

const ModalEliminarVehiculo = ({ vehiculo, onConfirmar, onCerrar }) => {
  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-contenido modal-eliminar" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-eliminar">
          <AlertTriangle size={48} className="icono-alerta" />
          <button className="btn-cerrar-modal" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body-eliminar">
          <h2>¿Eliminar Vehículo?</h2>
          <p>
            ¿Estás seguro de que deseas eliminar el vehículo <strong>"{vehiculo.nombre}"</strong>?
          </p>
          <p className="advertencia">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="modal-footer-eliminar">
          <button className="btn-cancelar-eliminar" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn-confirmar-eliminar" onClick={onConfirmar}>
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarVehiculo;