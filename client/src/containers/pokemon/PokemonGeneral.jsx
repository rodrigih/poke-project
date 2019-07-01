import React, {Component} from "react";
import {
  getEnglish,
  capitalize,
  decimetersToInches,
  hectogramsToPounds
} from "../../helpers/utilities.js";
import InfoCard from "../../components/infoCard";

class PokemonGeneral extends Component {
  displayHeight(height) {
    var inches = decimetersToInches(height);
    var feet = Math.floor(inches / 12);
    inches = feet === 0 ? inches : inches % feet;

    return `${feet} ft. ${inches} in.`;
  }

  displayGenderRatio(femaleRatio) {
    var femalePercent = (femaleRatio / 8) * 100;
    var malePercent = 100 - femalePercent;

    return (
      <span>
        {malePercent}% &#9794; {femalePercent}% &#9792;
      </span>
    );
  }

  displayEggGroups(eggGroups) {
    var names = eggGroups.map(curr => {
      var group = curr.name;
      // Add space for group names like "water1"
      group = group.replace(/(\w)(\d)/, "$1 $2");
      return group === "no-eggs" ? "No egg group" : capitalize(group);
    });

    return names.join(", ");
  }

  displayEffortValues(stats) {
    var effortValues = stats.filter(statObj => {
      return statObj.effort !== 0;
    });

    var strArr = effortValues.map(statObj => {
      var statName = statObj.stat.name.replace("-", " ");
      return `${capitalize(statName)} (${statObj.effort})`;
    });

    return strArr.join(", ");
  }

  render() {
    const {pokemonData, speciesData} = this.props;

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
          <div style={{columnCount: 2, lineHeight: "2em"}}>
            <div>
              {" "}
              <b>Height:</b> {this.displayHeight(height)}{" "}
            </div>
            <div>
              {" "}
              <b>Weight:</b> {hectogramsToPounds(weight)} lbs.
            </div>
            <div>
              {" "}
              <b>Gender Ratio:</b> {this.displayGenderRatio(genderRate)}{" "}
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
              <b>Egg Groups:</b> {this.displayEggGroups(eggGroups)}{" "}
            </div>
            <div>
              {" "}
              <b>Effort Values:</b> {this.displayEffortValues(stats)}{" "}
            </div>
          </div>
        </div>
      </InfoCard>
    );
  }
}

export default PokemonGeneral;
