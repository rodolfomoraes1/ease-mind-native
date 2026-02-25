export function formatAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Email ou senha inválidos',
    'auth/invalid-credential': 'Email ou senha inválidos',
    'auth/invalid-email': 'Email inválido',
    'auth/email-already-in-use': 'Este email já está cadastrado',
    'auth/weak-password': 'Senha fraca (mínimo 6 caracteres)',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
  };
  return map[code] ?? 'Ocorreu um erro. Tente novamente';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
