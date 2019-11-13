import React, { Component } from "react";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:4010"); //development;

export default class Countdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      minutes: 0
      //seconds: this.props.timeleft
    };

    socket.on("timeleft", data => {
      if (this.props.room === data.room) {
        this.setState({
          seconds: data.seconds
        });
        //alert(this.props.room + " " + data.room + " " + data.seconds);
      }
    });
  }
  componentDidMount() {
    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state;
      if (seconds > 0 && this.props.isplaying === true) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }));
      }
      if (this.props.isplaying === true) {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(this.myInterval);
          } else {
            this.setState(({ minutes }) => ({
              minutes: minutes - 1,
              seconds: 59
            }));
          }
        }
      }
      socket.emit("timeleft", {
        room: this.props.room,
        seconds: this.state.seconds
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
    socket.emit("timeleft", {
      room: this.props.room,
      seconds: 60
    });
  }

  render() {
    const { minutes, seconds } = this.state;

    return (
      <div>
        {(minutes === 0 && seconds === 0 ? (
            <h1>Times up</h1>
          ) : (
            <h1 style={{ color: "#2904f7" }}>
              Time Remaining: {seconds < 10 ? `0${seconds}` : seconds}
            </h1>
          )
        ) 
        //: minutes === 0 && seconds === 0 ? (
          //this.props.timesUp()
        //) : null
       }
        <h2>
          Round is {this.props.currentRound}/{this.props.totalRound}
        </h2>
      </div>
    );
  }
}
