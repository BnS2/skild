import { getDataConnect } from "@firebase/data-connect";
import { getApp, getApps, initializeApp } from "firebase/app";
import { ENV } from "varlock/env";
import { connectorConfig } from "#/dataconnect-generated";

const firebaseConfig = {
	apiKey: ENV.FIREBASE_API_KEY,
	authDomain: ENV.FIREBASE_AUTH_DOMAIN,
	projectId: ENV.FIREBASE_PROJECT_ID,
	appId: ENV.FIREBASE_APP_ID,
};

export const firebaseApp = !getApps().length
	? initializeApp(firebaseConfig)
	: getApp();

export const dataConnect = getDataConnect(firebaseApp, connectorConfig);
