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
    pgm.createTable('otps', {
        id: { type: 'SERIAL', primaryKey: true },
        user_id: { type: 'INTEGER', notNull: true },
        otp: { type: 'VARCHAR(6)', notNull: true },
        status: { type: 'VARCHAR(50)', default: 'active' },
        expired_at: { type: 'TIMESTAMP', notNull: true },
        created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
        updated_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('otps');
};
