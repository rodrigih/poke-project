import React, { Component } from 'react'; 
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import './App.css'; 

import Home from './Home.js'; 
import Pokemon from './Pokemon.js'; 

/* Dummy components */ 
function Moves() { return <h2> Moves page </h2>; } 
function Items() { return <h2> Items page </h2>; } 
function Berries() { return <h2> Berries page </h2>; }
function NoMatch() { return <h2> Page does not exist </h2>; } 

class App extends Component { 
  
  state = {
    data: null,
    links: [
      { url: "/", text: "Home", idStr: "home-link" },
      { url: "/Pokemon", text: "Pokemon", idStr: "pokemon-link" },
      { url: "/Moves", text: "Moves", idStr: "moves-link" },
      { url: "/Items", text: "Items", idStr: "items-link"},
      { url: "/Berries", text: "Berries", idStr: "berries-link" }
    ],

    activeLink: "home-link"
  }; 

  /* Event handlers */
  handleLinkClick(e){
    e.preventDefault();
    var idStr = e.currentTarget.id;
    this.setState({activeLink: idStr});
  } 

  /* Helper functions */
  renderLinks(){
    var linkArr = this.state.links.slice();

    var links = linkArr.map((curr) => {
      var idStr = curr.idStr;
      var classStr = ( (idStr === this.state.activeLink) ? "active-link": ""); 

      return (
        <li className={classStr}
            id={curr.idStr}
            key={curr.idStr}
            onClick={(e) => this.handleLinkClick(e)}>

          <Link to={curr.url}> {curr.text} </Link>
        </li>
      );
    });

    return ( <nav> <ul> {links} </ul> </nav>);
  } 

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1> Pok&eacute;mon Info App </h1> 
            {this.renderLinks()} 
          </header> 

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/Pokemon" component={Pokemon} />
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
