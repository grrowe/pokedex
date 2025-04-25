import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Pokemon, Type, PokemonDetails } from "./types.tsx";

type PokemonContextType = {
  pokemon: Pokemon[];
  favorites: any[];
  loading: boolean;
  types: any[];
  typeFilter: string[];
  setTypeFilter: Function;
  setFavorites: Function;
  resetState: Function;
  searchInput: string;
  setSearchInput: Function;
  pokemonDetails: PokemonDetails | undefined;
};

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [types, setTypes] = useState<Type[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails>();

  const [visitedPokemon, setVisitedPokemon] = useState<any>({});

  const fetchPokemonListAndFavoritesAndTypes = async () => {
    setLoading(true);
    try {
      const [list, favs, types] = await Promise.all([
        axios.get("http://localhost:3001/pokemon"),
        axios.get("http://localhost:3001/favorites"),
        axios.get(`https://pokeapi.co/api/v2/type`),
      ]);

      setPokemon(list.data);
      setFavorites(favs.data);

      let data = types?.data.results;
      setTypes(data);

      let filters = data.map((filter: Type) => {
        return filter.name;
      });

      setTypeFilter(filters);
    } catch (error) {
      console.error(error);
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

  const fetchPokemonSearch = async (searchTerm: string) => {
    try {
      let returnData;
      if (visitedPokemon[searchTerm]) {
        returnData = visitedPokemon[searchTerm];
      } else {
        let response = await axios.get(
          `http://localhost:3001/pokemon/${searchTerm}`
        );
        returnData = response?.data;
        setVisitedPokemon({
          ...visitedPokemon,
          [response?.data.name]: response.data,
        });
      }

      setPokemonDetails(returnData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const debouncedFetchPokemon = debounce(fetchPokemonSearch, 1000);

  const resetState = () => {
    setPokemonDetails(undefined);
    setSearchInput("");
  };

  useEffect(() => {
    fetchPokemonListAndFavoritesAndTypes();
  }, []);

  useEffect(() => {
    if (searchInput) {
      debouncedFetchPokemon(searchInput);
    } else {
      setPokemonDetails(undefined);
    }
  }, [searchInput]);

  return (
    <PokemonContext.Provider
      value={{
        pokemon,
        favorites,
        loading,
        types,
        typeFilter,
        searchInput,
        pokemonDetails,
        setTypeFilter: setTypeFilter,
        setFavorites: setFavorites,
        resetState: resetState,
        setSearchInput: setSearchInput,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (!context)
    throw new Error("usePokemon must be used within a PokemonProvider");
  return context;
};
