import React, { useState, useEffect } from "react";
import axios from 'axios';
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaRestaurante from "./Componentes/TablaRestaurante";
import ModalAgregarRestaurante from "./ModalesRestaurante/ModalAgregarRestaurante";
import ModalEditarRestaurante from "./ModalesRestaurante/ModalEditarRestaurante";
import ModalVerRestaurante from "./ModalesRestaurante/ModalVerRestaurante";
import { modalEliminarRestaurante } from "./ModalesRestaurante/ModalEliminarRestaurante"; // ✅ IMPORTAR AQUÍ
import "./RestaurantePrincipal.css";

const RestaurantePrincipal = () => {
  // Estado principal
  const [restaurantes, setRestaurantes] = useState([]);

  // Estados para los modales
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  // Lista de proveedores
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    recargarRestaurantes();
    recargarProveedores();
  }, []);

  const recargarRestaurantes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/restaurantes", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });
      setRestaurantes(response.data);
      console.log('✅ Restaurantes recargados');
    } catch (error) {
      console.error('❌ Error al recargar restaurantes:', error);
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

  // ✅ ACTUALIZAR ESTA FUNCIÓN
  const manejarEliminar = async (restaurante) => {
    // Preparar el objeto con el formato que espera el modal
    const restauranteParaModal = {
      nombreRestaurante: restaurante.nombre_servicio,
      tipo: restaurante.categoria === "Buffet" ? "paquete" : "restaurante", // Adaptar según tu lógica
      id: restaurante.id
    };

    // Mostrar modal y esperar confirmación
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
          console.log('✅ Restaurante eliminado');
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

      console.log("✅ Restaurante creado:", response.data);
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

      console.log("✅ Restaurante actualizado:", response.data);
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

  return (
    <PrincipalComponente>
      <div className="restaurante-principal">
        <TablaRestaurante
          restaurantes={restaurantes}
          onVer={manejarVer}
          onAgregar={manejarAgregar}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
        />

        {/* Modal Agregar */}
        {modalAgregarAbierto && (
          <ModalAgregarRestaurante
            onGuardar={manejarGuardarRestaurante}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}

        {/* Modal Editar */}
        {modalEditarAbierto && restauranteSeleccionado && (
          <ModalEditarRestaurante
            restaurante={restauranteSeleccionado}
            onGuardar={manejarActualizarRestaurante}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}

        {/* Modal Ver */}
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