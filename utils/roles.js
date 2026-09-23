export const ROLES = Object.freeze({
  ADMIN: 'admin',
  TEAM_LEAD: 'team_lead',
  DEVELOPER: 'developer',
  TESTER: 'tester',
  READER: 'reader',
});

export const ASSIGNABLE_TASK_ROLES = Object.freeze([ROLES.DEVELOPER, ROLES.TESTER]);

export const ADMIN_CREATABLE_ROLES = Object.freeze([
  ROLES.TEAM_LEAD,
  ROLES.DEVELOPER,
  ROLES.TESTER,
  ROLES.READER,
]);
