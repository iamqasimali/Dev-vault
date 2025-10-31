import { Handler } from '@netlify/functions';
import { connectDB } from '../lib/mongo';
import { hashPassword, generateToken } from '../lib/auth';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const db = await connectDB();
    const users = db.collection('users');
    
    const { name, email, password }: SignupRequest = JSON.parse(event.body || '{}');

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name, email, and password are required' }),
      };
    }

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User already exists with this email' }),
      };
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = generateToken(result.insertedId.toString(), email);

    return {
      statusCode: 201,
      body: JSON.stringify({
        user: {
          _id: result.insertedId,
          name,
          email,
          createdAt: new Date(),
        },
        token,
      }),
    };
  } catch (error) {
    console.error('Error during signup:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};