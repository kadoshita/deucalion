import { query as PrometheusQuery } from '../external/prometheus';
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
    const alertPromises = message.message.alerts.map(async (alert: AlertsEntity) => {

        let image_url = '';
        let current_value = '';
        if (alert.annotations.grafana_url && alert.annotations.grafana_pannel_id) {
            let startAt = new Date(alert.startsAt);
            if (Date.now() - startAt.getTime() <= 3600 * 1000) {
                startAt = new Date(Date.now() - 3600 * 1000);
            }
            const endAt = new Date();

            image_url = await getGraphImageURL({
                url: alert.annotations.grafana_url || '',
                panelId: alert.annotations.grafana_pannel_id || '',
                startAt,
                endAt,
                instance: message.message.commonLabels.instance
            });
        }
        if (alert.annotations.query) {
            current_value = await PrometheusQuery(alert.annotations.query);
        }

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
                            text: current_value,
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
                            text: (new Date(alert.startsAt)).toLocaleString('ja-JP'),
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
                            text: (new Date(alert.endsAt)).toLocaleString('ja-JP'),
                            emoji: true
                        }
                    ]
                }
            ]
        };
        return attachment;
    });
    const slackMessage: SlackMessageAttachment[] = await Promise.all(alertPromises);
    return slackMessage;
};