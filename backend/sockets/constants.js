const CHAT_MESSAGE_RECEIVED = "chat-message-received"
const SYSTEM_MESSAGE_RECEIVED = "system-message-received"
const PLAYER_JOINED_RECEIVED = "player-joined-received"
const PLAYER_LEFT_RECEIVED = "player-left-received"
const ACTION_START_GAME = "action-start-game"
const ACTION_PLAYERS_TURN = 'action-players-turn'
const GAME_FLOP = 'game_flop'
const GAME_TURN_RIVER = 'game_turn_river'
const GAME_DEAL_CARDS = 'game_deal_cards'
const UPDATE_POT = 'update_pot'
const UPDATE_CHIPS = 'update_chips'
const REFRESH_GAME = 'refresh_game'
const PLAYER_FOLDS = 'player_folds'
const GAME_ENDS_SHOW_CARDS = 'game_ends_show_cards'
const ACTION_PAY_BIG_BLIND = 'action_pay_big_blind'
const LOAD_PLAYERS = 'load_players'
const TABLE_UPDATE = 'table_update'

module.exports = {
    UPDATE_POT,
    ACTION_PAY_BIG_BLIND,
    LOAD_PLAYERS,
    TABLE_UPDATE,
    GAME_ENDS_SHOW_CARDS,
    REFRESH_GAME,
    PLAYER_FOLDS,
    UPDATE_CHIPS,
    CHAT_MESSAGE_RECEIVED,
    SYSTEM_MESSAGE_RECEIVED,
    GAME_DEAL_CARDS,
    PLAYER_JOINED_RECEIVED,
    PLAYER_LEFT_RECEIVED,
    ACTION_START_GAME,
    ACTION_PLAYERS_TURN,
    GAME_FLOP,
    GAME_TURN_RIVER,
}
