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
    pgm.createTable('attachments', {
        id: { type: 'SERIAL', primaryKey: true },
        file_name: { type: 'VARCHAR(255)', notNull: true },
        file_type: { type: 'VARCHAR(50)', notNull: true },
        file_size: { type: 'BIGINT', notNull: true },
        file_url: { type: 'VARCHAR(255)', notNull: true },
        created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamptz', default: pgm.func('current_timestamp') }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
