import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ;

export const useAgendaStore = create((set, get) => ({
    isLoading: false,
    isAgendaOpen: false,
    agendaData: null,
    agenda: [],
    error: null,

    // Actions
    setAgendaOpen: (value) => set({ isAgendaOpen: value }),
    setAgendaData: (data) => set({ agendaData: data }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Obtener todas las agendas
    getAgendas: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(API_BASE_URL);
            set({ 
                agenda: response.data.data || response.data, 
                isLoading: false 
            });
            return response.data.data || response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al obtener las agendas';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    // Crear nueva agenda
    createAgenda: async (newAgenda) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_BASE_URL}/create`, 
                newAgenda
            );
            
            // Agregar la nueva agenda al estado actual
            set(state => ({
                agenda: [...state.agenda, response.data.data || response.data],
                isLoading: false,
                isAgendaOpen: false
            }));
            
            return response.data.data || response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al crear la agenda';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    // Obtener agendas filtradas por importancia
    getAgendasFiltradas: async (importancia) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${API_BASE_URL}/filtro/${importancia}`
            );
            set({ 
                agenda: response.data.data || response.data, 
                isLoading: false 
            });
            return response.data.data || response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al obtener agendas filtradas';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    // Actualizar agenda existente
    updateAgenda: async (id, updatedAgenda) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(
                `${API_BASE_URL}/update/${id}`,
                updatedAgenda
            );
            
            // Actualizar la agenda en el estado
            set(state => ({
                agenda: state.agenda.map(item => 
                    item._id === id ? (response.data.data || response.data) : item
                ),
                isLoading: false
            }));
            
            return response.data.data || response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar la agenda';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    // Eliminar agenda
    deleteAgenda: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/delete/${id}`
            );
            
            // Eliminar la agenda del estado
            set(state => ({
                agenda: state.agenda.filter(item => item._id !== id),
                isLoading: false
            }));
            
            return response.data.data || response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al eliminar la agenda';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    }
}));