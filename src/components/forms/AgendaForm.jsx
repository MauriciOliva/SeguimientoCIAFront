
import React, { useState, useEffect } from 'react';

export function useAgendaFormState(empresaExistente) {
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    contactoEmpresa: '',
    telefonoEmpresa: '',
    correoEmpresa: '',
    dedicacionEmpresa: '',
    sistemaManjado: '',
    tamañoEmpresa: '',
    desafiosEmpresa: '',
    puntosCriticos: '',
    objetivosEmpresa: '',
    comportamientoCompra: '',
    visita: new Date().toISOString().split('T')[0],
    importanciaVisita: 'Media',
    proximaVisita: ''
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (empresaExistente) {
      setFormData({ ...empresaExistente });
    }
  }, [empresaExistente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
      if (!formData.nombreEmpresa.trim()) nuevosErrores.nombreEmpresa = 'El nombre de la empresa es requerido';
      if (!formData.contactoEmpresa.trim()) nuevosErrores.contactoEmpresa = 'El contacto es requerido';
      if (!formData.telefonoEmpresa.trim()) nuevosErrores.telefonoEmpresa = 'El teléfono es requerido';
      if (!formData.correoEmpresa.trim()) nuevosErrores.correoEmpresa = 'El correo es requerido';
      else if (!/\S+@\S+\.\S+/.test(formData.correoEmpresa)) nuevosErrores.correoEmpresa = 'El formato del correo no es válido';
      if (!formData.dedicacionEmpresa.trim()) nuevosErrores.dedicacionEmpresa = 'La dedicación es requerida';
      if (!formData.sistemaManjado.trim()) nuevosErrores.sistemaManjado = 'El sistema manejado es requerido';
      if (!formData.tamañoEmpresa) nuevosErrores.tamañoEmpresa = 'El tamaño de empresa es requerido';
      if (!formData.desafiosEmpresa.trim()) nuevosErrores.desafiosEmpresa = 'Los desafíos son requeridos';
      if (!formData.puntosCriticos.trim()) nuevosErrores.puntosCriticos = 'Los puntos críticos son requeridos';
      if (!formData.objetivosEmpresa.trim()) nuevosErrores.objetivosEmpresa = 'Los objetivos son requeridos';
      if (!formData.comportamientoCompra.trim()) nuevosErrores.comportamientoCompra = 'El comportamiento de compra es requerido';
      if (!formData.visita) nuevosErrores.visita = 'La fecha de visita es requerida';
      if (!formData.importanciaVisita) nuevosErrores.importanciaVisita = 'La importancia es requerida';
      setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  return {
    formData,
    setFormData,
    errores,
    setErrores,
    handleChange,
    validarFormulario
  };
}

export const FormularioAgenda = ({ onSubmit, onCancel, empresaExistente }) => {
  const {
    formData,
    setFormData,
    errores,
    setErrores,
    handleChange,
    validarFormulario
  } = useAgendaFormState(empresaExistente);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              <i className="fas fa-building mr-2 text-blue-600"></i>
              {empresaExistente ? 'Editar Empresa' : 'Nueva Empresa'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  name="nombreEmpresa"
                  value={formData.nombreEmpresa}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.nombreEmpresa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: TechSolutions Guatemala"
                />
                {errores.nombreEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errores.nombreEmpresa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Persona de Contacto *
                </label>
                <input
                  type="text"
                  name="contactoEmpresa"
                  value={formData.contactoEmpresa}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.contactoEmpresa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: María González"
                />
                {errores.contactoEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errores.contactoEmpresa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefonoEmpresa"
                  value={formData.telefonoEmpresa}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.telefonoEmpresa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: +502 1234-5678"
                />
                {errores.telefonoEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errores.telefonoEmpresa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correoEmpresa"
                  value={formData.correoEmpresa}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.correoEmpresa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: contacto@empresa.com"
                />
                {errores.correoEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errores.correoEmpresa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dedicación de la Empresa *
                </label>
                <input
                  type="text"
                  name="dedicacionEmpresa"
                  value={formData.dedicacionEmpresa}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.dedicacionEmpresa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Desarrollo de software"
                />
                {errores.dedicacionEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errores.dedicacionEmpresa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sistema Manejado *
                </label>
                <input
                  type="text"
                  name="sistemaManjado"
                  value={formData.sistemaManjado}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.sistemaManjado ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: ERP personalizado"
                />
                {errores.sistemaManjado && (
                  <p className="mt-1 text-sm text-red-600">{errores.sistemaManjado}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño de la Empresa *
                </label>
                <select
                  name="tamañoEmpresa"
                  value={formData.tamañoEmpresa}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.tamañoEmpresa ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar tamaño</option>
                  <option value="Pequeña">Pequeña</option>
                  <option value="Mediana">Mediana</option>
                  <option value="Grande">Grande</option>
                </select>
                {errores.tamañoEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errores.tamañoEmpresa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Importancia de la Visita *
                </label>
                <select
                  name="importanciaVisita"
                  value={formData.importanciaVisita}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.importanciaVisita ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
                {errores.importanciaVisita && (
                  <p className="mt-1 text-sm text-red-600">{errores.importanciaVisita}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Visita *
                </label>
                <input
                  type="date"
                  name="visita"
                  value={formData.visita}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.visita ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errores.visita && (
                  <p className="mt-1 text-sm text-red-600">{errores.visita}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Próxima Visita
                </label>
                <input
                  type="date"
                  name="proximaVisita"
                  value={formData.proximaVisita}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Áreas de texto para descripciones más largas */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desafíos de la Empresa *
                </label>
                <textarea
                  name="desafiosEmpresa"
                  value={formData.desafiosEmpresa}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.desafiosEmpresa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describa los principales desafíos que enfrenta la empresa..."
                />
                {errores.desafiosEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errores.desafiosEmpresa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puntos Críticos *
                </label>
                <textarea
                  name="puntosCriticos"
                  value={formData.puntosCriticos}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.puntosCriticos ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describa los puntos críticos identificados..."
                />
                {errores.puntosCriticos && (
                  <p className="mt-1 text-sm text-red-600">{errores.puntosCriticos}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objetivos de la Empresa *
                </label>
                <textarea
                  name="objetivosEmpresa"
                  value={formData.objetivosEmpresa}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.objetivosEmpresa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describa los objetivos principales de la empresa..."
                />
                {errores.objetivosEmpresa && (
                  <p className="mt-1 text-sm text-red-600">{errores.objetivosEmpresa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comportamiento de Compra *
                </label>
                <textarea
                  name="comportamientoCompra"
                  value={formData.comportamientoCompra}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.comportamientoCompra ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describa el comportamiento de compra de la empresa..."
                />
                {errores.comportamientoCompra && (
                  <p className="mt-1 text-sm text-red-600">{errores.comportamientoCompra}</p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {empresaExistente ? 'Actualizar' : 'Crear'} Empresa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

