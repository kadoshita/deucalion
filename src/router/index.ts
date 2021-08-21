import { slackMessageGenerator } from '../generator';
import { Message } from '../message';

export const handler = async (message: Message): Promise<void> => {
    switch (message.type) {
        case 'prometheus':
            await slackMessageGenerator.handle(message);
    }
};