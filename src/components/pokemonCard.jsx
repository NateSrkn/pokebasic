import React, { useState } from "react";
import { TypeList } from "./typeList";

export const PokemonCard = ({ pokemon }) => {
  const [isShowing, setIsShowing] = useState(true);
  return (
    <React.Fragment>
      <div
        key={pokemon.id}
        className="poke-box"
        onClick={() => setIsShowing(!isShowing)}
      >
        {pokemon.sprites.front_default && (
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        )}
        <div className="info">
          <div className="name">
            {pokemon.id}. {pokemon.name}
          </div>
          <TypeList types={pokemon.types} />
          {isShowing && (
            <div className="evolution-list">
              {pokemon.evolutions &&
                pokemon.evolutions.map((evo, index) => (
                  <div key={evo["species"]["name"] + index}>
                    {evo["evolution_details"][0] &&
                      evo["evolution_details"][0]["min_level"]}{" "}
                    {evo["species"]["name"]}&nbsp;
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
