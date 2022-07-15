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
  const cursor = isNaN(Number(id))
    ? await collection.find({ "data.name": id })
    : await collection.find({ index: Number(id) });
  const items = await cursor.toArray();
  pokemon = items[0];
  res.send(pokemon);
});

const port = process.env.PORT || 3000;
app.listen(port);
