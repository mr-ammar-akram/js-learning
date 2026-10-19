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
    pgm.createTable('posts_comments', {
        id: 'SERIAL PRIMARY KEY',
        content: 'TEXT NOT NULL',
        user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
        post_id: 'INT REFERENCES posts(id) ON DELETE SET    ',
        parent_id: 'INT REFERENCES posts_comments(id) ON DELETE CASCADE DEFAULT NULL',
        created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('posts_comments');
};
