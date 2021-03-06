import React, {Component} from "react";
import styled from "@emotion/styled";

const STYLE = {
  bug: "#2A8E16",
  dark: "#424242",
  dragon: "linear-gradient(0deg, rgba(214,12,33,1) 35%, rgba(3,94,219,1) 64%)",
  electric: "#FFCE0E",
  fairy: "#FF93F2",
  fighting: "#F38D33",
  fire: "#FF5733",
  flying: "#48D6BB",
  grass: "#60E73F",
  ghost: "#B55AFD",
  ground: "#D8B528",
  ice: "#85DFD9",
  normal: "#B1B1B1",
  poison: "#8244BF",
  psychic: "#FE24E0",
  rock: "#9A6D13",
  steel: "#7D9597",
  water: "#4E6BF9"
};

const TypeDiv = styled.span`
  display: inline-block;
  text-transform: capitalize;
  border-radius: 10%;
  padding: 5px 10px;
  margin: 5px;
  color: #eee;
  font-weight: bold;
`;

class PokeType extends Component {
  render() {
    var type = this.props.type;

    const CurrType = styled(TypeDiv)`
      background: ${STYLE[type]};
    `;

    return <CurrType> {type} </CurrType>;
  }
}

export default PokeType;
