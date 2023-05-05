/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('players', {
        wallet:{type: 'integer', default: 500}
    })
};

exports.down = pgm => {};
