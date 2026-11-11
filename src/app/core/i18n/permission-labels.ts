/** Tradução das chaves de permissão (banco) para rótulos de UI. */
const LABELS: Record<string, string> = {
  "dashboard.sidebar": "Menu Painel",
  "dashboard.view": "Ver painel",
  "dashboard.cards": "Ver cards do painel",
  "users.sidebar": "Menu Usuários",
  "users.view": "Listar usuários",
  "users.show": "Ver usuário",
  "users.create": "Criar usuário",
  "users.update": "Editar usuário",
  "users.delete": "Excluir usuário",
  "roles.sidebar": "Menu Perfis",
  "roles.view": "Listar perfis",
  "roles.show": "Ver perfil",
  "roles.create": "Criar perfil",
  "roles.update": "Editar perfil",
  "roles.delete": "Excluir perfil",
  "audit.sidebar": "Menu Auditoria",
  "audit.view": "Ver auditoria",
};

const PROFILE_LABELS: Record<string, string> = {
  admin: "Administrador",
  user: "Usuário",
};

export function permissionLabel(name: string): string {
  return LABELS[name] ?? name;
}

export function profileLabel(name: string): string {
  return PROFILE_LABELS[name] ?? name;
}

export function permissionGroup(name: string): string {
  const prefix = name.split(".")[0] ?? name;
  const groups: Record<string, string> = {
    dashboard: "Painel",
    users: "Usuários",
    roles: "Perfis",
    audit: "Auditoria",
  };
  return groups[prefix] ?? prefix;
}
