import React from 'react';
import SeccionMarca from './SeccionMarca';
import FormularioLoginCard from './FormularioLoginCard';
import './PrincipalLogin.css';

const PrincipalLogin = ({ onLogin }) => {
  return (
    <div className="pagina-login">
      <SeccionMarca />
      <FormularioLoginCard alIniciarSesion={onLogin} />
    </div>
  );
};

export default PrincipalLogin;