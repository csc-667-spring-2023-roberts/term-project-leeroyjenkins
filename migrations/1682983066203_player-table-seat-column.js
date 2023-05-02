/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('player_table',{
        seat: {type: 'integer'}
    })
};

exports.down = pgm => {};
