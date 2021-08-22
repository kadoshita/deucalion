import { getGraphImageURL } from '../external/grafana';
import { AlertsEntity, PrometheusMessage } from '../message';
import { Message } from '../message/messageInterface';
import { SlackAttachmentColor, SlackMessage, SlackMessageAttachment } from '../message/slack';

export const handle = async (message: Message): Promise<SlackMessage | void> => {
    switch (message.type) {
        case 'prometheus': {
            const attachments = await convertPrometheusMessageToSlackMessage(message as PrometheusMessage);
            const slackMessage: SlackMessage = new SlackMessage(attachments);
            return slackMessage;
        }
        default:
            break;
    }
};

const severityToColor = (severity: string): SlackAttachmentColor => {
    switch (severity) {
        case 'critical': return '#BE281B';
        case 'warning': return '#D1A14D';
        default: return '#439FE0';
    }
};
const convertPrometheusMessageToSlackMessage = async (message: PrometheusMessage) => {
    const image_url = await getGraphImageURL({
        start_at: (new Date()),
        end_at: (new Date()),
        metrics: 'cpu',
        instance: 'localhost:9000'
    });
    const slackMessage: SlackMessageAttachment[] = message.message.alerts.map((alert: AlertsEntity) => {
        const attachment: SlackMessageAttachment = {
            color: (alert.status === 'resolved') ? '#359C4C' : severityToColor(alert.labels.severity),
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: alert.annotations.title,
                        emoji: true
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: alert.annotations.description
                    }
                },
                {
                    type: 'image',
                    title: {
                        type: 'plain_text',
                        text: 'graph',
                        emoji: true
                    },
                    image_url: image_url,
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
                            text: alert.labels.severity,
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
                            text: alert.startsAt,
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
                            text: alert.endsAt,
                            emoji: true
                        }
                    ]
                }
            ]
        };
        return attachment;
    });
    return slackMessage;
};