import dotenv from 'dotenv';

dotenv.config();

export const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN || '';
export const SLACK_POST_CHANNEL_ID = process.env.SLACK_POST_CHANNEL_ID || '';
export const S3_ENDPOINT_URL = process.env.S3_ENDPOINT_URL || '';