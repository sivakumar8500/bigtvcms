import { RolePermissionPolicy } from '../permission-policy';

describe('RolePermissionPolicy', () => {
  const permissions = ['news:create', 'news:edit', 'news:delete', 'categories:view'];
  let policy: RolePermissionPolicy;

  beforeEach(() => {
    policy = new RolePermissionPolicy(permissions);
  });

  describe('hasPermission', () => {
    it('should return true for an existing permission', () => {
      expect(policy.hasPermission('news:create')).toBe(true);
    });

    it('should return false for a non-existing permission', () => {
      expect(policy.hasPermission('settings:admin')).toBe(false);
    });

    it('should be case-sensitive', () => {
      expect(policy.hasPermission('News:Create')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when at least one permission is present', () => {
      expect(policy.hasAnyPermission(['news:create', 'settings:admin'])).toBe(true);
    });

    it('should return false when none of the permissions are present', () => {
      expect(policy.hasAnyPermission(['settings:admin', 'users:view'])).toBe(false);
    });

    it('should return false for an empty permissions array', () => {
      expect(policy.hasAnyPermission([])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when all permissions are present', () => {
      expect(policy.hasAllPermissions(['news:create', 'news:edit'])).toBe(true);
    });

    it('should return false when one permission is missing', () => {
      expect(policy.hasAllPermissions(['news:create', 'settings:admin'])).toBe(false);
    });

    it('should return true for an empty permissions array', () => {
      expect(policy.hasAllPermissions([])).toBe(true);
    });
  });

  describe('empty permissions user', () => {
    let emptyPolicy: RolePermissionPolicy;

    beforeEach(() => {
      emptyPolicy = new RolePermissionPolicy([]);
    });

    it('should return false for hasPermission', () => {
      expect(emptyPolicy.hasPermission('news:create')).toBe(false);
    });

    it('should return false for hasAnyPermission', () => {
      expect(emptyPolicy.hasAnyPermission(['news:create'])).toBe(false);
    });

    it('should return true for hasAllPermissions with empty list', () => {
      expect(emptyPolicy.hasAllPermissions([])).toBe(true);
    });
  });
});
