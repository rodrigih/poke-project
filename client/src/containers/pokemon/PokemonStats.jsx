import React from "react";
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis} from "recharts";
import styled from "@emotion/styled";
import InfoCard from "../../components/infoCard";
import {capitalize, calcStat} from "../../helpers/utilities.js";

/* Styled components */
const Header = styled.h3`
  text-align: center;
  border-bottom: 2px solid black;
  display: inline-block;
  margin: inherit auto;
`;

/* Constants used in pokemon stats */
const MAX_IV = 31;
const MAX_EV = 252;
const POS_NATURE_MULT = 1.1; //Increases stat by 10%
const NEG_NATURE_MULT = 0.9; //Decreases stat by 10%

const MAX_STAT_INFO = {
  iv: MAX_IV,
  ev: MAX_EV,
  level: 100,
  natureMult: POS_NATURE_MULT
};

const MIN_STAT_INFO = {
  iv: 0,
  ev: 0,
  level: 100,
  natureMult: NEG_NATURE_MULT
};

/* Common React Components */
const StatYAxis = (
  <YAxis
    width={200}
    dataKey="name"
    type="category"
    tickLine={false}
    axisLine={false}
    tick={{fill: "black", fontWeight: "bold"}}
  />
);

const StatXAxis = props => {
  const {type, tickLine, ...otherProps} = props;

  return <XAxis {...otherProps} type="number" tickLine={false} />;
};

const StatBar = props => {
  const {label, isAnimationActive, ...otherProps} = props;

  return (
    <Bar
      {...otherProps}
      label={{position: "right", fill: "black"}}
      isAnimationActive={false}
    />
  );
};

function processBaseStatData(statData) {
  return statData.map(data => {
    const {
      stat: {name},
      base_stat: baseStat
    } = data;

    var statName =
      name === "hp" ? name.toUpperCase() : capitalize(name.replace("-", " "));

    return {
      name: statName,
      baseStat: baseStat
    };
  });
}

function getStatRangeData(statData) {
  return statData.map(data => {
    const {
      stat: {name},
      base_stat: baseStat
    } = data;

    const statName =
      name === "hp" ? name.toUpperCase() : capitalize(name.replace("-", " "));

    const baseStatInfo = {
      stat: name,
      statName: statName,
      baseStat: baseStat
    };

    const minStatInfo = Object.assign(
      Object.create(baseStatInfo),
      MIN_STAT_INFO
    );
    const maxStatInfo = Object.assign(
      Object.create(baseStatInfo),
      MAX_STAT_INFO
    );

    return {
      name: statName,
      minStat: calcStat(minStatInfo),
      maxStat: calcStat(maxStatInfo)
    };
  });
}

const PokemonStats = React.memo(props => {
  const {statData} = props;

  const orderedStats = statData.slice().reverse();
  const data = processBaseStatData(orderedStats);
  const statRangeData = getStatRangeData(orderedStats);

  console.log("Pokemon Stats rendered");

  return (
    <InfoCard title={"Stats"}>
      <div className="flex flex-column content-center">
        <Header>Base Stats</Header>
        <ResponsiveContainer width="80%" height={400}>
          <BarChart data={data} layout="vertical" margin={{right: 50}}>
            {StatBar({dataKey: "baseStat", fill: "#4FA4E4"})}
            {StatXAxis({dataKey: "baseStat", domain: [0, 255]})}
            {StatYAxis}
          </BarChart>
        </ResponsiveContainer>

        <Header> Stat Range (Lv. 100)</Header>
        <ResponsiveContainer width="80%" height={400}>
          <BarChart data={statRangeData} layout="vertical" margin={{right: 50}}>
            {StatBar({dataKey: "maxStat", fill: "#4FA4E4"})}
            {StatBar({dataKey: "minStat", fill: "#E45010"})}
            {StatXAxis({domain: [0, 714]})}
            {StatYAxis}
          </BarChart>
        </ResponsiveContainer>

        <p>
          * Note: Above stats are calculated for the pokemon at level 100 in the
          following manner
        </p>

        <ul>
          <li>
            Minimum stat uses no EVs, no IVs, and a detremental nature (if
            applicable).
          </li>
          <li>
            Maximum stat uses 252 EVs, 31 IVs, and a beneficial nature (if
            applicable).
          </li>
        </ul>
      </div>
    </InfoCard>
  );
});

export default PokemonStats;
