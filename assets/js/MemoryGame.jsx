/*
Memory Game : HW 05
The code has two classes :
1. MemoryGame : It handles logic related to calling elxir code for checking cards for match, number of clicks performed.
2. GameCard : It deals with displaying/customizing cards based on status viz., Matched, un-flipped.
*/

//Importing required files
import React from 'react'
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export default function memorygame_init(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel} />, root);
}

class MemoryGame extends React.Component {

	constructor(props) {
		super(props);
		this.channel = props.channel;
		this.state = {
				cards:[], // Initialize cards
        disabled: false, // For locking the game state when 1st new card is clicked
				previousCard: [], // To keep track of previous card
				clicksPerformed: 0, //To calculate scores based on number of clicks
				matchdone: 0 //To keep count of matches done
		};
    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });
		this.checkCardMatch = this.checkCardMatch.bind(this); //for binding the state while checking cards
		this.restartGame = this.restartGame.bind(this);	// To help in resetting the current state of game
}

	//Function to re-start the game.
	restartGame() {
    this.channel.push("resetgame")
    .receive("ok", this.gotView.bind(this));
	}

  //Function to set state by getting view from server
  gotView(view) {
    this.setState(view.game);
  }

  //Function for checking the card match logic
  checkCardMatch(id, name){
    if(!this.state.disabled){
    this.channel.push("cardmatchcheck",{ cardId: id, cardName: name })
        .receive("ok", this.gotView.bind(this));
    //Bind view and process the further logic
    setTimeout(() => {
      this.checkPreviouCard(id,name);
      }, 400);
    }
    else{
      return null;
    }
  }

  //Function for checking the card match logic contd.. It will check for previous cards.
  checkPreviouCard(id,name){
    if(this.state.previousCard ==''){
      this.channel.push("checkpreviouscard",{ cardId: id, cardName: name })
        .receive("ok", this.gotView.bind(this));
    }
    //Bind view and process the further logic
    else{
      setTimeout(() => {
        this.checkMatchPreviousCard(id,name);
      }, 400);
    }
  }

  //Function to check match with previous card
  checkMatchPreviousCard(id,name){
    if (this.state.previousCard!='')  {
      this.channel.push("checkmatchpreviouscard",{ cardId: id, cardName: name })
        .receive("ok", this.gotView.bind(this));
    }
  }

  //Function for display game cards by setting up required parameters
	displayCards(gameCards,channel) {
		return gameCards.map((gameCard, index) => {
			return (
				< GameCard channel={this.channel} key={index} name={gameCard.name} id={index} match={gameCard.match} turned={gameCard.turned} checkCardMatch={this.checkCardMatch} />
			);
		});
	}

	//Function for rendering data on page
	render() {
		let strRestart = 'Restart Game';
		let msgScores;
		let numClicks=this.state.clicksPerformed;
		//Logic to set scores based on number of  clicks performed to complete the game
		if (this.state.matchdone === 16) {
			// Check for 8 clicks. As 16 cards will make 8 matches and for each match was updated  by 1
			if(this.state.clicksPerformed < 25){
				console.log("Inside Perfect score");
				msgScores = 100 + " (Excellent. Perfect Score !!)";
			}
			// Decreasing final scores as number of clicks increases
			if(this.state.clicksPerformed  > 25 && this.state.clicksPerformed  < 30){
				console.log("Inside Medium score");
				msgScores = 80 + " (Good Job. Near Perfect !)";
			}
      if(this.state.clicksPerformed  == 25 || this.state.clicksPerformed  == 30){
				console.log("Inside Medium score");
				msgScores = 80 + " (Good Job. Near Perfect !)";
			}
			if(this.state.clicksPerformed > 30){
				console.log("Inside Low score");
				msgScores = 60 + " (Not Bad. You can do better !)";
			}

		}
		return (<div className="rowMain">
        <div className="row">
          {this.displayCards(this.state.cards,this.channel).map((card , index) =>
  				<div className="col-3" key={index}>{card}</div>
  				)}
				<br />
				<div className="col-12">
				    Number of Clicks Performed : {numClicks}
				</div>
				<br />
				<div className="col-12">
				    Complete the game in less than 25 clicks to earn THE PERFECT SCORE !!
				</div>
				<div className="col-8">
				    Scores Earned : {msgScores}
				</div>
				<div className="col-4">
				    <button onClick={this.restartGame.bind(this)}>{strRestart}</button>
				</div>
				</div>
				</div>
		);
	}
}

class GameCard extends React.Component {
	constructor(props) {
		super(props);
    this.channel = props.channel;
		this.flipCard = this.flipCard.bind(this);

	}

	//Function for rendering cards based on match/turned status
	render() {
		let strCardValue;
    if (this.props.turned === false){
      strCardValue ='';
    }
    if (this.props.turned === true){
      strCardValue= this.props.name;
    }

		let classesCSS = classNames('GameCard', {'GameCardMatch': this.props.match}, {'GameCardFlip': this.props.turned});
    return (
        <div className={classesCSS} onClick={this.flipCard}> {strCardValue} </div>
    );
	}

	//Function to call when a user clicks  on card
	flipCard() {
    if (!this.props.turned) {
      this.props.checkCardMatch(this.props.id, this.props.name)
    }
  }
}
