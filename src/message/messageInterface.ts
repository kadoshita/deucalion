export type MessageType = 'prometheus' | 'slack' | 'unknown';

export interface Message {
    readonly id: string;
    readonly type: MessageType;
}