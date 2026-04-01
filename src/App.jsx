import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import useInactividad from "./hooks/useInactividad.js";
import axios from 'axios';
import { API_CONFIG } from './config/api'
import ProtectedRoute from "./components/ProtectedRoute";
import AccesoDenegado from "./pages/AccesoDenegado";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import PrincipalCliente from "./pages/Ventas/Clientes/PrincipalCliente.jsx";
import PrincipalCotizacion from "./pages/Ventas/Cotizador/PrincipalCotizacion.jsx";
import PrincipalPago from "./pages/Ventas/Pagos/PrincipalPago.jsx";
import PrincipalLogin from "./pages/Login/PrincipalLogin.jsx";
import OperadoresPrincipal from "./pages/Operaciones/Operadores/OperadoresPrincipal.jsx";
import GuiasPrincipal from "./pages/Operaciones/Guias/GuiasPrincipal.jsx";
import PrincipalOrden from "./pages/Documentos/OrdenServicio/PrincipalOrden.jsx";
import PrincipalContrato from "./pages/Documentos/Contratos/PrincipalContrato.jsx";
import ReservasPrincipal from "./pages/Documentos/Reservas/ReservasPrincipal.jsx";
import ProveedoresPrincipal from "./pages/Operaciones/Proveedores/ProveedoresPrincipal.jsx";
import CoordinadoresPrincipal from "./pages/Operaciones/Coordinadores/CoordinadoresPrincipal.jsx";
import TransportePrincipal from "./pages/Servicios/Transporte/TransportePrincipal.jsx";
import ToursPrincipal from "./pages/Servicios/Tours/ToursPrincipal.jsx";
import RestaurantePrincipal from "./pages/Servicios/Restaurante/RestaurantePrincipal.jsx";
import HospedajePrincipal from "./pages/Servicios/Hospedaje/HospedajePrincipal.jsx";
import MantenimientoPrincipal from "./pages/Mantenimiento/MantenimientoPrincipal.jsx";
import PrincipalRol from "./pages/Usuario/Roles/PrincipalRol.jsx";
import PrincipalUsuario from "./pages/Usuario/Usuarios/PrincipalUsuario.jsx";
import VehiculosPrincipal from "./pages/Operaciones/Vehiculos/VehiculosPrincipal.jsx";

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setEstaAutenticado(true);
    }
  }, []);

  const manejarLogin = () => {
    setEstaAutenticado(true);
  };

  const manejarLogout = useCallback(async () => {
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/logout`);
    } catch (_) {
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rol');
      setEstaAutenticado(false);
    }
  }, []);

  useInactividad(estaAutenticado ? manejarLogout : null);

  return (
    <Router>
      {!estaAutenticado ? (
        <Routes>
          <Route path="*" element={<PrincipalLogin onLogin={manejarLogin} />} />
        </Routes>
      ) : (
        <Routes>
          {/* Dashboard - Accesible para todos */}
          <Route
            path="/"
            element={
              <ProtectedRoute requiredPermission="dashboard.ver">
                <Dashboard onLogout={manejarLogout} />
              </ProtectedRoute>
            }
          />

          {/* VENTAS */}
          <Route
            path="/clientes"
            element={
              <ProtectedRoute requiredPermission="ventas.clientes.ver">
                <PrincipalCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cotizaciones"
            element={
              <ProtectedRoute requiredPermission="ventas.cotizaciones.ver">
                <PrincipalCotizacion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pagos"
            element={
              <ProtectedRoute requiredPermission="ventas.pagos.ver">
                <PrincipalPago />
              </ProtectedRoute>
            }
          />

          {/* DOCUMENTOS */}
          <Route
            path="/contratos"
            element={
              <ProtectedRoute requiredPermission="documentos.contratos.ver">
                <PrincipalContrato titulo="Contratos" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orden-servicio"
            element={
              <ProtectedRoute requiredPermission="documentos.ordenes.ver">
                <PrincipalOrden titulo="Órdenes de Servicio" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas"
            element={
              <ProtectedRoute requiredPermission="documentos.reservas.ver">
                <ReservasPrincipal titulo="Reservas" />
              </ProtectedRoute>
            }
          />

          {/* OPERACIONES */}
          <Route
            path="/operadores"
            element={
              <ProtectedRoute requiredPermission="operaciones.operadores.ver">
                <OperadoresPrincipal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehiculos"
            element={
              <ProtectedRoute requiredPermission="operaciones.vehiculos.ver">
                <VehiculosPrincipal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guias"
            element={
              <ProtectedRoute requiredPermission="operaciones.guias.ver">
                <GuiasPrincipal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores"
            element={
              <ProtectedRoute>
                <ProveedoresPrincipal titulo="Proveedores" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinadores"
            element={
              <ProtectedRoute>
                <CoordinadoresPrincipal titulo="Coordinadores" />
              </ProtectedRoute>
            }
          />

          {/* SERVICIOS */}
          <Route
            path="/transporte"
            element={
              <ProtectedRoute requiredPermission="servicios.transporte.ver">
                <TransportePrincipal titulo="Transporte" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurantes"
            element={
              <ProtectedRoute requiredPermission="servicios.restaurantes.ver">
                <RestaurantePrincipal titulo="Restaurantes" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tours"
            element={
              <ProtectedRoute requiredPermission="servicios.tours.ver">
                <ToursPrincipal titulo="Tours" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospedaje"
            element={
              <ProtectedRoute requiredPermission="servicios.hospedaje.ver">
                <HospedajePrincipal titulo="Hospedaje" />
              </ProtectedRoute>
            }
          />

          {/* MANTENIMIENTO */}
          <Route
            path="/mantenimiento-vehiculos"
            element={
              <ProtectedRoute requiredPermission="mantenimiento.ver">
                <MantenimientoPrincipal titulo="Mantenimiento de Vehículos" />
              </ProtectedRoute>
            }
          />

          {/* ADMINISTRACIÓN */}
          <Route
            path="/roles"
            element={
              <ProtectedRoute requiredPermission="administracion.roles.ver">
                <PrincipalRol titulo="Roles" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute requiredPermission="administracion.usuarios.ver">
                <PrincipalUsuario titulo="Usuarios" />
              </ProtectedRoute>
            }
          />

          {/* Acceso Denegado */}
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* Ruta por defecto - redirige al dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;