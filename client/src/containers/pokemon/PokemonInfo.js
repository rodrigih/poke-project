import React, { Component } from "react";
import { getPokemonByName } from "../../helpers/pokemon-api";
import styled from "@emotion/styled";

const ULInline = styled.ul`
  display: inline-block;
`;

class PokemonInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    };

    this.handleGettingData = this.handleGettingData.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleGettingData(data) {
    this.setState({ data: data });
  }

  handleError(err) {
    console.log("API Error:", err);
  }

  /* Life Cycle functions */
  componentDidMount() {
    const { match: params } = this.props;
    if (params.pokemon) {
      getPokemonByName(params.pokemon)
        .then(this.handleGettingData)
        .catch(this.handleError);
    }
  }

  componentDidUpdate(prevProps) {
    const previousName = prevProps.match.params.pokemon;
    const {
      match: {
        params: { pokemon }
      }
    } = this.props;
    if (previousName !== pokemon && pokemon.length) {
      getPokemonByName(pokemon)
        .then(this.handleGettingData)
        .catch(this.handleError);
    }
  }

  render() {
    const pokemonData = this.state.data;

    if (!pokemonData) {
      return <div />;
    }

    const name = pokemonData.species.name;

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
        <p>You searched for {name}</p>
        <p>Here are it's abilities:</p>
        {displayAbilities(pokemonData)}
      </div>
    );
  }
}

export default PokemonInfo;
