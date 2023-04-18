/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        INSERT INTO table_status(table_id, status_id) VALUES
        (0,0),
        (1,1);
    `)
};

exports.down = pgm => {};
