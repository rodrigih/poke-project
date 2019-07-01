import React, {Component} from "react";
import styled from "@emotion/styled";
import InfoCard from "../../components/infoCard";
import {getAbilityByName} from "../../helpers/pokemon-api";
import {getEnglish, capitalize} from "../../helpers/utilities.js";

const DivIndent = styled.div`
  padding-left: 1.5em;
  border-left: 3px solid grey;
`;

class PokemonAbilities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataArr: [],
      isLoading: false,
      hasError: false
    };

    this.handleGettingAbilityData = this.handleGettingAbilityData.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleGettingAbilityData(data) {
    var dataCopy = this.state.dataArr.slice();
    dataCopy.push(data);

    this.setState({dataArr: dataCopy});
  }

  handleError() {
    this.setState({
      hasError: true,
      isLoading: false
    });
  }

  /* Life Cycle functions */
  componentDidMount() {
    const {abilities} = this.props;

    if (!abilities) {
      this.handleError();
    } else {
      abilities.forEach(obj => {
        var abilityName = obj.ability.name;

        getAbilityByName(abilityName)
          .then(this.handleGettingAbilityData)
          .catch(this.handleError);
      });

      this.setState({isLoading: false});
    }
  }

  /* Helper functions */
  sortAbilities(a, b) {
    return a.slot - b.slot;
  }

  displayAbilities() {
    const dataArr = this.state.dataArr;
    const abilities = this.props.abilities;

    if (!dataArr) {
      return;
    }

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

  render() {
    const {dataArr, isLoading, hasError} = this.state;

    if (hasError) {
      return <p> Error finding abilities</p>;
    } else if (isLoading) {
      return <p> Loading... </p>;
    } else if (!dataArr || dataArr.length === 0) {
      return <div />;
    }

    return <InfoCard title={"Abilities"}>{this.displayAbilities()}</InfoCard>;
  }
}

export default PokemonAbilities;
