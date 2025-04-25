import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Pokemon, Type } from "./types.tsx";

type PokemonContextType = {
  pokemon: Pokemon[];
  favorites: any[];
  loading: boolean;
  types: any[];
  typeFilter: string[];
  refreshData: () => void;
  setTypeFilter: Function;
  setFavorites: Function
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

  const fetchPokemonListAndFavorites = async () => {
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

  useEffect(() => {
    fetchPokemonListAndFavorites();
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        pokemon,
        favorites,
        loading,
        types,
        typeFilter,
        refreshData: fetchPokemonListAndFavorites,
        setTypeFilter: setTypeFilter,
        setFavorites: setFavorites
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
