// Em produção, usa caminhos relativos que serão resolvidos pelo proxy do servidor
// Em desenvolvimento, o Vite proxy redireciona /api para o backend
const URL_BASE_API = import.meta.env.VITE_API_URL || '';

export const ENDPOINTS = {
  auth: {
    login: `${URL_BASE_API}/api/auth/login`,
    registrar: `${URL_BASE_API}/api/auth/register`,
  },
  usuarios: {
    buscarPorId: (id: string) => `${URL_BASE_API}/api/users/${id}`,
    atualizarStatusESP32: (id: string) => `${URL_BASE_API}/api/users/${id}/esp32-status`,
    marcarComoSincronizado: (id: string) => `${URL_BASE_API}/api/users/${id}/mark-synced`,
  },
  curso: {
    buscarMapa: (usuarioId: string, trilhaId: string) =>
      `${URL_BASE_API}/api/course/map?userId=${usuarioId}&trackId=${trilhaId}`,
  },
  progresso: {
    completarLicao: `${URL_BASE_API}/api/progress/complete-lesson`,
  },
  telemetria: {
    verificarSessao: `${URL_BASE_API}/api/telemetry/verify-session`,
  },
  saude: `${URL_BASE_API}/health`,
};

export const CONFIGURACAO_API = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
