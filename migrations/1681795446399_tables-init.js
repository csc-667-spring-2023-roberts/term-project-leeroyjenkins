/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    //pgm.createExtension("uuid-ossp")
    pgm.createTable('players',{
        id:{
            type: 'uuid',
            primaryKey: true,
            unique: true,
            default: pgm.func("uuid_generate_v4()")
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
        hash: {
            type: 'string'
        },
        salt: {
            type: 'string'
        }
    });
    pgm.createTable('game_table',{
        id:{
            type: 'uuid',
            primaryKey: true,
            unique: true,
            default: pgm.func("uuid_generate_v4()")
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
            type: 'uuid',
            primaryKey: true,
            unique: true,
            default: pgm.func("uuid_generate_v4()")
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
