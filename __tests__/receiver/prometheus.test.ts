import fastify, { FastifyInstance } from 'fastify';
import { AlertManagerWebhookRequest } from '../../src/message/prometheus';
import * as router from '../../src/router';
import { receiver } from '../../src/receiver';

describe('prometheus receiver', () => {
    let server: FastifyInstance;
    let routerMock: jest.SpyInstance;

    beforeAll(() => {
        server = fastify();
        server.register(receiver, { prefix: '/api/receiver' });
        routerMock = jest.spyOn(router, 'handler');
    });
    afterAll(async () => {
        await server.close();
        routerMock.mockRestore();
    });


    test('post alert data', async () => {
        const dummyData: AlertManagerWebhookRequest = {
            receiver: 'webhook',
            status: 'resolved',
            alerts: [
                {
                    status: 'resolved',
                    labels: {
                        alertname: 'HighCPUUsage',
                        instance: '172.16.0.10:9100',
                        job: 'node',
                        severity: 'warning'
                    },
                    annotations: {
                        description: '172.16.0.10:9100 has been high cpu usage for more than 5 minutes.',
                        grafana_pannel_id: '4',
                        grafana_url: 'https://grafana.sublimer.me/render/d-solo/dz-DVsM7k/host-info?orgId=1',
                        query: 'sum(avg(rate(node_cpu_seconds_total{mode!="idle",instance="172.16.0.10:9100"}[1m])) without (cpu)) by (instance) * 100',
                        title: 'Instance 172.16.0.10:9100 High CPU usage',
                        value: '13.45'
                    },
                    startsAt: '2021-08-26T21:53:00+09:00',
                    endsAt: '2021-08-26T21:54:00+09:00',
                    generatorURL: 'https://example.com',
                    fingerprint: '99a501b167b52194'
                }
            ],
            groupLabels: {
                alertname: 'HighCPUUsage',
                instance: '172.16.0.10:9100'
            },
            commonLabels: {
                alertname: 'HighCPUUsage',
                instance: '172.16.0.10:9100',
                job: 'node',
                severity: 'warning'
            },
            commonAnnotations: {
                description: '172.16.0.10:9100 has been high cpu usage for more than 5 minutes.',
                grafana_pannel_id: '4',
                grafana_url: 'https://grafana.sublimer.me/render/d-solo/dz-DVsM7k/host-info?orgId=1',
                query: 'sum(avg(rate(node_cpu_seconds_total{mode!="idle",instance="172.16.0.10:9100"}[1m])) without (cpu)) by (instance) * 100',
                title: 'Instance 172.16.0.10:9100 High CPU usage',
                value: '13.45'
            },
            externalURL: 'http://172.16.0.10:9093',
            version: '4',
            groupKey: '{}:{alertname="HighCPUUsage", instance="172.16.0.10:9100"}',
            truncatedAlerts: 0
        };
        const res = await server.inject({
            method: 'POST',
            url: '/api/receiver/prometheus',
            payload: dummyData
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('OK');
        expect(routerMock).toHaveBeenCalled();
    }, 10000);

    test('post invalid alert data', async () => {
        const dummyData = {
            version: 4,
            status: 'unknown'
        };
        const res = await server.inject({
            method: 'POST',
            url: '/api/receiver/prometheus',
            payload: dummyData
        });

        expect(res.statusCode).toBe(200);
    });
});