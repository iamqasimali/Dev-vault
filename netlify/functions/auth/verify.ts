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
    const users = db.collection('users');
    
    const userData = await users.findOne(
      { _id: user.userId },
      { projection: { password: 0 } }
    );

    if (!userData) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};