var inquirer = require("inquirer");
var chalk = require("chalk");
var Word = require("./Word");
var words = require("./words");

function Game() {

  var self = this;

  this.play = function() {
    this.guessesLeft = 10;
    this.nextWord();
  };

  this.nextWord = function() {
        var randWord = words[Math.floor(Math.random() * words.length)];
        this.currentWord = new Word(randWord);
            console.log("\n" + this.currentWord + "\n");
        this.makeGuess();
  };

  this.makeGuess = function() {
    this.askForLetter().then(function() {

      if (self.guessesLeft < 1) {
           console.log(
          "You lose! The word was: \"" + self.currentWord.getSolution() + "\"\n"
        );
        self.askToPlayAgain();

      }
      else if (self.currentWord.guessedCorrectly()) {
           console.log("Correct! Next word!");
        self.guessesLeft = 10;
        self.nextWord();

      }
      else {
        self.makeGuess();
      }
    });
  };

  this.askToPlayAgain = function() {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "choice",
          message: "Play Again?"
        }
      ])
      .then(function(val) {
        if (val.choice) {
          self.play();
        }
        else {
          self.quit();
        }
      });
  };

  this.askForLetter = function() {
    return inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: "Guess a letter!",
          validate: function(val) {
            return /[a-z1-9]/gi.test(val);
          }
        }
      ])
      .then(function(val) {

        var didGuessCorrectly = self.currentWord.guessLetter(val.choice);
        if (didGuessCorrectly) {
          console.log(chalk.green("\nCorrect\n"));

        }
        else {
          self.guessesLeft--;
          console.log(chalk.red("\nWrong\n"));
          console.log(self.guessesLeft + " guesses remaining!!!\n");
        }
      });
  };

  this.quit = function() {
    console.log("\nSee Ya!");
    process.exit(0);
  };
}

module.exports = Game;
