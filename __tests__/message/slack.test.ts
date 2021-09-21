import { Block, MessageAttachment } from '@slack/types';
import { jsxslack } from 'jsx-slack';
import { SlackMessage } from '../../src/message/slack';

describe('slack message', () => {
    test('create new Slack Message', () => {
        const attachments: MessageAttachment[] = [{
            color: '#BE281B',
            text: 'description',
            fields: [
                { title: 'hoge', value: 'fuga', short: false }
            ]
        }];
        const blocks = jsxslack`
        <Blocks>
            <Image src='https://example.com' alt="graph"></Image>
        </Blocks>` as Block[];

        expect(() => {
            new SlackMessage('title', attachments, blocks);
        }).not.toThrowError();
    });
});