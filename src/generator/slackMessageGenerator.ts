import { Message } from '../message/messageInterface';

export const handle = async (message: Message): Promise<void> => {
    switch (message.type) {
        case 'prometheus':
            console.log('generate slack message from prometheus message');
            break;
        default:
            break;
    }
};