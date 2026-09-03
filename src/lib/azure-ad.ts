import { PublicClientApplication, type AccountInfo } from "@azure/msal-browser";
import { useRoleStore, type DirectoryEmployee } from "./role-store";
import { environment } from "../../environment";

export const CLIENT_ID = environment.azure.clientId;
export const TENANT = environment.azure.tenantId;
const GRAPH_URL = "https://graph.microsoft.com/v1.0";
const graphScopes = ["User.Read", "User.ReadBasic.All"];

const msal =
  CLIENT_ID && TENANT
    ? new PublicClientApplication({
        auth: {
          clientId: CLIENT_ID,
          authority: `https://login.microsoftonline.com/${TENANT}`,
          redirectUri: window.location.origin,
        },
        cache: { cacheLocation: "sessionStorage" },
      })
    : null;

const avatarColors = ["bg-blue-500", "bg-green-500", "bg-orange-500", "bg-teal-500"];

function mapDirectoryEmployee(user: Record<string, string | null>): DirectoryEmployee {
  const email = user.mail ?? user.userPrincipalName ?? "";
  return {
    id: user.id ?? "",
    name: user.displayName ?? email,
    email,
    role: user.jobTitle ?? "Employee",
    department: user.department ?? "Unassigned",
    avatarColor: avatarColors[(user.displayName?.length ?? 0) % avatarColors.length],
    managerId: null,
    upn: user.userPrincipalName ?? email,
    adGroups: [],
  };
}

async function graphGet<T>(accessToken: string, path: string): Promise<T> {
  const response = await fetch(`${GRAPH_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`Microsoft Graph request failed (${response.status})`);
  return response.json() as Promise<T>;
}

async function getAllDirectReports(accessToken: string): Promise<DirectoryEmployee[]> {
  const reports: DirectoryEmployee[] = [];
  let nextUrl: string | undefined =
    "/me/directReports?$select=id,displayName,mail,userPrincipalName,jobTitle,department";
  while (nextUrl) {
    const page: { value: Record<string, string | null>[]; "@odata.nextLink"?: string } =
      await graphGet(accessToken, nextUrl.replace(GRAPH_URL, ""));
    reports.push(...page.value.map(mapDirectoryEmployee));
    nextUrl = page["@odata.nextLink"];
  }
  return reports;
}

export async function loginPopup(): Promise<void> {
  if (!msal) {
    throw new Error(
      "Azure sign-in is not configured. Set VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID.",
    );
  }

  await msal.initialize();
  const result = await msal.loginPopup({ scopes: graphScopes });
  const account: AccountInfo | null = result.account;
  if (!account) throw new Error("Microsoft sign-in did not return an account.");

  let token;
  try {
    token = await msal.acquireTokenSilent({ account, scopes: graphScopes });
  } catch {
    token = await msal.acquireTokenPopup({ account, scopes: graphScopes });
  }
  const me = await graphGet<Record<string, string | null>>(
    token.accessToken,
    "/me?$select=id,displayName,mail,userPrincipalName,jobTitle,department",
  );
  const employee = mapDirectoryEmployee(me);
  const directReports = await getAllDirectReports(token.accessToken);

  const { setAuthenticated, setAzureProfile, setRole } = useRoleStore.getState();
  setAuthenticated(true);
  setAzureProfile({
    name: employee.name,
    email: employee.email,
    id: employee.id,
    employee,
    directReports,
    isManager: directReports.length > 0,
  });
  setRole(directReports.length > 0 ? "manager" : "employee");
}
