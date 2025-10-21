import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const VehiculosContext = createContext();

export const useVehiculos = () => {
  const context = useContext(VehiculosContext);
  if (!context) {
    throw new Error('useVehiculos debe usarse dentro de VehiculosProvider');
  }
  return context;
};

export const VehiculosProvider = ({ children }) => {
  // Estado de vehículos
  const [vehiculos, setVehiculos] = useState([]);
  
  // Estado de mantenimientos (uno por cada vehículo)
  const [mantenimientos, setMantenimientos] = useState([]);

  // Cargar datos de ejemplo al iniciar
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

    // Crear mantenimientos iniciales para los vehículos de ejemplo
    const mantenimientosIniciales = vehiculosEjemplo.map(vehiculo => 
      crearMantenimientoInicial(vehiculo)
    );
    setMantenimientos(mantenimientosIniciales);
  }, []);

  // Función auxiliar para crear mantenimiento inicial
  const crearMantenimientoInicial = (vehiculo) => {
    const fechaActual = new Date();
    return {
      vehiculo_id: vehiculo.id,
      kilometraje_actual: 0,
      ultimo_mantenimiento: null,
      proximo_mantenimiento: null,
      intervalo_km: 5000, // Intervalo por defecto: cada 5,000 km
      estado: 'verde', // verde, amarillo, rojo
      historial: [],
      comentarios: '',
      fecha_registro: fechaActual.toISOString()
    };
  };

  // Calcular estado del mantenimiento
  const calcularEstadoMantenimiento = useCallback((mantenimiento) => {
    const { kilometraje_actual, ultimo_mantenimiento, intervalo_km } = mantenimiento;

    if (!ultimo_mantenimiento) {
      // Si no hay mantenimiento previo
      if (kilometraje_actual >= intervalo_km * 0.9) {
        return 'amarillo'; // Próximo (90% del intervalo)
      }
      if (kilometraje_actual >= intervalo_km) {
        return 'rojo'; // Vencido
      }
      return 'verde'; // Bueno
    }

    const kmDesdeUltimoMant = kilometraje_actual - ultimo_mantenimiento.kilometraje;
    
    if (kmDesdeUltimoMant >= intervalo_km) {
      return 'rojo'; // Urgente
    }
    if (kmDesdeUltimoMant >= intervalo_km * 0.8) {
      return 'amarillo'; // Próximo
    }
    return 'verde'; // Bueno
  }, []);

  // ✅ AGREGAR VEHÍCULO - Crea automáticamente su mantenimiento
  const agregarVehiculo = useCallback(async (vehiculoData) => {
    const nuevoId = vehiculos.length > 0 ? Math.max(...vehiculos.map(v => v.id)) + 1 : 1;

    // Convertir archivos File a URLs
    const documentosConURL = {};
    if (vehiculoData.documentos) {
      Object.keys(vehiculoData.documentos).forEach(key => {
        const archivo = vehiculoData.documentos[key];
        if (archivo && archivo instanceof File) {
          documentosConURL[key] = URL.createObjectURL(archivo);
        } else if (archivo) {
          documentosConURL[key] = archivo;
        }
      });
    }

    const nuevoVehiculo = {
      ...vehiculoData,
      id: nuevoId,
      documentos: documentosConURL
    };

    // Agregar vehículo
    setVehiculos(prev => [...prev, nuevoVehiculo]);

    // 🚀 Crear automáticamente su registro de mantenimiento
    const nuevoMantenimiento = crearMantenimientoInicial(nuevoVehiculo);
    setMantenimientos(prev => [...prev, nuevoMantenimiento]);

    console.log('✅ Vehículo agregado:', nuevoVehiculo);
    console.log('🔧 Mantenimiento creado automáticamente:', nuevoMantenimiento);

    await new Promise(resolve => setTimeout(resolve, 500));
  }, [vehiculos]);

  // ✅ ACTUALIZAR VEHÍCULO - Sincroniza con mantenimiento
  const actualizarVehiculo = useCallback((vehiculoActualizado) => {
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

    console.log('✅ Vehículo actualizado:', vehiculoConDocumentos);
  }, []);

  // ✅ ELIMINAR VEHÍCULO - También elimina su mantenimiento
  const eliminarVehiculo = useCallback(async (vehiculoId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setVehiculos(prev => prev.filter(v => v.id !== vehiculoId));
    setMantenimientos(prev => prev.filter(m => m.vehiculo_id !== vehiculoId));

    console.log('✅ Vehículo y su mantenimiento eliminados');
  }, []);

  // ✅ ACTUALIZAR MANTENIMIENTO
  const actualizarMantenimiento = useCallback((vehiculoId, datosMantenimiento) => {
    setMantenimientos(prev =>
      prev.map(m => {
        if (m.vehiculo_id === vehiculoId) {
          const mantenimientoActualizado = { ...m, ...datosMantenimiento };
          // Recalcular estado
          mantenimientoActualizado.estado = calcularEstadoMantenimiento(mantenimientoActualizado);
          return mantenimientoActualizado;
        }
        return m;
      })
    );

    console.log('🔧 Mantenimiento actualizado para vehículo:', vehiculoId);
  }, [calcularEstadoMantenimiento]);

  // ✅ REGISTRAR NUEVO MANTENIMIENTO
  const registrarMantenimiento = useCallback((vehiculoId, nuevoMantenimiento) => {
    setMantenimientos(prev =>
      prev.map(m => {
        if (m.vehiculo_id === vehiculoId) {
          const historialActualizado = [
            ...m.historial,
            {
              ...nuevoMantenimiento,
              fecha: new Date().toISOString(),
              id: m.historial.length + 1
            }
          ];

          const mantenimientoActualizado = {
            ...m,
            ultimo_mantenimiento: {
              fecha: new Date().toISOString(),
              kilometraje: nuevoMantenimiento.kilometraje,
              tipo: nuevoMantenimiento.tipo,
              descripcion: nuevoMantenimiento.descripcion
            },
            kilometraje_actual: nuevoMantenimiento.kilometraje,
            historial: historialActualizado
          };

          // Recalcular estado
          mantenimientoActualizado.estado = calcularEstadoMantenimiento(mantenimientoActualizado);

          return mantenimientoActualizado;
        }
        return m;
      })
    );

    console.log('🔧 Nuevo mantenimiento registrado para vehículo:', vehiculoId);
  }, [calcularEstadoMantenimiento]);

  // Obtener mantenimiento de un vehículo específico
  const obtenerMantenimiento = useCallback((vehiculoId) => {
    return mantenimientos.find(m => m.vehiculo_id === vehiculoId);
  }, [mantenimientos]);

  // Obtener estadísticas de mantenimiento
  const obtenerEstadisticas = useCallback(() => {
    const total = mantenimientos.length;
    const verde = mantenimientos.filter(m => m.estado === 'verde').length;
    const amarillo = mantenimientos.filter(m => m.estado === 'amarillo').length;
    const rojo = mantenimientos.filter(m => m.estado === 'rojo').length;

    return { total, verde, amarillo, rojo };
  }, [mantenimientos]);

  const value = {
    // Vehículos
    vehiculos,
    agregarVehiculo,
    actualizarVehiculo,
    eliminarVehiculo,

    // Mantenimientos
    mantenimientos,
    actualizarMantenimiento,
    registrarMantenimiento,
    obtenerMantenimiento,
    obtenerEstadisticas,
    calcularEstadoMantenimiento
  };

  return (
    <VehiculosContext.Provider value={value}>
      {children}
    </VehiculosContext.Provider>
  );
};

export default VehiculosContext;