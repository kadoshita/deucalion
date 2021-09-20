import { SlackMessage } from '../../src/message/slack';
import { slackTransmitter } from '../../src/transmitter';

let slackTransmitterSendMock: jest.SpyInstance;
jest.mock('@slack/web-api');
beforeEach(() => {
    slackTransmitterSendMock = jest.spyOn(slackTransmitter, 'send');
    slackTransmitterSendMock.mockImplementation(async (messages: SlackMessage[]): Promise<void> => {
        return;
    });
});
afterEach(() => {
    slackTransmitterSendMock.mockRestore();
});