/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        INSERT INTO game_status(id, round, pot, community) VALUES
        (0, 0.1, 0, '5D AC TH 7H 7C'),
        (1, 1.3, 80.00, 'AC TS TC 4D 9C');
    `);
};

exports.down = pgm => {};
