import React, {Component} from "react";
import styled from "@emotion/styled";
import PokemonHeader from "./PokemonHeader";
import PokemonGeneral from "./PokemonGeneral";
import {
  getPokemonByName,
  getPokemonSpeciesByName
} from "../../helpers/pokemon-api";
import {getEnglish, capitalize} from "../../helpers/utilities.js";
import InfoCard from "../../components/infoCard";

const ULInline = styled.ul`
  display: inline-block;
`;

class PokemonInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemonData: null,
      speciesData: null,
      isLoading: false,
      hasError: false
    };

    this.handleGettingPokemonData = this.handleGettingPokemonData.bind(this);
    this.handleGettingSpeciesData = this.handleGettingSpeciesData.bind(this);
    this.handleError = this.handleError.bind(this);
  }

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

  handleError(err) {
    console.log("API Error:", err);
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

      getPokemonByName(pokemon)
        .then(this.handleGettingPokemonData)
        .catch(this.handleError);

      getPokemonSpeciesByName(pokemon)
        .then(this.handleGettingSpeciesData)
        .catch(this.handleError);
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
        isLoading: true,
        hasError: false
      });

      getPokemonByName(pokemon)
        .then(this.handleGettingPokemonData)
        .catch(this.handleError);

      getPokemonSpeciesByName(pokemon)
        .then(this.handleGettingSpeciesData)
        .catch(this.handleError);
    }
  }

  /* Helper functions */

  sortTypes(a, b) {
    return a.slot - b.slot;
  }

  render() {
    const {pokemonData, speciesData, hasError, isLoading} = this.state;
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

    var displayAbilities = function(obj) {
      if (!obj) {
        return <div />;
      }

      var arr = obj.abilities;
      var listItems = arr.map((curr, ind) => (
        <li key={`ability-${ind}`}>{curr.ability.name}</li>
      ));

      return <ULInline>{listItems}</ULInline>;
    };

    // Order type array by its slot
    var orderedTypes = types.slice();
    orderedTypes.sort(this.sortTypes);

    return (
      <div>
        <PokemonHeader
          spriteUrl={front_default}
          pokemonName={capitalize(name)}
          pokemonGenus={genus}
          pokemonTypes={orderedTypes}
        />

        <PokemonGeneral pokemonData={pokemonData} speciesData={speciesData} />

        <InfoCard title={"Abilities"}>{displayAbilities(pokemonData)}</InfoCard>
      </div>
    );
  }
}

export default PokemonInfo;
