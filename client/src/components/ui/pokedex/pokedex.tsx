import "./Pokedex.css";
import { useState } from "react";

import { Pokemon } from "../../../utils/types.tsx";
import { usePokemon } from "../../../utils/PokeContext.tsx";

import { Icon, Heading, Box, Input } from "@chakra-ui/react";

import { capitalize } from "@/utils/functions.tsx";

import { FaStar } from "react-icons/fa";

type PokemonData = {
  name: string;
  type: string;
  height: string;
  weight: string;
  description: string;
  imageUrl: string;
};

const mockData: PokemonData = {
  name: "Pikachu",
  type: "Electric",
  height: "0.4m",
  weight: "6.0kg",
  description: "It keeps its tail raised to monitor its surroundings.",
  imageUrl:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
};

const Pokedex = () => {
  const {
    pokemon,
    favorites,
    typeFilter,
    setPokemonDetails,
    pokemonDetails,
    searchInput,
    setSearchInput,
    addPokeToFavorites,
    removePokeToFavorites,
  } = usePokemon();

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

  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

  const imgArr = ["front_default", "back_default", "front_shiny", "back_shiny"];
  const nextImg = () => {
    if (currentImgIndex + 1 === imgArr.length) {
      setCurrentImgIndex(0);
    } else setCurrentImgIndex(currentImgIndex + 1);
  };

  const lastImg = () => {
    if (currentImgIndex === 0) {
      setCurrentImgIndex(imgArr.length - 1);
    } else setCurrentImgIndex(currentImgIndex - 1);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const allPokemon: Pokemon[] = [
    ...favoritePokemons.map((name) => ({ name, isFavorite: true })),
    ...filteredPokemon.map((poke) => ({
      ...poke,
      isFavorite: favorites.includes(poke.name),
    })),
  ];

  const visiblePokemon = allPokemon.filter((p) =>
    p.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const sortedPokemon = visiblePokemon.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.name.localeCompare(b.name);
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPokemon = sortedPokemon.slice(startIndex, endIndex);

  const totalPages = Math.ceil(visiblePokemon.length / itemsPerPage);

  console.log(pokemonDetails);

  return (
    <div className="pokedex">
      <div className="pokedex-left">
        <div className="screen">
          <div
            className="pokemon-image"
            key={pokemonDetails ? pokemonDetails.name : null}
          >
            <div className="pokemon-image-container">
              {pokemonDetails ? (
                <>
                  {pokemonDetails.isFavorite && (
                    <FaStar className="favorite-star" />
                  )}
                  <img
                    src={pokemonDetails.sprite[imgArr[currentImgIndex]]}
                    alt={pokemonDetails.name}
                  />
                </>
              ) : (
                <img src="/question.png" alt="Question Mark" />
              )}
            </div>
          </div>

          <div className="pokemon-name">
            {pokemonDetails
              ? capitalize(pokemonDetails.name)
              : "Please select a pokemon!"}
          </div>
          {!pokemonDetails && (
            <Input
              placeholder="Search for a pokemon"
              variant="flushed"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
          )}
        </div>

        <div className="controls">
          <div className="dpad">
            <div className="dpad-up" />
            <div className="dpad-middle">
              <div
                className="dpad-left"
                onClick={() => {
                  lastImg();
                }}
              />
              <div className="dpad-center" />
              <div
                className="dpad-right"
                onClick={() => {
                  nextImg();
                }}
              />
            </div>
            <div className="dpad-down" />
          </div>
        </div>
      </div>

      <div className="pokedex-right">
        {pokemonDetails ? (
          <div className="right-screen">
            {/* DETAILS */}
            <p>
              <strong>Type:</strong>{" "}
              {pokemonDetails.types.map((type: any, index: number) => {
                return <b key={`name-${index}`}>{type} </b>;
              })}
            </p>
            <p>
              <strong>Height:</strong> {`${pokemonDetails.height / 10} m`}
            </p>
            <p>
              <strong>Weight:</strong> {`${pokemonDetails.weight / 10} kg`}
            </p>
          </div>
        ) : (
          <div className="right-screen">
            {/* LIST */}
            <>
              <Heading size="lg">Pokemon</Heading>
              <Box as="ul" className="pokelist">
                {paginatedPokemon
                  .sort((a: Pokemon, b: Pokemon) => {
                    const isAFavorite = favorites.includes(a.name);
                    const isBFavorite = favorites.includes(b.name);

                    if (isAFavorite && !isBFavorite) return -1;
                    if (!isAFavorite && isBFavorite) return 1;

                    return a.name.localeCompare(b.name);
                  })
                  .map((poke: Pokemon, index: number) => (
                    <li
                      key={index}
                      className="pokelist-item"
                      onClick={() => {
                        // setSearchInput(poke.name);
                        setPokemonDetails(poke);
                      }}
                    >
                      {poke.isFavorite && (
                        <Icon size="xs">
                          <FaStar
                            style={{ color: "orange", fontSize: "2rem" }}
                          />
                        </Icon>
                      )}
                      <span style={{ paddingLeft: 5 }}>
                        {capitalize(poke.name)}
                      </span>
                    </li>
                  ))}
              </Box>
            </>

            {totalPages && (
              <span
                style={{ marginTop: "10px" }}
              >{`${currentPage} / ${totalPages}`}</span>
            )}
          </div>
        )}

        <div className="buttons">
          {/* pagination */}
          {pokemonDetails ? (
            <>
              <button
                className="yellow-button"
                onClick={() => {
                  if (pokemonDetails.isFavorite) {
                    removePokeToFavorites(pokemonDetails.name);
                  } else {
                    addPokeToFavorites(pokemonDetails.name);
                  }
                  pokemonDetails.isFavorite = !pokemonDetails.isFavorite;
                }}
              >
                {pokemonDetails.isFavorite ? "Unfavorite" : "Favorite"}
              </button>
              <button
                className="blue-button"
                onClick={() => {
                  setPokemonDetails(undefined);
                }}
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                className="yellow-button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >{`<`}</button>
              <button
                className="yellow-button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >{`>`}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
