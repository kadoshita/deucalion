import { MessageAttachment } from '@slack/web-api';
import JSXSlack, {
    Blocks,
    Divider,
    Field,
    Header,
    Image,
    Section,
} from 'jsx-slack';

export interface SlackAlertMessageProps {
    title: string;
    description: string;
    image_url: string;
    current_value: string;
    severity: string;
    start_at: string;
    end_at: string;
}
export const SlackAlertMessage = ({
    title,
    description,
    image_url,
    current_value,
    severity,
    start_at,
    end_at,
}: SlackAlertMessageProps): MessageAttachment =>
    JSXSlack(
        <Blocks>
            <Header>{title}</Header>
            <Section>{description}</Section>
            <Image src={image_url} alt="graph"></Image>
            <Section>
                <Field>Current Value</Field>
                <Field>{current_value}</Field>
            </Section>
            <Divider></Divider>
            <Section>
                <Field>Severity</Field>
                <Field>{severity}</Field>
            </Section>
            <Divider></Divider>
            <Section>
                <Field>Start At</Field>
                <Field>{start_at}</Field>
            </Section>
            <Divider></Divider>
            <Section>
                <Field>End At</Field>
                <Field>{end_at}</Field>
            </Section>
        </Blocks>
    ) as MessageAttachment;
