import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Pokemon, Type, PokemonDetails } from "../types.tsx";

import { useUser } from "./UserContext.tsx";

import { baseAPI, pokeAPI } from "../api/api.ts";

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
  setPokemonDetails: Function;
  addPokeToFavorites: Function;
  removePokeToFavorites: Function;
  drawer: boolean;
  setDrawer: Function;
};

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [types, setTypes] = useState<Type[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails>();

  const [drawer, setDrawer] = useState<boolean>(false);

  const fetchPokemonListAndFavoritesAndTypes = async () => {
    setLoading(true);
    try {
      const [list, favs, types] = await Promise.all([
        baseAPI.get("/pokemon"),
        baseAPI.get("/favorites"),
        pokeAPI.get(`/type`),
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

  const addPokeToFavorites = (name: string) => {
    let newFavs = [...favorites, name];
    baseAPI
      .post("http://localhost:3001/favorites", newFavs)
      .then((res) => {
        setFavorites(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removePokeToFavorites = (name: string) => {
    let newFavs = favorites.filter((fav: string) => {
      return fav !== name;
    });

    baseAPI
      .post("http://localhost:3001/favorites", newFavs)
      .then((res) => {
        setFavorites(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetState = () => {
    setPokemonDetails(undefined);
    setSearchInput("");
  };

  useEffect(() => {
    if (user) {
      fetchPokemonListAndFavoritesAndTypes();
    }
  }, [user]);

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
        setPokemonDetails: setPokemonDetails,
        addPokeToFavorites: addPokeToFavorites,
        removePokeToFavorites: removePokeToFavorites,
        drawer,
        setDrawer: setDrawer,
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
