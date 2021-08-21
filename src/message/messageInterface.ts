export type MessageType = 'prometheus' | 'unknown';

export interface Message {
    readonly id: string;
    readonly type: MessageType;
}