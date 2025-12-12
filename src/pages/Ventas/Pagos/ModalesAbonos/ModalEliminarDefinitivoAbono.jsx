import React, { useState } from 'react';
import axios from "axios";
import { X, Trash2, AlertTriangle } from 'lucide-react';
import './ModalEliminarDefinitivoAbono.css';

const ModalEliminarDefinitivoAbono = ({ estaAbierto, alCerrar, abono, alEliminar }) => {
  const [procesando, setProcesando] = useState(false);

  if (!estaAbierto || !abono) return null;

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  const manejarEliminar = async () => {
    setProcesando(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/abonos/${abono.id}/force`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      if (alEliminar) {
        await alEliminar();
      }

      alCerrar();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el abono. Intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="modal-eliminar-overlay" onClick={alCerrar}>
      <div className="modal-eliminar-contenedor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-eliminar-header">
          <div className="modal-eliminar-icono-header">
            <Trash2 size={24} />
          </div>
          <div className="modal-eliminar-titulo-seccion">
            <h2 className="modal-eliminar-titulo">Eliminar Definitivamente</h2>
            <p className="modal-eliminar-subtitulo">Acción permanente e irreversible</p>
          </div>
          <button className="modal-eliminar-boton-cerrar" onClick={alCerrar} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-eliminar-contenido">
          <div className="modal-eliminar-alerta">
            <AlertTriangle size={20} />
            <div>
              <p className="modal-eliminar-alerta-titulo">⚠️ Advertencia crítica</p>
              <p className="modal-eliminar-alerta-texto">
                Esta acción eliminará el abono permanentemente de la base de datos.
                No podrá ser recuperado después de esta operación.
              </p>
            </div>
          </div>

          <div className="modal-eliminar-abono-info">
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Cliente:</span>
              <span className="modal-eliminar-info-value">{abono.cliente.nombre}</span>
            </div>
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Monto:</span>
              <span className="modal-eliminar-info-value modal-eliminar-destacado">
                {formatearMoneda(abono.planPago.montoTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-eliminar-footer">
          <button
            className="modal-eliminar-boton-secundario"
            onClick={alCerrar}
            disabled={procesando}
          >
            Cancelar
          </button>
          <button
            className="modal-eliminar-boton-principal"
            onClick={manejarEliminar}
            disabled={procesando}
          >
            {procesando ? (
              <>
                <Trash2 size={16} className="modal-eliminar-icono-girando" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Eliminar Definitivo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarDefinitivoAbono;