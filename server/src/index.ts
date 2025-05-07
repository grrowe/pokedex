import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173", // or your actual frontend origin
    credentials: true, // <- allow cookies to be sent/received
  })
);

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

app.get("/users", authenticateToken, async (req: Request, res: Response) => {
  res.status(200).send(users);
});

app.get("/pokemon", authenticateToken, async (req: Request, res: Response) => {
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

app.get("/favorites", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json(favorites);
});

app.post("/favorites", authenticateToken, (req: Request, res: Response) => {
  const data = req.body;

  favorites = data;

  console.log(favorites);

  res.status(201).json({ message: "Favorites updated", data });
});

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send("Bearer TOKEN is not present in request headers");
    return;
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(401).send("Invalid or expired token");
      return;
    }

    const reqWithUser = req as AuthenticatedRequest;
    reqWithUser.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});
