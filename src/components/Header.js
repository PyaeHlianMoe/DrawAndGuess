import React, { PureComponent } from "react";
import { randomWord } from "./Game";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:4010"); //development;
var img = "";
var word = "";

export default class Header extends PureComponent {
  state = {
    open: false,
    word: randomWord()
  };

  toggleImage = () => {
    this.setState(state => ({ open: !state.open }));
  };

  toogleHintWord = () => {
    this.setState(state => ({ open: true }));
  };

  render() {
    // eslint-disable-next-line array-callback-return
    let header = this.props.userList.map(user => {
      if (this.props.isplaying === true) {
        this.props.clearboard();
        if (
          user.username === this.props.username &&
          user.playertype === "Drawer"
        ) {
          //word = randomWord();
          switch (this.state.word) {
            case "apple":
              img = "https://i.ibb.co/DCJ97Ww/apple.png";
              break;
            case "orange":
              img = "https://i.ibb.co/Vx0h65B/orange.jpg";
              break;
            case "plane":
              img = "https://i.ibb.co/LZpcr20/plane.jpg";
              break;
            case "cloud":
              img = "https://i.ibb.co/T0gKV5p/cloud.png";
              break;
            case "tree":
              img = "https://i.ibb.co/3p9BKCc/tree.png";
              break;
            case "car":
              img = "https://i.ibb.co/TRLBTTW/car.png";
              break;
            default:
          }
          socket.emit("answer", {
            answer: this.state.word
          });
          return "Please draw " + this.state.word;
        } else {
          if (user.playertype === "Drawer") {
            return user.username + " is Drawing";
          }
        }
      }
    });
    let code = this.props.userList.map(user => {
      if (
        user.username === this.props.username &&
        user.playertype === "Drawer"
      ) {
        //this.setState(state => ({ hintbutton: "Show/Hide Button" }));
        return "Secrect code is " + this.props.room;
      } else {
        //this.setState(state => ({ hintbutton: null }));
        return null;
      }
    });

    let hint = this.props.userList.map(user => {
      if (
        user.username === this.props.username &&
        user.playertype === "Drawer" &&
        this.props.isplaying === true
      ) {
        return this.state.open ? (
          <img className="hint" src={img} alt={this.state.word} />
        ) : null;
      }

      if (
        user.username === this.props.username &&
        user.playertype === "Guesser"
      ) {
        socket.on("answer", data => {
          word = data.answer;
        });
        let hintWord = "";
        for (var i = 0; i < word.length; i++) {
          if (i < Math.ceil(word.length / 2)) {
            hintWord += word[i];
          } else {
            hintWord += "_ ";
          }
        }
        return this.state.open ? (
          <h1 className="hintword">Hint word: {hintWord.slice(0, -1)}</h1>
        ) : null;
      }
    });

    let hintbutton = this.props.userList.map(user => {
      if (
        user.username === this.props.username &&
        user.playertype === "Drawer"
      ) {
        return <button onClick={this.toggleImage}>Show/Hide Hint</button>;
      }
      if (
        user.username === this.props.username &&
        user.playertype === "Guesser"
      ) {
        return <button onClick={this.toogleHintWord}>Show Hint</button>;
      }
    });

    return (
      <React.Fragment>
        {hint}
        <h1 className="code-name">{code}</h1>
        <h2 className="room-name">{header}</h2>
        <div className="hintbutton">{hintbutton}</div>
      </React.Fragment>
    );
  }
}
