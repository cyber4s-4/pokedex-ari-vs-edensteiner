const express = require("express");
import { Request, Response } from "express";
import { json } from "body-parser";
const cors = require("cors");
const fs = require("fs");
const path = require("path");
import { create, connect } from "./mongo";
import { Collection } from "mongodb";

const app = express();
app.use(json());
app.use(cors());

let collection: Collection;
connect(create()).then((res) => (collection = res));
//interface for pokemon data
interface Data {
  name: string;
  front_image: string;
  back_image: string;
  abilities: string[];
  types: string[];
  stats: string[];
  height: string;
  weight: string;
}

//class for pokemon
class Pokemon {
  data: Data;
  constructor(data: Data) {
    this.data = data;
  }
}

// checks server is running
app.get("/", async (req: Request, res: Response) => {
  res.send("it works");
});

// return amount of pokemons
app.get("/pokemonCount", async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  const pokemons = await collection.countDocuments();
  res.send(String(pokemons));
});

// send pokemon by id or name to client
app.get("/pokemon/:id", async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  const id = req.params.id;
  let pokemon: any;
  const pokemonQueryByIndex: boolean = isNaN(Number(id)) ? false : true;
  if (pokemonQueryByIndex) {
    const cursor = await collection.find({ index: Number(id) + 1 });
    const items = await cursor.toArray();
    pokemon = items[0];
  } else {
    const cursor = await collection.find({ "data.name": id });
    const items = await cursor.toArray();
    pokemon = items[0];
  }
  if (!pokemon.data.front_image) pokemon.data.front_image = "./noImage.png";
  if (!pokemon.data.back_image) pokemon.data.back_image = "./noImage.png";
  res.send(pokemon);
});

const port = process.env.PORT || 3000;
app.listen(port);
