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
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    recargarRoles();
    recargarPermisos();
  }, []);

  const recargarRoles = async () => {
    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No hay token de autenticaciÃ³n");
      }

      const response = await axios.get("http://127.0.0.1:8000/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 10000
      });

      setRoles(response.data);

    } catch (error) {
      console.error('âŒ Error al recargar roles:', error);

      if (error.code === 'ECONNABORTED') {
        setError('La conexiÃ³n tardÃ³ demasiado. Verifica tu servidor.');
      } else if (error.response) {
        setError(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Verifica que estÃ© corriendo.');
      } else {
        setError(error.message);
      }
    } finally {
      setCargando(false);
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
    } catch (error) {
      console.error('âŒ Error al cargar permisos:', error);
    }
  };

  const transformarPermisosAIds = (permisos) => {
    const ids = [];

    Object.entries(permisos).forEach(([moduloKey, moduloData]) => {
      if (moduloData.activo) {
        if (moduloData.modulos) {
          Object.entries(moduloData.modulos).forEach(([subKey, subData]) => {
            if (subData.ver) ids.push(obtenerIdPermiso(`${moduloKey}.${subKey}.ver`));
            if (subData.editar) ids.push(obtenerIdPermiso(`${moduloKey}.${subKey}.editar`));
            if (subData.eliminar) ids.push(obtenerIdPermiso(`${moduloKey}.${subKey}.eliminar`));
          });
        } else {
          if (moduloData.ver) ids.push(obtenerIdPermiso(`${moduloKey}.ver`));
          if (moduloData.editar) ids.push(obtenerIdPermiso(`${moduloKey}.editar`));
          if (moduloData.eliminar) ids.push(obtenerIdPermiso(`${moduloKey}.eliminar`));
        }
      }
    });

    return ids.filter(id => id !== null);
  };

  const obtenerIdPermiso = (nombrePermiso) => {
    const permiso = permissions.find(p => p.nombre === nombrePermiso);
    return permiso ? permiso.id : null;
  };

  const manejarVer = (rol) => {
    setRolSeleccionado(rol);
    setModalVerAbierto(true);
  };

  const manejarEditar = (rol) => {
    setRolSeleccionado(rol);
    setModalEditarAbierto(true);
  };

  const manejarEliminar = (rol) => {
    setRolSeleccionado(rol);
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
    setRolSeleccionado(null);
  };

  const agregarRol = async (nuevoRol) => {
    try {
      const token = localStorage.getItem("token");

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
      }

      cerrarModales();
      await recargarRoles();
    } catch (error) {
      console.error("âŒ Error al crear rol:", error);
      alert("Error al crear rol: " + (error.response?.data?.message || error.message));
    }
  };

  const actualizarRol = async (rolActualizado) => {
    try {
      const token = localStorage.getItem("token");

      const rolData = {
        nombre: rolActualizado.nombre,
        descripcion: rolActualizado.descripcion || null,
      };

      const response = await axios.put(
        `http://127.0.0.1:8000/api/roles/${rolActualizado.id}`,
        rolData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );


      const permissionIds = transformarPermisosAIds(rolActualizado.permisos);

      await axios.post(
        `http://127.0.0.1:8000/api/roles/${rolActualizado.id}/permissions`,
        { permission_ids: permissionIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      cerrarModales();
      await recargarRoles();
    } catch (error) {
      console.error("âŒ Error al actualizar rol:", error);
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

      await axios.delete(
        `http://127.0.0.1:8000/api/roles/${rol.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      cerrarModales();
      await recargarRoles();

    } catch (error) {
      console.error("âŒ Error al eliminar rol:", error);
      cerrarModales();
    }
  };

  if (error) {
    return (
      <PrincipalComponente>
        <div className="roles-error-container">
          <div className="roles-error-box">
            <h2 className="roles-error-title">
              âŒ Error al cargar roles
            </h2>
            <p className="roles-error-message">
              {error}
            </p>
            <button
              onClick={recargarRoles}
              className="roles-error-button"
            >
              ðŸ”„ Reintentar
            </button>
          </div>
        </div>
      </PrincipalComponente>
    );
  }

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
          cargando={cargando}
          onRecargar={recargarRoles}
        />

        {modalVerAbierto && rolSeleccionado && (
          <ModalVerRol rol={rolSeleccionado} onCerrar={cerrarModales} />
        )}

        {modalEditarAbierto && rolSeleccionado && (
          <ModalEditarRol
            rol={rolSeleccionado}
            onGuardar={actualizarRol}
            onCerrar={cerrarModales}
            permissions={permissions}
            recargarPermisos={recargarPermisos}
          />
        )}

        {modalEliminarAbierto && rolSeleccionado && (
          <ModalEliminarRol rol={rolSeleccionado} alConfirmar={eliminarRol} />
        )}

        {modalAgregarAbierto && (
          <ModalAgregarRol
            onGuardar={agregarRol}
            onCerrar={cerrarModales}
            permissions={permissions}
            recargarPermisos={recargarPermisos}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default RolesPrincipal;