const db = require('./connection')

const getStatus = (id) =>
    db.any(`SELECT round, pot, community, player_cards, player_chips, players_alive FROM game_status WHERE id = $1;`, id)

const updateStatus = (id, round, pot, community, player_cards, player_chips, players_alive) =>
    db.none(`UPDATE game_status SET round = $1, pot = $2, community = $3, player_cards = $4, player_chips = $5, players_alive = $6 WHERE id = $7;`,[round, pot, community, player_cards, player_chips, players_alive, id])

const createStatus = (id, round, pot, community, player_cards, player_chips, players_alive) =>
    db.one(`INSERT INTO game_status (id, round, pot, community, player_cards, player_chips, players_alive) VALUES ($1, $2, $3, $4, $5, $6, $7);`, [id, round, pot, community, player_cards, player_chips, players_alive])

const deleteStatus = (id) =>
    db.none(`DELETE FROM game_status WHERE id = $1;`, id)

module.exports = {
    getStatus,
    updateStatus,
    createStatus,
    deleteStatus,
}