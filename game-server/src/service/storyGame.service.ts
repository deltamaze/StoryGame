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
      if (!snapshot.val() || snapshot.val().currentRound != 0) {
        console.log("Game Doesn't Exist, or round isn't zero");
        return; //game doesn't exist, lets get outa here!
      }
      //grab game info, created by user in client side Create Game Page
      this.gameObj = snapshot.val()
    }.bind(this));
    //If we are here, then we have a valid game, lets grab player info into observables
    this.playersRef.on("value", function (snapshot) {
      this.allPlayersObj = snapshot.val();
    }.bind(this));
    this.playersRef.orderByChild("joinTime").limitToLast(this.gameObj.maxPlayers).on("child_added", function (snapshot) {
      this.currentPlayersObj = snapshot.val();
    }.bind(this));;
    this.playerInputsRef.on("value", function (snapshot) {
      this.playerInputsObj = snapshot.val();
    }.bind(this));



    console.log("Starting GameEngine for id:" + this.gameId);
    this.timer = setInterval(this.gameEngine.bind(this), this.gameEngineInterval);

  }
  private inactivityTreshold(): number {
    return Date.now() - (this.oneSecond * 10);
  }
  private checkForDisconnectedPlayers(): void {
    //startAt:{ value: Math.floor(Date.now()) - 900000 , key: 'timestamp' }//use as threshold to only pull players who have pinged in the past 15 minutes
    //if player last activity is more than 30 seconds, set them to inactive/join date to current time
    let activePlayerTally: number = 0;
    this.allPlayersObj.forEach(player => {
      if (player.isActive == true && player.pingTime < this.inactivityTreshold()) //if no ping for 10 sec, set them to inactive
      {
        player.isActive = false;
        player.joinTime = Date.now();
        firebase.database().ref('gamePlayers/' + this.gameId + '/' + player.uid).set(player);
      }
      else if (player.isActive) {
        activePlayerTally++;
      }
    });
    if (activePlayerTally == 0 && this.gameTime > 10) {
      this.gameObj.isGameOver = true;//if after 10 seconds of gam creation, there are no active players, then end game
    }

  }
  private checkForInActivePlayers(roundNum: number): void {
    this.allPlayersObj.forEach(player => {
      if (player.isActive == true && player.isActiveStartTime < this.inactivityTreshold()) //only check for active players, that didn't just join the game 
      {
        //look for in playerInputsObj
        if (this.playerInputsObj != null && this.playerInputsObj[roundNum] != null && this.playerInputsObj[roundNum][player.uid] == null) {
          player.isActive = false;
          player.joinTime = Date.now();
          firebase.database().ref('gamePlayers/' + this.gameId + '/' + player.uid).set(player);
        }

      }
    });
  }
  private establishActivePlayers(): void {
    this.currentPlayersObj.forEach(player => {
      if (player.isActive != true && player.pingTime >= this.inactivityTreshold()) //if within threshold, and they are currently inactive, convert to active
      {
        player.isActive = true;
        player.isActiveStartTime = Date.now();
        firebase.database().ref('gamePlayers/' + this.gameId + '/' + player.uid).set(player);
      }
    });

  }
  private allPlayerActionSubmitted(roundNum: number):boolean{
    let allPlayersReady: boolean = true; //if someone isn't ready, set this to false
    this.allPlayersObj.forEach(player => {
      if (player.isActive == true ) //only check for active players, that didn't just join the game 
      {
        //look for in playerInputsObj
        if (this.playerInputsObj != null && this.playerInputsObj[roundNum] != null && this.playerInputsObj[roundNum][player.uid] == null) {
          allPlayersReady = false;
        }

      }
    });
    return allPlayersReady;
  }
  private determineRoundWinner(): void {
  }
  private gameEngine(): void {

    let didRoundChange: boolean = false;
    this.gameObj.gameTimeElapsed = this.gameObj.gameTimeElapsed + (this.gameEngineInterval / this.oneSecond);//add second to game
    
    

    //perform maintenance for inactive players
    this.establishActivePlayers();//players join as inactive, so activate them as they come in
    this.checkForDisconnectedPlayers();

    //check to see if all player actions are over, if so, determine winner and progress round
    //check to see if round time is up, if so, tally votes determine winner and progress round

    if (this.gameObj.currentRound == 0) {//if this is the start of the game , lets change round zero, to round 1
      this.gameObj.currentRound = 1;
      didRoundChange = true;
    }

    //progress round, or decrease time
    if (didRoundChange)//round changes, reset round time left
    {
      this.checkForInActivePlayers(this.gameObj.currentRound);
      this.gameObj.currentRound = this.gameObj.currentRound + 1;
      this.gameObj.timeLeftInRound = this.gameObj.timeBetweenTurns;
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
    }
    this.gameRef.set(this.gameObj); //post all changes to players can see

  }//end iteration


}