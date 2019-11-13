import React, { Component } from "react";

export default class Playername extends Component {
  render() {
    return (
      <div>
        <div className="input-container" style={{float: 'left'}}>
          <div className="rowC">
            <input
              onKeyPress={e =>
                e.key === "Enter" ? this.props.setUsername() : null
              }
              name="typing"
              placeholder="Enter username"
              value={this.props.typing}
              onChange={e =>
                this.props.changeHandler(e.target.name, e.target.value)
              }
            />
            <button1 onClick={() => this.props.setUsername()}><i class="fa fa-arrow-circle-right"></i></button1>
          </div>
        </div>
        <span className="warning-message">
          {this.props.typing.length > 25 ? this.props.messageName : null}
        </span>
        <div className="submit-container">
        </div>
      </div>
    );
  }
}
