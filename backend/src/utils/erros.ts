export class ErroBase extends Error {
  constructor(
    public mensagem: string,
    public codigoHttp: number = 500,
    public codigo?: string
  ) {
    super(mensagem);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErroAutenticacao extends ErroBase {
  constructor(mensagem: string = 'Falha na autenticação') {
    super(mensagem, 401, 'ERRO_AUTENTICACAO');
  }
}

export class ErroCredenciaisInvalidas extends ErroAutenticacao {
  constructor(mensagem: string = 'Email ou senha inválidos. Verifique seus dados e tente novamente.') {
    super(mensagem);
    this.codigo = 'CREDENCIAIS_INVALIDAS';
  }
}

export class ErroEmailJaExiste extends ErroBase {
  constructor(mensagem: string = 'Este email já está cadastrado. Tente fazer login ou use outro email.') {
    super(mensagem, 409, 'EMAIL_JA_EXISTE');
  }
}

export class ErroNaoEncontrado extends ErroBase {
  constructor(recurso: string = 'Recurso') {
    super(`${recurso} não encontrado.`, 404, 'NAO_ENCONTRADO');
  }
}

export class ErroValidacao extends ErroBase {
  constructor(mensagem: string, public campos?: Record<string, string>) {
    super(mensagem, 400, 'ERRO_VALIDACAO');
  }
}

export class ErroInterno extends ErroBase {
  constructor(mensagem: string = 'Erro interno do servidor. Tente novamente mais tarde.') {
    super(mensagem, 500, 'ERRO_INTERNO');
  }
}
