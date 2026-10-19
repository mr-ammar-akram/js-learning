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
    pgm.createTable("group_messages", {
        id: "id",
        group_id: {
            type: "integer",
            notNull: true,
            references: '"chat_groups"',
            onDelete: "CASCADE",
        },

    user_id: {
        type: "integer",
        notNull: true,
        references: '"users"',
        onDelete: "CASCADE",
    },

    message_text: {
        type: "text",
        notNull: true,
    },

    created_at: {
        type: "timestamptz",
        default: pgm.func("current_timestamp"),
    },
});

pgm.addIndex("group_messages", ["group_id"]);
pgm.addIndex("group_messages", ["user_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('group_messages');
};  
