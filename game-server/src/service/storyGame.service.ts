import * as firebase from 'firebase-admin';
var serviceAccount = require("../../storygame-40e42-firebase-adminsdk-xgxyg-8d0fe422e4.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://storygame-40e42.firebaseio.com"
});

export class StoryGameService {
  gameId :string;
  gameRef : any;
  gameObj: any;
  timer: any;
  roundTime: number = 0;//move to game object
  gameTime: number = 0;//move to game object
  gameEngineInterval: number = 2000; //2 seconds
  maxGameLength: number = 10;//max possible 2 second iterations. 

    constructor(id:string) {
        this.gameId = id
  }

    public startGame() {
    //set custom title

    //Start Game
    this.gameRef = firebase.database().ref('storyGames/'+this.gameId );

    //determine if game has been created, and if round is still zero
    //possible that the client has some slowdown pushing to firebase, lets wait 3 second and check 
      setTimeout(() => 
      {
          
            this.gameRef.once('value').then(function (snapshot) {
            if (!snapshot.val()) {
                console.log("Game Doesn't Exist");
                return; //game doesn't exist, lets get outa here!
            }
            //grab game info, created by user in client side Create Game Page
            this.gameObj = snapshot.val()
            console.log("Starting Game for id:"+this.gameId);
            this.timer = setInterval(this.gameEngine.bind(this), this.gameUpdateTime);

            
            //also, every other second we'll perform maintenance functions to clean up inactive players
            
            //test output
            
            //gameRef.sdfsg

            
            
        }.bind(this));
      },
      3000);
  }

  private checkForInActivePlayers():void
  {
    //if player last activity is more than 30 seconds, set them to inactive/join date to current time
    //set (max players:number) to active sort by create date to determine the rounds active players 
    //if there was not a single player action performed in 30 seconds, end game.

        //in future implement a role column , where joining a game sets player as spectator, then they can sit down into game,
    //   and going inactive m akes them a spectator again
    
    
  }
  private determineRoundWinner():void
  {

  }
  private gameEngine():void
  {
        this.roundTime ++;
        this.gameTime ++;
        //if this is the start of the game , lets change round zero, to round 1
        if(this.gameObj.currentRound == 0)
        {
          this.gameObj.currentRound = 1;
          
        }
        //perform maintenance for inactive players

        //check to see if all player actions are over, if so, determine winner and progress round
        //check to see if round time is up, if so, determine winner and progress round
        
        
        //check to see if game over
         if (this.gameTime > this.maxGameLength || this.gameObj.currentRound > this.gameObj.totalRounds)//game is over, or has gone past max length possible
        {
          clearInterval(this.timer); //game over, top timer
          this.gameObj.isGameOver = true;
        }
        this.gameRef.set(this.gameObj); //post all changes to players can see

  }//end iteration


}