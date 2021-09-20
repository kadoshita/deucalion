import { WebClient } from '@slack/web-api';
import { SLACK_API_TOKEN, SLACK_POST_CHANNEL_ID } from '../config';
import { SlackMessage } from '../message/slack';

const client = new WebClient(SLACK_API_TOKEN);

export const send = async (messages: SlackMessage[]): Promise<void> => {
    for (const message of messages) {
        await client.chat.postMessage({
            channel: SLACK_POST_CHANNEL_ID,
            attachments: message.attachments,
            blocks: message.blocks
        });
    }
};