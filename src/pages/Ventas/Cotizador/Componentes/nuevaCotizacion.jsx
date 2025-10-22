import React, { useState, useEffect, useCallback, useRef } from "react";
import "./nuevaCotizacion.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const NuevaCotizacion = ({
  onGuardarCotizacion,
  onGuardarCliente,
  cotizacionEditar,
  onCancelarEdicion,

}) => {
  document.body.style.overflow = "hidden";
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [erroresCampos, setErroresCampos] = useState({});
  const [formData, setFormData] = useState({
    folio: "",
    fecha_salida: "",
    fecha_regreso: "",
    horaSalida: "",
    horaRegreso: "",
    numero_dias: "",
    total_kilometros: "",
    costo_casetas: "",
    tipo_camino: "terraceria",
    tipo_cliente: "",
    id: "",
    lead_id: "",
    nombreResponsable: "",
    tipo_servicio: "",
    num_pasajeros: "",
    origenServicio: "Oaxaca de Juarez, Oaxaca",
    puntoIntermedio: "",
    destinoServicio: "",
    vehiculoRequerido: "",
    fechaCreacion: new Date().toISOString().split("T")[0],
    tipoClienteFrec: "solo_una_vez",
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
    email: "",
    telefono: "",
  });

  const puntoIntermedioRef = useRef(null);
  const destinoServicioRef = useRef(null);
  const autocompleteIntermedio = useRef(null);
  const autocompleteDestino = useRef(null);

  const generarIdCliente = useCallback(() => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    return `CLI-${año}${mes}${dia}-${timestamp}`;
  }, []);

  const formatearTelefono = useCallback((valor) => {
    const numeros = valor.replace(/\D/g, "");
    const numeroLimitado = numeros.slice(0, 10);

    let formatado = "";
    if (numeroLimitado.length > 0) {
      formatado = numeroLimitado.slice(0, 3);
    }
    if (numeroLimitado.length >= 4) {
      formatado += "-" + numeroLimitado.slice(3, 6);
    }
    if (numeroLimitado.length >= 7) {
      formatado += "-" + numeroLimitado.slice(6, 8);
    }
    if (numeroLimitado.length >= 9) {
      formatado += "-" + numeroLimitado.slice(8, 10);
    }

    return formatado;
  }, []);

  const validarTelefono = (telefono) => {
    const numeros = telefono.replace(/\D/g, "");
    return numeros.length === 10;
  };

  const generarFolioAutomatico = useCallback(() => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    return `${año}${mes}${dia}${timestamp}`;
  }, []);

  useEffect(() => {
    if (!mostrarModal || pasoActual !== 3) return;

    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initAutocomplete();
        return;
      }

      const script = document.createElement("script");
      script.src = ``;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    };

    const initAutocomplete = () => {
      if (!puntoIntermedioRef.current || !destinoServicioRef.current) return;

      if (!autocompleteIntermedio.current) {
        autocompleteIntermedio.current =
          new window.google.maps.places.Autocomplete(
            puntoIntermedioRef.current,
            {
              componentRestrictions: { country: "mx" },
              fields: ["formatted_address", "geometry", "name"],
            }
          );

        autocompleteIntermedio.current.addListener("place_changed", () => {
          const place = autocompleteIntermedio.current.getPlace();
          if (place.formatted_address || place.name) {
            setFormData((prev) => ({
              ...prev,
              puntoIntermedio: place.formatted_address || place.name,
            }));
            limpiarErrorCampo("puntoIntermedio");
          }
        });
      }

      if (!autocompleteDestino.current) {
        autocompleteDestino.current =
          new window.google.maps.places.Autocomplete(
            destinoServicioRef.current,
            {
              componentRestrictions: { country: "mx" },
              fields: ["formatted_address", "geometry", "name"],
            }
          );

        autocompleteDestino.current.addListener("place_changed", () => {
          const place = autocompleteDestino.current.getPlace();
          if (place.formatted_address || place.name) {
            setFormData((prev) => ({
              ...prev,
              destinoServicio: place.formatted_address || place.name,
            }));
            limpiarErrorCampo("destinoServicio");
          }
        });
      }
    };

    loadGoogleMapsScript();
  }, [mostrarModal, pasoActual]);

  const validarPaso = useCallback(
    (paso) => {
      const camposObligatorios = {
        1: [{ campo: "nombreResponsable", nombre: "Nombre Responsable" }],
        2: [
          { campo: "nombre", nombre: "Nombre", esCliente: true },
          { campo: "email", nombre: "Email", esCliente: true },
          { campo: "telefono", nombre: "Teléfono", esCliente: true },

        ],
        3: [
          { campo: "num_pasajeros", nombre: "N° pasajeros" },
          { campo: "puntoIntermedio", nombre: "Punto Intermedio" },
          { campo: "destinoServicio", nombre: "Destino Servicio" },
        ],
        4: [
          { campo: "fecha_salida", nombre: "Fecha Salida" },
          { campo: "fecha_regreso", nombre: "Fecha Regreso" },
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

        if (campo === "telefono" && valor && valor.trim() !== "") {
          if (!validarTelefono(valor)) {
            errores[campo] = "El teléfono debe tener 10 dígitos";
          }
        }

        if (campo === "fecha_salida" && valor && valor.trim() !== "") {
          const fechaActual = new Date();
          fechaActual.setHours(0, 0, 0, 0);

          const fechaSeleccionada = new Date(valor + "T00:00:00");

          if (fechaSeleccionada < fechaActual) {
            errores[campo] = "La fecha de salida debe ser mayor o igual a hoy";
          }
        }

        if (campo === "fecha_regreso" && valor && formData.fecha_salida) {
          const fecha_salida = new Date(formData.fecha_salida + "T00:00:00");
          const fecha_regreso = new Date(valor + "T00:00:00");

          const MILISEGUNDOS_EN_UN_DIA = 3 * 24 * 60 * 60 * 1000;

          if (fecha_regreso - fecha_salida < MILISEGUNDOS_EN_UN_DIA) {
            errores[campo] =
              "La fecha de regreso debe ser al menos 3 días después de la fecha de salida";
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
      document.body.style.overflow = "";
      onCancelarEdicion();
    }
    setFormData({
      folio: generarFolioAutomatico(),
      fecha_salida: "",
      fecha_regreso: "",
      horaSalida: "",
      horaRegreso: "",
      numero_dias: "",
      total_kilometros: "",
      costo_casetas: "",
      tipo_camino: "terraceria",
      tipo_cliente: "",
      id: "",
      lead_id: "",
      nombreResponsable: "",
      tipo_servicio: "",
      num_pasajeros: "",
      origenServicio: "Oaxaca de Juarez, Oaxaca",
      puntoIntermedio: "",
      destinoServicio: "",
      vehiculoRequerido: "",
      fechaCreacion: new Date().toISOString().split("T")[0],
      tipoClienteFrec: "solo_una_vez",
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
      email: "",
      telefono: "",
    });
  }, [onCancelarEdicion, generarFolioAutomatico, limpiarTodosErrores]);

  useEffect(() => {
    if (cotizacionEditar) {
      document.body.style.overflow = "hidden";
      setModoEdicion(true);
      setFormData({
        folio: cotizacionEditar.folio || "",
        fecha_salida: cotizacionEditar.fecha_salida || "",
        fecha_regreso: cotizacionEditar.fecha_regreso || "",
        horaSalida: cotizacionEditar.horaSalida || "",
        horaRegreso: cotizacionEditar.horaRegreso || "",
        numero_dias: cotizacionEditar.numero_dias || "",
        total_kilometros: cotizacionEditar.total_kilometros || "",
        costo_casetas: cotizacionEditar.costo_casetas || "",
        tipo_camino: cotizacionEditar.tipo_camino || "terraceria",
        tipo_cliente: cotizacionEditar.tipo_cliente || "",
        id: cotizacionEditar.id || "",
        lead_id: cotizacionEditar.lead_id || "",
        nombreResponsable: cotizacionEditar.nombreResponsable || "",
        tipo_servicio: cotizacionEditar.tipo_servicio || "",
        num_pasajeros: cotizacionEditar.num_pasajeros || "",
        origenServicio: cotizacionEditar.origenServicio || "Oaxaca de Juarez, Oaxaca",
        puntoIntermedio: cotizacionEditar.puntoIntermedio || "",
        destinoServicio: cotizacionEditar.destinoServicio || "",
        vehiculoRequerido: cotizacionEditar.vehiculoRequerido || "",
        fechaCreacion:
          cotizacionEditar.fechaCreacion ||
          new Date().toISOString().split("T")[0],
        tipoClienteFrec: cotizacionEditar.tipoClienteFrec || "solo_una_vez",
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
          email: cotizacionEditar.cliente.email || "",
          telefono: cotizacionEditar.cliente.telefono || "",
        });
      }

      setMostrarModal(true);
      setPasoActual(1);
      limpiarTodosErrores();
    }
  }, [cotizacionEditar, limpiarTodosErrores]);

  const abrirModal = useCallback(() => {

    setMostrarModal(true);
    setPasoActual(1);
    setModoEdicion(false);
    limpiarTodosErrores();

    setFormData({

      folio: generarFolioAutomatico(),
      fecha_salida: "",
      fecha_regreso: "",
      horaSalida: "",
      horaRegreso: "",
      numero_dias: "",
      total_kilometros: "",
      costo_casetas: "",
      tipo_camino: "terraceria",
      tipo_cliente: "",
      id: "",
      lead_id: "",
      nombreResponsable: "",
      tipo_servicio: "",
      num_pasajeros: "",
      origenServicio: "Oaxaca de Juarez, Oaxaca",
      puntoIntermedio: "",
      destinoServicio: "",
      vehiculoRequerido: "",
      fechaCreacion: new Date().toISOString().split("T")[0],
      tipoClienteFrec: "solo_una_vez",
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
      email: "",
      telefono: "",
    });
  }, [generarFolioAutomatico, limpiarTodosErrores]);

  const calcularDias = (fechaInicio, fechaFin, horaInicio, horaFin) => {
    if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) return "";
    const horaInicioSolo = horaInicio.split(":")[0];
    const horaFinSolo = horaFin.split(":")[0];
    const inicio = new Date(`${fechaInicio}T${horaInicioSolo}:00:00`);
    const fin = new Date(`${fechaFin}T${horaFinSolo}:00:00`);
    const diferenciaHoras = (fin.getTime() - inicio.getTime()) / (1000 * 3600);
    const numero_dias = Math.ceil(diferenciaHoras / 24);

    return numero_dias > 0 ? numero_dias.toString() : "0";
  };

  useEffect(() => {
    const numero_dias = calcularDias(
      formData.fecha_salida,
      formData.fecha_regreso,
      formData.horaSalida,
      formData.horaRegreso
    );
    if (numero_dias !== "" && numero_dias !== formData.numero_dias) {
      setFormData((prev) => ({
        ...prev,
        numero_dias: numero_dias,
      }));
    }
  }, [
    formData.fecha_salida,
    formData.fecha_regreso,
    formData.horaSalida,
    formData.horaRegreso,
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

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleClienteInputChange = (e) => {
    const { name, value } = e.target;

    let valorFinal = value;
    if (name === "telefono") {
      valorFinal = formatearTelefono(value);
    }

    if (erroresCampos[name] && valorFinal.trim() !== "") {
      limpiarErrorCampo(name);
    }

    setDatosCliente((prev) => ({
      ...prev,
      [name]: valorFinal,
    }));
  };

  const handleExtraChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const nuevosExtras = [...prev.extrasSeleccionados];

      if (value && !nuevosExtras.find((extra) => extra.tipo === name)) {
        nuevosExtras.push({ tipo: name, valor: value });
      } else if (value) {
        const index = nuevosExtras.findIndex((extra) => extra.tipo === name);
        nuevosExtras[index] = { tipo: name, valor: value };
      } else {
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

  // 🔍 BUSCAR esta función (alrededor de la línea 350-400)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarPaso(5)) {
      return;
    }

    try {
      const cotizacionCompleta = {
        ...formData,
        ...datosCliente,
        id: modoEdicion ? formData.id : generarIdCliente(),
      };

      // 🆕 Llamar con await para esperar respuesta del API
      await onGuardarCotizacion(cotizacionCompleta, modoEdicion);

      alert(
        modoEdicion
          ? "Cotización actualizada exitosamente"
          : "Cotización guardada exitosamente"
      );

      // Resetear el formulario
      setFormData({
        folio: "",
        fecha_salida: "",
        fecha_regreso: "",
        horaSalida: "",
        horaRegreso: "",
        numero_dias: "",
        total_kilometros: "",
        costo_casetas: "",
        tipo_camino: "terraceria",
        tipo_cliente: "",
        id: "",
        lead_id: "",
        nombreResponsable: "",
        tipo_servicio: "",
        num_pasajeros: "",
        origenServicio: "Oaxaca de Juarez, Oaxaca",
        puntoIntermedio: "",
        destinoServicio: "",
        vehiculoRequerido: "",
        fechaCreacion: new Date().toISOString().split("T")[0],
        tipoClienteFrec: "solo_una_vez",
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
        email: "",
        telefono: "",
      });

      setMostrarModal(false);
      setPasoActual(1);
      setErroresCampos({});
      setModoEdicion(false);

    } catch (error) {
      console.error("Error al guardar:", error);
      // El error ya se maneja en Cotizacion.jsx, no mostrar alert duplicado
    }
  };

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
    <>
      <button
        className="cotizacion-boton-agregar"
        onClick={abrirModal}
        title="Nueva Cotización"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span>Nueva Cotización</span>
      </button>

      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="header-formulario">
              <h2>{modoEdicion ? "Editar Cotización" : "Nueva Cotización"}</h2>
            </div>

            <div className="cotizacion-tabs">
              <button
                type="button"
                className={`cotizacion-tab-button ${pasoActual === 1 ? "active" : ""
                  }`}
                onClick={() => setPasoActual(1)}
              >
                Información General
              </button>
              <button
                type="button"
                className={`cotizacion-tab-button ${pasoActual === 2 ? "active" : ""
                  }`}
                onClick={() => setPasoActual(2)}
              >
                Datos del Cliente
              </button>
              <button
                type="button"
                className={`cotizacion-tab-button ${pasoActual === 3 ? "active" : ""
                  }`}
                onClick={() => setPasoActual(3)}
              >
                Datos del Servicio
              </button>
              <button
                type="button"
                className={`cotizacion-tab-button ${pasoActual === 4 ? "active" : ""
                  }`}
                onClick={() => setPasoActual(4)}
              >
                Detalles del Viaje
              </button>
              <button
                type="button"
                className={`cotizacion-tab-button ${pasoActual === 5 ? "active" : ""
                  }`}
                onClick={() => setPasoActual(5)}
              >
                Extras y Total
              </button>
            </div>

            <form className="formulario-cotizacion" onSubmit={handleSubmit}>
              {pasoActual === 1 && (
                <div className="paso-contenido">
                  <div className="fila">
                    <label>
                      ID:
                      <input
                        type="number"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        readOnly
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
                      N° de Lead:
                      <input
                        type="text"
                        name="lead_id"
                        value={formData.lead_id}
                        onChange={handleInputChange}
                        readOnly
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
                  <label>
                    Nombre: <span className="required">*</span>
                    <input
                      type="text"
                      name="nombre"
                      autoComplete="name"
                      value={datosCliente.nombre}
                      onChange={handleClienteInputChange}
                      className={erroresCampos.nombre ? "campo-error" : ""}
                    />
                    <MensajeError nombreCampo="nombre" />
                  </label>

                  <label>
                    Email: <span className="required">*</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
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
                        autoComplete="tel"
                        value={datosCliente.telefono}
                        onChange={handleClienteInputChange}
                        className={erroresCampos.telefono ? "campo-error" : ""}
                        placeholder="951-574-11-11"
                        maxLength="13"
                      />
                      <MensajeError nombreCampo="telefono" />
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
                  <div className="fila">
                    <label>
                      N° pasajeros: <span className="required">*</span>
                      <input
                        type="number"
                        name="num_pasajeros"
                        value={formData.num_pasajeros}
                        onChange={handleInputChange}
                        className={erroresCampos.num_pasajeros ? "campo-error" : ""}
                        min="1"
                      />
                      <MensajeError nombreCampo="num_pasajeros" />
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
                      Tipo Servicio: (Opcional)
                      <input
                        type="text"
                        name="tipo_servicio"
                        value={formData.tipo_servicio}
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
                      ref={puntoIntermedioRef}
                      type="text"
                      name="puntoIntermedio"
                      value={formData.puntoIntermedio}
                      onChange={handleInputChange}
                      className={
                        erroresCampos.puntoIntermedio ? "campo-error" : ""
                      }
                      placeholder="Busca un lugar..."
                      autoComplete="off"
                    />
                    <MensajeError nombreCampo="puntoIntermedio" />
                  </label>

                  <label>
                    Destino Servicio: <span className="required">*</span>
                    <input
                      ref={destinoServicioRef}
                      type="text"
                      name="destinoServicio"
                      value={formData.destinoServicio}
                      onChange={handleInputChange}
                      className={
                        erroresCampos.destinoServicio ? "campo-error" : ""
                      }
                      placeholder="Busca un lugar..."
                      autoComplete="off"
                    />
                    <MensajeError nombreCampo="destinoServicio" />
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
                  <div className="fila">
                    <label>
                      Fecha Salida: <span className="required">*</span>
                      <input
                        type="date"
                        name="fecha_salida"
                        value={formData.fecha_salida}
                        onChange={handleInputChange}
                        className={
                          erroresCampos.fecha_salida ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="fecha_salida" />
                    </label>
                    <label>
                      Fecha Regreso: <span className="required">*</span>
                      <input
                        type="date"
                        name="fecha_regreso"
                        value={formData.fecha_regreso}
                        onChange={handleInputChange}
                        className={
                          erroresCampos.fecha_regreso ? "campo-error" : ""
                        }
                      />
                      <MensajeError nombreCampo="fecha_regreso" />
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
                        name="numero_dias"
                        value={formData.numero_dias}
                        onChange={handleInputChange}
                        readOnly
                      />
                    </label>
                  </div>

                  <div className="fila">
                    <label>
                      Total Kilómetros:
                      <input
                        type="number"
                        name="total_kilometros"
                        value={formData.total_kilometros}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        readOnly
                      />
                    </label>
                    <label>
                      Costo Casetas:
                      <input
                        type="number"
                        name="costo_casetas"
                        value={formData.costo_casetas}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        readOnly
                      />
                    </label>
                  </div>

                  <div className="fila">
                    <label>
                      Tipo de Camino:
                      <select
                        name="tipo_camino"
                        value={formData.tipo_camino}
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
                  <div className="extras-grid">
                    <label>
                      Transporte:
                      <select
                        name="transporte"
                        value={formData.transporte}
                        onChange={handleExtraChange}
                      >
                        <option value="">Seleccionar...</option>
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
                      </select>
                    </label>
                  </div>

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
    </>
  );
};

export default NuevaCotizacion;
