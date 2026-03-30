// ============================================
// Custom Hook: usePomodoro
// Gerencia o timer Pomodoro com foco e descanso
// Usa useRef para o intervalo (não causa re-render)
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import type { EstadoPomodoro } from '../types';
import sessoesService from '../services/sessoesService';

interface UsePomodoroRetorno {
  estado: EstadoPomodoro;
  iniciar: () => void;
  pausar: () => void;
  resetar: () => void;
  configurar: (minutosF: number, minutosD: number) => void;
  selecionarEstudo: (id: string | null) => void;
}

const PADRAO_MINUTOS_FOCO = 25;
const PADRAO_MINUTOS_DESCANSO = 5;

export function usePomodoro(): UsePomodoroRetorno {
  const [estado, setEstado] = useState<EstadoPomodoro>({
    emExecucao: false,
    fase: 'foco',
    segundosRestantes: PADRAO_MINUTOS_FOCO * 60,
    minutosF: PADRAO_MINUTOS_FOCO,
    minutosD: PADRAO_MINUTOS_DESCANSO,
    sessoesConcluidas: 0,
    estudoSelecionadoId: null,
  });

  // useRef para o intervalo — não precisa causar re-render
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpa o intervalo quando o componente desmonta
  useEffect(() => {
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  // Quando o timer chega a zero, avança para a próxima fase
  const avancarFase = useCallback(async (estadoAtual: EstadoPomodoro) => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);

    const novaFase = estadoAtual.fase === 'foco' ? 'descanso' : 'foco';
    const novosSegundos =
      novaFase === 'foco'
        ? estadoAtual.minutosF * 60
        : estadoAtual.minutosD * 60;

    // Se concluiu um pomodoro de foco, registra na API
    if (estadoAtual.fase === 'foco' && estadoAtual.estudoSelecionadoId) {
      try {
        await sessoesService.criar({
          estudoId: estadoAtual.estudoSelecionadoId,
          duracao: estadoAtual.minutosF,
          tipo: 'foco',
          data: new Date().toISOString(),
        });
      } catch {
        // Falha silenciosa — não quebra o timer
        console.warn('Não foi possível registrar a sessão na API');
      }
    }

    // Notificação visual via título da aba
    const msg =
      novaFase === 'foco'
        ? '🎯 Hora de focar!'
        : '☕ Hora de descansar!';
    document.title = msg;
    setTimeout(() => {
      document.title = 'Organizador de Estudos Inteligente 🧠';
    }, 3000);

    setEstado((prev) => ({
      ...prev,
      fase: novaFase,
      segundosRestantes: novosSegundos,
      emExecucao: false, // Para no fim de cada fase — usuário decide quando continuar
      sessoesConcluidas:
        estadoAtual.fase === 'foco'
          ? prev.sessoesConcluidas + 1
          : prev.sessoesConcluidas,
    }));
  }, []);

  const iniciar = useCallback(() => {
    setEstado((prev) => ({ ...prev, emExecucao: true }));

    intervaloRef.current = setInterval(() => {
      setEstado((prev) => {
        if (prev.segundosRestantes <= 1) {
          // Timer chegou ao fim — avança de fase
          avancarFase(prev);
          return prev;
        }
        return { ...prev, segundosRestantes: prev.segundosRestantes - 1 };
      });
    }, 1000);
  }, [avancarFase]);

  const pausar = useCallback(() => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    setEstado((prev) => ({ ...prev, emExecucao: false }));
  }, []);

  const resetar = useCallback(() => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    setEstado((prev) => ({
      ...prev,
      emExecucao: false,
      fase: 'foco',
      segundosRestantes: prev.minutosF * 60,
    }));
  }, []);

  const configurar = useCallback((minutosF: number, minutosD: number) => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    setEstado((prev) => ({
      ...prev,
      emExecucao: false,
      minutosF,
      minutosD,
      segundosRestantes: minutosF * 60,
      fase: 'foco',
    }));
  }, []);

  const selecionarEstudo = useCallback((id: string | null) => {
    setEstado((prev) => ({ ...prev, estudoSelecionadoId: id }));
  }, []);

  return { estado, iniciar, pausar, resetar, configurar, selecionarEstudo };
}
