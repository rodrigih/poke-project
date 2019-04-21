import React, { Component } from 'react'; 
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import './App.css'; 

/* Dummy components */ 
function Pokemon() {
  return (
    <p>
      Go
      <img id="pokeball-img" alt="" src={require("./pokeball.png")} />
      <input id="pokemon-input" type="text" name="pokemon" placeholder="Bulbasaur"></input>,
      <button id="btn-go"> I Choose You! </button>
    </p>
  ); 
} 

function Moves() { return <h2> Moves page </h2>; } 
function Items() { return <h2> Items page </h2>; } 
function Berries() { return <h2> Berries page </h2>; }
function NoMatch() { return <h2> Page does not exist </h2>; }


class App extends Component { 
  state = {
    data: null
  };

  componentDidMount(){
    this.callBackendAPI()
      .then( res => this.setState({ data: res.express }) )
      .catch( err => console.log(err) );
  }

  callBackendAPI = async() => {
    const response = await fetch('express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }

    return body;
  };

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1> Pok&eacute;mon Info App </h1>
            <p> Type in a pok&eacute;mon name to get info for it.  </p>

            <nav>
              <ul>
                <li> <Link to="/"> Pokemon </Link> </li>
                <li> <Link to="/Moves"> Moves </Link> </li>
                <li> <Link to="/Items"> Items </Link> </li>
                <li> <Link to="/Berries"> Berries </Link> </li>
              </ul>
            </nav> 
          </header> 

          <Switch>
            <Route path="/" exact component={Pokemon} />
            <Route path="/Moves" component={Moves} />
            <Route path="/Items" component={Items} />
            <Route path="/Berries" component={Berries} />
            <Route component={NoMatch} />
          </Switch> 

          <footer className="App-footer">
            Created using <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a>.
            Uses the <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">Pok&eacute;API.</a>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
