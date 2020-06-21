import React from "react";
import { TypeBubble } from "./atoms/typeBubble";

export const TypeList = ({ types }) => {
  return (
    <ul className="types">
      {types.map(({ type }) => (
        <TypeBubble type={type.name} key={type.name} />
      ))}
    </ul>
  );
};
