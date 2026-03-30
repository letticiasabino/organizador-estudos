// ============================================
// Configuração base do Axios
// Aqui centralizamos a URL da API e configurações globais
// ============================================

import axios from 'axios';

// URL base da API (json-server rodando na porta 3001)
const BASE_URL = 'http://localhost:3001';

// Criamos uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Timeout de 8 segundos para detectar quando a API está offline
  timeout: 8000,
});

// Interceptor de resposta para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se não tem resposta, provavelmente é timeout ou API offline
    if (!error.response) {
      throw new Error('API offline. Verifique se o json-server está rodando na porta 3001.');
    }
    throw error;
  }
);

export default api;
