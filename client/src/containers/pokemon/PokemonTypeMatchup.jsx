import React from "react";
import styled from "@emotion/styled";
import InfoCard from "../../components/infoCard";
import {capitalize} from "../../helpers/utilities.js";
import PokeType from "../../components/pokeTypes.jsx";

const ColumnHeader = styled.h3`
  border-bottom: 2px solid black;
`;

const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 4em;
`;

function createTypeMatchup(typeDataArr) {
  var matchup = {};

  // Helper function
  var updateMatchup = function(data, mult, obj) {
    var type = data.name;

    if (!obj.hasOwnProperty(type)) {
      obj[type] = mult;
    } else {
      obj[type] = mult * obj[type];
    }
  };

  /* Matchup obj contains types that do not do normal damage */
  typeDataArr.forEach(data => {
    var damageRelations = data.damage_relations;
    var doubleDamage = damageRelations.double_damage_from;
    var halfDamage = damageRelations.half_damage_from;
    var noDamage = damageRelations.no_damage_from;

    doubleDamage.forEach(data => {
      updateMatchup(data, 2, matchup);
    });
    halfDamage.forEach(data => {
      updateMatchup(data, 0.5, matchup);
    });
    noDamage.forEach(data => {
      updateMatchup(data, 0, matchup);
    });
  });

  return matchup;
}

function createColumns(matchup) {
  var sortByMult = function(a, b) {
    return b[1] - a[1];
  };

  var columns = {
    weaknesses: [],
    resistances: [],
    immunities: []
  };

  Object.entries(matchup).forEach(entry => {
    var mult = Number(entry[1]);

    if (mult === 0) {
      columns.immunities.push(entry);
    } else if (mult > 1) {
      columns.weaknesses.push(entry);
    } else if (mult < 1) {
      columns.resistances.push(entry);
    }
  });

  // Sort each array by the multiplier
  columns.weaknesses = columns.weaknesses.sort(sortByMult);
  columns.resistances = columns.resistances.sort(sortByMult);
  columns.immunities = columns.immunities.sort(sortByMult);

  return columns;
}

function renderMatchupColumns(props) {
  const typeDataArr = props.typeDataArr;

  if (!typeDataArr || typeDataArr.length === 0) {
    return <div />;
  }

  var matchup = createTypeMatchup(typeDataArr);
  var columnData = createColumns(matchup);

  // sort keys so columns are in following order: weaknesses, resistences, and immunities
  var sortedKeys = Object.keys(columnData)
    .sort()
    .reverse();

  var columns = sortedKeys.map((key, i) => {
    var title = capitalize(key);
    var matchups = columnData[key];

    var pokeTypeArr = matchups.map((entry, j) => {
      var [type, mult] = entry;

      return (
        <div key={`${title}-type-${j}`}>
          <PokeType type={type} /> (x{mult})
        </div>
      );
    });

    return (
      <ColumnDiv key={`matchup-column-${i}`}>
        <ColumnHeader>{title}</ColumnHeader>
        {pokeTypeArr}
      </ColumnDiv>
    );
  });

  return (
    <div className="flex" style={{justifyContent: "center"}}>
      {columns}
    </div>
  );
}

const PokemonTypeMatchup = props => {
  return (
    <InfoCard title={"Type Matchup"}>{renderMatchupColumns(props)}</InfoCard>
  );
};

export default PokemonTypeMatchup;
