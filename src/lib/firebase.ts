import { getApp, getApps, initializeApp } from "firebase/app";
import { getDataConnect } from "firebase/data-connect";
import { ENV } from "varlock/env";
import { connectorConfig } from "#/dataconnect-generated";

const requiredEnvVars = [
	"VITE_FIREBASE_API_KEY",
	"VITE_FIREBASE_AUTH_DOMAIN",
	"VITE_FIREBASE_PROJECT_ID",
	"VITE_FIREBASE_APP_ID",
] as const;

const getEnvVar = (key: keyof typeof ENV) => {
	return ENV[key] || (import.meta.env[key] as string);
};

for (const key of requiredEnvVars) {
	if (!getEnvVar(key)) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
}

const firebaseConfig = {
	apiKey: getEnvVar("VITE_FIREBASE_API_KEY"),
	authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN"),
	projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID"),
	appId: getEnvVar("VITE_FIREBASE_APP_ID"),
};

export const firebaseApp = !getApps().length
	? initializeApp(firebaseConfig)
	: getApp();

export const dataConnect = getDataConnect(firebaseApp, connectorConfig);
