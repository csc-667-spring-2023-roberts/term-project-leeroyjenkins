/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('game_table',{
        name: {type: 'string'}
    })
};

exports.down = pgm => {};
