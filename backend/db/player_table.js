const db = require('./connection')

const joinPlayerTable = (player_id, table_id, seat) =>
    db.any(`INSERT INTO player_table (player_id, table_id, seat) VALUES ($1,$2,$3);`,[player_id, table_id, seat])

const leaveTable = (player_id, table_id) => 
    db.none(`DELETE FROM player_table WHERE player_id = $1 AND table_id = $2;`,[player_id,table_id])

const updateData = (player_id, chips, hand) =>
    db.none(`UPDATE player_table SET chips = $1, current_hand = $2 WHERE player_id = $3;`,[chips, hand, player_id])

const getData = (player_id) =>
    db.any(`SELECT chips, current_hand FROM player_table WHERE player_id = $1;`, player_id)

const checkPlayerInTable = (table_id, player_id) =>
    db.any(`SELECT * FROM player_table WHERE table_id = $1 AND player_id = $2;`,[table_id,player_id])

const getPlayersTables = (player_id) =>
    db.any(`SELECT table_id FROM player_table WHERE player_id = $1;`,player_id)

const getSeatInTable = (table_id, player_id) =>
    db.any(`SELECT seat FROM player_table WHERE table_id = $1 AND player_id = $2;`,[table_id, player_id])

const getPIDFromTableSeat = (table_id, seat) =>
    db.any(`SELECT player_id FROM player_table WHERE table_id = $1 AND seat = $2;`, [table_id, seat])

const getBigBlindID = (table_id, seat) =>
    db.one(`SELECT player_id FROM player_table WHERE table_id = $1 AND seat = $2;`, [table_id,seat])

const getAllSeats = (table_id) =>
    db.any(`SELECT seat, player_id FROM player_table WHERE table_id = $1;`,table_id)

const updateSeat = (table_id, player_id, seat) =>
    db.none(`UPDATE player_table SET seat = $1 WHERE table_id = $2 AND player_id = $3;`,[seat,table_id,player_id])

module.exports = {
    joinPlayerTable,
    getAllSeats,
    updateSeat,
    getPIDFromTableSeat,
    getBigBlindID,
    leaveTable,
    updateData,
    getData,
    checkPlayerInTable,
    getPlayersTables,
    getSeatInTable,
}