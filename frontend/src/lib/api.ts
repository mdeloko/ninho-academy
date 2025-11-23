import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Controle de inicialização da autenticação
let isInitializing = true;
let authInitialized = false;

// Função para marcar como inicializado (chamada pelo AuthContext)
export const markAuthAsInitialized = () => {
  authInitialized = true;
  isInitializing = false;
};

// Função para verificar se está inicializando
export const isAuthInitializing = () => isInitializing;

api.interceptors.request.use(async (config) => {
  // Aguarda inicialização se ainda estiver carregando
  if (isInitializing && !authInitialized) {
    // Espera no máximo 2 segundos pela inicialização
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (authInitialized || !isInitializing) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 50);

      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(true);
      }, 2000);
    });
  }

  let token = localStorage.getItem("token");
  if (token) {
    // Remove aspas extras se existirem (artefato de JSON.stringify incorreto)
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag para prevenir múltiplos redirects simultâneos
let isHandling401 = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      // Previne loop infinito de redirects
      if (isHandling401) {
        return Promise.reject(error);
      }

      // Se for a primeira tentativa e ainda está inicializando, aguarda
      if (!originalRequest._retry && isAuthInitializing()) {
        originalRequest._retry = true;

        // Aguarda 500ms e tenta novamente
        await new Promise(resolve => setTimeout(resolve, 500));
        return api(originalRequest);
      }

      // Se já tentou novamente ou não está mais inicializando, limpa sessão
      if (!originalRequest._isAuthRetry) {
        isHandling401 = true;

        // Limpa storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redireciona apenas se não estiver já na página de login
        if (window.location.pathname !== '/') {
          window.location.href = "/";
        }

        setTimeout(() => {
          isHandling401 = false;
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);
