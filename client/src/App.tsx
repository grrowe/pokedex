import "./App.css";

import Pokedex from "./components/ui/pokedex/pokedex.tsx";
import { usePokemon } from "./utils/PokeContext.tsx";
import { Image, Box, Drawer, Portal, Button, Checkbox } from "@chakra-ui/react";

function App() {
  const {
    setPokemonDetails,
    drawer,
    setDrawer,
    types,
    typeFilter,
    setTypeFilter,
    setSearchInput,
  } = usePokemon();
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
        <Image src="/pokelogo.png" alt="Pokemon" />
      </Box>
      <Box>
        <Drawer.Root open={drawer}>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Pokemon Type Filter</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  {types.map((type: any, index: number) => {
                    return (
                      <div>
                        <Checkbox.Root
                          key={index}
                          variant="outline"
                          colorPalette={"yellow"}
                          style={{ padding: 5 }}
                          checked={typeFilter.includes(type.name)}
                          onCheckedChange={(details: any) => {
                            if (!details.checked) {
                              let newFilters = typeFilter.filter(
                                (t: string) => {
                                  if (t === type.name) return false;
                                  return true;
                                }
                              );
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
                      </div>
                    );
                  })}
                </Drawer.Body>
                <Drawer.Footer>
                  <Button
                    variant="outline"
                    onClick={() => setDrawer(!setDrawer)}
                  >
                    Cancel
                  </Button>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
        <Pokedex />
      </Box>
    </div>
  );
}

export default App;
