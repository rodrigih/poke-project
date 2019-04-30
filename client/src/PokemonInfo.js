import React, { Component } from 'react'; 

class PokemonInfo extends Component { 

  render(){
    const params = this.props.match.params;
    const pokemon = params.pokemon;

    return (
      <div> 
        <p> You searched for {pokemon}</p>
      </div>
    );
  } 
}

export default PokemonInfo;
