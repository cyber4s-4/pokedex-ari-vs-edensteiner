const express = require("express");
import fetch from "node-fetch";
import { Request, Response } from "express";
import { json } from "body-parser";
const fs = require("fs");
const path = require("path");
const app = express();
app.use(json());

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

const filePath: string = path.join(__dirname, "../data/data.json");
let pokemonData: Pokemon[] = JSON.parse(fs.readFileSync(filePath, "utf8"));

// checks server is running
app.get("/", (req: Request, res: Response) => {
  res.send("it works");
});

// checks if data arrived on server from fetch
app.get("/pokemonCount", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.send(String(pokemonData.length));
});

// send pokemon by id or name to client
app.get("/pokemon/:id", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  const id = req.params.id;
  const pokemon = isNaN(Number(id))
    ? pokemonData.find((pokemon) => pokemon.data.name == id)
    : pokemonData[id];
  res.send(pokemon);
});

app.listen(3000);
