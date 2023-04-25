const db = require('./connection')

const getStatus = (id) =>
    db.one(`SELECT round, pot, community FROM game_status WHERE id = $1 RETURNING round, pot, community;`, id)

const updateStatus = (id, round, pot, community) =>
    db.none(`UPDATE game_status SET round = $1, pot = $2, community = $3 WHERE id = $4;`,[round, pot, community, id])

const createStatus = () =>
    db.one(`INSERT INTO game_status () VALUES () RETURNING id;`)

const deleteStatus = (id) =>
    db.none(`DELETE FROM game_status WHERE id = $1;`, id)

module.exports = {
    getStatus,
    updateStatus,
    createStatus,
    deleteStatus,
}