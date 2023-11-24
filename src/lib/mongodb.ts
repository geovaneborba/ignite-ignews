import { MongoClient, ServerApiVersion } from "mongodb";

const username = encodeURIComponent(process.env.MONGODB_USER as string);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD as string);

const uri = `mongodb+srv://${username}:${password}@cluster0.qydhzs5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const db = client.db("ignews");
