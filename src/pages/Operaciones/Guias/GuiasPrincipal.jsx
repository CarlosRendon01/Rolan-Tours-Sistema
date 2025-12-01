import React, { useState } from 'react';
import TablaGuias from './Componentes/TablaGuias';
import PrincipalComponente from '../../Generales/componentes/PrincipalComponente';
import './GuiasPrincipal.css';
import ModalAgregarGuia from './ModalesGuias/ModalAgregarGuia';
import ModalVerGuia from './ModalesGuias/ModalVerGuia';
import ModalEditarGuia from './ModalesGuias/ModalEditarGuia';
import { modalEliminarGuia } from './ModalesGuias/ModalEliminarGuia';

const GuiasPrincipal = () => {
    // Estado para almacenar los guías
    const [guias, setGuias] = useState([
        {
            id: 1,
            nombre: 'María',
            apellido_paterno: 'González',
            apellido_materno: 'Ramírez',
            fecha_nacimiento: '1992-03-15',
            telefono: '9511234567',
            email: 'maria.gonzalez@email.com',
            ciudad: 'Oaxaca de Juárez',
            estado: 'Oaxaca',
            nss: '12345678901',
            institucion_seguro: 'IMSS',
            contacto_emergencia: 'Pedro González',
            telefono_emergencia: '9519876543',
            costo_dia: 850.00,
            idiomas: 'Español, Inglés, Francés',
            experiencia_anos: 8,
            especialidades: 'Guía certificada con experiencia en turismo cultural y arqueológico',
            certificacion_oficial: 'SECTUR-OAX-2016-045',
            zona_servicio: 'Oaxaca Centro, Monte Albán, Mitla',
            estado_operativo: 'activo',
            documentos: {
                foto_guia: null,
                foto_ine: null,
                foto_certificaciones: null,
                foto_licencia: null,
                foto_comprobante_domicilio: null
            }
        },
        {
            id: 2,
            nombre: 'Carlos',
            apellido_paterno: 'Hernández',
            apellido_materno: 'López',
            fecha_nacimiento: '1996-07-22',
            telefono: '9512345678',
            email: 'carlos.hernandez@email.com',
            ciudad: 'Oaxaca de Juárez',
            estado: 'Oaxaca',
            nss: '23456789012',
            institucion_seguro: 'Privado',
            contacto_emergencia: 'Ana López',
            telefono_emergencia: '9518765432',
            costo_dia: 750.00,
            idiomas: 'Español, Inglés, Alemán',
            experiencia_anos: 5,
            especialidades: 'Especialista en turismo cultural y gastronomía oaxaqueña',
            certificacion_oficial: 'SECTUR-OAX-2019-087',
            zona_servicio: 'Centro Histórico, Valles Centrales',
            estado_operativo: 'activo',
            documentos: {
                foto_guia: null,
                foto_ine: null,
                foto_certificaciones: null,
                foto_licencia: null,
                foto_comprobante_domicilio: null
            }
        },
        {
            id: 3,
            nombre: 'Ana',
            apellido_paterno: 'Martínez',
            apellido_materno: 'Pérez',
            fecha_nacimiento: '1989-11-08',
            telefono: '9513456789',
            email: 'ana.martinez@email.com',
            ciudad: 'Oaxaca de Juárez',
            estado: 'Oaxaca',
            nss: '34567890123',
            institucion_seguro: 'IMSS',
            contacto_emergencia: 'Roberto Pérez',
            telefono_emergencia: '9517654321',
            costo_dia: 900.00,
            idiomas: 'Español, Inglés, Italiano, Portugués',
            experiencia_anos: 10,
            especialidades: 'Guía políglota con experiencia en turismo europeo y ecoturismo',
            certificacion_oficial: 'SECTUR-OAX-2014-023',
            zona_servicio: 'Costa Oaxaqueña, Sierra Norte, Valles',
            estado_operativo: 'activo',
            documentos: {
                foto_guia: null,
                foto_ine: null,
                foto_certificaciones: null,
                foto_licencia: null,
                foto_comprobante_domicilio: null
            }
        },
        {
            id: 4,
            nombre: 'Roberto',
            apellido_paterno: 'Sánchez',
            apellido_materno: 'García',
            fecha_nacimiento: '1983-05-12',
            telefono: '9514567890',
            email: 'roberto.sanchez@email.com',
            ciudad: 'Oaxaca de Juárez',
            estado: 'Oaxaca',
            nss: '45678901234',
            institucion_seguro: 'IMSS',
            contacto_emergencia: 'Laura García',
            telefono_emergencia: '9516543210',
            costo_dia: 950.00,
            idiomas: 'Español, Inglés',
            experiencia_anos: 15,
            especialidades: 'Experto en historia y arqueología mexicana, especializado en cultura zapoteca',
            certificacion_oficial: 'SECTUR-OAX-2009-012',
            zona_servicio: 'Monte Albán, Mitla, Yagul, Hierve el Agua',
            estado_operativo: 'activo',
            documentos: {
                foto_guia: null,
                foto_ine: null,
                foto_certificaciones: null,
                foto_licencia: null,
                foto_comprobante_domicilio: null
            }
        },
        {
            id: 5,
            nombre: 'Laura',
            apellido_paterno: 'Torres',
            apellido_materno: 'Ramírez',
            fecha_nacimiento: '1998-09-25',
            telefono: '9515678901',
            email: 'laura.torres@email.com',
            ciudad: 'Oaxaca de Juárez',
            estado: 'Oaxaca',
            nss: '56789012345',
            institucion_seguro: 'Privado',
            contacto_emergencia: 'Carmen Ramírez',
            telefono_emergencia: '9515432109',
            costo_dia: 700.00,
            idiomas: 'Español, Inglés, Japonés',
            experiencia_anos: 3,
            especialidades: 'Especialista en turismo asiático y artesanías tradicionales oaxaqueñas',
            certificacion_oficial: 'SECTUR-OAX-2021-156',
            zona_servicio: 'Centro Histórico, Mercados, Teotitlán del Valle',
            estado_operativo: 'activo',
            documentos: {
                foto_guia: null,
                foto_ine: null,
                foto_certificaciones: null,
                foto_licencia: null,
                foto_comprobante_domicilio: null
            }
        }
    ]);

    // Estados para controlar los modales
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [guiaSeleccionado, setGuiaSeleccionado] = useState(null);

    // Funciones para manejar los modales
    const manejarVer = (guia) => {
        setGuiaSeleccionado(guia);
        setModalVerAbierto(true);
        console.log('Ver guía:', guia);
    };

    const manejarEditar = (guia) => {
        setGuiaSeleccionado(guia);
        setModalEditarAbierto(true);
        console.log('Editar guía:', guia);
    };

    const manejarEliminar = async (guia) => {
        const confirmado = await modalEliminarGuia(guia, eliminarGuia);
        if (confirmado) {
            console.log('Guía eliminado:', guia);
        }
    };

    const manejarAgregar = () => {
        setModalAgregarAbierto(true);
        console.log('Agregar nuevo guía');
    };

    // Función para cerrar modales
    const cerrarModales = () => {
        setModalVerAbierto(false);
        setModalEditarAbierto(false);
        setModalEliminarAbierto(false);
        setModalAgregarAbierto(false);
        setGuiaSeleccionado(null);
    };

    // Función para agregar guía
    const agregarGuia = (nuevoGuia) => {
        console.log('🔥 Datos recibidos del modal:', nuevoGuia);

        const guiaConId = {
            id: guias.length > 0 ? Math.max(...guias.map(g => g.id)) + 1 : 1,
            ...nuevoGuia
        };

        console.log('✅ Guía formateado para agregar:', guiaConId);
        setGuias([...guias, guiaConId]);
        cerrarModales();
    };

    // Función para actualizar guía
    const actualizarGuia = (guiaActualizado) => {
        setGuias(guias.map(g =>
            g.id === guiaActualizado.id ? guiaActualizado : g
        ));
        cerrarModales();
    };

    // Función para eliminar guía
    const eliminarGuia = (id) => {
        setGuias(guias.filter(g => g.id !== id));
        cerrarModales();
    };

    return (
        <PrincipalComponente>
            <div className="guias-principal">
                <TablaGuias
                    guias={guias}
                    setGuias={setGuias}
                    onVer={manejarVer}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                    onAgregar={manejarAgregar}
                />

                {/* Modal VER */}
                {modalVerAbierto && guiaSeleccionado && (
                    <ModalVerGuia
                        guia={guiaSeleccionado}
                        onCerrar={cerrarModales}
                    />
                )}

                {/* Modal EDITAR */}
                {modalEditarAbierto && guiaSeleccionado && (
                    <ModalEditarGuia
                        guia={guiaSeleccionado}
                        onGuardar={actualizarGuia}
                        onCerrar={cerrarModales}
                    />
                )}

                {/* Modal AGREGAR */}
                {modalAgregarAbierto && (
                    <ModalAgregarGuia
                        onGuardar={agregarGuia}
                        onCerrar={cerrarModales}
                    />
                )}
            </div>
        </PrincipalComponente>
    );
};

export default GuiasPrincipal;