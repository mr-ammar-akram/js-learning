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
    pgm.createTable('post_categories', {
        id: { type: 'SERIAL', primaryKey: true },
        cat_name: { type: 'VARCHAR(255)', notNull: true },
        cat_slug: { type: 'VARCHAR(255)', notNull: true ,  unique: true },
        description: { type: 'VARCHAR(255)', notNull: false },
        attachment_id: { type: 'VARCHAR(255)', notNull: false },
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
    pgm.dropTable('post_categories');
};
