import { MessageAttachment } from '@slack/types';
import { randomUUID } from 'crypto';
import { Message, MessageType } from './messageInterface';

export type SlackAttachmentColor = '#BE281B' | '#D1A14D' | '#439FE0' | '#359C4C';
export interface SlackMessageAttachment {
    color: SlackAttachmentColor;
    blocks: MessageAttachment;
}

export class SlackMessage implements Message {
    readonly id: string;
    readonly type: MessageType;
    readonly message: SlackMessageAttachment[];

    constructor(color: SlackAttachmentColor, blocks: MessageAttachment) {
        this.id = randomUUID();
        this.type = 'slack';
        this.message = [{
            color,
            blocks
        }];
    }
}