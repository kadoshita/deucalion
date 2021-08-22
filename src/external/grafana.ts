import { S3_ENDPOINT_URL } from '../config';

export interface GetGraphImageURLParams {
    start_at: Date;
    end_at: Date;
    metrics: 'cpu' | 'memory',
    instance: string;
}
export const getGraphImageURL = async (params: GetGraphImageURLParams): Promise<string> => {
    // return `https://${S3_ENDPOINT_URL}/grafana-image/${params.instance}/${params.metrics}/1623498095000/900`;
    return 'https://media.sublimer.me/grafana-image/home.sublimer.me:9104/cpu/1623498095000/900';
};