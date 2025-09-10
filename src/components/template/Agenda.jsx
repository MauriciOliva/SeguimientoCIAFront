import React, { useState, useEffect } from 'react';
import { FormularioAgenda } from '../forms/AgendaForm';
import { useAgendaStore } from '../../hooks/HookAgenda';
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from './ErrorBoundary';
import {Notificaciones}  from './Notifier';
import { HistorialNotificaciones } from './Historial';

export const AgendaList = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const {
    agenda,
    isLoading,
    error,
    getAgendas,
    createAgenda,
    updateAgenda,
    deleteAgenda
  } = useAgendaStore();

  useEffect(() => {
    getAgendas();
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleGuardarEmpresa = async (datosEmpresa) => {
    try {
      if (empresaEditando) {
        await updateAgenda(empresaEditando._id, datosEmpresa);
      } else {
        await createAgenda(datosEmpresa);
      }
      setMostrarFormulario(false);
      setEmpresaEditando(null);
    } catch (error) {
      console.error('Error al guardar empresa:', error);
    }
  };

  const handleEliminarEmpresa = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa?')) {
      try {
        await deleteAgenda(id);
      } catch (error) {
        console.error('Error al eliminar empresa:', error);
      }
    }
  };

  const handleNuevaEmpresa = () => {
    setEmpresaEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarEmpresa = (empresa) => {
    setEmpresaEditando(empresa);
    setMostrarFormulario(true);
  };

  const empresasFiltradas = agenda.filter(empresa =>
    empresa.nombreEmpresa?.toLowerCase().includes(filtro.toLowerCase()) ||
    empresa.contactoEmpresa?.toLowerCase().includes(filtro.toLowerCase()) ||
    empresa.tamañoEmpresa?.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatFecha = (fecha) => {
    if (!fecha) return 'No programada';
    return new Date(fecha).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColorImportancia = (importancia) => {
    switch (importancia) {
      case 'Alta': return 'bg-red-100 text-red-700 border border-red-300';
      case 'Media': return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'Baja': return 'bg-green-100 text-green-700 border border-green-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const getColorTamaño = (tamaño) => {
    switch (tamaño) {
      case 'Grande': return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'Mediana': return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'Pequeña': return 'bg-green-100 text-green-700 border border-green-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Cargando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <Notificaciones agendas={agenda} />

      <HistorialNotificaciones
        isOpen={mostrarHistorial}
        onClose={() => setMostrarHistorial(false)}
      />
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <i className="fas fa-calendar-days text-blue-600"></i>
                Agenda de Empresas
              </h1>
              <p className="text-gray-600">Gestión de visitas y seguimiento empresarial</p>
            </div>
            <button
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200"
              onClick={handleNuevaEmpresa}
            >
              <i className="fas fa-plus mr-2"></i>
              Nueva Empresa
            </button>
          </div>
        </div>

        {/* Filtros y Estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <label htmlFor="buscar" className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar empresa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    id="buscar"
                    placeholder="Buscar por nombre, contacto o tamaño..."
                    className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                  {filtro && (
                    <button
                      onClick={() => setFiltro('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-md p-6 text-white border border-blue-400">
            <div className="text-center">
              <i className="fas fa-building text-3xl mb-2"></i>
              <h3 className="text-2xl font-bold">{agenda.length}</h3>
              <p className="text-blue-100">Empresas en agenda</p>
            </div>
          </div>
        </div>

        {/* Lista de Empresas */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md overflow-x-auto border border-gray-200">
          <table className="w-full border-separate border-spacing-y-2">
            <thead className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm shadow-md border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-blue-700 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-blue-700 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-blue-700 uppercase tracking-wider">Tamaño</th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-blue-700 uppercase tracking-wider">Última Visita</th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-blue-700 uppercase tracking-wider">Próxima Visita</th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-blue-700 uppercase tracking-wider">Importancia</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {empresasFiltradas.map((empresa) => (
                  <motion.tr
                    key={empresa._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-white hover:shadow-md hover:bg-blue-50 transition duration-150 cursor-pointer rounded-xl border border-gray-100"
                    onClick={() => setEmpresaSeleccionada(empresa)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap rounded-l-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md">
                          {empresa.nombreEmpresa?.charAt(0) || <i className='fas fa-building'></i>}
                        </div>
                        <div>
                          <div className="text-base font-semibold text-gray-900">
                            {empresa.nombreEmpresa}
                          </div>
                          <div className="text-xs text-gray-500">
                            {empresa.dedicacionEmpresa}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="text-base text-gray-900 font-medium">{empresa.contactoEmpresa}</div>
                      <div className="text-xs text-gray-500">{empresa.telefonoEmpresa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full shadow-sm ${getColorTamaño(empresa.tamañoEmpresa)}`}>
                        <i className="fas fa-building"></i> {empresa.tamañoEmpresa}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatFecha(empresa.visita)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatFecha(empresa.proximaVisita)}</td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full shadow-sm ${getColorImportancia(empresa.importanciaVisita)}`}>
                        <i className="fas fa-flag"></i> {empresa.importanciaVisita}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center rounded-r-xl">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition"
                          title="Editar"
                          onClick={e => {
                            e.stopPropagation();
                            handleEditarEmpresa(empresa);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition"
                          title="Eliminar"
                          onClick={e => {
                            e.stopPropagation();
                            handleEliminarEmpresa(empresa._id);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Modal de Formulario */}
        {mostrarFormulario && (
          <FormularioAgenda
            onSubmit={handleGuardarEmpresa}
            onCancel={() => {
              setMostrarFormulario(false);
              setEmpresaEditando(null);
            }}
            empresaExistente={empresaEditando}
          />
        )}

        {/* Modal de Detalles */}
        <AnimatePresence>
          {empresaSeleccionada && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <i className="fas fa-building text-blue-600"></i>
                      {empresaSeleccionada.nombreEmpresa}
                    </h2>
                    <button
                      onClick={() => setEmpresaSeleccionada(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">📞 Información de Contacto</h3>
                        <div className="mt-2 space-y-2">
                          <p><strong>Contacto:</strong> {empresaSeleccionada.contactoEmpresa}</p>
                          <p><strong>Teléfono:</strong> {empresaSeleccionada.telefonoEmpresa}</p>
                          <p><strong>Email:</strong> {empresaSeleccionada.correoEmpresa}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">💻 Sistema Actual</h3>
                        <p className="mt-2">{empresaSeleccionada.sistemaManjado}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">🛒 Comportamiento de Compra</h3>
                        <p className="mt-2">{empresaSeleccionada.comportamientoCompra}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">⚡ Desafíos</h3>
                        <p className="mt-2">{empresaSeleccionada.desafiosEmpresa}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">❗ Puntos Críticos</h3>
                        <p className="mt-2">{empresaSeleccionada.puntosCriticos}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">🎯 Objetivos</h3>
                        <p className="mt-2">{empresaSeleccionada.objetivosEmpresa}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">📅 Última Visita</h3>
                          <p className="mt-2">{formatFecha(empresaSeleccionada.visita)}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">📅 Próxima Visita</h3>
                          <p className="mt-2">{formatFecha(empresaSeleccionada.proximaVisita)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={() => setEmpresaSeleccionada(null)}
                    >
                      Cerrar
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                      onClick={() => {
                        setEmpresaSeleccionada(null);
                        handleEditarEmpresa(empresaSeleccionada);
                      }}
                    >
                      Editar Información
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </ErrorBoundary>

  );
};
