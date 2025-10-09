import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import PrincipalCliente from "./pages/Ventas/Clientes/PrincipalCliente.jsx";
import PrincipalCotizacion from "./pages/Ventas/Cotizador/PrincipalCotizacion.jsx";
import PrincipalPago from "./pages/Ventas/Pagos/PrincipalPago.jsx";
import PrincipalLogin from "./pages/Login/PrincipalLogin.jsx";
import VehiculosPrincipal from "./pages/Operaciones/Vehiculos/VehiculosPrincipal.jsx";

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
          <Route path="/facturas" element={<PaginaTemporal titulo="Facturas" />} />
          <Route path="/recibos" element={<PaginaTemporal titulo="Recibos" />} />
          
          {/* Rutas de Operaciones */}
          <Route path="/orden-servicio" element={<PaginaTemporal titulo="Órdenes de Servicio" />} />
          <Route path="/reservas" element={<PaginaTemporal titulo="Reservas" />} />
          <Route path="/operadores" element={<PaginaTemporal titulo="Operadores" />} />
          <Route path="/vehiculos" element={<VehiculosPrincipal />} />
          <Route path="/guias" element={<PaginaTemporal titulo="Guías" />} />
          <Route path="/proveedores" element={<PaginaTemporal titulo="Proveedores" />} />
          <Route path="/coordinadores" element={<PaginaTemporal titulo="Coordinadores" />} />
          
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