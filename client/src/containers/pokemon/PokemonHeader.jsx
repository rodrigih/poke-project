import React from "react";
import styled from "@emotion/styled";
import "./PokemonHeader.css";
import PokeType from "../../components/pokeTypes.jsx";
import {getEnglish, capitalize, sortBySlot} from "../../helpers/utilities.js";

const Divider = styled.div`
  width: 10%;
`;

const TopText = styled.div`
  color: #eee;
  font-weight: bold;
`;

function displayTypes(typeArr) {
  var pokeTypes = typeArr.map((curr, i) => (
    <PokeType key={`type-${i}`} type={curr.type.name} />
  ));

  return pokeTypes;
}

const PokemonHeader = React.memo(props => {
  const {spriteUrl, pokemonName, pokemonGenus, pokemonTypes} = props;

  const orderedTypes = pokemonTypes.slice();
  orderedTypes.sort(sortBySlot);

  return (
    <div className="flex pokemon-header">
      <div className="flex flex-column content-center">
        <TopText>#132</TopText>
        <div className="sprite-container" style={{alignSelf: "center"}}>
          <img alt="Pokemon sprite" src={spriteUrl} />
        </div>

        <div className="flex type-container">{displayTypes(orderedTypes)}</div>
      </div>

      <div className="flex flex-column pokemon-header-text">
        <TopText> {capitalize(pokemonName)} </TopText>
        <Divider />
        <div> {pokemonGenus} </div>
      </div>
    </div>
  );
});

export default PokemonHeader;
