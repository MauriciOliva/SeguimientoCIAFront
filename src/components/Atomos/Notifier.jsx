import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Notificaciones = ({ agendas }) => {
    const [notificacionesMostradas, setNotificacionesMostradas] = useState(new Set());

    const guardarEnHistorial = (notificacion) => {
        try {
            const historial = JSON.parse(localStorage.getItem('historialNotificaciones') || '[]');
            
            const nuevaNotificacion = {
                id: `${notificacion.agendaId}-${notificacion.diasRestantes}`,
                ...notificacion,
                fecha: notificacion.fechaVisita || new Date().toISOString()
            };

            const yaExiste = historial.some(item => 
                item.id === nuevaNotificacion.id
            );

            if (!yaExiste) {
                historial.unshift(nuevaNotificacion);
                const historialLimitado = historial.slice(0, 100);
                localStorage.setItem('historialNotificaciones', JSON.stringify(historialLimitado));
            }
        } catch (error) {
            console.error('Error guardando en historial:', error);
        }
    };

    useEffect(() => {
        const hoy = new Date().toDateString();
        const ultimaFecha = localStorage.getItem('ultimaFechaNotificaciones');
        
        if (ultimaFecha !== hoy) {
            setNotificacionesMostradas(new Set());
            localStorage.setItem('ultimaFechaNotificaciones', hoy);
        }

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
                tipo = 'INFO';
            } else if (diasRestantes === 1) {
                mensaje = `🔔 Mañana: Visita con ${agenda.nombreEmpresa}`;
                tipo = 'MAÑANA';
            } else if (diasRestantes === 0) {
                mensaje = `🎯 ¡Hoy! Visita con ${agenda.nombreEmpresa}`;
                tipo = 'IMPORTANTE';
            } else if (diasRestantes < 0) {
                mensaje = `⚠️ Visita vencida: ${agenda.nombreEmpresa} (hace ${Math.abs(diasRestantes)} días)`;
                tipo = 'URGENTE';
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
                setNotificacionesMostradas(prev => {
                    const nuevoSet = new Set(prev);
                    nuevoSet.add(notificacionId);
                    return nuevoSet;
                });
            }
        });
    };

    return <ToastContainer />;
};