import React, {Component} from "react";
import styled from "@emotion/styled";
import InfoCard from "../../components/infoCard";
import {getTypeByName} from "../../helpers/pokemon-api";
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

class PokemonTypeMatchup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      typeDataArr: [],
      isLoading: false,
      hasError: false
    };

    this.handleGettingType = this.handleGettingType.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleGettingType(data) {
    var newTypeArr = this.state.typeDataArr.slice();
    newTypeArr.push(data);

    this.setState({
      typeDataArr: newTypeArr,
      isLoading: false,
      hasError: false
    });
  }

  handleError(err) {
    this.setState({
      hasError: true,
      isLoading: false
    });
  }

  /* Life Cycle functions */
  componentDidMount() {
    const typeArr = this.props.typeArr;

    if (typeArr && typeArr.length > 0) {
      this.setState({
        isLoading: true,
        hasError: false
      });

      typeArr.forEach(type => {
        getTypeByName(type)
          .then(this.handleGettingType)
          .catch(this.handleError);
      });
    }
  }

  /* Helper functions */
  createTypeMatchup() {
    const typeDataArr = this.state.typeDataArr;

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

  sortMatchups(matchup) {
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

  renderMatchupColumns(matchup) {
    var columnData = this.sortMatchups(matchup);

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

  render() {
    const {isLoading, hasError} = this.state;
    const typeArr = this.props.typeArr;

    if (hasError) {
      return (
        <p> Could not find information on following types: {typeArr.join()}</p>
      );
    } else if (isLoading) {
      return <p> Loading... </p>;
    } else if (!typeArr || typeArr.length === 0) {
      return <div />;
    }

    var matchup = this.createTypeMatchup();

    //
    return (
      <div>
        <InfoCard title={"Type Matchup"}>
          {this.renderMatchupColumns(matchup)}
        </InfoCard>
      </div>
    );
  }
}

export default PokemonTypeMatchup;
