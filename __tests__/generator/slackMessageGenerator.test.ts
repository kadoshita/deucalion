import crypto from 'crypto';
import * as grafana from '../../src/external/grafana';
import { slackMessageGenerator } from '../../src/generator';
import { AlertManagerWebhookRequest, PrometheusMessage } from '../../src/message';
import { SlackMessage, SlackMessageAttachment } from '../../src/message/slack';
import { slackTransmitter } from '../../src/transmitter';

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
    test('create slack message from prometheus message', async () => {
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

        const attachments: SlackMessageAttachment[] = [{
            color: '#BE281B',
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: dummyData.alerts[0].annotations.title,
                        emoji: true
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: dummyData.alerts[0].annotations.description
                    }
                },
                {
                    type: 'image',
                    title: {
                        type: 'plain_text',
                        text: 'graph',
                        emoji: true
                    },
                    image_url: 'https://example.com',
                    alt_text: 'graph'

                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'plain_text',
                            text: 'Current Value',
                            emoji: true
                        },
                        {
                            type: 'plain_text',
                            text: '93.37%',
                            emoji: true
                        }
                    ]
                },
                {
                    type: 'divider'
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'plain_text',
                            text: 'Severity',
                            emoji: true
                        },
                        {
                            type: 'plain_text',
                            text: dummyData.alerts[0].labels.severity,
                            emoji: true
                        }
                    ]
                },
                {
                    type: 'divider'
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'plain_text',
                            text: 'Start At',
                            emoji: true
                        },
                        {
                            type: 'plain_text',
                            text: dummyData.alerts[0].startsAt,
                            emoji: true
                        }
                    ]
                },
                {
                    type: 'divider'
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'plain_text',
                            text: 'End At',
                            emoji: true
                        },
                        {
                            type: 'plain_text',
                            text: dummyData.alerts[0].endsAt,
                            emoji: true
                        }
                    ]
                }
            ]
        }];
        const expectSlackMessage: SlackMessage = new SlackMessage(attachments);
        const slackMessage = await slackMessageGenerator.handle(dummyPrometheusMessage);

        expect(expectSlackMessage).toEqual(slackMessage);
    });
});