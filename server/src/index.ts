import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let favorites: string[] = [];

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  name: string;
  abilities: { ability: { name: string } }[];
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

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
        abilities: detailsResponse.data.abilities.map((a) => a.ability.name),
        types: detailsResponse.data.types.map((t) => t.type.name),
        sprite: detailsResponse.data.sprites.front_default,
      };
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    res.json(pokemonDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching Pokemon data");
  }
});

app.get("/pokemon/:searchTerm", async (req: Request, res: Response) => {
  const { searchTerm } = req.params;

  try {
    const response = await axios.get<any>(
      `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res
        .status(404)
        .send(`Pokemon with the name or ID "${searchTerm}" not found.`);
    } else {
      res.status(500).send("Error fetching Pokemon data");
    }
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
