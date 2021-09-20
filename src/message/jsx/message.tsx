import { Block } from '@slack/web-api';
import JSXSlack, { Blocks, Image } from 'jsx-slack';

export interface SlackBlockMessageProps {
    image_url: string;
}
export const createSlackBlockMessage = ({
    image_url,
}: SlackBlockMessageProps): Block[] =>
    JSXSlack(
        <Blocks>
            <Image src={image_url} alt="graph"></Image>
        </Blocks>
    ) as Block[];
