const express = require("express");
import { Request, Response } from "express";
import { json } from "body-parser";
const cors = require("cors");
import { create, connect } from "./mongo";
import { Collection, Document, FindCursor } from "mongodb";
import { PreviewData } from "./utilities";

const app = express();
app.use(json());
app.use(cors());

let collection: Collection;
//set collection
connect(create()).then((res) => (collection = res));

// return amount of pokemons
app.get("/pokemonCount", async (req: Request, res: Response): Promise<void> => {
  const cursor: FindCursor = await collection
    .find({})
    .sort({ _id: -1 })
    .limit(1);
  const pokemons = await cursor.toArray();
  res.send(String(pokemons[0].index));
});

// send pokemon by id or name to client
app.get("/pokemon/:id", async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;
  let pokemon: Document;
  const cursor: FindCursor = isNaN(Number(id))
    ? await collection.find({ "data.name": id })
    : await collection.find({ index: Number(id) });
  const items: Document[] = await cursor.toArray();
  pokemon = items[0];
  res.send(pokemon);
});

//send page info
app.get("/page/:number", async (req: Request, res: Response): Promise<void> => {
  const pageNumber: number = Number(req.params.number);
  let pokemons: Document[];
  let previewArray: PreviewData[] = [];
  const cursor: FindCursor = await collection.find({
    index: { $gte: 24 * pageNumber - 23, $lte: 24 * pageNumber },
  });
  pokemons = await cursor.toArray();
  pokemons.forEach((pokemon): void => {
    previewArray.push({
      name: pokemon.data.name,
      front_image: pokemon.data.front_image,
      back_image: pokemon.data.back_image,
    });
  });
  res.send(previewArray);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
