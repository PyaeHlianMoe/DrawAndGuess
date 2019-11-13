import React, { Component } from "react";

export default class NewRoom extends Component {
  render() {
    return (
      <div className="submit-container">
        <button2 onClick={() => this.props.newRoom()}>Start a new game</button2>
        
      </div>
    );
  }
}
