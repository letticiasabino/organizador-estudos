// ============================================
// Tipos principais da aplicação
// Aqui definimos a "forma" dos dados que vêm da API
// ============================================

// Status possíveis de um estudo
export type StatusEstudo = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'pausado';

// Um estudo é uma matéria/curso que o usuário quer aprender
export interface Estudo {
  id: string;
  titulo: string;
  materia: string;
  metaHoras: number;         // Quantas horas quer estudar no total
  horasEstudadas: number;    // Quantas horas já estudou
  cor: string;               // Cor para identificar visualmente no dashboard
  descricao: string;
  criadoEm: string;          // ISO date string
  status: StatusEstudo;
}

// Dados para criar um novo estudo (sem id e criadoEm — o sistema gera)
export type NovoEstudo = Omit<Estudo, 'id' | 'criadoEm'>;

// Dados para atualizar um estudo (todos os campos são opcionais)
export type AtualizarEstudo = Partial<Omit<Estudo, 'id' | 'criadoEm'>>;

// Uma sessão de estudo (ex: um pomodoro concluído)
export interface Sessao {
  id: string;
  estudoId: string;   // A qual estudo essa sessão pertence
  duracao: number;    // Duração em minutos
  tipo: 'foco' | 'descanso';
  data: string;       // ISO date string
}

// Dados para criar uma nova sessão
export type NovaSessao = Omit<Sessao, 'id'>;

// Progresso diário de um estudo
export interface Progresso {
  id: string;
  estudoId: string;
  horasNoDia: number;
  data: string;  // formato: YYYY-MM-DD
}

// Props para o modal de criação/edição de estudos
export interface ModalEstudoProps {
  aberto: boolean;
  estudoParaEditar?: Estudo;
  onFechar: () => void;
  onSalvar: (dados: NovoEstudo) => void;
}

// Props para o card de estudo
export interface CardEstudoProps {
  estudo: Estudo;
  onAtualizar: (id: string, dados: AtualizarEstudo) => void;
  onDeletar: (id: string) => void;
}

// Props para componente de loading
export interface LoadingProps {
  mensagem?: string;
}

// Props para componente de erro
export interface ErroProps {
  mensagem: string;
  onTentar?: () => void;
}

// Estado do timer Pomodoro
export interface EstadoPomodoro {
  emExecucao: boolean;
  fase: 'foco' | 'descanso';
  segundosRestantes: number;
  minutosF: number;     // duração configurada de foco
  minutosD: number;     // duração configurada de descanso
  sessoesConcluidas: number;
  estudoSelecionadoId: string | null;
}

// Resultado da sugestão de cronograma
export interface Cronograma {
  totalDias: number;
  horasPorDia: number;
  distribuicao: { dia: number; horas: number; descricao: string }[];
}

// Dados para o dashboard — calculados no frontend com useMemo
export interface DadosDashboard {
  totalHorasEstudadas: number;
  totalHorasMeta: number;
  percentualGeral: number;
  estudosPorStatus: Record<StatusEstudo, number>;
  topMateria: string;
  sessoesHoje: number;
}
