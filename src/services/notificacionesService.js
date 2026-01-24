import axios from 'axios';
import { API_CONFIG } from '../config/api';

const notificacionesService = {
    obtenerNotificaciones: async () => {
        try {
            const response = await axios.get(`${API_CONFIG.BASE_URL}/notificaciones`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
            throw error;
        }
    },

    marcarComoLeida: async (id) => {
        try {
            const response = await axios.put(
                `${API_CONFIG.BASE_URL}/notificaciones/${id}/leer`
            );
            return response.data;
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            throw error;
        }
    },

    marcarTodasComoLeidas: async () => {
        try {
            const response = await axios.put(
                `${API_CONFIG.BASE_URL}/notificaciones/leer-todas`
            );
            return response.data;
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
            throw error;
        }
    },

    eliminarNotificacion: async (id) => {
        try {
            const response = await axios.delete(
                `${API_CONFIG.BASE_URL}/notificaciones/${id}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
            throw error;
        }
    },

    eliminarTodas: async () => {
        try {
            const response = await axios.delete(
                `${API_CONFIG.BASE_URL}/notificaciones`
            );
            return response.data;
        } catch (error) {
            console.error('Error al eliminar todas las notificaciones:', error);
            throw error;
        }
    },

    obtenerContador: async () => {
        try {
            const response = await axios.get(
                `${API_CONFIG.BASE_URL}/notificaciones/contador`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener contador:', error);
            throw error;
        }
    }
};

export default notificacionesService;