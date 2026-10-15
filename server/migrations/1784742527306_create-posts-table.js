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
    pgm.createTable('posts', {
        id: { type: 'SERIAL', primaryKey: true },
        title: { type: 'VARCHAR(255)', notNull: true },
        slug: { type: 'VARCHAR(255)', notNull: true ,  unique: true },
        cat_id: { type: 'VARCHAR(255)', notNull: false },
        tag_id: { type: 'VARCHAR(255)', notNull: false },
        description: { type: 'VARCHAR(255)', notNull: false },
        attachment_id: { type: 'INTEGER', notNull: true },
        author_id: { type: 'INTEGER', notNull: true },
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
    pgm.dropTable('posts');
};
