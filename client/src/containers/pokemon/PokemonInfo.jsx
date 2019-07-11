import React, {Component} from "react";
import PokemonHeader from "./PokemonHeader";
import PokemonGeneral from "./PokemonGeneral";
import PokemonAbilities from "./PokemonAbilities";
import PokemonTypeMatchup from "./PokemonTypeMatchup";
import {
  getPokemonByName,
  getPokemonSpeciesByName,
  getAbilityByName,
  getTypeByName
} from "../../helpers/pokemon-api";
import {getEnglish, capitalize} from "../../helpers/utilities.js";
import {TYPE_EFFECT_ABILITIES} from "../../constants.js";

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
        const {abilities, types} = pokemonData;

        var sortedAbilities = abilities.slice();
        sortedAbilities = abilities.sort(this.sortBySlot);

        var sortedTypes = types.slice();
        sortedTypes.sort(this.sortBySlot);

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

    getPokemonSpeciesByName(pokemon)
      .then(this.handleGettingSpeciesData)
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

  /* Helper functions */

  sortBySlot(a, b) {
    return a.slot - b.slot;
  }

  getTypeAlteringAbilities() {
    const dataArr = this.state.abilityDataArr;
    const typeAlteringAbilities = [];

    if (!dataArr || dataArr.length === 0) {
      return typeAlteringAbilities;
    }

    const abilities = dataArr.map(data => {
      return {
        key: data.name,
        name: getEnglish(data.names).name.toLowerCase()
      };
    });

    abilities.forEach(abilityData => {
      const {key, name} = abilityData;

      var typeAlteringData = TYPE_EFFECT_ABILITIES[key];

      if (typeAlteringData) {
        var newObj = {
          name: name,
          typeEffectArr: typeAlteringData
        };
        typeAlteringAbilities.push(newObj);
      }
    });

    return typeAlteringAbilities;
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
      types
    } = pokemonData;

    // speciesData destructuring
    const {genera} = speciesData;

    const genus = getEnglish(genera).genus;

    // Order Types by slot
    var orderedTypes = types.slice();
    orderedTypes.sort(this.sortBySlot);

    var typeAlteringAbilities = this.getTypeAlteringAbilities();

    return (
      <div>
        <PokemonHeader
          spriteUrl={front_default}
          pokemonName={capitalize(name)}
          pokemonGenus={genus}
          pokemonTypes={orderedTypes}
        />
        <PokemonGeneral pokemonData={pokemonData} speciesData={speciesData} />
        <PokemonAbilities abilityDataArr={abilityDataArr} />
        <PokemonTypeMatchup
          typeDataArr={typeDataArr}
          typeAlteringAbilities={typeAlteringAbilities}
        />
      </div>
    );
  }
}

export default PokemonInfo;
