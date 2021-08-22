import fastify from 'fastify';
import { receiver } from './receiver';

const PORT = process.env.PORT || 3000;

const server = fastify({ logger: true });

server.get('/', async (req, reply) => {
    return reply.send('OK');
});

server.register(receiver, { prefix: '/api/receiver' });

server.listen(PORT, '0.0.0.0', (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(address);
});