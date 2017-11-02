import * as firebase from 'firebase-admin';

const serviceAccount = require("../../storygame-40e42-firebase-adminsdk-xgxyg-8d0fe422e4.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://storygame-40e42.firebaseio.com"
});

export class StoryGameService {
  gameId: string;
  gameRef: any;
  playersRef: any;
  playerInputsRef: any;
  gameObj: any;
  allPlayersObj: any;
  currentPlayersObj: any;
  playerInputsObj: any;

  timer: any;
  oneSecond = 1000;
  gameEngineInterval: number = this.oneSecond; // how many seconds per interval
  maxGameLength: number = (this.oneSecond * 1200); // max possible game time is 20 minutes
  timesUpPeriodActive = false;
  timesUpDisplayTimerResetValue = 6;
  timesUpDisplayTimer: number = this.timesUpDisplayTimerResetValue;

  // inactivityThreshold: number = Date.now()-( this.oneSecond * 10);
  // if no ping for 10 sec, set them to inactive

  constructor(id: string) {
    this.gameId = id;
  }

  public startGame() {

    // Start Game
    this.gameRef = firebase.database().ref('storyGames/' + this.gameId);
    this.playersRef = firebase.database().ref('gamePlayers/' + this.gameId);
    this.playerInputsRef = firebase.database().ref('gamePlayerInput/' + this.gameId);
    // Determine if game has been created, and if round is still zero
    this.gameRef.once('value').then(function (snapshot) {
      if (!snapshot.val()) {
        console.log("Game Doesn't Exist");
        return; // game doesn't exist, lets get outa here!
      }
      // grab game info, created by user in client side Create Game Page
      this.gameObj = snapshot.val();
    }.bind(this)).then(() => {
      if (this.gameObj.currentTurn !== 0) {
        console.log("Game Round isn't zero");
        return;
      }
      console.log("Valid game, going to set up more ref's");
      // If we are here, then we have a valid game, lets grab player info into observables
      this.playersRef.on("value", function (snapshot) {
        this.allPlayersObj = snapshot.val();
      }.bind(this));
      this.playersRef.orderByChild("joinTime")
        .limitToLast(this.gameObj.maxPlayers)
        .on("value", function (snapshot) {
          this.currentPlayersObj = snapshot.val();
        }.bind(this));
      this.playerInputsRef.on("value", function (snapshot) {
        this.playerInputsObj = snapshot.val();
      }.bind(this));
      console.log("Set Game Round to 1, to start up game");
      this.incrementTurn();
      this.gameRef.set(this.gameObj); // post updated info, so player can see


      console.log("Starting GameEngine for id:" + this.gameId);
      this.timer = setInterval(this.gameEngine.bind(this), this.gameEngineInterval);


    });

  }

  private gameEngine(): void {

    // add second to game
    this.gameObj.gameTimeElapsed =
      this.gameObj.gameTimeElapsed + (this.gameEngineInterval / this.oneSecond);
    console.log(this.gameObj.gameTimeElapsed);
    this.establishActivePlayers(); // players join as inactive, so activate them as they come in
    this.checkForDisconnectedPlayers();


    if (this.timesUpPeriodActive === false)// Turn still going
    {
      let didTurnEnd = false;
      if (this.allPlayerActionSubmitted(this.gameObj.currentTurn) ||
        this.gameObj.timeLeftInTurn <= 0) {
        didTurnEnd = true;
      }
      if (this.gameObj.currentTurn === 0) {
        // if this is the start of the game , lets change round zero, to round 1
        didTurnEnd = true;
      }
      if (didTurnEnd)// round changes, reset round time left
      {
        if (this.gameObj.currentTurn % 2 === 0 && this.gameObj.currentTurn > 0) {
          this.determineRoundWinner(this.gameObj.currentTurn);
        }
        if (!this.wasThereInputThisRound(this.gameObj.currentTurn)) {
          this.gameObj.isGameOver = true;
          this.gameObj.gameOverReason =
            "Game Ended, due to no player activity in the previous round.";
        }
        this.checkForInActivePlayers(this.gameObj.currentTurn);
        this.timesUpDisplayTimer = this.timesUpDisplayTimerResetValue;
        this.timesUpPeriodActive = true;
        this.gameObj.timeLeftInTurn = 0;
      }
      else// round did not change, decrease time
      {
        this.gameObj.timeLeftInTurn =
          this.gameObj.timeLeftInTurn - (this.gameEngineInterval / this.oneSecond);
      }

    }
    // Times Up - Period
    if (this.timesUpPeriodActive === true) {
      if (this.timesUpDisplayTimer === 0 || this.gameObj.currentTurn % 2 === 1) {

        this.incrementTurn();
      }
      else {
        this.timesUpDisplayTimer--;
      }
    }

    // check to see if game over
    if (this.gameObj.gameTimeElapsed >
      this.maxGameLength || this.gameObj.currentRound > this.gameObj.totalRounds ||
      this.gameObj.isGameOver === true) {
      // game is over, or has gone past max length possible
      if (this.gameObj.gameTimeElapsed > this.maxGameLength) {
        this.gameObj.gameOverReason = "GameTime passed max game time possible.";
      }
      if (this.gameObj.currentTurn > this.gameObj.totalRounds) {
        this.gameObj.gameOverReason = this.determineGameWinner() + " - Won!";
      }
      clearInterval(this.timer); // game over, stop timer
      this.gameObj.isGameOver = true;
    }
    this.gameRef.set(this.gameObj); // post all changes to players can see

    console.log("Tick done");
  }// end iteration


  private inactivityThreshold(): number {
    return Date.now() - (this.oneSecond * this.gameObj.timeBetweenTurns * 2);
  }

  private disconnectThreshold(): number {
    return Date.now() - (this.oneSecond * this.gameObj.timeBetweenTurns);
  }

  private checkForDisconnectedPlayers(): void {
    // if player last activity is more than 30 seconds
    // set them to inactive/join date to current time
    let activePlayerTally = 0;
    for (const player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        if (this.allPlayersObj[player].pingTime < this.disconnectThreshold()) {
          // if no ping for 10 sec, kick them
          console.log("Detected Disconnected Player: " + this.allPlayersObj[player].username);
          console.log("Last Action Time: " + this.allPlayersObj[player].pingTime.toString());
          console.log("Threshold: " + this.disconnectThreshold().toString());

          firebase.database().ref('gamePlayers/' + this.gameId + '/' + player).remove();
        }
        else if (this.allPlayersObj[player].isActive) {
          activePlayerTally++;
        }
      }
    }

    if (activePlayerTally === 0 && this.gameObj.gameTimeElapsed > 10) {
      console.log("No Active Players Detected");
      // if after 10 seconds of gam creation, there are no active players, then end game
      this.gameObj.isGameOver = true;
    }

  }

  private checkForInActivePlayers(roundNum: number): void {
    for (const player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        if (this.allPlayersObj[player].isActive === true &&
          this.allPlayersObj[player].isActiveStartTime < this.inactivityThreshold() &&
          this.allPlayersObj[player].lastActionTime < this.inactivityThreshold())
          {
          // only check for active players, that didn't just join the game, and last action
          // was more than the inactivity threshold
          console.log("Detected Inactive Player: " + this.allPlayersObj[player].username);
          console.log("Last Action Time: " + this.allPlayersObj[player].lastActionTime.toString());
          console.log("Threshold: " + this.inactivityThreshold().toString());

          // look for in playerInputsObj
          // if player has been in game for 30 seconds,
          // but didn't have any input in the previous round,then kick
          const prevRound = (roundNum - 1);
          if (this.playerInputsObj != null && this.playerInputsObj[prevRound] != null &&
             this.playerInputsObj[prevRound][player] == null) {
            console.log("No Prev Round activity detected for round:" + prevRound);
            firebase.database().ref('gamePlayers/' + this.gameId + '/' + player).remove();
          }
        }
      }
    }
  }

  private establishActivePlayers(): void {
    for (const player in this.currentPlayersObj) {
      if (this.currentPlayersObj.hasOwnProperty(player)) {
        if (this.currentPlayersObj[player].isActive !== true &&
          this.currentPlayersObj[player].pingTime >= this.inactivityThreshold())
        {
          // if within threshold, and they are currently inactive, convert to active
          this.currentPlayersObj[player].isActive = true;
          this.currentPlayersObj[player].isActiveStartTime = Date.now();
          firebase.database().ref('gamePlayers/' + this.gameId + '/' + player).set(this.currentPlayersObj[player]);
        }
      }
    }
  }

  private allPlayerActionSubmitted(roundNum: number): boolean {
    let allPlayersReady: boolean = false; //if someone isn't ready, set this to false
    let countDone: number = 0;
    let countNotDone: number = 0;

    for (let player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        if (this.allPlayersObj[player].isActive == true)
        {
          // only check for active players, that didn't just join the game
          //look for in playerInputsObj
          if (this.playerInputsObj != null && this.playerInputsObj[roundNum] != null && this.playerInputsObj[roundNum][player] != null) {
            countDone++;
            //also, lets make sure to let other players know, that this guy has completed his action
            if (this.allPlayersObj[player].isActionFinished == false) {
              this.allPlayersObj[player].isActionFinished = true;
              firebase.database().ref('gamePlayers/' + this.gameId + '/' + player).set(this.allPlayersObj[player]);
            }
          }
          else {
            countNotDone++;
          }
        }
      }
    }
    console.log("Players who are ready: " + countDone);
    console.log("Players who are not ready" + countNotDone);
    if (countDone > 0 && countNotDone == 0) {
      allPlayersReady = true;
    }

    return allPlayersReady;
  }

  private incrementTurn(): void {
    this.resetIsActionFinished();//set everyone isActionFinished back to false
    this.gameObj.currentTurn = this.gameObj.currentTurn + 1;
    this.gameObj.currentRound = Math.ceil(this.gameObj.currentTurn / 2); //round = turn / 2, round up
    this.gameObj.timeLeftInTurn = this.gameObj.timeBetweenTurns;//reset timer back to full
    this.timesUpPeriodActive = false;

  }

  private resetIsActionFinished(): void {
    for (let player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        if (this.allPlayersObj[player].isActionFinished == true) //only check for active players, that didn't just join the game
        {
          this.allPlayersObj[player].isActionFinished = false;
          firebase.database().ref('gamePlayers/' + this.gameId + '/' + player).set(this.allPlayersObj[player]);
        }
      }
    }
  }

  private determineGameWinner(): string {
    let returnString: string = "";
    let maxScore: number = 0;
    for (let player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        //cycle through each active player and see if they have the most points

        if (this.allPlayersObj[player].isActive == true && this.allPlayersObj[player].score >= maxScore) //only check for active players
        {
          maxScore = this.allPlayersObj[player].points; //update maxPoints
          returnString = this.allPlayersObj[player].username + " ";//replace string with just this player
        }
        else if (this.allPlayersObj[player].isActive == true && this.allPlayersObj[player].score == maxScore) {
          returnString += "& " + this.allPlayersObj[player].username;//Append
        }
      }
    }
    //find out max points any single player has.
    // list all players
    return returnString;
  }

  private determineRoundWinner(roundNum: number): void {
    let votes = [];
    let noVotes = true;
    console.log("Determine Round Winner");


    for (let player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        //cycle through each active player and see who they voted for

        if (this.allPlayersObj[player].isActive == true) //only check for active players
        {
          //look for in playerInputsObj
          if (this.playerInputsObj != null && this.playerInputsObj[roundNum] != null && this.playerInputsObj[roundNum][player] != null) {
            //parse vote
            if (votes.hasOwnProperty(this.playerInputsObj[roundNum][player].input)) {
              votes[this.playerInputsObj[roundNum][player].input]++
            }
            else//if no current votes for this person, then push new entry into votes
            {
              votes[this.playerInputsObj[roundNum][player].input] = 1;
            }
            noVotes = false;

          }
        }
      }
    }
    if (noVotes)//no votes detected
    {
      return;
    }
    //okay so now we have a dictionary with uid's and their vote tally
    //Add a random Decimal Value to tally, to generate a random winner if tie
    let winningKey = Object.keys(votes).reduce(function (a, b) {
      return (votes[a] + Math.random()) > (votes[b] + Math.random()) ? a : b
    });
    //console.log(winningKey);
    //okay we got the winning key/uid of the winner
    //Lets look into the previous round and pull his sentence
    let prevRound = roundNum - 1;

    //update story
    if (this.playerInputsObj != null && this.playerInputsObj[prevRound] != null && this.playerInputsObj[prevRound][winningKey] != null) {
      this.playerInputsObj[prevRound][winningKey].isWinner = true;
      //this.gameObj.storyThusFar = this.gameObj.storyThusFar + "..." + this.playerInputsObj[prevRound][winningKey].input
      let winningIdea = {
        username: this.playerInputsObj[prevRound][winningKey].username,
        message: this.playerInputsObj[prevRound][winningKey].input,
        timestamp: firebase.database.ServerValue.TIMESTAMP

      };
      firebase.database().ref('gameRoundWinners/' + this.gameId + '/' + prevRound).set(winningIdea);
    }
    //update player score
    if (this.allPlayersObj[winningKey] != null) {
      this.allPlayersObj[winningKey].score = this.allPlayersObj[winningKey].score + 1;
      firebase.database().ref('gamePlayers/' + this.gameId + '/' + winningKey).set(this.allPlayersObj[winningKey]);
    }
    //let players know how much vote each input got
    for (let key in votes) {
      let voteCount = votes[key];
      if (this.playerInputsObj != null && this.playerInputsObj[prevRound] != null && this.playerInputsObj[prevRound][key] != null) {
        this.playerInputsObj[prevRound][key].votes = voteCount;
      }
    }
    firebase.database().ref('gamePlayerInput/' + this.gameId + '/' + prevRound).set(this.playerInputsObj[prevRound]);


  }

  private wasThereInputThisRound(roundNum: number): boolean {
    if (roundNum == 0) {
      return true; // don't run method if game hasn't started yet.
    }
    let inputCount: number = 0;

    for (let player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        if (this.allPlayersObj[player].isActive == true) //only check for active players, that didn't just join the game
        {
          //look for in playerInputsObj
          if (this.playerInputsObj != null && this.playerInputsObj[roundNum] != null && this.playerInputsObj[roundNum][player] != null) {
            inputCount++;
          }
        }
      }
    }
    if (inputCount > 0) {
      return true;
    }
    else {
      console.log("No Input Detected, ending game Input Count: " + inputCount.toString() + " Current Round: " + roundNum.toString());
      return false;
    }
  }
}