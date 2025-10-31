import { Handler } from '@netlify/functions';
import { connectDB } from '../lib/mongo';
import { encrypt } from '../lib/encryption';
import { verifyToken } from '../lib/auth';

interface UpdateCredentialRequest {
  _id: string;
  platformName: string;
  usernameOrEmail: string;
  password: string;
  apiKey: string;
  twoFACode: string;
  notes: string;
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
    const credentials = db.collection('credentials');
    
    const data: UpdateCredentialRequest = JSON.parse(event.body || '{}');
    
    // Get existing credential to preserve encrypted fields if not changed
    const existingCredential = await credentials.findOne({ 
      _id: data._id, 
      userId: user.userId 
    });

    if (!existingCredential) {
      return { statusCode: 404, body: 'Credential not found' };
    }

    const updateData: any = {
      platformName: data.platformName,
      usernameOrEmail: data.usernameOrEmail,
      notes: data.notes,
      updatedAt: new Date(),
    };

    // Only update password if provided
    if (data.password) {
      updateData.password = encrypt(data.password);
    } else {
      updateData.password = existingCredential.password;
    }

    // Only update API key if provided
    if (data.apiKey) {
      updateData.apiKey = encrypt(data.apiKey);
    } else {
      updateData.apiKey = existingCredential.apiKey;
    }

    // Only update 2FA code if provided
    if (data.twoFACode) {
      updateData.twoFACode = encrypt(data.twoFACode);
    } else {
      updateData.twoFACode = existingCredential.twoFACode;
    }

    await credentials.updateOne(
      { _id: data._id, userId: user.userId },
      { $set: updateData }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        _id: data._id,
        ...updateData,
        password: '',
        apiKey: '',
        twoFACode: updateData.twoFACode ? '••••••' : '',
      }),
    };
  } catch (error) {
    console.error('Error updating credential:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};