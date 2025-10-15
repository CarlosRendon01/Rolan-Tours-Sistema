import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import PrincipalCliente from "./pages/Ventas/Clientes/PrincipalCliente.jsx";
import PrincipalCotizacion from "./pages/Ventas/Cotizador/PrincipalCotizacion.jsx";
import PrincipalPago from "./pages/Ventas/Pagos/PrincipalPago.jsx";
import PrincipalLogin from "./pages/Login/PrincipalLogin.jsx";
import VehiculosPrincipal from "./pages/Operaciones/Vehiculos/VehiculosPrincipal.jsx";
import OperadoresPrincipal from "./pages/Operaciones/Operadores/OperadoresPrincipal.jsx"
import GuiasPrincipal from './pages/Operaciones/Guias/GuiasPrincipal.jsx';
import ProveedoresPrincipal from './pages/Operaciones/Proveedores/ProveedoresPrincipal.jsx'
import CoordinadoresPrincipal from './pages/Operaciones/Coordinadores/CoordinadoresPrincipal.jsx'
// Componente temporal para páginas vacías
const PaginaTemporal = ({ titulo }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px',
      color: '#666'
    }}>
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
          <Route path="/contratos" element={<PaginaTemporal titulo="Contratos" />} />
          <Route path="/orden-servicio" element={<PaginaTemporal titulo="Órdenes de Servicio" />} />
          <Route path="/reservas" element={<PaginaTemporal titulo="Reservas" />} />
          
          {/* Rutas de Operaciones */}
          
          <Route path="/operadores" element={<OperadoresPrincipal/>} />
          <Route path="/vehiculos" element={<VehiculosPrincipal />} />
          <Route path="/guias" element={<GuiasPrincipal/>} />
          <Route path="/proveedores" element={<ProveedoresPrincipal/>} />
          <Route path="/coordinadores" element={<CoordinadoresPrincipal />} />
          
          {/* Rutas de Servicios */}
          <Route path="/transporte" element={<PaginaTemporal titulo="Transporte" />} />
          <Route path="/restaurantes" element={<PaginaTemporal titulo="Restaurantes" />} />
          <Route path="/tours" element={<PaginaTemporal titulo="Tours" />} />
          <Route path="/hospedaje" element={<PaginaTemporal titulo="Hospedaje" />} />
          
          {/* Rutas de Mantenimiento */}
          <Route path="/mantenimiento-vehiculos" element={<PaginaTemporal titulo="Mantenimiento de Vehículos" />} />
          
          {/* Ruta de Administración */}
          <Route path="/administracion" element={<PaginaTemporal titulo="Administración" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;