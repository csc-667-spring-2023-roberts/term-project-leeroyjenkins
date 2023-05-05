const db = require('./connection')

const createPlayer = (username, email, hash, salt) =>
    db.one(`INSERT INTO players (username, email, hash, salt) VALUES ($1, $2, $3, $4) RETURNING id`,[username, email, hash, salt])

const findByEmail = (email) =>
    db.any(`SELECT * FROM players WHERE email=$1;`,[email])

const getWallet = (id) =>
    db.one(`SELECT wallet FROM players WHERE id = $1;`, [id])

const updateWallet = (id, wallet) =>
    db.none(`UPDATE players SET wallet = $1 WHERE player_id = $2;`, [wallet, id])

module.exports = {
    createPlayer,
    findByEmail,
    getWallet,
    updateWallet,
}