import { slackMessageGenerator } from '../generator';
import { Message } from '../message/messageInterface';
import { slackTransmitter } from '../transmitter';

export const handler = async (message: Message): Promise<void> => {
    switch (message.type) {
        case 'prometheus': {
            const slackMessages = await slackMessageGenerator.handle(message);
            if (slackMessages) {
                for (const message of slackMessages) {
                    await slackTransmitter.send(message);
                }
            }
        }
    }
};