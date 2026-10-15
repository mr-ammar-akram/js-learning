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
    pgm.createTable('memberships', {
        id: { type: 'SERIAL', primaryKey: true },
        title: { type: 'VARCHAR(255)', notNull: true },
        description: { type: 'TEXT', notNull: false },
        plan: { type: 'INTEGER', notNull: true },
        duration: { type:'INTEGER', notNull: false },
        attachment_id: { type: 'INTEGER', notNull: false },
        created_at: { type: 'timestamptz', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamptz', default: pgm.func('current_timestamp') }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('memberships');
};
