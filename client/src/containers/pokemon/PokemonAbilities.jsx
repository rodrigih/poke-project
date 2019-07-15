import React from "react";
import styled from "@emotion/styled";
import InfoCard from "../../components/infoCard";
import {getEnglish, capitalize} from "../../helpers/utilities.js";

const DivIndent = styled.div`
  margin-left: 1.5em;
  padding-left: 1.5em;
  border-left: 3px solid grey;
`;

function displayAbilities(props) {
  const dataArr = props.abilityDataArr;

  if (!dataArr || dataArr.length === 0) {
    return <div />;
  }

  const abilities = dataArr.map(data => getEnglish(data.names));

  return dataArr.map((data, ind) => {
    const {
      flavor_text_entries: flavorTextEntries,
      effect_entries: effectEntries
    } = data;

    const {flavor_text: flavorText} = getEnglish(flavorTextEntries);
    const {effect: effectText} = getEnglish(effectEntries);

    var name = data.name;

    var isHidden = abilities[ind].is_hidden;

    var hiddenText = isHidden ? " (hidden)" : "";

    return (
      <div key={`ability-${ind}`}>
        <h2>
          {capitalize(name)}
          {hiddenText}:
        </h2>

        <DivIndent>
          <p>
            {" "}
            <b>In-game text:</b> {flavorText}{" "}
          </p>
          <p>
            {" "}
            <b>Description:</b> {effectText}{" "}
          </p>
        </DivIndent>
      </div>
    );
  });
}

const PokemonAbilities = React.memo(props => {
  return <InfoCard title={"Abilities"}> {displayAbilities(props)} </InfoCard>;
});

export default PokemonAbilities;
