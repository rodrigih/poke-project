import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import styled from "@emotion/styled";

const ULFlex = styled.ul`
  display: flex;
`;

const LINKS = [
  { url: "/", text: "Home", idStr: "home-link" },
  { url: "/Pokemon", text: "Pokemon", idStr: "pokemon-link" },
  { url: "/Moves", text: "Moves", idStr: "moves-link" },
  { url: "/Items", text: "Items", idStr: "items-link" },
  { url: "/Berries", text: "Berries", idStr: "berries-link" }
];

class NavLinks extends Component {
  constructor(props) {
    super(props);
    this.renderLinks = this.renderLinks.bind(this);
  }

  renderLinks() {
    return LINKS.map(({ url, text, idStr }, i) => {
      const {
        location: { pathname }
      } = this.props;
      const shouldHighlightLink =
        pathname === url || (i > 0 && pathname.includes(url));
      return (
        <Link
          className={cx({ "active-link": shouldHighlightLink })}
          to={url}
          key={idStr}
        >
          {text}
        </Link>
      );
    });
  }

  render() {
    return (
      <nav>
        <ULFlex>{this.renderLinks()}</ULFlex>
      </nav>
    );
  }
}

export default NavLinks;
