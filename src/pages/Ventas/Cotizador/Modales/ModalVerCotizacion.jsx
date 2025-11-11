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
      return new Date(fecha).toLocaleDateString("es-MX", {
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

  if (!estaAbierto || !cotizacion) {
    return null;
  }

  // Extraer cotizaciones por vehículo del campo lista
  let cotizacionesPorVehiculo = [];
  if (cotizacion.lista) {
    try {
      const parsed = typeof cotizacion.lista === "string"
        ? JSON.parse(cotizacion.lista)
        : cotizacion.lista;
      cotizacionesPorVehiculo = parsed.cotizaciones_todos_vehiculos || [];
    } catch (error) {
      console.error("Error al parsear cotizaciones por vehículo:", error);
    }
  }

  return (
    <div className="superposicion-modal-ver" onClick={manejarCierre}>
      <div className="contenido-modal-ver" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado-modal-ver">
          <button
            className="boton-cerrar-modal-ver"
            onClick={manejarCierre}
            aria-label="Cerrar modal"
            type="button"
          >
            <X size={20} />
          </button>
          <h2 className="titulo-modal-ver">
            <FileText size={24} />
            Información de Cotización
          </h2>
        </div>

        <div className="modal-tabs" style={{
          display: 'flex',
          borderBottom: '2px solid #dee2e6',
          marginBottom: '1.5rem',
          gap: '0.5rem'
        }}>
          <button
            className={`tab-button ${pestanaActiva === "informacion" ? "active" : ""}`}
            onClick={() => setPestanaActiva("informacion")}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: pestanaActiva === "informacion" ? '#3498db' : 'transparent',
              color: pestanaActiva === "informacion" ? 'white' : '#7f8c8d',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              fontWeight: pestanaActiva === "informacion" ? '600' : '400',
              transition: 'all 0.3s ease'
            }}
          >
            Información General
          </button>
          <button
            className={`tab-button ${pestanaActiva === "cotizaciones" ? "active" : ""}`}
            onClick={() => setPestanaActiva("cotizaciones")}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: pestanaActiva === "cotizaciones" ? '#3498db' : 'transparent',
              color: pestanaActiva === "cotizaciones" ? 'white' : '#7f8c8d',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              fontWeight: pestanaActiva === "cotizaciones" ? '600' : '400',
              transition: 'all 0.3s ease'
            }}
          >
            Cotizaciones por Vehículo
          </button>
        </div>

        <div className="cuerpo-modal-ver">
          {pestanaActiva === "informacion" && (
            <>
              <div className="lista-informacion-cliente-ver">
                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <Hash size={16} />
                    ID de la Cotización
                  </div>
                  <div className="valor-informacion-ver">
                    #{cotizacion.id || "No disponible"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <FileText size={16} />
                    Folio
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.folio || "No disponible"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <User size={16} />
                    Nombre Cliente
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.cliente?.nombre || "No disponible"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <UserStar size={16} />
                    Tipo de cliente
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.tipo_cliente || "No disponible"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <Mail size={16} />
                    Correo Electrónico
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.cliente?.email || "No disponible"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <Phone size={16} />
                    Teléfono
                  </div>
                  <div className="valor-informacion-ver">
                    {formatearTelefono(cotizacion.cliente?.telefono)}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <Calendar size={16} />
                    Fecha de Salida
                  </div>
                  <div className="valor-informacion-ver">
                    {formatearFecha(cotizacion.fecha_salida)}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <Calendar size={16} />
                    Fecha de Regreso
                  </div>
                  <div className="valor-informacion-ver">
                    {formatearFecha(cotizacion.fecha_regreso)}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <CalendarClock size={16} />
                    Hora salida
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.hora_salida || "No disponible"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <CalendarClock size={16} />
                    Hora regreso
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.hora_regreso || "No disponible"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <Route size={16} />
                    Total Kilometros
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.total_kilometros || "No disponible"}
                  </div>
                </div>
                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <Car size={16} />
                    Vehiculo
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.vehiculo?.nombre || "No disponible"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <MapPin size={16} />
                    Destino
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.destinoServicio ||
                      cotizacion.destino ||
                      "No especificado"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <FileText size={16} />
                    Número de Lead
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.lead_id || "No asignado"}
                  </div>
                </div>

                <div className="elemento-informacion-ver">
                  <div className="etiqueta-informacion-ver">
                    <Globe size={16} />
                    Canal de Contacto
                  </div>
                  <div className="valor-informacion-ver">
                    {cotizacion.cliente?.canal_contacto || "No especificado"}
                  </div>
                </div>
              </div>
              <div className="elemento-informacion-ver">
                <div className="etiqueta-informacion-ver">
                  <PackagePlus size={16} />
                  Extras
                </div>
                <div className="valor-informacion-ver">
                  {(() => {
                    let extrasData = [];

                    // Si extra viene como JSON string, intenta parsearlo
                    if (cotizacion.extra) {
                      try {
                        const parsed = typeof cotizacion.extra === "string"
                          ? JSON.parse(cotizacion.extra)
                          : cotizacion.extra;

                        extrasData = parsed.extras_seleccionados || [];
                      } catch (error) {
                        console.error("Error al parsear extras:", error);
                      }
                    }

                    if (extrasData.length === 0) {
                      return <span>No hay extras seleccionados</span>;
                    }

                    return (
                      <ul className="lista-extras-ver">
                        {extrasData.map((extra, i) => (
                          <li key={i}>
                            <strong>{extra.tipo}</strong>: {extra.valor} — ${extra.costo}
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
                </div>
              </div>
            </>
          )}

          {pestanaActiva === "cotizaciones" && (
            <div className="contenido-cotizaciones">
              {cotizacionesPorVehiculo.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {cotizacionesPorVehiculo.map((cotizacion, index) => (
                    <div
                      key={index}
                      style={{
                        border: '2px solid #dee2e6',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        background: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <h4 style={{
                        marginBottom: '1rem',
                        color: '#2c3e50',
                        fontSize: '1.3rem',
                        borderBottom: '2px solid #3498db',
                        paddingBottom: '0.5rem'
                      }}>
                        {cotizacion.vehiculo_nombre}
                      </h4>

                      <div style={{ marginBottom: '0.5rem', color: '#7f8c8d' }}>
                        Capacidad: {cotizacion.capacidad_pasajeros || 'N/A'} pasajeros
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #ecf0f1' }}>
                          <span>Renta:</span>
                          <span>${cotizacion.costos.renta_ajustada.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #ecf0f1' }}>
                          <span>Combustible:</span>
                          <span>${cotizacion.costos.combustible.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #ecf0f1' }}>
                          <span>Desgaste:</span>
                          <span>${cotizacion.costos.desgaste.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #ecf0f1' }}>
                          <span>Casetas:</span>
                          <span>${cotizacion.costos.casetas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #ecf0f1' }}>
                          <span>Chofer:</span>
                          <span>${cotizacion.costos.chofer.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', marginTop: '0.5rem', borderTop: '2px solid #3498db' }}>
                          <span style={{ fontWeight: '600' }}>Subtotal:</span>
                          <span style={{ fontWeight: '600' }}>${cotizacion.costos.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#e67e22' }}>
                          <span>IVA (16%):</span>
                          <span style={{ fontWeight: '600' }}>${cotizacion.costos.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', marginTop: '0.5rem', background: '#3498db', color: 'white', borderRadius: '8px' }}>
                          <span style={{ fontWeight: 'bold' }}>TOTAL:</span>
                          <span style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>${cotizacion.costos.total_con_iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem' }}>
                  No hay cotizaciones disponibles
                </p>
              )}
            </div>
          )}

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
    </div>
  );
};

export default ModalVerCotizacion;