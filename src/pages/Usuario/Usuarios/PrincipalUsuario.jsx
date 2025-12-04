import React, { useState, useEffect } from "react";
import axios from "axios";
import TablaUsuarios from "./TablaUsuarios";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import ModalAgregarUsuario from "./Modales/ModalAgregarUsuario";
import ModalVerUsuario from "./Modales/ModalVerUsuarios";
import ModalEditarUsuario from "./Modales/ModalEditarUsuario";
import ModalEliminarUsuario from "./Modales/ModalEliminarUsuario";
import "./PrincipalUsuario.css";

const UsuariosPrincipal = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);

  // Estados para controlar los modales de USUARIOS
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
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setUsuarios(response.data);
      console.log("✅ Usuarios recargados");
    } catch (error) {
      console.error("❌ Error al recargar usuarios:", error);
    }
  };

  const recargarRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setRoles(response.data);
      console.log("✅ Roles cargados");
    } catch (error) {
      console.error("❌ Error al cargar roles:", error);
    }
  };

  // Funciones para manejar los modales de USUARIOS
  const manejarVer = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalVerAbierto(true);
    console.log("Ver usuario:", usuario);
  };

  const manejarEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditarAbierto(true);
    console.log("Editar usuario:", usuario);
  };

  const manejarEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminarAbierto(true);
    console.log("Eliminar usuario:", usuario);
  };

  const manejarAgregar = () => {
    setModalAgregarAbierto(true);
    console.log("Agregar nuevo usuario");
  };

  // Función para cerrar modales
  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalEditarAbierto(false);
    setModalEliminarAbierto(false);
    setModalAgregarAbierto(false);
    setUsuarioSeleccionado(null);
  };

  // Función para agregar usuario
  const agregarUsuario = async (nuevoUsuario) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Crear el usuario básico
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
        "http://127.0.0.1:8000/api/users",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("✅ Usuario creado:", response.data);

      // 2. Asignar roles si hay
      if (
        nuevoUsuario.rolesSeleccionados &&
        nuevoUsuario.rolesSeleccionados.length > 0
      ) {
        await axios.post(
          `http://127.0.0.1:8000/api/users/${response.data.data.id}/roles`,
          { role_ids: nuevoUsuario.rolesSeleccionados },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        console.log("✅ Roles asignados:", nuevoUsuario.rolesSeleccionados);
      }

      cerrarModales();
      await recargarUsuarios();
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      alert(
        "Error al crear usuario: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const actualizarUsuario = async (usuarioActualizado) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Actualizar datos básicos del usuario
      const userData = {
        nombre: usuarioActualizado.nombre,
        apellido_paterno: usuarioActualizado.apellido_paterno || null,
        apellido_materno: usuarioActualizado.apellido_materno || null,
        genero: usuarioActualizado.genero || null,
        estado: usuarioActualizado.estado || "activo",
        correo: usuarioActualizado.correo,
      };

      // Solo enviar contraseña si fue modificada
      if (
        usuarioActualizado.contrasena &&
        usuarioActualizado.contrasena.trim() !== ""
      ) {
        userData.contrasena = usuarioActualizado.contrasena;
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/${usuarioActualizado.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("✅ Usuario actualizado:", response.data);

      // 2. Actualizar roles
      await axios.post(
        `http://127.0.0.1:8000/api/users/${usuarioActualizado.id}/roles`,
        { role_ids: usuarioActualizado.rolesSeleccionados || [] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("✅ Roles actualizados:", usuarioActualizado.rolesSeleccionados);

      cerrarModales();
      await recargarUsuarios();
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      alert(
        "Error al actualizar usuario: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  // Función para eliminar usuario
  const eliminarUsuario = async (usuario) => {
    if (!usuario) {
      cerrarModales();
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://127.0.0.1:8000/api/users/${usuario.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      console.log("✅ Usuario eliminado:", usuario);

      cerrarModales();
      await recargarUsuarios();
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
        />

        {/* Modal VER USUARIO */}
        {modalVerAbierto && usuarioSeleccionado && (
          <ModalVerUsuario
            usuario={usuarioSeleccionado}
            onCerrar={cerrarModales}
            roles={roles}
          />
        )}

        {/* Modal EDITAR USUARIO */}
        {modalEditarAbierto && usuarioSeleccionado && (
          <ModalEditarUsuario
            usuario={usuarioSeleccionado}
            onGuardar={actualizarUsuario}
            onCerrar={cerrarModales}
            roles={roles}
          />
        )}

        {/* Modal ELIMINAR USUARIO */}
        {modalEliminarAbierto && usuarioSeleccionado && (
          <ModalEliminarUsuario
            usuario={usuarioSeleccionado}
            alConfirmar={eliminarUsuario}
          />
        )}

        {/* Modal AGREGAR USUARIO */}
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