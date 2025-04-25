import "./App.css";

import PokeList from "./components/ui/pokeList.tsx";
import PokeSearch from "./components/ui/PokeSearch.tsx";
import PokeDetails from "./components/ui/PokeDetails.tsx";
import { usePokemon } from "./utils/PokeContext.tsx";

function App() {
  const { searchInput, setSearchInput, resetState, pokemonDetails } = usePokemon();
  return (
    <>
      <PokeSearch
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        pokemonDetails={pokemonDetails}
      />

      {pokemonDetails ? (
        <PokeDetails pokemonDetails={pokemonDetails} resetState={resetState} />
      ) : (
        <PokeList setSearchInput={setSearchInput} />
      )}
    </>
  );
}

export default App;
