import React from "react";
import { TypeList } from "./typeList";
import { Link } from "react-router-dom";

export const PokemonList = ({ pokemon }) => {
  return (
    <React.Fragment>
      {pokemon.map((p, index) => (
        <Link key={index} to={`/pokemon/${p.id}`} className="poke-box">
          {p.sprites.front_default && (
            <img src={p.sprites.front_default} alt={p.name} />
          )}
          <div className="info">
            <div className="name">
              {p.id}. {p.name}
            </div>
            <TypeList types={p.types} />
            {p.evolutions && p.evolutions.length}
          </div>
        </Link>
      ))}
    </React.Fragment>
  );
};
