/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.renameColumn('game_table', 'playerCount', 'count')
};

exports.down = pgm => {};
