import * as firebase from 'firebase-admin';
var serviceAccount = require("../../storygame-40e42-firebase-adminsdk-xgxyg-8d0fe422e4.json");

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
  roundTime: number = 0;//move to game object
  gameTime: number = 0;//move to game object
  oneSecond: number = 1000;
  gameEngineInterval: number = 1 * this.oneSecond; //how many seconds per interval
  maxGameLength: number = (this.oneSecond * 1200);//max possible game time is 20 minutes
  //inactivityTreshold: number = Date.now()-( this.oneSecond * 10); // if no ping for 10 sec, set them to inactive

  constructor(id: string) {
    this.gameId = id
  }

  public startGame() {
    //set custom title

    //Start Game
    this.gameRef = firebase.database().ref('storyGames/' + this.gameId);
    this.playersRef = firebase.database().ref('gamePlayers/' + this.gameId);
    this.playerInputsRef = firebase.database().ref('gamePlayerInput/' + this.gameId);
    //determine if game has been created, and if round is still zero
    this.gameRef.once('value').then(function (snapshot) {
      if (!snapshot.val() ) {
        console.log("Game Doesn't Exist");
        return; //game doesn't exist, lets get outa here!
      }
      //grab game info, created by user in client side Create Game Page
      this.gameObj = snapshot.val()
    }.bind(this)).then(() => {
      if(this.gameObj.currentRound != 0)
      {
        console.log("Game Round isn't zero");
        return;
      }
      //If we are here, then we have a valid game, lets grab player info into observables
      this.playersRef.on("value", function (snapshot) {
        this.allPlayersObj = snapshot.val();
      }.bind(this));
      this.playersRef.orderByChild("joinTime").limitToLast(this.gameObj.maxPlayers).on("value", function (snapshot) {
        this.currentPlayersObj = snapshot.val();
      }.bind(this));;
      this.playerInputsRef.on("value", function (snapshot) {
        this.playerInputsObj = snapshot.val();
      }.bind(this));

      console.log("Starting GameEngine for id:" + this.gameId);
      this.timer = setInterval(this.gameEngine.bind(this), this.gameEngineInterval);


    });

  }
  private gameEngine(): void {

    let didRoundChange: boolean = false;
    this.gameObj.gameTimeElapsed = this.gameObj.gameTimeElapsed + (this.gameEngineInterval / this.oneSecond);//add second to game
    console.log(this.gameObj.gameTimeElapsed );
    console.log(this.gameEngineInterval);



    //perform maintenance for inactive players
    this.establishActivePlayers();//players join as inactive, so activate them as they come in
    this.checkForDisconnectedPlayers();

    if (this.allPlayerActionSubmitted(this.gameObj.currentRound) || this.gameObj.timeLeftInRound <= 0) {
      didRoundChange = true;
    }



    if (this.gameObj.currentRound % 2 == 0 && didRoundChange)//if this is a vote round, and we are ready to find the winner
    {

    }

    //check to see if round time is up, if so, tally votes determine winner and progress round

    if (this.gameObj.currentRound == 0) {//if this is the start of the game , lets change round zero, to round 1
      didRoundChange = true;
    }

    

    //progress round, or decrease time
    if (didRoundChange)//round changes, reset round time left
    {
      this.checkForInActivePlayers(this.gameObj.currentRound);
      this.gameObj.currentRound = this.gameObj.currentRound + 1;
      this.gameObj.timeLeftInRound = this.gameObj.timeBetweenTurns;//reset timer back to full
      this.resetIsActionFinished();//
    }
    else//round did not change, decrease time
    {
      this.gameObj.timeLeftInRound = this.gameObj.timeLeftInRound - (this.gameEngineInterval / this.oneSecond);
    }

    //check to see if game over
    if (this.gameTime > this.maxGameLength || this.gameObj.currentRound > this.gameObj.totalRounds || this.gameObj.isGameOver == true)//game is over, or has gone past max length possible
    {
      clearInterval(this.timer); //game over, top timer
      this.gameObj.isGameOver = true;
      console.log("Game Over");
    }
    this.gameRef.set(this.gameObj); //post all changes to players can see
    console.log("Tick done");
  }//end iteration


  private inactivityTreshold(): number {
    return Date.now() - (this.oneSecond * 10);
  }
  private checkForDisconnectedPlayers(): void {
    //startAt:{ value: Math.floor(Date.now()) - 900000 , key: 'timestamp' }//use as threshold to only pull players who have pinged in the past 15 minutes
    //if player last activity is more than 30 seconds, set them to inactive/join date to current time
    let activePlayerTally: number = 0;
    for (var player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        if (this.allPlayersObj[player].isActive == true && this.allPlayersObj[player].pingTime < this.inactivityTreshold()) //if no ping for 10 sec, set them to inactive
        {
          this.allPlayersObj[player].isActive = false;
          this.allPlayersObj[player].joinTime = Date.now();
          firebase.database().ref('gamePlayers/' + this.gameId + '/' + player).set(this.allPlayersObj[player]);
        }
        else if (this.allPlayersObj[player].isActive) {
          activePlayerTally++;
        }
      }
    }

    if (activePlayerTally == 0 && this.gameTime > 10) {
      this.gameObj.isGameOver = true;//if after 10 seconds of gam creation, there are no active players, then end game
    }

  }
  private checkForInActivePlayers(roundNum: number): void {
    for (var player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        if (this.allPlayersObj[player].isActive == true && this.allPlayersObj[player].isActiveStartTime < this.inactivityTreshold()) //only check for active players, that didn't just join the game 
        {
          //look for in playerInputsObj
          if (this.playerInputsObj != null && this.playerInputsObj[roundNum] != null && this.playerInputsObj[roundNum][player] == null) {
            this.allPlayersObj[player].isActive = false;
            this.allPlayersObj[player].joinTime = Date.now();
            firebase.database().ref('gamePlayers/' + this.gameId + '/' + player).set(this.allPlayersObj[player]);
          }

        }
      }
    }
  }
  private establishActivePlayers(): void {
    for (var player in this.currentPlayersObj) {
      if (this.currentPlayersObj.hasOwnProperty(player)) {
        if (this.currentPlayersObj[player].isActive != true && this.currentPlayersObj[player].pingTime >= this.inactivityTreshold()) //if within threshold, and they are currently inactive, convert to active
        {
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
    let countNotDone:number = 0;

    for (var player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        if (this.allPlayersObj[player].isActive == true) //only check for active players, that didn't just join the game 
        {
          //look for in playerInputsObj
          if (this.playerInputsObj != null && this.playerInputsObj[roundNum] != null && this.playerInputsObj[roundNum][player] != null) {
            countDone++;
            //also, lets make sure to let other players know, that this guy has completed his action
            if(this.allPlayersObj[player].isActionFinished == false)
            {
              this.allPlayersObj[player].isActionFinished = true;
              firebase.database().ref('gamePlayers/' + this.gameId + '/' + player).set(this.allPlayersObj[player]);
            }
          }
          else
          {
            countNotDone++;
          }
        }
      }
    }
    console.log(countDone);
    console.log(countNotDone);
    if(countDone > 0 && countNotDone ==0 )
    {
      allPlayersReady = true;
    }

    return allPlayersReady;
  }
  private resetIsActionFinished():void{
    for (var player in this.allPlayersObj) {
      if (this.allPlayersObj.hasOwnProperty(player)) {
        if (this.allPlayersObj[player].isActionFinished == true) //only check for active players, that didn't just join the game 
        {
          this.allPlayersObj[player].isActionFinished = false;
          firebase.database().ref('gamePlayers/' + this.gameId + '/' + player).set(this.allPlayersObj[player]);
        }
      }
    }
  }
  private determineRoundWinner(): void {
    //this.playerInputsObj[roundNum]
  }
}