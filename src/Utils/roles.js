export const ROLES = {
  1: "Super Administrador",
  2: "Administrador",
  3: "Limitado",
  4: "Consultor",
};

// Obtener nombre del rol
export const getRolNombre = (role_id) => {
  return ROLES[Number(role_id)] || "Sin rol";
};

// Validar si tiene un rol específico
export const isRol = (role_id, rolesPermitidos = []) => {
  return rolesPermitidos.includes(Number(role_id));
};

export const tienePermisoMenu = (role_id, permiso) => {
  return PERMISOS_POR_ROL_MENU[Number(role_id)]?.includes(permiso);
};

const PERMISOS_POR_ROL_MENU = {
  1: [1, 2, 3, 4, 5, 6, 7], // SUPER_ADMIN
  2: [1, 2, 3, 7], // ADMINISTRADOR
  3: [1, 3], //
  4: [1, 2, 3], //
};
