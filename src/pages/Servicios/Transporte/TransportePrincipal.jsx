import React, { useState, useEffect } from "react";
import axios from 'axios';
import PrincipalComponente from "../../Generales/Componentes/PrincipalComponente";
import TablaTransporte from "./Componentes/TablaTransporte";
import ModalAgregarTransporte from "./ModalesTransporte/ModalAgregarTransporte";
import ModalEditarTransporte from "./ModalesTransporte/ModalEditarTransporte";
import ModalVerTransporte from "./ModalesTransporte/ModalVerTransporte";
import { modalEliminarTransporte } from "./ModalesTransporte/ModalEliminarTransporte";
import "./TransportePrincipal.css";
import { API_CONFIG } from "../../../config/api";

const TransportePrincipal = () => {
  const [transportes, setTransportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [transporteSeleccionado, setTransporteSeleccionado] = useState(null);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    recargarTransportes();
    recargarProveedores();
  }, []);

  const recargarTransportes = async () => {
    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.get(`${API_CONFIG.BASE_URL}/transportes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 10000
      });

      setTransportes(response.data);
    } catch (error) {
      console.error('❌ Error al recargar transportes:', error);

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
      const response = await axios.get(`${API_CONFIG.BASE_URL}/proveedores`, {
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

  const manejarVer = (transporte) => {
    setTransporteSeleccionado(transporte);
    setModalVerAbierto(true);
  };

  const manejarAgregar = () => {
    setModalAgregarAbierto(true);
  };

  const manejarEditar = (transporte) => {
    setTransporteSeleccionado(transporte);
    setModalEditarAbierto(true);
  };

  const manejarGuardarTransporte = async (nuevoTransporte) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      Object.keys(nuevoTransporte).forEach(key => {
        const value = nuevoTransporte[key];

        if (key === 'disponibilidad') {
          formData.append(key, value ? '1' : '0');
        }
        else if (value instanceof File) {
          formData.append(key, value);
        }
        else if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/transportes`,
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
      await recargarTransportes();
    } catch (error) {
      console.error("❌ Error al crear transporte:", error);
      throw error;
    }
  };

  const manejarActualizarTransporte = async (transporteActualizado) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      Object.keys(transporteActualizado).forEach(key => {
        const value = transporteActualizado[key];

        if (key === 'disponibilidad') {
          formData.append(key, value ? '1' : '0');
        }
        else if (value instanceof File) {
          formData.append(key, value);
        }
        else if (key === 'foto_servicio' && typeof value === 'string') {
        }
        else if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      formData.append('_method', 'PUT');

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/transportes/${transporteActualizado.id}`,
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
      await recargarTransportes();
    } catch (error) {
      console.error("❌ Error al actualizar transporte:", error);
      throw error;
    }
  };

  const manejarEliminar = async (transporte) => {
    const confirmado = await modalEliminarTransporte(
      transporte,
      async (transporteAEliminar) => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${API_CONFIG.BASE_URL}/transportes/${transporteAEliminar.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            }
          });
          await recargarTransportes();
        } catch (error) {
          console.error('❌ Error al eliminar transporte:', error);
        }
      }
    );
  };

  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalAgregarAbierto(false);
    setModalEditarAbierto(false);
    setTransporteSeleccionado(null);
  };

  if (error) {
    return (
      <PrincipalComponente>
        <div className="transporte-error-container">
          <div className="transporte-error-box">
            <h2 className="transporte-error-title">
              ❌ Error al cargar transportes
            </h2>
            <p className="transporte-error-message">
              {error}
            </p>
            <button
              onClick={recargarTransportes}
              className="transporte-error-button"
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
      <div className="transporte-principal">
        <TablaTransporte
          transportes={transportes}
          onVer={manejarVer}
          onAgregar={manejarAgregar}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
          cargando={cargando}
          onRecargar={recargarTransportes}
        />

        {modalVerAbierto && transporteSeleccionado && (
          <ModalVerTransporte
            transporte={transporteSeleccionado}
            onCerrar={cerrarModales}
          />
        )}

        {modalAgregarAbierto && (
          <ModalAgregarTransporte
            onGuardar={manejarGuardarTransporte}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}

        {modalEditarAbierto && transporteSeleccionado && (
          <ModalEditarTransporte
            transporte={transporteSeleccionado}
            onGuardar={manejarActualizarTransporte}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};
export default TransportePrincipal;