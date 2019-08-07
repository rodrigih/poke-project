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
    var pattern = new RegExp("-mega-?");

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
      children: []
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
      const {varieties} = node;

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
            &rarr;
            <p>Enter evo information here</p>
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
    const {pokemonName} = this.props;

    if (!evolutionTree) {
      return <p> Error rendering evolution chain </p>;
    }

    // Has Evolutions
    if (evolutionTree.children && evolutionTree.children.length) {
      return (
        <div className="flex">{this.renderColumn([evolutionTree], [])}</div>
      );
    }

    // No Evolutions
    return (
      <p style={{textAlign: "center"}}>
        {" "}
        {capitalize(pokemonName)} is not known to evolve.{" "}
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
