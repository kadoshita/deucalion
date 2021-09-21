import { MessageAttachment } from '@slack/web-api';
import crypto from 'crypto';
import * as grafana from '../../src/external/grafana';
import { slackMessageGenerator } from '../../src/generator';
import { AlertManagerWebhookRequest, PrometheusMessage } from '../../src/message';
import { SlackMessage } from '../../src/message/slack';

describe('slackMessageGenerator', () => {
    let getGraphImageURLMock: jest.SpyInstance;
    let randomUUIDMock: jest.SpyInstance;

    beforeAll(() => {
        getGraphImageURLMock = jest.spyOn(grafana, 'getGraphImageURL');
        getGraphImageURLMock.mockImplementation(async (params: grafana.GetGraphImageURLParams): Promise<string> => {
            return 'https://example.com';
        });
        randomUUIDMock = jest.spyOn(crypto, 'randomUUID');
        randomUUIDMock.mockImplementation(() => {
            return 'cf049606-c8eb-4c04-bb71-2b80b7b0be7d';
        });
    });

    afterAll(() => {
        getGraphImageURLMock.mockRestore();
        randomUUIDMock.mockRestore();
    });
    test('create slack message attachment from prometheus message', async () => {
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
                        severity: 'critical',
                        instance: 'localhost:9000'
                    },
                    annotations: {
                        title: 'dummy',
                        description: 'sample message',
                        grafana_pannel_id: '0',
                        grafana_url: 'https://example.com',
                        dashboard: 'https://example.com'
                    },
                    startsAt: '2021-08-22T06:12:57.011Z',
                    endsAt: '2021-08-22T06:13:57.011Z',
                    generatorURL: 'example.com',
                    fingerprint: ''
                }
            ]
        };
        const dummyPrometheusMessage: PrometheusMessage = new PrometheusMessage(dummyData);

        const attachments: MessageAttachment[] = [{
            color: '#BE281B',
            fallback: 'alert message',
            text: dummyData.alerts[0].annotations.description,
            fields: [
                { title: 'severity', value: dummyData.alerts[0].labels.severity, short: false },
                { title: 'current_value', value: '', short: false },
                { title: 'start_at', value: '2021/8/22 15:12:57', short: true },
                { title: 'end_at', value: '2021/8/22 15:13:57', short: true }
            ]
        }, {
            color: '#BE281B',
            fallback: 'graph image',
            title: dummyData.alerts[0].annotations.title,
            title_link: dummyData.alerts[0].annotations.dashboard,
            image_url: 'https://example.com'
        }];

        const expectSlackMessage: SlackMessage = new SlackMessage(dummyData.alerts[0].annotations.title, attachments);
        const slackMessage = await slackMessageGenerator.handle(dummyPrometheusMessage);
        if (!slackMessage) {
            expect(true).toBe(false);
            return;
        }
        expect(expectSlackMessage).toEqual(slackMessage[0]);
    });
});