import { useNavigate } from 'react-router-dom';
import './AccesoDenegado.css';

const AccesoDenegado = () => {
    const navigate = useNavigate();

    return (
        <div className="acceso-denegado-container">
            <div className="acceso-denegado-card">
                <div className="acceso-denegado-icono">🚫</div>
                <h1>Acceso Denegado</h1>
                <p>No tienes permisos para acceder a esta sección.</p>
                <button
                    onClick={() => navigate('/')}
                    className="btn-volver"
                >
                    Volver al Dashboard
                </button>
            </div>
        </div>
    );
};

export default AccesoDenegado;