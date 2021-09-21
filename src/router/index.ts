import { slackMessageGenerator } from '../generator';
import { Message } from '../message/messageInterface';
import { slackTransmitter } from '../transmitter';

export const handler = async (message: Message): Promise<void> => {
    switch (message.type) {
        case 'prometheus': {
            const slackMessages = await slackMessageGenerator.handle(message);
            if (slackMessages) {
                await slackTransmitter.send(slackMessages);
            }
        }
    }
};