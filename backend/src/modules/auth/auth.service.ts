import { db } from '../../infrastructure/database';
import { z } from 'zod';
import { LoginSchema, RegisterSchema } from './auth.schema';
import { ErroCredenciaisInvalidas, ErroEmailJaExiste } from '../../utils/erros';
import { gerarToken } from '../../utils/jwt';

type CredenciaisLogin = z.infer<typeof LoginSchema>;
type DadosRegistro = z.infer<typeof RegisterSchema>;

const mapearUsuarioParaResposta = (usuario: any) => {
  const { progresso, ...dados } = usuario;

  return {
    id: dados.id,
    nome: dados.nome,
    email: dados.email,
    xp: dados.xp,
    temESP32: dados.temEsp32,
    sincronizado: dados.sincronizado,
    sequenciaDias: dados.sequenciaDias || 0,
    trilhaId: dados.trilhaId,
    licoesConcluidas: (progresso || []).map((p: any) => p.licaoId),
  };
};

const autenticar = async (credenciais: CredenciaisLogin) => {
  const usuario = await db.usuario.findUnique({
    where: { email: credenciais.email },
    include: {
      progresso: { select: { licaoId: true } },
    },
  });

  if (!usuario) {
    throw new ErroCredenciaisInvalidas();
  }

  const senhaValida = usuario.senha === credenciais.password;

  if (!senhaValida) {
    throw new ErroCredenciaisInvalidas();
  }

  return {
    usuario: mapearUsuarioParaResposta(usuario),
    token: gerarToken(usuario.id),
  };
};

const registrar = async (dados: DadosRegistro) => {
  const usuarioExistente = await db.usuario.findUnique({
    where: { email: dados.email },
  });

  if (usuarioExistente) {
    throw new ErroEmailJaExiste();
  }

  const novoUsuario = await db.usuario.create({
    data: {
      nome: dados.name,
      email: dados.email,
      senha: dados.password,
      temEsp32: false,
      sincronizado: false,
      xp: 0,
    },
  });

  return {
    usuario: {
      ...mapearUsuarioParaResposta(novoUsuario),
      licoesConcluidas: [],
    },
    token: gerarToken(novoUsuario.id),
  };
};

export const authService = {
  autenticar,
  registrar,
};
