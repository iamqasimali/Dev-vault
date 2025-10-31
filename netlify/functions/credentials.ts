// netlify/functions/credentials.ts
import { Handler } from "@netlify/functions";
import { connectDB } from "./lib/mongo";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

interface Credential {
  _id?: string;
  userId: string;
  platformName: string;
  usernameOrEmail?: string;
  password?: string; // encrypted
  apiKey?: string;  // encrypted
  twoFACode?: string; // encrypted
  notes?: string;
}

// Simple encryption (use same key as in frontend or env)
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.JWT_SECRET!.substring(0, 32).padEnd(32, '0')); // 32 bytes

function encrypt(text: string): string {
  const iv = randomBytes(12); // GCM uses 12-byte IV
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
}

export const handler: Handler = async (event) => {
  // Get user from JWT in cookie
  const token = event.headers.cookie?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    userId = decoded.id;
  } catch (e) {
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid token" }) };
  }

  const db = await connectDB();

  if (event.httpMethod === "GET") {
    const credentials = await db.collection<Credential>("credentials").find({ userId }).toArray();
    // Strip encrypted fields from response (or mark as encrypted)
    const safeCreds = credentials.map(c => ({
      ...c,
      password: c.password ? "[ENCRYPTED]" : undefined,
      apiKey: c.apiKey ? "[ENCRYPTED]" : undefined,
      twoFACode: c.twoFACode ? "[ENCRYPTED]" : undefined,
    }));
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(safeCreds),
    };
  }

  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body || "{}") as Omit<Credential, "_id" | "userId">;
    const doc: Credential = {
      userId,
      platformName: body.platformName,
      usernameOrEmail: body.usernameOrEmail,
      notes: body.notes,
    };
    if (body.password) doc.password = encrypt(body.password);
    if (body.apiKey) doc.apiKey = encrypt(body.apiKey);
    if (body.twoFACode) doc.twoFACode = encrypt(body.twoFACode);

    const result = await db.collection<Credential>("credentials").insertOne(doc);
    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ _id: result.insertedId, ...doc }),
    };
  }

  // Add PUT, DELETE as needed...

  return { statusCode: 405, body: "Method Not Allowed" };
};