const express = require("express");
import { Request, Response } from "express";
import { json } from "body-parser";
const cors = require("cors");
const { Client } = require("pg");
import path from "path";

const app = express();
app.use(json());
app.use(cors());
const root: string = path.join(process.cwd(), "dist");
app.use(express.static(root));

// init pg client
const postgresClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
// connect to db s
async function pg() {
  await postgresClient.connect();
}
pg();

// interface for preview data
interface PreviewData {
  name: string;
  front_image: string;
  back_image: string;
}

app.get("/", (_req: Request, res: Response): void => {
  res.sendFile(path.join(root, "index.html"));
});

// return amount of pokemons
app.get("/pokemonCount", async (_req: Request, res: Response): Promise<void> => {
  postgresClient.query("SELECT COUNT(*) FROM pokemons", (error: Error, response: any) => {
    if (error) throw error;
    const count: string = response.rows[0].count;
    res.status(200).json(count);
  });
});

// send pokemon by id or name to client
app.get("/pokemon/:id", async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;
  const queryName = {
    name: "get-pokemon-by-name",
    text: `SELECT * FROM pokemons WHERE name = $1`,
    values: [id],
  };
  const queryId = {
    name: "get-pokemon-by-id",
    text: `SELECT * FROM pokemons WHERE id = $1`,
    values: [Number(id)],
  };
  const queryType = isNaN(Number(id)) ? queryName : queryId;
  postgresClient.query(queryType, (error: Error, response: any) => {
    if (error) throw error;
    res.status(200).json(response.rows[0]);
  });
});

//send page info
app.get("/page/:number", async (req: Request, res: Response): Promise<void> => {
  const pageNumber: number = Number(req.params.number);
  let previewArray: PreviewData[] = [];
  const query = {
    name: "get-pokemons-by-page",
    text: "SELECT * FROM pokemons WHERE id >= $1 AND id <= $2",
    values: [24 * pageNumber - 23, 24 * pageNumber],
  };
  postgresClient.query(query, (_error: Error, response: any) => {
    response.rows.forEach((row: any): void => {
      previewArray.push({
        name: row.name,
        front_image: row.front_image,
        back_image: row.back_image,
      });
    });
    res.send(previewArray);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
