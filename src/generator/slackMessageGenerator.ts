import { query as PrometheusQuery } from '../external/prometheus';
import { getGraphImageURL } from '../external/grafana';
import { AlertsEntity, PrometheusMessage } from '../message';
import { Message } from '../message/messageInterface';
import { SlackAttachmentColor, SlackMessage } from '../message/slack';
import { MessageAttachment } from '@slack/types';

export const handle = async (message: Message): Promise<SlackMessage[][] | void> => {
    switch (message.type) {
        case 'prometheus': {
            const messages = await convertPrometheusMessageToSlackMessage(message as PrometheusMessage);
            return messages;
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
const convertPrometheusMessageToSlackMessage = async (message: PrometheusMessage): Promise<SlackMessage[][]> => {
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
        const color = (alert.status === 'resolved') ? '#359C4C' : severityToColor(alert.labels.severity);
        const attatchments: MessageAttachment[] = [{
            color,
            title: alert.annotations.title,
            title_link: alert.annotations.grafana_url,
            text: alert.annotations.description,
            fields: [
                { title: 'severity', value: alert.labels.severity, short: false },
                { title: 'current_value', value: current_value, short: false },
                { title: 'start_at', value: (new Date(alert.startsAt)).toLocaleString('ja-JP'), short: true },
                { title: 'end_at', value: (new Date(alert.endsAt)).toLocaleString('ja-JP'), short: true }
            ]
        }];
        const graphAttachment: MessageAttachment = {
            color,
            text: message.message.commonLabels.alertname,
            image_url
        };
        const slackAttachmentMessage: SlackMessage = new SlackMessage(attatchments);
        const slackBlockMessage: SlackMessage = new SlackMessage([graphAttachment]);
        return [slackAttachmentMessage, slackBlockMessage];
    });

    const messages = await Promise.all(alertPromises);
    return messages;
};