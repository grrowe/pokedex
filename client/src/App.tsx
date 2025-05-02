import "./App.css";

import Pokedex from "./components/ui/pokedex/pokedex.tsx";
import { usePokemon } from "./utils/PokeContext.tsx";
import { Image, Box } from "@chakra-ui/react";

function App() {
  const { setPokemonDetails } = usePokemon();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        w="1/2"
        onClick={() => {
          setPokemonDetails(undefined);
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-10%",
          cursor: "pointer",
        }}
      >
        <Image src="/pokelogo.png" alt="Pokemon" />
      </Box>
      <Box>
        <Pokedex />
      </Box>
    </div>
  );
}

export default App;
