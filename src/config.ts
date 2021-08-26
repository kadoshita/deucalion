import dotenv from 'dotenv';

dotenv.config();

export const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN || '';
export const SLACK_POST_CHANNEL_ID = process.env.SLACK_POST_CHANNEL_ID || '';
export const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY || '';
export const PROMETHEUS_ENDPOINT = process.env.PROMETHEUS_ENDPOINT || '';
export const OCI_ACCESS_KEY = process.env.OCI_ACCESS_KEY || '';
export const OCI_SECRET_KEY = process.env.OCI_SECRET_KEY || '';
export const OCI_OBJECT_STORAGE_URL = process.env.OCI_OBJECT_STORAGE_URL || '';
export const OCI_OBJECT_STORAGE_REGION = process.env.OCI_OBJECT_STORAGE_REGION || '';
export const OCI_OBJECT_STORAGE_NAMESPACE = process.env.OCI_OBJECT_STORAGE_NAMESPACE || '';
export const OCI_OBJECT_STORAGE_BUCKET = process.env.OCI_OBJECT_STORAGE_BUCKET || '';