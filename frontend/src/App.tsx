// ============================================
// App.tsx — Componente raiz da aplicação
// Gerencia navegação entre páginas e estado global
// ============================================

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Notificacoes from './components/Notificacoes';
import PaginaEstudos from './pages/PaginaEstudos';
import PaginaDashboard from './pages/PaginaDashboard';
import PaginaPomodoro from './pages/PaginaPomodoro';
import { useEstudos } from './hooks/useEstudos';
import { useNotificacoes } from './hooks/useNotificacoes';

type Pagina = 'estudos' | 'dashboard' | 'pomodoro';

export default function App() {
  const [paginaAtiva, setPaginaAtiva] = useState<Pagina>('estudos');

  // Hook de estudos — CRUD completo
  const {
    estudos,
    carregando,
    erro,
    criarEstudo,
    atualizarEstudo,
    deletarEstudo,
    recarregar,
  } = useEstudos();

  // Hook de notificações — alertas visuais
  const { notificacoes, adicionarNotificacao, removerNotificacao } = useNotificacoes();

  // Lembrete de estudo a cada 30 minutos — simula notificação push
  useEffect(() => {
    const lembrete = setInterval(() => {
      adicionarNotificacao(
        '⏰ Hora de estudar! Você já abriu o app — aproveite o momento!',
        'alerta',
        '🔔'
      );
    }, 30 * 60 * 1000); // 30 minutos

    return () => clearInterval(lembrete);
  }, [adicionarNotificacao]);

  // Renderização condicional das páginas
  function renderPagina() {
    switch (paginaAtiva) {
      case 'estudos':
        return (
          <PaginaEstudos
            estudos={estudos}
            carregando={carregando}
            erro={erro}
            onCriar={criarEstudo}
            onAtualizar={atualizarEstudo}
            onDeletar={deletarEstudo}
            onRecarregar={recarregar}
            onNotificar={adicionarNotificacao}
          />
        );
      case 'dashboard':
        return (
          <PaginaDashboard
            estudos={estudos}
            carregando={carregando}
            erro={erro}
            onRecarregar={recarregar}
          />
        );
      case 'pomodoro':
        return (
          <PaginaPomodoro
            estudos={estudos}
            onNotificar={adicionarNotificacao}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Link "pular para conteúdo" — acessibilidade para navegação por teclado */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Pular para o conteúdo principal
      </a>

      <Navbar paginaAtiva={paginaAtiva} onNavegar={setPaginaAtiva} />

      {/* Conteúdo da página ativa */}
      {renderPagina()}

      {/* Notificações (toast) — sempre visíveis por cima de tudo */}
      <Notificacoes
        notificacoes={notificacoes}
        onRemover={removerNotificacao}
      />
    </div>
  );
}
