/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('players',{
        id:{
            type: 'integer',
            primaryKey: true,
            unique: true
        },
        name:{
            type: 'string',
            notNull: true
        },
        username: {
            type: 'string',
            notNull: true,
            unique: true
        },
        password:{
            type: 'string',
            notNull: true
        }
    });
    pgm.createTable('game_table',{
        id:{
            type: 'integer',
            primaryKey: true,
            unique: true
        },
        minimum:{
            type:'decimal',
            notNull: true
        },
        maximum:{
            type:'decimal'
        },
        dealer:{
            type: 'integer',
            default:0
        }
    });
    pgm.createTable('game_status',{
        id:{
            type:'integer',
            primaryKey: true,
            unique: true
        },
        round:{
            type:'decimal',
            default: 0.1
        },
        pot:{
            type:'decimal',
            default: 0
        },
        community:{
            type:'string'
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('players')
    pgm.dropTable('game_table')
    pgm.dropTable('game_status')
};
