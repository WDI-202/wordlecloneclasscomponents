import React from "react";
import "./App.css";
import { answerList, wordList } from "./wordleWords";

const numberOfGuesses = 6;
const lettersPerGuess = 5;

const createEmptyGuessesArray = (numGuesses, numLetters) => {
  const guesses = [];
  for (let i = 0; i < numGuesses; i++) {
    const newGuess = Array.from({ length: numLetters }, () => "");
    guesses.push(newGuess);
  }
  return guesses;
};

function dayIncrementor() {
  const startDate = new Date("6-10-2022");
  const today = new Date();
  const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  return days;
}

const pickWordleAnswer = () => answerList[dayIncrementor()];

const defaultGuessList = createEmptyGuessesArray(
  numberOfGuesses,
  lettersPerGuess
);

const GAME_STATE_ENUM = {
  playing: "PLAYING",
  won: "WON",
  lost: "LOST",
  menu: "MENU",
};

// Functional vs Display Components

class App extends React.Component {
  constructor(props) {
    super(props);
    const todaysWordleAnswer = pickWordleAnswer()
    this.state = {
      guesses: JSON.parse(JSON.stringify(defaultGuessList)),
      wordleGuessIndex: 0,
      wordleLetterIndex: 0,
      wordleAnswer: todaysWordleAnswer,
      gameState: GAME_STATE_ENUM.playing, // "playing", "won", "lost"
      gameMessage: `The Word To Guess Is: ${todaysWordleAnswer}`
    };
    this.keyBoardArr = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Delete", "Z", "X", "C", "V", "B", "N", "M", "Enter"],
    ];
  }
  handleKeyPress = (key) => {
    console.log("handleKeyPress ", key);
    if (key === "Enter") {
      this.handleEnterKey()
      return;
    }
    if (key === "Backspace" || key === "Delete") {
      this.handleBackspace();
      return;
    }
    if (this.state.wordleLetterIndex > 4) {
      return;
    }

    const guessesCopy = JSON.parse(JSON.stringify(this.state.guesses));
    guessesCopy[this.state.wordleGuessIndex][this.state.wordleLetterIndex] =
      key;

    this.setState({
      guesses: guessesCopy,
      wordleLetterIndex: this.state.wordleLetterIndex + 1,
    });

  };
  handleBackspace = () => {
    if (this.state.wordleLetterIndex === 0) {
      return;
    }
    const guessesCopy = JSON.parse(JSON.stringify(this.state.guesses));
    guessesCopy[this.state.wordleGuessIndex][this.state.wordleLetterIndex - 1] =
      "";

    this.setState({
      guesses: guessesCopy,
      wordleLetterIndex: this.state.wordleLetterIndex - 1,
    });
  };
  handleEnterKey = () => {
    const currentGuess = this.state.guesses[this.state.wordleGuessIndex].join("").toLowerCase()
    const isValidGuess = this.checkIsValidGuess(currentGuess);
    const newGameState = this.checkGameState(currentGuess)

    if (!isValidGuess) {
      this.setState({
        gameMessage: "Your guess was not valid. Please try again!"
      })
      return;
    }

    if (this.state.gameState === GAME_STATE_ENUM.playing) {
      console.log("Still playing, increment guess index by 1")
      this.setState({
        wordleGuessIndex: this.state.wordleGuessIndex + 1,
        wordleLetterIndex: 0,
      })
    }

    let newGameMessage = `The Word To Guess Is: ${this.state.wordleAnswer}`;

    if (newGameState === GAME_STATE_ENUM.won) {
      newGameMessage = "You won!"
    }
    if (newGameState === GAME_STATE_ENUM.lost) {
      newGameMessage = "You lost :("
    }

    this.setState({
      gameState: newGameState,
      gameMessage: newGameMessage
    })
  };
  checkGameState = (currentGuess) => {
    if (currentGuess === this.state.wordleAnswer.toLowerCase()) {
      return GAME_STATE_ENUM.won;
    }
    if (this.state.wordleGuessIndex === 5) {
      return GAME_STATE_ENUM.lost;
    }
    return GAME_STATE_ENUM.playing
  };
  checkIsValidGuess = (currentGuess) => {
    if (!answerList.includes(currentGuess) && !wordList.includes(currentGuess)) {
      return false;
    }
    return true;
  };
  render() {
    return (
      <DisplayApp
        gameMessage={this.state.gameMessage}
        keyBoardArr={this.keyBoardArr}
        guesses={this.state.guesses}
        handleKeyPress={this.handleKeyPress}
      />
    );
  }
}

class DisplayApp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Wordle Clone Class Components</h1>
          <h2>{this.props.gameMessage}</h2>
          <WordleGrid guesses={this.props.guesses} />
          <Keyboard
            keyBoardArr={this.props.keyBoardArr}
            handleKeyPress={this.props.handleKeyPress}
          />
        </header>
      </div>
    );
  }
}

class WordleGrid extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="wordle-grid">
        {this.props.guesses.map((guessWord, index) => {
          return <WordleGridRow key={index} guessWord={guessWord} />;
        })}
      </div>
    );
  }
}

class WordleGridRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="wordle-grid-row">
        {this.props.guessWord.map((guessLetter, index) => {
          return <WordleGridSquare guessLetter={guessLetter} key={index} />;
        })}
      </div>
    );
  }
}

class WordleGridSquare extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="wordle-grid-square">{this.props.guessLetter}</div>;
  }
}

class Keyboard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="keyboard">
        {this.props.keyBoardArr.map((keyRow, index) => {
          return (
            <KeyboardRow
              keyRow={keyRow}
              handleKeyPress={this.props.handleKeyPress}
              key={index}
            />
          );
        })}
      </div>
    );
  }
}

class KeyboardRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="keyboard-row">
        {this.props.keyRow.map((keyboardKey, index) => {
          return (
            <KeyboardButton
              keyboardKey={keyboardKey}
              handleKeyPress={this.props.handleKeyPress}
              key={index}
            />
          );
        })}
      </div>
    );
  }
}

class KeyboardButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className="keyboard-button"
        onClick={(e) => {
          const pressedKey = this.props.keyboardKey;
          this.props.handleKeyPress(pressedKey);
        }}
      >
        {this.props.keyboardKey}
      </div>
    );
  }
}

export default App;
