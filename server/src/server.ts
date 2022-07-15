const express = require("express");
import { Request, Response } from "express";
import { json } from "body-parser";
const cors = require("cors");
const fs = require("fs");
const path = require("path");
import { create, connect } from "./mongo";
import { Collection, Document, FindCursor } from "mongodb";
import { PreviewData } from "./utilities";

const app = express();
app.use(json());
app.use(cors());

let collection: Collection;
//set collection
connect(create()).then((res) => (collection = res));

// checks server is running
app.get("/", async (req: Request, res: Response) => {
  res.send("it works");
});

// return amount of pokemons
app.get("/pokemonCount", async (req: Request, res: Response) => {
  const pokemons: number = await collection.countDocuments();
  res.send(String(pokemons));
});

// send pokemon by id or name to client
app.get("/pokemon/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  let pokemon: Document;
  const cursor: FindCursor = isNaN(Number(id))
    ? await collection.find({ "data.name": id })
    : await collection.find({ index: Number(id) });
  const items: Document[] = await cursor.toArray();
  pokemon = items[0];
  res.send(pokemon);
});

// send preview data  by id or name to client
app.get("/preview/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  let pokemon: Document;
  const cursor: FindCursor = isNaN(Number(id))
    ? await collection.find({ "data.name": id })
    : await collection.find({ index: Number(id) });
  const items: Document[] = await cursor.toArray();
  pokemon = items[0];
  const previewData: PreviewData = {
    name: pokemon.data.name,
    front_image: pokemon.data.front_image,
    back_image: pokemon.data.back_image,
  };
  res.send(previewData);
});

//send page info
app.get("/page/:number", async (req: Request, res: Response) => {
  const pageNumber: number = Number(req.params.number);
  let pokemons: Document[];
  let previewArray: PreviewData[] = [];
  const cursor: FindCursor = await collection.find({ index: { $gte: 24 * pageNumber - 23, $lte: 24 * pageNumber } });
  pokemons = await cursor.toArray();
  pokemons.forEach((pokemon) => {
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
