import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import { Pokemon, PokemonDetails, Type } from "./utils/types.tsx";
import PokeList from "./components/ui/pokeList.tsx";
import PokeSearch from "./components/ui/PokeSearch.tsx";
import PokeDetails from "./components/ui/PokeDetails.tsx";

function App() {
  const [pokemonState, setPokemonState] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState<string>("");
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails>();

  const [favorites, setFavorites] = useState<string[]>([]);

  const [types, setTypes] = useState<Type[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const fetchPokemonSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      let response = await axios.get(
        `http://localhost:3001/pokemon/${searchTerm}`
      );

      setPokemonDetails(response?.data);
    } catch {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPokeTypes = async () => {
    try {
      let response = await axios.get(`https://pokeapi.co/api/v2/type`);

      let data = response?.data.results;
      setTypes(data);

      let filters = data.map((filter: Type) => {
        return filter.name;
      });

      setTypeFilter(filters);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPokemonListAndFavorites = async () => {
    setLoading(true);
    try {
      let list = await axios.get("http://localhost:3001/pokemon");
      let favorites = await axios.get("http://localhost:3001/favorites");

      setFavorites(favorites.data);
      setPokemonState(list?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setPokemonDetails(undefined);
    setSearchInput("");
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchPokemon = debounce(fetchPokemonSearch, 1000);

  useEffect(() => {
    fetchPokemonListAndFavorites();
    fetchPokeTypes();
  }, []);

  useEffect(() => {
    if (searchInput) {
      debouncedFetchPokemon(searchInput);
    } else {
      setPokemonDetails(undefined);
    }
  }, [searchInput]);

  return (
    <>
      <PokeSearch
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        loading={loading}
        types={types}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        pokemonDetails={pokemonDetails}
      />

      {pokemonDetails ? (
        <PokeDetails
          pokemon={pokemonDetails}
          resetState={resetState}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      ) : (
        <PokeList
          pokemon={pokemonState}
          setSearchInput={setSearchInput}
          favorites={favorites}
          typeFilter={typeFilter}
        />
      )}
    </>
  );
}

export default App;
