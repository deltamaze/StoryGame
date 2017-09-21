import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import * as firebase from 'firebase-admin';
var serviceAccount = require("../../storygame-40e42-firebase-adminsdk-xgxyg-8d0fe422e4.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://storygame-40e42.firebaseio.com"
});


/**
 * / route
 *
 * @class User
 */
export class StoryGameRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class StoryGameRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[StoryGameRoute::create] Creating storygame route.");

    //add storyGame Route
    router.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });
    router.get("/StartStoryGame/:roomName", (req: Request, res: Response, next: NextFunction) => {
      new StoryGameRoute().startGame(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class StoryGameRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The home page route.
   *
   * @class StoryGameRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public startGame(req: Request, res: Response, next: NextFunction) {
    //set custom title
    this.title = "Home | StoryGameAPI";

    //set message
    let options: Object = {
      "message": 'Parameter:' + req.params.roomName//
    };


    //render template
    this.render(req, res, "index", options);

    //Start Game
    let gameRef = firebase.database().ref('storyGames/'+ req.params.roomName);
    let gameObj

    //determine if game has been created, and if round is still zero
    //possible that the client has some slowdown pushing to firebase, lets wait 3 second and check 
      setTimeout(() => 
      {
          
            gameRef.once('value').then(function (snapshot) {
            if (!snapshot.val()) {
                return; //game doesn't exist, lets get outa here!
            }
            //aight, lets start
            //So, we are going to start a timer for each round
            //when timer reaches zero we will go to next round
            //also, every second, we'll check to see if all players
            //are done performing their action, if so, end round and proceed to next
            //when round count is = to max rounds, end game.
            //also, every other second we'll perform maintenance functions to clean up inactive players
            gameObj = snapshot.val()
            //test output
            gameObj.isGameOver = true;
            gameRef.set(gameObj);
            //gameRef.sdfsg

            
            
        }.bind(this));
      },
      3000);


  }
}