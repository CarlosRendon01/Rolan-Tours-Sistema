import React, { useState, useEffect, useCallback } from "react";
import "./nuevaCotizacion.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NuevaCotizacion = ({
  onGuardarCotizacion,
  cotizacionEditar,
  onCancelarEdicion,
}) => {
  const [activo, setActivo] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [erroresCampos, setErroresCampos] = useState({});
  const [formData, setFormData] = useState({
    folio: "",
    fechaSalida: "",
    fechaRegreso: "",
    dias: "",
    totalKilometros: "",
    costoCasetas: "",
    tipoCaminos: "terraceria",
    estado: "",
    tipoCliente: "",
    atiende: "",
    id: "",
    cliente: "",
    nombreLead: "",
    nombreResponsable: "",
    estadoCotizacion: "inactivo",
    medioContacto: "",
    servicioTransporte: "",
    tipoServicio: "",
    pax: "",
    tipoClienteNum: "",
    origenServicio: "Oaxaca",
    puntoIntermedio: "",
    destinoServicio: "",
    vehiculoRequerido: "",
    campana: "",
    fechaCreacion: new Date().toISOString().split("T")[0],
    tipoClienteFrec: "solo_una_vez",
    precio: "",
    descripcion: "",
  });

  const generarFolioAutomatico = useCallback(() => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    return `${año}${mes}${dia}${timestamp}`;
  }, []);

  const validarPaso = useCallback(
    (paso) => {
      const camposObligatorios = {
        1: [
          { campo: "cliente", nombre: "Cliente" },
          { campo: "nombreResponsable", nombre: "Nombre Responsable" },
        ],
        2: [
          { campo: "medioContacto", nombre: "N° Télefonico" },
          { campo: "pax", nombre: "N° pasajeros" },
          { campo: "puntoIntermedio", nombre: "Punto Intermedio" },
          { campo: "destinoServicio", nombre: "Destino Servicio" },
        ],
        3: [
          { campo: "fechaSalida", nombre: "Fecha Salida" },
          { campo: "fechaRegreso", nombre: "Fecha Regreso" },
        ],
      };

      const camposDelPaso = camposObligatorios[paso];
      const errores = {};

      camposDelPaso.forEach(({ campo, nombre }) => {
        if (!formData[campo] || formData[campo].toString().trim() === "") {
          errores[campo] = `${nombre} es obligatorio`;
        }
      });

      return errores;
    },
    [formData]
  );

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErroresCampos((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[nombreCampo];
      return nuevosErrores;
    });
  }, []);

  const limpiarTodosErrores = useCallback(() => {
    setErroresCampos({});
  }, []);

  const cerrarModal = useCallback(() => {
    setMostrarModal(false);
    setPasoActual(1);
    setModoEdicion(false);
    limpiarTodosErrores();
    if (onCancelarEdicion) {
      onCancelarEdicion();
    }
    setFormData({
      folio: generarFolioAutomatico(),
      fechaSalida: "",
      fechaRegreso: "",
      dias: "",
      totalKilometros: "",
      costoCasetas: "",
      tipoCaminos: "terraceria",
      estado: "",
      tipoCliente: "",
      atiende: "",
      id: "",
      cliente: "",
      nombreLead: "",
      nombreResponsable: "",
      estadoCotizacion: "inactivo",
      medioContacto: "",
      servicioTransporte: "",
      tipoServicio: "",
      pax: "",
      tipoClienteNum: "",
      origenServicio: "Oaxaca",
      puntoIntermedio: "",
      destinoServicio: "",
      vehiculoRequerido: "",
      campana: "",
      fechaCreacion: new Date().toISOString().split("T")[0],
      tipoClienteFrec: "solo_una_vez",
      precio: "",
      descripcion: "",
    });
  }, [onCancelarEdicion, generarFolioAutomatico, limpiarTodosErrores]);

  useEffect(() => {
    if (cotizacionEditar) {
      setModoEdicion(true);
      setFormData({
        folio: cotizacionEditar.folio || "",
        fechaSalida: cotizacionEditar.fechaSalida || "",
        fechaRegreso: cotizacionEditar.fechaRegreso || "",
        dias: cotizacionEditar.dias || "",
        totalKilometros: cotizacionEditar.totalKilometros || "",
        costoCasetas: cotizacionEditar.costoCasetas || "",
        tipoCaminos: cotizacionEditar.tipoCaminos || "terraceria",
        estado: cotizacionEditar.estado || "",
        tipoCliente: cotizacionEditar.tipoCliente || "",
        atiende: cotizacionEditar.atiende || "",
        id: cotizacionEditar.id || "",
        cliente: cotizacionEditar.cliente || "",
        nombreLead: cotizacionEditar.nombreLead || "",
        nombreResponsable: cotizacionEditar.nombreResponsable || "",
        estadoCotizacion: cotizacionEditar.estadoCotizacion || "inactivo",
        medioContacto: cotizacionEditar.medioContacto || "",
        servicioTransporte: cotizacionEditar.servicioTransporte || "",
        tipoServicio: cotizacionEditar.tipoServicio || "",
        pax: cotizacionEditar.pax || "",
        tipoClienteNum: cotizacionEditar.tipoClienteNum || "",
        origenServicio: cotizacionEditar.origenServicio || "Oaxaca",
        puntoIntermedio: cotizacionEditar.puntoIntermedio || "",
        destinoServicio: cotizacionEditar.destinoServicio || "",
        vehiculoRequerido: cotizacionEditar.vehiculoRequerido || "",
        campana: cotizacionEditar.campana || "",
        fechaCreacion:
          cotizacionEditar.fechaCreacion ||
          new Date().toISOString().split("T")[0],
        tipoClienteFrec: cotizacionEditar.tipoClienteFrec || "solo_una_vez",
        precio: cotizacionEditar.precio || "",
        descripcion: cotizacionEditar.descripcion || "",
      });
      setMostrarModal(true);
      setPasoActual(1);
      limpiarTodosErrores();
    }
  }, [cotizacionEditar, limpiarTodosErrores]);

  const toggleBoton = () => {
    setActivo(!activo);
  };

  const abrirModal = useCallback(() => {
    setMostrarModal(true);
    setPasoActual(1);
    setModoEdicion(false);
    limpiarTodosErrores();

    setFormData({
      folio: generarFolioAutomatico(),
      fechaSalida: "",
      fechaRegreso: "",
      dias: "",
      totalKilometros: "",
      costoCasetas: "",
      tipoCaminos: "terraceria",
      estado: "",
      tipoCliente: "",
      atiende: "",
      id: "",
      cliente: "",
      nombreLead: "",
      nombreResponsable: "",
      estadoCotizacion: "inactivo",
      medioContacto: "",
      servicioTransporte: "",
      tipoServicio: "",
      pax: "",
      tipoClienteNum: "",
      origenServicio: "Oaxaca",
      puntoIntermedio: "",
      destinoServicio: "",
      vehiculoRequerido: "",
      campana: "",
      fechaCreacion: new Date().toISOString().split("T")[0],
      tipoClienteFrec: "solo_una_vez",
      precio: "",
      descripcion: "",
    });
  }, [generarFolioAutomatico, limpiarTodosErrores]);

  const calcularDias = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return "";
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    return dias > 0 ? dias.toString() : "";
  };

  useEffect(() => {
    const dias = calcularDias(formData.fechaSalida, formData.fechaRegreso);
    if (dias && dias !== formData.dias) {
      setFormData((prev) => ({
        ...prev,
        dias: dias,
      }));
    }
  }, [formData.fechaSalida, formData.fechaRegreso, formData.dias]);

  const siguientePaso = useCallback(() => {
    const errores = validarPaso(pasoActual);

    if (Object.keys(errores).length > 0) {
      setErroresCampos(errores);
      const primerCampoConError = Object.keys(errores)[0];
      const elemento = document.querySelector(
        `[name="${primerCampoConError}"]`
      );
      if (elemento) {
        elemento.focus();
        elemento.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return;
    }
    if (pasoActual < 3) {
      setPasoActual(pasoActual + 1);
    }
  }, [pasoActual, validarPaso]);

  const pasoAnterior = useCallback(() => {
    limpiarTodosErrores();

    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  }, [pasoActual, limpiarTodosErrores]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (erroresCampos[name] && newValue.trim() !== "") {
      limpiarErrorCampo(name);
    }

    if (name === "estadoCotizacion") {
      newValue = value === "activo";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const validarFormularioCompleto = useCallback(() => {
    const erroresPaso1 = validarPaso(1);
    const erroresPaso2 = validarPaso(2);
    const erroresPaso3 = validarPaso(3);

    return { ...erroresPaso1, ...erroresPaso2, ...erroresPaso3 };
  }, [validarPaso]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const erroresCompletos = validarFormularioCompleto();
      if (Object.keys(erroresCompletos).length > 0) {
        setErroresCampos(erroresCompletos);
        const erroresPaso1 = validarPaso(1);
        const erroresPaso2 = validarPaso(2);
        const erroresPaso3 = validarPaso(3);
        if (Object.keys(erroresPaso1).length > 0) {
          setPasoActual(1);
        } else if (Object.keys(erroresPaso2).length > 0) {
          setPasoActual(2);
        } else if (Object.keys(erroresPaso3).length > 0) {
          setPasoActual(3);
        }
        setTimeout(() => {
          const primerCampoConError = Object.keys(erroresCompletos)[0];
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
      const cotizacionData = {
        id: modoEdicion ? cotizacionEditar.id : Date.now(),
        ...formData,
      };
      if (onGuardarCotizacion) {
        onGuardarCotizacion(cotizacionData, modoEdicion);
      }

      cerrarModal();
    },
    [
      validarFormularioCompleto,
      validarPaso,
      modoEdicion,
      cotizacionEditar,
      formData,
      onGuardarCotizacion,
      cerrarModal,
    ]
  );

  const MensajeError = React.memo(({ nombreCampo }) => {
    const error = erroresCampos[nombreCampo];
    if (!error) return null;

    return (
      <div className="mensaje-error">
        <span className="icono-error">!</span>
        {error}
      </div>
    );
  });

  return (
    <div className="nCotización-container">
      <div className="botones-wrapper">
        <button
          title="Agregar cotización"
          className={`agregar-cotizacion ${activo ? "activo" : ""}`}
          onClick={toggleBoton}
        >
          <FontAwesomeIcon
            icon={activo ? faTimes : faPlus}
            fixedWidth
            className={`icono-verde ${activo ? "girar" : ""}`}
          />
        </button>
        {activo && (
          <button
            className="boton-agregar animar-aparicion"
            onClick={abrirModal}
          >
            Agregar cotización
          </button>
        )}
      </div>
      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="header-formulario">
              <h2>{modoEdicion ? "Editar Cotización" : "Nueva Cotización"}</h2>
              <div className="indicador-pasos">
                <span
                  className={`paso ${
                    pasoActual === 1
                      ? "activo"
                      : pasoActual > 1
                      ? "completado"
                      : ""
                  }`}
                >
                  1
                </span>
                <div className="linea-paso"></div>
                <span
                  className={`paso ${
                    pasoActual === 2
                      ? "activo"
                      : pasoActual > 2
                      ? "completado"
                      : ""
                  }`}
                >
                  2
                </span>
                <div className="linea-paso"></div>
                <span
                  className={`paso ${
                    pasoActual === 3
                      ? "activo"
                      : pasoActual > 3
                      ? "completado"
                      : ""
                  }`}
                >
                  3
                </span>
              </div>
            </div>

            <form className="formulario-cotizacion" onSubmit={handleSubmit}>
              {pasoActual === 1 && (
                <div className="paso-contenido">
                  <h3>Información General</h3>
                  <div className="fila">
                    <label>
                      ID:
                      <input
                        type="number"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        readOnly={modoEdicion}
                      />
                    </label>
                    <label>
                      Folio: <span className="required">*</span>
                      <input
                        type="text"
                        name="folio"
                        value={formData.folio}
                        onChange={handleInputChange}
                        readOnly
                        placeholder="Auto-generado"
                      />
                    </label>
                  </div>
                  <label>
                    Cliente: <span className="required">*</span>
                    <input
                      type="text"
                      name="cliente"
                      value={formData.cliente}
                      onChange={handleInputChange}
                      className={erroresCampos.cliente ? "campo-error" : ""}
                    />
                    <MensajeError nombreCampo="cliente" />
                  </label>

                  <div className="fila">
                    <label>
                      Nombre Lead: (Opcional)
                      <input
                        type="text"
                        name="nombreLead"
                        value={formData.nombreLead}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Nombre Responsable: <span className="required">*</span>
                      <input
                        type="text"
                        name="nombreResponsable"
                        value={formData.nombreResponsable}
                        onChange={handleInputChange}
                        className={
                          erroresCampos.nombreResponsable ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="nombreResponsable" />
                    </label>
                  </div>

                  <div className="fila">
                    <label>
                      Fecha Creación:
                      <input
                        type="date"
                        name="fechaCreacion"
                        value={formData.fechaCreacion}
                        onChange={handleInputChange}
                        readOnly
                      />
                    </label>
                    <label>
                      Estado Cotización:
                      <select
                        name="estadoCotizacion"
                        value={
                          formData.estadoCotizacion ? "activo" : "inactivo"
                        }
                        onChange={handleInputChange}
                      >
                        <option value="inactivo">Inactivo</option>
                        <option value="activo">Activo</option>
                      </select>
                    </label>
                  </div>

                  <div className="botones-navegacion">
                    <button
                      type="button"
                      onClick={cerrarModal}
                      className="btn-cancelar"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={siguientePaso}
                      className="btn-siguiente"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {pasoActual === 2 && (
                <div className="paso-contenido">
                  <h3>Datos del Servicio</h3>

                  <div className="fila">
                    <label>
                      N° Télefonico: <span className="required">*</span>
                      <input
                        type="text"
                        name="medioContacto"
                        value={formData.medioContacto}
                        onChange={handleInputChange}
                        className={
                          erroresCampos.medioContacto ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="medioContacto" />
                    </label>
                    <label>
                      Servicio Transporte:
                      <select
                        name="servicioTransporte"
                        value={formData.servicioTransporte}
                        onChange={handleInputChange}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="camioneta">Camioneta</option>
                        <option value="coche">Coche</option>
                      </select>
                    </label>
                  </div>

                  <div className="fila">
                    <label>
                      Tipo Servicio: (Opcional)
                      <input
                        type="text"
                        name="tipoServicio"
                        value={formData.tipoServicio}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Vehículo Requerido:
                      <select
                        name="vehiculoRequerido"
                        value={formData.vehiculoRequerido}
                        onChange={handleInputChange}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="aveo">Aveo</option>
                        <option value="suburban">Suburban</option>
                        <option value="taxi">Taxi</option>
                      </select>
                    </label>
                  </div>

                  <div className="fila">
                    <label>
                      N° pasajeros: <span className="required">*</span>
                      <input
                        type="number"
                        name="pax"
                        value={formData.pax}
                        onChange={handleInputChange}
                        className={erroresCampos.pax ? "campo-error" : ""}
                        min="1"
                      />
                      <MensajeError nombreCampo="pax" />
                    </label>
                    <label>
                      Tipo Cliente (Num): (Opcional)
                      <input
                        type="number"
                        name="tipoClienteNum"
                        value={formData.tipoClienteNum}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>

                  <label>
                    Origen Servicio:
                    <input
                      type="text"
                      name="origenServicio"
                      value={formData.origenServicio}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </label>

                  <label>
                    Punto Intermedio: <span className="required">*</span>
                    <input
                      type="text"
                      name="puntoIntermedio"
                      value={formData.puntoIntermedio}
                      onChange={handleInputChange}
                      className={
                        erroresCampos.puntoIntermedio ? "campo-error" : ""
                      }
                    />
                    <MensajeError nombreCampo="puntoIntermedio" />
                  </label>

                  <label>
                    Destino Servicio: <span className="required">*</span>
                    <input
                      type="text"
                      name="destinoServicio"
                      value={formData.destinoServicio}
                      onChange={handleInputChange}
                      className={
                        erroresCampos.destinoServicio ? "campo-error" : ""
                      }
                    />
                    <MensajeError nombreCampo="destinoServicio" />
                  </label>

                  <label>
                    Campaña: (Opcional)
                    <input
                      type="text"
                      name="campana"
                      value={formData.campana}
                      onChange={handleInputChange}
                    />
                  </label>

                  <div className="botones-navegacion">
                    <button
                      type="button"
                      onClick={pasoAnterior}
                      className="btn-anterior"
                    >
                      Anterior
                    </button>
                    <div className="botones-derecha">
                      <button
                        type="button"
                        onClick={cerrarModal}
                        className="btn-cancelar"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={siguientePaso}
                        className="btn-siguiente"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {pasoActual === 3 && (
                <div className="paso-contenido">
                  <h3>Detalles del Viaje</h3>

                  <div className="fila">
                    <label>
                      Fecha Salida: <span className="required">*</span>
                      <input
                        type="date"
                        name="fechaSalida"
                        value={formData.fechaSalida}
                        onChange={handleInputChange}
                        className={
                          erroresCampos.fechaSalida ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="fechaSalida" />
                    </label>
                    <label>
                      Fecha Regreso: <span className="required">*</span>
                      <input
                        type="date"
                        name="fechaRegreso"
                        value={formData.fechaRegreso}
                        onChange={handleInputChange}
                        className={
                          erroresCampos.fechaRegreso ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="fechaRegreso" />
                    </label>
                  </div>

                  <div className="fila">
                    <label>
                      Días:
                      <input
                        type="number"
                        name="dias"
                        value={formData.dias}
                        onChange={handleInputChange}
                        readOnly
                      />
                    </label>
                  </div>

                  <div className="fila">
                    <label>
                      Total Kilómetros: (Opcional)
                      <input
                        type="number"
                        name="totalKilometros"
                        value={formData.totalKilometros}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                      />
                    </label>
                    <label>
                      Costo Casetas: (Opcional)
                      <input
                        type="number"
                        name="costoCasetas"
                        value={formData.costoCasetas}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                      />
                    </label>
                  </div>

                  <div className="fila">
                    <label>
                      Tipo de Camino:
                      <select
                        name="tipoCaminos"
                        value={formData.tipoCaminos}
                        onChange={handleInputChange}
                      >
                        <option value="terraceria">Terracería</option>
                        <option value="pavimento">Pavimento</option>
                      </select>
                    </label>
                    <label>
                      Tipo Cliente:
                      <select
                        name="tipoClienteFrec"
                        value={formData.tipoClienteFrec}
                        onChange={handleInputChange}
                      >
                        <option value="solo_una_vez">Solo una vez</option>
                        <option value="frecuente">Frecuente</option>
                      </select>
                    </label>
                  </div>

                  <div className="fila">
                    <label>
                      Estado: (Opcional)
                      <input
                        type="text"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Atiende: (Opcional)
                      <input
                        type="text"
                        name="atiende"
                        value={formData.atiende}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>

                  <label>
                    Precio: (Opcional)
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </label>

                  <label>
                    Descripción: (Opcional)
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Descripción del servicio..."
                    />
                  </label>

                  <div className="botones-navegacion">
                    <button
                      type="button"
                      onClick={pasoAnterior}
                      className="btn-anterior"
                    >
                      Anterior
                    </button>
                    <div className="botones-derecha">
                      <button
                        type="button"
                        onClick={cerrarModal}
                        className="btn-cancelar"
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="btn-guardar">
                        {modoEdicion ? "Actualizar" : "Guardar"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevaCotizacion;
