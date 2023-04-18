/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('player_table', {
        player_id: {
            type: 'integer',
            notNull: true,
            references: 'players(id)',
            onDelete: 'cascade'
        },
        table_id:{
            type: 'integer',
            notNull: true,
            references: 'game_table(id)',
            onDelete: 'cascade'
        },
        chips: {
            type: 'decimal',
        },
        current_hand:{
            type: 'string'
        },
        rounds_till_dealer:{
            type: 'integer'
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('player_table')
};
