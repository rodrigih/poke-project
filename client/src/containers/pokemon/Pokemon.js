import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";

import PokemonInfo from "./PokemonInfo";

class Pokemon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemonInput: "",
      data: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /* Lifecycle Methods */
  componentDidMount() {
    const params = this.props.match.params;
    const pokemon = params.pokemon;

    if (pokemon) {
      this.setState({ pokemonInput: pokemon });
    }
  }

  /* Event Handlers */
  handleChange(e) {
    this.setState({ pokemonInput: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const pokemon = this.state.pokemonInput;
    this.props.history.push(`/Pokemon/${pokemon}`);
  }

  render() {
    return (
      <div>
        <p> Enter a pok&eacute;mon name below. </p>

        <form style={{ marginTop: "1em" }} onSubmit={this.handleSubmit}>
          <label htmlFor="pokemon-input"> Go </label>
          <img
            id="pokeball-img"
            alt=""
            src={require("../../assets/pokeball.png")}
          />
          <input
            id="pokemon-input"
            type="text"
            name="pokemon"
            placeholder="Bulbasaur"
            onChange={this.handleChange}
            value={this.state.pokemonInput}
          />
          ,<button id="btn-go"> I Choose You! </button>
        </form>

        <Route path="/Pokemon/:pokemon" component={PokemonInfo} />
      </div>
    );
  }
}

export default withRouter(Pokemon);
