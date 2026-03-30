// ============================================
// Componente: Navbar
// Barra de navegação principal da aplicação
// ============================================

type Pagina = 'estudos' | 'dashboard' | 'pomodoro';

interface NavbarProps {
  paginaAtiva: Pagina;
  onNavegar: (pagina: Pagina) => void;
}

const LINKS: { id: Pagina; label: string; icone: string }[] = [
  { id: 'estudos', label: 'Estudos', icone: '📚' },
  { id: 'dashboard', label: 'Dashboard', icone: '📊' },
  { id: 'pomodoro', label: 'Pomodoro', icone: '⏱️' },
];

export default function Navbar({ paginaAtiva, onNavegar }: NavbarProps) {
  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-30">
      <nav
        aria-label="Navegação principal"
        className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between"
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onNavegar('estudos'); }}
          className="flex items-center gap-2 text-white font-extrabold text-xl focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg"
        >
          <span className="text-2xl" aria-hidden="true">🧠</span>
          <span>
            <span className="text-purple-400">Estuda</span>
            <span className="text-white">Foco</span>
          </span>
        </a>

        {/* Links de navegação */}
        <ul className="flex gap-1" role="list">
          {LINKS.map(({ id, label, icone }) => (
            <li key={id}>
              <button
                onClick={() => onNavegar(id)}
                aria-current={paginaAtiva === id ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  paginaAtiva === id
                    ? 'bg-purple-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span aria-hidden="true">{icone}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
