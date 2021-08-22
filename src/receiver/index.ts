import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prometheus } from './prometheus';

export const receiver: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.post('/prometheus', prometheus);
};