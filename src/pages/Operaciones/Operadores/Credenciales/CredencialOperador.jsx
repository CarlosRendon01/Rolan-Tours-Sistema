import React from 'react';
import './CredencialOperador.css';

/**
 * Componente para mostrar/generar credenciales de operadores
 * Usa la plantilla de fondo decorativo con el patrón de escudos
 */
const CredencialOperador = ({ operador }) => {
    // Formatear el número de teléfono
    const formatearTelefono = (telefono) => {
        if (!telefono) return '';
        // Formato: 951 214 14 81
        const cleaned = telefono.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
        }
        return telefono;
    };

    return (
        <div className="credencial-container">
            <div className="credencial-card">
                {/* Fondo decorativo con el patrón */}
                <div className="credencial-background"></div>

                {/* Contenido de la credencial */}
                <div className="credencial-content">
                    {/* Foto del operador */}
                    <div className="credencial-foto-container">
                        {operador.foto ? (
                            <img 
                                src={operador.foto} 
                                alt={`${operador.nombre} ${operador.apellidoPaterno}`}
                                className="credencial-foto"
                            />
                        ) : (
                            <div className="credencial-foto-placeholder">
                                <svg 
                                    width="80" 
                                    height="80" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Nombre completo */}
                    <div className="credencial-nombre">
                        {operador.nombre} {operador.apellidoPaterno}
                    </div>

                    {/* Cargo/Puesto */}
                    <div className="credencial-cargo">
                        {operador.cargo || 'Conductor'}
                    </div>

                    {/* Teléfono */}
                    <div className="credencial-telefono">
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                            className="credencial-icono-telefono"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                            />
                        </svg>
                        {formatearTelefono(operador.telefonoPersonal)}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CredencialOperador;