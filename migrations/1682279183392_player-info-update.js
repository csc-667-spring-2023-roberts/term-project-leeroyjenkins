/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('players', {email: {type: 'varchar(256)', unique: true, notNull: true}})
    pgm.dropColumns('players', ['name'])
    pgm.addColumns('players', {createdAt:{type: 'timestamp', notNull: true, default: pgm.func('current_timestamp')}})
};

exports.down = pgm => {
    pgm.addColumns('players', {name: {type: 'string', notNull: true}})
    pgm.dropColumns('players', ['email', 'createdAt'])
};
