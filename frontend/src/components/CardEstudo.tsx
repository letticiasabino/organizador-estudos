// ============================================
// Componente: CardEstudo
// Exibe um estudo com barra de progresso e ações
// ============================================

import { useState, useCallback } from 'react';
import type { CardEstudoProps, StatusEstudo } from '../types';

// Mapeamento de status para rótulos e cores legíveis
const STATUS_CONFIG: Record<StatusEstudo, { label: string; cor: string; icone: string }> = {
  nao_iniciado: { label: 'Não iniciado', cor: 'text-gray-400 bg-gray-800', icone: '⏳' },
  em_andamento: { label: 'Em andamento', cor: 'text-blue-300 bg-blue-900/50', icone: '🔥' },
  pausado: { label: 'Pausado', cor: 'text-yellow-300 bg-yellow-900/50', icone: '⏸️' },
  concluido: { label: 'Concluído', cor: 'text-emerald-300 bg-emerald-900/50', icone: '✅' },
};

export default function CardEstudo({ estudo, onAtualizar, onDeletar }: CardEstudoProps) {
  const [confirmandoDelete, setConfirmandoDelete] = useState(false);
  const [adicionandoHoras, setAdicionandoHoras] = useState(false);
  const [horasInput, setHorasInput] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Percentual de progresso (0 a 100)
  const percentual = Math.min(
    Math.round((estudo.horasEstudadas / estudo.metaHoras) * 100),
    100
  );

  const statusInfo = STATUS_CONFIG[estudo.status];

  // Registrar horas estudadas
  const handleAdicionarHoras = useCallback(async () => {
    const horas = parseFloat(horasInput);
    if (isNaN(horas) || horas <= 0) return;

    setCarregando(true);
    try {
      const novasHoras = Math.min(
        estudo.horasEstudadas + horas,
        estudo.metaHoras
      );
      const novoStatus =
        novasHoras >= estudo.metaHoras ? 'concluido' : 'em_andamento';

      await onAtualizar(estudo.id, {
        horasEstudadas: novasHoras,
        status: novoStatus,
      });
      setHorasInput('');
      setAdicionandoHoras(false);
    } finally {
      setCarregando(false);
    }
  }, [horasInput, estudo, onAtualizar]);

  const handleDeletar = useCallback(async () => {
    setCarregando(true);
    try {
      await onDeletar(estudo.id);
    } finally {
      setCarregando(false);
      setConfirmandoDelete(false);
    }
  }, [estudo.id, onDeletar]);

  return (
    <article
      aria-label={`Estudo: ${estudo.titulo}`}
      className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col gap-4 hover:border-gray-500 transition-colors"
    >
      {/* Cabeçalho do card */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Indicador de cor da matéria */}
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
            style={{ backgroundColor: estudo.cor }}
            aria-hidden="true"
          />
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              {estudo.titulo}
            </h3>
            <span className="text-gray-400 text-sm">{estudo.materia}</span>
          </div>
        </div>

        {/* Badge de status */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${statusInfo.cor}`}
        >
          {statusInfo.icone} {statusInfo.label}
        </span>
      </div>

      {/* Descrição (se existir) */}
      {estudo.descricao && (
        <p className="text-gray-400 text-sm leading-relaxed">{estudo.descricao}</p>
      )}

      {/* Barra de progresso */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300 font-medium">
            {estudo.horasEstudadas}h de {estudo.metaHoras}h
          </span>
          <span
            className="font-bold"
            style={{ color: estudo.cor }}
          >
            {percentual}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percentual}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso de ${estudo.titulo}: ${percentual}%`}
          className="h-3 bg-gray-700 rounded-full overflow-hidden"
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${percentual}%`,
              backgroundColor: estudo.cor,
            }}
          />
        </div>
      </div>

      {/* Seção de adicionar horas */}
      {adicionandoHoras ? (
        <div className="flex gap-2">
          <label htmlFor={`horas-${estudo.id}`} className="sr-only">
            Horas estudadas a adicionar
          </label>
          <input
            id={`horas-${estudo.id}`}
            type="number"
            min="0.1"
            step="0.5"
            value={horasInput}
            onChange={(e) => setHorasInput(e.target.value)}
            placeholder="Ex: 1.5"
            autoFocus
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleAdicionarHoras}
            disabled={carregando || !horasInput}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white rounded-xl text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {carregando ? '...' : '✓'}
          </button>
          <button
            onClick={() => { setAdicionandoHoras(false); setHorasInput(''); }}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-xl text-sm hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            ✕
          </button>
        </div>
      ) : (
        /* Botões de ação */
        <div className="flex gap-2">
          {estudo.status !== 'concluido' && (
            <button
              onClick={() => setAdicionandoHoras(true)}
              className="flex-1 py-2 bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              + Registrar horas
            </button>
          )}

          {/* Confirmação de delete — evita deleção acidental */}
          {confirmandoDelete ? (
            <div className="flex gap-2 flex-1">
              <button
                onClick={handleDeletar}
                disabled={carregando}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {carregando ? '...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setConfirmandoDelete(false)}
                className="flex-1 py-2 border border-gray-600 text-gray-300 text-sm rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmandoDelete(true)}
              aria-label={`Deletar estudo ${estudo.titulo}`}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/30 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </article>
  );
}
