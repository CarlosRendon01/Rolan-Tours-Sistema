import React, { useState } from "react";
import TablaReservas from "./Componentes/TablaReservas";
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import "./ReservasPrincipal.css";
import ModalVerReserva from "./ModalesReservas/ModalVerReserva";
import ModalEditarReserva from "./ModalesReservas/ModalEditarReserva";
import { modalEliminarReserva } from "./ModalesReservas/ModalEliminarReserva";

const ReservasPrincipal = () => {
  // Estado para almacenar las reservas
  const [reservas, setReservas] = useState([
    {
      id: 1,
      folio: 1001,
      fechaReserva: "2024-01-15",
      numHabitantes: 2,
      nombreCliente: "María González Ramírez",
      numPasajeros: 4,
      telefono: "5551234567",
      importe: 3500.0,
      servicio:
        "Tour por Monte Albán y artesanías de Oaxaca. Incluye visita guiada por la zona arqueológica con explicación detallada de la historia zapoteca.",
      incluye:
        "Transporte, guía certificado, entradas a zonas arqueológicas, botella de agua",
      noIncluye: "Alimentos, propinas, souvenirs",
      formaPago: "transferencia",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 2,
      folio: 1002,
      fechaReserva: "2024-01-20",
      numHabitantes: 1,
      nombreCliente: "Carlos Hernández López",
      numPasajeros: 2,
      telefono: "5552345678",
      importe: 2800.0,
      servicio:
        "Experiencia gastronómica en Oaxaca. Recorrido por mercados locales y clase de cocina tradicional oaxaqueña.",
      incluye:
        "Transporte, guía especializado, ingredientes para clase de cocina, degustación de mezcal",
      noIncluye: "Comidas adicionales, bebidas alcohólicas extras",
      formaPago: "efectivo",
      pagado: "no pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 3,
      folio: 1003,
      fechaReserva: "2024-02-05",
      numHabitantes: 3,
      nombreCliente: "Ana Martínez Pérez",
      numPasajeros: 6,
      telefono: "5553456789",
      importe: 5200.0,
      servicio:
        "Tour completo Hierve el Agua y fábrica de mezcal. Día completo de aventura natural y cultural.",
      incluye:
        "Transporte en van climatizada, guía bilingüe, entradas, comida típica, degustación de mezcal",
      noIncluye: "Propinas, actividades opcionales extras",
      formaPago: "transferencia",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 4,
      folio: 1004,
      fechaReserva: "2024-02-10",
      numHabitantes: 2,
      nombreCliente: "Roberto Sánchez García",
      numPasajeros: 3,
      telefono: "5554567890",
      importe: 4100.0,
      servicio:
        "Ruta del mezcal artesanal. Visita a tres palenques tradicionales con explicación del proceso de elaboración.",
      incluye:
        "Transporte privado, guía experto, degustación en palenques, botana oaxaqueña",
      noIncluye: "Compra de botellas de mezcal, comidas completas",
      formaPago: "efectivo",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 5,
      folio: 1005,
      fechaReserva: "2024-02-18",
      numHabitantes: 1,
      nombreCliente: "Laura Torres Ramírez",
      numPasajeros: 1,
      telefono: "5555678901",
      importe: 1800.0,
      servicio:
        "City tour por el centro histórico de Oaxaca. Recorrido a pie por los principales monumentos y edificios coloniales.",
      incluye: "Guía certificado, entradas a iglesias y museos, mapa turístico",
      noIncluye: "Transporte, alimentos, bebidas",
      formaPago: "transferencia",
      pagado: "no pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 6,
      folio: 1006,
      fechaReserva: "2024-03-01",
      numHabitantes: 4,
      nombreCliente: "José Luis Fernández Díaz",
      numPasajeros: 8,
      telefono: "5556789012",
      importe: 6500.0,
      servicio:
        "Tour de día completo a las cascadas de Reforma. Incluye caminata, natación y comida campestre.",
      incluye:
        "Transporte, guía de aventura, equipo de seguridad, comida campestre, seguro",
      noIncluye: "Ropa de baño, toallas, cambio de ropa",
      formaPago: "transferencia",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 7,
      folio: 1007,
      fechaReserva: "2024-03-10",
      numHabitantes: 2,
      nombreCliente: "Patricia Morales Castillo",
      numPasajeros: 5,
      telefono: "5557890123",
      importe: 4800.0,
      servicio:
        "Experiencia textil en Teotitlán del Valle. Visita a talleres de tejido de lana y demostración de teñido natural.",
      incluye:
        "Transporte, guía cultural, demostración de tejido, taller de teñido, refrigerio",
      noIncluye: "Compra de textiles, comida completa",
      formaPago: "efectivo",
      pagado: "no pagado",
      fotoTransferencia: null,
      activo: true,
    },
    {
      id: 8,
      folio: 1008,
      fechaReserva: "2024-03-15",
      numHabitantes: 1,
      nombreCliente: "Miguel Ángel Ruiz Medina",
      numPasajeros: 2,
      telefono: "5558901234",
      importe: 3200.0,
      servicio:
        "Tour fotográfico por Oaxaca. Recorrido especial para fotografía en los mejores spots de la ciudad.",
      incluye:
        "Guía fotógrafo profesional, transporte a locaciones, tips de fotografía",
      noIncluye: "Equipo fotográfico, alimentos, edición de fotos",
      formaPago: "transferencia",
      pagado: "pagado",
      fotoTransferencia: null,
      activo: true,
    },
  ]);

  // Estados para controlar los modales
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [reservaSeleccionado, setReservaSeleccionado] = useState(null);

  // Funciones para manejar los modales
  const manejarVer = (reserva) => {
    setReservaSeleccionado(reserva);
    setModalVerAbierto(true);
    console.log("Ver reserva:", reserva);
  };

  const manejarEditar = (reserva) => {
    setReservaSeleccionado(reserva);
    setModalEditarAbierto(true);
    console.log("Editar reserva:", reserva);
  };

  const manejarEliminar = async (reserva) => {
    const confirmado = await modalEliminarReserva(reserva, eliminarReserva);
    if (confirmado) {
      console.log("Reserva eliminada:", reserva);
    }
  };

  // Función para cerrar modales
  const cerrarModales = () => {
    setModalVerAbierto(false);
    setModalEditarAbierto(false);
    setModalEliminarAbierto(false);
    setReservaSeleccionado(null);
  };

  // Función para actualizar reserva
  const actualizarReserva = (reservaActualizado) => {
    setReservas(
      reservas.map((r) =>
        r.id === reservaActualizado.id ? reservaActualizado : r
      )
    );
    cerrarModales();
  };

  // Función para eliminar reserva
  const eliminarReserva = (id) => {
    setReservas(reservas.filter((r) => r.id !== id));
    cerrarModales();
  };

  return (
    <PrincipalComponente>
      <div className="reservas-principal">
        <TablaReservas
          reservas={reservas}
          setReservas={setReservas}
          onVer={manejarVer}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
        />

        {/* Modal VER */}
        {modalVerAbierto && reservaSeleccionado && (
          <ModalVerReserva
            reserva={reservaSeleccionado}
            onCerrar={cerrarModales}
          />
        )}

        {/* Modal EDITAR */}
        {modalEditarAbierto && reservaSeleccionado && (
          <ModalEditarReserva
            reserva={reservaSeleccionado}
            onGuardar={actualizarReserva}
            onCerrar={cerrarModales}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default ReservasPrincipal;
