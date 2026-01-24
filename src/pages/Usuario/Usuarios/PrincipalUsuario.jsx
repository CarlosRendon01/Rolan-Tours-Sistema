import React, { useState, useEffect } from "react";
import axios from "axios";
import TablaUsuarios from "./TablaUsuarios";
import PrincipalComponente from "../../Generales/Componentes/PrincipalComponente";
import ModalAgregarUsuario from "./Modales/ModalAgregarUsuario";
import ModalVerUsuario from "./Modales/ModalVerUsuarios";
import ModalEditarUsuario from "./Modales/ModalEditarUsuario";
import ModalEliminarUsuario from "./Modales/ModalEliminarUsuario";
import "./PrincipalUsuario.css";
import { API_CONFIG } from "../../../config/api";

const UsuariosPrincipal = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    recargarUsuarios();
    recargarRoles();
  }, []);

  const recargarUsuarios = async () => {
    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.get(`${API_CONFIG.BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 10000
      });

      setUsuarios(response.data);

    } catch (error) {
      console.error("❌ Error al recargar usuarios:", error);

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

  const recargarRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_CONFIG.BASE_URL}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error("❌ Error al cargar roles:", error);
    }
  };

  const manejarVer = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalVerAbierto(true);
  };

  const manejarEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditarAbierto(true);
  };

  const manejarEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminarAbierto(true);
  };

  const manejarAgregar = () => {
    setModalAgregarAbierto(true);
  };

  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalEditarAbierto(false);
    setModalEliminarAbierto(false);
    setModalAgregarAbierto(false);
    setUsuarioSeleccionado(null);
  };

  const agregarUsuario = async (nuevoUsuario) => {
    try {
      const token = localStorage.getItem("token");
      const userData = {
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        apellido_paterno: nuevoUsuario.apellido_paterno || null,
        apellido_materno: nuevoUsuario.apellido_materno || null,
        genero: nuevoUsuario.genero || null,
        estado: nuevoUsuario.estado || "activo",
        contrasena: nuevoUsuario.contrasena,
      };

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (
        nuevoUsuario.rolesSeleccionados &&
        nuevoUsuario.rolesSeleccionados.length > 0
      ) {
        await axios.post(
          `${API_CONFIG.BASE_URL}/users/${response.data.data.id}/roles`,
          { role_ids: nuevoUsuario.rolesSeleccionados },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
      }

      await recargarUsuarios();
      cerrarModales();
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      alert(
        "Error al crear usuario: " +
        (error.response?.data?.message || error.message)
      );
      throw error;
    }
  };

  const actualizarUsuario = async (usuarioActualizado) => {
    try {
      const token = localStorage.getItem("token");
      const userData = {
        nombre: usuarioActualizado.nombre,
        apellido_paterno: usuarioActualizado.apellido_paterno || null,
        apellido_materno: usuarioActualizado.apellido_materno || null,
        genero: usuarioActualizado.genero || null,
        estado: usuarioActualizado.estado || "activo",
        correo: usuarioActualizado.correo,
      };

      if (
        usuarioActualizado.contrasena &&
        usuarioActualizado.contrasena.trim() !== ""
      ) {
        userData.contrasena = usuarioActualizado.contrasena;
      }

      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/users/${usuarioActualizado.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      await axios.post(
        `${API_CONFIG.BASE_URL}/users/${usuarioActualizado.id}/roles`,
        { role_ids: usuarioActualizado.rolesSeleccionados || [] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      await recargarUsuarios();
      cerrarModales();
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      alert(
        "Error al actualizar usuario: " +
        (error.response?.data?.message || error.message)
      );
      throw error;
    }
  };

  const eliminarUsuario = async (usuario) => {
    if (!usuario) {
      cerrarModales();
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_CONFIG.BASE_URL}/users/${usuario.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      await recargarUsuarios();
      cerrarModales();
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);

      if (typeof window !== "undefined" && window.Swal) {
        window.Swal.fire({
          title: "Error al Eliminar",
          text:
            error.response?.data?.error ||
            error.response?.data?.message ||
            "No se pudo eliminar el usuario",
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#dc3545",
        });
      } else {
        alert(
          "Error al eliminar usuario: " +
          (error.response?.data?.error || error.message)
        );
      }

      cerrarModales();
    }
  };

  if (error) {
    return (
      <PrincipalComponente>
        <div className="usuarios-error-container">
          <div className="usuarios-error-box">
            <h2 className="usuarios-error-title">
              ❌ Error al cargar usuarios
            </h2>
            <p className="usuarios-error-message">
              {error}
            </p>
            <button
              onClick={recargarUsuarios}
              className="usuarios-error-button"
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
      <div className="usuarios-principal">
        <TablaUsuarios
          usuarios={usuarios}
          setUsuarios={setUsuarios}
          onVer={manejarVer}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
          onAgregar={manejarAgregar}
          cargando={cargando}
          onRecargar={recargarUsuarios}
        />

        {modalVerAbierto && usuarioSeleccionado && (
          <ModalVerUsuario
            usuario={usuarioSeleccionado}
            onCerrar={cerrarModales}
            roles={roles}
          />
        )}

        {modalEditarAbierto && usuarioSeleccionado && (
          <ModalEditarUsuario
            usuario={usuarioSeleccionado}
            onGuardar={actualizarUsuario}
            onCerrar={cerrarModales}
            roles={roles}
          />
        )}

        {modalEliminarAbierto && usuarioSeleccionado && (
          <ModalEliminarUsuario
            usuario={usuarioSeleccionado}
            alConfirmar={eliminarUsuario}
          />
        )}

        {modalAgregarAbierto && (
          <ModalAgregarUsuario
            onGuardar={agregarUsuario}
            onCerrar={cerrarModales}
            roles={roles}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};
export default UsuariosPrincipal;