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
    pgm.createTable('chat_group_members', {
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

    joined_at: {
        type: "timestamptz",
        default: pgm.func("current_timestamp"),
    },

    left_at: {
        type: "timestamptz",
    },

    member_status: {
        type: "varchar(50)",
        notNull: false,
        default: "active",
    },

    created_at: {
        type: "timestamptz",
        default: pgm.func("current_timestamp"),
    },

    updated_at: {
        type: "timestamptz",
        default: pgm.func("current_timestamp"),
    },
});

pgm.addConstraint(
    "chat_group_members",
    "unique_group_member",
    "UNIQUE (group_id, user_id)"
);

pgm.addIndex("chat_group_members", ["group_id"]);
pgm.addIndex("chat_group_members", ["user_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('chat_group_members');
};
