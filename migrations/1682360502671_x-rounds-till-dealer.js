/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.dropColumns('player_table', ['rounds_till_dealer'])
};

exports.down = pgm => {};
