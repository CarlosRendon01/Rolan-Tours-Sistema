import React, { useState } from 'react';
import TablaOperadores from './Componentes/TablaOperadores';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import './OperadoresPrincipal.css';
import ModalAgregarOperador from './ModalesOperadores/ModalAgregarOperador';

const OperadoresPrincipal = () => {
    // Estado para almacenar los operadores
    const [operadores, setOperadores] = useState([
        {
            id: 1,
            nombre: 'Juan',
            apellidoPaterno: 'García',
            apellidoMaterno: 'López',
            edad: 35,
            telefonoEmergencia: '5551234567',
            telefonoPersonal: '5559876543',
            telefonoFamiliar: '5556547890',
            numeroLicencia: 'LIC-2024-001',
            correoElectronico: 'juan.garcia@email.com',
            fechaVigenciaLicencia: '2024-01-15',
            fechaVencimientoLicencia: '2026-01-15',
            fechaVencimientoExamen: '2025-06-20',
            foto: null,
            ine: null,
            comentarios: 'Operador con experiencia de 10 años'
        },
        {
            id: 2,
            nombre: 'María',
            apellidoPaterno: 'Hernández',
            apellidoMaterno: 'Martínez',
            edad: 28,
            telefonoEmergencia: '5552345678',
            telefonoPersonal: '5558765432',
            telefonoFamiliar: '5557654321',
            numeroLicencia: 'LIC-2024-002',
            correoElectronico: 'maria.hernandez@email.com',
            fechaVigenciaLicencia: '2024-03-10',
            fechaVencimientoLicencia: '2025-11-10',
            fechaVencimientoExamen: '2025-03-15',
            foto: null,
            ine: null,
            comentarios: 'Excelente desempeño y puntualidad'
        },
        {
            id: 3,
            nombre: 'Carlos',
            apellidoPaterno: 'Rodríguez',
            apellidoMaterno: 'Sánchez',
            edad: 42,
            telefonoEmergencia: '5553456789',
            telefonoPersonal: '5557654321',
            telefonoFamiliar: '5558765432',
            numeroLicencia: 'LIC-2024-003',
            correoElectronico: 'carlos.rodriguez@email.com',
            fechaVigenciaLicencia: '2023-06-20',
            fechaVencimientoLicencia: '2025-06-20',
            fechaVencimientoExamen: '2025-12-10',
            foto: null,
            ine: null,
            comentarios: 'Especializado en rutas largas'
        },
        {
            id: 4,
            nombre: 'Ana',
            apellidoPaterno: 'Pérez',
            apellidoMaterno: 'González',
            edad: 31,
            telefonoEmergencia: '5554567890',
            telefonoPersonal: '5556543210',
            telefonoFamiliar: '5559876543',
            numeroLicencia: 'LIC-2024-004',
            correoElectronico: 'ana.perez@email.com',
            fechaVigenciaLicencia: '2024-02-05',
            fechaVencimientoLicencia: '2024-10-05',
            fechaVencimientoExamen: '2025-02-05',
            foto: null,
            ine: null,
            comentarios: 'Licencia por vencer pronto'
        },
        {
            id: 5,
            nombre: 'Luis',
            apellidoPaterno: 'Ramírez',
            apellidoMaterno: 'Torres',
            edad: 39,
            telefonoEmergencia: '5555678901',
            telefonoPersonal: '5555432109',
            telefonoFamiliar: '5558901234',
            numeroLicencia: 'LIC-2024-005',
            correoElectronico: 'luis.ramirez@email.com',
            fechaVigenciaLicencia: '2024-04-18',
            fechaVencimientoLicencia: '2026-04-18',
            fechaVencimientoExamen: '2025-10-25',
            foto: null,
            ine: null,
            comentarios: 'Conocimiento en mantenimiento básico'
        }
    ]);

    // Estados para controlar los modales
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [operadorSeleccionado, setOperadorSeleccionado] = useState(null);

    // Funciones para manejar los modales
    const manejarVer = (operador) => {
        setOperadorSeleccionado(operador);
        setModalVerAbierto(true);
        console.log('Ver operador:', operador);
    };

    const manejarEditar = (operador) => {
        setOperadorSeleccionado(operador);
        setModalEditarAbierto(true);
        console.log('Editar operador:', operador);
    };

    const manejarEliminar = (operador) => {
        setOperadorSeleccionado(operador);
        setModalEliminarAbierto(true);
        console.log('Eliminar operador:', operador);
    };

    const manejarAgregar = () => {
        setModalAgregarAbierto(true);
        console.log('Agregar nuevo operador');
    };

    // Función para cerrar modales
    const cerrarModales = () => {
        setModalVerAbierto(false);
        setModalEditarAbierto(false);
        setModalEliminarAbierto(false);
        setModalAgregarAbierto(false);
        setOperadorSeleccionado(null);
    };

    // Función para agregar operador
    const agregarOperador = (nuevoOperador) => {
        const operadorConId = {
            ...nuevoOperador,
            id: operadores.length > 0 ? Math.max(...operadores.map(o => o.id)) + 1 : 1
        };
        setOperadores([...operadores, operadorConId]);
        cerrarModales();
    };

    // Función para actualizar operador
    const actualizarOperador = (operadorActualizado) => {
        setOperadores(operadores.map(op =>
            op.id === operadorActualizado.id ? operadorActualizado : op
        ));
        cerrarModales();
    };

    // Función para eliminar operador
    const eliminarOperador = (id) => {
        setOperadores(operadores.filter(op => op.id !== id));
        cerrarModales();
    };

    return (
        <PrincipalComponente>
            <div className="operadores-principal">
                <TablaOperadores
                    operadores={operadores}
                    setOperadores={setOperadores}
                    onVer={manejarVer}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                    onAgregar={manejarAgregar}
                />

                {/* Modal VER */}
                {modalVerAbierto && operadorSeleccionado && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '8px',
                            maxWidth: '500px'
                        }}>
                            <h2>Ver Operador (Modal en desarrollo)</h2>
                            <p>Operador: {operadorSeleccionado.nombre}</p>
                            <button onClick={cerrarModales}>Cerrar</button>
                        </div>
                    </div>
                )}

                {/* Modal EDITAR */}
                {modalEditarAbierto && operadorSeleccionado && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '8px',
                            maxWidth: '500px'
                        }}>
                            <h2>Editar Operador (Modal en desarrollo)</h2>
                            <p>Editando: {operadorSeleccionado.nombre}</p>
                            <button onClick={cerrarModales}>Cerrar</button>
                        </div>
                    </div>
                )}

                {/* Modal ELIMINAR */}
                {modalEliminarAbierto && operadorSeleccionado && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '8px',
                            maxWidth: '500px'
                        }}>
                            <h2>Eliminar Operador (Modal en desarrollo)</h2>
                            <p>¿Eliminar a {operadorSeleccionado.nombre}?</p>
                            <button onClick={() => eliminarOperador(operadorSeleccionado.id)}>Eliminar</button>
                            <button onClick={cerrarModales}>Cancelar</button>
                        </div>
                    </div>
                )}

                {/* Modal AGREGAR */}
                {modalAgregarAbierto && (
                    <ModalAgregarOperador
                        onGuardar={agregarOperador}
                        onCerrar={cerrarModales}
                    />
                )}
            </div>
        </PrincipalComponente>
    );
};

export default OperadoresPrincipal;