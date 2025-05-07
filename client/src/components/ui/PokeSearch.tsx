import { PokeSearchProps, Type } from "../../utils/types.tsx";
import { Input, Spinner, Checkbox } from "@chakra-ui/react";

import { usePokemon } from "../../utils/contexts/PokeContext.tsx";

const PokeSearch = ({
  searchInput,
  setSearchInput,
  pokemonDetails,
}: PokeSearchProps) => {
  const { loading, types, typeFilter, setTypeFilter } = usePokemon();

  return (
    <>
      <Input
        placeholder="Search your favorite Pokemon!"
        variant="subtle"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
      />

      {!pokemonDetails &&
        types.map((type: Type, index: number) => {
          return (
            <Checkbox.Root
              key={index}
              variant="outline"
              colorPalette={"yellow"}
              style={{ padding: 5 }}
              checked={typeFilter.includes(type.name)}
              onCheckedChange={(details: any) => {
                if (!details.checked) {
                  let newFilters = typeFilter.filter((t: string) => {
                    if (t === type.name) return false;
                    return true;
                  });
                  setTypeFilter(newFilters);
                }
                if (details.checked) {
                  setTypeFilter([...typeFilter, type.name]);
                }
              }}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>{type.name}</Checkbox.Label>
            </Checkbox.Root>
          );
        })}

      {loading && <Spinner />}
    </>
  );
};

export default PokeSearch;
