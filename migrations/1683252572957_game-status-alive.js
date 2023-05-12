/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('game_status',{
        players_alive:{type: 'text[]', default: '{}'}
    })
};

exports.down = pgm => {};
