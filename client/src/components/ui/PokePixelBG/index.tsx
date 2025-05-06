import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PixelArtBackgroundProps {
  className?: string;
}

interface PixelPokemon {
  id: number;
  x: number;
  y: number;
  type: "pikachu" | "bulbasaur" | "charmander" | "squirtle" | "pokeball";
  scale: number;
  rotation: number;
  blinking: boolean;
}

const PixelArtBackground: React.FC<PixelArtBackgroundProps> = ({
  className = "",
}) => {
  const [pokemons, setPokemons] = useState<PixelPokemon[]>([]);

  useEffect(() => {
    // Generate random Pokemon silhouettes
    const types = [
      "pikachu",
      "bulbasaur",
      "charmander",
      "squirtle",
      "pokeball",
    ];
    const generatedPokemons: PixelPokemon[] = [];

    for (let i = 0; i < 15; i++) {
      generatedPokemons.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        type: types[
          Math.floor(Math.random() * types.length)
        ] as PixelPokemon["type"],
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 10 - 5,
        blinking: false,
      });
    }

    setPokemons(generatedPokemons);

    // Set up blinking interval
    const blinkInterval = setInterval(() => {
      setPokemons((prev) => {
        const newPokemons = [...prev];
        const randomIndex = Math.floor(Math.random() * newPokemons.length);
        newPokemons[randomIndex] = {
          ...newPokemons[randomIndex],
          blinking: !newPokemons[randomIndex].blinking,
        };
        return newPokemons;
      });
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const getPokemonSilhouette = (type: string) => {
    switch (type) {
      case "pikachu":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <path
              d="M10,8 L14,4 L18,4 L22,8 L24,14 L22,18 L26,22 L26,26 L22,28 L18,28 L14,28 L10,26 L8,22 L6,24 L4,22 L6,18 L8,14 L10,8"
              fill="currentColor"
            />
          </svg>
        );
      case "bulbasaur":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <path
              d="M12,6 L20,6 L24,10 L24,18 L20,22 L16,22 L16,26 L12,26 L8,22 L8,10 L12,6"
              fill="currentColor"
            />
          </svg>
        );
      case "charmander":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <path
              d="M14,4 L18,4 L22,8 L22,16 L26,20 L22,24 L18,24 L14,28 L10,24 L10,16 L6,12 L10,8 L14,4"
              fill="currentColor"
            />
          </svg>
        );
      case "squirtle":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <path
              d="M12,8 L20,8 L24,12 L24,20 L20,24 L12,24 L8,20 L8,12 L12,8"
              fill="currentColor"
            />
          </svg>
        );
      case "pokeball":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="12" fill="currentColor" />
            <rect x="4" y="14" width="24" height="4" fill="#172554" />
            <circle cx="16" cy="16" r="4" fill="#172554" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none bg-blue-950 ${className} z-0`}
    >
      {pokemons.map((pokemon) => (
        <motion.div
          key={pokemon.id}
          className={`absolute ${pokemon.blinking ? "opacity-70" : "opacity-30"} text-blue-300`}
          style={{
            left: `${pokemon.x}%`,
            top: `${pokemon.y}%`,
            width: `${pokemon.scale * 64}px`,
            height: `${pokemon.scale * 64}px`,
          }}
          animate={{
            rotate: pokemon.rotation,
            scale: pokemon.blinking ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {getPokemonSilhouette(pokemon.type)}
        </motion.div>
      ))}

      {/* Grid overlay to create pixel effect */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(16, 24, 64, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 24, 64, 0.1) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />

      {/* CRT scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent, transparent 50%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.4))",
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
};

export default PixelArtBackground;
