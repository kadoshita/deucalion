import { MessageAttachment, WebClient } from '@slack/web-api';
import { SLACK_API_TOKEN, SLACK_POST_CHANNEL_ID } from '../config';
import { SlackMessage } from '../message/slack';

const client = new WebClient(SLACK_API_TOKEN);

export const send = async (message: SlackMessage): Promise<void> => {
    await client.chat.postMessage({
        channel: SLACK_POST_CHANNEL_ID,
        attachments: (message.message as MessageAttachment[])
    });
};