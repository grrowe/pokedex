import { PokemonDetails } from "../../utils/types.tsx";
import { Icon, Card, Image, Text, Grid } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

import {
  FaRegStar,
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";

import { capitalize } from "@/utils/functions.tsx";

interface PokeDetailsProps {
  pokemon: PokemonDetails;
  resetState: Function;
  favorites: string[];
  setFavorites: Function;
}

const PokeDetails = ({
  pokemon,
  resetState,
  favorites,
  setFavorites,
}: PokeDetailsProps) => {
  const imgArr = ["front_default", "back_default", "front_shiny", "back_shiny"];

  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

  const addPokeToFavorites = (name: string) => {
    let newFavs = [...favorites, name];
    axios
      .post("http://localhost:3001/favorites", newFavs)
      .then((res) => {
        setFavorites(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removePokeToFavorites = (name: string) => {
    let newFavs = favorites.filter((fav: string) => {
      return fav !== name;
    });

    axios
      .post("http://localhost:3001/favorites", newFavs)
      .then((res) => {
        setFavorites(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  return (
    <Card.Root maxW="lg" overflow="hidden">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ padding: 10, cursor: "pointer" }}>
          <Icon size="lg">
            {favorites.includes(pokemon.name) ? (
              <FaStar
                style={{ color: "yellow", fontSize: "2rem" }}
                onClick={() => {
                  removePokeToFavorites(pokemon.name);
                }}
              />
            ) : (
              <FaRegStar
                style={{ color: "yellow", fontSize: "2rem" }}
                onClick={() => {
                  addPokeToFavorites(pokemon.name);
                }}
              />
            )}
          </Icon>
        </div>{" "}
        <div style={{ padding: 10, cursor: "pointer" }}>
          <Icon size="lg">
            <FaTimes
              style={{
                color: "red",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              onClick={() => resetState()}
            />
          </Icon>
        </div>{" "}
      </div>

      <Image
        src={pokemon.sprites[imgArr[currentImgIndex]]}
        alt={pokemon.name}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaArrowLeft
          style={{
            cursor: "pointer",
            fontSize: "1rem",
            marginRight: "10px",
          }}
          onClick={() => {
            lastImg();
          }}
        />
        <FaArrowRight
          style={{
            cursor: "pointer",
            fontSize: "1rem",
            marginLeft: "10px",
          }}
          onClick={() => {
            nextImg();
          }}
        />
      </div>
      <Card.Body gap="2">
        <Card.Title>{capitalize(pokemon.name)}</Card.Title>
        <Card.Description>
          {capitalize(pokemon.name)} is a{" "}
          {pokemon.types.map((type: any, index: number) => {
            return <b key={`name-${index}`}>{type.type.name} </b>;
          })}{" "}
          type of pokemon.
        </Card.Description>

        <Grid templateColumns="repeat(2, 1fr)" gap="6">
          <div>
            <Text
              textStyle="2xl"
              fontWeight="medium"
              letterSpacing="tight"
              mt="2"
            >
              Stats:
            </Text>
            {pokemon.stats.map((stat: any, index: number) => {
              return (
                <Text
                  textStyle="md"
                  fontWeight="medium"
                  letterSpacing="tight"
                  mt="2"
                  key={`stat-${index}`}
                >
                  {`${stat.stat.name}: ${stat.base_stat}`}
                </Text>
              );
            })}
          </div>
          <div>
            <Text
              textStyle="2xl"
              fontWeight="medium"
              letterSpacing="tight"
              mt="2"
            >
              Abilities:
            </Text>
            {pokemon.abilities.map((ability: any, index: number) => {
              return (
                <Text
                  textStyle="md"
                  fontWeight="medium"
                  letterSpacing="tight"
                  mt="2"
                  key={`ability-${index}`}
                >
                  {ability.ability.name}
                </Text>
              );
            })}
          </div>
        </Grid>
      </Card.Body>
      <Card.Footer gap="2"></Card.Footer>
    </Card.Root>
  );
};

export default PokeDetails;
