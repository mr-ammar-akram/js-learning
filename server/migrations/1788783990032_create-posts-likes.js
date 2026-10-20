/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("post_likes", {
        id: 'id',
        user_id: 'integer not null',
        post_id: 'integer',
        post_like: 'varchar(10) not null DEFAULT 0',
        comment_id: 'integer',
        like_type: 'integer not null DEFAULT 1',
        created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamptz', default: pgm.func('current_timestamp') }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */ 
export const down = (pgm) => {
    pgm.dropTable('post_likes');
};
