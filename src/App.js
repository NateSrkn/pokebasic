import React, { useEffect, useState, useCallback } from "react";
import { usePrevious } from "./hooks/usePrevious";
import { condensePokeData } from "./helpers/functions";
import { PokemonList } from "./components/pokemonList";
import VisibilityTracker from "./hooks/visibilityTracker";
import "../src/styles/app.scss";

const App = () => {
  const [pokemon, setPokemon] = useState([]);
  const [sliceSize, setSliceSize] = useState(20);
  const incrementSliceSize = 20;
  let prevSliceSize = usePrevious(sliceSize);

  const setData = useCallback(async () => {
    let data = await condensePokeData(prevSliceSize, sliceSize);
    setPokemon((pokemon) => pokemon.concat(data));
  }, [prevSliceSize, sliceSize]);

  useEffect(() => {
    setData();
  }, [setData]);

  const fetchMore = () => {
    setSliceSize((size) => (size += incrementSliceSize));
  };
  if (pokemon.length <= 0) return <div>Loading...</div>;
  return (
    <div className="App">
      <div className="container">
        <PokemonList pokemon={pokemon} />
      </div>
      <VisibilityTracker onVisible={fetchMore}>
        <button
          id="scroll-button"
          className="infinite-button"
          onClick={fetchMore}
        >
          More
        </button>
      </VisibilityTracker>
    </div>
  );
};

export default App;
