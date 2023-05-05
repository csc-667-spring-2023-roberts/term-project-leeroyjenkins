/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('game_status',{
        player_cards:{type: 'text[]', default: '{}'},
        player_chips:{type: 'integer[]', default: '{}'}
    })
    pgm.dropColumns('player_table',['player_cards','player_chips'])
};

exports.down = pgm => {};
