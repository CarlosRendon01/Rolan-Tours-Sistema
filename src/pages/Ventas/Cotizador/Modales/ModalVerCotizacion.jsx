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

        <div className="cuerpo-modal-ver">
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
                {cotizacion.horaSalida || "No disponible"}
              </div>
            </div>

            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <CalendarClock size={16} />
                Hora regreso
              </div>
              <div className="valor-informacion-ver">
                {cotizacion.horaRegreso || "No disponible"}
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
              {cotizacion.extras || "No disponible"}
            </div>
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
    </div>
  );
};

export default ModalVerCotizacion;
