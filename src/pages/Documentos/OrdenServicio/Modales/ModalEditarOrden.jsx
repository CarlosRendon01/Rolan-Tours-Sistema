import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Save,
  User,
  FileText,
  MapPin,
  Car,
  AlertCircle,
  Calendar,
  Clock,
  Users,
} from "lucide-react";

import "./ModalEditarOrden.css";

const ModalEditarOrden = ({
  estaAbierto,
  orden,
  alCerrar,
  alGuardar,
  vehiculosDisponibles = [],
  conductoresDisponibles = [],
}) => {
  const [datosFormulario, setDatosFormulario] = useState({
    // Datos Orden de Servicio
    folio: "",
    fecha_orden_servicio: "",
    nombre_prestador: "Antonio Alonso Meza",

    // Datos Conductor
    conductor_id: "",
    nombre_conductor: "",
    apellido_paterno_conductor: "",
    apellido_materno_conductor: "",
    telefono_conductor: "",
    licencia_conductor: "",

    // Datos Servicio
    nombre_cliente: "",
    telefono_cliente: "",
    ciudad_origen: "",
    punto_intermedio: "",
    destino: "",
    numero_pasajeros: "",
    fecha_inicio_servicio: "",
    horario_inicio_servicio: "",
    fecha_final_servicio: "",
    horario_final_servicio: "",
    horario_final_real: "",
    itinerario_detallado: "",
    direccion_retorno: "",

    // Vehículo
    vehiculo_id: "",
    marca: "",
    modelo: "",
    placa: "",
    km_inicial: "",
    km_final: "",
    litros_consumidos: "",
    rendimiento: "",
  });

  const [seccionActiva, setSeccionActiva] = useState("orden");
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (estaAbierto && orden) {
      setDatosFormulario({
        folio: orden.folio || "",
        fecha_orden_servicio: orden.fecha_orden_servicio || "",
        nombre_prestador: orden.nombre_prestador || "Antonio Alonso Meza",
        conductor_id: orden.conductor_id || "",
        nombre_conductor: orden.nombre_conductor || "",
        apellido_paterno_conductor: orden.apellido_paterno_conductor || "",
        apellido_materno_conductor: orden.apellido_materno_conductor || "",
        telefono_conductor: orden.telefono_conductor || "",
        licencia_conductor: orden.licencia_conductor || "",

        nombre_cliente: orden.nombre_cliente || "",
        telefono_cliente: orden.telefono_cliente || "",
        ciudad_origen: orden.ciudad_origen || "",
        punto_intermedio: orden.punto_intermedio || "",
        destino: orden.destino || "",
        numero_pasajeros: orden.numero_pasajeros || "",
        fecha_inicio_servicio: orden.fecha_inicio_servicio || "",
        horario_inicio_servicio: orden.horario_inicio_servicio || "",
        fecha_final_servicio: orden.fecha_final_servicio || "",
        horario_final_servicio: orden.horario_final_servicio || "",
        horario_final_real: orden.horario_final_real || "",
        itinerario_detallado: orden.itinerario_detallado || "",
        direccion_retorno: orden.direccion_retorno || "",

        vehiculo_id: orden.vehiculo_id || "",
        marca: orden.marca || "",
        modelo: orden.modelo || "",
        placa: orden.placa || "",
        km_inicial: orden.km_inicial || "",
        km_final: orden.km_final || "",
        litros_consumidos: orden.litros_consumidos || "",
        rendimiento: orden.rendimiento || "",
      });
      setErrores({});
    }
  }, [estaAbierto, orden]);

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErrores((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[nombreCampo];
      return nuevosErrores;
    });
  }, []);

  const manejarCambioFormulario = useCallback(
    (evento) => {
      const { name, value } = evento.target;
      setDatosFormulario((datosAnteriores) => ({
        ...datosAnteriores,
        [name]: value,
      }));

      if (errores[name]) {
        limpiarErrorCampo(name);
      }
    },
    [errores, limpiarErrorCampo]
  );

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validaciones Datos Orden de Servicio
    if (!datosFormulario.folio) {
      nuevosErrores.folio = "El folio es obligatorio";
    }

    if (!datosFormulario.fecha_orden_servicio.trim()) {
      nuevosErrores.fecha_orden_servicio =
        "La fecha de orden de servicio es obligatoria";
    }

    // Validaciones Datos Servicio
    if (!datosFormulario.nombre_cliente.trim()) {
      nuevosErrores.nombre_cliente = "El nombre del cliente es obligatorio";
    }

    if (!datosFormulario.ciudad_origen.trim()) {
      nuevosErrores.ciudad_origen = "La ciudad de origen es obligatoria";
    }

    if (!datosFormulario.destino.trim()) {
      nuevosErrores.destino = "El destino es obligatorio";
    }

    if (!datosFormulario.numero_pasajeros) {
      nuevosErrores.numero_pasajeros = "El número de pasajeros es obligatorio";
    } else if (parseInt(datosFormulario.numero_pasajeros) < 1) {
      nuevosErrores.numero_pasajeros = "Debe haber al menos 1 pasajero";
    }

    if (!datosFormulario.fecha_inicio_servicio.trim()) {
      nuevosErrores.fecha_inicio_servicio = "La fecha de inicio es obligatoria";
    }

    if (!datosFormulario.fecha_final_servicio.trim()) {
      nuevosErrores.fecha_final_servicio = "La fecha final es obligatoria";
    }

    // Validar que fecha final sea posterior a fecha inicial
    if (
      datosFormulario.fecha_inicio_servicio &&
      datosFormulario.fecha_final_servicio
    ) {
      const inicio = new Date(datosFormulario.fecha_inicio_servicio);
      const final = new Date(datosFormulario.fecha_final_servicio);
      if (final < inicio) {
        nuevosErrores.fecha_final_servicio =
          "La fecha final debe ser posterior a la de inicio";
      }
    }

    return nuevosErrores;
  };

  const mostrarNotificacionExito = () => {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({
        title: "¡Excelente!",
        text: "La información de la orden se ha actualizado correctamente",
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor: "#2563eb",
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "swal-popup-custom-orden",
          title: "swal-title-custom-orden",
          confirmButton: "swal-confirm-custom-orden",
        },
      });
    }
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      const camposOrden = ["folio", "fecha_orden_servicio"];
      const camposConductor = [
        "conductor_id",
        "nombre_conductor",
        "apellido_paterno_conductor",
        "apellido_materno_conductor",
        "telefono_conductor",
        "licencia_conductor",
      ];
      const camposServicio = [
        "nombre_cliente",
        "telefono_cliente",
        "ciudad_origen",
        "punto_intermedio",
        "destino",
        "numero_pasajeros",
        "fecha_inicio_servicio",
        "horario_inicio_servicio",
        "fecha_final_servicio",
        "horario_final_servicio",
        "horario_final_real",
        "itinerario_detallado",
        "direccion_retorno",
      ];
      const camposVehiculo = [
        "vehiculo_id",
        "marca",
        "modelo",
        "placa",
        "km_inicial",
        "km_final",
        "litros_consumidos",
        "rendimiento",
      ];

      const erroresEnOrden = Object.keys(nuevosErrores).some((key) =>
        camposOrden.includes(key)
      );
      const erroresEnConductor = Object.keys(nuevosErrores).some((key) =>
        camposConductor.includes(key)
      );
      const erroresEnServicio = Object.keys(nuevosErrores).some((key) =>
        camposServicio.includes(key)
      );
      const erroresEnVehiculo = Object.keys(nuevosErrores).some((key) =>
        camposVehiculo.includes(key)
      );

      if (erroresEnOrden) {
        setSeccionActiva("orden");
      } else if (erroresEnConductor) {
        setSeccionActiva("conductor");
      } else if (erroresEnServicio) {
        setSeccionActiva("servicio");
      } else if (erroresEnVehiculo) {
        setSeccionActiva("vehiculo");
      }

      setTimeout(() => {
        const primerCampoConError = Object.keys(nuevosErrores)[0];
        const elemento = document.getElementById(primerCampoConError);
        if (elemento) {
          elemento.focus();
          elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      return;
    }

    setGuardando(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const datosActualizados = {
        ...orden,
        ...datosFormulario,
        fecha_actualizacion: new Date().toISOString(),
      };

      await alGuardar(datosActualizados);
      mostrarNotificacionExito();

      setTimeout(() => {
        manejarCerrar();
      }, 500);
    } catch (error) {
      console.error("Error al guardar:", error);
      if (typeof window !== "undefined" && window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Hubo un problema al guardar la información. Por favor, intenta nuevamente.",
          icon: "error",
          confirmButtonText: "Reintentar",
          confirmButtonColor: "#ef4444",
        });
      }
    } finally {
      setGuardando(false);
    }
  };

  const manejarCerrar = () => {
    if (guardando) return;
    setErrores({});
    setGuardando(false);
    alCerrar();
  };

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return (
      <span className="meo-error-mensaje">
        <AlertCircle size={14} />
        {error}
      </span>
    );
  };

  const renderSeccionOrden = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="folio">
          <FileText size={18} />
          Folio <span className="meo-required">*</span>
        </label>
        <input
          type="number"
          id="folio"
          name="folio"
          value={datosFormulario.folio}
          onChange={manejarCambioFormulario}
          className={errores.folio ? "input-error" : ""}
          placeholder="001"
          disabled={guardando}
          min="1"
        />
        <MensajeError nombreCampo="folio" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="fecha_orden_servicio">
          <Calendar size={18} />
          Fecha de Orden de Servicio <span className="meo-required">*</span>
        </label>
        <input
          type="date"
          id="fecha_orden_servicio"
          name="fecha_orden_servicio"
          value={datosFormulario.fecha_orden_servicio}
          onChange={manejarCambioFormulario}
          className={errores.fecha_orden_servicio ? "input-error" : ""}
          disabled={guardando}
        />
        <MensajeError nombreCampo="fecha_orden_servicio" />
      </div>

      <div className="meo-form-group form-group-full">
        <label htmlFor="nombre_prestador">
          <User size={18} />
          Nombre del Prestador de Servicios
        </label>
        <input
          type="text"
          id="nombre_prestador"
          name="nombre_prestador"
          value={datosFormulario.nombre_prestador}
          onChange={manejarCambioFormulario}
          disabled={guardando}
          style={{ backgroundColor: "#f9fafb" }}
        />
      </div>
    </div>
  );

  const renderSeccionConductor = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group form-group-full">
        <label htmlFor="conductor_id">
          <Users size={18} />
          Seleccionar Conductor
        </label>
        <select
          id="conductor_id"
          name="conductor_id"
          value={datosFormulario.conductor_id}
          onChange={(e) => {
            const conductorSeleccionado = conductoresDisponibles.find(
              (v) => v.id === parseInt(e.target.value)
            );

            if (conductorSeleccionado) {
              setDatosFormulario((prev) => ({
                ...prev,
                conductor_id: e.target.value,
                nombre_conductor: conductorSeleccionado.nombre_conductor,
                apellido_paterno_conductor:
                  conductorSeleccionado.apellido_paterno_conductor,
                apellido_materno_conductor:
                  conductorSeleccionado.apellido_materno_conductor,
              }));
            } else {
              manejarCambioFormulario(e);
            }
          }}
          disabled={guardando}
          className="Ordenes-selector-registros"
        >
          <option value="">-- Seleccione un conductor --</option>
          {conductoresDisponibles.map((conductor) => (
            <option key={conductor.id} value={conductor.id}>
              {conductor.nombre_conductor} {}
              {conductor.apellido_paterno_conductor} {}
              {conductor.apellido_materno_conductor}
            </option>
          ))}
        </select>
      </div>

      <div className="meo-form-group">
        <label htmlFor="nombre_conductor">
          <User size={18} />
          Nombre del Conductor
        </label>
        <input
          type="text"
          id="nombre_conductor"
          name="nombre_conductor"
          value={datosFormulario.nombre_conductor}
          onChange={manejarCambioFormulario}
          placeholder="Nombre"
          disabled={guardando}
          readOnly
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="apellido_paterno_conductor">Apellido Paterno</label>
        <input
          type="text"
          id="apellido_paterno_conductor"
          name="apellido_paterno_conductor"
          value={datosFormulario.apellido_paterno_conductor}
          onChange={manejarCambioFormulario}
          placeholder="Apellido Paterno"
          disabled={guardando}
          readOnly
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="apellido_materno_conductor">Apellido Materno</label>
        <input
          type="text"
          id="apellido_materno_conductor"
          name="apellido_materno_conductor"
          value={datosFormulario.apellido_materno_conductor}
          onChange={manejarCambioFormulario}
          placeholder="Apellido Materno"
          disabled={guardando}
          readOnly
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="telefono_conductor">Teléfono</label>
        <input
          type="tel"
          id="telefono_conductor"
          name="telefono_conductor"
          value={datosFormulario.telefono_conductor}
          onChange={manejarCambioFormulario}
          placeholder="9511234567"
          disabled={guardando}
          maxLength="10"
          readOnly
        />
      </div>

      <div className="meo-form-group form-group-full">
        <label htmlFor="licencia_conductor">
          <FileText size={18} />
          Número de Licencia
        </label>
        <input
          type="text"
          id="licencia_conductor"
          name="licencia_conductor"
          value={datosFormulario.licencia_conductor}
          onChange={manejarCambioFormulario}
          placeholder="Número de licencia"
          disabled={guardando}
          readOnly
        />
      </div>
    </div>
  );

  const renderSeccionServicio = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="nombre_cliente">
          <User size={18} />
          Nombre de Cliente <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="nombre_cliente"
          name="nombre_cliente"
          value={datosFormulario.nombre_cliente}
          onChange={manejarCambioFormulario}
          className={errores.nombre_cliente ? "input-error" : ""}
          placeholder="Nombre del cliente"
          disabled={guardando}
        />
        <MensajeError nombreCampo="nombre_cliente" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="telefono_cliente">Teléfono</label>
        <input
          type="tel"
          id="telefono_cliente"
          name="telefono_cliente"
          value={datosFormulario.telefono_cliente}
          onChange={manejarCambioFormulario}
          placeholder="9511234567"
          disabled={guardando}
          maxLength="10"
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="ciudad_origen">
          <MapPin size={18} />
          Ciudad de Origen <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="ciudad_origen"
          name="ciudad_origen"
          value={datosFormulario.ciudad_origen}
          onChange={manejarCambioFormulario}
          className={errores.ciudad_origen ? "input-error" : ""}
          placeholder="Ciudad de origen"
          disabled={guardando}
        />
        <MensajeError nombreCampo="ciudad_origen" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="punto_intermedio">
          <MapPin size={18} />
          Punto Intermedio
        </label>
        <input
          type="text"
          id="punto_intermedio"
          name="punto_intermedio"
          value={datosFormulario.punto_intermedio}
          onChange={manejarCambioFormulario}
          placeholder="Punto intermedio (opcional)"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="destino">
          <MapPin size={18} />
          Destino <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="destino"
          name="destino"
          value={datosFormulario.destino}
          onChange={manejarCambioFormulario}
          className={errores.destino ? "input-error" : ""}
          placeholder="Destino final"
          disabled={guardando}
        />
        <MensajeError nombreCampo="destino" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="numero_pasajeros">
          <Users size={18} />
          Número de Pasajeros <span className="meo-required">*</span>
        </label>
        <input
          type="number"
          id="numero_pasajeros"
          name="numero_pasajeros"
          value={datosFormulario.numero_pasajeros}
          onChange={manejarCambioFormulario}
          className={errores.numero_pasajeros ? "input-error" : ""}
          placeholder="15"
          disabled={guardando}
          min="1"
        />
        <MensajeError nombreCampo="numero_pasajeros" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="fecha_inicio_servicio">
          <Calendar size={18} />
          Fecha Inicio Servicio <span className="meo-required">*</span>
        </label>
        <input
          type="date"
          id="fecha_inicio_servicio"
          name="fecha_inicio_servicio"
          value={datosFormulario.fecha_inicio_servicio}
          onChange={manejarCambioFormulario}
          className={errores.fecha_inicio_servicio ? "input-error" : ""}
          disabled={guardando}
        />
        <MensajeError nombreCampo="fecha_inicio_servicio" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="horario_inicio_servicio">
          <Clock size={18} />
          Horario Inicio Servicio
        </label>
        <input
          type="time"
          id="horario_inicio_servicio"
          name="horario_inicio_servicio"
          value={datosFormulario.horario_inicio_servicio}
          onChange={manejarCambioFormulario}
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="fecha_final_servicio">
          <Calendar size={18} />
          Fecha Final Servicio <span className="meo-required">*</span>
        </label>
        <input
          type="date"
          id="fecha_final_servicio"
          name="fecha_final_servicio"
          value={datosFormulario.fecha_final_servicio}
          onChange={manejarCambioFormulario}
          className={errores.fecha_final_servicio ? "input-error" : ""}
          disabled={guardando}
        />
        <MensajeError nombreCampo="fecha_final_servicio" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="horario_final_servicio">
          <Clock size={18} />
          Horario Final Servicio
        </label>
        <input
          type="time"
          id="horario_final_servicio"
          name="horario_final_servicio"
          value={datosFormulario.horario_final_servicio}
          onChange={manejarCambioFormulario}
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="horario_final_real">
          <Clock size={18} />
          Horario Final Real
        </label>
        <input
          type="time"
          id="horario_final_real"
          name="horario_final_real"
          value={datosFormulario.horario_final_real}
          onChange={manejarCambioFormulario}
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group form-group-full">
        <label htmlFor="itinerario_detallado">Itinerario Detallado</label>
        <textarea
          id="itinerario_detallado"
          name="itinerario_detallado"
          value={datosFormulario.itinerario_detallado}
          onChange={manejarCambioFormulario}
          placeholder="Descripción detallada del itinerario..."
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group form-group-full">
        <label htmlFor="direccion_retorno">Dirección de Retorno</label>
        <input
          type="text"
          id="direccion_retorno"
          name="direccion_retorno"
          value={datosFormulario.direccion_retorno}
          onChange={manejarCambioFormulario}
          placeholder="Dirección completa de retorno"
          disabled={guardando}
        />
      </div>
    </div>
  );

  const renderSeccionVehiculo = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group form-group-full">
        <label htmlFor="vehiculo_id">
          <Car size={18} />
          Seleccionar Vehículo
        </label>
        <select
          id="vehiculo_id"
          name="vehiculo_id"
          value={datosFormulario.vehiculo_id}
          onChange={(e) => {
            const vehiculoSeleccionado = vehiculosDisponibles.find(
              (v) => v.id === parseInt(e.target.value)
            );

            if (vehiculoSeleccionado) {
              setDatosFormulario((prev) => ({
                ...prev,
                vehiculo_id: e.target.value,
                marca: vehiculoSeleccionado.marca,
                modelo: vehiculoSeleccionado.modelo,
                placa: vehiculoSeleccionado.numero_placa,
              }));
            } else {
              manejarCambioFormulario(e);
            }
          }}
          disabled={guardando}
          className="Ordenes-selector-registros"
        >
          <option value="">-- Seleccione un vehículo --</option>
          {vehiculosDisponibles.map((vehiculo) => (
            <option key={vehiculo.id} value={vehiculo.id}>
              {vehiculo.nombre} - {vehiculo.numero_placa}
            </option>
          ))}
        </select>
      </div>

      <div className="meo-form-group">
        <label htmlFor="marca">
          <Car size={18} />
          Marca
        </label>
        <input
          type="text"
          id="marca"
          name="marca"
          value={datosFormulario.marca}
          onChange={manejarCambioFormulario}
          placeholder="Toyota, Mercedes, etc."
          disabled={guardando}
          style={{
            backgroundColor: datosFormulario.vehiculo_id ? "#f9fafb" : "white",
          }}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="modelo">
          <Car size={18} />
          Modelo
        </label>
        <input
          type="text"
          id="modelo"
          name="modelo"
          value={datosFormulario.modelo}
          onChange={manejarCambioFormulario}
          placeholder="Hiace, Sprinter, etc."
          disabled={guardando}
          style={{
            backgroundColor: datosFormulario.vehiculo_id ? "#f9fafb" : "white",
          }}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="placa">Placa</label>
        <input
          type="text"
          id="placa"
          name="placa"
          value={datosFormulario.placa}
          onChange={manejarCambioFormulario}
          placeholder="ABC-123-D"
          disabled={guardando}
          style={{
            textTransform: "uppercase",
            backgroundColor: datosFormulario.vehiculo_id ? "#f9fafb" : "white",
          }}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="km_inicial">KM Inicial</label>
        <input
          type="number"
          id="km_inicial"
          name="km_inicial"
          value={datosFormulario.km_inicial}
          onChange={manejarCambioFormulario}
          placeholder="10000"
          disabled={guardando}
          min="0"
          step="0.1"
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="km_final">KM Final</label>
        <input
          type="number"
          id="km_final"
          name="km_final"
          value={datosFormulario.km_final}
          onChange={manejarCambioFormulario}
          placeholder="10500"
          disabled={guardando}
          min="0"
          step="0.1"
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="litros_consumidos">Litros Consumidos</label>
        <input
          type="number"
          id="litros_consumidos"
          name="litros_consumidos"
          value={datosFormulario.litros_consumidos}
          onChange={manejarCambioFormulario}
          placeholder="50"
          disabled={guardando}
          min="0"
          step="0.01"
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="rendimiento">Rendimiento</label>
        <input
          type="text"
          id="rendimiento"
          name="rendimiento"
          value={datosFormulario.rendimiento}
          onChange={manejarCambioFormulario}
          placeholder="10 km/L"
          disabled={guardando}
        />
      </div>
    </div>
  );

  if (!estaAbierto || !orden) return null;

  return (
    <div className="meo-overlay" onClick={manejarCerrar}>
      <div
        className="meo-contenido modal-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="meo-header">
          <h2>Editar Orden</h2>
          <button
            className="meo-btn-cerrar"
            onClick={manejarCerrar}
            disabled={guardando}
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="meo-tabs">
          <button
            className={`meo-tab-button ${
              seccionActiva === "orden" ? "active" : ""
            }`}
            onClick={() => setSeccionActiva("orden")}
            type="button"
          >
            <FileText size={18} />
            Datos Orden de Servicio
          </button>
          <button
            className={`meo-tab-button ${
              seccionActiva === "conductor" ? "active" : ""
            }`}
            onClick={() => setSeccionActiva("conductor")}
            type="button"
          >
            <User size={18} />
            Datos Conductor
          </button>
          <button
            className={`meo-tab-button ${
              seccionActiva === "servicio" ? "active" : ""
            }`}
            onClick={() => setSeccionActiva("servicio")}
            type="button"
          >
            <MapPin size={18} />
            Datos Servicio
          </button>
          <button
            className={`meo-tab-button ${
              seccionActiva === "vehiculo" ? "active" : ""
            }`}
            onClick={() => setSeccionActiva("vehiculo")}
            type="button"
          >
            <Car size={18} />
            Vehículo
          </button>
        </div>

        {/* Formulario (scrolleable) */}
        <form onSubmit={manejarEnvio} className="meo-form">
          {seccionActiva === "orden" && renderSeccionOrden()}
          {seccionActiva === "conductor" && renderSeccionConductor()}
          {seccionActiva === "servicio" && renderSeccionServicio()}
          {seccionActiva === "vehiculo" && renderSeccionVehiculo()}
        </form>

        {/* Footer */}
        <div className="meo-footer">
          <div className="meo-botones-izquierda">
            <button
              type="button"
              className="meo-btn-cancelar"
              onClick={manejarCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
          </div>
          <div className="meo-botones-derecha">
            <button
              type="button"
              className={`meo-btn-actualizar ${guardando ? "loading" : ""}`}
              disabled={guardando}
              onClick={manejarEnvio}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? "Actualizando..." : "Actualizar Orden"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarOrden;
