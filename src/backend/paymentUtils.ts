const PAYU_CLIENT_SECRET = process.env.PAYU_CLIENT_SECRET;
const PAYU_CLIENT_ID = process.env.PAYU_CLIENT_ID;

export const constructAuthHeaders = async (body: any) => {
  const date = new Date().toUTCString();
  const hashString =
    JSON.stringify(body) + '|' + date + '|' + PAYU_CLIENT_SECRET;

  const encoder = new TextEncoder();
  const data = encoder.encode(hashString);

  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    date,
    authorization: `hmac username="${PAYU_CLIENT_ID}", algorithm="sha512", headers="date", signature="${hashHex}"`,
  };
};

export const constructRequestBody = (paymentResponse: any) => {
  const accountId = PAYU_CLIENT_ID;

  return {
    accountId,
    txnId: Math.random().toString(36).substring(2, 15),
    order: {
      productInfo: 'Test',
      paymentChargeSpecification: {
        price: 1,
      },
    },
    billingDetails: {
      firstName: 'Test',
      email: '',
      phone: '9999999999',
    },
    callBackActions: {
      successAction: 'https://google.com/success',
      failureAction: 'https://google.com/failure',
      cancelAction: 'https://google.com/cancel',
    },
    additionalInfo: {
      txnFlow: 'nonseamless',
      enforcePaymethod: 'NB',
    },
    currency: 'INR',
    paymentSource: 'WEB',
  };
};
