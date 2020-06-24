import axios from "axios";

const baseURL = `https://pokeapi.co/api/v2`;
let pokemonUrls;
let typeUrls;
let typeList;
const urlLists = {
  pokemon: async () => {
    let {
      data: { count },
    } = await axios.get(`${baseURL}/pokemon`);
    let config = {
      baseURL,
      url: "pokemon",
      method: "get",
      params: {
        limit: count,
      },
    };
    let { data } = await axios(config);
    return urlCondense(data["results"]);
  },
  species: (list) => {
    let species = list.map(({ species }) => species);
    return urlCondense(species);
  },
  evolutions: (list) => {
    let evolutions = list.map(({ evolution_chain }) => evolution_chain);
    return urlCondense(evolutions);
  },
  types: async () => {
    let { data } = await axios.get(`${baseURL}/type`);
    return urlCondense(data["results"]);
  },
};

const duplicateCheck = (arr) => {
  return [...new Set(arr)];
};

const urlCondense = (arr) => {
  let urls = [];
  arr.map((res) => (urls = [...urls, res.url]));
  return duplicateCheck(urls);
};

const createPromiseChain = (urls, prevSlice, sliceSize) => {
  let promises = [];
  if (prevSlice || sliceSize) {
    urls
      .slice(prevSlice, sliceSize)
      .map((url) => (promises = [...promises, axios.get(url)]));
  } else {
    urls.map((url) => (promises = [...promises, axios.get(url)]));
  }
  return promises;
};

const fetchPokemon = async (prevSlice, sliceSize) => {
  if (!pokemonUrls) pokemonUrls = await urlLists.pokemon();
  let promises = createPromiseChain(pokemonUrls, prevSlice, sliceSize);
  return await Promise.all(promises)
    .then((res) => res.map(({ data: pokemon }) => pokemon))
    .then(async (pokemon) => {
      let species = await fetchSpecies(pokemon);
      let evolutions = await fetchEvolutions(species);
      return {
        pokemon,
        species,
        evolutions,
      };
    });
};

const fetchSpecies = async (pokemon, prevSlice, sliceSize) => {
  let urls = urlLists.species(pokemon);
  let promises = createPromiseChain(urls, prevSlice, sliceSize);
  return await Promise.all(promises).then((res) => res.map(({ data }) => data));
};

const fetchEvolutions = async (list, prevSlice, sliceSize) => {
  let urls = urlLists.evolutions(list);
  let promises = createPromiseChain(urls, prevSlice, sliceSize);
  return await Promise.all(promises).then((res) => res.map(({ data }) => data));
};

let condenseEvolutions = (map, ele) => {
  let evolution_data = ele["chain"];
  let evo_chain = [];
  if (evolution_data["evolves_to"].length > 1) {
    evolution_data["evolves_to"].map(
      (evo) => (evo_chain = [...evo_chain, evo])
    );
  } else {
    do {
      evo_chain = [...evo_chain, evolution_data];
      evolution_data = evolution_data["evolves_to"][0];
    } while (evolution_data && evolution_data.hasOwnProperty("evolves_to"));
  }

  map = [...map, evo_chain];
  return map;
};

export const fetchTypes = async () => {
  if (!typeUrls) typeUrls = await urlLists.types();
  let promises = createPromiseChain(typeUrls);
  typeList = await Promise.all(promises).then((res) =>
    res.map(({ data }) => data)
  );
  let types = typeList.reduce((obj, type) => {
    obj = [
      ...obj,
      {
        name: type["name"],
        double_damage_from: type["damage_relations"]["double_damage_from"],
        double_damage_to: type["damage_relations"]["double_damage_to"],
        half_damage_from: type["damage_relations"]["half_damage_from"],
        half_damage_to: type["damage_relations"]["half_damage_to"],
        no_damage_from: type["damage_relations"]["no_damage_from"],
        no_damage_to: type["damage_relations"]["no_damage_to"],
      },
    ];
    return obj;
  }, []);
  typeList = types;
  return types;
};
fetchTypes();
export const condensePokeData = async (prevSlice = 0, sliceSize) => {
  let { pokemon, species, evolutions } = await fetchPokemon(
    prevSlice,
    sliceSize
  );
  let evolution_chain = evolutions.reduce(condenseEvolutions, []);
  pokemon.map((p) => {
    p.types.map(({ type }, typeIndex) => {
      typeList.map((item) => {
        if (type.name === item.name) {
          delete p["types"][typeIndex]["slot"];
          p["types"][typeIndex]["type"] = item;
        }
      });
    });
    evolution_chain.map((evo, chainIndex) =>
      evo.map((e, evoIndex) => {
        if (p.name === e.species.name) {
          delete evo[evoIndex]["evolves_to"];
          evo[evoIndex]["sprites"] = p["sprites"];
          p["evolutions"] = evolution_chain[chainIndex];
        }
      })
    );
  });

  let formattedData = pokemon.map((p, index) => ({
    id: p.id,
    name: p.name,
    types: p.types,
    sprites: p.sprites,
    generation: species[index] && species[index]["generation"],
    evolutions: p.evolutions,
  }));
  console.log(formattedData);
  return formattedData;
};
