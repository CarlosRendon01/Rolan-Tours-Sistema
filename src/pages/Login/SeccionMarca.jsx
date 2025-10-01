import React from 'react';
import './SeccionMarca.css';

const SeccionMarca = () => {
  return (
    <div className="seccion-marca">
      {/* Logo decorativo en esquina superior izquierda */}
      <div className="logo-esquina">
        <div className="icono-colores">
          <div className="circulo naranja"></div>
          <div className="circulo morado"></div>
          <div className="circulo azul"></div>
          <div className="circulo verde"></div>
          <div className="circulo rosa"></div>
        </div>
      </div>

      {/* Contenido principal de la marca */}
      <div className="contenido-marca">
        <div className="logo-principal">
          {/* Espacio para la imagen del logo */}
          <div className="imagen-logo">
            <img 
              src="/assets/IconoRolanTours.png" 
              alt="Rolan Tours Logo"
              style={{ width: '250px', height: 'auto' }}
            />
          </div>
        </div>

        {/* Eslogan centrado */}
        <p className="eslogan-marca">¡Una mejor experiencia!</p>
      </div>

      {/* Puntos decorativos en la esquina inferior izquierda */}
      <div className="puntos-decorativos">
        {Array.from({ length: 49 }, (_, indice) => (
          <div key={indice} className="punto"></div>
        ))}
      </div>

      {/* 🔹 Contenedor a la derecha */}
      <div className="contenedor-derecha">
    
      </div>
    </div>
  );
};

export default SeccionMarca;
