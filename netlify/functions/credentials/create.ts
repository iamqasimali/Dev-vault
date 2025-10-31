import { Handler } from '@netlify/functions';
import { connectDB } from '../lib/mongo';
import { encrypt } from '../lib/encryption';
import { verifyToken } from '../lib/auth';

interface CreateCredentialRequest {
  platformName: string;
  usernameOrEmail: string;
  password: string;
  apiKey: string;
  twoFACode: string;
  notes: string;
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
    const credentials = db.collection('credentials');
    
    const data: CreateCredentialRequest = JSON.parse(event.body || '{}');
    
    // Encrypt sensitive fields
    const encryptedCredential = {
      ...data,
      password: data.password ? encrypt(data.password) : '',
      apiKey: data.apiKey ? encrypt(data.apiKey) : '',
      twoFACode: data.twoFACode ? encrypt(data.twoFACode) : '',
      userId: user.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await credentials.insertOne(encryptedCredential);
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        _id: result.insertedId,
        ...encryptedCredential,
        // Don't return encrypted fields in response
        password: '',
        apiKey: '',
        twoFACode: '',
      }),
    };
  } catch (error) {
    console.error('Error creating credential:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};