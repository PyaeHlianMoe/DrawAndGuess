import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import ColorSelector from "./ColorSelector";
import UserList from "./UserList";
import Countdown from "./Countdown";
import Header from "./Header";
import Scoreboard from "./Scoreboard";

// In development you have to point the react front end explicitly to your express server which will be running on a different port than the React Dev Server

const socket = socketIOClient("http://localhost:4010"); //development;
const playcount = 6;
var isplaying = false;
var answer;
// In production, the express server will be the one to serve the react application so we can leave out the connection string argument, which will allow the socket to default to it origin (theoretically your express server)

// const socket = socketIOClient(); //production

export default class WhiteBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      drawing: false,
      score: 0,
      gamecount: 1,
      currentColor: "red",
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      cleared: false,
      username: null,
      room: null,
      playertype: null,
      userList: []
      //isplaying:false
      //timeleft: 60
    };

    this.whiteboard = React.createRef();

    //socket.emit("timeleft", {
    //  room: this.props.room,
    //  timeleft: this.props.timeleft
    //});

    socket.emit("join", {
      username: this.props.username,
      room: this.props.room,
      playertype: this.props.playertype,
      score: this.props.score
    });

    socket.on("joined", joined => {
      this.setState({
        id: joined.id,
        username: joined.username,
        room: joined.room,
        playertype: joined.playertype,
        score: joined.score
      });
    });

    socket.on("users", users => {
      this.setState({
        userList: users
      });
      if (this.state.userList.length >= 2) {
        isplaying = true;
      } else {
        isplaying = false;
      }
    });

    socket.on("cleared", () => {
      this.state.whiteboard
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
    });

    socket.on("drawing", data => {
      let w = window.innerWidth;
      let h = window.innerHeight;

      if (!isNaN(data.x0 / w) && !isNaN(data.y0)) {
        this.drawLine(
          data.x0 * w,
          data.y0 * h,
          data.x1 * w,
          data.y1 * h,
          data.color
        );
      }
    });

    socket.on("answer", data => {
      answer = data.answer;
    });

    socket.on("chat", data => {
      document.getElementById("output").innerHTML +=
        "<p><strong>" + data.username + ": </strong>" + data.message + "</p>";
      // this.refs.output.innerHTML += "<p><strong>" + data.username + ": </strong>" + data.message + "</p>";
      if (answer === data.message) {
        document.getElementById("output").innerHTML +=
          "<p><strong>" +
          data.username +
          " has guessed correctly.</strong></p>";
        // this.state.gamecount += 1;
        //this.state.score += 1;
        this.state.userList
          .filter(function(player) {
            return player.username === data.username;
          })
          .map(player => (player.score += 1));
        this.setState(this.state);
        // alert(data.username + " is the winner");
      }
    });
  }

  componentDidMount() {
    this.setState({
      whiteboard: this.whiteboard.current
    });
    this.whiteboard.current.style.height = window.innerHeight;
    this.whiteboard.current.style.width = window.innerWidth;

    this.whiteboard.current.addEventListener(
      "mousedown",
      this.onMouseDown,
      false
    );
    this.whiteboard.current.addEventListener("mouseup", this.onMouseUp, false);
    this.whiteboard.current.addEventListener("mouseout", this.onMouseUp, false);
    this.whiteboard.current.addEventListener(
      "mousemove",
      this.throttle(this.onMouseMove, 5),
      false
    );

    this.whiteboard.current.addEventListener(
      "touchstart",
      this.onMouseDown,
      false
    );

    this.whiteboard.current.addEventListener(
      "touchmove",
      this.throttle(this.onTouchMove, 5),
      false
    );

    this.whiteboard.current.addEventListener("touchend", this.onMouseUp, false);

    window.addEventListener("resize", this.onResize);
    this.refs.send.addEventListener("click", this.chatMessage);
  }

  drawLine = (x0, y0, x1, y1, color, emit, force) => {
    let context = this.state.whiteboard.getContext("2d");
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    color === "#ffffff" ? (context.lineWidth = 10) : (context.lineWidth = 2);

    // if (force) {
    // 	context.lineWidth = 1.75 * (force * (force + 3.75));
    // }
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.setState(() => {
      if (!isNaN(x0 / w)) {
        socket.emit("drawing", {
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color: color,
          room: this.state.room,
          force: force
        });

        return {
          cleared: false
        };
      }
    });
  };

  onMouseDown = e => {
    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY,
        drawing:
          this.state.playertype === "Drawer" &&
          this.state.gamecount !== playcount
            ? true
            : false
      };
    });
  };

  onMouseUp = e => {
    this.setState(() => {
      return {
        drawing: false,
        currentX: e.clientX,
        currentY: e.clientY
      };
    });
  };

  onMouseMove = e => {
    if (!this.state.drawing) {
      return;
    }

    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY
      };
    }, this.drawLine(this.state.currentX, this.state.currentY, e.clientX, e.clientY, this.state.currentColor, true));
  };

  onTouchMove = e => {
    if (!this.state.drawing) {
      return;
    }
    console.log();
    this.setState(() => {
      this.drawLine(
        this.state.currentX,
        this.state.currentY,
        e.touches[0].clientX,
        e.touches[0].clientY,
        this.state.currentColor,
        true,
        e.touches[0].force
      );
      return {
        currentX: e.touches[0].clientX,
        currentY: e.touches[0].clientY
      };
    });
  };

  onResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  };

  throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function() {
      let time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  selectColor = color => {
    this.setState(() => {
      socket.emit("color-change", {
        color: color.hex
      });
      return {
        currentColor: color.hex
      };
    });

    //#ff0000'
  };

  erase = () => {
    this.setState(() => {
      if (this.state.currentColor !== "#ffffff") {
        socket.emit("color-change", {
          color: "#ffffff"
        });
        return {
          currentColor: "#ffffff"
        };
      } else {
        socket.emit("color-change", {
          color: "red"
        });
        return {
          currentColor: "red"
        };
      }
    });
  };

  clearBoard = () => {
    this.state.whiteboard
      .getContext("2d")
      .clearRect(0, 0, window.innerWidth, window.innerHeight);
    socket.emit("clear", this.state.room);
  };

  leave = () => {
    socket.emit("leaveroom", { id: this.state.id, room: this.state.room });
  };

  chatMessage = () => {
    socket.emit("chat", {
      room: this.props.room,
      message: this.refs.message.value,
      username: this.props.username,
      score: this.props.score
    });
  };

  displayHandler = () => {
    // Game is finished
    if (this.state.gamecount >= playcount) {
      this.clearBoard();
      return <Scoreboard players={this.state.userList} />;
    } else {
      return this.roomDisplay();
    }
  };

  roomDisplay = () => {
    return (
      <React.Fragment>
        <div className="countdown">{this.countdown()}</div>
        <UserList userList={this.state.userList} />
        {this.header()}
        <div className="chat">
          <h2>
            {this.state.playertype === "Guesser"
              ? "Type your answer here"
              : null}
          </h2>
          <div id="chat-window">
            <div id="output" ref="output"></div>
          </div>
          <input id="username" type="hidden" placeholder="Handle" />
          <input
            id="message"
            ref="message"
            type={this.state.playertype === "Guesser" ? "text" : "hidden"}
            placeholder="Message"
          />
          {this.sendButton()}
        </div>
      </React.Fragment>
    );
  };

  countdown = () => {
    //this.setState(() => {
    /*  socket.emit("timeleft", {
        room: this.state.room,
        timeleft: this.state.timeleft
      });*/
    //});
    return (
      <Countdown
        playertype={this.state.playertype}
        room={this.state.room}
        currentRound={this.state.gamecount}
        timesUp={this.timesUp}
        isplaying={isplaying}
        totalRound={playcount - 1}
      />
    );
  };

  header = () => {
    return (
      <Header
        userList={this.state.userList}
        username={this.state.username}
        room={this.state.room}
        type={this.state.playertype}
        isplaying={isplaying}
        clearboard={this.clearBoard}
      />
    );
  };

  timesUp = () => {
    // TODO when times up
  };

  sendButton = () => {
    if (this.state.playertype === "Guesser") {
      return (
        <button id="send" ref="send">
          Send
        </button>
      );
    } else {
      return (
        <button id="send" ref="send" disabled>
          Send
        </button>
      );
    }
  };

  render() {
    return (
      <div>
        <canvas
          height={`${this.state.windowHeight}px`}
          width={`${this.state.windowWidth}px`}
          ref={this.whiteboard}
          className="whiteboard"
        />

        <ColorSelector
          clearBoard={this.clearBoard}
          currentColor={this.state.currentColor}
          selectColor={this.selectColor}
          erase={this.erase}
          leaveRoom={this.props.clearRoom}
          leave={this.leave}
          type={this.state.playertype}
        />

        {this.displayHandler()}
      </div>
    );
  }
}
