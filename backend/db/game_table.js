const db = require('./connection')

const getData = (id) =>
    db.one(`SELECT name, minimum, maximum, count, players, plimit FROM game_table WHERE id = $1;`, id)

const getAllTables = () =>
    db.any(`SELECT * FROM game_table;`)

const updateData = (id, minimum, maximum, playerCount, players) =>
    db.none(`UPDATE game_table SET minimum = $1, maximum = $2, count = $3, players = $4 WHERE id = $5;`, [minimum,maximum,playerCount,players,id])

const updatePlayers = (id, playerCount, players) =>
    db.none(`UPDATE game_table SET count = $1, players = $2 WHERE id = $3;`,[playerCount,players,id])

const createTable = (minimum, maximum, name, plimit) =>
    db.one(`INSERT INTO game_table (minimum, maximum, name, plimit) VALUES ($1,$2,$3,$4) RETURNING id;`,[minimum,maximum,name,plimit])

const deleteTable = (id) =>
    db.none(`DELETE FROM game_table WHERE id = $1;`,id)

const tableNameInUse = (name) =>
    db.any(`SELECT name FROM game_table WHERE name = $1;`, name)

module.exports = {
    getData,
    getAllTables,
    updateData,
    updatePlayers,
    createTable,
    deleteTable,
    tableNameInUse,
}