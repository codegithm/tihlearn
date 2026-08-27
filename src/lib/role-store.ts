import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoleState = {
  currentRole: "employee" | "manager";
  isAuthenticated: boolean;
  azureProfile: {
    name?: string;
    email?: string;
    id?: string;
  } | null;
  setRole: (role: "employee" | "manager") => void;
  setAuthenticated: (auth: boolean) => void;
  setAzureProfile: (profile: RoleState["azureProfile"]) => void;
};

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      currentRole: "employee",
      isAuthenticated: false,
      azureProfile: null,
      setRole: (role) => set({ currentRole: role }),
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setAzureProfile: (profile) => set({ azureProfile: profile }),
    }),
    {
      name: "role-storage",
    },
  ),
);

export const useRole = (): ["employee" | "manager", (role: "employee" | "manager") => void] => {
  const role = useRoleStore((state) => state.currentRole);
  const setRole = useRoleStore((state) => state.setRole);
  return [role, setRole];
};

export const isAuthed = () => useRoleStore.getState().isAuthenticated;
export const useAzureProfile = () => useRoleStore((state) => state.azureProfile);

export const signOut = () => {
  useRoleStore.getState().setAuthenticated(false);
  useRoleStore.getState().setAzureProfile(null);
  useRoleStore.getState().setRole("employee");
};