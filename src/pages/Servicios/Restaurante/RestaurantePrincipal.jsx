import React, { useState } from "react";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaRestaurante from "./Componentes/TablaRestaurante";
import ModalAgregarRestaurante from "./ModalesRestaurante/ModalAgregarRestaurante";
import ModalEditarRestaurante from "./ModalesRestaurante/ModalEditarRestaurante";
import ModalVerRestaurante from "./ModalesRestaurante/ModalVerRestaurante";
import { modalEliminarRestaurante } from "./ModalesRestaurante/ModalEliminarRestaurante"; // ✅ IMPORTAR AQUÍ
import "./RestaurantePrincipal.css";

const RestaurantePrincipal = () => {
  // Estado principal
  const [restaurantes, setRestaurantes] = useState([
    {
      id: 1,
      codigo_servicio: "REST-DES-001",
      nombre_servicio: "Desayuno Continental Buffet",
      tipo_servicio: "Desayuno",
      categoria: "Buffet",
      descripcion_servicio:
        "Desayuno buffet estilo continental con variedad de panes, frutas frescas, cereales, jugos naturales, café y té. Incluye estación de huevos preparados al momento.",
      capacidad: 50,
      tipo_paquete: "Por persona",
      duracion_paquete: "2 horas",
      precio_base: 180.0,
      moneda: "MXN",
      incluye:
        "Buffet completo, bebidas ilimitadas (café, té, jugo), estación de huevos, pan recién horneado",
      restricciones:
        "Horario: 7:00 AM - 11:00 AM, menores de 5 años sin costo, reservación mínima 24 hrs antes",
      empresa_proveedora_id: 1,
      nombre_proveedor: "Restaurante La Aurora",
      ubicacion_restaurante: "Av. Juárez #123, Centro Histórico",
      horario_servicio: "07:00 - 11:00 hrs",
      disponibilidad: true,
      foto_servicio: "https://example.com/desayuno-buffet.jpg",
      estado: "Activo",
      fecha_registro: "2025-01-10",
    },
    {
      id: 2,
      codigo_servicio: "REST-COM-002",
      nombre_servicio: "Comida Ejecutiva Gourmet",
      tipo_servicio: "Comida",
      categoria: "Gourmet",
      descripcion_servicio:
        "Menú de 3 tiempos elaborado por chef especializado. Incluye entrada, plato fuerte a elegir entre 3 opciones, postre y bebida. Presentación elegante en vajilla de porcelana.",
      capacidad: 30,
      tipo_paquete: "Por persona",
      duracion_paquete: "3 tiempos",
      precio_base: 350.0,
      moneda: "MXN",
      incluye:
        "Entrada del día, plato fuerte (carne, pollo o pescado), postre, bebida (refresco o agua), pan artesanal",
      restricciones:
        "Solo de lunes a viernes, horario 13:00 - 17:00 hrs, reservación con 48 hrs de anticipación, menú sujeto a disponibilidad",
      empresa_proveedora_id: 2,
      nombre_proveedor: "El Bistró Francés",
      ubicacion_restaurante: "Plaza Comercial Norte, Local 45",
      horario_servicio: "13:00 - 17:00 hrs",
      disponibilidad: true,
      foto_servicio: "https://example.com/comida-gourmet.jpg",
      estado: "Activo",
      fecha_registro: "2025-01-15",
    },
    {
      id: 3,
      codigo_servicio: "REST-CEN-003",
      nombre_servicio: "Cena Romántica para Dos",
      tipo_servicio: "Cena",
      categoria: "Gourmet",
      descripcion_servicio:
        "Experiencia gastronómica romántica con mesa decorada, música en vivo y menú especial de 5 tiempos. Incluye maridaje de vinos premium seleccionados por sommelier.",
      capacidad: 2,
      tipo_paquete: "Por grupo",
      duracion_paquete: "Experiencia completa",
      precio_base: 1500.0,
      moneda: "MXN",
      incluye:
        "Mesa decorada, música en vivo, menú 5 tiempos, maridaje de vinos, postre especial, fotografía de cortesía",
      restricciones:
        "Solo disponible viernes y sábados, horario único 20:00 hrs, reservación con 1 semana de anticipación, máximo 2 personas",
      empresa_proveedora_id: 3,
      nombre_proveedor: "La Terraza del Amor",
      ubicacion_restaurante: "Carretera Panorámica km 5",
      horario_servicio: "20:00 - 23:00 hrs",
      disponibilidad: true,
      foto_servicio: "https://example.com/cena-romantica.jpg",
      estado: "Activo",
      fecha_registro: "2025-02-01",
    },
  ]);

  // Estados para los modales
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  // Lista de proveedores
  const proveedores = [
    { id: 1, nombre: "Restaurante La Aurora" },
    { id: 2, nombre: "El Bistró Francés" },
    { id: 3, nombre: "La Terraza del Amor" },
    { id: 4, nombre: "Café Colonial" },
    { id: 5, nombre: "Mariscos El Puerto" },
  ];

  // Manejadores
  const manejarVer = (restaurante) => {
    setRestauranteSeleccionado(restaurante);
    setModalVerAbierto(true);
  };

  const manejarAgregar = () => {
    setModalAgregarAbierto(true);
  };

  const manejarEditar = (restaurante) => {
    setRestauranteSeleccionado(restaurante);
    setModalEditarAbierto(true);
  };

  // ✅ ACTUALIZAR ESTA FUNCIÓN
  const manejarEliminar = async (restaurante) => {
    // Preparar el objeto con el formato que espera el modal
    const restauranteParaModal = {
      nombreRestaurante: restaurante.nombre_servicio,
      tipo: restaurante.categoria === "Buffet" ? "paquete" : "restaurante", // Adaptar según tu lógica
      id: restaurante.id
    };

    // Mostrar modal y esperar confirmación
    const confirmado = await modalEliminarRestaurante(
      restauranteParaModal,
      async (rest) => {
        // Aquí va la lógica de eliminación (llamada a API, etc.)
        // Por ahora solo actualiza el estado local
        setRestaurantes(restaurantes.filter((r) => r.id !== rest.id));
      }
    );

    if (confirmado) {
      console.log("Restaurante eliminado exitosamente");
    } else {
      console.log("Eliminación cancelada");
    }
  };

  const manejarGuardarRestaurante = (nuevoRestaurante) => {
    const restauranteConId = {
      ...nuevoRestaurante,
      id: Date.now(),
      fecha_registro: new Date().toISOString().split("T")[0],
    };

    setRestaurantes([...restaurantes, restauranteConId]);
    cerrarModales();
    console.log("Restaurante agregado:", restauranteConId);
  };

  const manejarActualizarRestaurante = (restauranteActualizado) => {
    setRestaurantes(
      restaurantes.map((r) =>
        r.id === restauranteActualizado.id ? restauranteActualizado : r
      )
    );
    cerrarModales();
    console.log("Restaurante actualizado:", restauranteActualizado);
  };

  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalAgregarAbierto(false);
    setModalEditarAbierto(false);
    setRestauranteSeleccionado(null);
  };

  return (
    <PrincipalComponente>
      <div className="restaurante-principal">
        <TablaRestaurante
          restaurantes={restaurantes}
          onVer={manejarVer}
          onAgregar={manejarAgregar}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
        />

        {/* Modal Agregar */}
        {modalAgregarAbierto && (
          <ModalAgregarRestaurante
            onGuardar={manejarGuardarRestaurante}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}

        {/* Modal Editar */}
        {modalEditarAbierto && restauranteSeleccionado && (
          <ModalEditarRestaurante
            restaurante={restauranteSeleccionado}
            onGuardar={manejarActualizarRestaurante}
            onCerrar={cerrarModales}
            proveedores={proveedores}
          />
        )}

        {/* Modal Ver */}
        {modalVerAbierto && restauranteSeleccionado && (
          <ModalVerRestaurante
            restaurante={restauranteSeleccionado}
            onCerrar={cerrarModales}
          />
        )}

      </div>
    </PrincipalComponente>
  );
};

export default RestaurantePrincipal;