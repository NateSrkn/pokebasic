import React, { useState } from "react";
import { TypeList } from "./typeList";
import { PokemonCard } from "./pokemonCard";

export const PokemonList = ({ pokemon }) => {
  return (
    <React.Fragment>
      {pokemon.map((p) => (
        <React.Fragment>
          <PokemonCard pokemon={p} />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};
