| Action | Inputs/Data | Pre Condition(s) | Post Condition(s) | API Endpoint |
| ------ | ----------- | ---------------- | ----------------- | ------------ |
| User creates a game | <ol><li>user_id</li><li>game_title</li><li>player_count</li></ol> | <ol><li>user_id exists in the user table</li></ol> | <ol><li>New game is created along with its entry in the database</li><li>Game list in lobby is updated to show new game with game_title</li><li>Player table is created for user and linked to the newly created game</li><li>User is redirected to the game's waiting room</li></ol> | POST /games/create <br/><br/> {game_title, player_count} <br/><br/> (user_id is available in session)|
| User joins a game | <ol><li>user_id</li><li>game_id</li></ol> | <ol><li>user_id exists in the user table</li><li>game_id exists in the game table</li><li>Number of players in waiting room is less than player_count of the game</li></ol> | <ol><li>User is added to players in the waiting room</li><li>Game starts if number of players is equal to player_count of the game</li><li>Users not in the game can no longer join the game in the lobby</li></ol> | POST /games/:id/join <br/><br/> (game_id is available in url, user_id is available in session) |
| User folds | <ol><li>user_id</li><li>game_id</li></ol> | <ol><li>user_id is a player in the game</li><li>It is user_id's turn</li></ol> | <ol><li>If one player left has not folded, that player automatically wins the current hand, otherwise next player becomes the current player or if player is last player, next stage of game starts</li><li>Player is removed from getting turns for the rest of the current hand</li><li>Player is not eligible to win the current hand</li></ol> | POST /games/:id/fold <br/><br/> (game_id is available in url, user_id is available in session) |
| User checks | <ol><li>user_id</li><li>game_id</li></ol> | <ol><li>user_id is a player in the game</li><li>It is user_id's turn</li><li>A raise has not occurred in the current hand</li></ol> | <ol><li>Next player becomes the current player or if player is last player, next stage of game starts</li></ol> | POST /games/:id/check <br/><br/> (game_id is available in url, user_id is available in session) |
| User calls | <ol><li>user_id</li><li>game_id</li><li>player_money</li><li>pot_amount</li><li>min_bet</li></ol> | <ol><li>user_id is a player in the game</li><li>It is user_id's turn</li><li>A raise has occurred in the current hand</li><li>player_money is greater than or equal to min_bet</li></ol> | <ol><li>Next player becomes the current player or if player is last player, next stage of game starts</li><li>player_money decreases by min_bet</li><li>pot_amount increases by min_bet</li><li>All players receive the updated money changes</li></ol> | POST /games/:id/call <br/><br/> (game_id is available in url, user_id is available in session, player_money, min_bet and pot_amount is available in current game session) |
| User raises | <ol><li>user_id</li><li>game_id</li><li>player_money</li><li>pot_amount</li><li>bet_amount</li><li>min_bet</li></ol> | <ol><li>user_id is a player in the game</li><li>It is user_id's turn</li><li>bet_amount is greater than or equal to min_bet</li><li>player_money is greater than or equal to bet_amount</li></ol> | <ol><li>Reset turns for players who have not folded and next player becomes current player</li><li>min_bet becomes equal to bet_amount</li><li>player_money decreases by bet_amount</li><li>pot_amount increases by the bet_amount</li><li>All players receive the updated money changes</li></ol> | POST /games/:id/raise <br/><br/> {bet_amount} <br/><br/> (game_id is available in url, user_id is available in session, player_money, min_bet, and pot_amount is available in current game session) |