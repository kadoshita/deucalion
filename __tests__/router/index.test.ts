import { slackMessageGenerator } from '../../src/generator';
import { AlertManagerWebhookRequest, PrometheusMessage } from '../../src/message';
import * as router from '../../src/router';

describe('router', () => {
    let slackMessageGeneratorMock: jest.SpyInstance;

    beforeEach(() => {
        slackMessageGeneratorMock = jest.spyOn(slackMessageGenerator, 'handle');
    });
    afterEach(() => {
        slackMessageGeneratorMock.mockRestore();
    });

    test('call slack message generator when passed prometheus message', async () => {
        const dummyData: AlertManagerWebhookRequest = {
            version: '4',
            groupKey: '',
            truncatedAlerts: 100,
            status: 'firing',
            receiver: 'webhook',
            groupLabels: {},
            commonLabels: {
                alertname: 'dummy',
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
                        title: 'dummy',
                        description: 'sample message'
                    },
                    startsAt: (new Date()).toISOString(),
                    endsAt: '',
                    generatorURL: 'example.com',
                    fingerprint: ''
                }
            ]
        };
        const dummyPrometheusMessage: PrometheusMessage = new PrometheusMessage(dummyData);
        await router.handler(dummyPrometheusMessage);

        expect(slackMessageGeneratorMock).toHaveBeenCalled();
        expect(slackMessageGeneratorMock.mock.calls.length).toBe(1);
    });
});