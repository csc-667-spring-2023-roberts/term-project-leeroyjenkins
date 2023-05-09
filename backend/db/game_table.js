const db = require('./connection')

const getData = (id) =>
    db.one(`SELECT name, minimum, maximum, count, players, plimit, dealer FROM game_table WHERE id = $1;`, id)

const getAllTables = () =>
    db.any(`SELECT * FROM game_table;`)

const updateData = (id, minimum, maximum, playerCount, players) =>
    db.none(`UPDATE game_table SET minimum = $1, maximum = $2, count = $3, players = $4 WHERE id = $5;`, [minimum,maximum,playerCount,players,id])

const updatePlayers = (id, playerCount, players) =>
    db.none(`UPDATE game_table SET count = $1, players = $2 WHERE id = $3;`,[playerCount,players,id])

const createTable = (minimum, maximum, name, plimit, count, playerArray) =>
    db.one(`INSERT INTO game_table (minimum, maximum, name, plimit, count, players) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;`,[minimum,maximum,name,plimit, count, playerArray])

const deleteTable = (id) =>
    db.none(`DELETE FROM game_table WHERE id = $1;`,id)

const tableNameInUse = (name) =>
    db.any(`SELECT name FROM game_table WHERE name = $1;`, name)

const getDealerPlimit = (id) =>
    db.one(`SELECT dealer, plimit FROM game_table WHERE id = $1;`, id)

const updateDealer = (id, dealer) =>
    db.none(`UPDATE game_table SET dealer = $1 WHERE id=$2;`,[dealer,id])

module.exports = {
    getData,
    getDealerPlimit,
    updateDealer,
    getAllTables,
    updateData,
    updatePlayers,
    createTable,
    deleteTable,
    tableNameInUse,
}