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
    const resources = db.collection('resources');
    
    const userResources = await resources
      .find({ userId: user.userId })
      .sort({ category: 1, title: 1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(userResources),
    };
  } catch (error) {
    console.error('Error fetching resources:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};