# StoryGame
Live app - <a href='storygame.kilomaze.com'>storygame.kilomaze.com</a>


A game that is intended  for 3 or more player. One player creates the game as the host, and other players can join the game.
There will be default of 7 Rounds in a game, with 2 turns per round. In the first turn, players will suggest a sentence  to an ongoing story. 
In the second turn, players will vote on someone else’s idea. The idea with the most votes gets added to the story, and the player who
proposed the idea is awarded a point. When a tie occurs, the winner is selected randomly. 
This will continue until all rounds are complete, and the player with the most votes will be deemed the winner. 
In addition, all players will be able to enjoy a collaboratively built story!

Specs: Front end is hosted by Firebase, and was built  using Angular, Firebase, Bootstrap + other technologies.
The backend was built with nodejs, and is used to run a game engine. The engine determines round winners, removed inactive players, and progresses the round when all active players, finish inputting their ideas.

This is a work in progress, and additional features are still being worked on (social media integration, one click quickplay button, availability on app store, account page, etc...)
