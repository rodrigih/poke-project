import React from "react";
import styled from "@emotion/styled";
import {
  getEnglish,
  capitalize,
  decimetersToInches,
  hectogramsToPounds
} from "../../helpers/utilities.js";
import InfoCard from "../../components/infoCard";

const TwoColumns = styled.div`
  column-count: 2;
  line-height: 2em;
`;

function displayHeight(height) {
  var inches = decimetersToInches(height);
  var feet = Math.floor(inches / 12);
  inches = feet === 0 ? inches : inches % feet;

  return `${feet} ft. ${inches} in.`;
}

function displayGenderRatio(femaleRatio) {
  if (femaleRatio < 0) {
    return "Genderless";
  }
  var femalePercent = (femaleRatio / 8) * 100;
  var malePercent = 100 - femalePercent;

  return (
    <span>
      {malePercent}% &#9794; {femalePercent}% &#9792;
    </span>
  );
}

function displayEggGroups(eggGroups) {
  var names = eggGroups.map(curr => {
    var group = curr.name;
    // Add space for group names like "water1"
    group = group.replace(/(\w)(\d)/, "$1 $2");
    return group === "no-eggs" ? "No egg group" : capitalize(group);
  });

  return names.join(", ");
}

function displayEffortValues(stats) {
  var effortValues = stats.filter(statObj => {
    return statObj.effort !== 0;
  });

  var strArr = effortValues.map(statObj => {
    var statName = statObj.stat.name.replace("-", " ");
    return `${capitalize(statName)} (${statObj.effort})`;
  });

  return strArr.join(", ");
}

const PokemonGeneral = React.memo(props => {
  const {pokemonData, speciesData} = props;

  // pokemonData destructuring
  const {height, weight, stats} = pokemonData;

  // speciesData destructuring
  const {
    flavor_text_entries: flavorTextArr,
    gender_rate: genderRate,
    capture_rate: catchRate,
    hatch_counter: hatchCounter,
    egg_groups: eggGroups
  } = speciesData;

  const flavorText = getEnglish(flavorTextArr).flavor_text;

  return (
    <InfoCard title={"General"}>
      <div>
        <h2> Description:</h2>
        <p> {flavorText} </p>
        <h2> General Info:</h2>
        <TwoColumns>
          <div>
            {" "}
            <b>Height:</b> {displayHeight(height)}{" "}
          </div>
          <div>
            {" "}
            <b>Weight:</b> {hectogramsToPounds(weight)} lbs.
          </div>
          <div>
            {" "}
            <b>Gender Ratio:</b> {displayGenderRatio(genderRate)}{" "}
          </div>
          <div>
            {" "}
            <b>Capture Rate:</b> {catchRate}{" "}
          </div>
          <div>
            {" "}
            <b>Hatch Counter:</b> {hatchCounter} ({hatchCounter * 257} steps)
          </div>
          <div>
            {" "}
            <b>Egg Groups:</b> {displayEggGroups(eggGroups)}{" "}
          </div>
          <div>
            {" "}
            <b>Effort Values:</b> {displayEffortValues(stats)}{" "}
          </div>
        </TwoColumns>
      </div>
    </InfoCard>
  );
});

export default PokemonGeneral;
