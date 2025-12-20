import React from 'react';
import {
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  Globe,
  MapPin,
  X,
  IdCard,
  Hash,
  Building,
  Clock
} from 'lucide-react';
import './ModalVerCliente.css';

const ModalVerCliente = ({ estaAbierto, cliente, alCerrar }) => {
  // Función para restaurar el scroll completamente
  const restaurarScroll = React.useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
  }, []);

  // Función mejorada para cerrar el modal
  const manejarCierre = React.useCallback(() => {
    restaurarScroll();
    alCerrar();
  }, [alCerrar, restaurarScroll]);

  React.useEffect(() => {
    if (estaAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      restaurarScroll();
    }
  }, [estaAbierto, restaurarScroll]);

  // Función para formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  // Función para formatear teléfono
  const formatearTelefono = (telefono) => {
    if (!telefono) return 'No disponible';
    const numeroLimpio = telefono.replace(/\D/g, '');
    if (numeroLimpio.length === 10) {
      return `${numeroLimpio.slice(0, 3)}-${numeroLimpio.slice(3, 6)}-${numeroLimpio.slice(6)}`;
    }
    return telefono;
  };

  // Manejar la tecla Escape y control del scroll
  React.useEffect(() => {
    const manejarTeclaEscape = (evento) => {
      if (evento.key === 'Escape') {
        manejarCierre();
      }
    };

    if (estaAbierto) {
      document.addEventListener('keydown', manejarTeclaEscape);
    }

    return () => {
      document.removeEventListener('keydown', manejarTeclaEscape);
    };
  }, [estaAbierto, manejarCierre]);

  if (!estaAbierto || !cliente) {
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
            <User size={24} />
            Información del Cliente
          </h2>
        </div>

        <div className="cuerpo-modal-ver">
          <div className="lista-informacion-cliente-ver">
            {/* ID del Cliente */}
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <Hash size={16} />
                ID del Cliente
              </div>
              <div className="valor-informacion-ver">
                #{cliente.id || 'No disponible'}
              </div>
            </div>

            {/* Nombre Completo */}
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <User size={16} />
                Nombre Completo
              </div>
              <div className="valor-informacion-ver">
                {cliente.nombre || 'No disponible'}
              </div>
            </div>

            {/* Email */}
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <Mail size={16} />
                Correo Electrónico
              </div>
              <div className="valor-informacion-ver">
                {cliente.email || 'No disponible'}
              </div>
            </div>

            {/* Teléfono */}
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <Phone size={16} />
                Teléfono
              </div>
              <div className="valor-informacion-ver">
                {formatearTelefono(cliente.telefono)}
              </div>
            </div>

            {/* Número Lead */}
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <FileText size={16} />
                Número de Lead
              </div>
              <div className="valor-informacion-ver">
                {cliente.numero_lead || 'No asignado'}
              </div>
            </div>

            {/* Canal de Contacto */}
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <Globe size={16} />
                Canal de Contacto
              </div>
              <div className="valor-informacion-ver">
                {cliente.canal_contacto || 'No especificado'}
              </div>
            </div>

            {/* RFC */}
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <IdCard size={16} />
                RFC
              </div>
              <div className="valor-informacion-ver">
                {cliente.rfc || 'No disponible'}
              </div>
            </div>

            {/* Dirección */}
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <MapPin size={16} />
                Dirección
              </div>
              <div className="valor-informacion-ver">
                {cliente.direccion || 'No especificada'}
              </div>
            </div>

            {/* Fecha de Registro */}
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <Calendar size={16} />
                Fecha de Registro
              </div>
              <div className="valor-informacion-ver">
                {formatearFecha(cliente.fecha_registro)}
              </div>
            </div>
          </div>

          {/* Botón de cerrar en la parte inferior */}
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

export default ModalVerCliente;