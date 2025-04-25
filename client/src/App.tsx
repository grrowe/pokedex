import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import { Pokemon, PokemonDetails } from "./utils/types.tsx";
import PokeList from "./components/ui/pokeList";
import PokeSearch from "./components/ui/PokeSearch.tsx";
import PokeDetails from "./components/ui/PokeDetails.tsx";

function App() {
  const [pokemonState, setPokemonState] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState<string>("");
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails>();

  const fetchPokemonSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      let response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
      );

      setPokemonDetails(response?.data);
    } catch {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    axios
      .get("https://pokeapi.co/api/v2/pokemon")
      .then((response) => {
        setPokemonState(response?.data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
      />

      {pokemonDetails ? (
        <PokeDetails pokemon={pokemonDetails} setPokemonDetails={setPokemonDetails} />
      ) : (
        <PokeList pokemon={pokemonState} setSearchInput={setSearchInput} />
      )}
    </>
  );
}

export default App;
