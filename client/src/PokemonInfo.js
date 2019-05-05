import React, { Component } from 'react'; 

class PokemonInfo extends Component { 

  constructor(props){
    super(props); 

    this.state = {
      data: null
    }; 
  }

  /* Life Cycle functions */
  componentDidMount(){
    this.callBackendAPI()
      .then( res => this.setState({ data: res }) )
      .catch( err => console.log(err) );
  }

  componentDidUpdate(prevProps){
    const previousName = prevProps.match.params.pokemon;
    const name = this.props.match.params.pokemon;
    if (previousName !== name) {
      this.callBackendAPI()
        .then( res => this.setState({ data: res }) )
        .catch( err => console.log(err) );
    }
  }

  /* API calls */
  callBackendAPI = async() => {
    const name = this.props.match.params.pokemon;
    const response = await fetch(`/getPokemon/${name}`);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    } 

    return body;
  };

  render(){
    const pokemonData = this.state.data;

    if (! pokemonData) {
      return (<div></div>);
    }

    const name = pokemonData.species.name;

    var displayAbilities = function(obj){
      if (! obj){
        return (<div></div>)
      }

      var arr = obj.abilities;
      var listItems = arr.map((curr, ind) => (<li key={`ability-${ind}`}>{curr.ability.name}</li>));

      return (<ul style={{display: "inline-block"}}>{listItems}</ul>);
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
