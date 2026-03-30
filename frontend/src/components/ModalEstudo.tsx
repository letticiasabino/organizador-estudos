// ============================================
// Componente: ModalEstudo
// Formulário para criar ou editar um estudo
// Totalmente tipado — sem any!
// ============================================

import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { ModalEstudoProps, NovoEstudo, } from '../types';

// Cores disponíveis para o usuário escolher
const CORES_DISPONIVEIS = [
  '#7C3AED', // roxo
  '#2563EB', // azul
  '#DC2626', // vermelho
  '#059669', // verde
  '#D97706', // laranja
  '#DB2777', // rosa
  '#0891B2', // ciano
  '#65A30D', // lima
];

const ESTADO_INICIAL: NovoEstudo = {
  titulo: '',
  materia: '',
  metaHoras: 10,
  horasEstudadas: 0,
  cor: '#7C3AED',
  descricao: '',
  status: 'nao_iniciado',
};

export default function ModalEstudo({
  aberto,
  estudoParaEditar,
  onFechar,
  onSalvar,
}: ModalEstudoProps) {
  const [form, setForm] = useState<NovoEstudo>(ESTADO_INICIAL);
  const [salvando, setSalvando] = useState(false);
  // useRef para dar foco ao primeiro campo quando o modal abre (acessibilidade)
  const primeiroInputRef = useRef<HTMLInputElement>(null);

  // Preenche o form com os dados do estudo se for edição
  useEffect(() => {
    if (estudoParaEditar) {
      const { id: _id, criadoEm: _c, ...resto } = estudoParaEditar;
      setForm(resto);
    } else {
      setForm(ESTADO_INICIAL);
    }
  }, [estudoParaEditar, aberto]);

  // Foca no primeiro campo quando abre
  useEffect(() => {
    if (aberto) {
      setTimeout(() => primeiroInputRef.current?.focus(), 100);
    }
  }, [aberto]);

  if (!aberto) return null;

  // Handler genérico para inputs de texto
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'metaHoras' || name === 'horasEstudadas'
        ? Number(value)
        : value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    try {
      await onSalvar(form);
      onFechar();
    } finally {
      setSalvando(false);
    }
  }

  const titulo = estudoParaEditar ? 'Editar Estudo' : 'Novo Estudo';

  return (
    // Overlay escuro — fecha ao clicar fora
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <h2 id="modal-titulo" className="text-white text-xl font-bold">
            {estudoParaEditar ? '✏️' : '✨'} {titulo}
          </h2>
          <button
            onClick={onFechar}
            aria-label="Fechar modal"
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-gray-300 text-sm font-semibold mb-1">
              Título do estudo *
            </label>
            <input
              ref={primeiroInputRef}
              id="titulo"
              name="titulo"
              type="text"
              value={form.titulo}
              onChange={handleChange}
              required
              placeholder="Ex: React do Zero ao Avançado"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Matéria */}
          <div>
            <label htmlFor="materia" className="block text-gray-300 text-sm font-semibold mb-1">
              Matéria / Tecnologia *
            </label>
            <input
              id="materia"
              name="materia"
              type="text"
              value={form.materia}
              onChange={handleChange}
              required
              placeholder="Ex: React, Python, CSS..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Meta de horas e horas estudadas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="metaHoras" className="block text-gray-300 text-sm font-semibold mb-1">
                Meta (horas) *
              </label>
              <input
                id="metaHoras"
                name="metaHoras"
                type="number"
                min={1}
                max={9999}
                value={form.metaHoras}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="horasEstudadas" className="block text-gray-300 text-sm font-semibold mb-1">
                Já estudei (horas)
              </label>
              <input
                id="horasEstudadas"
                name="horasEstudadas"
                type="number"
                min={0}
                max={form.metaHoras}
                value={form.horasEstudadas}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-gray-300 text-sm font-semibold mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="nao_iniciado">⏳ Não iniciado</option>
              <option value="em_andamento">🔥 Em andamento</option>
              <option value="pausado">⏸️ Pausado</option>
              <option value="concluido">✅ Concluído</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block text-gray-300 text-sm font-semibold mb-1">
              Descrição (opcional)
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
              placeholder="O que você quer aprender neste estudo?"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Cor */}
          <fieldset>
            <legend className="text-gray-300 text-sm font-semibold mb-2">
              Cor identificadora
            </legend>
            <div className="flex gap-3 flex-wrap">
              {CORES_DISPONIVEIS.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  aria-label={`Selecionar cor ${cor}`}
                  aria-pressed={form.cor === cor}
                  onClick={() => setForm((prev) => ({ ...prev, cor }))}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white ${
                    form.cor === cor ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: cor }}
                />
              ))}
            </div>
          </fieldset>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {salvando ? 'Salvando...' : estudoParaEditar ? 'Salvar alterações' : 'Criar estudo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
