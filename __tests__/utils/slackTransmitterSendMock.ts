import { SlackMessage } from '../../src/message/slack';
import { slackTransmitter } from '../../src/transmitter';

let slackTransmitterSendMock: jest.SpyInstance;

beforeEach(() => {
    slackTransmitterSendMock = jest.spyOn(slackTransmitter, 'send');
    slackTransmitterSendMock.mockImplementation(async (message: SlackMessage): Promise<void> => {
        return;
    });
});
afterEach(() => {
    slackTransmitterSendMock.mockRestore();
});