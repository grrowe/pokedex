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
  setSearchInput: Function;
}

export interface PokeSearchProps {
  searchInput: string;
  setSearchInput: Function;
  pokemonDetails: PokemonDetails | undefined;
}
