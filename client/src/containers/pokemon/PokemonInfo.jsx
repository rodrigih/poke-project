import React, {Component} from "react";
import PokemonHeader from "./PokemonHeader";
import PokemonGeneral from "./PokemonGeneral";
import PokemonAbilities from "./PokemonAbilities";
import PokemonTypeMatchup from "./PokemonTypeMatchup";
import PokemonStats from "./PokemonStats";
import {
  getPokemonByName,
  getPokemonSpeciesByName,
  getAbilityByName,
  getTypeByName
} from "../../helpers/pokemon-api";
import {getEnglish, sortBySlot} from "../../helpers/utilities.js";

class PokemonInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemonData: null,
      speciesData: null,
      abilityDataArr: [],
      typeDataArr: [],
      isLoading: false,
      hasError: false
    };

    this.handleGettingPokemonData = this.handleGettingPokemonData.bind(this);
    this.handleGettingSpeciesData = this.handleGettingSpeciesData.bind(this);
    this.handleGettingAbilityData = this.handleGettingAbilityData.bind(this);
    this.handleGettingTypeData = this.handleGettingTypeData.bind(this);
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
          .then(this.handleGettingSpeciesData)
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
      typeDataArr,
      isLoading,
      hasError
    } = this.state;

    const {
      match: {
        params: {pokemon}
      }
    } = this.props;

    if (hasError) {
      return <p> Could not find {pokemon}</p>;
    } else if (isLoading) {
      return <p> Loading... </p>;
    } else if (!pokemonData || !speciesData) {
      return <div />;
    }

    // pokemonData destructuring
    const {
      species: {name},
      sprites: {front_default},
      types,
      stats
    } = pokemonData;

    // speciesData destructuring
    const {genera} = speciesData;

    const genus = getEnglish(genera).genus;

    return (
      <div>
        <PokemonHeader
          spriteUrl={front_default}
          pokemonName={name}
          pokemonGenus={genus}
          pokemonTypes={types}
        />
        <PokemonGeneral pokemonData={pokemonData} speciesData={speciesData} />
        <PokemonAbilities abilityDataArr={abilityDataArr} />
        <PokemonTypeMatchup
          abilityDataArr={abilityDataArr}
          typeDataArr={typeDataArr}
        />
        <PokemonStats pokemonName={name} statData={stats} />
      </div>
    );
  }
}

export default PokemonInfo;
