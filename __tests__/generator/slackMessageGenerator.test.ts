import crypto from 'crypto';
import { jsxslack } from 'jsx-slack';
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
    test('create slack message from prometheus message', async () => {
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
                        grafana_url: 'https://example.com'
                    },
                    startsAt: '2021-08-22T06:12:57.011Z',
                    endsAt: '2021-08-22T06:13:57.011Z',
                    generatorURL: 'example.com',
                    fingerprint: ''
                }
            ]
        };
        const dummyPrometheusMessage: PrometheusMessage = new PrometheusMessage(dummyData);

        const attachment = jsxslack`
            <Blocks>
                <Header>${dummyData.alerts[0].annotations.title}</Header>
                <Section>${dummyData.alerts[0].annotations.description}</Section>
                <Image src='https://example.com' alt="graph"></Image>
                <Section>
                    <Field>Current Value</Field>
                    <Field></Field>
                </Section>
                <Divider></Divider>
                <Section>
                    <Field>Severity</Field>
                    <Field>${dummyData.alerts[0].labels.severity}</Field>
                </Section>
                <Divider></Divider>
                <Section>
                    <Field>Start At</Field>
                    <Field>2021/8/22 15:12:57</Field>
                </Section>
                <Divider></Divider>
                <Section>
                    <Field>End At</Field>
                    <Field>2021/8/22 15:13:57</Field>
                </Section>
            </Blocks>`;

        const expectSlackMessage: SlackMessage = new SlackMessage('#BE281B', attachment);
        const slackMessage = await slackMessageGenerator.handle(dummyPrometheusMessage);

        expect(expectSlackMessage).toEqual(slackMessage);
    });
});