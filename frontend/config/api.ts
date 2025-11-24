// Em produção, usa caminhos relativos que serão resolvidos pelo proxy do servidor
// Em desenvolvimento, o Vite proxy redireciona /api para o backend
const URL_BASE_API = import.meta.env.VITE_API_URL || '';

export const ENDPOINTS = {
  auth: {
    login: `${URL_BASE_API}/users/login`,
    registrar: `${URL_BASE_API}/users/register`,
  },
  usuarios: {
    buscarPorId: (id: string) => `${URL_BASE_API}/users/${id}`,
    atualizar: `${URL_BASE_API}/users`,
    deletar: `${URL_BASE_API}/users`,
  },
  progresso: {
    criar: `${URL_BASE_API}/progress`,
    buscarPorUsuario: (userId: string) => `${URL_BASE_API}/progress/user/${userId}`,
    atualizar: (id: string) => `${URL_BASE_API}/progress/${id}`,
    deletar: (id: string) => `${URL_BASE_API}/progress/${id}`,
  },
  teste: {
    hello: `${URL_BASE_API}/test/hello`,
  },
};

export const CONFIGURACAO_API = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
