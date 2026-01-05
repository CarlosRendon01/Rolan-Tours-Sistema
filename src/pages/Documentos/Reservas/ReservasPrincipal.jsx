import React, { useState, useEffect } from "react";
import axios from "axios";
import TablaReservas from "./Componentes/TablaReservas";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import "./ReservasPrincipal.css";

const ReservasPrincipal = () => {
  const [reservasDatos, setReservasDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      
      const response = await axios.get("http://127.0.0.1:8000/api/reservas", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 10000
      });

      setReservasDatos(response.data);
      
    } catch (error) {
      console.error('❌ Error al cargar reservas:', error);
      
      if (error.code === 'ECONNABORTED') {
        setError('La conexión tardó demasiado. Verifica tu servidor.');
      } else if (error.response) {
        setError(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Verifica que esté corriendo.');
      } else {
        setError(error.message);
      }
    } finally {
      setCargando(false);
    }
  };

  if (error) {
    return (
      <PrincipalComponente>
        <div className="error-container">
          <div className="error-box">
            <h2 className="error-title">
              ❌ Error al cargar reservas
            </h2>
            <p className="error-message">
              {error}
            </p>
            <button
              onClick={cargarReservas}
              className="error-button"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </PrincipalComponente>
    );
  }

  return (
    <PrincipalComponente>
      <div className="reservas-principal">
        <TablaReservas 
          reservasDatos={reservasDatos}
          setReservasDatos={setReservasDatos}
          cargando={cargando}
          onRecargar={cargarReservas}
        />
      </div>
    </PrincipalComponente>
  );
};
export default ReservasPrincipal;