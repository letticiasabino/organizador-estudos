// ============================================
// Custom Hook: useEstudos
// Centraliza toda a lógica de CRUD de estudos
// Os componentes chamam esse hook e ficam limpos
// ============================================

import { useState, useEffect, useCallback } from 'react';
import type { Estudo, NovoEstudo, AtualizarEstudo } from '../types';
import estudosService from '../services/estudosService';

interface UseEstudosRetorno {
  estudos: Estudo[];
  carregando: boolean;
  erro: string | null;
  criarEstudo: (dados: NovoEstudo) => Promise<void>;
  atualizarEstudo: (id: string, dados: AtualizarEstudo) => Promise<void>;
  deletarEstudo: (id: string) => Promise<void>;
  recarregar: () => void;
}

export function useEstudos(): UseEstudosRetorno {
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // useCallback garante que a função não seja recriada desnecessariamente
  const carregarEstudos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await estudosService.listar();
      setEstudos(dados);
    } catch (err) {
      // Tratamento de erro amigável
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro('Erro ao carregar estudos. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  // Busca os dados quando o hook é montado
  useEffect(() => {
    carregarEstudos();
  }, [carregarEstudos]);

  // Criar um novo estudo e atualiza a lista localmente (sem fazer novo GET)
  const criarEstudo = useCallback(async (dados: NovoEstudo): Promise<void> => {
    const novoEstudo = await estudosService.criar(dados);
    setEstudos((prev) => [...prev, novoEstudo]);
  }, []);

  // Atualizar estudo e reflete a mudança imediatamente na interface
  const atualizarEstudo = useCallback(async (
    id: string,
    dados: AtualizarEstudo
  ): Promise<void> => {
    const atualizado = await estudosService.atualizar(id, dados);
    setEstudos((prev) =>
      prev.map((e) => (e.id === id ? atualizado : e))
    );
  }, []);

  // Deletar estudo e remove da lista local imediatamente
  const deletarEstudo = useCallback(async (id: string): Promise<void> => {
    await estudosService.deletar(id);
    setEstudos((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return {
    estudos,
    carregando,
    erro,
    criarEstudo,
    atualizarEstudo,
    deletarEstudo,
    recarregar: carregarEstudos,
  };
}
