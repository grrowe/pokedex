export interface Pokemon {
  name: string;
  types?: string[];
  isFavorite?: boolean;
}

export interface Type {
  name: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  abilities: any;
  sprites?: any;
  sprite?: any;
  types: any;
  stats: any;
  height: number;
  weight: number;
  isFavorite?: boolean;
  order: number;
  moves: any;
}

export interface PokeListProps {
  setSearchInput: Function;
}

export interface PokeSearchProps {
  searchInput: string;
  setSearchInput: Function;
  pokemonDetails: PokemonDetails | undefined;
}

export interface User {
  id: number;
  username: string;
}
