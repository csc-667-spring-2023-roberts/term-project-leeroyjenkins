/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('players', {hash:{type:'string'}})
    pgm.addColumns('players', {salt: {type:'string'}})
    pgm.dropColumns('players', ['password'])
};

exports.down = pgm => {
    pgm.addColumns('players', {password: {type: 'char(76)', notNull:true}})
    pgm.dropColumns('players', ['salt', 'hash'])
};
