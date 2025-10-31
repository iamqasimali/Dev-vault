import { Handler } from '@netlify/functions';
import { connectDB } from '../lib/mongo';
import { verifyToken } from '../lib/auth';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const user = await verifyToken(event);
    if (!user) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const db = await connectDB();
    const credentials = db.collection('credentials');
    
    const userCredentials = await credentials
      .find({ userId: user.userId })
      .sort({ platformName: 1 })
      .toArray();

    // Don't return encrypted fields
    const safeCredentials = userCredentials.map(cred => ({
      ...cred,
      password: '',
      apiKey: '',
      twoFACode: cred.twoFACode ? '••••••' : '',
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(safeCredentials),
    };
  } catch (error) {
    console.error('Error fetching credentials:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};