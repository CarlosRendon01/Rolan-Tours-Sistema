import React, { useState } from 'react';
import axios from 'axios';
import { X, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import './ModalEliminarDefinitivo.css';

const ModalEliminarDefinitivo = ({ recibo, onConfirmar, onCerrar, isOpen }) => {
  const [cargando, setCargando] = useState(false);
  const [confirmacionTexto, setConfirmacionTexto] = useState('');
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(true);

  if (!isOpen) return null;

  const textoConfirmacion = 'ELIMINAR';
  const puedeEliminar = confirmacionTexto.toUpperCase() === textoConfirmacion;

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  const manejarConfirmacion = async () => {
    if (!puedeEliminar) return;

    setCargando(true);
    try {
      const token = localStorage.getItem("token");

      // ✅ Llamar al backend para eliminar definitivamente
      await axios.delete(`http://127.0.0.1:8000/api/abonos/${recibo.id}/force`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onConfirmar) {
        await onConfirmar(recibo);
      }

      onCerrar();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el recibo definitivamente. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-eliminar-overlay" onClick={onCerrar}>
      <div className="modal-eliminar-contenedor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-eliminar-header">
          <div className="modal-eliminar-icono-header">
            <Trash2 size={24} />
          </div>
          <div className="modal-eliminar-titulo-seccion">
            <h2 className="modal-eliminar-titulo">Eliminar Definitivamente</h2>
            <p className="modal-eliminar-subtitulo">Esta acción no se puede deshacer</p>
          </div>
          <button className="modal-eliminar-boton-cerrar" onClick={onCerrar} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-eliminar-contenido">
          {mostrarAdvertencia && (
            <div className="modal-eliminar-alerta">
              <AlertTriangle size={20} />
              <div className="modal-eliminar-alerta-content">
                <p className="modal-eliminar-alerta-titulo">¡Advertencia Crítica!</p>
                <p className="modal-eliminar-alerta-texto">
                  Esta acción eliminará el recibo de forma <strong>permanente</strong> de la base de datos.
                  No podrá recuperarse después de confirmar esta operación.
                </p>
              </div>
              <button
                className="modal-eliminar-alerta-cerrar"
                onClick={() => setMostrarAdvertencia(false)}
                aria-label="Cerrar advertencia"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="modal-eliminar-recibo-info">
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Número de Recibo:</span>
              <span className="modal-eliminar-info-value">{recibo.numeroRecibo}</span>
            </div>
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Cliente:</span>
              <span className="modal-eliminar-info-value">{recibo.cliente}</span>
            </div>
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Monto:</span>
              <span className="modal-eliminar-info-value modal-eliminar-destacado">
                {formatearMoneda(recibo.monto)}
              </span>
            </div>
            <div className="modal-eliminar-info-item">
              <span className="modal-eliminar-info-label">Estado:</span>
              <span className="modal-eliminar-info-value">{recibo.estado}</span>
            </div>
          </div>

          <div className="modal-eliminar-confirmacion-seccion">
            <p className="modal-eliminar-confirmacion-instruccion">
              Para confirmar la eliminación definitiva, escriba{' '}
              <strong className="modal-eliminar-texto-requerido">{textoConfirmacion}</strong>{' '}
              en el campo siguiente:
            </p>
            <div className="modal-eliminar-form-group">
              <input
                type="text"
                className={`modal-eliminar-form-input ${puedeEliminar ? 'modal-eliminar-input-valido' : ''}`}
                placeholder="Escriba ELIMINAR para confirmar"
                value={confirmacionTexto}
                onChange={(e) => setConfirmacionTexto(e.target.value)}
                autoComplete="off"
                autoFocus
              />
              {puedeEliminar && (
                <div className="modal-eliminar-confirmacion-valida">
                  <CheckCircle size={16} />
                  <span>Confirmación correcta</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-eliminar-consecuencias">
            <p className="modal-eliminar-consecuencias-titulo">Consecuencias de esta acción:</p>
            <ul className="modal-eliminar-consecuencias-lista">
              <li>El recibo se eliminará permanentemente de la base de datos</li>
              <li>Los registros históricos asociados se perderán</li>
              <li>Esta acción quedará registrada en el log de auditoría</li>
              <li>No será posible regenerar o recuperar este recibo</li>
            </ul>
          </div>
        </div>

        <div className="modal-eliminar-footer">
          <button
            className="modal-eliminar-boton-secundario"
            onClick={onCerrar}
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            className="modal-eliminar-boton-peligro"
            onClick={manejarConfirmacion}
            disabled={cargando || !puedeEliminar}
          >
            {cargando ? (
              <>
                <Trash2 size={16} className="modal-eliminar-icono-temblor" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Eliminar Permanentemente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarDefinitivo;