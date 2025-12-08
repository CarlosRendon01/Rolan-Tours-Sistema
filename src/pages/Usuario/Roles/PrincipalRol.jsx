import React, { useState, useEffect } from "react";
import axios from 'axios';
import TablaRoles from "./TablaRoles";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import ModalAgregarRol from "./Modales/ModalAgregarRol";
import ModalVerRol from "./Modales/ModalVerRoles";
import ModalEditarRol from "./Modales/ModalEditarRol";
import ModalEliminarRol from "./Modales/ModalEliminarRol";
import "./PrincipalRol.css";

const RolesPrincipal = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Estados para controlar los modales de ROLES
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);

  useEffect(() => {
    recargarRoles();
    recargarPermisos(); // ⭐ Cargar permisos al iniciar
  }, []);

  const recargarRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });
      setRoles(response.data);
      console.log('✅ Roles recargados');
    } catch (error) {
      console.error('❌ Error al recargar roles:', error);
    }
  };

  const recargarPermisos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/permissions", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });
      setPermissions(response.data);
      console.log('✅ Permisos cargados');
    } catch (error) {
      console.error('❌ Error al cargar permisos:', error);
    }
  };

  const transformarPermisosAIds = (permisos) => {
    const ids = [];

    Object.entries(permisos).forEach(([moduloKey, moduloData]) => {
      if (moduloData.activo) {
        // Si tiene submódulos
        if (moduloData.modulos) {
          Object.entries(moduloData.modulos).forEach(([subKey, subData]) => {
            if (subData.ver) ids.push(obtenerIdPermiso(`${moduloKey}.${subKey}.ver`));
            if (subData.editar) ids.push(obtenerIdPermiso(`${moduloKey}.${subKey}.editar`));
            if (subData.eliminar) ids.push(obtenerIdPermiso(`${moduloKey}.${subKey}.eliminar`));
          });
        } else {
          // Módulo sin submódulos
          if (moduloData.ver) ids.push(obtenerIdPermiso(`${moduloKey}.ver`));
          if (moduloData.editar) ids.push(obtenerIdPermiso(`${moduloKey}.editar`));
          if (moduloData.eliminar) ids.push(obtenerIdPermiso(`${moduloKey}.eliminar`));
        }
      }
    });

    return ids.filter(id => id !== null); // Filtrar IDs no encontrados
  };

  // ⭐ NUEVA FUNCIÓN: Mapear nombre de permiso a ID
  const obtenerIdPermiso = (nombrePermiso) => {
    const permiso = permissions.find(p => p.nombre === nombrePermiso);
    return permiso ? permiso.id : null;
  };

  // Funciones para manejar los modales de ROLES
  const manejarVer = (rol) => {
    setRolSeleccionado(rol);
    setModalVerAbierto(true);
    console.log("Ver rol:", rol);
  };

  const manejarEditar = (rol) => {
    setRolSeleccionado(rol);
    setModalEditarAbierto(true);
    console.log("Editar rol:", rol);
  };

  const manejarEliminar = (rol) => {
    setRolSeleccionado(rol);
    setModalEliminarAbierto(true);
    console.log("Eliminar rol:", rol);
  };

  const manejarAgregar = () => {
    setModalAgregarAbierto(true);
    console.log("Agregar nuevo rol");
  };

  // Función para cerrar modales
  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalEditarAbierto(false);
    setModalEliminarAbierto(false);
    setModalAgregarAbierto(false);
    setRolSeleccionado(null);
  };

  // Función para agregar rol
  const agregarRol = async (nuevoRol) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Crear el rol básico
      const rolData = {
        nombre: nuevoRol.nombre,
        descripcion: nuevoRol.descripcion || null,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/roles",
        rolData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      console.log("✅ Rol creado:", response.data);

      // 2. Transformar permisos y asignar
      const permissionIds = transformarPermisosAIds(nuevoRol.permisos);

      if (permissionIds.length > 0) {
        await axios.post(
          `http://127.0.0.1:8000/api/roles/${response.data.data.id}/permissions`,
          { permission_ids: permissionIds },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            }
          }
        );
        console.log("✅ Permisos asignados:", permissionIds);
      }

      cerrarModales();
      await recargarRoles();
    } catch (error) {
      console.error("❌ Error al crear rol:", error);
      alert("Error al crear rol: " + (error.response?.data?.message || error.message));
    }
  };

  const actualizarRol = async (rolActualizado) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Actualizar datos básicos del rol
      const rolData = {
        nombre: rolActualizado.nombre, // ⭐ Cambio: era nombre_rol
        descripcion: rolActualizado.descripcion || null,
      };

      const response = await axios.put(
        `http://127.0.0.1:8000/api/roles/${rolActualizado.id}`, // ⭐ Cambio: era id_rol
        rolData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      console.log("✅ Rol actualizado:", response.data);

      // 2. Transformar y actualizar permisos
      const permissionIds = transformarPermisosAIds(rolActualizado.permisos);

      await axios.post(
        `http://127.0.0.1:8000/api/roles/${rolActualizado.id}/permissions`, // ⭐ Cambio: era id_rol
        { permission_ids: permissionIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );
      console.log("✅ Permisos actualizados:", permissionIds);

      cerrarModales();
      await recargarRoles();
    } catch (error) {
      console.error("❌ Error al actualizar rol:", error);
      alert("Error al actualizar rol: " + (error.response?.data?.message || error.message));
    }
  };

  const eliminarRol = async (rol) => {
    if (!rol) {
      cerrarModales();
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Llamada DELETE al backend
      await axios.delete(
        `http://127.0.0.1:8000/api/roles/${rol.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      console.log("✅ Rol eliminado:", rol);

      // Cerrar modal primero
      cerrarModales();

      // Recargar roles después de eliminar
      await recargarRoles();

    } catch (error) {
      console.error("❌ Error al eliminar rol:", error);
      cerrarModales();
    }
  };

  return (
    <PrincipalComponente>
      <div className="roles-principal">
        <TablaRoles
          roles={roles}
          setRoles={setRoles}
          onVer={manejarVer}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
          onAgregar={manejarAgregar}
        />

        {/* Modal VER ROL */}
        {modalVerAbierto && rolSeleccionado && (
          <ModalVerRol rol={rolSeleccionado} onCerrar={cerrarModales} />
        )}

        {/* Modal EDITAR ROL */}
        {modalEditarAbierto && rolSeleccionado && (
          <ModalEditarRol
            rol={rolSeleccionado}
            onGuardar={actualizarRol}
            onCerrar={cerrarModales}
            permissions={permissions}
            recargarPermisos={recargarPermisos}
          />
        )}

        {/* Modal ELIMINAR ROL */}
        {modalEliminarAbierto && rolSeleccionado && (
          <ModalEliminarRol rol={rolSeleccionado} alConfirmar={eliminarRol} />
        )}

        {/* Modal AGREGAR ROL */}
        {modalAgregarAbierto && (
          <ModalAgregarRol onGuardar={agregarRol} onCerrar={cerrarModales} permissions={permissions}
            recargarPermisos={recargarPermisos} />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default RolesPrincipal;