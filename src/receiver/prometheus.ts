/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';

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

export const prometheus: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.send('OK');
};