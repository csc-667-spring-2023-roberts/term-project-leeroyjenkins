/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        INSERT INTO players(name, username, password) VALUES
        ('Justin','JShin','password1'),
        ('Bob', 'bob456', 'password2'),
        ('Charlie', 'charlie789', 'password3'),
        ('Dave', 'dave012', 'password4'),
        ('Eve', 'eve345', 'password5'),
        ('Frank', 'frank678', 'password6'),
        ('Grace', 'grace901', 'password7'),
        ('Henry', 'henry234', 'password8');
        INSERT INTO game_table(minimum, maximum, dealer) VALUES
        (2.00, 4.00, 1),
        (10.00, 100.00, 2);
    `);
};

exports.down = pgm => {};
