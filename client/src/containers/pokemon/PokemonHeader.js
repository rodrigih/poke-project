import React, {Component} from "react";
import styled from "@emotion/styled";
import "./PokemonHeader.css";

const Divider = styled.div`
  width: 10%;
`;

const TopText = styled.div`
  color: #eee;
`;

class PokemonHeader extends Component {
  render() {
    const {spriteUrl, pokemonName, pokemonGenus} = this.props;

    return (
      <div className="flex pokemon-header">
        <div className="sprite-container">
          <img alt="Pokemon sprite" src={spriteUrl} />
        </div>

        <div className="flex flex-column pokemon-header-text">
          <TopText> {pokemonName} </TopText>
          <Divider />
          <div> {pokemonGenus} </div>
        </div>
      </div>
    );
  }
}
export default PokemonHeader;
