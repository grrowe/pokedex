export interface Pokemon {
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
}

export interface PokeSearchProps {
  searchInput: string;
  setSearchInput: Function;
  loading: boolean;
}
