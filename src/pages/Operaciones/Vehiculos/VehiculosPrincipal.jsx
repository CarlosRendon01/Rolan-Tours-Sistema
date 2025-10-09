import { useState, useEffect } from 'react';
import PrincipalComponente from "../../Generales/componentes/PrincipalComponente";
import TablaVehiculos from './Componentes/TablaVehiculos';
import ModalVehiculo from './ModalesVehiculos/ModalVehiculo';
import ModalEditarVehiculo from './ModalesVehiculos/ModalEditarVehiculo';
import ModalVerVehiculo from './ModalesVehiculos/ModalVerVehiculo';
import { modalEliminarVehiculo } from './ModalesVehiculos/ModalEliminarVehiculo';
import './VehiculosPrincipal.css';

const VehiculosPrincipal = () => {
  // Estado principal de vehículos
  const [vehiculos, setVehiculos] = useState([]);

  // Estados de los modales
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  // Cargar datos de ejemplo al montar el componente
  useEffect(() => {
    const vehiculosEjemplo = [
      {
        id: 1,
        nombre: 'Sprinter Mercedes-Benz',
        rendimiento: 12.50,
        precio_combustible: 24.50,
        desgaste: 0.15,
        costo_renta: 2500.00,
        costo_chofer_dia: 800.00,
        marca: 'Mercedes-Benz',
        modelo: 'Sprinter 2024',
        año: 2024,
        color: 'Blanco',
        numero_placa: 'ABC-123',
        numero_pasajeros: 15,
        vehiculos_disponibles: 3,
        numero_serie: 'WDB9066661N123456',
        nip: '1234',
        numero_tag: 'TAG-001',
        numero_combustible: 'COMB-001'
      },
      {
        id: 2,
        nombre: 'Hiace Toyota',
        rendimiento: 10.80,
        precio_combustible: 24.50,
        desgaste: 0.12,
        costo_renta: 2000.00,
        costo_chofer_dia: 750.00,
        marca: 'Toyota',
        modelo: 'Hiace 2023',
        año: 2023,
        color: 'Gris',
        numero_placa: 'XYZ-456',
        numero_pasajeros: 12,
        vehiculos_disponibles: 2,
        numero_serie: 'JTFSX23P5E5123456',
        nip: '5678',
        numero_tag: 'TAG-002',
        numero_combustible: 'COMB-002'
      },
      {
        id: 3,
        nombre: 'Urvan Nissan',
        rendimiento: 9.50,
        precio_combustible: 24.50,
        desgaste: 0.10,
        costo_renta: 1800.00,
        costo_chofer_dia: 700.00,
        marca: 'Nissan',
        modelo: 'Urvan 2023',
        año: 2023,
        color: 'Negro',
        numero_placa: 'DEF-789',
        numero_pasajeros: 14,
        vehiculos_disponibles: 4,
        numero_serie: 'JN1TANS25U0123456',
        nip: '9012',
        numero_tag: 'TAG-003',
        numero_combustible: 'COMB-003'
      }
    ];
    setVehiculos(vehiculosEjemplo);
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
    const confirmado = await modalEliminarVehiculo(vehiculo, async (vehiculoAEliminar) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      setVehiculos(prev => prev.filter(v => v.id !== vehiculoAEliminar.id));
      console.log('✅ Vehículo eliminado exitosamente:', vehiculoAEliminar.nombre);
    });
  };

  // ✅ AGREGAR - Esta función NO cierra el modal, lo hace el ModalVehiculo después de la alerta
  const handleGuardarNuevoVehiculo = async (vehiculo) => {
    const nuevoId = vehiculos.length > 0 ? Math.max(...vehiculos.map(v => v.id)) + 1 : 1;

    // Convertir archivos File a URLs visualizables
    const documentosConURL = {};
    if (vehiculo.documentos) {
      Object.keys(vehiculo.documentos).forEach(key => {
        const archivo = vehiculo.documentos[key];
        if (archivo && archivo instanceof File) {
          documentosConURL[key] = URL.createObjectURL(archivo);
        } else if (archivo) {
          documentosConURL[key] = archivo;
        }
      });
    }

    const nuevoVehiculo = {
      ...vehiculo,
      id: nuevoId,
      documentos: documentosConURL
    };

    setVehiculos(prev => [...prev, nuevoVehiculo]);

    console.log('✅ Vehículo agregado:', nuevoVehiculo);
    console.log('📸 URL foto_vehiculo:', nuevoVehiculo.documentos?.foto_vehiculo);
    
    // Simular delay de guardado (opcional)
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleActualizarVehiculo = (vehiculoActualizado) => {
    const documentosConURL = {};
    if (vehiculoActualizado.documentos) {
      Object.keys(vehiculoActualizado.documentos).forEach(key => {
        const archivo = vehiculoActualizado.documentos[key];
        if (archivo && archivo instanceof File) {
          documentosConURL[key] = URL.createObjectURL(archivo);
        } else if (archivo) {
          documentosConURL[key] = archivo;
        }
      });
    }

    const vehiculoConDocumentos = {
      ...vehiculoActualizado,
      documentos: documentosConURL
    };

    setVehiculos(prev =>
      prev.map(v => v.id === vehiculoConDocumentos.id ? vehiculoConDocumentos : v)
    );

    setModalEditarAbierto(false);
    setVehiculoSeleccionado(null);

    console.log('✅ Vehículo actualizado:', vehiculoConDocumentos);
  };

  const handleCerrarModalAgregar = () => {
    setModalAgregarAbierto(false);
  };

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
        />

        {/* Modal AGREGAR */}
        {modalAgregarAbierto && (
          <ModalVehiculo
            onGuardar={handleGuardarNuevoVehiculo}
            onCerrar={handleCerrarModalAgregar}
          />
        )}

        {/* Modal EDITAR */}
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

        {/* Modal VER */}
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