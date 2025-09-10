// components/Notificaciones.jsx - VERSIÓN ACTUALIZADA
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Notificaciones = ({ agendas }) => {
    const [notificacionesMostradas, setNotificacionesMostradas] = useState(new Set());

    // Función para guardar en historial
    const guardarEnHistorial = (notificacion) => {
        const historial = JSON.parse(localStorage.getItem('historialNotificaciones') || '[]');
        
        const nuevaNotificacion = {
            id: Date.now().toString(),
            ...notificacion,
            fecha: new Date().toISOString()
        };

        // Agregar al inicio del array
        historial.unshift(nuevaNotificacion);
        
        // Mantener solo las últimas 100 notificaciones
        const historialLimitado = historial.slice(0, 100);
        
        localStorage.setItem('historialNotificaciones', JSON.stringify(historialLimitado));
    };

    useEffect(() => {
        verificarVisitasProximas(agendas);
    }, [agendas]);

    const verificarVisitasProximas = (agendas) => {
        const hoy = new Date();

        agendas.forEach(agenda => {
            if (!agenda.proximaVisita) return;

            const fechaVisita = new Date(agenda.proximaVisita);
            const diasRestantes = Math.ceil((fechaVisita - hoy) / (1000 * 60 * 60 * 24));
            
            const notificacionId = `${agenda._id}-${diasRestantes}`;

            if (notificacionesMostradas.has(notificacionId)) return;

            let mensaje = '';
            let tipo = 'info';

            if (diasRestantes === 3) {
                mensaje = `⏰ En 3 días: Visita con ${agenda.nombreEmpresa}`;
                tipo = 'info';
            } else if (diasRestantes === 1) {
                mensaje = `🔔 Mañana: Visita con ${agenda.nombreEmpresa}`;
                tipo = 'warning';
            } else if (diasRestantes === 0) {
                mensaje = `🎯 ¡Hoy! Visita con ${agenda.nombreEmpresa}`;
                tipo = 'error';
            } else if (diasRestantes < 0) {
                mensaje = `⚠️ Visita vencida: ${agenda.nombreEmpresa} (hace ${Math.abs(diasRestantes)} días)`;
                tipo = 'error';
            }

            if (mensaje && !notificacionesMostradas.has(notificacionId)) {
                // Mostrar notificación
                toast(mensaje, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: notificacionId
                });

                // Guardar en historial
                guardarEnHistorial({
                    mensaje,
                    tipo,
                    empresa: agenda.nombreEmpresa,
                    agendaId: agenda._id,
                    fechaVisita: agenda.proximaVisita,
                    diasRestantes
                });

                // Marcar como mostrada
                setNotificacionesMostradas(prev => new Set(prev).add(notificacionId));
            }
        });
    };

    return <ToastContainer />;
};