import { MongoClient, Db, ObjectId } from "mongodb";

const uri = process.env.MONGO_URI as string;
const dbName = process.env.DB_NAME as string;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (!db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connected to DB: ${dbName}`);
  }
  return db;
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ Database connection closed');
  }
}

export { ObjectId };