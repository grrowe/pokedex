import { PokeListProps, Pokemon } from "../../utils/types.tsx";
import { List } from "@chakra-ui/react";

import { capitalize } from "@/utils/functions.tsx";

const PokeList = ({ pokemon, setSearchInput }: PokeListProps) => {
  return (
    <>
      <List.Root>
        {pokemon &&
          pokemon.map((poke: Pokemon, index: number) => (
            <List.Item
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSearchInput(poke.name);
              }}
            >
              {capitalize(poke.name)}
            </List.Item>
          ))}
      </List.Root>
    </>
  );
};

export default PokeList;
