// ============================================
// Componente: Erro
// Exibe mensagem de erro com opção de tentar novamente
// ============================================

import type { ErroProps } from '../types';

export default function Erro({ mensagem, onTentar }: ErroProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
    >
      <span className="text-6xl" aria-hidden="true">⚠️</span>
      <h2 className="text-red-400 text-xl font-bold">Algo deu errado</h2>
      <p className="text-gray-400 max-w-md">{mensagem}</p>
      {onTentar && (
        <button
          onClick={onTentar}
          className="mt-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
