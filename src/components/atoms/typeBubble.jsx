import React from "react";

export const TypeBubble = ({ type }) => {
  let types = {
    normal: "#A8A878",
    fire: "#F08030",
    fighting: "#C03028",
    water: "#6890F0",
    flying: "#A890F0",
    grass: "#78C850",
    poison: "#A040A0",
    electric: "#F8D030",
    ground: "#E0C068",
    psychic: "#F85888",
    rock: "#B8A038",
    ice: "#98D8D8",
    bug: "#A8B820",
    dragon: "#7038F8",
    ghost: "#705898",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };

  return (
    <li style={{ backgroundColor: types[type] }} className="type">
      {type}
    </li>
  );
};
