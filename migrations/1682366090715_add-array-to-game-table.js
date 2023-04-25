/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('game_table',{
        players: {type: 'text[]',default: '{}'}
    })
};

exports.down = pgm => {};
