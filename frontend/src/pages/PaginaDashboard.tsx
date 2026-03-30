// ============================================
// Página: Dashboard
// Gráficos e métricas de progresso dos estudos
// Usa Recharts para visualizações e useMemo para performance
// ============================================

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend, PieChart, Pie, Cell,
} from 'recharts';
import type { Estudo, DadosDashboard } from '../types';
import Loading from '../components/Loading';
import Erro from '../components/Erro';

interface PaginaDashboardProps {
  estudos: Estudo[];
  carregando: boolean;
  erro: string | null;
  onRecarregar: () => void;
}

// Cores para os gráficos — paleta vibrante
const CORES_GRAFICO = ['#7C3AED', '#2563EB', '#DC2626', '#059669', '#D97706', '#DB2777'];

export default function PaginaDashboard({
  estudos,
  carregando,
  erro,
  onRecarregar,
}: PaginaDashboardProps) {
  // useMemo — calcula os dados do dashboard sem re-renderizar sem necessidade
  const dados: DadosDashboard = useMemo(() => {
    const totalHorasEstudadas = estudos.reduce((acc, e) => acc + e.horasEstudadas, 0);
    const totalHorasMeta = estudos.reduce((acc, e) => acc + e.metaHoras, 0);
    const percentualGeral = totalHorasMeta > 0
      ? Math.round((totalHorasEstudadas / totalHorasMeta) * 100)
      : 0;

    const estudosPorStatus = estudos.reduce(
      (acc, e) => {
        acc[e.status] = (acc[e.status] || 0) + 1;
        return acc;
      },
      {} as DadosDashboard['estudosPorStatus']
    );

    const topMateria = estudos.reduce(
      (top, e) => (e.horasEstudadas > (top?.horasEstudadas ?? 0) ? e : top),
      estudos[0]
    )?.materia ?? '—';

    return {
      totalHorasEstudadas,
      totalHorasMeta,
      percentualGeral,
      estudosPorStatus,
      topMateria,
      sessoesHoje: 0, // placeholder — poderia vir da API
    };
  }, [estudos]);

  // Dados para o gráfico de barras (progresso por matéria)
  const dadosBarras = useMemo(() =>
    estudos.map((e) => ({
      nome: e.materia.length > 10 ? e.materia.slice(0, 10) + '…' : e.materia,
      estudadas: e.horasEstudadas,
      restantes: Math.max(0, e.metaHoras - e.horasEstudadas),
      meta: e.metaHoras,
      cor: e.cor,
    })),
    [estudos]
  );

  // Dados para o gráfico de pizza (distribuição de status)
  const dadosPizza = useMemo(() => [
    { name: 'Não iniciado', value: dados.estudosPorStatus['nao_iniciado'] || 0, cor: '#6B7280' },
    { name: 'Em andamento', value: dados.estudosPorStatus['em_andamento'] || 0, cor: '#3B82F6' },
    { name: 'Pausado', value: dados.estudosPorStatus['pausado'] || 0, cor: '#F59E0B' },
    { name: 'Concluído', value: dados.estudosPorStatus['concluido'] || 0, cor: '#10B981' },
  ].filter((d) => d.value > 0), [dados.estudosPorStatus]);

  // Dados para o radial (progresso individual de cada estudo)
  const dadosRadial = useMemo(() =>
    estudos.map((e, i) => ({
      name: e.materia,
      percentual: Math.min(Math.round((e.horasEstudadas / e.metaHoras) * 100), 100),
      fill: CORES_GRAFICO[i % CORES_GRAFICO.length],
    })),
    [estudos]
  );

  if (carregando) return <Loading mensagem="Calculando seu progresso..." />;
  if (erro) return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Erro mensagem={erro} onTentar={onRecarregar} />
    </main>
  );

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-white text-3xl font-extrabold mb-8">
        Dashboard 📊
      </h1>

      {estudos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4" aria-hidden="true">📊</p>
          <p className="text-gray-400 text-lg">
            Adicione estudos para ver seu progresso aqui!
          </p>
        </div>
      ) : (
        <>
          {/* Cards de métricas rápidas */}
          <section aria-label="Métricas gerais" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricaCard
              icone="⏰"
              valor={`${dados.totalHorasEstudadas}h`}
              label="Total estudado"
              cor="purple"
            />
            <MetricaCard
              icone="🎯"
              valor={`${dados.percentualGeral}%`}
              label="Progresso geral"
              cor="blue"
            />
            <MetricaCard
              icone="🏆"
              valor={dados.topMateria}
              label="Matéria destaque"
              cor="amber"
            />
            <MetricaCard
              icone="✅"
              valor={String(dados.estudosPorStatus['concluido'] || 0)}
              label="Concluídos"
              cor="green"
            />
          </section>

          {/* Gráfico de barras — Horas por matéria */}
          <section
            aria-label="Gráfico de horas por matéria"
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6"
          >
            <h2 className="text-white font-bold text-lg mb-6">
              📚 Horas estudadas por matéria
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBarras} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="nome" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                    labelStyle={{ color: '#F9FAFB' }}
                    itemStyle={{ color: '#D1D5DB' }}
                    formatter={(value: number, name: string) => [
                      `${value}h`,
                      name === 'estudadas' ? 'Estudadas' : 'Restantes',
                    ]}
                  />
                  <Bar dataKey="estudadas" stackId="a" fill="#7C3AED" radius={[0, 0, 0, 0]} name="estudadas" />
                  <Bar dataKey="restantes" stackId="a" fill="#374151" radius={[4, 4, 0, 0]} name="restantes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de pizza — distribuição de status */}
            <section
              aria-label="Distribuição por status"
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
            >
              <h2 className="text-white font-bold text-lg mb-4">
                🔄 Status dos estudos
              </h2>
              {dadosPizza.length > 0 ? (
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosPizza}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {dadosPizza.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                        itemStyle={{ color: '#D1D5DB' }}
                      />
                      <Legend
                        formatter={(value) => (
                          <span style={{ color: '#9CA3AF', fontSize: '12px' }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Sem dados</p>
              )}
            </section>

            {/* Progresso radial por matéria */}
            <section
              aria-label="Percentual de conclusão por matéria"
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
            >
              <h2 className="text-white font-bold text-lg mb-4">
                🎯 Percentual por matéria
              </h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="20%"
                    outerRadius="90%"
                    data={dadosRadial}
                    startAngle={180}
                    endAngle={-180}
                  >
                    <RadialBar
                      dataKey="percentual"
                      cornerRadius={4}
                      background={{ fill: '#1F2937' }}
                      label={{ fill: '#fff', fontSize: 11, position: 'insideStart' }}
                    />
                    <Legend
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ color: '#9CA3AF', fontSize: '11px' }}>{value}</span>
                      )}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                      formatter={(value: number) => [`${value}%`, 'Progresso']}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* Tabela detalhada */}
          <section
            aria-label="Detalhes de cada estudo"
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-4">
              📋 Detalhes por matéria
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-2 text-gray-400 font-semibold">Matéria</th>
                    <th className="text-right py-3 px-2 text-gray-400 font-semibold">Estudadas</th>
                    <th className="text-right py-3 px-2 text-gray-400 font-semibold">Meta</th>
                    <th className="text-right py-3 px-2 text-gray-400 font-semibold">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {estudos.map((e) => {
                    const pct = Math.min(Math.round((e.horasEstudadas / e.metaHoras) * 100), 100);
                    return (
                      <tr key={e.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.cor }} aria-hidden="true" />
                            <span className="text-white font-medium">{e.materia}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2 text-gray-300">{e.horasEstudadas}h</td>
                        <td className="text-right py-3 px-2 text-gray-300">{e.metaHoras}h</td>
                        <td className="text-right py-3 px-2">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, backgroundColor: e.cor }}
                              />
                            </div>
                            <span className="font-bold" style={{ color: e.cor }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

// Componente auxiliar para os cards de métricas
interface MetricaCardProps {
  icone: string;
  valor: string;
  label: string;
  cor: 'purple' | 'blue' | 'amber' | 'green';
}

const COR_MAP: Record<MetricaCardProps['cor'], string> = {
  purple: 'bg-purple-900/40 border-purple-700 text-purple-300',
  blue: 'bg-blue-900/40 border-blue-700 text-blue-300',
  amber: 'bg-amber-900/40 border-amber-700 text-amber-300',
  green: 'bg-emerald-900/40 border-emerald-700 text-emerald-300',
};

function MetricaCard({ icone, valor, label, cor }: MetricaCardProps) {
  return (
    <div className={`border rounded-2xl p-4 text-center ${COR_MAP[cor]}`}>
      <p className="text-3xl mb-1" aria-hidden="true">{icone}</p>
      <p className="text-white text-2xl font-extrabold leading-tight">{valor}</p>
      <p className="text-xs mt-1 font-medium">{label}</p>
    </div>
  );
}
