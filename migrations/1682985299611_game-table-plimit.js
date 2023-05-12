/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn('game_table', {
        plimit: {type: 'integer', default: 6}
    })
}

exports.down = pgm => {};
