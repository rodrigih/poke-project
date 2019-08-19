import React, {PureComponent} from "react";
import {Link} from "react-router-dom";
import styled from "@emotion/styled";
import InfoCard from "../../components/infoCard";
import {
  getPokemonByName,
  getPokemonSpeciesByName
} from "../../helpers/pokemon-api";
import {capitalize} from "../../helpers/utilities";

const EvoArrow = styled.div`
  text-align: center;
  padding: 0 1em;
`;

const EvoNode = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1em;
`;

const FlexColumnCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EvoSprite = styled(FlexColumnCenter)`
  padding: 1em;
  text-align: center;
`;

class EvolutionChain extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      evolutionTree: [],
      isLoading: false,
      hasError: false
    };

    this.getAllData = this.getAllData.bind(this);
    this.createEvoNode = this.createEvoNode.bind(this);
    this.loadChildren = this.loadChildren.bind(this);
    this.handleTreeData = this.handleTreeData.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  removeMegas(variety) {
    const {
      pokemon: {name}
    } = variety;
    var pattern = new RegExp("(-mega-?|-totem-?)");

    return !name.match(pattern);
  }

  getAllData(speciesName) {
    return getPokemonSpeciesByName(speciesName)
      .then(speciesData => {
        const {varieties} = speciesData;

        // Remove Varieties from pikachu since they don't pertain to evolution
        var varietiesArr =
          speciesName === "pikachu" ? varieties.slice(0, 1) : varieties.slice();

        // Filter out Megas
        varietiesArr = varietiesArr.filter(this.removeMegas);

        return Promise.all(
          varietiesArr.map(variety => {
            const {name: pokemonName} = variety.pokemon;

            return getPokemonByName(pokemonName)
              .then(pokemonData => {
                const {name, sprites} = pokemonData;
                return new Promise((resolve, reject) =>
                  resolve({name: name, sprites: sprites})
                );
              })
              .catch(this.handleError);
          })
        );
      })
      .catch(this.handleError);
  }

  createEvoNode(evoChain) {
    var node = {
      varieties: [],
      children: [],
      evolutionDetails: []
    };

    const {
      species: {name: speciesName},
      evolves_to,
      evolution_details
    } = evoChain;

    return this.getAllData(speciesName)
      .then(pokemonVarieties => {
        return this.loadChildren(evolves_to).then(children => {
          node.varieties = pokemonVarieties;
          node.children = children;
          node.evolutionDetails = evolution_details;

          return node;
        });
      })
      .catch(this.handleError);
  }

  loadChildren(children) {
    return Promise.all(children.map(this.createEvoNode));
  }

  createEvolutionText(evoDetails) {
    const {
      gender,
      held_item,
      item,
      known_move,
      known_move_type,
      location,
      min_affection,
      min_beauty,
      min_happiness,
      min_level,
      needs_overworld_rain,
      party_species,
      party_type,
      relative_physical_stats,
      time_of_day,
      trade_species,
      trigger,
      turn_upside_down
    } = evoDetails;

    const {name} = trigger || {};

    var textArr = [];

    // Add text depending on trigger (none for use-item)
    if (name === "trade" && !trade_species) {
      textArr.push("trade");
    } else if (name === "level-up") {
      textArr.push("level up");
    } else if (name === "shed") {
      textArr.push("Empty slot in party, pok\u00E9ball in bag");
    }

    /* Add additional text based on conditions */

    // Gender
    if (gender) {
      var genderName = gender === 1 ? "female" : "male";
      textArr.push(genderName);
    }

    // Stats
    if (min_level) {
      textArr.push(`at level ${min_level}`);
    }
    if (min_beauty) {
      textArr.push(`with max beauty`);
    }
    if (min_happiness) {
      textArr.push("with high friendship");
    }
    if (min_affection) {
      textArr.push(`${min_affection} hearts in pok\u00E9mon amie`);
    }
    if (relative_physical_stats !== null) {
      var statText = [
        "with attack < defense",
        "with attack = defense",
        "with attack > defense"
      ];

      textArr.push(statText[relative_physical_stats + 1]); // add 1 to get valid indices
    }

    // Items
    if (item) {
      textArr.push(`use ${item.name.replace("-", " ")}`);
    }

    if (held_item) {
      textArr.push(`holding ${held_item.name.replace("-", " ")}`);
    }

    // Moves
    if (known_move) {
      var moveName = known_move.name.replace("-", " ");
      textArr.push(`after learning ${moveName}`);
    }

    if (known_move_type) {
      var typeName = known_move_type.name;
      textArr.push(`after learning a ${typeName}-type move`);
    }

    // Overworld
    if (location) {
      textArr.push(location.name.replace("-", " "));
    }

    if (needs_overworld_rain) {
      textArr.push("in the overworld rain");
    }

    if (time_of_day) {
      textArr.push(`at ${time_of_day}`);
    }

    // Party
    if (party_species) {
      textArr.push(`with ${party_species.name} in party`);
    }
    if (party_type) {
      textArr.push(`with ${party_type.name}-type pok\u00E9mon in party`);
    }

    // Trade
    if (trade_species) {
      textArr.push(`trade with ${trade_species.name}`);
    }

    // Console
    if (turn_upside_down) {
      textArr.push("with console turned upside-down");
    }

    return textArr.join(" ");
  }

  /* Functions for handling API data */

  handleError(err) {
    this.setState({
      isLoading: false,
      hasError: true
    });
  }

  handleTreeData(tree) {
    this.setState({
      isLoading: false,
      evolutionTree: tree
    });
  }

  /* Life Cycle functions */
  componentDidMount() {
    if (this.props.evolutionData) {
      this.setState({isLoading: true});
      const {chain} = this.props.evolutionData;

      this.createEvoNode(chain).then(this.handleTreeData);
    }
  }

  componentDidUpdate(prevProps) {
    const {evolutionData} = this.props;

    if (
      evolutionData &&
      (!prevProps.evolutionData ||
        prevProps.evolutionData.id !== evolutionData.id)
    ) {
      this.setState({isLoading: true});

      const {chain} = evolutionData;

      this.createEvoNode(chain).then(this.handleTreeData);
    }
  }

  renderColumn(nodeArr, acc) {
    if (!nodeArr || !nodeArr.length) {
      return acc;
    }

    var stage = acc.length;

    var stageArr = nodeArr.map((node, nodeInd) => {
      const {varieties, evolutionDetails} = node;

      if (!varieties) {
        return <div key={`empty-stage-${stage} node-${nodeInd}`} />;
      }

      var varietiesArr = varieties.map((variety, varietyInd) => {
        const {
          name,
          sprites: {front_default: spriteUrl}
        } = variety;

        var imgDesc = `${name} sprite`;

        var evoArrow = stage ? (
          <EvoArrow>
            <img
              alt="rightarrow"
              src={require("../../assets/right_arrow.svg")}
            />
            {evolutionDetails.map(this.createEvolutionText).map((curr, ind) => {
              return (
                <p key={"evoText-" + ind}>
                  {" "}
                  {ind ? "or" : ""} {curr}{" "}
                </p>
              );
            })}
          </EvoArrow>
        ) : (
          ""
        );

        return (
          <EvoNode key={`stage-${stage} variety-${varietyInd}`}>
            {evoArrow}
            <EvoSprite>
              <Link to={`/pokemon/${name}`}>
                <img alt={imgDesc} src={spriteUrl} />
                <p>{capitalize(name)}</p>
              </Link>
            </EvoSprite>
          </EvoNode>
        );
      });

      return <div key={`stage-${stage} node-${nodeInd}`}>{varietiesArr} </div>;
    });

    var column = (
      <FlexColumnCenter key={`stage-${stage}`}> {stageArr} </FlexColumnCenter>
    );

    acc.push(column);

    nodeArr.forEach(node => {
      this.renderColumn(node.children, acc);
    });

    return acc;
  }

  renderChain() {
    const {evolutionTree} = this.state;
    const {speciesName} = this.props;

    if (!evolutionTree) {
      return <p> Error rendering evolution chain </p>;
    }

    // Has Evolutions
    if (evolutionTree.children && evolutionTree.children.length) {
      return (
        <div className="flex content-center">
          {this.renderColumn([evolutionTree], [])}
        </div>
      );
    }

    // No Evolutions
    return (
      <p style={{textAlign: "center"}}>
        {" "}
        {capitalize(speciesName)} is not known to evolve.{" "}
      </p>
    );
  }

  render() {
    const {hasError, isLoading} = this.state;
    const {evolutionData} = this.props;

    var content;

    if (hasError) {
      content = <p> Error getting evolution data </p>;
    } else if (isLoading) {
      content = <p> Loading... </p>;
    } else if (!evolutionData) {
      content = <div />;
    } else {
      content = this.renderChain();
    }

    return <InfoCard title="Evolution chain"> {content}</InfoCard>;
  }
}

export default EvolutionChain;
