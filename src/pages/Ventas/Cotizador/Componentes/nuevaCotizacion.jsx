import React, { useState, useEffect, useCallback } from "react";
import "./nuevaCotizacion.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NuevaCotizacion = ({
  onGuardarCotizacion,
  onGuardarCliente,
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
    horaSalida: "",
    horaRegreso: "",
    dias: "",
    totalKilometros: "",
    costoCasetas: "",
    tipoCaminos: "terraceria",
    tipoCliente: "",
    id: "",
    numeroLead: "",
    nombreResponsable: "",
    estadoCotizacion: "inactivo",
    servicioTransporte: "",
    tipoServicio: "",
    pax: "",
    origenServicio: "Oaxaca",
    puntoIntermedio: "",
    destinoServicio: "",
    vehiculoRequerido: "",
    campana: "",
    fechaCreacion: new Date().toISOString().split("T")[0],
    tipoClienteFrec: "solo_una_vez",
    precio: "",
    descripcion: "",
    transporte: "",
    restaurante: "",
    tour: "",
    hospedaje: "",
    extrasSeleccionados: [],
    total: "",
  });

  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    telefono: "",
    canalContacto: "",
  });

  const generarIdCliente = useCallback(() => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    return `CLI-${año}${mes}${dia}-${timestamp}`;
  }, []);

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
        1: [{ campo: "nombreResponsable", nombre: "Nombre Responsable" }],
        2: [
          { campo: "nombre", nombre: "Nombre", esCliente: true },
          {
            campo: "apellidoPaterno",
            nombre: "Apellido Paterno",
            esCliente: true,
          },
          {
            campo: "apellidoMaterno",
            nombre: "Apellido Materno",
            esCliente: true,
          },
          { campo: "email", nombre: "Email", esCliente: true },
          { campo: "telefono", nombre: "Teléfono", esCliente: true },
          {
            campo: "canalContacto",
            nombre: "Canal de Contacto",
            esCliente: true,
          },
        ],
        3: [
          { campo: "pax", nombre: "N° pasajeros" },
          { campo: "puntoIntermedio", nombre: "Punto Intermedio" },
          { campo: "destinoServicio", nombre: "Destino Servicio" },
        ],
        4: [
          { campo: "fechaSalida", nombre: "Fecha Salida" },
          { campo: "fechaRegreso", nombre: "Fecha Regreso" },
          { campo: "horaSalida", nombre: "Hora Salida" },
          { campo: "horaRegreso", nombre: "Hora Regreso" },
        ],
        5: [],
      };

      const camposDelPaso = camposObligatorios[paso] || [];
      const errores = {};

      camposDelPaso?.forEach(({ campo, nombre, esCliente }) => {
        const datos = esCliente ? datosCliente : formData;
        const valor = datos[campo];

        if (!valor || valor.toString().trim() === "") {
          errores[campo] = `${nombre} es obligatorio`;
        }

        if (campo === "email" && valor && valor.trim() !== "") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(valor)) {
            errores[campo] = "Email inválido";
          }
        }
      });

      return errores;
    },
    [formData, datosCliente]
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
      horaSalida: "",
      horaRegreso: "",
      dias: "",
      totalKilometros: "",
      costoCasetas: "",
      tipoCaminos: "terraceria",
      tipoCliente: "",
      id: "",
      numeroLead: "",
      nombreResponsable: "",
      estadoCotizacion: "inactivo",
      servicioTransporte: "",
      tipoServicio: "",
      pax: "",
      origenServicio: "Oaxaca",
      puntoIntermedio: "",
      destinoServicio: "",
      vehiculoRequerido: "",
      campana: "",
      fechaCreacion: new Date().toISOString().split("T")[0],
      tipoClienteFrec: "solo_una_vez",
      precio: "",
      descripcion: "",
      transporte: "",
      restaurante: "",
      tour: "",
      hospedaje: "",
      extrasSeleccionados: [],
      total: "",
    });
    setDatosCliente({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      telefono: "",
      canalContacto: "",
    });
  }, [onCancelarEdicion, generarFolioAutomatico, limpiarTodosErrores]);

  useEffect(() => {
    if (cotizacionEditar) {
      setModoEdicion(true);
      setFormData({
        folio: cotizacionEditar.folio || "",
        fechaSalida: cotizacionEditar.fechaSalida || "",
        fechaRegreso: cotizacionEditar.fechaRegreso || "",
        horaSalida: cotizacionEditar.horaSalida || "",
        horaRegreso: cotizacionEditar.horaRegreso || "",
        dias: cotizacionEditar.dias || "",
        totalKilometros: cotizacionEditar.totalKilometros || "",
        costoCasetas: cotizacionEditar.costoCasetas || "",
        tipoCaminos: cotizacionEditar.tipoCaminos || "terraceria",
        tipoCliente: cotizacionEditar.tipoCliente || "",
        id: cotizacionEditar.id || "",
        numeroLead: cotizacionEditar.numeroLead || "",
        nombreResponsable: cotizacionEditar.nombreResponsable || "",
        estadoCotizacion: cotizacionEditar.estadoCotizacion || "inactivo",
        servicioTransporte: cotizacionEditar.servicioTransporte || "",
        tipoServicio: cotizacionEditar.tipoServicio || "",
        pax: cotizacionEditar.pax || "",
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
        transporte: cotizacionEditar.transporte || "",
        restaurante: cotizacionEditar.restaurante || "",
        tour: cotizacionEditar.tour || "",
        hospedaje: cotizacionEditar.hospedaje || "",
        extrasSeleccionados: cotizacionEditar.extrasSeleccionados || [],
        total: cotizacionEditar.total || "",
      });
      if (cotizacionEditar.cliente) {
        setDatosCliente({
          nombre: cotizacionEditar.cliente.nombre || "",
          apellidoPaterno: cotizacionEditar.cliente.apellidoPaterno || "",
          apellidoMaterno: cotizacionEditar.cliente.apellidoMaterno || "",
          email: cotizacionEditar.cliente.email || "",
          telefono: cotizacionEditar.cliente.telefono || "",
          canalContacto: cotizacionEditar.cliente.canalContacto || "",
        });
      }
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
      horaSalida: "",
      horaRegreso: "",
      dias: "",
      totalKilometros: "",
      costoCasetas: "",
      tipoCaminos: "terraceria",
      tipoCliente: "",
      id: "",
      numeroLead: "",
      nombreResponsable: "",
      estadoCotizacion: "inactivo",
      servicioTransporte: "",
      tipoServicio: "",
      pax: "",
      origenServicio: "Oaxaca",
      puntoIntermedio: "",
      destinoServicio: "",
      vehiculoRequerido: "",
      campana: "",
      fechaCreacion: new Date().toISOString().split("T")[0],
      tipoClienteFrec: "solo_una_vez",
      precio: "",
      descripcion: "",
      transporte: "",
      restaurante: "",
      tour: "",
      hospedaje: "",
      extrasSeleccionados: [],
      total: "",
    });
    setDatosCliente({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      telefono: "",
      canalContacto: "",
    });
  }, [generarFolioAutomatico, limpiarTodosErrores]);

  const calcularDias = (fechaInicio, fechaFin, horaInicio, horaFin) => {
    if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) return "";
    const horaInicioSolo = horaInicio.split(":")[0];
    const horaFinSolo = horaFin.split(":")[0];
    const inicio = new Date(`${fechaInicio}T${horaInicioSolo}:00:00`);
    const fin = new Date(`${fechaFin}T${horaFinSolo}:00:00`);
    const diferenciaHoras = (fin.getTime() - inicio.getTime()) / (1000 * 3600);
    const dias = Math.ceil(diferenciaHoras / 24);

    return dias > 0 ? dias.toString() : "0";
  };

  useEffect(() => {
    const dias = calcularDias(
      formData.fechaSalida,
      formData.fechaRegreso,
      formData.horaSalida,
      formData.horaRegreso
    );
    if (dias && dias !== formData.dias) {
      setFormData((prev) => ({
        ...prev,
        dias: dias,
      }));
    }
  }, [
    formData.fechaSalida,
    formData.fechaRegreso,
    formData.horaSalida,
    formData.horaRegreso,
    formData.dias,
  ]);
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
    if (pasoActual < 5) {
      // CAMBIAR DE 4 A 5
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

  const handleClienteInputChange = (e) => {
    const { name, value } = e.target;

    if (erroresCampos[name] && value.trim() !== "") {
      limpiarErrorCampo(name);
    }

    setDatosCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExtraChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const nuevosExtras = [...prev.extrasSeleccionados];

      // Si se selecciona una opción, agregarla a la lista
      if (value && !nuevosExtras.find((extra) => extra.tipo === name)) {
        nuevosExtras.push({ tipo: name, valor: value });
      } else if (value) {
        // Si ya existe, actualizar el valor
        const index = nuevosExtras.findIndex((extra) => extra.tipo === name);
        nuevosExtras[index] = { tipo: name, valor: value };
      } else {
        // Si se deselecciona, remover de la lista
        const index = nuevosExtras.findIndex((extra) => extra.tipo === name);
        if (index > -1) nuevosExtras.splice(index, 1);
      }

      return {
        ...prev,
        [name]: value,
        extrasSeleccionados: nuevosExtras,
      };
    });
  };
  const handleTotalChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      total: value,
    }));
  };

  const validarFormularioCompleto = useCallback(() => {
    const erroresPaso1 = validarPaso(1);
    const erroresPaso2 = validarPaso(2);
    const erroresPaso3 = validarPaso(3);
    const erroresPaso4 = validarPaso(4);

    return {
      ...erroresPaso1,
      ...erroresPaso2,
      ...erroresPaso3,
      ...erroresPaso4,
    };
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
        const erroresPaso4 = validarPaso(4);

        if (Object.keys(erroresPaso1).length > 0) {
          setPasoActual(1);
        } else if (Object.keys(erroresPaso2).length > 0) {
          setPasoActual(2);
        } else if (Object.keys(erroresPaso3).length > 0) {
          setPasoActual(3);
        } else if (Object.keys(erroresPaso4).length > 0) {
          setPasoActual(4);
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

      const clienteData = {
        id: generarIdCliente(),
        ...datosCliente,
        fechaRegistro: new Date().toISOString().split("T")[0],
      };

      if (onGuardarCliente) {
        onGuardarCliente(clienteData);
      }

      const cotizacionData = {
        id: modoEdicion ? cotizacionEditar.id : Date.now(),
        ...formData,
        clienteId: clienteData.id,
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
      datosCliente,
      onGuardarCotizacion,
      onGuardarCliente,
      generarIdCliente,
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
                <div className="linea-paso"></div>
                <span
                  className={`paso ${
                    pasoActual === 4
                      ? "activo"
                      : pasoActual > 4
                      ? "completado"
                      : ""
                  }`}
                >
                  4
                </span>
                <div className="linea-paso"></div>
                <span
                  className={`paso ${
                    pasoActual === 5
                      ? "activo"
                      : pasoActual > 5
                      ? "completado"
                      : ""
                  }`}
                >
                  5
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

                  <div className="fila">
                    <label>
                      N° de Lead: (Opcional)
                      <input
                        type="text"
                        name="numeroLead"
                        value={formData.numeroLead}
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
                  <h3>Datos del Cliente</h3>

                  <label>
                    Nombre: <span className="required">*</span>
                    <input
                      type="text"
                      name="nombre"
                      value={datosCliente.nombre}
                      onChange={handleClienteInputChange}
                      className={erroresCampos.nombre ? "campo-error" : ""}
                    />
                    <MensajeError nombreCampo="nombre" />
                  </label>

                  <div className="fila">
                    <label>
                      Apellido Paterno: <span className="required">*</span>
                      <input
                        type="text"
                        name="apellidoPaterno"
                        value={datosCliente.apellidoPaterno}
                        onChange={handleClienteInputChange}
                        className={
                          erroresCampos.apellidoPaterno ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="apellidoPaterno" />
                    </label>
                    <label>
                      Apellido Materno: <span className="required">*</span>
                      <input
                        type="text"
                        name="apellidoMaterno"
                        value={datosCliente.apellidoMaterno}
                        onChange={handleClienteInputChange}
                        className={
                          erroresCampos.apellidoMaterno ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="apellidoMaterno" />
                    </label>
                  </div>

                  <label>
                    Email: <span className="required">*</span>
                    <input
                      type="email"
                      name="email"
                      value={datosCliente.email}
                      onChange={handleClienteInputChange}
                      className={erroresCampos.email ? "campo-error" : ""}
                    />
                    <MensajeError nombreCampo="email" />
                  </label>

                  <div className="fila">
                    <label>
                      Teléfono: <span className="required">*</span>
                      <input
                        type="text"
                        name="telefono"
                        value={datosCliente.telefono}
                        onChange={handleClienteInputChange}
                        className={erroresCampos.telefono ? "campo-error" : ""}
                      />
                      <MensajeError nombreCampo="telefono" />
                    </label>
                    <label>
                      Canal de Contacto: <span className="required">*</span>
                      <input
                        type="text"
                        name="canalContacto"
                        value={datosCliente.canalContacto}
                        onChange={handleClienteInputChange}
                        className={
                          erroresCampos.canalContacto ? "campo-error" : ""
                        }
                        placeholder="Ej: WhatsApp, Teléfono, Email"
                      />
                      <MensajeError nombreCampo="canalContacto" />
                    </label>
                  </div>

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
                  <h3>Datos del Servicio</h3>

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

              {pasoActual === 4 && (
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
                      Hora salida: <span className="required">*</span>
                      <input
                        type="time"
                        name="horaSalida"
                        value={formData.horaSalida}
                        onChange={handleInputChange}
                        className={
                          erroresCampos.horaSalida ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="horaSalida" />
                    </label>
                    <label>
                      Hora regreso: <span className="required">*</span>
                      <input
                        type="time"
                        name="horaRegreso"
                        value={formData.horaRegreso}
                        onChange={handleInputChange}
                        className={
                          erroresCampos.horaRegreso ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="horaRegreso" />
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
              {pasoActual === 5 && (
                <div className="paso-contenido">
                  <h3>Extras y Total</h3>

                  <div className="extras-grid">
                    <label>
                      Transporte:
                      <select
                        name="transporte"
                        value={formData.transporte}
                        onChange={handleExtraChange}
                      >
                        <option value="">Seleccionar...</option>
                        {/* Opciones se agregarán después */}
                      </select>
                    </label>

                    <label>
                      Restaurante:
                      <select
                        name="restaurante"
                        value={formData.restaurante}
                        onChange={handleExtraChange}
                      >
                        <option value="">Seleccionar...</option>
                        {/* Opciones se agregarán después */}
                      </select>
                    </label>

                    <label>
                      Tour:
                      <select
                        name="tour"
                        value={formData.tour}
                        onChange={handleExtraChange}
                      >
                        <option value="">Seleccionar...</option>
                        {/* Opciones se agregarán después */}
                      </select>
                    </label>

                    <label>
                      Hospedaje:
                      <select
                        name="hospedaje"
                        value={formData.hospedaje}
                        onChange={handleExtraChange}
                      >
                        <option value="">Seleccionar...</option>
                        {/* Opciones se agregarán después */}
                      </select>
                    </label>
                  </div>

                  {/* Cuadro de Extras Seleccionados */}
                  <div className="extras-seleccionados">
                    <h4>Extras:</h4>
                    <div className="extras-lista">
                      {formData.extrasSeleccionados.length > 0 ? (
                        formData.extrasSeleccionados.map((extra, index) => (
                          <div key={index} className="extra-item">
                            <span className="extra-tipo">{extra.tipo}:</span>
                            <span className="extra-valor">{extra.valor}</span>
                          </div>
                        ))
                      ) : (
                        <p className="extras-vacio">
                          No hay extras seleccionados
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Campo de Total */}
                  <div className="total-container">
                    <label>
                      Total: <span className="required">*</span>
                      <input
                        type="number"
                        name="total"
                        value={formData.total}
                        onChange={handleTotalChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                      />
                    </label>
                  </div>

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
