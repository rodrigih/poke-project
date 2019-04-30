import React, { Component } from 'react'; 
import { Route, Redirect } from 'react-router-dom';

import PokemonInfo from './PokemonInfo.js'; 

class Pokemon extends Component { 

  constructor(props){
    super(props); 

    var match = this.props.match; 

    this.state = {
      value: "",
      resultName: "",
      redirect: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    this.setState({value: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault(); 
    this.setState({ redirect: true });
  } 

  render(){ 
    if (this.state.redirect) {
      var redirectUrl = `/Pokemon/${this.state.value}`;
      this.setState({redirect: false});
      return( <Redirect to={redirectUrl} />);
    }

    return (
      <div>
        <p> Enter a pok&eacute;mon name below. </p>

        <form style={{marginTop: "1em"}} onSubmit={this.handleSubmit}>
          <label>
            Go
            <img id="pokeball-img" alt="" src={require("./pokeball.png")} />
            <input id="pokemon-input"
                   type="text"
                   name="pokemon"
                   placeholder="Bulbasaur"
                   onChange={this.handleChange}
                   value={this.state.value}
                 />,
          </label>
          <button id="btn-go"> I Choose You! </button>
        </form> 

        <Route path="/Pokemon/:pokemon" component={PokemonInfo} />
      </div>
    ); 
  }
}

export default Pokemon;
