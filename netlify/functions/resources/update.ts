import { Handler } from '@netlify/functions';
import { connectDB } from '../lib/mongo';
import { verifyToken } from '../lib/auth';

interface UpdateResourceRequest {
  _id: string;
  title: string;
  url: string;
  category: string;
  description: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const user = await verifyToken(event);
    if (!user) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const db = await connectDB();
    const resources = db.collection('resources');
    
    const data: UpdateResourceRequest = JSON.parse(event.body || '{}');
    
    const result = await resources.updateOne(
      { _id: data._id, userId: user.userId },
      { 
        $set: {
          title: data.title,
          url: data.url,
          category: data.category,
          description: data.description,
          updatedAt: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return { statusCode: 404, body: 'Resource not found' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        _id: data._id,
        title: data.title,
        url: data.url,
        category: data.category,
        description: data.description,
        updatedAt: new Date(),
      }),
    };
  } catch (error) {
    console.error('Error updating resource:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};