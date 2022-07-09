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
}

//class for pokemon
class Pokemon {
  data: Data;
  constructor(data: Data) {
    this.data = data;
  }
}

async function getPokemons(n: number, x: number) {
  let pokemonData: Pokemon[] = [];
  for (let i = x; i <= n; i++) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
    let json = await response.json();
    let data = {
      //name
      name: json.name,
      //front image
      front_image: json.sprites.front_default,
      //back image
      back_image: json.sprites.back_default,
      //abilites array
      abilities: json.abilities
        .map((arr) => arr.ability)
        .map((ability) => ability.name),
      //types array
      types: json.types.map((arr) => arr.type).map((type) => type.name),
      //stats array
      stats: json.stats
        .map((arr) => arr.stat)
        .map(
          (stat) =>
            `${stat.name}: ${
              json.stats.find((obj) => obj.stat.name === stat.name).base_stat
            }`
        ),
    };
    const pokemon = new Pokemon(data);
    pokemonData.push(pokemon);
  }
  return pokemonData;
}
const filePath: string = path.join(__dirname, "../data/data.json");
const pokemonData: Pokemon[] = JSON.parse(fs.readFileSync(filePath, "utf8"));

if (fs.existsSync(filePath)) {
  // path exists
  console.log("data.json exists ");
} else {
  (async () => {
    fs.writeFileSync(filePath, JSON.stringify(await getPokemons(120, 1)));
    console.log("data.json has been created");
  })();
}

app.get("/", (req: Request, res: Response) => {
  res.send("it works");
});

app.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(pokemonData[id]);
});

app.listen(3000);
