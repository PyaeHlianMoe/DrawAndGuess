import React, { Component } from "react";

export default class JoinRoom extends Component {
  render() {
    return (
      <div>
        <div className="input-container">
          <div className="rowC">
            <input
              onKeyPress={e => (e.key === "Enter" ? this.props.joinRoom() : null)}
              name="room"
              placeholder="Room ID"
              value={this.props.room}
              onChange={e =>
                this.props.changeHandler(e.target.name, e.target.value)
              }
            />
            <button1 onClick={() => this.props.joinRoom()}><i class="fa fa-arrow-circle-right"></i></button1>
          </div>
        </div>
        <span className="warning-message">
          {this.props.room.length > 25 ? this.props.messageName : null}
        </span>
        <div className="submit-container">
        </div>
      </div>
    );
  }
}
