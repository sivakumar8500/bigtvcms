export interface PermissionPolicy {
  hasPermission(permission: string): boolean;
  hasAnyPermission(permissions: string[]): boolean;
  hasAllPermissions(permissions: string[]): boolean;
}

export class RolePermissionPolicy implements PermissionPolicy {
  constructor(private userPermissions: string[]) {}

  public hasPermission(permission: string): boolean {
    return this.userPermissions.includes(permission);
  }

  public hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  public hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }
}
