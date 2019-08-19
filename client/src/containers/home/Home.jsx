import React from "react";
import styled from "@emotion/styled";

const Par = styled.div`
  line-height: 2;
`;

function Home() {
  return (
    <div>
      <h2> About </h2>

      <Par>
        Welcome to the Pok&eacute; App!
        <br />
        Find information about all things pok&eacute;mon, including moves,
        berries, and items.
        <br />
        <span style={{fontWeight: "bold", fontStyle: "italic"}}>
          Site under construction.
        </span>
      </Par>

      <h2> Credits </h2>

      <Par>
        Pok&eacute;mon images and names are copyrighted by Nintendo/Game Freak.
        <br />
        Pokemon data and information gathered from{" "}
        <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">
          Pok&eacute;API.
        </a>
        <br />
        Pokemon sprite images are gathered from{" "}
        <a
          href="https://pokemondb.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pokemon Database
        </a>
        .
      </Par>

      <h2> Source code </h2>
      <Par>
        This project was made for educational purposes and is under the GNU
        General Public License.
        <br />
        Source code for this project can be found{" "}
        <a
          href="https://github.com/rodrigih/poke-project"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </Par>
    </div>
  );
}

export default Home;
