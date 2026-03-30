// ============================================
// Componente: Notificacoes
// Toast notifications no canto da tela
// ============================================

import type { Notificacao } from '../hooks/useNotificacoes';

interface NotificacoesProps {
  notificacoes: Notificacao[];
  onRemover: (id: string) => void;
}

// Mapeamento de cores por tipo de notificação
const ESTILOS: Record<Notificacao['tipo'], string> = {
  info: 'bg-blue-600 border-blue-400',
  sucesso: 'bg-emerald-600 border-emerald-400',
  alerta: 'bg-amber-500 border-amber-300',
  erro: 'bg-red-600 border-red-400',
};

export default function Notificacoes({ notificacoes, onRemover }: NotificacoesProps) {
  if (notificacoes.length === 0) return null;

  return (
    // Posicionado no canto inferior direito, acima de tudo
    <div
      aria-live="polite"
      aria-label="Notificações"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm"
    >
      {notificacoes.map((notif) => (
        <div
          key={notif.id}
          role="status"
          className={`
            flex items-start gap-3 px-4 py-3 rounded-xl border-l-4
            text-white font-medium shadow-2xl
            animate-[slideIn_0.3s_ease-out]
            ${ESTILOS[notif.tipo]}
          `}
        >
          <span className="text-2xl flex-shrink-0" aria-hidden="true">
            {notif.icone}
          </span>
          <p className="flex-1 text-sm leading-snug">{notif.mensagem}</p>
          <button
            onClick={() => onRemover(notif.id)}
            aria-label="Fechar notificação"
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
