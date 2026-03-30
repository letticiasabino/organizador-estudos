// ============================================
// Service de Sessões
// Gerencia o registro de sessões de estudo (pomodoros)
// ============================================

import api from './api';
import type { Sessao, NovaSessao } from '../types';

const sessoesService = {
  // Buscar todas as sessões
  async listar(): Promise<Sessao[]> {
    const { data } = await api.get<Sessao[]>('/sessoes');
    return data;
  },

  // Buscar sessões de um estudo específico
  async listarPorEstudo(estudoId: string): Promise<Sessao[]> {
    const { data } = await api.get<Sessao[]>(`/sessoes?estudoId=${estudoId}`);
    return data;
  },

  // Registrar uma nova sessão concluída
  async criar(novaSessao: NovaSessao): Promise<Sessao> {
    const { data } = await api.post<Sessao>('/sessoes', novaSessao);
    return data;
  },

  // Buscar sessões de hoje
  async listarHoje(): Promise<Sessao[]> {
    const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const { data } = await api.get<Sessao[]>(`/sessoes?data_gte=${hoje}T00:00:00`);
    return data;
  },
};

export default sessoesService;
