// ============================================
// Componente: ListaVazia
// Exibido quando não há estudos cadastrados
// ============================================

interface ListaVaziaProps {
  onCriar: () => void;
}

export default function ListaVazia({ onCriar }: ListaVaziaProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <span className="text-8xl" aria-hidden="true">📚</span>
      <div>
        <h2 className="text-white text-2xl font-bold mb-2">
          Nenhum estudo por aqui ainda!
        </h2>
        <p className="text-gray-400 text-lg max-w-sm">
          Que tal adicionar sua primeira matéria e começar a organizar sua jornada de aprendizado?
        </p>
      </div>
      <button
        onClick={onCriar}
        className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        ✨ Adicionar meu primeiro estudo
      </button>
    </div>
  );
}
