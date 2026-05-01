import React from "react";
import {
  User,
  Mail,
  Phone,
  FileText,
  CalendarClock,
  Calendar,
  Globe,
  Car,
  Route,
  MapPin,
  PackagePlus,
  UserStar,
  DollarSign,
  X,
  Hash,
} from "lucide-react";
import "./ModalVerCotizacion.css";

const ModalVerCotizacion = ({ estaAbierto, cotizacion, alCerrar }) => {
  const [pestanaActiva, setPestanaActiva] = React.useState("informacion");

  const restaurarScroll = React.useCallback(() => {
    document.body.style.overflow = "";
    document.body.style.overflowY = "";
    document.documentElement.style.overflow = "";
  }, []);

  const manejarCierre = React.useCallback(() => {
    restaurarScroll();
    alCerrar();
  }, [alCerrar, restaurarScroll]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible";
    try {
      const [anio, mes, dia] = fecha.split("T")[0].split("-").map(Number);
      return new Date(anio, mes - 1, dia).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  const formatearTelefono = (telefono) => {
    if (!telefono) return "No disponible";
    const numeroLimpio = telefono.replace(/\D/g, "");
    if (numeroLimpio.length === 10) {
      return `${numeroLimpio.slice(0, 3)}-${numeroLimpio.slice(
        3,
        6
      )}-${numeroLimpio.slice(6)}`;
    }
    return telefono;
  };

  React.useEffect(() => {
    const manejarTeclaEscape = (evento) => {
      if (evento.key === "Escape") {
        manejarCierre();
      }
    };

    if (estaAbierto) {
      document.addEventListener("keydown", manejarTeclaEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", manejarTeclaEscape);
      restaurarScroll();
    };
  }, [estaAbierto, manejarCierre, restaurarScroll]);

  React.useEffect(() => {
    if (!estaAbierto) {
      restaurarScroll();
    }
  }, [estaAbierto, restaurarScroll]);

  const CampoVisualizacion = ({ icono: Icono, etiqueta, valor }) => (
    <div className="elemento-informacion-ver">
      <div className="etiqueta-informacion-ver">
        <Icono size={18} />
        {etiqueta}
      </div>
      <div className="valor-informacion-ver">{valor || "No disponible"}</div>
    </div>
  );

  if (!estaAbierto || !cotizacion) {
    return null;
  }
  let cotizacionesPorVehiculo = [];
  if (cotizacion.lista) {
    try {
      const parsed =
        typeof cotizacion.lista === "string"
          ? JSON.parse(cotizacion.lista)
          : cotizacion.lista;
      cotizacionesPorVehiculo = parsed.cotizaciones_todos_vehiculos || [];
    } catch (error) {
      console.error("Error al parsear cotizaciones por vehículo:", error);
    }
  }

  const obtenerServicios = () => {
    if (
      cotizacion.servicios_completos &&
      Array.isArray(cotizacion.servicios_completos)
    ) {
      return cotizacion.servicios_completos;
    }
    return [];
  };

  const servicios = obtenerServicios();

  // Después de la función obtenerServicios, agrega:
  const esItinerario = cotizacion.modo === "itinerario";

  const obtenerStops = () => {
    if (!cotizacion.stops) return [];
    if (Array.isArray(cotizacion.stops)) return cotizacion.stops;
    try { return JSON.parse(cotizacion.stops); } catch { return []; }
  };

  const stops = obtenerStops();

  const obtenerDestinoTexto = () => {
    if (!esItinerario) return cotizacion.destinoServicio || cotizacion.destino;
    if (stops.length === 0) return cotizacion.destino || "No disponible";
    return stops.map((s, i) => `Parada ${i + 1}: ${s.destino}`).join(" → ");
  };

  const obtenerFechaRegreso = () => {
    if (!esItinerario) return formatearFecha(cotizacion.fecha_regreso);
    if (stops.length === 0) return "No disponible";
    const ultimo = stops[stops.length - 1];
    return formatearFecha(ultimo.fecha_salida);
  };

  const obtenerHoraRegreso = () => {
    if (!esItinerario) return cotizacion.hora_regreso;
    if (stops.length === 0) return "No disponible";
    const ultimo = stops[stops.length - 1];
    return ultimo.hora_salida || "No disponible";
  };

  return (
    <div className="superposicion-modal-ver" onClick={manejarCierre}>
      <div
        className="contenido-modal-ver modal-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="encabezado-modal-ver">
          <h2 className="titulo-modal-ver">
            <FileText size={24} />
            Ver Cotización
          </h2>
          <button
            className="boton-cerrar-modal-ver"
            onClick={manejarCierre}
            aria-label="Cerrar modal"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-button ${pestanaActiva === "informacion" ? "active" : ""
              }`}
            onClick={() => setPestanaActiva("informacion")}
            type="button"
          >
            <FileText size={18} />
            Información General
          </button>
          <button
            className={`tab-button ${pestanaActiva === "cotizaciones" ? "active" : ""
              }`}
            onClick={() => setPestanaActiva("cotizaciones")}
            type="button"
          >
            <Car size={18} />
            Cotizaciones por Vehículo
          </button>
        </div>

        <div className="cuerpo-modal-ver">
          {pestanaActiva === "informacion" && (
            <div className="lista-informacion-cliente-ver">
              <CampoVisualizacion
                icono={Hash}
                etiqueta="ID de la Cotización"
                valor={`#${cotizacion.id || "No disponible"}`}
              />

              <CampoVisualizacion
                icono={FileText}
                etiqueta="Folio"
                valor={cotizacion.folio}
              />

              <CampoVisualizacion
                icono={User}
                etiqueta="Nombre Cliente"
                valor={cotizacion.cliente?.nombre}
              />

              <CampoVisualizacion
                icono={UserStar}
                etiqueta="Tipo de Cliente"
                valor={cotizacion.tipo_cliente}
              />

              <CampoVisualizacion
                icono={Mail}
                etiqueta="Correo Electrónico"
                valor={cotizacion.cliente?.email}
              />

              <CampoVisualizacion
                icono={Phone}
                etiqueta="Teléfono"
                valor={formatearTelefono(cotizacion.cliente?.telefono)}
              />

              <CampoVisualizacion
                icono={Calendar}
                etiqueta="Fecha de Salida"
                valor={formatearFecha(cotizacion.fecha_salida)}
              />

              <CampoVisualizacion
                icono={Calendar}
                etiqueta={esItinerario ? "Fecha último destino" : "Fecha de Regreso"}
                valor={obtenerFechaRegreso()}
              />

              <CampoVisualizacion
                icono={CalendarClock}
                etiqueta="Hora Salida"
                valor={cotizacion.hora_salida}
              />

              <CampoVisualizacion
                icono={CalendarClock}
                etiqueta={esItinerario ? "Hora último destino" : "Hora Regreso"}
                valor={obtenerHoraRegreso()}
              />

              <CampoVisualizacion
                icono={Route}
                etiqueta="Total Kilómetros"
                valor={cotizacion.total_kilometros}
              />

              <CampoVisualizacion
                icono={Car}
                etiqueta="Vehículo"
                valor={cotizacion.vehiculo?.nombre}
              />

              <CampoVisualizacion
                icono={MapPin}
                etiqueta="Destino"
                valor={obtenerDestinoTexto()}
              />

              {esItinerario && stops.length > 0 && (
                <div className="elemento-informacion-ver form-group-full">
                  <div className="etiqueta-informacion-ver">
                    <Route size={18} />
                    Itinerario de Paradas
                  </div>
                  <div className="valor-informacion-ver">
                    <ul className="lista-extras-ver">
                      {stops.map((stop, i) => (
                        <li key={i}>
                          <strong>Parada {i + 1}:</strong> {stop.destino}
                          {stop.fecha_salida && ` — Salida: ${formatearFecha(stop.fecha_salida)}`}
                          {stop.hora_salida && ` ${stop.hora_salida}`}
                          {stop.tipo_camino && ` (${stop.tipo_camino})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <CampoVisualizacion
                icono={FileText}
                etiqueta="Número de Lead"
                valor={cotizacion.lead_id || "No asignado"}
              />

              <CampoVisualizacion
                icono={Globe}
                etiqueta="Canal de Contacto"
                valor={cotizacion.cliente?.canal_contacto || "No especificado"}
              />

              {/* ✅ SERVICIOS CORREGIDO */}
              <div className="elemento-informacion-ver form-group-full">
                <div className="etiqueta-informacion-ver">
                  <PackagePlus size={18} />
                  Servicios Adicionales
                </div>
                <div className="valor-informacion-ver">
                  {servicios.length === 0 ? (
                    <span>No hay servicios adicionales</span>
                  ) : (
                    <ul className="lista-extras-ver">
                      {servicios.map((servicio, i) => (
                        <li key={i}>
                          <strong>{servicio.nombre}</strong>
                          {servicio.precio > 0 &&
                            ` — $${servicio.precio.toLocaleString("es-MX")}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <CampoVisualizacion
                icono={DollarSign}
                etiqueta="Total"
                valor={cotizacion.total || "No especificado"}
              />
            </div>
          )}

          {pestanaActiva === "cotizaciones" && (
            <div className="contenido-cotizaciones">
              {cotizacionesPorVehiculo.length > 0 ? (
                <div className="grid-cotizaciones">
                  {cotizacionesPorVehiculo.map((cotizacion, index) => (
                    <div key={index} className="tarjeta-vehiculo">
                      <h4 className="titulo-vehiculo">
                        {cotizacion.vehiculo_nombre}
                      </h4>

                      <div className="capacidad-vehiculo">
                        Capacidad: {cotizacion.capacidad_pasajeros || "N/A"}{" "}
                        pasajeros
                      </div>

                      <div className="contenedor-costos">
                        <div className="fila-costo">
                          <span>Renta:</span>
                          <span>
                            $
                            {cotizacion.costos.renta_ajustada.toLocaleString(
                              "es-MX",
                              { minimumFractionDigits: 2 }
                            )}
                          </span>
                        </div>
                        <div className="fila-costo">
                          <span>Combustible:</span>
                          <span>
                            $
                            {cotizacion.costos.combustible.toLocaleString(
                              "es-MX",
                              { minimumFractionDigits: 2 }
                            )}
                          </span>
                        </div>
                        <div className="fila-costo">
                          <span>Desgaste:</span>
                          <span>
                            $
                            {cotizacion.costos.desgaste.toLocaleString(
                              "es-MX",
                              { minimumFractionDigits: 2 }
                            )}
                          </span>
                        </div>
                        <div className="fila-costo">
                          <span>Casetas:</span>
                          <span>
                            $
                            {cotizacion.costos.casetas.toLocaleString("es-MX", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="fila-costo">
                          <span>Chofer:</span>
                          <span>
                            $
                            {cotizacion.costos.chofer.toLocaleString("es-MX", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="fila-costo fila-subtotal">
                          <span>Subtotal:</span>
                          <span>
                            $
                            {cotizacion.costos.subtotal.toLocaleString(
                              "es-MX",
                              { minimumFractionDigits: 2 }
                            )}
                          </span>
                        </div>
                        <div className="fila-costo fila-iva">
                          <span>IVA (16%):</span>
                          <span>
                            $
                            {cotizacion.costos.iva.toLocaleString("es-MX", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="fila-costo fila-total">
                          <span>TOTAL:</span>
                          <span>
                            $
                            {cotizacion.costos.total_con_iva.toLocaleString(
                              "es-MX",
                              { minimumFractionDigits: 2 }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mensaje-sin-cotizaciones">
                  No hay cotizaciones disponibles
                </p>
              )}
            </div>
          )}
        </div>

        <div className="contenedor-boton-inferior-ver">
          <button
            className="boton-cerrar-inferior-ver"
            onClick={manejarCierre}
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerCotizacion;
