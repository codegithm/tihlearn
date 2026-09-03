import { environment as dev } from "./dev";
import { environment as sit } from "./sit";
import { environment as uat } from "./uat";
import { environment as prod } from "./prod";

const environments = { dev, sit, uat, prod } as const;
type EnvironmentName = keyof typeof environments;

const mode = import.meta.env.MODE;
const environmentName: EnvironmentName =
  mode === "development"
    ? "dev"
    : mode === "production"
      ? "prod"
      : mode in environments
        ? (mode as EnvironmentName)
        : "dev";

export const environment = environments[environmentName];
