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
    pgm.createTable('notifications', {
        id: 'serial primary key',
        user_id: { type: 'integer', references: 'users(id)', onDelete: 'CASCADE' },
        sender_id: { type: 'integer', references: 'users(id)', onDelete: 'CASCADE' },
        type: { type: 'text', default: 'notification' },
        message: 'text not null',
        is_read: { type: 'boolean', default: false },
        post_id: { type: 'integer', references: 'posts(id)', onDelete: 'SET NULL' },
        created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
    });
    // Indexing for fast retrieval of an author's private notifications
    pgm.addIndex('notifications', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => { 
    pgm.dropTable('notifications');
};