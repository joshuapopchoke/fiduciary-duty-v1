export type Role = "employee" | "manager";

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  passwordSalt: string;
  twoFactorSecret: string | null;
  displayName: string;
  role: Role;
  mustChangePassword: boolean;
  createdAt: number;
  failedLoginCount: number;
  lockoutUntil: number | null;
}

export interface AuthSession {
  userId: string;
  username: string;
  displayName: string;
  role: Role;
  authenticatedAt: number;
  mustChangePassword: boolean;
  requiresTwoFactor: boolean;
  twoFactorVerified: boolean;
}

export interface ManagerDashboardState {
  newEmployeeName: string;
  newEmployeeUsername: string;
  newEmployeePassword: string;
  selectedEmployeeId: string;
  selectedModuleId: string;
  selectedModuleDifficulty: import("./gameState").PlayDifficulty;
  selectedJurisdictionCode: string;
  assignmentDueDate: string;
  passwordChangeCurrent: string;
  passwordChangeNext: string;
  passwordChangeConfirm: string;
  error: string | null;
}

export interface AuthResult {
  session: AuthSession | null;
  users: User[];
  error: string | null;
}
