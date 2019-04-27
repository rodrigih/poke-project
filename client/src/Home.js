import React, { Component } from 'react'; 

function Home(){
  return (
    <div>
      <h2> About </h2>

      <p>
        Welcome to the pok&eacute;-app!
        <br />
        Find information about all things pok&eacute;mon, including moves, berries, and items.

        This is currently a work in progress.  
        More to come soon.
      </p>

      <h2> Credits </h2>

      <p>
        This site is only provides a front-end for the existing API, <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">Pok&eacute;API.</a> 
      </p>

      <h2> Source code </h2>
      <p>
        This project was made for educational purposes and is under the GNU General Public License.
        <br />

        Source code for this project can be found <a href="https://github.com/rodrigih/poke-project" target="_blank" rel="noopener noreferrer">here</a>.  
      </p>
    </div>
  );
}

export default Home;
