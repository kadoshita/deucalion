/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { PrometheusMessage } from '../message/prometheus';
import * as router from '../router';

export const prometheus: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        await reply.send('OK');
        const message = new PrometheusMessage(req.body);
        await router.handler(message);
        return;
    } catch (err) {
        console.error(err.message);
    }
};