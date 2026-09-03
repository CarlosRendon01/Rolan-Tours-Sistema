import { useState, useEffect, useCallback } from "react";
import { X, Save, Upload } from "lucide-react";
import "./ModalEditarReserva.css";
import Swal from "sweetalert2";

const ModalEditarReserva = ({ reserva, onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState({
    // Editables
    folio: "",
    fechaReserva: "",
    numHabitantes: "",
    incluye: "",
    noIncluye: "",
    formaPago: "",
    pagado: "no pagado",
    fotoTransferencia: null,
    // Solo lectura (vienen de cotizacion->cliente)
    nombreCliente: "",
    telefono: "",
    numPasajeros: "",
    importe: "",
    servicio: "",
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (reserva) {
      setFormData({
        folio: reserva.folio || "",
        fechaReserva: reserva.fechaReserva || new Date().toISOString().split("T")[0],
        numHabitantes: reserva.numHabitantes || "",
        incluye: reserva.incluye || "",
        noIncluye: reserva.noIncluye || "",
        formaPago: reserva.formaPago || "",
        pagado: reserva.pagado || "no pagado",
        fotoTransferencia: reserva.fotoTransferencia || null,
        // Solo lectura
        nombreCliente: reserva.nombreCliente || "",
        telefono: reserva.telefono || "",
        numPasajeros: reserva.numPasajeros || "",
        importe: reserva.importe || "",
        servicio: reserva.servicio || "",
      });
    }
  }, [reserva]);

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErrores((prev) => {
      const nuevos = { ...prev };
      delete nuevos[nombreCampo];
      return nuevos;
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) limpiarErrorCampo(name);
  }, [errores, limpiarErrorCampo]);

  const handleFileChange = useCallback((e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (errores[name]) limpiarErrorCampo(name);
    }
  }, [errores, limpiarErrorCampo]);

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    if (!formData.fechaReserva)
      nuevosErrores.fechaReserva = "La fecha de reserva es requerida";

    if (!formData.numHabitantes || isNaN(formData.numHabitantes) || parseInt(formData.numHabitantes) <= 0)
      nuevosErrores.numHabitantes = "Debe ser un número mayor a 0";

    if (!formData.formaPago)
      nuevosErrores.formaPago = "Seleccione una forma de pago";

    if (formData.formaPago === "transferencia" && !formData.fotoTransferencia)
      nuevosErrores.fotoTransferencia = "Debe subir la foto de la transferencia";

    return nuevosErrores;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setTimeout(() => {
        const primer = Object.keys(nuevosErrores)[0];
        const el = document.querySelector(`[name="${primer}"]`);
        if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      }, 100);
      return;
    }

    setGuardando(true);

    try {
      const reservaData = {
        folio: parseInt(formData.folio),
        fecha_reserva: formData.fechaReserva,
        num_habitantes: parseInt(formData.numHabitantes),
        incluye: formData.incluye,
        no_incluye: formData.noIncluye,
        forma_pago: formData.formaPago,
        pagado: formData.pagado,
        fotoTransferencia: formData.fotoTransferencia,
      };

      const folioReserva = formData.folio;
      const nombreCliente = formData.nombreCliente;

      await onGuardar(reservaData);
      onCerrar();

      await new Promise((resolve) => setTimeout(resolve, 300));
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
      });
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
      });
    } finally {
      setGuardando(false);
    }
  }, [formData, validarFormulario, onGuardar, onCerrar]);

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return <span className="meg-error-mensaje">{error}</span>;
  };

  const estiloReadOnly = {
    backgroundColor: "#f3f4f6",
    cursor: "not-allowed",
    color: "#6b7280",
  };

  return (
    <div className="meg-overlay" onClick={onCerrar}>
      <div className="meg-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="meg-header">
          <h2>Editar Reserva</h2>
          <button className="meg-btn-cerrar" onClick={onCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="meg-form">

          {/* Folio - solo lectura */}
          <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="meg-form-group">
              <label htmlFor="folio">Folio</label>
              <input
                type="number"
                id="folio"
                name="folio"
                value={formData.folio}
                readOnly
                style={estiloReadOnly}
              />
            </div>
          </div>

          {/* Fecha reserva + Habitantes */}
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
                disabled={guardando}
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
                disabled={guardando}
                min="1"
              />
              <MensajeError nombreCampo="numHabitantes" />
            </div>
          </div>

          {/* Nombre cliente - solo lectura */}
          <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="meg-form-group">
              <label>Nombre Cliente</label>
              <input
                type="text"
                value={formData.nombreCliente}
                readOnly
                style={estiloReadOnly}
              />
            </div>
          </div>

          {/* Pasajeros, teléfono, importe - solo lectura */}
          <div className="meg-form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="meg-form-group">
              <label>N° Pasajeros</label>
              <input
                type="number"
                value={formData.numPasajeros}
                readOnly
                style={estiloReadOnly}
              />
            </div>

            <div className="meg-form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                readOnly
                style={estiloReadOnly}
              />
            </div>

            <div className="meg-form-group">
              <label>Importe (MXN)</label>
              <input
                type="number"
                value={formData.importe}
                readOnly
                style={estiloReadOnly}
              />
            </div>
          </div>

          {/* Servicio - solo lectura */}
          <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="meg-form-group">
              <label>Servicio</label>
              <textarea
                value={formData.servicio}
                readOnly
                rows="3"
                style={estiloReadOnly}
              />
            </div>
          </div>

          {/* Incluye - editable */}
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
                disabled={guardando}
              />
            </div>
          </div>

          {/* No incluye - editable */}
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
                disabled={guardando}
              />
            </div>
          </div>

          {/* Forma pago + estado pago - editables */}
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
                disabled={guardando}
              >
                <option value="">Seleccionar</option>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
              </select>
              <MensajeError nombreCampo="formaPago" />
            </div>

            <div className="meg-form-group">
              <label htmlFor="pagado">Estado de Pago</label>
              <select
                id="pagado"
                name="pagado"
                value={formData.pagado}
                onChange={handleChange}
                disabled={guardando}
              >
                <option value="pagado">Pagado</option>
                <option value="no pagado">No Pagado</option>
              </select>
            </div>
          </div>

          {/* Foto transferencia - editable */}
          {formData.formaPago === "transferencia" && (
            <div className="meg-form-grid" style={{ gridTemplateColumns: "1fr" }}>
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
            <button type="button" className="meg-btn-cancelar" onClick={onCerrar}>
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
              <span>{guardando ? "Actualizando..." : "Actualizar Reserva"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarReserva;