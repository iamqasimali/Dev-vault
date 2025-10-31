import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Handler } from '@netlify/functions';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthUser {
  userId: string;
  email: string;
}

export function verifyToken(event: Handler['event']): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    const authHeader = event.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      resolve(null);
      return;
    }

    const token = authHeader.slice(7);
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        resolve(null);
      } else {
        resolve(decoded as AuthUser);
      }
    });
  });
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}