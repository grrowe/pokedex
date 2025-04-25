import { PokeSearchProps } from "../../utils/types.tsx";
import { Input, Spinner } from "@chakra-ui/react";

const PokeSearch = ({ searchInput, setSearchInput, loading }: PokeSearchProps) => {
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
      {loading && <Spinner />}
    </>
  );
};

export default PokeSearch;
