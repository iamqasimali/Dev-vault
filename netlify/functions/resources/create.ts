import { Handler } from '@netlify/functions';
import { connectDB } from '../lib/mongo';
import { verifyToken } from '../lib/auth';

interface CreateResourceRequest {
  title: string;
  url: string;
  category: string;
  description: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const user = await verifyToken(event);
    if (!user) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const db = await connectDB();
    const resources = db.collection('resources');
    
    const data: CreateResourceRequest = JSON.parse(event.body || '{}');
    
    const resource = {
      ...data,
      userId: user.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await resources.insertOne(resource);
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        _id: result.insertedId,
        ...resource,
      }),
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};