// components/Notificaciones.jsx - VERSIÓN CORREGIDA
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Notificaciones = ({ agendas }) => {
    const [notificacionesMostradas, setNotificacionesMostradas] = useState(new Set());

    useEffect(() => {
        verificarVisitasProximas(agendas);
    }, [agendas]);

    const verificarVisitasProximas = (agendas) => {
        const hoy = new Date();

        agendas.forEach(agenda => {
            if (!agenda.proximaVisita) return;

            const fechaVisita = new Date(agenda.proximaVisita);
            const diasRestantes = Math.ceil((fechaVisita - hoy) / (1000 * 60 * 60 * 24));
            
            // Crear ID único para esta notificación
            const notificacionId = `${agenda._id}-${diasRestantes}`;

            // ✅ Evitar mostrar la misma notificación múltiples veces
            if (notificacionesMostradas.has(notificacionId)) return;

            let mensaje = '';

            if (diasRestantes === 3) {
                mensaje = `⏰ En 3 días: Visita con ${agenda.nombreEmpresa}`;
            } else if (diasRestantes === 1) {
                mensaje = `🔔 Mañana: Visita con ${agenda.nombreEmpresa}`;
            } else if (diasRestantes === 0) {
                mensaje = `🎯 ¡Hoy! Visita con ${agenda.nombreEmpresa}`;
            } else if (diasRestantes < 0) {
                mensaje = `⚠️ Visita vencida: ${agenda.nombreEmpresa} (hace ${Math.abs(diasRestantes)} días)`;
            }

            if (mensaje && !notificacionesMostradas.has(notificacionId)) {
                // ✅ CORRECCIÓN: Usar toast directamente
                toast(mensaje, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: notificacionId // ID único
                });

                // Marcar como mostrada
                setNotificacionesMostradas(prev => new Set(prev).add(notificacionId));
            }
        });
    };

    return <ToastContainer />;
};