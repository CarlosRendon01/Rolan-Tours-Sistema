// src/pages/Ventas/Pagos/ModalesAbonos/ModalEliminarDefinitivoAbono.jsx

import React from 'react';
import { XCircle } from 'lucide-react';

const ModalEliminarDefinitivoAbono = ({ estaAbierto, alCerrar, abono, alEliminar }) => {
  if (!estaAbierto) return null;

  const manejarEliminar = () => {
    alEliminar(abono);
    alCerrar();
  };

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <div className="modal-encabezado">
          <XCircle size={22} style={{ color: '#dc2626' }} />
          <h2>Eliminar Abono Definitivamente</h2>
        </div>
        <p>
          ¿Estás seguro de que deseas eliminar el abono del cliente{' '}
          <strong>{abono?.cliente?.nombre}</strong>?
        </p>

        <div className="modal-botones">
          <button onClick={alCerrar} className="boton-cancelar">
            Cancelar
          </button>
          <button onClick={manejarEliminar} className="boton-eliminar">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarDefinitivoAbono;
