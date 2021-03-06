import React, {Component} from "react";
import PokemonHeader from "./PokemonHeader";
import PokemonGeneral from "./PokemonGeneral";
import PokemonAbilities from "./PokemonAbilities";
import PokemonTypeMatchup from "./PokemonTypeMatchup";
import PokemonStats from "./PokemonStats";
import EvolutionChain from "./EvolutionChain";
import {
  getPokemonByName,
  getPokemonSpeciesByName,
  getAbilityByName,
  getTypeByName,
  getResourceByUrl
} from "../../helpers/pokemon-api";
import {
  getEnglish,
  sortBySlot,
  createSpriteUrl
} from "../../helpers/utilities.js";

class PokemonInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemonData: null,
      speciesData: null,
      abilityDataArr: [],
      typeDataArr: [],
      evolutionData: null,
      isLoading: false,
      hasError: false
    };

    this.handleGettingPokemonData = this.handleGettingPokemonData.bind(this);
    this.handleGettingSpeciesData = this.handleGettingSpeciesData.bind(this);
    this.handleGettingAbilityData = this.handleGettingAbilityData.bind(this);
    this.handleGettingTypeData = this.handleGettingTypeData.bind(this);
    this.handleGettingEvolutionData = this.handleGettingEvolutionData.bind(
      this
    );
    this.handleError = this.handleError.bind(this);
  }

  getAllPokemonData() {
    const {
      match: {
        params: {pokemon}
      }
    } = this.props;

    if (pokemon) {
      this.setState({
        isLoading: true,
        hasError: false
      });
    }

    getPokemonByName(pokemon)
      .then(pokemonData => {
        this.handleGettingPokemonData(pokemonData);

        // pokemonData destructuring
        const {abilities, types, species} = pokemonData;

        var sortedAbilities = abilities.slice();
        sortedAbilities = abilities.sort(sortBySlot);

        var sortedTypes = types.slice();
        sortedTypes.sort(sortBySlot);

        getPokemonSpeciesByName(species.name)
          .then(speciesData => {
            const {
              evolution_chain: {url}
            } = speciesData;
            this.handleGettingSpeciesData(speciesData);

            getResourceByUrl(url)
              .then(this.handleGettingEvolutionData)
              .catch(this.handleError);
          })
          .catch(this.handleError);

        sortedAbilities.forEach(abilityData => {
          const abilityName = abilityData.ability.name;
          getAbilityByName(abilityName)
            .then(this.handleGettingAbilityData)
            .catch(this.handleError);
        });

        sortedTypes.forEach(typeData => {
          const typeName = typeData.type.name;
          getTypeByName(typeName)
            .then(this.handleGettingTypeData)
            .catch(this.handleError);
        });
      })
      .catch(this.handleError);
  }

  // Functions for updating states from API results
  handleGettingPokemonData(data) {
    this.setState({
      pokemonData: data,
      isLoading: false,
      hasError: false
    });
  }

  handleGettingSpeciesData(data) {
    this.setState({
      speciesData: data,
      isLoading: false,
      hasError: false
    });
  }

  handleGettingAbilityData(data) {
    var dataCopy = this.state.abilityDataArr.slice();
    dataCopy.push(data);

    this.setState({abilityDataArr: dataCopy});
  }

  handleGettingTypeData(data) {
    var dataCopy = this.state.typeDataArr.slice();
    dataCopy.push(data);

    this.setState({typeDataArr: dataCopy});
  }

  handleGettingEvolutionData(data) {
    this.setState({
      evolutionData: data,
      isLoading: false,
      hasError: false
    });
  }

  handleError(err) {
    this.setState({
      hasError: true,
      isLoading: false
    });
  }

  /* Life Cycle functions */
  componentDidMount() {
    const {
      match: {
        params: {pokemon}
      }
    } = this.props;

    if (pokemon) {
      this.setState({
        isLoading: true,
        hasError: false
      });

      this.getAllPokemonData();
    }
  }

  componentDidUpdate(prevProps) {
    const previousName = prevProps.match.params.pokemon;
    const {
      match: {
        params: {pokemon}
      }
    } = this.props;

    if (previousName !== pokemon && pokemon.length) {
      this.setState({
        abilityDataArr: [],
        typeDataArr: [],
        isLoading: true,
        hasError: false
      });

      this.getAllPokemonData();
    }
  }

  render() {
    const {
      pokemonData,
      speciesData,
      abilityDataArr,
      evolutionData,
      typeDataArr,
      isLoading,
      hasError
    } = this.state;

    const {
      match: {
        params: {pokemon}
      },
      userInput
    } = this.props;

    if (hasError) {
      var query = userInput ? userInput : pokemon;
      return <p> Could not find {query}</p>;
    } else if (isLoading) {
      return <p> Loading... </p>;
    } else if (!pokemonData || !speciesData) {
      return <div />;
    }

    // pokemonData destructuring
    const {name: pokemonName, types, stats} = pokemonData;

    // speciesData destructuring
    const {genera, names, id: pokedexNum} = speciesData;

    const genus = getEnglish(genera).genus;
    const speciesName = getEnglish(names).name;

    return (
      <div>
        <PokemonHeader
          spriteUrl={createSpriteUrl(pokemonName, pokedexNum)}
          pokemonName={pokemonName}
          speciesName={speciesName}
          pokemonGenus={genus}
          pokemonTypes={types}
          pokedexNum={pokedexNum}
        />
        <PokemonGeneral pokemonData={pokemonData} speciesData={speciesData} />
        <PokemonAbilities abilityDataArr={abilityDataArr} />
        <PokemonTypeMatchup
          abilityDataArr={abilityDataArr}
          typeDataArr={typeDataArr}
        />
        <PokemonStats pokemonName={pokemonName} statData={stats} />
        <EvolutionChain
          speciesName={speciesName}
          evolutionData={evolutionData}
        />
      </div>
    );
  }
}

export default PokemonInfo;
