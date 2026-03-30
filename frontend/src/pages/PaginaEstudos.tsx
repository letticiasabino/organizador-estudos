// ============================================
// Página: Estudos
// Lista todos os estudos com CRUD completo
// ============================================

import { useState, useMemo } from 'react';
import type { Estudo, NovoEstudo, AtualizarEstudo, StatusEstudo } from '../types';
import CardEstudo from '../components/CardEstudo';
import ModalEstudo from '../components/ModalEstudo';
import ModalCronograma from '../components/ModalCronograma';
import Loading from '../components/Loading';
import Erro from '../components/Erro';
import ListaVazia from '../components/ListaVazia';

interface PaginaEstudosProps {
  estudos: Estudo[];
  carregando: boolean;
  erro: string | null;
  onCriar: (dados: NovoEstudo) => Promise<void>;
  onAtualizar: (id: string, dados: AtualizarEstudo) => Promise<void>;
  onDeletar: (id: string) => Promise<void>;
  onRecarregar: () => void;
  onNotificar: (msg: string, tipo?: 'info' | 'sucesso' | 'alerta' | 'erro', icone?: string) => void;
}

type FiltroStatus = 'todos' | StatusEstudo;

const OPCOES_FILTRO: { value: FiltroStatus; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'nao_iniciado', label: '⏳ Não iniciado' },
  { value: 'em_andamento', label: '🔥 Em andamento' },
  { value: 'pausado', label: '⏸️ Pausado' },
  { value: 'concluido', label: '✅ Concluído' },
];

export default function PaginaEstudos({
  estudos,
  carregando,
  erro,
  onCriar,
  onAtualizar,
  onDeletar,
  onRecarregar,
  onNotificar,
}: PaginaEstudosProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [cronogramaAberto, setCronogramaAberto] = useState(false);
  const [filtro, setFiltro] = useState<FiltroStatus>('todos');
  const [busca, setBusca] = useState('');

  // useMemo — só recalcula quando estudos, filtro ou busca mudarem
  const estudosFiltrados = useMemo(() => {
    return estudos.filter((e) => {
      const matchFiltro = filtro === 'todos' || e.status === filtro;
      const matchBusca =
        busca === '' ||
        e.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        e.materia.toLowerCase().includes(busca.toLowerCase());
      return matchFiltro && matchBusca;
    });
  }, [estudos, filtro, busca]);

  async function handleCriar(dados: NovoEstudo) {
    try {
      await onCriar(dados);
      onNotificar('Estudo criado com sucesso! 🎉', 'sucesso', '🎉');
    } catch {
      onNotificar('Erro ao criar estudo. Tente novamente.', 'erro', '❌');
      throw new Error('Erro ao criar');
    }
  }

  async function handleAtualizar(id: string, dados: AtualizarEstudo) {
    try {
      await onAtualizar(id, dados);
      if (dados.status === 'concluido') {
        onNotificar('Parabéns! Você concluiu esse estudo! 🏆', 'sucesso', '🏆');
      } else if (dados.horasEstudadas !== undefined) {
        onNotificar('Progresso atualizado! Continue assim 💪', 'sucesso', '💪');
      }
    } catch {
      onNotificar('Erro ao atualizar. Tente novamente.', 'erro', '❌');
      throw new Error('Erro ao atualizar');
    }
  }

  async function handleDeletar(id: string) {
    try {
      await onDeletar(id);
      onNotificar('Estudo removido.', 'info', '🗑️');
    } catch {
      onNotificar('Erro ao deletar. Tente novamente.', 'erro', '❌');
      throw new Error('Erro ao deletar');
    }
  }

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho da página */}
      <section aria-labelledby="titulo-estudos" className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 id="titulo-estudos" className="text-white text-3xl font-extrabold">
              Meus Estudos 📚
            </h1>
            <p className="text-gray-400 mt-1">
              {estudos.length} matéria{estudos.length !== 1 ? 's' : ''} cadastrada{estudos.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCronogramaAberto(true)}
              className="px-4 py-2 border border-purple-600 text-purple-400 hover:bg-purple-900/30 rounded-xl font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              🧠 Cronograma
            </button>
            <button
              onClick={() => setModalAberto(true)}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all hover:scale-105 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              + Novo estudo
            </button>
          </div>
        </div>
      </section>

      {/* Filtros e busca */}
      {estudos.length > 0 && (
        <section aria-label="Filtros" className="mb-6 flex flex-col sm:flex-row gap-3">
          {/* Campo de busca */}
          <div className="flex-1">
            <label htmlFor="busca" className="sr-only">Buscar estudos</label>
            <input
              id="busca"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por título ou matéria..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Filtro por status */}
          <div>
            <label htmlFor="filtro-status" className="sr-only">Filtrar por status</label>
            <select
              id="filtro-status"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as FiltroStatus)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
            >
              {OPCOES_FILTRO.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
        </section>
      )}

      {/* Conteúdo principal */}
      {carregando ? (
        <Loading mensagem="Carregando seus estudos..." />
      ) : erro ? (
        <Erro mensagem={erro} onTentar={onRecarregar} />
      ) : estudos.length === 0 ? (
        <ListaVazia onCriar={() => setModalAberto(true)} />
      ) : estudosFiltrados.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">Nenhum estudo encontrado para esse filtro.</p>
          <button
            onClick={() => { setFiltro('todos'); setBusca(''); }}
            className="mt-4 text-purple-400 hover:text-purple-300 underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <section
          aria-label="Lista de estudos"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {estudosFiltrados.map((estudo) => (
            <CardEstudo
              key={estudo.id}
              estudo={estudo}
              onAtualizar={handleAtualizar}
              onDeletar={handleDeletar}
            />
          ))}
        </section>
      )}

      {/* Modais */}
      <ModalEstudo
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleCriar}
      />
      <ModalCronograma
        aberto={cronogramaAberto}
        onFechar={() => setCronogramaAberto(false)}
      />
    </main>
  );
}
