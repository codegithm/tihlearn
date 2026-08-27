import { useRoleStore } from "./role-store";
import { getEmployee, isManagerUser } from "./mock-data";

export const CLIENT_ID = "12345678-1234-5678-1234-567812345678";
export const TENANT = "tihinsurance.onmicrosoft.com";

export const tenantAccounts = [
  {
    oid: "emp-001",
    name: "Sarah Johnson",
    username: "sarah.johnson@tihinsurance.com",
  },
  {
    oid: "emp-002",
    name: "Michael Chen",
    username: "michael.chen@tihinsurance.com",
  },
  {
    oid: "mgr-001",
    name: "Emily Rodriguez",
    username: "emily.rodriguez@tihinsurance.com",
  },
];

export async function loginPopup(oid: string): Promise<void> {
  // Simulate Azure AD login delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const employee = getEmployee(oid);
  if (!employee) {
    throw new Error("User not found in directory");
  }

  const account = tenantAccounts.find((a) => a.oid === oid);
  if (!account) {
    throw new Error("Account not found");
  }

  // Set authentication state
  const { setAuthenticated, setAzureProfile, setRole } = useRoleStore.getState();
  setAuthenticated(true);
  setAzureProfile({
    name: account.name,
    email: account.username,
    id: oid,
  });

  // Set role based on whether user is a manager
  const role = isManagerUser(oid) ? "manager" : "employee";
  setRole(role);
}
