import { useState, useEffect } from 'react';
import axios from 'axios';
import PrincipalComponente from "../../Generales/Componentes/PrincipalComponente";
import TablaVehiculos from './Componentes/TablaVehiculos';
import ModalVehiculo from './ModalesVehiculos/ModalVehiculo';
import ModalEditarVehiculo from './ModalesVehiculos/ModalEditarVehiculo';
import ModalVerVehiculo from './ModalesVehiculos/ModalVerVehiculo';
import { modalEliminarVehiculo } from './ModalesVehiculos/ModalEliminarVehiculo';
import './VehiculosPrincipal.css';
import { API_CONFIG } from "../../../config/api";

const VehiculosPrincipal = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const recargarVehiculos = async () => {
    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.get(`${API_CONFIG.BASE_URL}/vehiculos`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 10000
      });

      setVehiculos(response.data);

    } catch (error) {
      console.error('❌ Error al cargar vehículos:', error);

      if (error.code === 'ECONNABORTED') {
        setError('La conexión tardó demasiado. Verifica tu servidor.');
      } else if (error.response) {
        setError(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Verifica que esté corriendo.');
      } else {
        setError(error.message);
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    recargarVehiculos();
  }, []);

  const handleAgregarVehiculo = () => {
    setModalAgregarAbierto(true);
  };

  const handleVerVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalVerAbierto(true);
  };

  const handleEditarVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalEditarAbierto(true);
  };

  const handleEliminarVehiculo = async (vehiculo) => {
    const confirmado = await modalEliminarVehiculo(vehiculo, recargarVehiculos);
    if (confirmado) {
    }
  };

  const handleGuardarNuevoVehiculo = async (vehiculo) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append('nombre', vehiculo.nombre);
      formData.append('rendimiento', parseFloat(vehiculo.rendimiento));
      formData.append('precio_combustible', parseFloat(vehiculo.precio_combustible));
      formData.append('desgaste', parseFloat(vehiculo.desgaste));
      formData.append('costo_renta', parseFloat(vehiculo.costo_renta));
      formData.append('costo_chofer_dia', parseFloat(vehiculo.costo_chofer_dia));
      formData.append('marca', vehiculo.marca);
      formData.append('modelo', vehiculo.modelo);
      formData.append('anio', parseInt(vehiculo.anio));
      formData.append('numero_placa', vehiculo.numero_placa);
      formData.append('numero_pasajeros', parseInt(vehiculo.numero_pasajeros));
      formData.append('vehiculos_disponibles', parseInt(vehiculo.vehiculos_disponibles));

      formData.append('numero_serie', vehiculo.numero_serie || '');
      formData.append('nip', vehiculo.nip || '');
      formData.append('numero_tag', vehiculo.numero_tag || '');
      formData.append('numero_combustible', vehiculo.numero_combustible || '');
      formData.append('color', vehiculo.color || '');
      formData.append('comentarios', vehiculo.comentarios || '');

      if (vehiculo.documentos?.foto_vehiculo instanceof File) {
        formData.append('foto_vehiculo', vehiculo.documentos.foto_vehiculo);
      }
      if (vehiculo.documentos?.foto_poliza_seguro instanceof File) {
        formData.append('foto_poliza_seguro', vehiculo.documentos.foto_poliza_seguro);
      }
      if (vehiculo.documentos?.foto_factura instanceof File) {
        formData.append('foto_factura', vehiculo.documentos.foto_factura);
      }
      if (vehiculo.documentos?.foto_verificaciones instanceof File) {
        formData.append('foto_verificaciones', vehiculo.documentos.foto_verificaciones);
      }
      if (vehiculo.documentos?.foto_folio_antt instanceof File) {
        formData.append('foto_folio_antt', vehiculo.documentos.foto_folio_antt);
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/vehiculos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        }
      );

      await recargarVehiculos();
      return response.data;

    } catch (error) {
      console.error("❌ Error al crear vehiculo:", error);
      console.error("❌ Respuesta del servidor:", error.response?.data);
      throw error;
    }
  };

  const handleActualizarVehiculo = async (vehiculoActualizado) => {
    try {
      const token = localStorage.getItem("token");

      const tieneArchivosNuevos =
        (vehiculoActualizado.documentos?.foto_vehiculo instanceof File) ||
        (vehiculoActualizado.documentos?.foto_poliza_seguro instanceof File) ||
        (vehiculoActualizado.documentos?.foto_factura instanceof File) ||
        (vehiculoActualizado.documentos?.foto_verificaciones instanceof File) ||
        (vehiculoActualizado.documentos?.foto_folio_antt instanceof File);

      if (tieneArchivosNuevos) {
        const formData = new FormData();

        formData.append('nombre', vehiculoActualizado.nombre);
        formData.append('rendimiento', parseFloat(vehiculoActualizado.rendimiento));
        formData.append('precio_combustible', parseFloat(vehiculoActualizado.precio_combustible));
        formData.append('desgaste', parseFloat(vehiculoActualizado.desgaste));
        formData.append('costo_renta', parseFloat(vehiculoActualizado.costo_renta));
        formData.append('costo_chofer_dia', parseFloat(vehiculoActualizado.costo_chofer_dia));
        formData.append('marca', vehiculoActualizado.marca);
        formData.append('modelo', vehiculoActualizado.modelo);
        formData.append('anio', parseInt(vehiculoActualizado.anio));
        formData.append('numero_placa', vehiculoActualizado.numero_placa);
        formData.append('numero_pasajeros', parseInt(vehiculoActualizado.numero_pasajeros));
        formData.append('vehiculos_disponibles', parseInt(vehiculoActualizado.vehiculos_disponibles));

        formData.append('numero_serie', vehiculoActualizado.numero_serie || '');
        formData.append('nip', vehiculoActualizado.nip || '');
        formData.append('numero_tag', vehiculoActualizado.numero_tag || '');
        formData.append('numero_combustible', vehiculoActualizado.numero_combustible || '');
        formData.append('color', vehiculoActualizado.color || '');
        formData.append('comentarios', vehiculoActualizado.comentarios || '');

        if (vehiculoActualizado.documentos?.foto_vehiculo instanceof File) {
          formData.append('foto_vehiculo', vehiculoActualizado.documentos.foto_vehiculo);
        }
        if (vehiculoActualizado.documentos?.foto_poliza_seguro instanceof File) {
          formData.append('foto_poliza_seguro', vehiculoActualizado.documentos.foto_poliza_seguro);
        }
        if (vehiculoActualizado.documentos?.foto_factura instanceof File) {
          formData.append('foto_factura', vehiculoActualizado.documentos.foto_factura);
        }
        if (vehiculoActualizado.documentos?.foto_verificaciones instanceof File) {
          formData.append('foto_verificaciones', vehiculoActualizado.documentos.foto_verificaciones);
        }
        if (vehiculoActualizado.documentos?.foto_folio_antt instanceof File) {
          formData.append('foto_folio_antt', vehiculoActualizado.documentos.foto_folio_antt);
        }

        formData.append('_method', 'PUT');

        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/vehiculos/${vehiculoActualizado.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            }
          }
        );

        await recargarVehiculos();
        return response.data;

      } else {
        const vehiculoData = {
          nombre: vehiculoActualizado.nombre,
          rendimiento: parseFloat(vehiculoActualizado.rendimiento),
          precio_combustible: parseFloat(vehiculoActualizado.precio_combustible),
          desgaste: parseFloat(vehiculoActualizado.desgaste),
          costo_renta: parseFloat(vehiculoActualizado.costo_renta),
          costo_chofer_dia: parseFloat(vehiculoActualizado.costo_chofer_dia),
          marca: vehiculoActualizado.marca,
          modelo: vehiculoActualizado.modelo,
          anio: parseInt(vehiculoActualizado.anio),
          numero_placa: vehiculoActualizado.numero_placa,
          numero_pasajeros: parseInt(vehiculoActualizado.numero_pasajeros),
          vehiculos_disponibles: parseInt(vehiculoActualizado.vehiculos_disponibles),
          numero_serie: vehiculoActualizado.numero_serie || null,
          nip: vehiculoActualizado.nip || null,
          numero_tag: vehiculoActualizado.numero_tag || null,
          numero_combustible: vehiculoActualizado.numero_combustible || null,
          color: vehiculoActualizado.color || null,
          comentarios: vehiculoActualizado.comentarios || null,
        };

        const response = await axios.put(
          `${API_CONFIG.BASE_URL}/vehiculos/${vehiculoActualizado.id}`,
          vehiculoData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          }
        );

        await recargarVehiculos();
        return response.data;
      }

    } catch (error) {
      console.error("❌ Error al actualizar vehiculo:", error);
      console.error("❌ Respuesta del servidor:", error.response?.data);
      throw error;
    }
  };

  const handleCerrarModalAgregar = () => {
    setModalAgregarAbierto(false);
  };

  if (error) {
    return (
      <PrincipalComponente>
        <div className="vehiculos-error-container">
          <div className="vehiculos-error-box">
            <h2 className="vehiculos-error-title">
              ❌ Error al cargar vehículos
            </h2>
            <p className="vehiculos-error-message">
              {error}
            </p>
            <button
              onClick={recargarVehiculos}
              className="vehiculos-error-button"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </PrincipalComponente>
    );
  }

  return (
    <PrincipalComponente>
      <div className="vehiculos-principal">
        <TablaVehiculos
          vehiculos={vehiculos}
          setVehiculos={setVehiculos}
          onVer={handleVerVehiculo}
          onEditar={handleEditarVehiculo}
          onEliminar={handleEliminarVehiculo}
          onAgregar={handleAgregarVehiculo}
          cargando={cargando}
          onRecargar={recargarVehiculos}
        />

        {modalAgregarAbierto && (
          <ModalVehiculo
            onGuardar={handleGuardarNuevoVehiculo}
            onCerrar={handleCerrarModalAgregar}
          />
        )}

        {modalEditarAbierto && vehiculoSeleccionado && (
          <ModalEditarVehiculo
            vehiculo={vehiculoSeleccionado}
            onGuardar={handleActualizarVehiculo}
            onCerrar={() => {
              setModalEditarAbierto(false);
              setVehiculoSeleccionado(null);
            }}
          />
        )}

        {modalVerAbierto && vehiculoSeleccionado && (
          <ModalVerVehiculo
            vehiculo={vehiculoSeleccionado}
            onCerrar={() => {
              setModalVerAbierto(false);
              setVehiculoSeleccionado(null);
            }}
          />
        )}
      </div>
    </PrincipalComponente>
  );
};

export default VehiculosPrincipal;