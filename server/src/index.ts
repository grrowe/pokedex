import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import bcrypt from "bcrypt";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let favorites: string[] = [];

interface User {
  id: number;
  username: any;
  password: any;
}

const users: Array<User> = [];

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  name: string;
  abilities: { ability: { name: string } }[];
  types: { type: { name: string } }[];
  sprites: { front_default: string };
  height: number;
  order: number;
  weight: number;
  moves: { moves: { name: string } }[];
}

app.post("/users", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    const user = {
      id: users.length + 1,
      username: req.body.username,
      password: hashedPassword,
    };

    users.push(user);

    res.status(201).send(user);
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req: any, res: any) => {
  const user = users.find((user) => user.username === req.body.username);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send(user);
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.get("/pokemon", async (req: Request, res: Response) => {
  try {
    const response = await axios.get<{ results: Pokemon[] }>(
      "https://pokeapi.co/api/v2/pokemon?limit=151"
    );

    const pokemonList = response.data.results;

    const pokemonDetailsPromises = pokemonList.map(async (pokemon) => {
      const detailsResponse = await axios.get<PokemonDetails>(pokemon.url);

      return {
        name: pokemon.name,
        abilities: detailsResponse.data.abilities,
        types: detailsResponse.data.types.map((t) => t.type.name),
        sprite: detailsResponse.data.sprites,
        height: detailsResponse.data.height,
        order: detailsResponse.data.order,
        weight: detailsResponse.data.weight,
        moves: detailsResponse.data.moves,
      };
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    res.json(pokemonDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching Pokemon data");
  }
});

app.get("/favorites", (req: Request, res: Response) => {
  res.status(200).json(favorites);
});

app.post("/favorites", (req: Request, res: Response) => {
  const data = req.body;

  favorites = data;

  console.log(favorites);

  res.status(201).json({ message: "Favorites updated", data });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
