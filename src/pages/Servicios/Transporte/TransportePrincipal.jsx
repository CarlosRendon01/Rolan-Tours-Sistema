import React, { useState, useEffect } from "react";
import axios from 'axios';
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaTransporte from "./Componentes/TablaTransporte";
import ModalAgregarTransporte from "./ModalesTransporte/ModalAgregarTransporte";
import ModalEditarTransporte from "./ModalesTransporte/ModalEditarTransporte";
import ModalVerTransporte from "./ModalesTransporte/ModalVerTransporte";
import { modalEliminarTransporte } from "./ModalesTransporte/Modaleliminartransporte";
import "./TransportePrincipal.css";

const TransportePrincipal = () => {
  // Estado principal
  const [transportes, setTransportes] = useState([]);

  // Estados para los modales
  const [transporteSeleccionado, setTransporteSeleccionado] = useState(null);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  // Lista de proveedores
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    recargarTransportes();
    recargarProveedores();
  }, []);

  const recargarTransportes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/transportes", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });
      setTransportes(response.data);
      console.log('✅ Transportes recargados');
    } catch (error) {
      console.error('❌ Error al recargar transportes:', error);
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
      console.log('✅ Proveedores recargados');
    } catch (error) {
      console.error('❌ Error al recargar proveedores:', error);
    }
  };

  // Manejadores
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
        if (nuevoTransporte[key] !== null && nuevoTransporte[key] !== undefined) {
          formData.append(key, nuevoTransporte[key]);
        }
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/transportes",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log("✅ Transporte creado:", response.data);
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
      formData.append('_method', 'PUT');

      Object.keys(transporteActualizado).forEach(key => {
        if (transporteActualizado[key] !== null && transporteActualizado[key] !== undefined) {
          formData.append(key, transporteActualizado[key]);
        }
      });

      const response = await axios.post(
        `http://127.0.0.1:8000/api/transportes/${transporteActualizado.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log("✅ Transporte actualizado:", response.data);
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
          await axios.delete(`http://127.0.0.1:8000/api/transportes/${transporteAEliminar.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            }
          });
          console.log('✅ Transporte eliminado');
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

  return (
    <PrincipalComponente>
      <div className="transporte-principal">
        <TablaTransporte
          transportes={transportes}
          onVer={manejarVer}
          onAgregar={manejarAgregar}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
        />

        {/* Modal Ver */}
        {modalVerAbierto && transporteSeleccionado && (
          <ModalVerTransporte
            transporte={transporteSeleccionado}
            onCerrar={cerrarModales}
          />
        )}

        {/* Modal Agregar */}
        {modalAgregarAbierto && (
          <ModalAgregarTransporte
            onGuardar={manejarGuardarTransporte}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}

        {/* Modal Editar */}
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