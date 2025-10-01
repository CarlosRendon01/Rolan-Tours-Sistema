import React, { useCallback, useState } from "react";
import NuevaCotizacion from "./Componentes/nuevaCotizacion";
import TablaCotizacion from "./Componentes/tablaCotizacion";
import "./Componentes/nuevaCotizacion.css";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import "./cotizaciones.css";

const Cotizacion = () => {
  const [cotizaciones, setCotizaciones] = useState([]);

  const [cotizacionEditar, setCotizacionEditar] = useState(null);

  const handleGuardarCotizacion = useCallback(
    (nuevaCotizacion, esEdicion = false) => {
      if (esEdicion) {
        setCotizaciones((prev) =>
          prev.map((cot) =>
            cot.id === nuevaCotizacion.id ? nuevaCotizacion : cot
          )
        );
        setCotizacionEditar(null);
        console.log("Cotización actualizada:", nuevaCotizacion);
      } else {
        setCotizaciones((prev) => [...prev, nuevaCotizacion]);
        console.log("Nueva cotización agregada:", nuevaCotizacion);
      }
    },
    []
  );

  const handleEditarCotizacion = useCallback((cotizacion) => {
    setCotizacionEditar(cotizacion);
    console.log("Editando cotización:", cotizacion);
  }, []);

  const handleCancelarEdicion = useCallback(() => {
    setCotizacionEditar(null);
  }, []);

  const handleEliminarCotizacion = useCallback((id) => {
    const cotizacionAEliminar = cotizaciones.find((cot) => cot.id === id);
    const folio = cotizacionAEliminar?.folio || id;

    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar la cotización ${folio}?`
      )
    ) {
      setCotizaciones((prev) => prev.filter((cot) => cot.id !== id));
      console.log("Cotización eliminada con ID:", id);
    }
  }, []);

  return (
    <div className="cotizacion-container">
      <div className="cotizacion-header">
        <h1>Cotizaciones</h1>
      </div>

      <div className="cotizacion-layout">
        <div className="nueva-cotizacion-section">
          <NuevaCotizacion
            onGuardarCotizacion={handleGuardarCotizacion}
            cotizacionEditar={cotizacionEditar}
            onCancelarEdicion={handleCancelarEdicion}
          />
        </div>

        <div className="tabla-cotizacion-section">
          <TablaCotizacion
            cotizaciones={cotizaciones}
            onEditar={handleEditarCotizacion}
            onEliminar={handleEliminarCotizacion}
          />
        </div>
      </div>
    </div>
  );
};

export default Cotizacion;
