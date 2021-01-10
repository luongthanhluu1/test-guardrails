export enum Role {
  MEMBER = "member",
  ADMIN = "admin",
}

export interface User {
  username: string;
  password?: string;
  repassword?: string;
  _id?: string;
  id?: string;
  role?: string;
}
export const RoleOptions: Role[] = [Role.MEMBER, Role.ADMIN];
