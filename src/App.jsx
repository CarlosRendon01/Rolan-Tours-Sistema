import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import PrincipalCliente from "./pages/Ventas/Clientes/PrincipalCliente.jsx";
import PrincipalCotizacion from "./pages/Ventas/Cotizador/PrincipalCotizacion.jsx";
import PrincipalPago from "./pages/Ventas/Pagos/PrincipalPago.jsx";
import PrincipalLogin from "./pages/Login/PrincipalLogin.jsx";
import VehiculosPrincipal from "./pages/Operaciones/Vehiculos/VehiculosPrincipal.jsx";
import OperadoresPrincipal from "./pages/Operaciones/Operadores/OperadoresPrincipal.jsx";
import GuiasPrincipal from "./pages/Operaciones/Guias/GuiasPrincipal.jsx";
import PrincipalOrden from "./pages/Documentos/OrdenServicio/PrincipalOrden.jsx";
import PrincipalContrato from "./pages/Documentos/Contratos/PrincipalContrato.jsx";
import ReservasPrincipal from "./pages/Documentos/Reservas/ReservasPrincipal.jsx";
// Componente temporal para páginas vacías
const PaginaTemporal = ({ titulo }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "24px",
        color: "#666",
      }}
    >
      <h1>{titulo}</h1>
    </div>
  );
};

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  const manejarLogin = () => {
    setEstaAutenticado(true);
  };

  return (
    <Router>
      {!estaAutenticado ? (
        <PrincipalLogin onLogin={manejarLogin} />
      ) : (
        <Routes>
          {/* Rutas existentes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<PrincipalCliente />} />
          <Route path="/cotizaciones" element={<PrincipalCotizacion />} />
          <Route path="/pagos" element={<PrincipalPago />} />

          {/* Rutas de Documentos */}
          <Route
            path="/contratos"
            element={<PrincipalContrato titulo="Contratos" />}
          />
          <Route
            path="/orden-servicio"
            element={<PrincipalOrden titulo="Órdenes de Servicio" />}
          />
          <Route
            path="/reservas"
            element={<ReservasPrincipal titulo="Reservas" />}
          />

          {/* Rutas de Operaciones */}

          <Route path="/operadores" element={<OperadoresPrincipal />} />
          <Route path="/vehiculos" element={<VehiculosPrincipal />} />
          <Route path="/guias" element={<GuiasPrincipal />} />
          <Route
            path="/proveedores"
            element={<PaginaTemporal titulo="Proveedores" />}
          />
          <Route
            path="/coordinadores"
            element={<PaginaTemporal titulo="Coordinadores" />}
          />

          {/* Rutas de Servicios */}
          <Route
            path="/transporte"
            element={<PaginaTemporal titulo="Transporte" />}
          />
          <Route
            path="/restaurantes"
            element={<PaginaTemporal titulo="Restaurantes" />}
          />
          <Route path="/tours" element={<PaginaTemporal titulo="Tours" />} />
          <Route
            path="/hospedaje"
            element={<PaginaTemporal titulo="Hospedaje" />}
          />

          {/* Rutas de Mantenimiento */}
          <Route
            path="/mantenimiento-vehiculos"
            element={<PaginaTemporal titulo="Mantenimiento de Vehículos" />}
          />

          {/* Ruta de Administración */}
          <Route
            path="/administracion"
            element={<PaginaTemporal titulo="Administración" />}
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
