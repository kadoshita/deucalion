import { AlertManagerWebhookRequest, PrometheusMessage } from '../../src/message';

describe('prometheus message', () => {
    test('create new Prometheus Message', () => {
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
        expect(() => {
            new PrometheusMessage(dummyData);
        }).not.toThrowError();
    });

    test('throws error when invalid AlertManagerWebhookRequest', () => {
        const invalidDummyData = {
            version: 4,
            status: 'unknown'
        };
        expect(() => {
            new PrometheusMessage(invalidDummyData);
        }).toThrowError('message is not AlertManagerWebhookRequest');
    });
});