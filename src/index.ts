import { serve } from 'bun';
import index from './index.html';
import { Hono } from 'hono';
import { paymentResponse } from './paymentResponse';
import {
  constructAuthHeaders,
  constructRequestBody,
} from './backend/paymentUtils';
import axios from 'axios';

const hono = new Hono().basePath('/api');

const port = Number(process.env.PORT ?? 3000);

const server = serve({
  port,
  routes: {
    '/*': index,
    '/api/*': hono.fetch.bind(hono),
  },

  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
  },
});

hono.post('/payment', async (c) => {
  try {
    const body = constructRequestBody(paymentResponse);
    const { date, authorization } = await constructAuthHeaders(body);

    const { data } = await axios.post(
      'https://apitest.payu.in/v2/payments',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          date: date,
          authorization: authorization,
        },
      }
    );

    return c.json(data);
  } catch (error) {
    console.error('🚀 ~ error:', error);
    return c.json({ error: 'Error processing payment' }, 500);
  }
});

hono.post('/payu/success', async (c) => {
  const payload = await c.req.json();
  console.log('Payment Success Payload:', payload);
  return c.json({ status: 'success' });
});

hono.post('/payu/failure', async (c) => {
  const payload = await c.req.json();
  console.log('Payment Failure Payload:', payload);
  return c.json({ status: 'failure' });
});

console.log(`🚀 Server running at ${server.url}`);
