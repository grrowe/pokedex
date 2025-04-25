import { PokemonDetails } from "../../utils/types.tsx";
import { Icon, Card, Image, Text, Grid } from "@chakra-ui/react";

import { useState } from "react";

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
  setPokemonDetails: Function;
}

const PokeDetails = ({ pokemon, setPokemonDetails }: PokeDetailsProps) => {
  const imgArr = ["front_default", "back_default", "front_shiny", "back_shiny"];

  const [favorite, setFavorite] = useState(false); // TEMP TILL API IS SET UP
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

  const nextImg = () => {
    if (currentImgIndex + 1 === imgArr.length) {
      console.log("reset");
      setCurrentImgIndex(0);
    } else setCurrentImgIndex(currentImgIndex + 1);
  };

  const lastImg = () => {
    if (currentImgIndex === 0) {
      console.log("reset");
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
            {favorite ? (
              <FaStar
                style={{ color: "yellow", fontSize: "2rem" }}
                onClick={() => {
                  setFavorite(!favorite);
                }}
              />
            ) : (
              <FaRegStar
                style={{ color: "yellow", fontSize: "2rem" }}
                onClick={() => {
                  setFavorite(!favorite);
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
              onClick={() => setPokemonDetails(undefined)}
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
          {pokemon.types.map((type: any) => {
            return <b>{type.type.name} </b>;
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
            {pokemon.stats.map((stat: any) => {
              return (
                <Text
                  textStyle="md"
                  fontWeight="medium"
                  letterSpacing="tight"
                  mt="2"
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
            {pokemon.abilities.map((ability: any) => {
              return (
                <Text
                  textStyle="md"
                  fontWeight="medium"
                  letterSpacing="tight"
                  mt="2"
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
