import "./Pokedex.css";
import { useState } from "react";

import { Pokemon } from "../../../utils/types.tsx";
import { usePokemon } from "../../../utils/contexts/PokeContext.tsx";
import { useUser } from "../../../utils/contexts/UserContext.tsx";

import { Icon, Box, Input } from "@chakra-ui/react";

import { Tooltip } from "@/components/ui/tooltip";

import { capitalize } from "@/utils/functions.tsx";

import { FaStar } from "react-icons/fa";

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
    setDrawer,
    drawer,
  } = usePokemon();

  const { user } = useUser();

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

  return (
    <div className="pokedex z-1 bg-[#242424]">
      <div>{user && user.username}</div>
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
                    style={{ height: "150px", width: "150px" }}
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
              ? `#${pokemonDetails.order} ${capitalize(pokemonDetails.name)}`
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
            <Tooltip content="This button doesn't do anything!">
              <div className="dpad-up" />
            </Tooltip>

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
            <Tooltip content="This button doesn't do anything!">
              <div className="dpad-down" />
            </Tooltip>
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
            <h2>Abilities</h2>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              {pokemonDetails.abilities.map((a: any) => {
                return (
                  <a
                    key={a.ability.name}
                    target="_blank"
                    href={`${a.ability.url}`}
                  >
                    {a.ability.name}
                  </a>
                );
              })}
            </div>
            <h2>Moves</h2>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              {pokemonDetails.moves.map((m: any) => {
                return (
                  <a key={m.move.name} target="_blank" href={`${m.move.url}`}>
                    {m.move.name}
                  </a>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="right-screen">
            {/* LIST */}
            <>
              <h2 style={{ marginBottom: "5px" }}>Pokemon</h2>
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
                onClick={() => setDrawer(!drawer)}
              >
                <div className="filter-icon-container">
                  <svg
                    className="filter-icon-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#003300"
                    width="16px"
                    height="16px"
                  >
                    <path d="M3 4h18v2H3V4zm4 6h10v2H7v-2zm4 6h2v2h-2v-2z" />
                  </svg>
                </div>
              </button>
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
