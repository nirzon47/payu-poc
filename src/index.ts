import { serve } from 'bun';
import index from './index.html';
import { Hono } from 'hono';
import { paymentResponse } from './paymentResponse';

const hono = new Hono().basePath('/api');

const server = serve({
  routes: {
    '/*': index,
    '/api/*': hono.fetch.bind(hono),
  },

  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
  },
});

hono.get('/payment', (c) => {
  return c.json(paymentResponse);
});

console.log(`🚀 Server running at ${server.url}`);
