import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { StoryGameService } from "../service/storyGame.service";


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

    //start game service
    new StoryGameService(req.params.roomName).startGame();
  }



}