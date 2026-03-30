// ============================================
// Componente: Loading
// Tela de carregamento para evitar tela em branco
// ============================================

import type { LoadingProps } from '../types';

export default function Loading({ mensagem = 'Carregando...' }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      {/* Spinner animado */}
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      <p className="text-purple-300 text-lg font-medium animate-pulse">
        {mensagem}
      </p>
    </div>
  );
}
