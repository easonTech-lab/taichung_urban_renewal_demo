export const appEnv = import.meta.env.VITE_APP_ENV ?? "dev";

export const appVersion = import.meta.env.VITE_APP_VERSION ?? "0.0.1";

export const appVersionLabel = `${appEnv.toUpperCase()} ${appVersion}`;
