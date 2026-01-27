import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablaGuias from './Componentes/TablaGuias';
import PrincipalComponente from '../../Generales/Componentes/PrincipalComponente';
import './GuiasPrincipal.css';
import ModalAgregarGuia from './ModalesGuias/ModalAgregarGuia';
import ModalVerGuia from './ModalesGuias/ModalVerGuia';
import ModalEditarGuia from './ModalesGuias/ModalEditarGuia';
import { modalEliminarGuia } from './ModalesGuias/ModalEliminarGuia';
import { API_CONFIG } from "../../../config/api";

const GuiasPrincipal = () => {
    const [guias, setGuias] = useState([]);
    const [modalVerAbierto, setModalVerAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [guiaSeleccionado, setGuiaSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        recargarGuias();
    }, []);

    const recargarGuias = async () => {
        setCargando(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No hay token de autenticación");
            }

            const response = await axios.get(`${API_CONFIG.BASE_URL}/guias`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                timeout: 10000
            });

            setGuias(response.data);

        } catch (error) {

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

    const manejarVer = (guia) => {
        setGuiaSeleccionado(guia);
        setModalVerAbierto(true);
    };

    const manejarEditar = (guia) => {
        setGuiaSeleccionado(guia);
        setModalEditarAbierto(true);
    };

    const manejarEliminar = async (guia) => {
        const confirmado = await modalEliminarGuia(guia, recargarGuias);
        if (confirmado) {
        }
    };

    const manejarAgregar = () => {
        setModalAgregarAbierto(true);
    };

    const cerrarModales = () => {
        setModalVerAbierto(false);
        setModalEditarAbierto(false);
        setModalEliminarAbierto(false);
        setModalAgregarAbierto(false);
        setGuiaSeleccionado(null);
    };

    const agregarGuia = async (nuevoGuia) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append('nombre', nuevoGuia.nombre);
            formData.append('apellido_paterno', nuevoGuia.apellido_paterno);
            formData.append('apellido_materno', nuevoGuia.apellido_materno);
            formData.append('fecha_nacimiento', nuevoGuia.fecha_nacimiento);
            formData.append('email', nuevoGuia.email);
            formData.append('telefono', nuevoGuia.telefono);
            formData.append('telefono_emergencia', nuevoGuia.telefono_emergencia);
            formData.append('contacto_emergencia', nuevoGuia.contacto_emergencia);
            formData.append('ciudad', nuevoGuia.ciudad);
            formData.append('estado', nuevoGuia.estado);
            formData.append('costo_dia', parseFloat(nuevoGuia.costo_dia) || 0);
            formData.append('estado_operativo', nuevoGuia.estado_operativo);

            formData.append('nss', nuevoGuia.nss || '');
            formData.append('institucion_seguro', nuevoGuia.institucion_seguro || '');
            formData.append('idiomas', nuevoGuia.idiomas || '');
            formData.append('experiencia_anos', parseInt(nuevoGuia.experiencia_anos) || 0);
            formData.append('especialidades', nuevoGuia.especialidades || '');
            formData.append('certificacion_oficial', nuevoGuia.certificacion_oficial || '');
            formData.append('zona_servicio', nuevoGuia.zona_servicio || '');

            if (nuevoGuia.documentos?.foto_guia instanceof File) {
                formData.append('foto_guia', nuevoGuia.documentos.foto_guia);
            }
            if (nuevoGuia.documentos?.foto_ine instanceof File) {
                formData.append('foto_ine', nuevoGuia.documentos.foto_ine);
            }
            if (nuevoGuia.documentos?.foto_certificaciones instanceof File) {
                formData.append('foto_certificaciones', nuevoGuia.documentos.foto_certificaciones);
            }
            if (nuevoGuia.documentos?.foto_licencia instanceof File) {
                formData.append('foto_licencia', nuevoGuia.documentos.foto_licencia);
            }
            if (nuevoGuia.documentos?.foto_comprobante_domicilio instanceof File) {
                formData.append('foto_comprobante_domicilio', nuevoGuia.documentos.foto_comprobante_domicilio);
            }

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/guias`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    }
                }
            );

            await recargarGuias();
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const actualizarGuia = async (guiaActualizado) => {
        try {
            const token = localStorage.getItem("token");

            const tieneArchivosNuevos =
                (guiaActualizado.documentos?.foto_guia instanceof File) ||
                (guiaActualizado.documentos?.foto_ine instanceof File) ||
                (guiaActualizado.documentos?.foto_certificaciones instanceof File) ||
                (guiaActualizado.documentos?.foto_licencia instanceof File) ||
                (guiaActualizado.documentos?.foto_comprobante_domicilio instanceof File);

            if (tieneArchivosNuevos) {
                const formData = new FormData();

                formData.append('nombre', guiaActualizado.nombre);
                formData.append('apellido_paterno', guiaActualizado.apellido_paterno);
                formData.append('apellido_materno', guiaActualizado.apellido_materno);
                formData.append('fecha_nacimiento', guiaActualizado.fecha_nacimiento);
                formData.append('email', guiaActualizado.email);
                formData.append('telefono', guiaActualizado.telefono);
                formData.append('telefono_emergencia', guiaActualizado.telefono_emergencia);
                formData.append('contacto_emergencia', guiaActualizado.contacto_emergencia);
                formData.append('ciudad', guiaActualizado.ciudad);
                formData.append('estado', guiaActualizado.estado);
                formData.append('costo_dia', parseFloat(guiaActualizado.costo_dia) || 0);
                formData.append('estado_operativo', guiaActualizado.estado_operativo);

                formData.append('nss', guiaActualizado.nss || '');
                formData.append('institucion_seguro', guiaActualizado.institucion_seguro || '');
                formData.append('idiomas', guiaActualizado.idiomas || '');
                formData.append('experiencia_anos', parseInt(guiaActualizado.experiencia_anos) || 0);
                formData.append('especialidades', guiaActualizado.especialidades || '');
                formData.append('certificacion_oficial', guiaActualizado.certificacion_oficial || '');
                formData.append('zona_servicio', guiaActualizado.zona_servicio || '');

                if (guiaActualizado.documentos?.foto_guia instanceof File) {
                    formData.append('foto_guia', guiaActualizado.documentos.foto_guia);
                }
                if (guiaActualizado.documentos?.foto_ine instanceof File) {
                    formData.append('foto_ine', guiaActualizado.documentos.foto_ine);
                }
                if (guiaActualizado.documentos?.foto_certificaciones instanceof File) {
                    formData.append('foto_certificaciones', guiaActualizado.documentos.foto_certificaciones);
                }
                if (guiaActualizado.documentos?.foto_licencia instanceof File) {
                    formData.append('foto_licencia', guiaActualizado.documentos.foto_licencia);
                }
                if (guiaActualizado.documentos?.foto_comprobante_domicilio instanceof File) {
                    formData.append('foto_comprobante_domicilio', guiaActualizado.documentos.foto_comprobante_domicilio);
                }

                formData.append('_method', 'PUT');

                const response = await axios.post(
                    `${API_CONFIG.BASE_URL}/guias/${guiaActualizado.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        }
                    }
                );

                await recargarGuias();
                return response.data;

            } else {
                const guiaData = {
                    nombre: guiaActualizado.nombre,
                    apellido_paterno: guiaActualizado.apellido_paterno,
                    apellido_materno: guiaActualizado.apellido_materno,
                    fecha_nacimiento: guiaActualizado.fecha_nacimiento,
                    email: guiaActualizado.email,
                    telefono: guiaActualizado.telefono,
                    telefono_emergencia: guiaActualizado.telefono_emergencia,
                    contacto_emergencia: guiaActualizado.contacto_emergencia,
                    ciudad: guiaActualizado.ciudad,
                    estado: guiaActualizado.estado,
                    costo_dia: parseFloat(guiaActualizado.costo_dia) || 0,
                    estado_operativo: guiaActualizado.estado_operativo,
                    nss: guiaActualizado.nss || null,
                    institucion_seguro: guiaActualizado.institucion_seguro || null,
                    idiomas: guiaActualizado.idiomas || null,
                    experiencia_anos: parseInt(guiaActualizado.experiencia_anos) || null,
                    especialidades: guiaActualizado.especialidades || null,
                    certificacion_oficial: guiaActualizado.certificacion_oficial || null,
                    zona_servicio: guiaActualizado.zona_servicio || null,
                };

                const response = await axios.put(
                    `${API_CONFIG.BASE_URL}/guias/${guiaActualizado.id}`,
                    guiaData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        }
                    }
                );

                await recargarGuias();
                return response.data;
            }

        } catch (error) {
            throw error;
        }
    };

    const eliminarGuia = (id) => {
        setGuias(guias.filter(g => g.id !== id));
        cerrarModales();
    };

    if (error) {
        return (
            <PrincipalComponente>
                <div className="guias-error-container">
                    <div className="guias-error-box">
                        <h2 className="guias-error-title">
                            ❌ Error al cargar guías
                        </h2>
                        <p className="guias-error-message">
                            {error}
                        </p>
                        <button
                            onClick={recargarGuias}
                            className="guias-error-button"
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
            <div className="guias-principal">
                <TablaGuias
                    guias={guias}
                    setGuias={setGuias}
                    onVer={manejarVer}
                    onEditar={manejarEditar}
                    onEliminar={manejarEliminar}
                    onAgregar={manejarAgregar}
                    cargando={cargando}
                    onRecargar={recargarGuias}
                />

                {modalVerAbierto && guiaSeleccionado && (
                    <ModalVerGuia
                        guia={guiaSeleccionado}
                        onCerrar={cerrarModales}
                    />
                )}

                {modalEditarAbierto && guiaSeleccionado && (
                    <ModalEditarGuia
                        guia={guiaSeleccionado}
                        onGuardar={actualizarGuia}
                        onCerrar={cerrarModales}
                    />
                )}

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