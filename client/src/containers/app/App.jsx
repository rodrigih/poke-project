import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";

import "./App.css";

import Home from "../home/Home";
import Pokemon from "../pokemon/Pokemon";
import NavLinks from "../../components/navLinks";

/* Dummy components */

function Moves() {
  return <h2> Moves page </h2>;
}
function Items() {
  return <h2> Items page </h2>;
}
function Berries() {
  return <h2> Berries page </h2>;
}
function NoMatch() {
  return <h2> Page does not exist </h2>;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1> Pok&eacute;mon Info App </h1>
          <Route component={NavLinks} />
        </header>

        <div style={{paddingBottom: "5px"}}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/Pokemon" component={Pokemon} />
            <Route path="/Moves" component={Moves} />
            <Route path="/Items" component={Items} />
            <Route path="/Berries" component={Berries} />
            <Route component={NoMatch} />
          </Switch>
        </div>

        <footer className="App-footer">
          Created using{" "}
          <a
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          . Uses the{" "}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pok&eacute;API.
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
