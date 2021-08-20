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
            version: '4',
            groupKey: '',
            truncatedAlerts: 100,
            status: 'firing',
            receiver: 'webhook',
            groupLabels: {},
            commonLabels: {
                instance: 'localhost:9000'
            },
            commonAnnotations: {
                title: 'dummy alert'
            },
            externalURL: 'example.com',
            alerts: [
                {
                    status: 'firing',
                    labels: {
                        severity: 'critical'
                    },
                    annotations: {
                        title: 'dummy'
                    },
                    startsAt: (new Date()).toISOString(),
                    endsAt: '',
                    generatorURL: 'example.com',
                    fingerprint: ''
                }
            ]
        };
        const res = await server.inject({
            method: 'POST',
            url: '/api/receiver/prometheus',
            payload: dummyData
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('OK');
    });

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