import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import NuevaCotizacion from "./Componentes/nuevaCotizacion";
import TablaCotizacion from "./Componentes/tablaCotizacion";
import "./Componentes/nuevaCotizacion.css";
import "./cotizaciones.css";

const Cotizacion = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [cotizacionEditar, setCotizacionEditar] = useState(null);
  const [cargando, setCargando] = useState(false);
  const rol = localStorage.getItem("rol");

  const API_URL = "http://127.0.0.1:8000/api/cotizaciones";

  // 🆕 CARGAR cotizaciones al montar el componente
  useEffect(() => {
    cargarCotizaciones();
  }, []);

  // 🆕 FUNCIÓN para cargar cotizaciones desde el API
  const cargarCotizaciones = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No hay token disponible");
        setCargando(false);
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      console.log("Cotizaciones cargadas:", response.data);

      // 🔹 Normalizar los extras antes de guardar en el estado
      const cotizacionesProcesadas = response.data.map((cotizacion) => {
        let extras = [];

        if (cotizacion.extra) {
          try {
            const parsed =
              typeof cotizacion.extra === "string"
                ? JSON.parse(cotizacion.extra)
                : cotizacion.extra;

            extras = parsed.extras_seleccionados || [];
          } catch (e) {
            console.error(
              "Error al parsear extras en cotización:",
              cotizacion.id,
              e
            );
          }
        }

        return {
          ...cotizacion,
          extras,
        };
      });

      setCotizaciones(cotizacionesProcesadas);
    } catch (error) {
      console.error("Error al cargar cotizaciones:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        alert(
          "Error al cargar cotizaciones: " +
            (error.response?.data?.error || error.message)
        );
      }
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarCotizacion = useCallback(
    async (nuevaCotizacion, esEdicion = false) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No hay sesión activa");
          return;
        }

        if (esEdicion) {
          // ACTUALIZAR
          await axios.put(`${API_URL}/${nuevaCotizacion.id}`, nuevaCotizacion, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
          // mostrarNotificacionExito();
        } else {
          // CREAR
          await axios.post(API_URL, nuevaCotizacion, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
        }

        // Recargar cotizaciones después de guardar
        await cargarCotizaciones();
        setCotizacionEditar(null);

        console.log(
          esEdicion ? "Cotización actualizada" : "Nueva cotización agregada"
        );
      } catch (error) {
        console.error("Error al guardar cotización:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else {
          alert(
            "Error al guardar la cotización: " +
              (error.response?.data?.error || error.message)
          );
        }
        throw error;
      }
    },
    [API_URL]
  );

  const handleEditarCotizacion = useCallback((cotizacion) => {
    setCotizacionEditar(cotizacion);

    console.log("Editando cotización:", cotizacion);
  }, []);

  const handleCancelarEdicion = useCallback(() => {
    setCotizacionEditar(null);
  }, []);

  const handleEliminarCotizacion = useCallback(
    async (id) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No hay sesión activa");
          return;
        }

        await axios.delete(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        // Recargar cotizaciones después de eliminar
        await cargarCotizaciones();
        console.log("Cotización eliminada con ID:", id);
      } catch (error) {
        console.error("Error al eliminar cotización:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else {
          alert(
            "Error al eliminar la cotización: " +
              (error.response?.data?.error || error.message)
          );
        }
        throw error;
      }
    },
    [API_URL]
  );

  return (
    <div className="cotizacion-container">
      <div className="cotizacion-layout">
        <div className="tabla-cotizacion-section">
          <TablaCotizacion
            cotizaciones={cotizaciones}
            onEditar={handleEditarCotizacion}
            onEliminar={handleEliminarCotizacion}
            botonNuevaCotizacion={
              <NuevaCotizacion
                mostrarBoton={rol === "admin"}
                onGuardarCotizacion={handleGuardarCotizacion}
                cotizacionEditar={cotizacionEditar}
                onCancelarEdicion={handleCancelarEdicion}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Cotizacion;
