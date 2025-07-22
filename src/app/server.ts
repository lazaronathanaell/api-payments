import Fastify from 'fastify';
import paymentRoutes from './routes/payment';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import refundRoutes from './routes/refund';

export const app = Fastify();

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Payment API',
      version: '1.0.0',
    },
  },
});

app.get('/', async (_req, reply) => {
  reply.send({ message: 'API CAPO Viagens está no ar! Visite /docs para ver a documentação.' })
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(paymentRoutes);
app.register(refundRoutes);