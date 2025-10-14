import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import PrincipalCliente from "./pages/Ventas/Clientes/PrincipalCliente.jsx";
import PrincipalCotizacion from "./pages/Ventas/Cotizador/PrincipalCotizacion.jsx";
import PrincipalPago from "./pages/Ventas/Pagos/PrincipalPago.jsx";
import PrincipalLogin from "./pages/Login/PrincipalLogin.jsx";

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  const manejarLogin = () => {
    setEstaAutenticado(true);
  };

  return (
    <Router>
      {!estaAutenticado ? (
        // Mostrar login DENTRO del Router
        <PrincipalLogin onLogin={manejarLogin} />
      ) : (
        // Mostrar aplicación normal
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<PrincipalCliente />} />
          <Route path="/cotizaciones" element={<PrincipalCotizacion />} />
          <Route path="/pagos" element={<PrincipalPago />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;