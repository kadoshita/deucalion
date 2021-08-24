import * as externalGrafana from '../../src/external/grafana';

jest.mock('@aws-sdk/client-s3');
let externalGrafanaMock: jest.SpyInstance;

beforeEach(() => {
    externalGrafanaMock = jest.spyOn(externalGrafana, 'getGraphImageURL');
    externalGrafanaMock.mockImplementation(async (params: externalGrafana.GetGraphImageURLParams): Promise<string> => {
        return 'https://example.com';
    });
});
afterEach(() => {
    externalGrafanaMock.mockRestore();
});