export interface Pokemon {
  name: string;
  types?: string[];
}

export interface Type {
  name: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  abilities: any;
  sprites: any;
  types: any;
  stats: any;
}

export interface PokeListProps {
  pokemon: Pokemon[];
  setSearchInput: Function;
  favorites: string[];
  typeFilter: string[];
}

export interface PokeSearchProps {
  searchInput: string;
  setSearchInput: Function;
  loading: boolean;
  types: Type[];
  typeFilter: string[];
  setTypeFilter: Function;
  pokemonDetails: PokemonDetails | undefined;
}
