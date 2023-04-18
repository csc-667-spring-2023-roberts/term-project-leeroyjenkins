/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        INSERT INTO players(id,name, username, password) VALUES
        (0,'Justin','JShin','password1'),
        (1,'Bob', 'bob456', 'password2'),
        (2,'Charlie', 'charlie789', 'password3'),
        (3,'Dave', 'dave012', 'password4'),
        (4,'Eve', 'eve345', 'password5'),
        (5,'Frank', 'frank678', 'password6'),
        (6,'Grace', 'grace901', 'password7'),
        (7,'Henry', 'henry234', 'password8');
        INSERT INTO game_table(id, minimum, maximum, dealer) VALUES
        (0, 2.00, 4.00, 1),
        (1, 10.00, 100.00, 2);
    `);
};

exports.down = pgm => {};
