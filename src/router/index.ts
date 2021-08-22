import { slackMessageGenerator } from '../generator';
import { Message } from '../message/messageInterface';
import { slackTransmitter } from '../transmitter';

export const handler = async (message: Message): Promise<void> => {
    switch (message.type) {
        case 'prometheus': {
            const slackMessage = await slackMessageGenerator.handle(message);
            if (slackMessage) {
                await slackTransmitter.send(slackMessage);
            }
        }
    }
};