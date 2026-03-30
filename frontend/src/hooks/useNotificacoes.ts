// ============================================
// Custom Hook: useNotificacoes
// Gerencia alertas visuais e lembretes de estudo
// Usa setTimeout/setInterval para simular notificações
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';

export interface Notificacao {
  id: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
  icone: string;
}

interface UseNotificacoesRetorno {
  notificacoes: Notificacao[];
  adicionarNotificacao: (
    mensagem: string,
    tipo?: Notificacao['tipo'],
    icone?: string
  ) => void;
  removerNotificacao: (id: string) => void;
}

export function useNotificacoes(): UseNotificacoesRetorno {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  // useRef para controlar timeouts de auto-remoção
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Limpa todos os timeouts quando desmonta
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const removerNotificacao = useCallback((id: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const adicionarNotificacao = useCallback(
    (mensagem: string, tipo: Notificacao['tipo'] = 'info', icone = '🔔') => {
      const id = `notif-${Date.now()}-${Math.random()}`;
      const novaNotif: Notificacao = { id, mensagem, tipo, icone };

      setNotificacoes((prev) => [...prev, novaNotif]);

      // Auto-remove depois de 4 segundos
      const timeout = setTimeout(() => {
        removerNotificacao(id);
      }, 4000);

      timeoutsRef.current.set(id, timeout);
    },
    [removerNotificacao]
  );

  return { notificacoes, adicionarNotificacao, removerNotificacao };
}
