import React, { useState } from "react";
import TablaRoles from "./TablaRoles";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import ModalAgregarRol from "./Modales/ModalAgregarRol";
import ModalVerRol from "./Modales/ModalVerRoles";
import ModalEditarRol from "./Modales/ModalEditarRol";
import ModalEliminarRol from "./Modales/ModalEliminarRol";
import ModalAgregarUsuarios from "./Modales/ModalAgregarUsuario";
import ModalEditarUsuario from "./Modales/ModalEditarUsuario";
import ModalVerUsuario from "./Modales/ModalVerUsuarios";
import ModalEliminarUsuario from "./Modales/ModalEliminarUsuario";
import "./PrincipalRol.css";

const RolesPrincipal = () => {
  // Estado para almacenar los roles con 3 ejemplos
  const [roles, setRoles] = useState([
    {
      id_rol: 1,
      nombre_rol: "Administrador General",
      descripcion:
        "Acceso completo al sistema con permisos de administración total",
      nivel_acceso: "Completo",
      usuarios_asignados: 3,
      icono_rol: null,
      permisos: {
        dashboard: true,
        ventas: true,
        documentos: true,
        operaciones: true,
        servicios: true,
        mantenimiento: true,
        administracion: true,
      },
      estado: "activo",
    },
    {
      id_rol: 2,
      nombre_rol: "Supervisor de Ventas",
      descripcion:
        "Gestión y supervisión de ventas, reportes y documentación relacionada",
      nivel_acceso: "Ver/Editar",
      usuarios_asignados: 8,
      icono_rol: null,
      permisos: {
        dashboard: true,
        ventas: true,
        documentos: true,
        operaciones: false,
        servicios: false,
        mantenimiento: false,
        administracion: false,
      },
      estado: "activo",
    },
    {
      id_rol: 3,
      nombre_rol: "Operador de Servicio",
      descripcion:
        "Acceso básico para operaciones diarias y servicios al cliente",
      nivel_acceso: "Solo Ver",
      usuarios_asignados: 15,
      icono_rol: null,
      permisos: {
        dashboard: true,
        ventas: false,
        documentos: true,
        operaciones: true,
        servicios: true,
        mantenimiento: false,
        administracion: false,
      },
      estado: "activo",
    },
  ]);

  // Estado para almacenar usuarios con ejemplos
  const [usuarios, setUsuarios] = useState([
    {
      id_usuario: 1,
      nombre: "Juan",
      apellido_paterno: "Pérez",
      apellido_materno: "García",
      email: "juan.perez@empresa.com",
      telefono: "5551234567",
      genero: "Masculino",
      puesto: "Gerente de Ventas",
      rol_id: 2,
      foto: null,
      estado: "activo",
    },
    {
      id_usuario: 2,
      nombre: "María",
      apellido_paterno: "López",
      apellido_materno: "Martínez",
      email: "maria.lopez@empresa.com",
      telefono: "5559876543",
      genero: "Femenino",
      puesto: "Coordinadora de Servicios",
      rol_id: 3,
      foto: null,
      estado: "activo",
    },
    {
      id_usuario: 3,
      nombre: "Carlos",
      apellido_paterno: "Rodríguez",
      apellido_materno: "Sánchez",
      email: "carlos.rodriguez@empresa.com",
      telefono: "5554567890",
      genero: "Masculino",
      puesto: "Administrador General",
      rol_id: 1,
      foto: null,
      estado: "activo",
    },
  ]);

  // Estados para controlar los modales de ROLES
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);

  // Estados para controlar los modales de USUARIOS
  const [modalAgregarUsuarioAbierto, setModalAgregarUsuarioAbierto] =
    useState(false);
  const [modalEditarUsuarioAbierto, setModalEditarUsuarioAbierto] =
    useState(false);
  const [modalVerUsuarioAbierto, setModalVerUsuarioAbierto] = useState(false);
  const [modalEliminarUsuarioAbierto, setModalEliminarUsuarioAbierto] =
    useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

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

  // Funciones para manejar los modales de USUARIOS
  const manejarVerUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalVerUsuarioAbierto(true);
    console.log("Ver usuario:", usuario);
  };

  const manejarEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditarUsuarioAbierto(true);
    console.log("Editar usuario:", usuario);
  };

  const manejarEliminarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminarUsuarioAbierto(true);
    console.log("Eliminar usuario:", usuario);
  };

  const manejarAgregarUsuario = () => {
    setModalAgregarUsuarioAbierto(true);
    console.log("Agregar nuevo usuario");
  };

  // Función para cerrar modales
  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalEditarAbierto(false);
    setModalEliminarAbierto(false);
    setModalAgregarAbierto(false);
    setModalAgregarUsuarioAbierto(false);
    setModalEditarUsuarioAbierto(false);
    setModalVerUsuarioAbierto(false);
    setModalEliminarUsuarioAbierto(false);
    setRolSeleccionado(null);
    setUsuarioSeleccionado(null);
  };

  // Función para agregar rol
  const agregarRol = (nuevoRol) => {
    const rolConId = {
      ...nuevoRol,
      id_rol:
        roles.length > 0 ? Math.max(...roles.map((p) => p.id_rol)) + 1 : 1,
      estado: "activo",
    };
    setRoles([...roles, rolConId]);
    console.log("✅ Rol agregado:", rolConId);
  };

  // Función para agregar usuario
  const agregarUsuario = (nuevoUsuario) => {
    const usuarioConId = {
      ...nuevoUsuario,
      id_usuario:
        usuarios.length > 0
          ? Math.max(...usuarios.map((u) => u.id_usuario)) + 1
          : 1,
      estado: "activo",
    };
    setUsuarios([...usuarios, usuarioConId]);
    console.log("✅ Usuario agregado:", usuarioConId);
  };

  // Función para actualizar usuario
  const actualizarUsuario = (usuarioActualizado) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id_usuario === usuarioActualizado.id_usuario ? usuarioActualizado : u
      )
    );
    cerrarModales();
  };

  // Función para actualizar rol
  const actualizarRol = (rolActualizado) => {
    setRoles(
      roles.map((p) =>
        p.id_rol === rolActualizado.id_rol ? rolActualizado : p
      )
    );
    cerrarModales();
  };

  // Función para eliminar rol
  const eliminarRol = async (rol) => {
    if (rol) {
      setRoles(roles.filter((p) => p.id_rol !== rol.id_rol));
      console.log("✅ Rol eliminado:", rol);
    }
    cerrarModales();
  };

  // Función para eliminar usuario
  const eliminarUsuario = async (usuario) => {
    if (usuario) {
      setUsuarios(usuarios.filter((u) => u.id_usuario !== usuario.id_usuario));
      console.log("✅ Usuario eliminado:", usuario);
    }
    cerrarModales();
  };

  return (
    <PrincipalComponente>
      <div className="roles-principal">
        <TablaRoles
          roles={roles}
          usuarios={usuarios}
          setRoles={setRoles}
          setUsuarios={setUsuarios}
          onVer={manejarVer}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
          onAgregar={manejarAgregar}
          onVerUsuario={manejarVerUsuario}
          onEditarUsuario={manejarEditarUsuario}
          onEliminarUsuario={manejarEliminarUsuario}
          onAgregarUsuario={manejarAgregarUsuario}
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
          />
        )}

        {/* Modal ELIMINAR ROL */}
        {modalEliminarAbierto && rolSeleccionado && (
          <ModalEliminarRol rol={rolSeleccionado} alConfirmar={eliminarRol} />
        )}

        {/* Modal AGREGAR ROL */}
        {modalAgregarAbierto && (
          <ModalAgregarRol onGuardar={agregarRol} onCerrar={cerrarModales} />
        )}

        {/* Modal AGREGAR USUARIO */}
        {modalAgregarUsuarioAbierto && (
          <ModalAgregarUsuarios
            onGuardar={agregarUsuario}
            onCerrar={cerrarModales}
            roles={roles}
          />
        )}

        {/* Modal EDITAR USUARIO */}
        {modalEditarUsuarioAbierto && usuarioSeleccionado && (
          <ModalEditarUsuario
            usuario={usuarioSeleccionado}
            onGuardar={actualizarUsuario}
            onCerrar={cerrarModales}
            roles={roles}
          />
        )}

        {/* Modal VER USUARIO */}
        {modalVerUsuarioAbierto && usuarioSeleccionado && (
          <ModalVerUsuario
            usuario={usuarioSeleccionado}
            onCerrar={cerrarModales}
            roles={roles}
          />
        )}

        {/* Modal ELIMINAR USUARIO */}
        {modalEliminarUsuarioAbierto && usuarioSeleccionado && (
          <ModalEliminarUsuario
            usuario={usuarioSeleccionado}
            alConfirmar={eliminarUsuario}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default RolesPrincipal;
