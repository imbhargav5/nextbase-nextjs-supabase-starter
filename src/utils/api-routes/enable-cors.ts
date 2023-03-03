import { NextApiRequest, NextApiResponse } from 'next';

//TODO: Add your allowed origins here
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://demo.usenextbase.com',
  'https://demo.usenextbase.com',
  'http://usenextbase.com',
  'https://usenextbase.com',
];

export const enableCors = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  } else {
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://demo.usenextbase.com'
    );
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
};
