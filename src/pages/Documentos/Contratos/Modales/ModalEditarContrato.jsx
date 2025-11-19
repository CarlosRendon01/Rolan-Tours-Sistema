import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  FileText,
  Globe,
  MapPin,
  Car,
  Users,
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  Building,
} from "lucide-react";
import "./ModalEditarContrato.css";

const ModalEditarContrato = ({
  estaAbierto,
  contrato,
  alCerrar,
  alGuardar,
}) => {
  const [datosFormulario, setDatosFormulario] = useState({
    // Datos de Contrato
    representante_empresa: "PEDRO HERNÁNDEZ RUÍZ",
    domicilio: "",

    // Datos del Servicio
    nombre_cliente: "",
    nacionalidad: "",
    rfc: "",
    telefono_cliente: "",
    ciudad_origen: "",
    punto_intermedio: "",
    destino: "",
    tipo_pasaje: "Turismo Estatal",
    otro_tipo_pasaje_especificacion: "",
    n_unidades_contratadas: "",
    numero_pasajeros: "",
    fecha_inicio_servicio: "",
    horario_inicio_servicio: "",
    fecha_final_servicio: "",
    horario_final_servicio: "",
    itinerario_detallado: "",

    // Costo Extra
    importe_servicio: "",
    anticipo: "",
    fecha_liquidacion: "",
    costos_cubiertos: [],
    otro_costo_especificacion: "",

    // Datos Vehículo
    marca_vehiculo: "",
    modelo_vehiculo: "",
    placa_vehiculo: "",
    capacidad_vehiculo: "",
    aire_acondicionado: false,
    asientos_reclinables: false,
  });

  const [seccionActiva, setSeccionActiva] = useState("contrato");
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const opcionesTipoPasaje = [
    "Turismo Estatal",
    "Turismo Internacional",
    "Nacional",
    "Escolar",
    "Otro",
  ];

  const opcionesCostosCubiertos = [
    "Combustible a consumir durante todo el trayecto",
    "Peaje de Casetas necesarias durante todo el trayecto",
    "Viáticos del conductor",
    "Servicio a disposición en el destino por máximo 30km a la redonda",
    "Servicio a disposición en el destino por máximo 10 horas al día",
    "Seguro de Viajero en accidente automovilístico siempre y cuando el pasajero esté dentro de la unidad",
    "Piso en Aeropuerto",
    "Alimentos no especificados",
    "Actividades no especificadas",
    "Otro, especifique",
  ];

  useEffect(() => {
    if (estaAbierto && contrato) {
      setDatosFormulario({
        representante_empresa:
          contrato.representante_empresa || "PEDRO HERNÁNDEZ RUÍZ",
        domicilio: contrato.domicilio || "",

        nombre_cliente: contrato.nombre_cliente || "",
        nacionalidad: contrato.nacionalidad || "",
        rfc: contrato.rfc || "",
        telefono_cliente: contrato.telefono_cliente || "",
        ciudad_origen: contrato.ciudad_origen || "",
        punto_intermedio: contrato.punto_intermedio || "",
        destino: contrato.destino || "",
        tipo_pasaje: contrato.tipo_pasaje || "Turismo Estatal",
        otro_tipo_pasaje_especificacion:
          contrato.otro_tipo_pasaje_especificacion || "",
        n_unidades_contratadas: contrato.n_unidades_contratadas || "",
        numero_pasajeros: contrato.numero_pasajeros || "",
        fecha_inicio_servicio: contrato.fecha_inicio_servicio || "",
        horario_inicio_servicio: contrato.horario_inicio_servicio || "",
        fecha_final_servicio: contrato.fecha_final_servicio || "",
        horario_final_servicio: contrato.horario_final_servicio || "",
        itinerario_detallado: contrato.itinerario_detallado || "",

        importe_servicio: contrato.importe_servicio || "",
        anticipo: contrato.anticipo || "",
        fecha_liquidacion: contrato.fecha_liquidacion || "",
        costos_cubiertos: contrato.costos_cubiertos || [],
        otro_costo_especificacion: contrato.otro_costo_especificacion || "",

        marca_vehiculo: contrato.marca_vehiculo || "",
        modelo_vehiculo: contrato.modelo_vehiculo || "",
        placa_vehiculo: contrato.placa_vehiculo || "",
        capacidad_vehiculo: contrato.capacidad_vehiculo || "",
        aire_acondicionado: contrato.aire_acondicionado || false,
        asientos_reclinables: contrato.asientos_reclinables || false,
      });
      setErrores({});
    }
  }, [estaAbierto, contrato]);

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErrores((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[nombreCampo];
      return nuevosErrores;
    });
  }, []);

  const manejarCambioFormulario = useCallback(
    (evento) => {
      const { name, value, type, checked } = evento.target;

      setDatosFormulario((datosAnteriores) => ({
        ...datosAnteriores,
        [name]: type === "checkbox" ? checked : value,
      }));

      if (errores[name]) {
        limpiarErrorCampo(name);
      }
    },
    [errores, limpiarErrorCampo]
  );

  const manejarCambioCostosCubiertos = (opcion) => {
    setDatosFormulario((datosAnteriores) => {
      const costos = datosAnteriores.costos_cubiertos.includes(opcion)
        ? datosAnteriores.costos_cubiertos.filter((c) => c !== opcion)
        : [...datosAnteriores.costos_cubiertos, opcion];

      return {
        ...datosAnteriores,
        costos_cubiertos: costos,
      };
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosFormulario.domicilio.trim()) {
      nuevosErrores.domicilio = "El domicilio es obligatorio";
    }

    if (!datosFormulario.nombre_cliente.trim()) {
      nuevosErrores.nombre_cliente = "El nombre del cliente es obligatorio";
    }

    if (!datosFormulario.telefono_cliente) {
      nuevosErrores.telefono_cliente = "El teléfono es obligatorio";
    }

    if (!datosFormulario.ciudad_origen.trim()) {
      nuevosErrores.ciudad_origen = "La ciudad de origen es obligatoria";
    }
    if (
      datosFormulario.tipo_pasaje === "Otro" &&
      !datosFormulario.otro_tipo_pasaje_especificacion.trim()
    ) {
      nuevosErrores.otro_tipo_pasaje_especificacion =
        "Debe especificar el tipo de pasaje";
    }
    if (!datosFormulario.destino.trim()) {
      nuevosErrores.destino = "El destino es obligatorio";
    }

    if (!datosFormulario.n_unidades_contratadas) {
      nuevosErrores.n_unidades_contratadas =
        "El número de unidades es obligatorio";
    }

    if (!datosFormulario.rfc.trim()) {
      nuevosErrores.rfc = "El rfc es obligatorio";
    }
    if (!datosFormulario.numero_pasajeros) {
      nuevosErrores.numero_pasajeros = "El número de pasajeros es obligatorio";
    }

    if (!datosFormulario.fecha_inicio_servicio) {
      nuevosErrores.fecha_inicio_servicio = "La fecha de inicio es obligatoria";
    }

    if (!datosFormulario.horario_inicio_servicio) {
      nuevosErrores.horario_inicio_servicio =
        "El horario de inicio es obligatorio";
    }

    if (!datosFormulario.fecha_final_servicio) {
      nuevosErrores.fecha_final_servicio = "La fecha final es obligatoria";
    }

    if (!datosFormulario.horario_final_servicio) {
      nuevosErrores.horario_final_servicio = "El horario final es obligatorio";
    }

    if (
      datosFormulario.fecha_inicio_servicio &&
      datosFormulario.fecha_final_servicio
    ) {
      const inicio = new Date(datosFormulario.fecha_inicio_servicio);
      const final = new Date(datosFormulario.fecha_final_servicio);
      if (final < inicio) {
        nuevosErrores.fecha_final_servicio =
          "La fecha final debe ser posterior a la fecha de inicio";
      }
    }
    if (!datosFormulario.importe_servicio) {
      nuevosErrores.importe_servicio = "El importe del servicio es obligatorio";
    }

    return nuevosErrores;
  };

  const mostrarNotificacionExito = () => {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({
        title: "¡Excelente!",
        text: "La información del contrato se ha actualizado correctamente",
        icon: "success",
        confirmButtonText: "Perfecto",
        confirmButtonColor: "#2563eb",
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      const camposContrato = ["domicilio"];
      const camposServicio = [
        "nombre_cliente",
        "nacionalidad",
        "RFC",
        "telefono_cliente",
        "ciudad_origen",
        "destino",
        "tipo_pasaje",
        "n_unidades_contratadas",
        "numero_pasajeros",
        "fecha_inicio_servicio",
        "horario_inicio_servicio",
        "fecha_final_servicio",
        "horario_final_servicio",
        "itinerario_detallado",
      ];
      const camposCosto = ["importe_servicio", "anticipo", "fecha_liquidacion"];

      const erroresEnContrato = Object.keys(nuevosErrores).some((key) =>
        camposContrato.includes(key)
      );
      const erroresEnServicio = Object.keys(nuevosErrores).some((key) =>
        camposServicio.includes(key)
      );
      const erroresEnCosto = Object.keys(nuevosErrores).some((key) =>
        camposCosto.includes(key)
      );

      if (erroresEnContrato) {
        setSeccionActiva("contrato");
      } else if (erroresEnServicio) {
        setSeccionActiva("servicio");
      } else if (erroresEnCosto) {
        setSeccionActiva("costo");
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
        ...contrato,
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

  const renderSeccionContrato = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="representante_empresa">
          <Building size={18} />
          Representante de la Empresa <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="representante_empresa"
          name="representante_empresa"
          value={datosFormulario.representante_empresa}
          onChange={manejarCambioFormulario}
          disabled={true}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="domicilio">
          <MapPin size={18} />
          Domicilio <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="domicilio"
          name="domicilio"
          value={datosFormulario.domicilio}
          onChange={manejarCambioFormulario}
          className={errores.domicilio ? "input-error" : ""}
          placeholder="Calle, número, colonia, ciudad"
          disabled={guardando}
        />
        <MensajeError nombreCampo="domicilio" />
      </div>
    </div>
  );

  const renderSeccionServicio = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="nombre_cliente">
          <User size={18} />
          Nombre del Cliente <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="nombre_cliente"
          name="nombre_cliente"
          value={datosFormulario.nombre_cliente}
          onChange={manejarCambioFormulario}
          className={errores.nombre_cliente ? "input-error" : ""}
          placeholder="Nombre completo"
          disabled={guardando}
        />
        <MensajeError nombreCampo="nombre_cliente" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="nacionalidad">
          <Globe size={18} />
          Nacionalidad
        </label>
        <input
          type="text"
          id="nacionalidad"
          name="nacionalidad"
          value={datosFormulario.nacionalidad}
          onChange={manejarCambioFormulario}
          placeholder="Mexicana, Estadounidense, etc."
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="rfc">
          <Globe size={18} />
          RFC
        </label>
        <input
          type="text"
          id="rfc"
          name="rfc"
          value={datosFormulario.rfc}
          onChange={manejarCambioFormulario}
          placeholder="CAPV841211ABC"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="telefono_cliente">
          <Phone size={18} />
          Teléfono <span className="meo-required">*</span>
        </label>
        <input
          type="tel"
          id="telefono_cliente"
          name="telefono_cliente"
          value={datosFormulario.telefono_cliente}
          onChange={manejarCambioFormulario}
          className={errores.telefono_cliente ? "input-error" : ""}
          placeholder="9511234567"
          disabled={guardando}
          maxLength="10"
        />
        <MensajeError nombreCampo="telefono_cliente" />
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
          placeholder="Ciudad o dirección de origen"
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
          placeholder="Parada intermedia (opcional)"
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
          placeholder="Ciudad o dirección de destino"
          disabled={guardando}
        />
        <MensajeError nombreCampo="destino" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="tipo_pasaje">
          <FileText size={18} />
          Tipo de Pasaje <span className="meo-required">*</span>
        </label>
        <select
          id="tipo_pasaje"
          name="tipo_pasaje"
          value={datosFormulario.tipo_pasaje}
          onChange={manejarCambioFormulario}
          disabled={guardando}
        >
          {opcionesTipoPasaje.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </div>

      {datosFormulario.tipo_pasaje === "Otro" && (
        <div className="meo-form-group">
          <label htmlFor="otro_tipo_pasaje_especificacion">
            <FileText size={18} />
            Especifique el tipo de pasaje{" "}
            <span className="meo-required">*</span>
          </label>
          <input
            type="text"
            id="otro_tipo_pasaje_especificacion"
            name="otro_tipo_pasaje_especificacion"
            value={datosFormulario.otro_tipo_pasaje_especificacion}
            onChange={manejarCambioFormulario}
            placeholder="Especifique el tipo de pasaje..."
            disabled={guardando}
            className={
              errores.otro_tipo_pasaje_especificacion ? "input-error" : ""
            }
          />
          <MensajeError nombreCampo="otro_tipo_pasaje_especificacion" />
        </div>
      )}

      <div className="meo-form-group">
        <label htmlFor="n_unidades_contratadas">
          <Car size={18} />
          N° Unidades Contratadas <span className="meo-required">*</span>
        </label>
        <input
          type="number"
          id="n_unidades_contratadas"
          name="n_unidades_contratadas"
          value={datosFormulario.n_unidades_contratadas}
          onChange={manejarCambioFormulario}
          className={errores.n_unidades_contratadas ? "input-error" : ""}
          placeholder="1"
          disabled={guardando}
          min="1"
        />
        <MensajeError nombreCampo="n_unidades_contratadas" />
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
          Horario Inicio Servicio <span className="meo-required">*</span>
        </label>
        <input
          type="time"
          id="horario_inicio_servicio"
          name="horario_inicio_servicio"
          value={datosFormulario.horario_inicio_servicio}
          onChange={manejarCambioFormulario}
          className={errores.horario_inicio_servicio ? "input-error" : ""}
          disabled={guardando}
        />
        <MensajeError nombreCampo="horario_inicio_servicio" />
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
          Horario Final Servicio <span className="meo-required">*</span>
        </label>
        <input
          type="time"
          id="horario_final_servicio"
          name="horario_final_servicio"
          value={datosFormulario.horario_final_servicio}
          onChange={manejarCambioFormulario}
          className={errores.horario_final_servicio ? "input-error" : ""}
          disabled={guardando}
        />
        <MensajeError nombreCampo="horario_final_servicio" />
      </div>

      <div className="meo-form-group form-group-full">
        <label htmlFor="itinerario_detallado">
          <FileText size={18} />
          Itinerario Detallado
        </label>
        <textarea
          id="itinerario_detallado"
          name="itinerario_detallado"
          value={datosFormulario.itinerario_detallado}
          onChange={manejarCambioFormulario}
          placeholder="Describe el itinerario detallado del viaje..."
          disabled={guardando}
          rows="4"
        />
      </div>
    </div>
  );

  const renderSeccionCosto = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="importe_servicio">
          <DollarSign size={18} />
          Importe del Servicio <span className="meo-required">*</span>
        </label>
        <input
          type="number"
          id="importe_servicio"
          name="importe_servicio"
          value={datosFormulario.importe_servicio}
          onChange={manejarCambioFormulario}
          className={errores.importe_servicio ? "input-error" : ""}
          placeholder="0.00"
          disabled={guardando}
          min="0"
          step="0.01"
        />
        <MensajeError nombreCampo="importe_servicio" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="anticipo">
          <DollarSign size={18} />
          Anticipo
        </label>
        <input
          type="number"
          id="anticipo"
          name="anticipo"
          value={datosFormulario.anticipo}
          onChange={manejarCambioFormulario}
          placeholder="0.00"
          disabled={guardando}
          min="0"
          step="0.01"
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="fecha_liquidacion">
          <Calendar size={18} />
          Fecha de Liquidación
        </label>
        <input
          type="date"
          id="fecha_liquidacion"
          name="fecha_liquidacion"
          value={datosFormulario.fecha_liquidacion}
          onChange={manejarCambioFormulario}
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group form-group-full">
        <label>
          <FileText size={18} />
          Costos Cubiertos por este Servicio
        </label>
        <div className="meo-checkbox-grid">
          {opcionesCostosCubiertos.map((opcion) => (
            <label key={opcion} className="meo-checkbox-label">
              <input
                type="checkbox"
                checked={datosFormulario.costos_cubiertos.includes(opcion)}
                onChange={() => manejarCambioCostosCubiertos(opcion)}
                disabled={guardando}
              />
              <span>{opcion}</span>
            </label>
          ))}
        </div>
      </div>

      {datosFormulario.costos_cubiertos.includes("Otro, especifique") && (
        <div className="meo-form-group form-group-full">
          <label htmlFor="otro_costo_especificacion">
            Especifique otro costo
          </label>
          <input
            type="text"
            id="otro_costo_especificacion"
            name="otro_costo_especificacion"
            value={datosFormulario.otro_costo_especificacion}
            onChange={manejarCambioFormulario}
            placeholder="Especifique el otro costo..."
            disabled={guardando}
          />
        </div>
      )}
    </div>
  );

  const renderSeccionVehiculo = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="marca_vehiculo">
          <Car size={18} />
          Marca del Vehículo
        </label>
        <input
          type="text"
          id="marca_vehiculo"
          name="marca_vehiculo"
          value={datosFormulario.marca_vehiculo}
          onChange={manejarCambioFormulario}
          placeholder="Toyota, Mercedes, etc."
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="modelo_vehiculo">
          <Car size={18} />
          Modelo del Vehículo
        </label>
        <input
          type="text"
          id="modelo_vehiculo"
          name="modelo_vehiculo"
          value={datosFormulario.modelo_vehiculo}
          onChange={manejarCambioFormulario}
          placeholder="Hiace, Sprinter, etc."
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="placa_vehiculo">
          <Car size={18} />
          Placa del Vehículo
        </label>
        <input
          type="text"
          id="placa_vehiculo"
          name="placa_vehiculo"
          value={datosFormulario.placa_vehiculo}
          onChange={manejarCambioFormulario}
          placeholder="ABC-123-D"
          disabled={guardando}
          style={{ textTransform: "uppercase" }}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="capacidad_vehiculo">
          <Users size={18} />
          Capacidad del Vehículo
        </label>
        <input
          type="number"
          id="capacidad_vehiculo"
          name="capacidad_vehiculo"
          value={datosFormulario.capacidad_vehiculo}
          onChange={manejarCambioFormulario}
          placeholder="15"
          disabled={guardando}
          min="1"
        />
      </div>

      <div className="meo-form-group form-group-full">
        <label>Extras del Vehículo</label>
        <div className="meo-checkbox-grid">
          <label className="meo-checkbox-label">
            <input
              type="checkbox"
              name="aire_acondicionado"
              checked={datosFormulario.aire_acondicionado}
              onChange={manejarCambioFormulario}
              disabled={guardando}
            />
            <span>Aire Acondicionado</span>
          </label>
          <label className="meo-checkbox-label">
            <input
              type="checkbox"
              name="asientos_reclinables"
              checked={datosFormulario.asientos_reclinables}
              onChange={manejarCambioFormulario}
              disabled={guardando}
            />
            <span>Asientos Reclinables</span>
          </label>
        </div>
      </div>
    </div>
  );

  if (!estaAbierto || !contrato) return null;

  return (
    <div className="meo-overlay" onClick={manejarCerrar}>
      <div
        className="meo-contenido modal-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="meo-header">
          <h2>Editar Contrato</h2>
          <button
            className="meo-btn-cerrar"
            onClick={manejarCerrar}
            disabled={guardando}
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="meo-tabs">
          <button
            className={`meo-tab-button ${
              seccionActiva === "contrato" ? "active" : ""
            }`}
            onClick={() => setSeccionActiva("contrato")}
            type="button"
          >
            <Building size={18} />
            Datos de Contrato
          </button>
          <button
            className={`meo-tab-button ${
              seccionActiva === "servicio" ? "active" : ""
            }`}
            onClick={() => setSeccionActiva("servicio")}
            type="button"
          >
            <FileText size={18} />
            Datos del Servicio
          </button>
          <button
            className={`meo-tab-button ${
              seccionActiva === "costo" ? "active" : ""
            }`}
            onClick={() => setSeccionActiva("costo")}
            type="button"
          >
            <DollarSign size={18} />
            Costo Extra
          </button>
          <button
            className={`meo-tab-button ${
              seccionActiva === "vehiculo" ? "active" : ""
            }`}
            onClick={() => setSeccionActiva("vehiculo")}
            type="button"
          >
            <Car size={18} />
            Datos Vehículo
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="meo-form">
          {seccionActiva === "contrato" && renderSeccionContrato()}
          {seccionActiva === "servicio" && renderSeccionServicio()}
          {seccionActiva === "costo" && renderSeccionCosto()}
          {seccionActiva === "vehiculo" && renderSeccionVehiculo()}
        </form>

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
              <span>
                {guardando ? "Actualizando..." : "Actualizar Contrato"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarContrato;
