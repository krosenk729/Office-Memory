import React from 'react';
import ReactDOM from 'react-dom';
// import './assets/';
// import './styles/index.css';


// renders a single <button>
class CardSquare extends React.Component {
  render() {
  	const cx = require('classnames');
  	const cardFront = `front-${this.props.val}`;
  	const classes = cx({
  		'card': true,
  		'back': !this.props.show,
  		'front': this.props.show,
  		[cardFront]: this.props.show
  	});
  	const showText = this.props.show ? this.props.val : '';
    return (
      <button className={classes} onClick={this.props.onClick}></button>
    );
  }
}

// renders 16 squares
class Board extends React.Component {
	// onClick={()=>this.props.onClick(i)}
	_renderCards(props){
		return props.cardList.map(i=>{
			return <CardSquare order={i.order} 
						key={i.order}
						val={i.val}
						found={i.found} 
						show={i.show}
						onClick={()=> props.onClick(i)} 
					/>
			});
	}
	render(){
		return(
		<div className='card-grid'>{this._renderCards(this.props)}</div>
		)
	}
}

// checks click wins 
// manages state
class Game extends React.Component {
	constructor(){
		super();
		this.state = {
			gameCards: CardList(6),
			guess1: -1, 
			guess2: -1,
			locked: false,
			step: 0,
			wins: 0,
			prsteps: 10000
		}
	}
	render(){
		console.log('State ', this.state);
		return([
			<div className="scoreBoard">
				<span className="score">Step: {this.state.step}</span>
				<span className="score">Wins: {this.state.wins}</span>
				<span className="score">Best Score: {this.state.prsteps === 10000 ? '-' : this.state.prsteps}</span>
			</div>,
			<div className="gameBoard">
				<Board cardList={this.state.gameCards} onClick={i=>this._handleClick(i)} />
			</div>
		])
	}

	_handleClick(clickedCard){
		if(this.state.locked || clickedCard.show || (this.state.guess1 > -1 && this.state.guess2 > -1)){
			return console.log('skipped click');
		}
		this.setState({
			locked: true
		});

		if(this.state.guess1 < 0){
		// if this is the first of two guesses...
			let updatedStep = this.state.step + 1;
			let updatedCards = this.state.gameCards.slice();
			updatedCards[clickedCard.order].flip();

			this.setState({
				step: updatedStep,
				gameCards: updatedCards,
				guess1: clickedCard.order,
				locked: false
			});
		} else {
		// if this is the second of two guesses...
			let updatedStep = this.state.step + 1;
			let updatedCards = this.state.gameCards.slice();
			updatedCards[clickedCard.order].flip();

			this.setState({
				step: updatedStep,
				gameCards: updatedCards,
				guess2: clickedCard.order
			});

			setTimeout(this._handleRound.bind(this), 1000);
		}

	}

	_handleRound(){
		let newCardList = this.state.gameCards.slice();
		let card1 = newCardList[ this.state.guess1 ];
		let card2 = newCardList[ this.state.guess2 ];
		if(card1.val === card2.val){
			card1.setFound();
			card2.setFound();

			if(newCardList.every(c => c.found )){
				return this._newGame();
			}

		} else {
			card1.flip();
			card2.flip();
		}

		this.setState({
			gameCards: newCardList,
			guess1: -1,
			guess2: -1,
			locked: false
		});
	}

	_newGame(){
		let newWins = this.state.wins + 1;
		let newPR = Math.min(this.state.prsteps, this.state.step);
		this.setState({
			gameCards: CardList(6),
			guess1: -1,
			guess2: -1,
			step: 0,
			wins: newWins,
			prsteps: newPR,
			locked: false
		});
	}

}

function Card(val, order){
	this.val = val;
	this.order = order || 0;
	this.show = false;
	this.found = false;
}

Card.prototype.flip = function(){
	console.log('flip ');
	return this.show = !this.show;
}
Card.prototype.setFound = function(){
	this.show = true;
	return this.found = true;
}

function CardList(numpairs){
	const allPlayers = ['Jim', 'Angela', 'Creed', 'Dwight', 'Deryl', 'Kelly', 'Kevin', 'Michael', 'Pam', 'Oscar', 'Toby', 'Phyllis', 'Meredith', 'Stanley'];
	let _numpairs = Math.min(numpairs, allPlayers.length);
	let pairList = allPlayers.rand().slice(0, _numpairs);
	return [...pairList, ...pairList].rand().map((i, o) => new Card(i, o));
}

Array.prototype.rand = function(){
	return this.sort((a, b)=> 0.5 - Math.random());
}

////////////////////////////////////////////////////
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
