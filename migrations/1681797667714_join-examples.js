/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        INSERT INTO player_table(player_id, table_id, chips, current_hand,rounds_till_dealer) VALUES
        (0,1, 1000.00, 'AS AH', 0),
        (1,1, 500.00, 'JC 8D', 1),
        (2,1, 800.00, 'KS KC', 2),
        (3,1, 700.00, null, 3),
        (4,0, 200.00, '8C 9C', 0),
        (5,0, 150.00, null, 1),
        (6,0, 170.00, 'KH AS', 2),
        (7,0, 100.00, null, 3);
    `);
};

exports.down = pgm => {};
