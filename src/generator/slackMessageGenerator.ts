import { query as PrometheusQuery } from '../external/prometheus';
import { getGraphImageURL } from '../external/grafana';
import { AlertsEntity, PrometheusMessage } from '../message';
import { Message } from '../message/messageInterface';
import { SlackAttachmentColor, SlackMessage } from '../message/slack';
import { SlackAlertMessage } from '../message/jsx/message';

export const handle = async (message: Message): Promise<SlackMessage | void> => {
    switch (message.type) {
        case 'prometheus': {
            const messages = await convertPrometheusMessageToSlackMessage(message as PrometheusMessage);
            const slackMessage: SlackMessage = new SlackMessage(messages.color, messages.message);
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
        const alertmessage = SlackAlertMessage({
            title: alert.annotations.title,
            description: alert.annotations.description,
            image_url,
            current_value,
            severity: alert.labels.severity,
            start_at: (new Date(alert.startsAt)).toLocaleString('ja-JP'),
            end_at: (new Date(alert.endsAt)).toLocaleString('ja-JP')
        });
        return alertmessage;
    });
    const color = (message.message.alerts[0].status === 'resolved') ? '#359C4C' : severityToColor(message.message.alerts[0].labels.severity);
    const slackMessage = await Promise.all(alertPromises);
    return { color, message: slackMessage[0] };
};