import Fastify from 'fastify';
import { paymentRoutes } from './routes/payment';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export const app = Fastify();

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Payment API',
      version: '1.0.0',
    },
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(paymentRoutes);