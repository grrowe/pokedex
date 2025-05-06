import "./App.css";

import { useUser } from "./utils/UserContext.tsx";
import { usePokemon } from "./utils/PokeContext.tsx";
import { Image, Box } from "@chakra-ui/react";

import Pokedex from "./components/ui/pokedex/pokedex.tsx";
import FilterDrawer from "./components/ui/Drawer/index.tsx";
import PixelArtBackground from "./components/ui/PokePixelBG/index.tsx";
import LoginForm from "./components/ui/LoginForm/index.tsx";
import SignupForm from "./components/ui/SignupForm/index.tsx";

function App() {
  const { user, isSigningUp } = useUser();
  const { setPokemonDetails, setSearchInput } = usePokemon();

  console.log(user);
  return (
    <>
      <PixelArtBackground />
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
            setSearchInput("");
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "-10%",
            cursor: "pointer",
          }}
        >
          <Image src="/pokelogo.png" alt="Pokemon" zIndex={1} />
        </Box>
        <Box zIndex={1}>
          {user ? (
            <>
              <FilterDrawer />
              <Pokedex />
            </>
          ) : (
            <>{isSigningUp ? <SignupForm /> : <LoginForm />}</>
          )}
        </Box>
      </div>
    </>
  );
}

export default App;
