# 🧠 EstudaFoco — Organizador de Estudos Inteligente

> Chega de procrastinar. Organize sua jornada de aprendizado com foco, progresso e consistência.

---

## 🎯 O Problema que Resolve

Estudantes iniciantes em tecnologia têm dificuldade de manter constância nos estudos. Sem saber quanto já estudaram, quanto falta, e sem um sistema de foco, acabam desistindo. O EstudaFoco resolve isso com:

- **Visibilidade do progresso** — veja exatamente quanto falta para cada meta
- **Timer Pomodoro** — técnica comprovada de foco e descanso
- **Dashboard com gráficos** — dados reais sobre seus hábitos de estudo
- **Gerador de cronograma** — cola sua meta, o sistema distribui as horas

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite |
| Linguagem | TypeScript (tipagem completa, sem `any`) |
| Estilo | Tailwind CSS |
| Gráficos | Recharts |
| HTTP | Axios |
| Backend | json-server |
| Hooks | useState, useEffect, useMemo, useCallback, useRef |

---

## 📦 Estrutura do Projeto

```
organizador-estudos/
├── backend/
│   ├── db.json          # Banco de dados fake (json-server)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   │   ├── CardEstudo.tsx
│   │   │   ├── Erro.tsx
│   │   │   ├── ListaVazia.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ModalCronograma.tsx
│   │   │   ├── ModalEstudo.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Notificacoes.tsx
│   │   ├── hooks/       # Custom Hooks
│   │   │   ├── useEstudos.ts     # CRUD de estudos
│   │   │   ├── usePomodoro.ts    # Lógica do timer
│   │   │   └── useNotificacoes.ts # Alertas visuais
│   │   ├── pages/       # Páginas principais
│   │   │   ├── PaginaDashboard.tsx
│   │   │   ├── PaginaEstudos.tsx
│   │   │   └── PaginaPomodoro.tsx
│   │   ├── services/    # Chamadas à API (isoladas da UI)
│   │   │   ├── api.ts
│   │   │   ├── estudosService.ts
│   │   │   └── sessoesService.ts
│   │   ├── types/       # Interfaces e types TypeScript
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── PRD.md
└── README.md
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Instalar e rodar o backend (json-server)

```bash
cd backend
npm install
npm start
# API rodando em http://localhost:3001
```

### 2. Instalar e rodar o frontend

```bash
cd frontend
npm install
npm run dev
# App rodando em http://localhost:5173
```

> ⚠️ O backend **precisa estar rodando** antes do frontend para que os dados carreguem.

---

## ✨ Funcionalidades

### 📚 Gestão de Estudos (CRUD completo)
- Criar matérias com meta de horas, cor e descrição
- Registrar horas estudadas com feedback instantâneo
- Filtrar por status (não iniciado, em andamento, concluído, pausado)
- Buscar por título ou matéria
- Deletar com confirmação (evita exclusão acidental)

### 📊 Dashboard Inteligente
- Métricas rápidas: total de horas, progresso geral, matéria destaque
- Gráfico de barras: horas estudadas vs. meta por matéria
- Gráfico de pizza: distribuição por status
- Gráfico radial: percentual de conclusão
- Tabela detalhada com mini barras de progresso

### ⏱️ Pomodoro Configurável
- Timer com anel circular animado em SVG
- Configurar minutos de foco e descanso livremente
- Vincula sessão a uma matéria específica (registra na API)
- Contador de sessões concluídas

### 🧠 Gerador de Cronograma
- Informe a meta de horas e o prazo em dias → o sistema calcula horas por dia
- Ou informe quantas horas por dia tem → o sistema calcula o prazo
- Mostra distribuição semanal detalhada

### 🔔 Notificações
- Toast notifications com auto-dismiss (4 segundos)
- 4 tipos: info, sucesso, alerta, erro
- Lembrete de estudo a cada 30 minutos

---

## 💡 Decisões de Design

### Por que pedir confirmação ao deletar?
Evita exclusão acidental de dados que levaram tempo para construir. O usuário vê dois botões: "Confirmar" e "Cancelar".

### Por que o timer para entre fases?
Preserva o controle do usuário — especialmente importante para pessoas com TDAH que podem precisar de mais tempo para transitar entre foco e descanso.

### Por que useMemo no Dashboard?
Os cálculos do dashboard envolvem iterações sobre todos os estudos. Com `useMemo`, esses cálculos só rodam quando os dados mudam, evitando processamento desnecessário.

---

## 🌐 Deploy

- **Frontend:** Vercel (arraste a pasta `frontend` ou conecte o repositório)
- **Backend:** Railway ou Render para hospedar o json-server

> Para deploy, configure a variável de ambiente `VITE_API_URL` com a URL pública do backend e atualize `src/services/api.ts`.
