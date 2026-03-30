// ============================================
// Componente: ModalCronograma
// Gerador de cronograma inteligente de estudos
// O usuário informa a meta e o sistema distribui as horas
// ============================================

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { Cronograma } from '../types';

interface ModalCronogramaProps {
  aberto: boolean;
  onFechar: () => void;
}

type ModoCalculo = 'prazo' | 'horas_por_dia';

export default function ModalCronograma({ aberto, onFechar }: ModalCronogramaProps) {
  const [modo, setModo] = useState<ModoCalculo>('prazo');
  const [totalHoras, setTotalHoras] = useState('');
  const [diasPrazo, setDiasPrazo] = useState('');
  const [horasPorDia, setHorasPorDia] = useState('');
  const [cronograma, setCronograma] = useState<Cronograma | null>(null);

  if (!aberto) return null;

  function calcularCronograma(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const horas = parseFloat(totalHoras);
    let diasTotal: number;
    let hPorDia: number;

    if (modo === 'prazo') {
      diasTotal = parseInt(diasPrazo);
      hPorDia = Math.ceil((horas / diasTotal) * 10) / 10; // arredonda para cima com 1 decimal
    } else {
      hPorDia = parseFloat(horasPorDia);
      diasTotal = Math.ceil(horas / hPorDia);
    }

    // Gera distribuição semanal simplificada (mostra as primeiras 4 semanas)
    const semanas = Math.ceil(diasTotal / 7);
    const distribuicao = Array.from({ length: Math.min(semanas, 8) }, (_, i) => {
      const semana = i + 1;
      const diasNaSemana = Math.min(7, diasTotal - i * 7);
      return {
        dia: semana,
        horas: Math.round(hPorDia * diasNaSemana * 10) / 10,
        descricao: `Semana ${semana} — ${diasNaSemana} dia(s) × ${hPorDia}h`,
      };
    });

    setCronograma({ totalDias: diasTotal, horasPorDia: hPorDia, distribuicao });
  }

  function handleInput(setter: (v: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value);
  }

  function fechar() {
    setCronograma(null);
    setTotalHoras('');
    setDiasPrazo('');
    setHorasPorDia('');
    onFechar();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cronograma-titulo"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && fechar()}
    >
      <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <h2 id="cronograma-titulo" className="text-white text-xl font-bold">
            🧠 Sugestão de Cronograma
          </h2>
          <button onClick={fechar} aria-label="Fechar" className="text-gray-400 hover:text-white text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Modo de cálculo */}
          <fieldset>
            <legend className="text-gray-300 text-sm font-semibold mb-3">
              Como você quer calcular?
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                  modo === 'prazo'
                    ? 'border-purple-500 bg-purple-900/30 text-purple-300'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="modo"
                  value="prazo"
                  checked={modo === 'prazo'}
                  onChange={() => setModo('prazo')}
                  className="sr-only"
                />
                <span>📅 Tenho um prazo</span>
              </label>
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                  modo === 'horas_por_dia'
                    ? 'border-purple-500 bg-purple-900/30 text-purple-300'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="modo"
                  value="horas_por_dia"
                  checked={modo === 'horas_por_dia'}
                  onChange={() => setModo('horas_por_dia')}
                  className="sr-only"
                />
                <span>⏱️ Sei quantas horas/dia</span>
              </label>
            </div>
          </fieldset>

          <form onSubmit={calcularCronograma} className="flex flex-col gap-4">
            {/* Total de horas */}
            <div>
              <label htmlFor="totalHoras" className="block text-gray-300 text-sm font-semibold mb-1">
                Total de horas que quero estudar *
              </label>
              <input
                id="totalHoras"
                type="number"
                min="1"
                step="0.5"
                value={totalHoras}
                onChange={handleInput(setTotalHoras)}
                required
                placeholder="Ex: 200"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Campo condicional por modo */}
            {modo === 'prazo' ? (
              <div>
                <label htmlFor="diasPrazo" className="block text-gray-300 text-sm font-semibold mb-1">
                  Em quantos dias? *
                </label>
                <input
                  id="diasPrazo"
                  type="number"
                  min="1"
                  value={diasPrazo}
                  onChange={handleInput(setDiasPrazo)}
                  required
                  placeholder="Ex: 90"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="horasPorDia" className="block text-gray-300 text-sm font-semibold mb-1">
                  Quantas horas por dia você tem? *
                </label>
                <input
                  id="horasPorDia"
                  type="number"
                  min="0.5"
                  step="0.5"
                  max="16"
                  value={horasPorDia}
                  onChange={handleInput(setHorasPorDia)}
                  required
                  placeholder="Ex: 2"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Gerar cronograma ✨
            </button>
          </form>

          {/* Resultado do cronograma */}
          {cronograma && (
            <section aria-label="Resultado do cronograma" className="mt-2">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-purple-900/40 border border-purple-700 rounded-xl p-4 text-center">
                  <p className="text-purple-300 text-sm">Duração total</p>
                  <p className="text-white text-2xl font-bold">{cronograma.totalDias} dias</p>
                </div>
                <div className="bg-blue-900/40 border border-blue-700 rounded-xl p-4 text-center">
                  <p className="text-blue-300 text-sm">Por dia</p>
                  <p className="text-white text-2xl font-bold">{cronograma.horasPorDia}h</p>
                </div>
              </div>

              <h3 className="text-gray-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                Distribuição semanal
              </h3>
              <ul className="flex flex-col gap-2">
                {cronograma.distribuicao.map((item) => (
                  <li
                    key={item.dia}
                    className="flex justify-between items-center px-4 py-3 bg-gray-800 rounded-xl"
                  >
                    <span className="text-gray-300 text-sm">{item.descricao}</span>
                    <span className="text-purple-400 font-bold text-sm">{item.horas}h</span>
                  </li>
                ))}
              </ul>

              {cronograma.totalDias > 56 && (
                <p className="mt-3 text-amber-400 text-sm bg-amber-900/30 border border-amber-700 rounded-xl p-3">
                  💡 Dica: Esse prazo é longo. Considere aumentar um pouco as horas diárias para manter o ritmo!
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
