import React, {Component} from "react";
import {
  getPokemonByName,
  getPokemonSpeciesByName
} from "../../helpers/pokemon-api";
import styled from "@emotion/styled";
import PokemonHeader from "./PokemonHeader";
import {capitalize} from "../../helpers/utilities.js";

const ULInline = styled.ul`
  display: inline-block;
`;

class PokemonInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemonData: null,
      speciesData: null
    };

    this.handleGettingPokemonData = this.handleGettingPokemonData.bind(this);
    this.handleGettingSpeciesData = this.handleGettingSpeciesData.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleGettingPokemonData(data) {
    this.setState({pokemonData: data});
  }

  handleGettingSpeciesData(data) {
    console.log(`FOOBAR: ${data}`);
    this.setState({speciesData: data});
  }

  handleError(err) {
    console.log("API Error:", err);
  }

  /* Life Cycle functions */
  componentDidMount() {
    const {match: params} = this.props;
    if (params.pokemon) {
      getPokemonByName(params.pokemon)
        .then(this.handleGettingPokemonData)
        .catch(this.handleError);

      getPokemonSpeciesByName(params.pokemon)
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
      getPokemonByName(pokemon)
        .then(this.handleGettingPokemonData)
        .catch(this.handleError);

      getPokemonSpeciesByName(pokemon)
        .then(this.handleGettingSpeciesData)
        .catch(this.handleError);
    }
  }

  /* Helper functions */
  getEnglish(dataArr) {
    var englishObj = dataArr.find(curr => curr.language.name === "en");

    return englishObj;
  }

  render() {
    const {pokemonData, speciesData} = this.state;

    if (!pokemonData || !speciesData) {
      return <div />;
    }

    // pokemonData destructuring
    const {
      species: {name},
      sprites: {front_default}
    } = pokemonData;

    // speciesData destructuring
    const {genera} = speciesData;

    const genus = this.getEnglish(genera).genus;

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

    return (
      <div>
        <PokemonHeader
          spriteUrl={front_default}
          pokemonName={capitalize(name)}
          pokemonGenus={genus}
        />

        <div>
          <p>Abilities:</p>
          {displayAbilities(pokemonData)}
        </div>
      </div>
    );
  }
}

export default PokemonInfo;
