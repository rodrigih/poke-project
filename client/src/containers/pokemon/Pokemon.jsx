import React, {Component} from "react";
import {Route, withRouter} from "react-router-dom";
import {remove as removeDiacritics} from "diacritics";
import cx from "classnames";
import {DEFAULT_QUERY} from "../../constants.js";

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
      this.setState({pokemonInput: pokemon});
    }
  }

  /* Event Handlers */
  handleChange(e) {
    this.setState({pokemonInput: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const pokemon = this.state.pokemonInput;

    /* Preprocess inputs  */

    var pokemonName = pokemon.toLowerCase().trim();
    var removeChars = new RegExp(/\./);
    var whiteSpace = new RegExp(/ +/);

    // First rearrange order of "mega" and "alola"
    pokemonName = pokemonName.replace(whiteSpace, " ");
    pokemonName = pokemonName.replace("alolan", "alola");

    var wordArr = pokemonName.split(" ");
    if (wordArr[0] === "mega" || wordArr[0] === "alola") {
      var newStart = wordArr.slice(0, 2).reverse();
      wordArr = newStart.concat(wordArr.slice(2));
    }

    // Replace white spaces with dashes and remove special characters
    pokemonName = wordArr.join("-");
    pokemonName = pokemonName.replace(removeChars, "");
    pokemonName = removeDiacritics(pokemonName);

    // If pokemon has different forms, change query to a default
    pokemonName = DEFAULT_QUERY[pokemonName]
      ? DEFAULT_QUERY[pokemonName]
      : pokemonName;

    this.props.history.push(`/Pokemon/${pokemonName}`);
  }

  render() {
    const {
      match: {isExact}
    } = this.props;

    return (
      <div>
        <p className={cx({hidden: !isExact})}>
          Enter a pok&eacute;mon name below.
        </p>

        <form style={{marginTop: "1em"}} onSubmit={this.handleSubmit}>
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

        <Route
          path="/Pokemon/:pokemon"
          render={props => (
            <PokemonInfo {...props} userInput={this.state.pokemonInput} />
          )}
        />
      </div>
    );
  }
}

export default withRouter(Pokemon);
