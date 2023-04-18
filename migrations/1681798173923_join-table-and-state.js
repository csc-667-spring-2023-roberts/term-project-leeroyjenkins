/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('table_status', {
        table_id:{
            type: 'integer',
            notNull: true,
            references: 'game_table(id)',
            onDelete: 'cascade'
        },
        status_id:{
            type: 'integer',
            notNull: true,
            references: 'game_status(id)',
            onDelete: 'cascade'
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('table_status')
};
