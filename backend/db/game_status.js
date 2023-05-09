const db = require('./connection')

const getStatus = (id) =>
    db.any(`SELECT round, pot, community, player_cards, player_chips, players_alive, player_ranks FROM game_status WHERE id = $1;`, id)

const updateStatus = (id, round, pot, community, player_cards, player_chips, players_alive, player_ranks) =>
    db.none(`UPDATE game_status SET round = $1, pot = $2, community = $3, player_cards = $4, player_chips = $5, players_alive = $6, player_ranks = #8 WHERE id = $7;`,[round, pot, community, player_cards, player_chips, players_alive, id, player_ranks])

const createStatus = (id, round, pot, community, player_cards, player_chips, players_alive, player_ranks) =>
    db.any(`INSERT INTO game_status (id, round, pot, community, player_cards, player_chips, players_alive, player_ranks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`, [id, round, pot, community, player_cards, player_chips, players_alive, player_ranks])

const deleteStatus = (id) =>
    db.none(`DELETE FROM game_status WHERE id = $1;`, id)

const playerFolds = (id, players_alive, player_ranks, player_chips) =>
    db.none(`UPDATE game_status SET players_alive = $1, player_ranks = $2, player_chips = $4 WHERE id = $3;`,[players_alive,player_ranks,id,player_chips])

const playerBets = (id, player_chips, pot) =>
    db.none(`UPDATE game_status SET player_chips = $1, pot = $2 WHERE id = $3;`,[player_chips,pot,id])

const updateRound = (id, round) =>
    db.none(`UPDATE game_status SET round = $1 WHERE id = $2;`,[round, id])

module.exports = {
    getStatus,
    updateStatus,
    updateRound,
    createStatus,
    deleteStatus,
    playerFolds,
    playerBets,
}