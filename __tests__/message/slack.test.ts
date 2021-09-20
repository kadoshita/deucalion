import { MessageAttachment } from '@slack/types';
import { jsxslack } from 'jsx-slack';
import { SlackMessage, SlackMessageAttachment } from '../../src/message/slack';

describe('slack message', () => {
    test('create new Slack Message', () => {
        const blocks = jsxslack`
        <Blocks>
            <Header>title</Header>
            <Section>description</Section>
            <Image src='https://example.com' alt="graph"></Image>
            <Section>
                <Field>Current Value</Field>
                <Field></Field>
            </Section>
            <Divider></Divider>
            <Section>
                <Field>Severity</Field>
                <Field>severity</Field>
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
        </Blocks>` as MessageAttachment;
        const attachment: SlackMessageAttachment = {
            color: '#BE281B',
            blocks,
        };
        expect(() => {
            new SlackMessage(attachment.color, attachment.blocks);
        }).not.toThrowError();
    });
});