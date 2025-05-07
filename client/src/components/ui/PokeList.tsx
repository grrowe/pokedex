import { PokeListProps, Pokemon } from "../../utils/types.tsx";
import { List, Icon } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

import { capitalize } from "@/utils/functions.tsx";

import { usePokemon } from "../../utils/contexts/PokeContext.tsx";

const PokeList = ({ setSearchInput }: PokeListProps) => {
  const { pokemon, favorites, typeFilter } = usePokemon();

  const favoritePokemons = favorites.filter(
    (name) => !pokemon.some((poke: Pokemon) => poke.name === name)
  );

  const filteredPokemon = pokemon.filter((poke: Pokemon) => {
    let ret = false;
    if (poke.types) {
      for (let i = 0; i < poke.types.length; i++) {
        if (typeFilter.includes(poke.types[i])) {
          ret = true;
        }
      }
    }
    return ret;
  });

  const allPokemon = [
    ...favoritePokemons.map((name) => ({ name, isFavorite: true })),
    ...filteredPokemon.map((poke) => ({
      ...poke,
      isFavorite: favorites.includes(poke.name),
    })),
  ];

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedPokemon = allPokemon
    .sort((a: Pokemon, b: Pokemon) => {
      const isAFavorite = favorites.includes(a.name);
      const isBFavorite = favorites.includes(b.name);

      if (isAFavorite && !isBFavorite) return -1;
      if (!isAFavorite && isBFavorite) return 1;

      return a.name.localeCompare(b.name);
    })
    .slice(startIndex, endIndex);

  const totalPages = Math.ceil(allPokemon.length / itemsPerPage);

  return (
    <>
      <List.Root>
        {paginatedPokemon
          .sort((a: Pokemon, b: Pokemon) => {
            const isAFavorite = favorites.includes(a.name);
            const isBFavorite = favorites.includes(b.name);

            if (isAFavorite && !isBFavorite) return -1;
            if (!isAFavorite && isBFavorite) return 1;

            return a.name.localeCompare(b.name);
          })
          .map((poke: Pokemon, index: number) => (
            <List.Item
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSearchInput(poke.name);
              }}
            >
              {favorites.includes(poke.name) && (
                <Icon size="xs">
                  <FaStar style={{ color: "yellow", fontSize: "2rem" }} />
                </Icon>
              )}
              <span style={{ paddingLeft: 5 }}>{capitalize(poke.name)}</span>
            </List.Item>
          ))}
      </List.Root>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default PokeList;
