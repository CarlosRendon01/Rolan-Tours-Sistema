import React, { useState } from 'react';
import { X, XCircle, AlertTriangle, Trash2, Shield } from 'lucide-react';
import './ModalEliminarDefinitivo.css';

const ModalEliminarDefinitivo = ({ estaAbierto, alCerrar, pago, alEliminar }) => {
  const [paso, setPaso] = useState(1); // 1: Primera confirmación, 2: Segunda confirmación
  const [textoConfirmacion, setTextoConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  if (!estaAbierto || !pago) return null;

  const manejarCancelar = () => {
    if (!cargando) {
      setPaso(1);
      setTextoConfirmacion('');
      setError('');
      alCerrar();
    }
  };

  const manejarPrimeraContinuar = () => {
    setPaso(2);
  };

  const manejarSegundaVolver = () => {
    setPaso(1);
    setTextoConfirmacion('');
    setError('');
  };

  const validarTexto = () => {
    if (textoConfirmacion.toUpperCase() !== 'ELIMINAR') {
      setError('Debes escribir exactamente "ELIMINAR" para confirmar');
      return false;
    }
    return true;
  };

  const manejarEliminarDefinitivo = async () => {
    if (!validarTexto()) {
      return;
    }

    setCargando(true);
    setError('');

    try {
      // Simular delay de operación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ejecutar la función de eliminación
      if (alEliminar && typeof alEliminar === 'function') {
        await alEliminar(pago);
      }
      
      // Cerrar el modal
      setTimeout(() => {
        setCargando(false);
        setPaso(1);
        setTextoConfirmacion('');
        alCerrar();
      }, 500);
      
    } catch (error) {
      console.error('Error al eliminar pago:', error);
      setCargando(false);
      setError('Ocurrió un error al eliminar el pago. Por favor, intente nuevamente.');
    }
  };

  const manejarCambioTexto = (e) => {
    setTextoConfirmacion(e.target.value);
    if (error) setError('');
  };

  // PASO 1: Primera advertencia
  if (paso === 1) {
    return (
      <div className="modal-overlay-eliminar" onClick={manejarCancelar}>
        <div className="modal-contenido-eliminar" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header-eliminar paso1">
            <div className="modal-header-icono-eliminar">
              <AlertTriangle size={32} />
            </div>
            <h2 className="modal-titulo-eliminar">⚠️ ¡ADVERTENCIA!</h2>
            <button
              className="modal-boton-cerrar-eliminar"
              onClick={manejarCancelar}
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenido */}
          <div className="modal-cuerpo-eliminar">
            {/* Alerta Principal */}
            <div className="eliminar-alerta-principal">
              <div className="eliminar-alerta-icono">
                <XCircle size={24} />
              </div>
              <div className="eliminar-alerta-texto">
                <p className="eliminar-alerta-titulo">🚨 Eliminación Permanente</p>
                <p className="eliminar-alerta-descripcion">
                  Estás a punto de <strong>ELIMINAR DEFINITIVAMENTE</strong> este pago del sistema. 
                  Esta acción <strong>NO SE PUEDE DESHACER</strong>.
                </p>
              </div>
            </div>

            {/* Información del Pago */}
            <div className="eliminar-info-pago">
              <div className="eliminar-info-header">
                <span className="eliminar-info-titulo">📋 Información del Pago a Eliminar:</span>
              </div>
              <div className="eliminar-info-detalle">
                <div className="eliminar-info-fila">
                  <span className="eliminar-info-label">ID:</span>
                  <span className="eliminar-info-valor">#{pago.id.toString().padStart(3, '0')}</span>
                </div>
                <div className="eliminar-info-fila">
                  <span className="eliminar-info-label">Cliente:</span>
                  <span className="eliminar-info-valor">{pago.cliente}</span>
                </div>
                <div className="eliminar-info-fila">
                  <span className="eliminar-info-label">Monto:</span>
                  <span className="eliminar-info-valor eliminar-monto">{pago.monto}</span>
                </div>
                <div className="eliminar-info-fila">
                  <span className="eliminar-info-label">Factura:</span>
                  <span className="eliminar-info-valor">{pago.numeroFactura}</span>
                </div>
                <div className="eliminar-info-fila">
                  <span className="eliminar-info-label">Estado:</span>
                  <span className={`eliminar-badge ${pago.estado.toLowerCase()}`}>
                    {pago.estado}
                  </span>
                </div>
                <div className="eliminar-info-fila">
                  <span className="eliminar-info-label">Visible:</span>
                  <span className="eliminar-info-valor">
                    {pago.activo ? 'Sí' : 'No (Eliminado)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Consecuencias */}
            <div className="eliminar-consecuencias">
              <p className="eliminar-consecuencias-titulo">❌ Al eliminar este pago:</p>
              <ul className="eliminar-consecuencias-lista">
                <li>Se borrará permanentemente de la base de datos</li>
                <li>No podrá ser recuperado por ningún usuario</li>
                <li>Se perderá todo el historial relacionado</li>
                <li>Esta acción es <strong>IRREVERSIBLE</strong></li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer-eliminar">
            <button
              className="boton-cancelar-eliminar"
              onClick={manejarCancelar}
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              className="boton-continuar-eliminar"
              onClick={manejarPrimeraContinuar}
            >
              <AlertTriangle size={18} />
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PASO 2: Confirmación final
  return (
    <div className="modal-overlay-eliminar" onClick={manejarCancelar}>
      <div className="modal-contenido-eliminar" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-eliminar paso2">
          <div className="modal-header-icono-eliminar critico">
            <Trash2 size={32} />
          </div>
          <h2 className="modal-titulo-eliminar critico">⚠️ ÚLTIMA ADVERTENCIA</h2>
          <button
            className="modal-boton-cerrar-eliminar"
            onClick={manejarCancelar}
            disabled={cargando}
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="modal-cuerpo-eliminar">
          {/* Alerta Crítica */}
          <div className="eliminar-alerta-critica">
            <p className="eliminar-alerta-critica-titulo">🛑 ELIMINACIÓN DEFINITIVA</p>
            <p className="eliminar-alerta-critica-subtitulo">
              Esta es tu <strong>ÚLTIMA OPORTUNIDAD</strong> para cancelar
            </p>
          </div>

          {/* Datos Destacados */}
          <div className="eliminar-datos-destacados">
            <p className="eliminar-cliente-nombre">{pago.cliente}</p>
            <p className="eliminar-monto-grande">{pago.monto}</p>
            <p className="eliminar-factura-numero">Factura: {pago.numeroFactura}</p>
          </div>

          {/* Input de Confirmación */}
          <div className="eliminar-confirmacion-input">
            <p className="eliminar-confirmacion-pregunta">
              ¿Estás completamente seguro?
            </p>
            <p className="eliminar-confirmacion-instruccion">
              Escribe "<strong>ELIMINAR</strong>" en el campo de abajo para confirmar:
            </p>
            <input
              type="text"
              className={`eliminar-input-texto ${error ? 'eliminar-input-error' : ''}`}
              placeholder="Escribe ELIMINAR"
              value={textoConfirmacion}
              onChange={manejarCambioTexto}
              disabled={cargando}
              autoFocus
            />
            {error && (
              <p className="eliminar-mensaje-error">
                ❌ {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer-eliminar">
          <button
            className="boton-volver-eliminar"
            onClick={manejarSegundaVolver}
            disabled={cargando}
          >
            <Shield size={18} />
            Volver atrás
          </button>
          <button
            className="boton-eliminar-definitivo"
            onClick={manejarEliminarDefinitivo}
            disabled={cargando || textoConfirmacion.toUpperCase() !== 'ELIMINAR'}
          >
            {cargando ? (
              <>
                <div className="spinner-eliminar"></div>
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                ELIMINAR DEFINITIVAMENTE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarDefinitivo;