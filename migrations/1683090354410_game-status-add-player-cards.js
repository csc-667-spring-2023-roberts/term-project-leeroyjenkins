/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('player_table',{
        player_cards:{type: 'text[]', default: '{}'},
        player_chips:{type: 'integer[]', default: '{}'}
    })
    pgm.dropColumns('player_table', ['current_hand', 'chips'])
};

exports.down = pgm => {};
