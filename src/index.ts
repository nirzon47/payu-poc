import { serve } from 'bun';
import index from './index.html';
import { Hono } from 'hono';
import { paymentResponse } from './paymentResponse';
import {
  constructAuthHeaders,
  constructRequestBody,
} from './backend/paymentUtils';

const hono = new Hono().basePath('/api');

const port = Number(process.env.PORT || 8080);

hono.post('/payment', async (c) => {
  try {
    const body = constructRequestBody(paymentResponse);
    const { date, authorization } = await constructAuthHeaders(body);

    const res = await fetch('https://apitest.payu.in/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        date,
        authorization,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return c.json(data);
  } catch (error) {
    console.error(error);
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

serve({
  port,
  routes: {
    '/*': index,
    '/api/*': hono.fetch.bind(hono),
  },
  development:
    process.env.NODE_ENV === 'development' ? { hmr: true } : undefined,
});
