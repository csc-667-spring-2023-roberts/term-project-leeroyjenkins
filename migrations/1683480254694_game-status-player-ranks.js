/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn('game_status',{
        player_ranks:{type: 'decimal[]', default: '{}'}
    })
};

exports.down = pgm => {};
