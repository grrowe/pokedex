import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import { PokemonDetails, Type } from "./utils/types.tsx";
import PokeList from "./components/ui/pokeList.tsx";
import PokeSearch from "./components/ui/PokeSearch.tsx";
import PokeDetails from "./components/ui/PokeDetails.tsx";

function App() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails>();

  const fetchPokemonSearch = async (searchTerm: string) => {
    try {
      let response = await axios.get(
        `http://localhost:3001/pokemon/${searchTerm}`
      );

      setPokemonDetails(response?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
        pokemonDetails={pokemonDetails}
      />

      {pokemonDetails ? (
        <PokeDetails pokemonDetails={pokemonDetails} resetState={resetState} />
      ) : (
        <PokeList setSearchInput={setSearchInput} />
      )}
    </>
  );
}

export default App;
