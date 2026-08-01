const ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
});

const SHARE_PERMISSIONS = Object.freeze({
  VIEW: 'view',
  EDIT: 'edit',
});

const ALLOWED_UPLOAD_TYPES = Object.freeze(['.txt', '.md']);

const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
});

module.exports = { ROLES, SHARE_PERMISSIONS, ALLOWED_UPLOAD_TYPES, PAGINATION };
