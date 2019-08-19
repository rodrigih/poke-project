import React from "react";
import styled from "@emotion/styled";
import "./PokemonHeader.css";
import PokeType from "../../components/pokeTypes.jsx";
import {capitalize, sortBySlot} from "../../helpers/utilities.js";

const Divider = styled.div`
  width: 10%;
`;

const TopText = styled.div`
  color: #eee;
  font-weight: bold;
`;

const Credit = styled.span`
  font-size: 12px;
`;

function displayTypes(typeArr) {
  var pokeTypes = typeArr.map((curr, i) => (
    <PokeType key={`type-${i}`} type={curr.type.name} />
  ));

  return pokeTypes;
}

function displayName(props) {
  const {pokemonName, speciesName} = props;

  if (pokemonName.match("-mega-?")) {
    var wordArr = pokemonName.split("-").map(word => capitalize(word));
    wordArr = wordArr
      .slice(0, 2)
      .reverse()
      .concat(wordArr.slice(2));

    return wordArr.join(" ");
  }

  return capitalize(speciesName);
}

const PokemonHeader = React.memo(props => {
  const {
    speciesName,
    spriteUrl,
    pokemonGenus,
    pokemonTypes,
    pokedexNum
  } = props;

  const orderedTypes = pokemonTypes.slice();
  orderedTypes.sort(sortBySlot);

  return (
    <div>
      <div className="flex pokemon-header">
        <div className="flex flex-column content-center">
          <TopText>#{pokedexNum}</TopText>
          <div className="sprite-container" style={{alignSelf: "center"}}>
            <a
              href={`https://pokemondb.net/sprites/${speciesName.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img alt="Pokemon sprite" src={spriteUrl} />
            </a>
          </div>

          <div className="flex">{displayTypes(orderedTypes)}</div>
        </div>

        <div className="flex flex-column pokemon-header-text">
          <TopText> {displayName(props)} </TopText>
          <Divider />
          <div> {pokemonGenus} </div>
        </div>
      </div>

      <Credit>
        Sprites from{" "}
        <a
          href="https://pokemondb.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pokemon Database
        </a>
        . Click on pokemon image for more sprites.
      </Credit>
    </div>
  );
});

export default PokemonHeader;
