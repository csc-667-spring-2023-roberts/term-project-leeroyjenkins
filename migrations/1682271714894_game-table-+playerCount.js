/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('game_table', {playerCount: {type: 'integer', default:0}})
    pgm.dropColumns('game_table', ['dealer'])
};

exports.down = pgm => {
    pgm.dropColumns('game_table', ['playerCount'])
};
