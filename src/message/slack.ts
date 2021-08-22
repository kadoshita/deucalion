import { randomUUID } from 'crypto';
import { Message, MessageType } from './messageInterface';

export type SlackAttachmentColor = '#BE281B' | '#D1A14D' | '#439FE0' | '#359C4C';
export interface SlackMessageAttachment {
    color: SlackAttachmentColor;
    blocks: (Title | Section | Image | Divider)[];
}

type Title = {
    type: 'header';
    text: PlainText;
};
type Section = {
    type: 'section',
    text?: PlainText | MarkdonwText;
    fields?: PlainText[];
};
type Image = {
    type: 'image',
    title: PlainText,
    image_url: string;
    alt_text: string;
};
type Divider = {
    type: 'divider';
};

interface PlainText {
    type: 'plain_text';
    text: string;
    emoji: boolean;
}

interface MarkdonwText {
    type: 'mrkdwn';
    text: string;
}


export class SlackMessage implements Message {
    readonly id: string;
    readonly type: MessageType;

    constructor(readonly attachments: SlackMessageAttachment[]) {
        this.id = randomUUID();
        this.type = 'slack';
    }
}