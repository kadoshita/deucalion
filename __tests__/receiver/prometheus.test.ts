import fastify, { FastifyInstance } from 'fastify';
import { AlertManagerWebhookRequest } from '../../src/message/prometheus';
import { receiver } from '../../src/receiver';

describe('prometheus receiver', () => {
    let server: FastifyInstance;

    beforeAll(() => {
        server = fastify();
        server.register(receiver, { prefix: '/api/receiver' });
    });
    afterAll(async () => {
        await server.close();
    });


    test('post alert data', async () => {
        const dummyData: AlertManagerWebhookRequest = {
            receiver: 'webhook',
            status: 'firing',
            alerts: [
                {
                    status: 'firing',
                    labels: {
                        alertname: 'InstanceDown',
                        instance: '172.16.0.10:9100',
                        job: 'node',
                        severity: 'critical'
                    },
                    annotations: {
                        description: 'Instance Down',
                        grafana_pannel_id: '18',
                        grafana_url: 'https://grafana.sublimer.me/render/d-solo/dz-DVsM7k/host-info?orgId=1',
                        query: 'up{job="node"} == 0',
                        title: 'InstanceDown',
                        value: '13.45'
                    },
                    startsAt: '2021-08-23T15:56:05+09:00',
                    endsAt: '0001-01-01T00:00:00Z',
                    generatorURL: 'https://example.com',
                    fingerprint: '6bbfb5208e9543d7'
                }
            ],
            groupLabels: { alertname: 'InstanceDown', instance: '172.16.0.10:9100' },
            commonLabels: {
                alertname: 'InstanceDown',
                instance: '172.16.0.10:9100',
                job: 'node',
                severity: 'critical'
            },
            commonAnnotations: {
                description: 'Instance Down',
                grafana_pannel_id: '18',
                grafana_url: 'https://grafana.sublimer.me/render/d-solo/dz-DVsM7k/host-info?orgId=1',
                query: 'up{job="node"} == 0',
                title: 'InstanceDown',
                value: '13.45'
            },
            externalURL: 'http://172.16.0.10:9093',
            version: '4',
            groupKey: '{}:{alertname="InstanceDown", instance="172.16.0.10:9100"}',
            truncatedAlerts: 0
        };
        const res = await server.inject({
            method: 'POST',
            url: '/api/receiver/prometheus',
            payload: dummyData
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('OK');
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

        expect(res.statusCode).toBe(400);
    });
});