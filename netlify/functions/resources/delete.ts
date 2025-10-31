import { Handler } from '@netlify/functions';
import { connectDB } from '../lib/mongo';
import { verifyToken } from '../lib/auth';

interface DeleteResourceRequest {
  _id: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const user = await verifyToken(event);
    if (!user) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const db = await connectDB();
    const resources = db.collection('resources');
    
    const data: DeleteResourceRequest = JSON.parse(event.body || '{}');
    
    const result = await resources.deleteOne({ 
      _id: data._id, 
      userId: user.userId 
    });

    if (result.deletedCount === 0) {
      return { statusCode: 404, body: 'Resource not found' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Resource deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting resource:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};