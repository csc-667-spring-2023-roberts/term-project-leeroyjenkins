/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn('game_table', {
        dealer: {type: 'integer', default: 0}
    })
};

exports.down = pgm => {};
