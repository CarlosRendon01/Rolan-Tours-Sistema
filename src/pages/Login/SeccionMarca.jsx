import React from 'react';
import './SeccionMarca.css';

const SeccionMarca = () => {
  return (
    <div className="seccion-marca">
      <div className="logo-esquina">
        <div className="icono-colores">
          <div className="circulo naranja"></div>
          <div className="circulo morado"></div>
          <div className="circulo azul"></div>
          <div className="circulo verde"></div>
          <div className="circulo rosa"></div>
        </div>
      </div>

      <div className="contenido-marca">
        <div className="logo-principal">
          <img
            src="/assets/IconoRolanTours.png"
            alt="Rolan Tours Logo"
            style={{ width: '250px', height: 'auto' }}
          />
        </div>

        <p className="eslogan-marca">¡Una mejor experiencia!</p>
      </div>

      <div className="puntos-decorativos">
        {Array.from({ length: 49 }, (_, indice) => (
          <div key={indice} className="punto"></div>
        ))}
      </div>

      <div className="contenedor-derecha">

      </div>
    </div>
  );
};

export default SeccionMarca;
