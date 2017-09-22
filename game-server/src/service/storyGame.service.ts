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

            //okay, lets start by looping through each round
            for(let x: number=1;x<=this.gameObj.totalRounds;x++)
            {
              this.gameObj.currentRound = x;//update current round
              console.log(this.gameObj.totalRounds)
              console.log("Set Game Round:"+this.gameObj.currentRound);
              this.gameRef.set(this.gameObj); //let players know current round

              //So, we are going to start a timer for each round
              //when timer reaches zero we will go to next round
              //also, every second, we'll check to see if all players
              //are done performing their action, if so, end round and proceed to next
              //when round count is = to max rounds, end game.
              if(x >30)
              {
                  break; //just incase we get stuck in an infinit loop
              }



            }
            //also, every other second we'll perform maintenance functions to clean up inactive players
            
            //test output
            this.gameObj.isGameOver = true;
            this.gameRef.set(this.gameObj);
            //gameRef.sdfsg

            
            
        }.bind(this));
      },
      3000);
  }

  private checkForInActivePlayers():void
  {
    //if all players are inactive, end game
  }
  private determineRoundWinner():void
  {

  }
}