// ============================================
// Página: Pomodoro
// Timer de foco e descanso configurável
// Usa o hook usePomodoro para toda a lógica do timer
// ============================================

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Estudo } from '../types';
import { usePomodoro } from '../hooks/usePomodoro';

interface PaginaPomodoroProps {
  estudos: Estudo[];
  onNotificar: (msg: string, tipo?: 'info' | 'sucesso' | 'alerta' | 'erro', icone?: string) => void;
}

export default function PaginaPomodoro({ estudos, onNotificar }: PaginaPomodoroProps) {
  const { estado, iniciar, pausar, resetar, configurar, selecionarEstudo } = usePomodoro();
  const [inputFoco, setInputFoco] = useState(String(estado.minutosF));
  const [inputDescanso, setInputDescanso] = useState(String(estado.minutosD));

  // Formata os segundos em MM:SS para exibição
  function formatarTempo(segundos: number): string {
    const m = Math.floor(segundos / 60).toString().padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function handleConfigurar() {
    const f = parseInt(inputFoco);
    const d = parseInt(inputDescanso);
    if (f > 0 && d > 0) {
      configurar(f, d);
      onNotificar(`Timer configurado: ${f}min foco / ${d}min descanso`, 'info', '⏱️');
    }
  }

  function handleIniciar() {
    iniciar();
    const mensagem =
      estado.fase === 'foco'
        ? '🎯 Foco ativado! Mãos à obra!'
        : '☕ Hora de respirar e descansar!';
    onNotificar(mensagem, 'sucesso', estado.fase === 'foco' ? '🎯' : '☕');
  }

  // Porcentagem de tempo restante para o anel circular
  const totalSegundos =
    estado.fase === 'foco' ? estado.minutosF * 60 : estado.minutosD * 60;
  const percentualRestante = (estado.segundosRestantes / totalSegundos) * 100;

  // SVG para o anel circular de progresso
  const raio = 90;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia * (1 - percentualRestante / 100);

  const corFase = estado.fase === 'foco' ? '#7C3AED' : '#059669';
  const corFundo = estado.fase === 'foco' ? '#4C1D95' : '#064E3B';

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-white text-3xl font-extrabold mb-8 text-center">
        Pomodoro ⏱️
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timer principal */}
        <section
          aria-label="Timer Pomodoro"
          className="bg-gray-900 border border-gray-700 rounded-3xl p-8 flex flex-col items-center gap-6"
        >
          {/* Indicador de fase */}
          <div
            className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest"
            style={{ backgroundColor: corFundo, color: corFase }}
          >
            {estado.fase === 'foco' ? '🎯 Foco' : '☕ Descanso'}
          </div>

          {/* Anel circular SVG */}
          <div className="relative" role="timer" aria-live="polite" aria-label={`Tempo restante: ${formatarTempo(estado.segundosRestantes)}`}>
            <svg width="220" height="220" viewBox="0 0 220 220" aria-hidden="true">
              {/* Trilha de fundo */}
              <circle
                cx="110" cy="110" r={raio}
                fill="none"
                stroke="#1F2937"
                strokeWidth="12"
              />
              {/* Progresso */}
              <circle
                cx="110" cy="110" r={raio}
                fill="none"
                stroke={corFase}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circunferencia}
                strokeDashoffset={offset}
                transform="rotate(-90 110 110)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>

            {/* Tempo no centro */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-5xl font-extrabold tabular-nums">
                {formatarTempo(estado.segundosRestantes)}
              </span>
              <span className="text-gray-400 text-sm mt-1">
                {estado.sessoesConcluidas} sessão(ões)
              </span>
            </div>
          </div>

          {/* Botões de controle */}
          <div className="flex gap-3 w-full">
            {estado.emExecucao ? (
              <button
                onClick={pausar}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                ⏸ Pausar
              </button>
            ) : (
              <button
                onClick={handleIniciar}
                className="flex-1 py-3 font-bold rounded-2xl transition-all text-lg hover:scale-105 focus:outline-none focus:ring-2 text-white"
                style={{ backgroundColor: corFase }}
              >
                ▶ {estado.segundosRestantes === totalSegundos ? 'Iniciar' : 'Continuar'}
              </button>
            )}
            <button
              onClick={resetar}
              aria-label="Resetar timer"
              className="py-3 px-4 border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              ↺
            </button>
          </div>

          {/* Seleção de estudo para vincular sessão */}
          <div className="w-full">
            <label htmlFor="estudo-pomodoro" className="block text-gray-400 text-sm font-semibold mb-2">
              Estudando agora (opcional)
            </label>
            <select
              id="estudo-pomodoro"
              value={estado.estudoSelecionadoId ?? ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                selecionarEstudo(e.target.value || null)
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="">— Selecionar matéria —</option>
              {estudos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.materia} — {e.titulo}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Configurações e histórico */}
        <div className="flex flex-col gap-6">
          {/* Configurações do timer */}
          <section
            aria-labelledby="config-titulo"
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
          >
            <h2 id="config-titulo" className="text-white font-bold text-lg mb-5">
              ⚙️ Configurações
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="minutos-foco" className="block text-gray-300 text-sm font-semibold mb-1">
                  Minutos de foco
                </label>
                <input
                  id="minutos-foco"
                  type="number"
                  min="1"
                  max="120"
                  value={inputFoco}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setInputFoco(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="minutos-descanso" className="block text-gray-300 text-sm font-semibold mb-1">
                  Minutos de descanso
                </label>
                <input
                  id="minutos-descanso"
                  type="number"
                  min="1"
                  max="60"
                  value={inputDescanso}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setInputDescanso(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={handleConfigurar}
                disabled={estado.emExecucao}
                className="py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Aplicar configurações
              </button>
            </div>
          </section>

          {/* Dicas Pomodoro */}
          <section
            aria-labelledby="dicas-titulo"
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
          >
            <h2 id="dicas-titulo" className="text-white font-bold text-lg mb-4">
              💡 Dicas para focar
            </h2>
            <ul className="flex flex-col gap-3">
              {[
                { icone: '📵', texto: 'Coloque o celular no silencioso' },
                { icone: '💧', texto: 'Tenha água por perto' },
                { icone: '🎧', texto: 'Use fones com música instrumental' },
                { icone: '📝', texto: 'Anote o que vai estudar antes de começar' },
                { icone: '🚫', texto: 'Feche abas desnecessárias do navegador' },
              ].map(({ icone, texto }) => (
                <li key={texto} className="flex items-center gap-3 text-gray-300 text-sm">
                  <span aria-hidden="true">{icone}</span>
                  <span>{texto}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Estatísticas da sessão atual */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-900/40 border border-purple-700 rounded-2xl p-4 text-center">
              <p className="text-purple-300 text-xs font-semibold uppercase">Sessões hoje</p>
              <p className="text-white text-3xl font-extrabold mt-1">
                {estado.sessoesConcluidas}
              </p>
            </div>
            <div className="bg-blue-900/40 border border-blue-700 rounded-2xl p-4 text-center">
              <p className="text-blue-300 text-xs font-semibold uppercase">Tempo focado</p>
              <p className="text-white text-3xl font-extrabold mt-1">
                {estado.sessoesConcluidas * estado.minutosF}m
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
