// Imports
import React, { Component } from 'react'
import '../Scoreboard.css';
/*
  All code here is blatantly stolen from Treehouse's React Basics workshop found at https://teamtreehouse.com/library/react-basics

  The difference is, after completing the worksjop I ES2015-ified the react components and javascript as an exercise to practice more ES2015.
*/

// Es6 Stateless component
const Player = (props) => (
  <div className="player">
    <div className="player-name">
      {props.username}
    </div>
    <div className="player-score">
        {props.score}
    </div>
  </div>
)

export default class Scoreboard extends Component {
  constructor(props) {
    super(props)
    // Set the initial state
    this.state = { players: this.props.players }
    
    //let guessers = this.state.players.list.filter( function (players) {
    //  return players.playertype === 'Guesser'
   //});

  }
  
  render () {
    return (
      <div className="scoreboard">
        <div className="players">

          {this.state.players.filter( function (player) {
            return player.playertype === 'Guesser'
          }).map((player) =>
            <Player 
              username={player.username} 
              score={player.score} /> 
          )}
        </div>

        {/* <div className="ok-button">
          <h1> OK </h1>
        </div> */}
      
      </div>
    );
  }
}