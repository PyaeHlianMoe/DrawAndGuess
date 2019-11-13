import React, { Component } from "react";
import logo from "../images/logo1.png";

export default class Logo extends Component {
  render() {
    return (
      <div className="logo-container">
        {/* <h1 className="appname just">Draw</h1>
							<h1 className="appname drw">Things</h1> */}

        <img className="logo" src={logo} alt="" />
      </div>
    );
  }
}
