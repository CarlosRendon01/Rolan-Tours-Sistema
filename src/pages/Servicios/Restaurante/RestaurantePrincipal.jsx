import React, { useState, useEffect } from "react";
import axios from 'axios';
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaRestaurante from "./Componentes/TablaRestaurante";
import ModalAgregarRestaurante from "./ModalesRestaurante/ModalAgregarRestaurante";
import ModalEditarRestaurante from "./ModalesRestaurante/ModalEditarRestaurante";
import ModalVerRestaurante from "./ModalesRestaurante/ModalVerRestaurante";
import { modalEliminarRestaurante } from "./ModalesRestaurante/ModalEliminarRestaurante";
import "./RestaurantePrincipal.css";

const RestaurantePrincipal = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    recargarRestaurantes();
    recargarProveedores();
  }, []);

  const recargarRestaurantes = async () => {
    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.get("http://127.0.0.1:8000/api/restaurantes", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 10000
      });

      setRestaurantes(response.data);

    } catch (error) {
      console.error('❌ Error al recargar restaurantes:', error);

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

  const recargarProveedores = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/proveedores", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });
      setProveedores(response.data);
    } catch (error) {
      console.error('❌ Error al recargar proveedores:', error);
    }
  };

  const manejarVer = (restaurante) => {
    setRestauranteSeleccionado(restaurante);
    setModalVerAbierto(true);
  };

  const manejarAgregar = () => {
    setModalAgregarAbierto(true);
  };

  const manejarEditar = (restaurante) => {
    setRestauranteSeleccionado(restaurante);
    setModalEditarAbierto(true);
  };

  const manejarEliminar = async (restaurante) => {
    const restauranteParaModal = {
      nombreRestaurante: restaurante.nombre_servicio,
      tipo: restaurante.categoria === "Buffet" ? "paquete" : "restaurante",
      id: restaurante.id
    };

    const confirmado = await modalEliminarRestaurante(
      restauranteParaModal,
      async (rest) => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://127.0.0.1:8000/api/restaurantes/${rest.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            }
          });
          await recargarRestaurantes();
        } catch (error) {
          console.error('❌ Error al eliminar restaurante:', error);
        }
      }
    );
  };

  const manejarGuardarRestaurante = async (nuevoRestaurante) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      Object.keys(nuevoRestaurante).forEach(key => {
        if (nuevoRestaurante[key] !== null && nuevoRestaurante[key] !== undefined) {
          formData.append(key, nuevoRestaurante[key]);
        }
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/restaurantes",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      cerrarModales();
      await recargarRestaurantes();
    } catch (error) {
      console.error("❌ Error al crear restaurante:", error);
      throw error;
    }
  };

  const manejarActualizarRestaurante = async (restauranteActualizado) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append('_method', 'PUT');

      Object.keys(restauranteActualizado).forEach(key => {
        if (restauranteActualizado[key] !== null && restauranteActualizado[key] !== undefined) {
          formData.append(key, restauranteActualizado[key]);
        }
      });

      const response = await axios.post(
        `http://127.0.0.1:8000/api/restaurantes/${restauranteActualizado.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      cerrarModales();
      await recargarRestaurantes();
    } catch (error) {
      console.error("❌ Error al actualizar restaurante:", error);
      throw error;
    }
  };

  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalAgregarAbierto(false);
    setModalEditarAbierto(false);
    setRestauranteSeleccionado(null);
  };

  if (error) {
    return (
      <PrincipalComponente>
        <div className="restaurante-error-container">
          <div className="restaurante-error-box">
            <h2 className="restaurante-error-title">
              ❌ Error al cargar restaurantes
            </h2>
            <p className="restaurante-error-message">
              {error}
            </p>
            <button
              onClick={recargarRestaurantes}
              className="restaurante-error-button"
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
      <div className="restaurante-principal">
        <TablaRestaurante
          restaurantes={restaurantes}
          onVer={manejarVer}
          onAgregar={manejarAgregar}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
          cargando={cargando}
          onRecargar={recargarRestaurantes}
        />

        {modalAgregarAbierto && (
          <ModalAgregarRestaurante
            onGuardar={manejarGuardarRestaurante}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}

        {modalEditarAbierto && restauranteSeleccionado && (
          <ModalEditarRestaurante
            restaurante={restauranteSeleccionado}
            onGuardar={manejarActualizarRestaurante}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}

        {modalVerAbierto && restauranteSeleccionado && (
          <ModalVerRestaurante
            restaurante={restauranteSeleccionado}
            onCerrar={cerrarModales}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default RestaurantePrincipal;