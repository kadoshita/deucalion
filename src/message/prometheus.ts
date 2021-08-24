/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomUUID } from 'crypto';
import { Message, MessageType } from './messageInterface';

export type AlertManagerStatus = 'resolved' | 'firing';

export interface AlertManagerWebhookRequest {
    version: string;
    groupKey: string;
    truncatedAlerts: number;
    status: AlertManagerStatus;
    receiver: string;
    groupLabels: any;
    commonLabels: {
        alertname: string;
        instance: string;
        [key: string]: any;
    };
    commonAnnotations: any;
    externalURL: string;
    alerts: AlertsEntity[];
}
export interface AlertsEntity {
    status: AlertManagerStatus;
    labels: {
        severity: string;
        [key: string]: any;
    };
    annotations: {
        title: string;
        description: string;
        value?: string;
        grafana_url?: string;
        grafana_pannel_id?: string;
        query?: string;
        [key: string]: any;
    };
    startsAt: string;
    endsAt: string;
    generatorURL: string;
    fingerprint: string;
}

export class PrometheusMessage implements Message {
    readonly id: string;
    readonly type: MessageType = 'prometheus';
    readonly message: AlertManagerWebhookRequest;
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
        else if (!(msg.alerts && msg.alerts.length > 0 && msg.alerts[0].status && msg.alerts[0].labels && msg.alerts[0].annotations)) return false;
        else return true;
    }
}