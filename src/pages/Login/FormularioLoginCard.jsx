import React, { useState } from 'react';
import './FormularioLoginCard.css';
import axios from 'axios';

const FormularioLoginCard = ({ alIniciarSesion }) => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [estaCargando, setEstaCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const manejarEnvioFormulario = async (evento) => {
    evento.preventDefault();
    setEstaCargando(true);
    setMensajeError('');

    try {
      const respuesta = await axios.post('http://127.0.0.1:8000/api/login', {
        correo: correo,
        contrasena: contraseña,
      });

      if (respuesta.data && respuesta.data.token) {
        localStorage.setItem('token', respuesta.data.token);
        localStorage.setItem('user', JSON.stringify(respuesta.data.user));
        console.log('Usuario logueado:', respuesta.data.user);
        alIniciarSesion(respuesta.data.user); // envía el usuario al componente padre
      } else {
        setMensajeError('Respuesta inesperada del servidor.');
      }
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response) {
        setMensajeError(error.response.data.message || 'Credenciales incorrectas');
      } else {
        setMensajeError('Error al conectar con el servidor.');
      }
    } finally {
      setEstaCargando(false);
    }
  };

  const alternarVisibilidadContraseña = () => {
    setMostrarContraseña(!mostrarContraseña);
  };

  return (
    <div className="seccion-formulario-transporte">
      {/* Tarjeta del formulario */}
      <div className="tarjeta-login">
        <div className="encabezado-tarjeta">
          <div className="franjas-bandera">
            <div className="franja roja"></div>
            <div className="franja blanca"></div>
            <div className="franja verde"></div>
          </div>
          <h2 className="titulo-bienvenida">¡Bienvenidos!</h2>
          <p className="subtitulo-bienvenida">INICIO</p>
        </div>

        <form onSubmit={manejarEnvioFormulario} className="formulario-login">
          <div className="campo-formulario">
            <label htmlFor="correo">Correo</label>
            <div className="grupo-entrada">
              <input
                type="email"
                id="correo"
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)}
                placeholder="alex@email.com"
              />
              <div className="icono-entrada correo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="campo-formulario">
            <label htmlFor="contraseña">Contraseña</label>
            <div className="grupo-entrada">
              <input
                type={mostrarContraseña ? "text" : "password"}
                id="contraseña"
                value={contraseña}
                onChange={(evento) => setContraseña(evento.target.value)}
                placeholder="Contraseña"
              />
              <div className="icono-entrada contraseña">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="opciones-formulario">
            <button
              type="button"
              className="boton-mostrar-contraseña"
              onClick={alternarVisibilidadContraseña}
            >
              <span>👁</span>
              <span>Ver Contraseña</span>
            </button>
          </div>

          {mensajeError && (
            <div className="mensaje-error">
              {mensajeError}
            </div>
          )}

          <button type="submit" className="boton-enviar" disabled={estaCargando}>
            {estaCargando ? 'INICIANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>
      </div>

      {/* Sección de transporte */}
      <div className="seccion-transporte">
        <div className="encabezado-transporte">
          <img
            src="/assets/RolanTranshportes.png"
            alt="Rolan Transporte Logo"
            className="logo-rolan-transporte-img"
          />
        </div>

        <div className="ilustracion-transporte">
          <img
            src="/assets/Login.png"
            alt="Van de Transporte"
            className="imagen-van"
          />

          <div className="elementos-decorativos">
            <div className="pin-ubicacion"></div>
            <div className="linea-ruta-punteada"></div>
            <div className="foto-decorativa"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioLoginCard;