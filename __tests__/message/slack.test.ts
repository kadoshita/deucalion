import { SlackMessage, SlackMessageAttachment } from '../../src/message/slack';

describe('slack message', () => {
    test('create new Slack Message', () => {
        const attachments: SlackMessageAttachment[] = [{
            color: '#BE281B',
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: 'title',
                        emoji: true
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'description'
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
                            text: 'severity',
                            emoji: true
                        }
                    ]
                }
            ]
        }];
        expect(() => {
            new SlackMessage(attachments);
        }).not.toThrowError();
    });
});