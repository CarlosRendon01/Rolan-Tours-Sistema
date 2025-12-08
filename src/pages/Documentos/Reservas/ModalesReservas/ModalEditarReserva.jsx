import { useState, useEffect, useCallback } from "react";
import { X, Save, Upload } from "lucide-react";
import "./ModalEditarReserva.css";
import Swal from "sweetalert2";

const ModalEditarReserva = ({ reserva, onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    folio: "",
    fechaReserva: "",
    numHabitantes: "",
    nombreCliente: "",
    numPasajeros: "",
    telefono: "",
    importe: "",
    servicio: "",
    incluye: "",
    noIncluye: "",
    formaPago: "",
    pagado: "no pagado",
    fotoTransferencia: null,
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (reserva) {
      setFormData({
        folio: reserva.folio || "",
        fechaReserva:
          reserva.fechaReserva || new Date().toISOString().split("T")[0],
        numHabitantes: reserva.numHabitantes || "",
        nombreCliente: reserva.nombreCliente || "",
        numPasajeros: reserva.numPasajeros || "",
        telefono: reserva.telefono || "",
        importe: reserva.importe || "",
        servicio: reserva.servicio || "",
        incluye: reserva.incluye || "",
        noIncluye: reserva.noIncluye || "",
        formaPago: reserva.formaPago || "",
        pagado: reserva.pagado || "no pagado",
        fotoTransferencia: reserva.fotoTransferencia || null,
      });
    }
  }, [reserva]);

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErrores((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[nombreCampo];
      return nuevosErrores;
    });
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errores[name]) {
        limpiarErrorCampo(name);
      }
    },
    [errores, limpiarErrorCampo]
  );

  const handleFileChange = useCallback(
    (e) => {
      const { name, files } = e.target;
      if (files && files[0]) {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));

        if (errores[name]) {
          limpiarErrorCampo(name);
        }
      }
    },
    [errores, limpiarErrorCampo]
  );

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    if (!formData.folio || isNaN(formData.folio)) {
      nuevosErrores.folio = "El folio es requerido y debe ser numérico";
    }

    if (!formData.fechaReserva) {
      nuevosErrores.fechaReserva = "La fecha de reserva es requerida";
    }

    if (
      !formData.numHabitantes ||
      isNaN(formData.numHabitantes) ||
      parseInt(formData.numHabitantes) <= 0
    ) {
      nuevosErrores.numHabitantes = "Debe ser un número mayor a 0";
    }

    if (!formData.nombreCliente.trim()) {
      nuevosErrores.nombreCliente = "El nombre del cliente es requerido";
    }

    if (
      !formData.numPasajeros ||
      isNaN(formData.numPasajeros) ||
      parseInt(formData.numPasajeros) <= 0
    ) {
      nuevosErrores.numPasajeros = "Debe ser un número mayor a 0";
    }

    const telefonoRegex = /^\d{10}$/;
    if (!formData.telefono || !telefonoRegex.test(formData.telefono)) {
      nuevosErrores.telefono = "Debe tener 10 dígitos";
    }
    if (
      !formData.importe ||
      isNaN(formData.importe) ||
      parseFloat(formData.importe) <= 0
    ) {
      nuevosErrores.importe = "El importe debe ser mayor a 0";
    }

    if (!formData.servicio.trim()) {
      nuevosErrores.servicio = "El servicio es requerido";
    }

    if (!formData.formaPago) {
      nuevosErrores.formaPago = "Seleccione una forma de pago";
    }

    if (formData.formaPago === "transferencia" && !formData.fotoTransferencia) {
      nuevosErrores.fotoTransferencia =
        "Debe subir la foto de la transferencia";
    }

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const nuevosErrores = validarFormulario();

      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);

        setTimeout(() => {
          const primerCampoConError = Object.keys(nuevosErrores)[0];
          const elemento = document.querySelector(
            `[name="${primerCampoConError}"]`
          );
          if (elemento) {
            elemento.focus();
            elemento.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);

        return;
      }

      setGuardando(true);

      try {
        const reservaData = {
          ...reserva,
          folio: parseInt(formData.folio),
          fechaReserva: formData.fechaReserva,
          numHabitantes: parseInt(formData.numHabitantes),
          nombreCliente: formData.nombreCliente,
          numPasajeros: parseInt(formData.numPasajeros),
          telefono: formData.telefono,
          importe: parseFloat(formData.importe),
          servicio: formData.servicio,
          incluye: formData.incluye,
          noIncluye: formData.noIncluye,
          formaPago: formData.formaPago,
          pagado: formData.pagado,
          fotoTransferencia: formData.fotoTransferencia,
        };

        const nombreCliente = formData.nombreCliente;
        const folioReserva = formData.folio;

        await onGuardar(reservaData);

        console.log("✅ Reserva actualizada, cerrando modal primero...");

        onCerrar();

        await new Promise((resolve) => setTimeout(resolve, 300));

        console.log("✅ Mostrando alerta...");
        await Swal.fire({
          icon: "success",
          title: "¡Reserva Actualizada!",
          html: `
      <div style="font-size: 1.1rem; margin-top: 15px;">
        <strong style="color: #2563eb; font-size: 1.3rem;">Folio: ${folioReserva}</strong>
        <p style="margin-top: 10px; color: #64748b;">Cliente: ${nombreCliente}</p>
        <p style="color: #64748b;">La reserva ha sido actualizada correctamente</p>
      </div>
    `,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#2563eb",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: true,
          allowOutsideClick: true,
          allowEscapeKey: true,
          width: "500px",
          padding: "2rem",
          backdrop: `rgba(0,0,0,0.6)`,
          customClass: {
            popup: "swal-popup-custom-reserva",
            title: "swal-title-custom-reserva",
            htmlContainer: "swal-html-custom-reserva",
            confirmButton: "swal-confirm-custom-reserva",
          },
        });

        console.log("✅ Alerta cerrada");
      } catch (error) {
        console.error("❌ Error al actualizar:", error);

        onCerrar();

        await new Promise((resolve) => setTimeout(resolve, 300));

        await Swal.fire({
          icon: "error",
          title: "Error al Actualizar",
          html: `
      <div style="font-size: 1rem; margin-top: 10px; color: #64748b;">
        <p>Hubo un problema al actualizar la reserva.</p>
        <p style="margin-top: 8px;">Por favor, inténtalo de nuevo.</p>
      </div>
    `,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#ef4444",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: true,
        });
      } finally {
        setGuardando(false);
      }
    },
    [formData, validarFormulario, onGuardar, reserva, onCerrar]
  );

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="meg-error-mensaje">{error}</span>;
  };

  return (
    <div className="meg-overlay" onClick={onCerrar}>
      <div
        className="meg-contenido modal-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="meg-header">
          <h2>Editar Reserva</h2>
          <button className="meg-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="meg-form">
          <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="meg-form-group">
              <label htmlFor="folio">
                Folio <span className="meg-required">*</span>
              </label>
              <input
                type="number"
                id="folio"
                name="folio"
                value={formData.folio}
                onChange={handleChange}
                className={errores.folio ? "input-error" : ""}
                placeholder="Ej: 1001"
                readOnly
              />
              <MensajeError nombreCampo="folio" />
            </div>
          </div>

          <div className="meg-form-grid">
            <div className="meg-form-group">
              <label htmlFor="fechaReserva">
                Fecha de Reserva <span className="meg-required">*</span>
              </label>
              <input
                type="date"
                id="fechaReserva"
                name="fechaReserva"
                value={formData.fechaReserva}
                onChange={handleChange}
                className={errores.fechaReserva ? "input-error" : ""}
              />
              <MensajeError nombreCampo="fechaReserva" />
            </div>

            <div className="meg-form-group">
              <label htmlFor="numHabitantes">
                N° Habitantes <span className="meg-required">*</span>
              </label>
              <input
                type="number"
                id="numHabitantes"
                name="numHabitantes"
                value={formData.numHabitantes}
                onChange={handleChange}
                className={errores.numHabitantes ? "input-error" : ""}
                placeholder="Ej: 2"
                min="1"
              />
              <MensajeError nombreCampo="numHabitantes" />
            </div>
          </div>

          <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="meg-form-group">
              <label htmlFor="nombreCliente">
                Nombre Cliente <span className="meg-required">*</span>
              </label>
              <input
                type="text"
                id="nombreCliente"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleChange}
                className={errores.nombreCliente ? "input-error" : ""}
                placeholder="Ej: Juan Pérez García"
                readOnly
              />
              <MensajeError nombreCampo="nombreCliente" />
            </div>
          </div>

          <div
            className="meg-form-grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            <div className="meg-form-group">
              <label htmlFor="numPasajeros">
                N° Pasajeros <span className="meg-required">*</span>
              </label>
              <input
                type="number"
                id="numPasajeros"
                name="numPasajeros"
                value={formData.numPasajeros}
                onChange={handleChange}
                className={errores.numPasajeros ? "input-error" : ""}
                placeholder="Ej: 4"
                min="1"
                readOnly
              />
              <MensajeError nombreCampo="numPasajeros" />
            </div>

            <div className="meg-form-group">
              <label htmlFor="telefono">
                Teléfono <span className="meg-required">*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={errores.telefono ? "input-error" : ""}
                placeholder="9511234567"
                maxLength="10"
                readOnly
              />
              <MensajeError nombreCampo="telefono" />
            </div>

            <div className="meg-form-group">
              <label htmlFor="importe">
                Importe (MXN) <span className="meg-required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                id="importe"
                name="importe"
                value={formData.importe}
                onChange={handleChange}
                className={errores.importe ? "input-error" : ""}
                placeholder="1500.00"
              />
              <MensajeError nombreCampo="importe" />
            </div>
          </div>

          <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="meg-form-group">
              <label htmlFor="servicio">
                Servicio <span className="meg-required">*</span>
              </label>
              <textarea
                id="servicio"
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                className={errores.servicio ? "input-error" : ""}
                placeholder="Descripción del servicio..."
                rows="3"
                readOnly
              />
              <MensajeError nombreCampo="servicio" />
            </div>
          </div>

          <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="meg-form-group">
              <label htmlFor="incluye">Incluye</label>
              <textarea
                id="incluye"
                name="incluye"
                value={formData.incluye}
                onChange={handleChange}
                placeholder="Qué incluye el servicio..."
                rows="3"
              />
            </div>
          </div>

          <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="meg-form-group">
              <label htmlFor="noIncluye">No Incluye</label>
              <textarea
                id="noIncluye"
                name="noIncluye"
                value={formData.noIncluye}
                onChange={handleChange}
                placeholder="Qué no incluye el servicio..."
                rows="3"
              />
            </div>
          </div>

          <div className="meg-form-grid">
            <div className="meg-form-group">
              <label htmlFor="formaPago">
                Forma de Pago <span className="meg-required">*</span>
              </label>
              <select
                id="formaPago"
                name="formaPago"
                value={formData.formaPago}
                onChange={handleChange}
                className={errores.formaPago ? "input-error" : ""}
              >
                <option value="">Seleccionar</option>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
              </select>
              <MensajeError nombreCampo="formaPago" />
            </div>

            <div className="meg-form-group">
              <label htmlFor="pagado">
                Estado de Pago <span className="meg-required">*</span>
              </label>
              <select
                id="pagado"
                name="pagado"
                value={formData.pagado}
                onChange={handleChange}
              >
                <option value="pagado">Pagado</option>
                <option value="no pagado">No Pagado</option>
              </select>
            </div>
          </div>

          {formData.formaPago === "transferencia" && (
            <div
              className="meg-form-grid"
              style={{ gridTemplateColumns: "1fr" }}
            >
              <div className="meg-form-group-file">
                <label htmlFor="fotoTransferencia">
                  <Upload size={20} />
                  Foto de Transferencia <span className="meg-required">*</span>
                </label>
                <input
                  type="file"
                  id="fotoTransferencia"
                  name="fotoTransferencia"
                  onChange={handleFileChange}
                  accept="image/*"
                  className={errores.fotoTransferencia ? "input-error" : ""}
                />
                {formData.fotoTransferencia && (
                  <span className="meg-file-name">
                    {typeof formData.fotoTransferencia === "string"
                      ? "Archivo existente"
                      : formData.fotoTransferencia.name}
                  </span>
                )}
                <MensajeError nombreCampo="fotoTransferencia" />
              </div>
            </div>
          )}
        </form>

        <div className="meg-footer">
          <div className="meg-botones-izquierda">
            <button
              type="button"
              className="meg-btn-cancelar"
              onClick={onCerrar}
            >
              Cancelar
            </button>
          </div>
          <div className="meg-botones-derecha">
            <button
              type="button"
              className={`meg-btn-actualizar ${guardando ? "loading" : ""}`}
              disabled={guardando}
              onClick={handleSubmit}
            >
              {!guardando && <Save size={20} />}
              <span>
                {guardando ? "Actualizando..." : "Actualizar Reserva"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarReserva;
