import React, { Component } from "react";
import WhiteBoard from "./components/WhiteBoard";
import Logo from "./components/Logo";
import Playername from "./components/Playername";
import Newroom from "./components/NewRoom";
import Joinroom from "./components/JoinRoom";
import socketIOClient from "socket.io-client";

import "./App.scss";

const socket = socketIOClient("http://localhost:4010"); //development;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      playertype: "",
      room: "",
      score: 0,
      gamecount: 1,
      typing: "",
      typingRoom: "",
      messageRoom: `The room name must be less than 25 character`,
      messageName: `The your name must be less than 25 character, try abbreviating`,
      roomList: [],
      timeleft: 60
    };

    socket.on("roomlist", data => {
      this.setState({
        roomList: data
      });
    });
  }

  componentDidMount() {
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", e => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can add to home screen
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    });
  }

  changeHandler = (inputName, value) => {
    this.setState({
      [inputName]: value
    });
  };

  inputHandler = () => {
    if (this.state.username === "") {
      return (
        <Playername
          {...this.state}
          setUsername={this.setUsername}
          changeHandler={this.changeHandler}
        />
      );
    } else if (this.state.username !== "") {
      return (
        <React.Fragment>
          <Newroom
            {...this.state}
            newRoom={this.newGame}
            changeHandler={this.changeHandler}
          />
          <Joinroom
            {...this.state}
            joinRoom={this.joinGame}
            changeHandler={this.changeHandler}
          />
        </React.Fragment>
      );
    }
  };

  setUsername = () => {
    if (this.state.typing.length <= 25) {
      this.setState({
        username: this.state.typing || this.state.username
      });
    }
  };

  newGame = () => {
    let roomId = this.generateRoomId();
    this.setState({
      room: roomId,
      playertype: "Drawer",
      score: 0
    });
    socket.emit("room", {
      room: roomId
    });
    socket.emit("timeleft", {
      room: roomId,
      seconds: 60
    });
  };

  joinGame = () => {
    socket.on("roomlist", data => {
      this.setState({
        roomList: data
      });
    });

    if (this.state.roomList.includes(this.state.room)) {
      this.setState({
        room: this.state.room,
        playertype: "Guesser",
        score: 0,
        isplaying:true
      });
    } else {
      alert("Please enter correct secrect code");
    }
  };

  generateRoomId = () => {
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  clearRoom = () => {
    this.setState({
      username: "",
      playertype: "",
      room: "",
      typingRoom: "",
      typing: "",
      score: 0,
      gamecount: 1,
      timeleft: 60
    });
  };

  render() {
    return (
      <div className="App">
        {this.state.username &&
        this.state.roomList.includes(this.state.room) &&
        (this.state.playertype === "Drawer" ||
          this.state.playertype === "Guesser") ? (
          <WhiteBoard clearRoom={this.clearRoom} {...this.state} />
        ) : (
          <div className="login">
            <div>
              <div className="login-container">
                <Logo />
              </div>
              <div>{this.inputHandler()}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
