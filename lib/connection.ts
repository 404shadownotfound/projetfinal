import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("Missing MONGODB_URI");

const client = new MongoClient(uri);
export const db = client.db("education-quest");
