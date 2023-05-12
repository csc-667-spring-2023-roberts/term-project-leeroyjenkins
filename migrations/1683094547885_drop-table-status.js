/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.dropTable('table_status')
};

exports.down = pgm => {};
