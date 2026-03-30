// ============================================
// Service de Estudos
// Todas as chamadas à API relacionadas a estudos ficam aqui
// Isso mantém os componentes limpos — eles não precisam saber
// como a API funciona, só chamam o service
// ============================================

import api from './api';
import type { Estudo, NovoEstudo, AtualizarEstudo } from '../types';

const estudosService = {
  // Buscar todos os estudos
  async listar(): Promise<Estudo[]> {
    const { data } = await api.get<Estudo[]>('/estudos');
    return data;
  },

  // Buscar um estudo específico pelo id
  async buscarPorId(id: string): Promise<Estudo> {
    const { data } = await api.get<Estudo>(`/estudos/${id}`);
    return data;
  },

  // Criar um novo estudo
  async criar(novoEstudo: NovoEstudo): Promise<Estudo> {
    const { data } = await api.post<Estudo>('/estudos', {
      ...novoEstudo,
      criadoEm: new Date().toISOString(), // Adicionamos a data de criação aqui
    });
    return data;
  },

  // Atualizar parcialmente um estudo (PATCH — só manda o que mudou)
  async atualizar(id: string, dados: AtualizarEstudo): Promise<Estudo> {
    const { data } = await api.patch<Estudo>(`/estudos/${id}`, dados);
    return data;
  },

  // Deletar um estudo
  async deletar(id: string): Promise<void> {
    await api.delete(`/estudos/${id}`);
  },
};

export default estudosService;
