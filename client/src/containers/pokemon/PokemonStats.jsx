import React from "react";
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis} from "recharts";
import styled from "@emotion/styled";
import InfoCard from "../../components/infoCard";
import {capitalize} from "../../helpers/utilities.js";

const Header = styled.h3`
  text-align: center;
  border-bottom: 2px solid black;
  display: inline-block;
  margin: inherit auto;
`;

function processData(props) {
  const {statData} = props;

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

const PokemonStats = props => {
  const data = processData(props);

  return (
    <InfoCard title={"Stats"}>
      <div className="flex flex-column content-center">
        <Header>Base Stats</Header>
        <ResponsiveContainer width="80%" height={400}>
          <BarChart data={data} layout="vertical">
            <Bar
              dataKey="baseStat"
              fill="#4FA4E4"
              label={{position: "right", fill: "black"}}
              isAnimationActive={false}
            />
            <XAxis
              dataKey="baseStat"
              type="number"
              tickLine={false}
              domain={[0, 255]}
            />
            <YAxis
              width={200}
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tick={{fill: "black", fontWeight: "bold"}}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </InfoCard>
  );
};

export default PokemonStats;
