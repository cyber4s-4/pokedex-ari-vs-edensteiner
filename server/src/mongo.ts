import { MongoClient, Db, Collection } from "mongodb";

export function create() {
  const uri = "mongodb+srv://eden:eden@eden.7vfps.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  return client;
}
export async function connect(client: MongoClient) {
  await client.connect();
  const db: Db = client.db("pokedex");
  const collection: Collection = db.collection("pokemons");
  return collection;
}
