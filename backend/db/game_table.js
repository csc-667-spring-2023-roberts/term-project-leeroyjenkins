const db = require('./connection')

const getData = (id) =>
    db.one(`SELECT minimum, maximum, count, players FROM game_table WHERE id = $1;`, id)

const updateData = (id, minimum, maximum, playerCount, players) =>
    db.none(`UPDATE game_table SET minimum = $1, maximum = $2, count = $3, players = $4 WHERE id = $5;`, [minimum,maximum,playerCount,players,id])

const updatePlayers = (id, playerCount, players) =>
    db.none(`UPDATE game_table SET count = $1, players = $2 WHERE id = $3;`,[playerCount,players,id])

const createTable = (minimum, maximum) =>
    db.one(`INSERT INTO game_table (minimum, maximum) VALUES ($1,$2);`,[minimum,maximum])

const deleteTable = (id) =>
    db.none(`DELETE FROM game_table WHERE id = $1;`,id)

module.exports = {
    getData,
    updateData,
    updatePlayers,
    createTable,
    deleteTable,
}