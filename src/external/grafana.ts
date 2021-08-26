import fetch from 'node-fetch';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { GRAFANA_API_KEY, OCI_ACCESS_KEY, OCI_OBJECT_STORAGE_BUCKET, OCI_OBJECT_STORAGE_NAMESPACE, OCI_OBJECT_STORAGE_REGION, OCI_OBJECT_STORAGE_URL, OCI_SECRET_KEY } from '../config';

const client = new S3Client({
    region: OCI_OBJECT_STORAGE_REGION,
    endpoint: `https://${OCI_OBJECT_STORAGE_NAMESPACE}.compat.objectstorage.${OCI_OBJECT_STORAGE_REGION}.oraclecloud.com`,
    credentials: {
        accessKeyId: OCI_ACCESS_KEY,
        secretAccessKey: OCI_SECRET_KEY
    },
    forcePathStyle: true,
});

export interface GetGraphImageURLParams {
    url: string;
    panelId: string;
    startAt: Date;
    endAt: Date;
    instance: string;
}
export const getGraphImageURL = async (params: GetGraphImageURLParams): Promise<string> => {
    const from = params.startAt.getTime();
    const to = params.endAt.getTime();
    const grafanaGraphImgeURL = `${params.url}&var-hosts=${params.instance}&from=${from}&to=${to}&panelId=${params.panelId}&width=640&height=360&tz=Asia%2FTokyo`;
    
    const res = await fetch(grafanaGraphImgeURL, {
        headers: {
            'Authorization': `Bearer ${GRAFANA_API_KEY}`
        }
    });
    const data = await res.buffer();
    const objectKey = `deucalion_graph_image/${params.instance}/${params.panelId}/${from}/${to}/graph`;
    const command = new PutObjectCommand({
        Bucket: OCI_OBJECT_STORAGE_BUCKET,
        Body: data,
        Key: objectKey
    });
    await client.send(command);
    return `${OCI_OBJECT_STORAGE_URL}${objectKey}`;
};