import { Block, MessageAttachment } from '@slack/types';
import { randomUUID } from 'crypto';
import { Message, MessageType } from './messageInterface';

export type SlackAttachmentColor = '#BE281B' | '#D1A14D' | '#439FE0' | '#359C4C';
export class SlackMessage implements Message {
    readonly id: string;
    readonly type: MessageType;

    constructor(readonly attachments?: MessageAttachment[], readonly blocks?: Block[]) {
        this.id = randomUUID();
        this.type = 'slack';
    }
}