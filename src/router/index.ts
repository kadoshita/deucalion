import { slackMessageGenerator } from '../generator';
import { Message } from '../message/messageInterface';

export const handler = async (message: Message): Promise<void> => {
    switch (message.type) {
        case 'prometheus':
            await slackMessageGenerator.handle(message);
    }
};