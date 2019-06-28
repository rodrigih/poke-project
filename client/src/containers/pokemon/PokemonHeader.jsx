import React, {Component} from "react";
import styled from "@emotion/styled";
import "./PokemonHeader.css";
import PokeType from "../../components/pokeTypes.jsx";

const Divider = styled.div`
  width: 10%;
`;

const TopText = styled.div`
  color: #eee;
`;

class PokemonHeader extends Component {
  displayTypes(typeArr) {
    var pokeTypes = typeArr.map((curr, i) => (
      <PokeType key={`type-${i}`} type={curr.type.name} />
    ));

    return pokeTypes;
  }

  render() {
    const {spriteUrl, pokemonName, pokemonGenus, pokemonTypes} = this.props;

    return (
      <div className="flex pokemon-header">
        <div className="flex flex-column content-center">
          <div className="sprite-container" style={{alignSelf: "center"}}>
            <img alt="Pokemon sprite" src={spriteUrl} />
          </div>

          <div className="flex type-container">
            {this.displayTypes(pokemonTypes)}
          </div>
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
