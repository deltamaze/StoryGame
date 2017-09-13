var app = require('express')();
var http = require('http').Server(app);
var firebase = require('firebase-admin');
var serviceAccount = require("./storygame-40e42-firebase-adminsdk-xgxyg-8d0fe422e4.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://snakearcade-45688.firebaseio.com"
});


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/startgame/:roomName', function (req, res) {

    gameService = new GameService();
    gameService.startGame(req.params.roomName);
    res.send('<h1>' + req.params.roomName + '</h1>');
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, function () {
});



function GameService() {
    this.startGame = function (roomName) {
    }
   
}