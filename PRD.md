# PRD — Organizador de Estudos Inteligente

## 1. Problema

Estudantes iniciantes em tecnologia (ex: quem está aprendendo React, Python, lógica de programação) frequentemente:

- Não sabem **quanto já estudaram** de cada matéria
- Perdem o **foco** facilmente por falta de estrutura
- Não têm **rotina consistente** de estudos
- Desistem por não visualizar progresso

Esse problema é ainda mais crítico para pessoas com TDAH, que precisam de feedback visual constante e metas claras para manter a consistência.

**Por que vale resolver?** Estudantes que organizam seus estudos têm até 3x mais chances de concluir o que começaram. Uma ferramenta focada nesse público específico pode fazer a diferença entre desistir e se tornar desenvolvedor.

## 2. Público-alvo

Estudantes entre 18–30 anos, iniciantes em tecnologia, especialmente os que estudam por conta própria (bootcamps, cursos online, YouTube). Muitos têm TDAH ou dificuldades de concentração. Usam o computador para estudar e precisam de algo simples, visual e direto ao ponto.

## 3. Justificativa

Ferramentas como Notion ou Trello são poderosas demais e genéricas demais. Estudantes iniciantes se perdem configurando o sistema em vez de estudar. Precisamos de uma solução **focada, rápida de usar e visualmente motivadora**.

## 4. Funcionalidades Essenciais

| Funcionalidade | Sem ela, resolve o problema? |
|---|---|
| Listar matérias/estudos | Não — sem isso não tem organização |
| Criar novo estudo com meta de horas | Não — é a ação principal |
| Atualizar progresso (horas estudadas) | Não — sem isso não tem acompanhamento |
| Deletar estudo | Não — usuário precisa remover o que não faz mais sentido |
| Timer Pomodoro | Parcialmente, mas muito importante para foco |
| Dashboard de progresso | Parcialmente, mas fundamental para motivação |
| Notificações de lembrete | Opcional, mas melhora muito a constância |
| Sugestão de cronograma | Extra valioso — calcula distribuição de horas |

## 5. Decisões Técnicas

### API (json-server — porta 3001)

**Entidades:**
- `estudos` — matérias/cursos sendo estudados
- `sessoes` — sessões de estudo (pomodoros concluídos)
- `progresso` — snapshots diários de progresso

**Operações:**
- `GET /estudos` — listar todos os estudos
- `POST /estudos` — criar novo estudo
- `PATCH /estudos/:id` — atualizar progresso (horas estudadas)
- `DELETE /estudos/:id` — remover estudo
- `GET /sessoes` — listar sessões
- `POST /sessoes` — registrar sessão concluída

### Frontend
- **React + Vite + TypeScript** — padrão de mercado, zero config
- **Tailwind CSS** — agilidade no estilo, foco em UI viva e acessível
- **Recharts** — gráficos do dashboard de progresso
- **Custom Hook `useEstudos`** — isola lógica de CRUD da UI
- **Serviços separados** — `estudosService.ts` e `sessoesService.ts`

### Por que sem banco de dados real?
O projeto é educacional. json-server simula uma REST API real com zero configuração, permitindo focar no frontend sem overhead de DevOps.

## 6. O que NÃO será feito (e por quê)

| Funcionalidade | Motivo |
|---|---|
| Autenticação/login | Complexidade desnecessária para o escopo; arquivo JSON é pessoal |
| App mobile nativo | Fora do escopo técnico do projeto |
| Sincronização em nuvem | json-server é local por design |
| Gamificação com rankings | Distrai do foco em organização |
| Integração com Google Calendar | Complexidade de OAuth fora do escopo |
