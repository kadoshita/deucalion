import fetch from 'node-fetch';
import { PROMETHEUS_ENDPOINT } from '../config';

export const query = async (query: string): Promise<any> => {
    const res = await fetch(`${PROMETHEUS_ENDPOINT}/api/v1/query?query=${query}`).then(res => res.json());
    if (res.data.result.length === 0) {
        return;
    }
    const [_, result] = res.data.result[0].value;
    return result;
};