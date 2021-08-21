/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message, MessageType } from '.';
import { randomUUID } from 'crypto';

export type AlertManagerStatus = 'resolved' | 'firing';

export interface AlertManagerWebhookRequest {
    version: string;
    groupKey: string;
    truncatedAlerts: number;
    status: AlertManagerStatus;
    receiver: string;
    groupLabels: any;
    commonLabels: any;
    commonAnnotations: any;
    externalURL: string;
    alerts: AlertsEntity[];
}
export interface AlertsEntity {
    status: AlertManagerStatus;
    labels: any;
    annotations: any;
    startsAt: string;
    endsAt: string;
    generatorURL: string;
    fingerprint: string;
}

export class PrometheusMessage implements Message {
    readonly id: string;
    readonly type: MessageType = 'prometheus';
    readonly message: AlertManagerWebhookRequest;
    constructor(private readonly rawMessage: any) {
        this.id = randomUUID();
        if (this.isValidMessage(rawMessage)) {
            this.message = rawMessage;
        } else {
            throw new Error('message is not AlertManagerWebhookRequest');
        }
    }

    private isValidMessage(msg: any): msg is AlertManagerWebhookRequest {
        if (!(msg.version && typeof msg.version === 'string')) return false;
        else if (!(msg.status && typeof msg.status === 'string' && ['resolved', 'firing'].includes(msg.status))) return false;
        else return true;
    }
}