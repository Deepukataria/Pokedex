import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import logo from "./assets/logo.svg";
import PokemonCard from "./components/PokemonCard";
import { ClipLoader } from "react-spinners";

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1302"
        );
        const { results } = response.data;

        const pokemonDetails = await Promise.all(
          results.map(async (pokemon) => {
            const pokemonDetail = await axios.get(pokemon.url);
            return {
              name: pokemonDetail.data.name,
              image: pokemonDetail.data.sprites.front_default,
            };
          })
        );
        setPokemonData(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokemon data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <div className="logo">
        <img src={logo} alt="" />
      </div>

      {loading ? (
        <div className="loading-screen">
          <ClipLoader color="#F7D02C" size={100} />
        </div>
      ) : (
        <>
          <div className="search">
            <input
              type="text"
              placeholder="Search Pokemon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="pokemon-grid">
            {filteredPokemon.map((pokemon, index) => (
              <PokemonCard
                key={index}
                name={pokemon.name}
                image={pokemon.image}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
