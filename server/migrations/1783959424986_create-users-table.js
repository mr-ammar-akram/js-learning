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
    pgm.createTable('users', {
        id: { type: 'SERIAL', primaryKey: true },
        user_email: { type: 'VARCHAR(255)', notNull: true, unique: true },
        user_name: { type: 'VARCHAR(255)', notNull: true, unique: true },
        full_name: { type: 'VARCHAR(255)', notNull: false },
        user_phone: { type: 'VARCHAR(15)', notNull: false },
        user_password: { type: 'VARCHAR(255)', notNull: true },
        user_role: { type: 'VARCHAR(50)', notNull: false, default: 'user' },
        attachment_id: { type: 'INTEGER', notNull: false },
        is_verified: { type: 'BOOLEAN', default: false },
        user_bio: { type: 'TEXT', notNull: false },
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
    pgm.dropTable('users');
};
