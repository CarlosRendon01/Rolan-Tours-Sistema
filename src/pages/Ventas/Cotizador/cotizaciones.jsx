import React, { useState } from "react";
import NuevaCotizacion from "./Componentes/nuevaCotizacion";
import TablaCotizacion from "./Componentes/tablaCotizacion";
import "./Componentes/nuevaCotizacion.css";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import "./cotizaciones.css";
//hola
const Cotizacion = () => {
  // Estado para almacenar todas las cotizaciones
  const [cotizaciones, setCotizaciones] = useState([]);

  // Estado para manejar la cotización que se está editando
  const [cotizacionEditar, setCotizacionEditar] = useState(null);

  // Función para guardar o actualizar una cotización
  const handleGuardarCotizacion = (nuevaCotizacion, esEdicion = false) => {
    if (esEdicion) {
      // Actualizar cotización existente
      setCotizaciones((prev) =>
        prev.map((cot) =>
          cot.id === nuevaCotizacion.id ? nuevaCotizacion : cot
        )
      );
      setCotizacionEditar(null); // Limpiar estado de edición
      console.log("Cotización actualizada:", nuevaCotizacion);
    } else {
      // Agregar nueva cotización
      setCotizaciones((prev) => [...prev, nuevaCotizacion]);
      console.log("Nueva cotización agregada:", nuevaCotizacion);
    }
  };

  // Función para iniciar la edición de una cotización
  const handleEditarCotizacion = (cotizacion) => {
    setCotizacionEditar(cotizacion);
    console.log("Editando cotización:", cotizacion);
  };

  // Función para cancelar la edición
  const handleCancelarEdicion = () => {
    setCotizacionEditar(null);
  };

  // Función para eliminar una cotización
  const handleEliminarCotizacion = (id) => {
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
  };

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
