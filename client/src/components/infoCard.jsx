import React, {Component} from "react";
import styled from "@emotion/styled";

const Card = styled.div`
  width: 95%;
  margin: 1em auto;
  text-align: left;
`;

const CardHeader = styled.div`
  background-color: #e74c3c;
  color: #eee;
  font-size: calc(10px + 2vmin);
  font-weight: bold;
  padding: 5px;
  text-align: center;
`;

class InfoCard extends Component {
  render() {
    return (
      <Card>
        <CardHeader role="heading" aria-level="2">
          {this.props.title}
        </CardHeader>
        {this.props.children}
      </Card>
    );
  }
}

export default InfoCard;
