# TIH Learn

## Microsoft Entra ID setup

Set the Azure Application (client) ID and Directory (tenant) ID or verified tenant domain
in the matching file under `environment/`: `dev.ts`, `sit.ts`, `uat.ts`, or `prod.ts`.
Vite selects `dev` for the normal development server, `prod` for a normal production
build, and the matching file when the Vite mode is `sit`, `uat`, or `prod`. Use
`npm run dev:sit`, `npm run dev:uat`, or `npm run dev:prod` for the corresponding local mode.

Configure the app registration as a single-page application with the local development
redirect URI `http://localhost:5173`. Grant delegated Microsoft Graph permissions for
`User.Read` and `User.ReadBasic.All`, then grant admin consent if the tenant requires it.

At sign-in, the app reads `/me` and `/me/directReports`. A user with one or more direct
reports is treated as a manager, and the manager workspace displays those Graph directory
users rather than the demo employee list.
