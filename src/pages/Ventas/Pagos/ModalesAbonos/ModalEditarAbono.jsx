import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  X,
  Save,
  User,
  Calendar,
  DollarSign,
  FileText,
  Hash,
  AlertCircle,
  Clock,
  Info,
} from "lucide-react";
import "./ModalEditarAbono.css";

const TIPOS_SERVICIO = [
  "Tour Arqueológico",
  "Tour Gastronómico",
  "Tour Ecoturístico",
  "Tour Cultural",
  "Tour Personalizado",
  "Paquete Completo",
];

const FRECUENCIAS_PAGO = [
  { value: "semanal", label: "Semanal" },
  { value: "quincenal", label: "Quincenal" },
  { value: "mensual", label: "Mensual" },
  { value: "bimestral", label: "Bimestral" },
];

const VALIDADORES = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  telefono: (tel) =>
    /^[\d\s\-()]+$/.test(tel) && tel.replace(/\D/g, "").length >= 10,
  longitudMinima: (texto, min) => texto.trim().length >= min,
  numeroPositivo: (num) => parseFloat(num) > 0,
  rangoNumero: (num, min, max) => num >= min && num <= max,
};

const useEditarAbonoForm = (pagoSeleccionado, abierto) => {
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const primerCampoConError = useRef(null);

  const [formData, setFormData] = useState({
    nombreCliente: "",
    emailCliente: "",
    telefonoCliente: "",
    tipoServicio: "",
    descripcionServicio: "",
    fechaTour: "",
    montoTotal: "",
    numeroAbonos: "",
    abonoMinimo: "",
    fechaPrimerAbono: "",
    numeroContrato: "",
    frecuenciaPago: "mensual",
    observaciones: "",
  });

  useEffect(() => {
    if (abierto && pagoSeleccionado) {
      const datosIniciales = {
        nombreCliente: pagoSeleccionado.cliente.nombre || "",
        emailCliente: pagoSeleccionado.cliente.email || "",
        telefonoCliente: pagoSeleccionado.cliente.telefono || "",
        tipoServicio: pagoSeleccionado.servicio.tipo || "",
        descripcionServicio: pagoSeleccionado.servicio.descripcion || "",
        fechaTour: pagoSeleccionado.servicio.fechaTour || "",
        montoTotal: pagoSeleccionado.planPago.montoTotal || "",
        numeroAbonos: pagoSeleccionado.planPago.abonosPlaneados || "",
        abonoMinimo: pagoSeleccionado.planPago.abonoMinimo || "",
        fechaPrimerAbono:
          pagoSeleccionado.proximoVencimiento !== "Finalizado"
            ? pagoSeleccionado.proximoVencimiento
            : "",
        numeroContrato: pagoSeleccionado.numeroContrato || "",
        frecuenciaPago: pagoSeleccionado.frecuenciaPago || "mensual",
        observaciones: pagoSeleccionado.observaciones || "",
      };

      setFormData(datosIniciales);
      setErrores({});
    }
  }, [abierto, pagoSeleccionado]);

  const calcularAbonoMinimo = useCallback((monto, numAbonos) => {
    if (monto > 0 && numAbonos > 0) {
      return Math.ceil(monto / numAbonos);
    }
    return "";
  }, []);

  const manejarCambio = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        const nuevoForm = { ...prev, [name]: value };

        if (name === "montoTotal" || name === "numeroAbonos") {
          const monto =
            name === "montoTotal"
              ? parseFloat(value)
              : parseFloat(prev.montoTotal);
          const numAbonos =
            name === "numeroAbonos"
              ? parseInt(value)
              : parseInt(prev.numeroAbonos);
          nuevoForm.abonoMinimo = calcularAbonoMinimo(monto, numAbonos);
        }

        return nuevoForm;
      });

      if (errores[name]) {
        setErrores((prev) => {
          const nuevosErrores = { ...prev };
          delete nuevosErrores[name];
          return nuevosErrores;
        });
      }
    },
    [errores, calcularAbonoMinimo]
  );

  const normalizarFecha = useCallback((fecha) => {
    const fechaNormalizada = new Date(fecha);
    fechaNormalizada.setHours(0, 0, 0, 0);
    return fechaNormalizada;
  }, []);

  const establecerError = useCallback((campo, mensaje) => {
    if (!primerCampoConError.current) {
      primerCampoConError.current = campo;
    }
    return mensaje;
  }, []);

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};
    primerCampoConError.current = null;

    if (!VALIDADORES.longitudMinima(formData.nombreCliente, 3)) {
      nuevosErrores.nombreCliente = establecerError(
        "nombreCliente",
        !formData.nombreCliente.trim()
          ? "El nombre del cliente es obligatorio"
          : "El nombre debe tener al menos 3 caracteres"
      );
    }

    if (!formData.emailCliente.trim()) {
      nuevosErrores.emailCliente = establecerError(
        "emailCliente",
        "El email es obligatorio"
      );
    } else if (!VALIDADORES.email(formData.emailCliente)) {
      nuevosErrores.emailCliente = establecerError(
        "emailCliente",
        "Formato de email inválido"
      );
    }

    if (!formData.telefonoCliente.trim()) {
      nuevosErrores.telefonoCliente = establecerError(
        "telefonoCliente",
        "El teléfono es obligatorio"
      );
    } else if (!VALIDADORES.telefono(formData.telefonoCliente)) {
      nuevosErrores.telefonoCliente = establecerError(
        "telefonoCliente",
        "Formato de teléfono inválido"
      );
    }

    if (!formData.tipoServicio.trim()) {
      nuevosErrores.tipoServicio = establecerError(
        "tipoServicio",
        "Debe seleccionar un tipo de servicio"
      );
    }

    if (!VALIDADORES.longitudMinima(formData.descripcionServicio, 10)) {
      nuevosErrores.descripcionServicio = establecerError(
        "descripcionServicio",
        !formData.descripcionServicio.trim()
          ? "La descripción es obligatoria"
          : "La descripción debe tener al menos 10 caracteres"
      );
    }

    if (!formData.fechaTour) {
      nuevosErrores.fechaTour = establecerError(
        "fechaTour",
        "La fecha del tour es obligatoria"
      );
    } else {
      const fechaTour = normalizarFecha(formData.fechaTour);
      const hoy = normalizarFecha(new Date());

      if (fechaTour < hoy) {
        nuevosErrores.fechaTour = establecerError(
          "fechaTour",
          "La fecha del tour no puede ser en el pasado"
        );
      }
    }

    if (!VALIDADORES.numeroPositivo(formData.montoTotal)) {
      nuevosErrores.montoTotal = establecerError(
        "montoTotal",
        "El monto total debe ser mayor a 0"
      );
    } else if (parseFloat(formData.montoTotal) > 1000000) {
      nuevosErrores.montoTotal = establecerError(
        "montoTotal",
        "El monto total parece demasiado alto"
      );
    }

    const numAbonos = parseInt(formData.numeroAbonos);
    if (!numAbonos || !VALIDADORES.rangoNumero(numAbonos, 1, 24)) {
      nuevosErrores.numeroAbonos = establecerError(
        "numeroAbonos",
        numAbonos <= 0
          ? "Debe haber al menos 1 abono"
          : "Máximo 24 abonos permitidos"
      );
    }

    if (!VALIDADORES.numeroPositivo(formData.abonoMinimo)) {
      nuevosErrores.abonoMinimo = establecerError(
        "abonoMinimo",
        "El abono mínimo debe ser mayor a 0"
      );
    } else {
      const totalMinimo =
        parseFloat(formData.abonoMinimo) * parseInt(formData.numeroAbonos);
      const montoTotal = parseFloat(formData.montoTotal);

      if (totalMinimo < montoTotal) {
        const diferencia = (montoTotal - totalMinimo).toFixed(2);
        nuevosErrores.abonoMinimo = establecerError(
          "abonoMinimo",
          `Insuficiente. Faltan ${diferencia} para cubrir el total`
        );
      }
    }

    if (
      !formData.fechaPrimerAbono &&
      pagoSeleccionado?.estado !== "FINALIZADO"
    ) {
      nuevosErrores.fechaPrimerAbono = establecerError(
        "fechaPrimerAbono",
        "La fecha del próximo abono es obligatoria"
      );
    } else if (formData.fechaPrimerAbono) {
      const fechaAbono = normalizarFecha(formData.fechaPrimerAbono);
      const hoy = normalizarFecha(new Date());

      if (fechaAbono < hoy) {
        nuevosErrores.fechaPrimerAbono = establecerError(
          "fechaPrimerAbono",
          "La fecha no puede ser en el pasado"
        );
      }
    }

    if (!VALIDADORES.longitudMinima(formData.numeroContrato, 3)) {
      nuevosErrores.numeroContrato = establecerError(
        "numeroContrato",
        !formData.numeroContrato.trim()
          ? "El número de contrato es obligatorio"
          : "El número de contrato debe tener al menos 3 caracteres"
      );
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }, [formData, pagoSeleccionado, normalizarFecha, establecerError]);

  const scrollAPrimerError = useCallback(() => {
    if (primerCampoConError.current) {
      const elemento = document.getElementById(primerCampoConError.current);
      if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        elemento.focus();
      }
    }
  }, []);

  return {
    formData,
    errores,
    guardando,
    setGuardando,
    manejarCambio,
    validarFormulario,
    scrollAPrimerError,
  };
};

const ModalEditarAbono = ({
  abierto,
  onCerrar,
  onGuardar,
  pagoSeleccionado,
}) => {
  const {
    formData,
    errores,
    guardando,
    setGuardando,
    manejarCambio,
    validarFormulario,
    scrollAPrimerError,
  } = useEditarAbonoForm(pagoSeleccionado, abierto);

  const manejarGuardar = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      scrollAPrimerError();
      return;
    }

    setGuardando(true);

    try {
      const token = localStorage.getItem("token");

      const datosActualizados = {
        monto_total: parseFloat(formData.montoTotal),
        numero_abonos: parseInt(formData.numeroAbonos),
        frecuencia_pago: formData.frecuenciaPago,
        fecha_finalizacion: formData.fechaPrimerAbono || null,
        observaciones: formData.observaciones || null,
      };

      const response = await axios.put(
        `http://127.0.0.1:8000/api/pagos/${pagoSeleccionado.id}`,
        datosActualizados,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      await Swal.fire({
        title: "¡Actualizado!",
        text: "El contrato ha sido actualizado correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      if (onGuardar) {
        await onGuardar();
      }

      onCerrar();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      const mensajeError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "No se pudo actualizar el pago";

      await Swal.fire({
        title: "Error",
        text: mensajeError,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setGuardando(false);
    }
  };

  const manejarCerrar = useCallback(() => {
    if (!guardando) {
      onCerrar();
    }
  }, [guardando, onCerrar]);

  const manejarClickOverlay = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        manejarCerrar();
      }
    },
    [manejarCerrar]
  );

  useEffect(() => {
    const manejarTecla = (e) => {
      if (e.key === "Escape" && abierto) {
        manejarCerrar();
      }
    };

    if (abierto) {
      document.addEventListener("keydown", manejarTecla);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", manejarTecla);
      document.body.style.overflow = "";
    };
  }, [abierto, manejarCerrar]);

  if (!abierto) return null;

  return (
    <div className="modal-editar-abono-overlay" onClick={manejarClickOverlay}>
      <div
        className="modal-editar-abono-contenedor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-editar-abono-header">
          <div className="modal-editar-abono-header-contenido">
            <div className="modal-editar-abono-icono-header">
              <FileText size={32} />
            </div>
            <div className="modal-editar-abono-textos-header">
              <h2 className="modal-editar-abono-titulo">
                Editar Contrato de Pago
              </h2>
              <p className="modal-editar-abono-subtitulo">
                Actualiza la información del contrato #
                {pagoSeleccionado?.numeroContrato || "N/A"}
              </p>
              <div className="modal-editar-abono-metadata">
                <span className="modal-editar-abono-metadata-item">
                  <User size={14} />
                  {pagoSeleccionado?.cliente?.nombre || "Sin cliente"}
                </span>
                <span className="modal-editar-abono-metadata-item">
                  <Calendar size={14} />
                  Creado: {new Date().toLocaleDateString("es-MX")}
                </span>
                <span className="modal-editar-abono-metadata-item estado">
                  <Clock size={14} />
                  Estado: {pagoSeleccionado?.estado || "Activo"}
                </span>
              </div>
            </div>
          </div>
          <button
            className="modal-editar-abono-boton-cerrar"
            onClick={manejarCerrar}
            disabled={guardando}
            aria-label="Cerrar modal"
            title="Cerrar (Esc)"
          >
            <X size={22} />
          </button>
        </div>
        <div className="modal-editar-abono-contenido">
          <div className="modal-editar-abono-seccion">
            <div className="modal-editar-abono-seccion-header">
              <div className="modal-editar-abono-seccion-icono">
                <User size={18} />
              </div>
              <h3 className="modal-editar-abono-seccion-titulo">
                Información del Cliente
              </h3>
            </div>

            <div className="modal-editar-abono-grid">
              <div className="modal-editar-abono-campo">
                <label
                  htmlFor="nombreCliente"
                  className="modal-editar-abono-label"
                >
                  Nombre Completo{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <input
                  type="text"
                  id="nombreCliente"
                  name="nombreCliente"
                  value={formData.nombreCliente}
                  onChange={manejarCambio}
                  className={`modal-editar-abono-input modal-editar-abono-input-sin-icono ${
                    errores.nombreCliente
                      ? "modal-editar-abono-input-error"
                      : ""
                  }`}
                  placeholder="Juan Pérez García"
                  disabled={guardando}
                  autoComplete="name"
                />
                {errores.nombreCliente && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.nombreCliente}
                  </span>
                )}
              </div>

              <div className="modal-editar-abono-campo">
                <label
                  htmlFor="emailCliente"
                  className="modal-editar-abono-label"
                >
                  Correo Electrónico{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <input
                  type="email"
                  id="emailCliente"
                  name="emailCliente"
                  value={formData.emailCliente}
                  onChange={manejarCambio}
                  className={`modal-editar-abono-input modal-editar-abono-input-sin-icono ${
                    errores.emailCliente ? "modal-editar-abono-input-error" : ""
                  }`}
                  placeholder="correo@ejemplo.com"
                  disabled={guardando}
                  autoComplete="email"
                />
                {errores.emailCliente && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.emailCliente}
                  </span>
                )}
              </div>

              <div className="modal-editar-abono-campo modal-editar-abono-campo-completo">
                <label
                  htmlFor="telefonoCliente"
                  className="modal-editar-abono-label"
                >
                  Teléfono de Contacto{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <input
                  type="tel"
                  id="telefonoCliente"
                  name="telefonoCliente"
                  value={formData.telefonoCliente}
                  onChange={manejarCambio}
                  className={`modal-editar-abono-input modal-editar-abono-input-sin-icono ${
                    errores.telefonoCliente
                      ? "modal-editar-abono-input-error"
                      : ""
                  }`}
                  placeholder="951-123-4567"
                  disabled={guardando}
                  autoComplete="tel"
                />
                {errores.telefonoCliente && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.telefonoCliente}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="modal-editar-abono-seccion">
            <div className="modal-editar-abono-seccion-header">
              <div className="modal-editar-abono-seccion-icono">
                <Calendar size={18} />
              </div>
              <h3 className="modal-editar-abono-seccion-titulo">
                Información del Servicio
              </h3>
            </div>

            <div className="modal-editar-abono-grid">
              <div className="modal-editar-abono-campo">
                <label
                  htmlFor="tipoServicio"
                  className="modal-editar-abono-label"
                >
                  Tipo de Servicio{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <select
                  id="tipoServicio"
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={manejarCambio}
                  className={`modal-editar-abono-select modal-editar-abono-select-sin-icono ${
                    errores.tipoServicio ? "modal-editar-abono-input-error" : ""
                  }`}
                  disabled={guardando}
                >
                  <option value="">Seleccionar tipo...</option>
                  {TIPOS_SERVICIO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errores.tipoServicio && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.tipoServicio}
                  </span>
                )}
              </div>

              <div className="modal-editar-abono-campo">
                <label htmlFor="fechaTour" className="modal-editar-abono-label">
                  Fecha del Tour{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <div className="modal-editar-abono-input-wrapper">
                  <Calendar
                    size={16}
                    className="modal-editar-abono-input-icono"
                  />
                  <input
                    type="date"
                    id="fechaTour"
                    name="fechaTour"
                    value={formData.fechaTour}
                    onChange={manejarCambio}
                    className={`modal-editar-abono-input-fecha ${
                      errores.fechaTour ? "modal-editar-abono-input-error" : ""
                    }`}
                    disabled={guardando}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {errores.fechaTour && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.fechaTour}
                  </span>
                )}
              </div>
              <div className="modal-editar-abono-campo modal-editar-abono-campo-completo">
                <label
                  htmlFor="descripcionServicio"
                  className="modal-editar-abono-label"
                >
                  Descripción del Servicio{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <textarea
                  id="descripcionServicio"
                  name="descripcionServicio"
                  value={formData.descripcionServicio}
                  onChange={manejarCambio}
                  className={`modal-editar-abono-textarea ${
                    errores.descripcionServicio
                      ? "modal-editar-abono-input-error"
                      : ""
                  }`}
                  placeholder="Describe detalladamente el servicio contratado..."
                  rows={3}
                  disabled={guardando}
                />
                {errores.descripcionServicio && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.descripcionServicio}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="modal-editar-abono-seccion">
            <div className="modal-editar-abono-seccion-header">
              <div className="modal-editar-abono-seccion-icono">
                <DollarSign size={18} />
              </div>
              <h3 className="modal-editar-abono-seccion-titulo">
                Plan de Pago
              </h3>
            </div>

            <div className="modal-editar-abono-grid">
              <div className="modal-editar-abono-campo">
                <label
                  htmlFor="montoTotal"
                  className="modal-editar-abono-label"
                >
                  Monto Total{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <div className="modal-editar-abono-input-wrapper">
                  <DollarSign
                    size={16}
                    className="modal-editar-abono-input-icono"
                  />
                  <input
                    type="number"
                    id="montoTotal"
                    name="montoTotal"
                    value={formData.montoTotal}
                    onChange={manejarCambio}
                    className={`modal-editar-abono-input-fecha ${
                      errores.montoTotal ? "modal-editar-abono-input-error" : ""
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={guardando}
                  />
                </div>
                {errores.montoTotal && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.montoTotal}
                  </span>
                )}
              </div>
              <div className="modal-editar-abono-campo">
                <label
                  htmlFor="numeroAbonos"
                  className="modal-editar-abono-label"
                >
                  Número de Abonos{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <div className="modal-editar-abono-input-wrapper">
                  <Hash size={16} className="modal-editar-abono-input-icono" />
                  <input
                    type="number"
                    id="numeroAbonos"
                    name="numeroAbonos"
                    value={formData.numeroAbonos}
                    onChange={manejarCambio}
                    className={`modal-editar-abono-input-fecha ${
                      errores.numeroAbonos
                        ? "modal-editar-abono-input-error"
                        : ""
                    }`}
                    placeholder="0"
                    min="1"
                    max="24"
                    disabled={guardando}
                  />
                </div>
                {errores.numeroAbonos && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.numeroAbonos}
                  </span>
                )}
              </div>
              <div className="modal-editar-abono-campo">
                <label
                  htmlFor="abonoMinimo"
                  className="modal-editar-abono-label"
                >
                  Abono Mínimo{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <div className="modal-editar-abono-input-wrapper">
                  <DollarSign
                    size={16}
                    className="modal-editar-abono-input-icono"
                  />
                  <input
                    type="number"
                    id="abonoMinimo"
                    name="abonoMinimo"
                    value={formData.abonoMinimo}
                    onChange={manejarCambio}
                    className={`modal-editar-abono-input-fecha ${
                      errores.abonoMinimo
                        ? "modal-editar-abono-input-error"
                        : ""
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={guardando}
                  />
                </div>
                {errores.abonoMinimo && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.abonoMinimo}
                  </span>
                )}
              </div>
              <div className="modal-editar-abono-campo">
                <label
                  htmlFor="frecuenciaPago"
                  className="modal-editar-abono-label"
                >
                  Frecuencia de Pago{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <select
                  id="frecuenciaPago"
                  name="frecuenciaPago"
                  value={formData.frecuenciaPago}
                  onChange={manejarCambio}
                  className="modal-editar-abono-select modal-editar-abono-select-sin-icono"
                  disabled={guardando}
                >
                  {FRECUENCIAS_PAGO.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-editar-abono-campo">
                <label
                  htmlFor="fechaPrimerAbono"
                  className="modal-editar-abono-label"
                >
                  Próximo Vencimiento{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <div className="modal-editar-abono-input-wrapper">
                  <Calendar
                    size={16}
                    className="modal-editar-abono-input-icono"
                  />
                  <input
                    type="date"
                    id="fechaPrimerAbono"
                    name="fechaPrimerAbono"
                    value={formData.fechaPrimerAbono}
                    onChange={manejarCambio}
                    className={`modal-editar-abono-input-fecha ${
                      errores.fechaPrimerAbono
                        ? "modal-editar-abono-input-error"
                        : ""
                    }`}
                    disabled={guardando}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {errores.fechaPrimerAbono && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.fechaPrimerAbono}
                  </span>
                )}
              </div>
              <div className="modal-editar-abono-campo">
                <label
                  htmlFor="numeroContrato"
                  className="modal-editar-abono-label"
                >
                  Número de Contrato{" "}
                  <span className="modal-editar-abono-label-requerido">*</span>
                </label>
                <input
                  type="text"
                  id="numeroContrato"
                  name="numeroContrato"
                  value={formData.numeroContrato}
                  onChange={manejarCambio}
                  className={`modal-editar-abono-input modal-editar-abono-input-sin-icono ${
                    errores.numeroContrato
                      ? "modal-editar-abono-input-error"
                      : ""
                  }`}
                  placeholder="CONT-001"
                  disabled={guardando}
                />
                {errores.numeroContrato && (
                  <span className="modal-editar-abono-mensaje-error">
                    <AlertCircle size={14} />
                    {errores.numeroContrato}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="modal-editar-abono-seccion">
            <div className="modal-editar-abono-seccion-header">
              <div className="modal-editar-abono-seccion-icono">
                <FileText size={18} />
              </div>
              <h3 className="modal-editar-abono-seccion-titulo">
                Observaciones
              </h3>
            </div>

            <div className="modal-editar-abono-campo">
              <label
                htmlFor="observaciones"
                className="modal-editar-abono-label"
              >
                Notas Adicionales
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={manejarCambio}
                className="modal-editar-abono-textarea"
                placeholder="Agrega cualquier nota o detalle adicional sobre este contrato..."
                rows={4}
                disabled={guardando}
              />
            </div>
          </div>
        </div>
        <div className="modal-editar-abono-footer">
          <div className="modal-editar-abono-footer-info">
            <Info size={16} />
            <span>Los campos con * son obligatorios</span>
          </div>

          <div className="modal-editar-abono-acciones">
            <button
              type="button"
              className="modal-editar-abono-boton modal-editar-abono-boton-cancelar"
              onClick={manejarCerrar}
              disabled={guardando}
            >
              <X size={18} />
              Cancelar
            </button>

            <button
              type="button"
              className="modal-editar-abono-boton modal-editar-abono-boton-guardar"
              onClick={manejarGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <div className="modal-editar-abono-spinner"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarAbono;
