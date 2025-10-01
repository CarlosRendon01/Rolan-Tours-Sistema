import React, { useState } from 'react';
import TablaAbonos from './PARF/TablaAbonos';
import TablaRecibos from './PARF/TablaRecibos';
import TablaFacturas from './PARF/TablaFacturas';
import GestionPagos from './PARF/GestionPagos';
import './TablaPagos.css';

const TablaPagos = () => {
  const [vistaActual, setVistaActual] = useState('pagos');

  const manejarCambioVista = (evento) => {
    setVistaActual(evento.target.value);
  };

  const renderVistaActual = () => {
    // Props compartidas para todos los componentes
    const propsCompartidas = {
      vistaActual,
      onCambiarVista: manejarCambioVista
    };

    switch (vistaActual) {
      case 'pagos':
        return <GestionPagos {...propsCompartidas} />;
      case 'abonos':
        return <TablaAbonos {...propsCompartidas} />;
      case 'recibos':
        return <TablaRecibos {...propsCompartidas} />;
      case 'facturas':
        return <TablaFacturas {...propsCompartidas} />;
      default:
        return <GestionPagos {...propsCompartidas} />;
    }
  };

  return (
    <div style={{width: '100%', background: '#f8f9fa'}}>
      {renderVistaActual()}
    </div>
  );
};

export default TablaPagos;